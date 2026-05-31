import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// Get employees
// get/ api/employees
export const getEmployees = async (req, res) => {
    try {
        const {department} = req.query;
        const where = {};
        if(department) where.department = department;

        const employees = (await Employee.find(where)).toSorted({createdAt: -1}).populate("userId", "email role").lean();

        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? {
                email: emp.userId.email,
                role: emp.userId.role
            } : null
        }))
        return res.json(restult);
    } catch (error) {
        return res.Employee.status(500).json({ message: "Error fetching employees"});

    }
}
 

// create employee
//post/ api/employees
export const createEmployee = async (req, res) => {
    try {
        const {firstName, lastName, email, phone, position, basicSalary, allowances, deductions, employeeStatus, joinDate, bio, department } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, role: role || "EMPLOYEE" })

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            basicSalary: Number(basicSalary) || 0,
            allowances  : Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio : bio || "",
            department: department || "Engineering"
        })
        return res.status(201).json({ error: "Employee created successfully", employee });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error("Error creating employee:", error);
        return res.status(500).json({ message: "Error creating employee" });
    }
}

// update employee
// put/ api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {firstName, lastName, email, phone, position, basicSalary, allowances, deductions,password,role, bio, department , EmploymentStatus} = req.body;
        
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await Employee.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            position,
            basicSalary: Number(basicSalary) || 0,
            allowances  : Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employmentStatus: EmploymentStatus || "ACTIVE",
            bio : bio || "",
            department: department || "Engineering" 
        })
        //update user records
        const userUpdate = {email}
        if(role) userUpdate.role = role;
        if(password) userUpdate.password = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(employee.userId, userUpdate);

        return res.status(201).json({ error: "Employee updated successfully", employee });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Error updating employee" });
    }
}

// delete employee
// delete/ api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE";
        await employee.save();
        return res.json({ Success: "True" });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting employee" });
    }
}