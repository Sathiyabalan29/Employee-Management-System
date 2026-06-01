import { useEffect, useState } from "react";
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Loading from "../components/Loading";
import api from "../api/axios";
import useAuth from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const role = user?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get("/dashboard");
        setData(res);
      } catch (err) {
        toast.error(err.response?.data?.error || err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
