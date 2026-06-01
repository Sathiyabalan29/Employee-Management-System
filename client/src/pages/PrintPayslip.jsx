import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { format } from 'date-fns'
import Loading from '../components/Loading'
import api from '../api/axios'
import { toast } from 'react-hot-toast'

const PrintPayslip = () => {
	const { id } = useParams();
	const [payslip, setPayslip] = useState(null)
	const [loading, setLoading] = useState(true)

	const getPeriodDate = (year, month) => {
		const yearNumber = Number(year)
		const monthNumber = Number(month)

		if (Number.isFinite(yearNumber) && Number.isFinite(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
			return new Date(yearNumber, monthNumber - 1, 1)
		}

		const parsed = new Date(`${month} 1, ${year}`)
		return Number.isNaN(parsed.getTime()) ? null : parsed
	}

	useEffect(() => {
		api.get(`/payslips/${id}`).then(({data}) => {
			setPayslip(data.data || data)
		}).catch((err) => {
			toast.error(err.response?.data?.error || err?.message || "Failed to fetch payslip data")
		}).finally(() => {
			setLoading(false)
		})
	}, [id])



	if (loading) return <Loading />
	if (!payslip) return <p className='text-center text-slate-500 py-12'>Payslip not found</p>

	return (
		<>
			<style>{`
				@media print {
					@page { size: A4; margin: 20mm; }
					/* hide everything except .print-area */
					body * { visibility: hidden; }
					.print-area, .print-area * { visibility: visible; }
					.print-area { position: absolute; left: 0; top: 0; width: 100%; }
					/* hide elements marked .no-print */
					.no-print { display: none !important; }
				}
			`}</style>
			<div className='max-w-2xl mx-auto p-8 bg-white animate-fade-in print-area'>
			<div className='text-center border-b border-slate-200 pb-6 mb-8'>
				<h1 className='text-2xl font-bold text-slate-900 tracking-tight'>PAYSLIP</h1>
				<p>
					{(() => {
						const periodDate = getPeriodDate(payslip.year, payslip.month)
						return periodDate ? format(periodDate, "MMM yyyy") : `${payslip.month} ${payslip.year}`
					})()}
				</p>
			</div>
		
			<div className='grid grid-cols-2 gap-6 mb-8'>
				<div>
					<p className='text-sm text-slate-500'>Employee Name</p>
					<p className='font-medium text-slate-900'>{payslip.employee?.firstName} {payslip.employee?.lastName}</p>
				</div>
				<div>
					<p className='text-sm text-slate-500'>Position</p>
					<p className='font-medium text-slate-900'>{payslip.employee?.position}</p>
				</div>
				
				<div>
					<p className='text-sm text-slate-500'>Email</p>
					<p className='font-medium text-slate-900'>{payslip.employee?.email}</p>
				</div>
				
				<div>
					<p className='text-sm text-slate-500'>Pay Period</p>
					<p className='font-medium text-slate-900'>
						{(() => {
							const periodDate = getPeriodDate(payslip.year, payslip.month)
							return periodDate ? format(periodDate, "MMMM yyyy") : `${payslip.month} ${payslip.year}`
						})()}
					</p>
				</div>
			</div>
			<div className='rounded-xl border border-slate-200 overflow-hidden mb-8'>
				<table className='w-full text-sm'>
					<thead>
						<tr className='bg-slate-100'>
							<th className='py-3 px-4 text-sm font-medium text-slate-500'>Description</th>
							<th className='py-3 px-4 text-sm font-medium text-slate-500'>Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr className='border-b border-slate-200'>
							<td className='py-3 px-4 text-sm text-slate-900'>Basic Salary</td>
							<td className='py-3 px-4 text-sm text-slate-900'>${(payslip.basicSalary ?? 0).toLocaleString()}</td>
						</tr>
						<tr className='border-b border-slate-200'>
							<td className='py-3 px-4 text-sm text-slate-900'>Allowance</td>
							<td className='py-3 px-4 text-sm text-slate-900'>${(payslip.allowances ?? 0).toLocaleString()}</td>
						</tr>
						<tr className='border-b border-slate-200'>
							<td className='py-3 px-4 text-sm text-slate-900'>Deduction</td>
							<td className='py-3 px-4 text-sm text-slate-900'>-${(payslip.deductions ?? 0).toLocaleString()}</td>
						</tr>
						<tr>
							<td className='py-3 px-4 text-sm font-medium text-slate-900'>Net Salary</td>
							<td className='py-3 px-4 text-sm font-medium text-slate-900'>${(payslip.netSalary ?? 0).toLocaleString()}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='text-center'>
				<button onClick={() => window.print()} className='btn-primary no-print'>
					Print Payslip
				</button>
			</div>
		</div>
		</>
	)
}

export default PrintPayslip
