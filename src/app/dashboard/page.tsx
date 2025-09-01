'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockUser = {
  name: 'John Doe',
  role: 'COMPANY', // or 'TALENT'
  email: 'john@example.com'
};

const mockApplications = [
  {
    id: 1,
    jobTitle: 'Wedding Photographer',
    applicantName: 'Priya Sharma',
    status: 'PENDING',
    appliedDate: '2024-12-20',
    expectedRate: 15000
  },
  {
    id: 2,
    jobTitle: 'Event Coordinator',
    applicantName: 'Rajesh Kumar',
    status: 'ACCEPTED',
    appliedDate: '2024-12-18',
    expectedRate: 25000
  }
];

const mockContracts = [
  {
    id: 1,
    title: 'Wedding Photography - Elite Events',
    freelancer: 'Priya Sharma',
    status: 'ACTIVE',
    startDate: '2024-12-25',
    endDate: '2024-12-26',
    amount: 15000
  },
  {
    id: 2,
    title: 'Corporate Event Management',
    freelancer: 'Rajesh Kumar',
    status: 'COMPLETED',
    startDate: '2024-12-15',
    endDate: '2024-12-16',
    amount: 25000
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-indigo-600">OpSkill</Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/jobs" className="text-gray-500 hover:text-gray-900">Find Jobs</Link>
              <Link href="/talent" className="text-gray-500 hover:text-gray-900">Find Talent</Link>
              <Link href="/dashboard" className="text-indigo-600 font-medium">Dashboard</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {mockUser.name}</span>
              <button className="text-gray-500 hover:text-gray-900">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {mockUser.role === 'COMPANY' ? 'Manage your job postings and applications' : 'Track your applications and contracts'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {mockUser.role === 'COMPANY' ? 'Applications' : 'My Applications'}
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contracts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Contracts
              </button>
              {mockUser.role === 'COMPANY' && (
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'jobs'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Jobs
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-900">Active Contracts</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">
                      {mockContracts.filter(c => c.status === 'ACTIVE').length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900">Completed Jobs</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {mockContracts.filter(c => c.status === 'COMPLETED').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900">Pending Applications</h3>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {mockApplications.filter(a => a.status === 'PENDING').length}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">New application for Wedding Photographer</span>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Contract completed: Corporate Event Management</span>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Payment received: ₹25,000</span>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mockUser.role === 'COMPANY' ? 'Job Applications' : 'My Applications'}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{application.jobTitle}</h4>
                          <p className="text-gray-600">
                            {mockUser.role === 'COMPANY' ? `Applicant: ${application.applicantName}` : 'Your application'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            Expected Rate: ₹{application.expectedRate.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          {mockUser.role === 'COMPANY' && application.status === 'PENDING' && (
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                Accept
                              </button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contracts Tab */}
            {activeTab === 'contracts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Contracts</h3>
                </div>
                
                <div className="space-y-4">
                  {mockContracts.map((contract) => (
                    <div key={contract.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{contract.title}</h4>
                          <p className="text-gray-600">
                            {mockUser.role === 'COMPANY' ? `Freelancer: ${contract.freelancer}` : 'Your contract'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            Amount: ₹{contract.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </span>
                          <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jobs Tab (Company only) */}
            {activeTab === 'jobs' && mockUser.role === 'COMPANY' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">My Job Postings</h3>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Post New Job
                  </button>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500">No job postings yet.</p>
                  <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Create Your First Job Posting
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
