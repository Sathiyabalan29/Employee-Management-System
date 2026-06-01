import { useState } from 'react'
import { CalendarDays, FileText, X } from 'lucide-react'
import api from '../../api/axios'
import { toast } from 'react-hot-toast'

const ApplyLeaveModal = ({open, onClose, onSuccess}) => {
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries()) 
        try {
            await api.post('/leaves', data)
            onSuccess();
            onClose()
        } catch (err) {
            toast.error(err.response?.data?.error || err?.message)
        } finally {
            setLoading(false)
        }
  }
  if(!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm' onClick={onClose}>
        <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in' onClick={(e)=> e.stopPropagation()}>
            {/* Header */}
            <div className='flex items-center justify-between p-6 pb-0'>
                <div>
                    <h2 className='text-lg font-semibold btext-slate-800'>
                        Apply for Leave
                    </h2>
                    <p className='text-sm text-slate-400 mt-0.5'>
                        Submit a leave request for approval
                    </p>
                </div>
                <button onClick={onClose} className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'>
                    <X className='w-5 h-5'/>
                </button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                {/* leave type */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-2'>
                        <FileText className='w-4 h-4 text-slate-400' /> Leave Type
                    </label>
                    <select required className='form-select' name='type'>
                        <option value="">Select leave type</option>
                        <option value="SICK_LEAVE">Sick Leave</option>
                        <option value="CASUAL_LEAVE">Casual Leave</option>
                        <option value="ANNUAL_LEAVE">Annual Leave</option>
                    </select>
                </div>
                {/* duration */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-2'>
                        <CalendarDays className='w-4 h-4 text-slate-400' /> Duration
                    </label>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <span></span>
                            <input type="date" name='startDate' min={minDate} required className='form-input' />
                        </div>
                        <div>
                            <span></span>
                            <input type="date" name='endDate' min={minDate} required className='form-input' />
                        </div>
                    </div>
                </div>
                {/* Reason */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-2'>
                        <FileText className='w-4 h-4 text-slate-400' /> Reason
                    </label>
                    <textarea name='reason' required className='form-textarea' rows={3} placeholder='Enter reason for leave...' />
                </div>

                {/* buttons */}
                <div className='flex items-center justify-end gap-3 pt-4'>
                    <button type='button' onClick={onClose} className='px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors'>
                        Cancel
                    </button>
                    <button type='submit' disabled={loading} className='px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors'>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ApplyLeaveModal