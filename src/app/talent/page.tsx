'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockTalent = [
  {
    id: 1,
    name: 'Priya Sharma',
    title: 'Professional Wedding Photographer',
    location: 'Mumbai',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 800,
    skills: ['Wedding Photography', 'Portrait Photography', 'Event Coverage'],
    profileImage: '/api/placeholder/150/150',
    verified: true,
    completedJobs: 89
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    title: 'Event Management Specialist',
    location: 'Delhi',
    rating: 4.8,
    reviews: 95,
    hourlyRate: 1200,
    skills: ['Corporate Events', 'Wedding Planning', 'Logistics Management'],
    profileImage: '/api/placeholder/150/150',
    verified: true,
    completedJobs: 156
  },
  {
    id: 3,
    name: 'Anita Patel',
    title: 'Catering Manager',
    location: 'Bangalore',
    rating: 4.7,
    reviews: 78,
    hourlyRate: 600,
    skills: ['Large Scale Catering', 'Menu Planning', 'Kitchen Management'],
    profileImage: '/api/placeholder/150/150',
    verified: false,
    completedJobs: 67
  }
];

export default function Talent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minRating, setMinRating] = useState('');

  const filteredTalent = mockTalent.filter(person => {
    return (
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSkill === '' || person.skills.some(skill => skill.includes(selectedSkill))) &&
      (selectedLocation === '' || person.location === selectedLocation) &&
      (minRating === '' || person.rating >= parseFloat(minRating))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-indigo-600">OpSkill</Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/jobs" className="text-gray-500 hover:text-gray-900">Find Jobs</Link>
              <Link href="/talent" className="text-indigo-600 font-medium">Find Talent</Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Talent</h1>
          
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Talent</label>
                <input
                  type="text"
                  placeholder="Name or skills"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Skills</option>
                  <option value="Photography">Photography</option>
                  <option value="Event">Event Management</option>
                  <option value="Catering">Catering</option>
                  <option value="Planning">Planning</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Talent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalent.map((person) => (
              <div key={person.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-600">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                        {person.verified && (
                          <span className="ml-2 text-blue-500" title="Verified">✓</span>
                        )}
                      </div>
                      <p className="text-gray-600">{person.title}</p>
                      <p className="text-sm text-gray-500">{person.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 font-medium">{person.rating}</span>
                      <span className="ml-1 text-gray-500">({person.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {person.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-indigo-600">₹{person.hourlyRate}/hour</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {person.completedJobs} jobs completed
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/talent/${person.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-center"
                    >
                      View Profile
                    </Link>
                    <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTalent.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No talent found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
