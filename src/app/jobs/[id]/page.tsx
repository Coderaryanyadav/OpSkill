'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const mockJob = {
  id: 1,
  title: 'Wedding Photographer',
  company: 'Elite Events',
  category: 'Photography',
  location: 'Mumbai',
  payType: 'FIXED',
  payAmount: 15000,
  description: 'Looking for an experienced wedding photographer for a 2-day event. Must have professional equipment and portfolio.',
  requirements: [
    'Minimum 3 years of wedding photography experience',
    'Professional camera equipment (DSLR/Mirrorless)',
    'Portfolio of previous wedding work',
    'Available for 2 consecutive days',
    'Own transportation preferred'
  ],
  startDate: '2025-02-15',
  endDate: '2025-02-16',
  status: 'OPEN',
  postedAt: '2 days ago',
  applicants: 12
};

export default function JobDetail() {
  const params = useParams();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedRate: '',
    availability: ''
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Application submitted:', applicationData);
    alert('Application submitted successfully!');
    setShowApplicationForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-indigo-600">OpSkill</Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/jobs" className="text-indigo-600 font-medium">Find Jobs</Link>
              <Link href="/talent" className="text-gray-500 hover:text-gray-900">Find Talent</Link>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/jobs" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            ← Back to Jobs
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockJob.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="font-medium text-lg">{mockJob.company}</span>
                  <span className="mx-2">•</span>
                  <span>{mockJob.location}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {mockJob.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{mockJob.payAmount.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {mockJob.status}
                  </span>
                  <span className="text-gray-500">{mockJob.applicants} applicants</span>
                </div>
              </div>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                  <p className="text-gray-700 leading-relaxed">{mockJob.description}</p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {mockJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Start Date</span>
                      <p className="text-gray-900">{new Date(mockJob.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">End Date</span>
                      <p className="text-gray-900">{new Date(mockJob.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Payment Type</span>
                      <p className="text-gray-900">{mockJob.payType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Posted</span>
                      <p className="text-gray-900">{mockJob.postedAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Apply for {mockJob.title}</h3>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    rows={4}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us why you're perfect for this job..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={applicationData.expectedRate}
                    onChange={(e) => setApplicationData({...applicationData, expectedRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your expected rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <input
                    type="text"
                    value={applicationData.availability}
                    onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="When can you start?"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
