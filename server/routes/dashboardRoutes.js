import {Router} from 'express'
import {protect} from '../middleware/auth.js'
import {getDashboardData} from '../controllers/dashboardController.js'

const dashboardRouter = Router();
dashboardRouter.get('/', protect, getDashboardData);

export default dashboardRouter;