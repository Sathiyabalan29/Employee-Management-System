import {Router} from 'express';
import {protect} from '../middleware/auth.js';
import{ markAttendance, getAttendance } from '../controllers/attendanceController.js';

const attendanceRouter = Router();
attendanceRouter.post("/", protect, markAttendance);
attendanceRouter.get("/", protect, getAttendance);

export default attendanceRouter;