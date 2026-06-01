import { Inngest } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import sendEmail from "../config/nodemailer.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "Employee-Management-Project" });

//auto checkout for employees
const autoCheckout = inngest.createFunction(
    { id: "auto-checkout", triggers:[{ event: "employee/auto-checkout" }] },
    async ({ event, step }) => {
    const {employeeId, attendanceId} = event.data;
    
    //wait for 9 hours 
        await step.sleep("wait-9-hours", new Date().getTime() + 9 * 60 * 60 * 1000);

    //get attendance data
    let attendance = await Attendance.findById(attendanceId);

    if(!attendance?.checkOut){
        //get employee data
        const employee = await Employee.findById(employeeId);

        //send remainder email
        await sendEmail({
            to: employee.email,
            subject: "Auto Check-out Reminder",
            body: `<div style="max-width:600px";">
                   <h2>Hi ${employee.firstName},</h2>
                   <p stype="font-size:16px;">"You have a check-in ${emplpyee.department} today:"</p>
                   <p style="font-size:18px; font-weight:bold; color:#007bff; margin:8px 0;">${attendance?.checkIn?.toLocaleTimeString()}</p>
                   <p style="font-size:16px;">"Please make sure to check-out in one hour."</p>
                   <p style="font-size:16px;">"If you have any questions, please contact your admin."</p>
                   <br />
                   <p style="font-size:16px;">Best Regards,</p>
                     <p style="font-size:16px;">EMS</p>
                     </div>`
        });

        //after 10 hours, mark attendance as checked out with status "LATE"
                await step.sleepUntil("wait-for-1-hour", new Date(new Date().getTime() + 1 * 60 * 60 * 1000));

        attendance = await Attendance.findById(attendanceId);
        if(!attendance?.checkOut){
                        attendance.checkOut = new Date(new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000);
            attendance.workingHours = 4;
            attendance.dayType = "Half Day";
            attendance.status = "LATE";
            await attendance.save();
        }
    }

  },
);


//send email to admin if admin doesnt take action on leave applicatin witin 24 hours
const leaveApplicationReminder = inngest.createFunction(
    { id: "leave-application-reminder", triggers: [{ event: "leave/pending" }] },
    async ({ event, step }) => {
        const { leaveApplicationId } = event.data;

        //wait for 24 hours
        await step.sleepUntil("wait-24-hours", new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

        const leaveApplication = await LeaveApplication.findById(leaveApplicationId);

        if (leaveApplication?.status === "PENDING") {
            const employee = await Employee.findById(leaveApplication.employeeId);

            //send reminder email to admin with employee and leave application details
            await sendEmail({
                to: process.env.ADMIN_EMAIL,
                subject: "Leave Application Pending Reminder",
                body: `<div style="max-width:600px";">
                   <h2>Hi Admin,</h2>
                   <p stype="font-size:16px;">"You have a leave application from ${employee.firstName} ${employee.lastName} in ${employee.department} department that is pending for more than 24 hours."</p>
                     <p style="font-size:16px;">"Please take action on this leave application as soon as possible."</p>
                        <br />
                        <p style="font-size:16px;">Best Regards,</p>
                        <p style="font-size:16px;">EMS</p>
                     </div>`
            });
        }
    }
);

//cron: check attendance at 11.30 and emai absent employees
const attendanceReminderCron = inngest.createFunction(
    { id: "attendance-reminder-cron", triggers: [{ cron: "TZ=Asia/Colombo 30 11 * * *" }] }, // 6.00 am
    async ({ step }) => {
        // step1 : get today's date range
        const today = await step.run("get-todays-date", () => {
            const startUTC = new Date();
            startUTC.setHours(0, 0, 0, 0);
            const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
            return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() };
        });

        //step2 : get all active employees
        const activeEmployees = await step.run("get-active-employees", async () => {
            const employees = await Employee.find({ isDeleted: false, employeeStatus: "ACTIVE" }).lean();
            return employees.map((e) => ({
                ...e,
                id: e._id.toString(),
                firstName: e.firstName,
                lastName: e.lastName,
                email: e.email,
                department: e.department,
            }));
        });

        // step3: get employees ids on approved leave today
        const onLeaveIds = await step.run("get-on-leave-ids", async () => {
            const leaves = await LeaveApplication.find({
                status: "APPROVED",
                startDate: { $lte: new Date(today.endUTC) },
                endDate: { $gte: new Date(today.startUTC) },
            }).lean();
            return leaves.map((l) => l.employeeId.toString());
        });

        //step4: get employees who have checked in today
        const checkedInIds = await step.run("get-checked-in-ids", async () => {
            const attendances = await Attendance.find({
                date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC) },
            }).lean();
            return attendances.map((a) => a.employeeId.toString());
        });

        //step5: filter absent employees (not on leave and not checked in)
        const absentEmployees = activeEmployees.filter((emp) => !onLeaveIds.includes(emp.id) && !checkedInIds.includes(emp.id));

        //step6: send reminder emails
        if (absentEmployees.length > 0) {
            await step.run("send-reminder-emails", async () => {
                const emailPromises = absentEmployees.map((emp) => {
                    //send email to emp.email
                    sendEmail({
                        to: emp.email,
                        subject: "Attendance Reminder - Please Mark your attendance",
                        body: `<div style="max-width:600px";">
                   <h2>Hi ${emp.firstName},</h2>
                   <p stype="font-size:16px;">"Our records show that you haven't marked your attendance today."</p>
                     <p style="font-size:16px;">"The deadline to mark attendance is 11:30 AM. Please check in as soon as possible or contact your admin if you're facing any issues."</p>
                        <br />
                        <p style="font-size:14px; color:#666;">Department: ${emp.department}</p>
                        <br />
                        <p style="font-size:16px;">Best Regards,</p>
                        <p style="font-size:16px;"><strong>QuickEMS</strong></p>
                     </div>`
                    });


                });
                return Promise.all(emailPromises);
            });
        }
        await Promise.all(emailPromises);
        return { totalActive: activeEmployees.length, onLeave: onLeaveIds.length, checkedIn: checkedInIds.length, absent: absentEmployees.length };
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [autoCheckout, leaveApplicationReminder,attendanceReminderCron];