import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="w-full p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
