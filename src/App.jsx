import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Layout from "./pages/Layout"
import LoginLanding from "./pages/LoginLanding"
import LoginForm from "./components/LoginForm"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import Payslips from "./pages/Payslips"
import Settings from "./pages/settings"
import PrintPayslip from "./pages/PrintPayslip"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginLanding />} />

      <Route
        path="/login/admin"
        element={<LoginForm role="admin" title="Admin Portal" subtitle="Sign in to manage the organization" />}
      />
      <Route
        path="/login/employee"
        element={<LoginForm role="employee" title="Employee Portal" subtitle="Sign in to access your account" />}
      />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="payslips" element={<Payslips />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/print/payslips/:id" element={<PrintPayslip />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  )
)

const App = () => {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App