import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Grid,
  List,
  Plus,
  Users,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useGetCustomersQuery } from "../services/crmApi";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomersResponse {
  success: boolean;
  message: string;
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

const CustomersBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: customersResponse,
    isLoading: customersLoading,
    error: customersError,
  } = useGetCustomersQuery({
    limit: 100,
    page: 1,
  });

  const customers = customersResponse?.data || [];
  console.log("🚀 ~ CustomersBoard ~ customers:", customers);

  const filteredCustomers = customers.filter(
    (customer: Customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = customers.length;

  if (customersLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (customersError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Failed to load customers
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            There was an error loading the customers. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600 mt-1">
            Manage and track all your customers in one place
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/customers/new"
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Customer
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Total Customers Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="text-right">
                <p className="text-xs font-medium text-slate-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalCustomers}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              All registered customers
            </p>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="text-right">
                <p className="text-xs font-medium text-slate-600">
                  Recent Additions
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">Last 5 new customers</p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg shadow">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="text-right">
                <p className="text-xs font-medium text-slate-600">Actions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalCustomers}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">Total customer records</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer: Customer) => (
            <div
              key={customer._id}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {customer.name}
              </h3>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Created {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCustomers.map((customer: Customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {customer.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{customer.email}</p>
                      <p className="text-sm text-slate-500">{customer.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 truncate max-w-xs">
                        {customer.address}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && !customersLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No customers found
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            {searchTerm
              ? `No customers match "${searchTerm}". Try adjusting your search terms.`
              : "No customers found. Create your first customer to get started."}
          </p>
          <Link
            to="/customers/new"
            className="mt-4 inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Customer
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomersBoard;
