'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const mockJobs = [
  {
    id: 1,
    title: 'Wedding Photographer',
    company: 'Elite Events',
    category: 'Photography',
    location: 'Mumbai',
    payType: 'FIXED',
    payAmount: 15000,
    description: 'Looking for an experienced wedding photographer for a 2-day event.',
    status: 'OPEN',
    postedAt: '2 days ago'
  },
  {
    id: 2,
    title: 'Event Coordinator',
    company: 'Grand Celebrations',
    category: 'Event Management',
    location: 'Delhi',
    payType: 'DAILY',
    payAmount: 2500,
    description: 'Need an experienced event coordinator for corporate events.',
    status: 'OPEN',
    postedAt: '1 day ago'
  },
  {
    id: 3,
    title: 'Catering Manager',
    company: 'Royal Catering',
    category: 'Catering',
    location: 'Bangalore',
    payType: 'HOURLY',
    payAmount: 500,
    description: 'Manage catering operations for large-scale events.',
    status: 'OPEN',
    postedAt: '3 hours ago'
  }
];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const filteredJobs = mockJobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || job.category === selectedCategory) &&
      (selectedLocation === '' || job.location === selectedLocation)
    );
  });

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-xl font-bold text-indigo-600">OpSkill</Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/jobs" className="text-indigo-600 font-medium">Find Jobs</Link>
              <Link href="/talent" className="text-gray-500 hover:text-gray-900">Find Talent</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-500 hover:text-gray-900">Sign In</Link>
              <Link href="/auth/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Jobs</h1>
          
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
                <input
                  type="text"
                  placeholder="Job title or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Photography">Photography</option>
                  <option value="Catering">Catering</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Security">Security</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="font-medium">{job.company}</span>
                      <span className="mx-2">•</span>
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {job.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-indigo-600">
                          ₹{job.payAmount.toLocaleString()}
                        </span>
                        <span className="text-gray-500 ml-1">
                          {job.payType === 'HOURLY' ? '/hour' : job.payType === 'DAILY' ? '/day' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{job.postedAt}</span>
                        <Link 
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
