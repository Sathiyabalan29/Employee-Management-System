import "dotenv/config";
import connectDB from './config/db.js';
import User from './models/User.js';
import Employee from './models/Employee.js';
import Attendance from './models/Attendance.js';
import LeaveApplication from './models/LeaveApplication.js';
import Payslip from './models/Payslip.js';
import bcrypt from 'bcrypt';
import { DEPARTMENTS } from './constants/departments.js';

const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

const SAMPLE_EMPLOYEE_EMAIL = "employee@example.com";
const SAMPLE_EMPLOYEE_PASSWORD = "employee123";

const now = new Date();
const today = new Date();
today.setHours(0, 0, 0, 0);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const printAdminSummary = (email) => {
    console.log("Admin user created successfully.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD}`);
    console.log("Please change the password after first login.");
};

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

        if (!process.env.ADMIN_EMAIL) {
            console.warn(`ADMIN_EMAIL is not set. Falling back to ${DEFAULT_ADMIN_EMAIL}`);
        }
        if (!process.env.ADMIN_PASSWORD) {
            console.warn(`ADMIN_PASSWORD is not set. Falling back to ${DEFAULT_ADMIN_PASSWORD}`);
        }
        await connectDB();

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log("Admin user already exists.");
            console.log(`Email: ${existingAdmin.email}`);
            console.log(`Password: ${ADMIN_PASSWORD}`);
            console.log("Please change the password after first login if needed.");
            return;
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const admin = await User.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "ADMIN"
        });

        printAdminSummary(admin.email);

        const employeePasswordHash = await bcrypt.hash(SAMPLE_EMPLOYEE_PASSWORD, 10);
        let employeeUser = await User.findOne({ email: SAMPLE_EMPLOYEE_EMAIL });

        if (!employeeUser) {
            employeeUser = await User.create({
                email: SAMPLE_EMPLOYEE_EMAIL,
                password: employeePasswordHash,
                role: "EMPLOYEE"
            });
            console.log("Sample employee user created successfully.");
            console.log(`Email: ${employeeUser.email}`);
            console.log(`Password: ${SAMPLE_EMPLOYEE_PASSWORD}`);
        }

        let employee = await Employee.findOne({ userId: employeeUser._id });
        if (!employee) {
            employee = await Employee.create({
                userId: employeeUser._id,
                firstName: "Sample",
                lastName: "Employee",
                email: SAMPLE_EMPLOYEE_EMAIL,
                phone: "9999999999",
                position: "Developer",
                basicSalary: 50000,
                allowances: 5000,
                deductions: 1000,
                employeeStatus: "ACTIVE",
                joinDate: now,
                bio: "Seeded sample employee account.",
                department: DEPARTMENTS[0]
            });
        }

        const attendanceExists = await Attendance.findOne({ employeeId: employee._id, date: today });
        if (!attendanceExists) {
            await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
                checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30, 0),
                status: "PRESENT",
                workingHours: 8.5,
                dayType: "FULL_DAY"
            });
        }

        const leaveExists = await LeaveApplication.findOne({ employeeId: employee._id, startDate: tomorrow });
        if (!leaveExists) {
            await LeaveApplication.create({
                employeeId: employee._id,
                type: "CASUAL_LEAVE",
                startDate: tomorrow,
                endDate: tomorrow,
                reason: "Seeded sample leave request",
                status: "PENDING"
            });
        }

        const payslipExists = await Payslip.findOne({ employeeId: employee._id, month: "May", year: now.getFullYear() });
        if (!payslipExists) {
            const basicSalary = employee.basicSalary;
            const allowances = employee.allowances;
            const deductions = employee.deductions;
            await Payslip.create({
                employeeId: employee._id,
                month: "May",
                year: now.getFullYear(),
                basicSalary,
                allowances,
                deductions,
                netSalary: basicSalary + allowances - deductions
            });
        }

    } catch (error) {
        console.error("Error occurred while registering admin:", error);
        process.exitCode = 1;
    }
}

registerAdmin();