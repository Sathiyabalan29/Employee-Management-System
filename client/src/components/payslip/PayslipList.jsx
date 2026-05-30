import { format } from 'date-fns'
import { Download } from 'lucide-react'

const PayslipList = ({ payslips = [], isAdmin }) => {
    const safePayslips = Array.isArray(payslips) ? payslips : []

  return (
    <div className='card overflow-hidden'>
        <div className='overflow-x-auto'>
            <table className='table-modern'>
                <thead>
                    <tr>
                        {isAdmin && <th className='px-6 py-4'>Employee</th>}
                        <th className='px-6 py-4'>Period</th>
                        <th className='px-6 py-4'>Basic Salary</th>
                        <th className='px-6 py-4'>Net Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {safePayslips.length === 0 ? (
                        <tr>
                            <td colSpan={isAdmin ? 5 : 4} className='text-center py-12 text-slate-400'>No payslips found</td>
                        </tr>
                    ) : (
                        safePayslips.map((payslip) => (
                            <tr key={payslip.id || payslip._id}>
                                {isAdmin && <td className='text-slate-500'>{payslip.employee?.firstName} {payslip.employee?.lastName}</td>}
                                <td className='text-slate-500'>{format(new Date(payslip.year, payslip.month - 1), 'MMM yyyy')}</td>
                                <td className='text-slate-500'>${payslip.basicSalary.toLocaleString()}</td>
                                <td className='text-slate-800'>${payslip.netSalary.toLocaleString()}</td>
                                <td className='text-center'>
                                    <button onClick={() => window.open(`/print/payslips/${payslip.id || payslip._id}`)} className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10'>
                                        <Download className='w-3.5 h-3 mr-1.5' />Download
                                    </button>
                                </td>
                                

                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default PayslipList