import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import { inngest } from "../inngest/index.js";

// clock in /out for employee
//POST /api/attendance
export const markAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if(employee.isDeleted) return res.status(403).json({ error: "Your account is deactivated. You cant mark attendance" ,});
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await Attendance.findOne({ employee: employee._id, date: today });

        const now = new Date();
        if (!existing) {
            const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "LATE" : "PRESENT"
            });
            await inngest.send({
                name: "employee/checkout",
                data: {
                    employeeId: employee._id,
                    attendanceId: attendance._id,
                }
            });

            return res.json({ success: true, type: "checkIn", date:  attendance }); 
        } else if (!existing.checkOut) {
            const checkInTime = new Date(existing.checkIn);
            const diffMs = now.getTime() - checkInTime;
            const diffHours = diffMs / (1000 * 60 * 60);

            existing.checkOut = now;

            //computing working hours and day type
            const workingHours = parseFloat(diffHours.toFixed(2));
            let dayType = "Half Day";
            if (workingHours >= 8) {
                dayType = "Full Day";
            } else if (workingHours >= 4) {
                dayType = "Half Day";
            } else if (workingHours > 0) {
                dayType = "Short Day";
            }
            existing.workingHours = workingHours;
            existing.dayType = dayType;

            await existing.save();
            return res.json({ success: true, type: "checkOut", date: existing });
        } else {
            return res.json({ success: false, message: "You have already checked out for today" });
        }
    } catch (error) {
        console.error("Attendance Error:", error);
        return res.status(500).json({ error: "Operation failed" });
    }
}

//get attendance for employee
//GET /api/attendance
export const getAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) return res.status(404).json({ error: "Employee not found" });
    
        const limit = parseInt(req.query.limit || 30);
        const history = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 }).limit(limit);
        return res.json({ data: history ,employee:{isDeleted: employee.isDeleted}});
    } catch (error) {   
        return res.status(500).json({ error: "Error fetching attendance" });
    }
}