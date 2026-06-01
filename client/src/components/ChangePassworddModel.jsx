import { useState } from 'react'
import { Lock, X, Loader2 } from 'lucide-react'

const ChangePassworddModel = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({type: "", text: ""})

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({type: "", text: ""})
        const formData = new FormData(e.currentTarget)
        const currentPassword = formData.get('currentPassword')
        const newPassword = formData.get('newPassword')
        try {
            const {data}  = await api.post('/auth/change-password', {currentPassword, newPassword})
            if(!data.success) {
                throw new Error(data.error || "Failed to change password")
                setMessage({type: "success", text: "Password changed successfully"})
                e.target.reset()
            }
        } catch (err) {
            setMessage({type: "error", text: err.message})
        } finally {
            setLoading(false)
        }
    }

    if(!open) return null

  return (
    <div onClick={onClose} className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />

        <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in' onClick={(e)=> e.stopPropagation()}>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-medium text-slate-900 flex items-center gap-2'>
                    <Lock className='w-5 h-5 text-slate-400' />
                    Change Password
                </h2>
                <button onClick={onClose} className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'>
                    <X className='w-5 h-5' />
                </button>
            </div>

            <form className='p-6 space-y-5' onSubmit={handleSubmit}>
                {message.text && (
                    <div className={`p-3 rounded-xl text-sm flex items-start gap-3 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        
                        {message.text}
                    </div>
                )}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> Current Password</label>
                    <input name="currentPassword" type="password" required className='w-full bg-slate-100 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500' />
                </div>    
                {/* new password */}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> New Password</label>
                    <input name="newPassword" type="password" required className='w-full bg-slate-100 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500' />
                </div>
                {/* cancel */}
                <div className='flex justify-end gap-3 pt-2'>
                    <button type='button' onClick={onClose} className='px-4 py-2 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors'>
                        Cancel
                    </button>
                    {/* update password */}
                    <button type='submit' disabled={loading} className='px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center gap-2'>
                        {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : "Update Password"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ChangePassworddModel