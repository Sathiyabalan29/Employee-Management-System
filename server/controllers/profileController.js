import Employee from "../models/Employee.js";

//get profile
//GET /api/profile
export const getProfile = async (req, res) => {
    try {
        const session = req.session;    
        const employee = await Employee.findOne({userID: session.userID});     
        if (!employee) {
            return res.json({
            firstName: "ADMIN",
            lastName: "",
            email: session.email,

            })}
        return res.json(employee);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching profile" });
    }
}
//update profile
//PUT /api/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userID: session.userID});
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if(employee.isDeleted){
            return res.status(404).json({ error: "Your account is deactivated. You cant update your profile" });
        }
        await Employee.findByIdAndUpdate(employee._id, {
            bio: req.body.bio 
        })
        return res.json({success:true});
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile" });
    }
}