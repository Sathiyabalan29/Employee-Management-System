import { useEffect, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { dummyEmployeeData, DEPARTMENTS } from '../assets/assets'
import EmployeeCard from '../components/EmployeeCard'
import EmployeeForm from '../components/EmployeeForm'
import api from '../api/axios'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [editEmployee, setEditEmployee] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchEmployees = async () => {
    try {
      const url = selectedDepartment ? `/employees?department=${selectedDepartment}` : '/employees'
      const { data } = await api.get(url)
      setEmployees(data)
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, [selectedDepartment])

  const filtered = employees.filter((emp)=> `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return <p className='text-center text-slate-500 py-12'>Loading employees...</p>
  }

  return (
    <div className='animate-fade-in'>
      {/* header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Employees</h1>
          <p className='page-subtitle'>Manage your team members</p>
        </div>
        <button onClick={()=>setShowCreateModal(true)} className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'>
          <Plus size={16} />
          Add Employee
        </button>
      </div>
      {/* Search bar */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        <div className='relative flex-1'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <Search className='h-4 w-4 text-slate-400' />
          </div>
          <input
            placeholder='Search employees...'
            className='h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className='h-11 max-w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((deptName) => (
            <option key={deptName} value={deptName}>{deptName}</option>
          ))}
        </select>
      </div>

      {/* employee cards */}
      {loading ?
      (
        <div className='flex justify-center p-12'>
          <div className='animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full'/>
        </div>
      ):(
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'>
            {filtered.length ===0 ? (
              <p className='col-span-full text-center py-16  text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200'>No employees found</p>
            ) : (filtered.map((emp) => <EmployeeCard key={emp.id} employee={emp} onDelete={fetchEmployees} onEdit={(e)=> setEditEmployee(e)}/>))}

          </div>
      )}

      {/* create employee modal */}
      {showCreateModal && (
        <div className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto' onClick={() => setShowCreateModal(false)}>
          <div className='fixed inset-0'/>
          <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in' onClick={(e)=> e.stopPropagation()}>
            <div className='flex items-center justify-between p-6 pb-0'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Add New Employee</h2>
                <p className='text-sm text-slate-500 mt-0.5'>Create a user account and employee profile</p>
              </div>
              <button onClick={()=>setShowCreateModal(false)} className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'>
                <X className='w-5 h-5'/>

              </button>
            </div>
            <div className='p-6'>
              <EmployeeForm onSuccess={() => { setShowCreateModal(false); fetchEmployees(); }} onCancel={() => setShowCreateModal(false)} />

            </div>
          </div>
        </div>
      )}

      {/* edit employee modal */}
      {editEmployee && (
        <div className='fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm' onClick={() => setEditEmployee(null)}>
          <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in' onClick={(e)=> e.stopPropagation()}>
            <div className='flex items-center justify-between p-6 pb-0'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Edit Employee</h2>
                <p className='text-sm text-slate-500 mt-0.5'>Update the employee details</p>
              </div>
              <button onClick={() => setEditEmployee(null)} className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'>
                <X className='w-5 h-5'/>
              </button>
            </div>
            <div className='p-6'>
              <EmployeeForm initialData={editEmployee} onSuccess={() => { setEditEmployee(null); fetchEmployees(); }} onCancel={() => setEditEmployee(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees