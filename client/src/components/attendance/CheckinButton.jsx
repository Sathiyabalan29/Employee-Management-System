import { useState } from 'react'
import { Loader2Icon, LogInIcon, LogOutIcon } from 'lucide-react'

const CheckinButton = ({todayRecord, onAction}) => {
    const [loading, setLoading] = useState(false)

    const handleAttendance = async () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            onAction()
        }, 1000)
    }

    if(todayRecord?.checkOut) {
        return (
            <div className='flex flex-col items-center p-8 bg-slate-50 rounded-2xl border border-slate-200'>
                <h3 className='text-lg font-bold text-slate-900'>Work Day Completed</h3>
                <p className='text-slate-500 text-sm mt-1'>Great job! See you tomorrow.</p>
            </div>
        )
    }
    const isCheckedIn = !!todayRecord?.checkIn;
    return (
        <div className='absolute bottom-4 right-4 flex flex-col z-10'>
                <button
                    onClick={handleAttendance}
                    disabled={loading}
                    className={`w-full max-w-xs flex justify-between items-center gap-4 p-4 rounded-xl bg-gradient-to-br ${isCheckedIn ? 'from-slate-700 to-slate-900' : 'from-indigo-600 to-indigo-700'} text-white`}
                >
                    {loading ? (
                        <Loader2Icon className='h-6 w-6 animate-spin' />
                    ) : isCheckedIn ? (
                        <LogOutIcon className='h-6 w-6' />
                    ) : (
                        <LogInIcon className='h-6 w-6' />
                    )}

                    <div className='text-left'>
                        <h2 className='text-lg font-medium mb-1'>{loading ? 'Processing...' : isCheckedIn ? 'Check Out' : 'Check In'}</h2>
                        <p className='text-xs opacity-90'>{isCheckedIn ? 'Click to end your shift.' : 'Start your work day.'}</p>
                    </div>
                </button>
        </div>
    )
}

export default CheckinButton