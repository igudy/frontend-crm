import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Briefcase, Users, Plus, ChevronRight } from "lucide-react";

const Layout: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: "Jobs Board", href: "/", icon: Briefcase },
    { name: "Customers", href: "/customers/new", icon: Users },
  ];

  const getPageTitle = () => {
    if (location.pathname === "/") return "Jobs Board";
    if (location.pathname.startsWith("/jobs/")) return "Job Details";
    if (location.pathname === "/customers/new") return "Customers";
    if (location.pathname === "/jobs/new") return "Create Job";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200">
        <div className="flex items-center h-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h1 className="text-xl font-bold text-white">Brik CRM</h1>
        </div>

        <nav className="mt-8 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {item.name}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <header className="bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold text-slate-900">
                {getPageTitle()}
              </h2>
              <div className="w-1 h-1 rounded-full bg-slate-400"></div>
              <span className="text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex space-x-3">
              <Link
                to="/customers/new"
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 hover:shadow-md transition-all duration-200 hover:border-slate-400"
              >
                <Users className="w-4 h-4 mr-2" />
                New Customer
              </Link>
              <Link
                to="/jobs/new"
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Job
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
