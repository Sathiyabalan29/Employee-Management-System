import { useCallback, useEffect, useState } from "react";
import { dummyAttendanceData } from "../assets/assets";
import Loading from "../components/Loading";
import CheckinButton from "../components/attendance/CheckinButton";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import api from "../api/axios";
import {} from "react-hot-toast";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted] = useState(false);

  const fetchData = useCallback(async () => {
    try{
      const res = await api.get('/attendance')
      const json = res.data;
      setHistory(json.history || [])
      if(json.employee?.isDeleted) setIsDeleted(true)
    }
    catch(err) {
      toast.error(err.response?.data?.error || err?.message )
    }
    finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if(loading) return  <Loading />
  const today = new Date()
  today.setHours(0,0,0,0)
  const todayAttendance = history.find((record) => new Date(record.date).toDateString() === today.toDateString())

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track employee attendance and manage records</p>
      </div>
      {/* Persistent debug banner to confirm rendering */}
      <div className="mb-4 p-3 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-100">
        <strong className="block">Attendance debug:</strong>
        <div className="text-sm">loading: {String(loading)}</div>
        <div className="text-sm">history.length: {history.length}</div>
        <div className="text-sm">todayAttendance exists: {todayAttendance ? 'yes' : 'no'}</div>
      </div>
      {isDeleted ? (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <p className="text-rose-600">You can no longer check it or out because your employee record have been marked as deleted.</p>
        </div>
      ) : (
        <div className="mb-8">
          <CheckinButton todayRecord={todayAttendance} onAction={fetchData}/>
        </div>
      )}
      {/* Debug info: visible when there are no records — helps diagnose blank page issues */}
      {history.length === 0 && (
        <div className="mb-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          <p className="font-medium">No attendance records loaded.</p>
          <p>History length: {history.length}</p>
          <p>Today (midnight): {today.toString()}</p>
        </div>
      )}
      <AttendanceStats history={history}/>
      <AttendanceHistory history={history}/>

    </div>
  )
}

export default Attendance
