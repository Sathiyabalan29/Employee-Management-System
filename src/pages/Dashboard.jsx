import { useEffect, useState } from "react";
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Loading from "../components/Loading";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("ADMIN"); // or "EMPLOYEE"

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (role === "ADMIN") {
        setData(dummyAdminDashboardData);
      } else {
        setData(dummyEmployeeDashboardData);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [role]);

  if (loading) return <Loading />;
  if (!data) return <p className="text-center text-slate-500 py-12">Failed to load dashboard data</p>;

  return (
    <div>
      {role === "ADMIN" ? (
        <AdminDashboard data={data} />
      ) : (
        <EmployeeDashboard data={data} />
      )}
    </div>
  );
};

export default Dashboard;
