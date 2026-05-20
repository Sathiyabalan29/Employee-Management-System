import { useEffect, useState } from "react"
import { dummyAdminDashboardData } from "../assets/assets"
import EmployeeDashboard from "../components/EmployeeDashboard"
import AdminDashboard from "../components/AdminDashboard"


const Dashboard = () => {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(dummyAdminDashboardData)
    const timerId = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [])

  if(loading) return <p className="text-center text-slate-500 py-12">Loading dashboard...</p>
  if(!data) return <p className="text-center text-slate-500 py-12">Failed to load dashboard data</p>

  if(data.role === "ADMIN") {
    return <AdminDashboard data={data} />
  }else{
    return <EmployeeDashboard data={data} />
  }
}

export default Dashboard
