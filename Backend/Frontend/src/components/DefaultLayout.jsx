import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, Users, FileText, Calendar, LogOut } from 'lucide-react';

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      });
  };

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
      });
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, text: 'Dashboard', link: '/dashboard' },
    { icon: Users, text: 'Commissions', link: '/commissions' },
    { icon: Calendar, text: 'Meetings', link: '/meetings' },
    { icon: FileText, text: 'PV', link: '/pv' },
    { icon: FileText, text: 'Chat', link: '/chat' }
  ];

  // Only add the admin-dashboard for admin users
  if (user?.role === 'admin') {
    menuItems.unshift({ icon: LayoutDashboard, text: 'Admin Dashboard', link: '/admin-dashboard' });
    menuItems.unshift({ icon: LayoutDashboard, text: 'Users', link: '/users' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-800">
          {/* Dynamically set the title */}
          <span className="text-xl font-bold text-white">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
          </span>
          <button
            className="lg:hidden text-white hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className="flex items-center px-4 py-3 text-gray-100 hover:bg-indigo-600 rounded-lg transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.text}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />

          {/* Notification */}
          {notification && (
            <div className="notification">
              {notification}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
