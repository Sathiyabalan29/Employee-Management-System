const LoginLeftSide = () => {
  return (
    <div className="relative flex min-h-screen w-1/2 overflow-hidden border-r border-slate-200 bg-slate-950 md:w-1/2">
      <div className="absolute -left-24 top-[-5rem] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute bottom-[-4rem] right-[-2rem] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 flex w-full flex-col justify-center p-12 lg:p-20">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300/90">
          Workforce control
        </p>
        <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-white lg:text-5xl">
          Employee <br /> Management System
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-slate-300">
          Streamline your workforce operations, track attendance, manage
          payroll, and empower your team securely.
        </p>
      </div>
    </div>
  )
}

export default LoginLeftSide
