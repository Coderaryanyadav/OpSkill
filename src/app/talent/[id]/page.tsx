'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const mockTalentProfile = {
  id: 1,
  name: 'Priya Sharma',
  title: 'Professional Wedding Photographer',
  location: 'Mumbai, Maharashtra',
  rating: 4.9,
  reviews: 127,
  hourlyRate: 800,
  skills: ['Wedding Photography', 'Portrait Photography', 'Event Coverage', 'Photo Editing', 'Drone Photography'],
  profileImage: '/api/placeholder/200/200',
  verified: true,
  completedJobs: 89,
  memberSince: '2022-03-15',
  bio: 'Passionate wedding photographer with over 5 years of experience capturing beautiful moments. I specialize in candid photography and have covered over 200 weddings across India. My style focuses on natural, emotional storytelling through images.',
  experience: [
    {
      title: 'Senior Wedding Photographer',
      company: 'Elite Photography Studio',
      duration: '2022 - Present',
      description: 'Lead photographer for premium wedding events, managing teams of 3-5 photographers.'
    },
    {
      title: 'Freelance Photographer',
      company: 'Self-employed',
      duration: '2020 - 2022',
      description: 'Built client base through referrals, specialized in intimate wedding ceremonies.'
    }
  ],
  portfolio: [
    { id: 1, title: 'Royal Wedding - Udaipur', image: '/api/placeholder/300/200' },
    { id: 2, title: 'Beach Wedding - Goa', image: '/api/placeholder/300/200' },
    { id: 3, title: 'Traditional Ceremony - Mumbai', image: '/api/placeholder/300/200' }
  ],
  recentReviews: [
    {
      id: 1,
      client: 'Rahul & Sneha',
      rating: 5,
      comment: 'Priya captured our wedding beautifully. Her attention to detail and professionalism was outstanding.',
      date: '2024-12-15'
    },
    {
      id: 2,
      client: 'Amit Patel',
      rating: 5,
      comment: 'Excellent work on our corporate event. Highly recommended!',
      date: '2024-11-28'
    }
  ]
};

export default function TalentProfile() {
  const params = useParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    message: '',
    projectType: '',
    budget: '',
    timeline: ''
  });

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact message sent:', contactData);
    alert('Message sent successfully!');
    setShowContactForm(false);
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/talent" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            ← Back to Talent
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-semibold text-gray-600">
                    {mockTalentProfile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{mockTalentProfile.name}</h1>
                    {mockTalentProfile.verified && (
                      <span className="ml-3 text-blue-500 text-xl" title="Verified">✓</span>
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-2">{mockTalentProfile.title}</p>
                  <p className="text-gray-500 mb-4">{mockTalentProfile.location}</p>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="ml-1 font-semibold">{mockTalentProfile.rating}</span>
                      <span className="ml-1 text-gray-500">({mockTalentProfile.reviews} reviews)</span>
                    </div>
                    <div className="text-gray-500">
                      {mockTalentProfile.completedJobs} jobs completed
                    </div>
                    <div className="text-gray-500">
                      Member since {new Date(mockTalentProfile.memberSince).getFullYear()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      ₹{mockTalentProfile.hourlyRate}/hour
                    </span>
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{mockTalentProfile.bio}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {mockTalentProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
              <div className="space-y-4">
                {mockTalentProfile.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-indigo-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTalentProfile.portfolio.map((item) => (
                  <div key={item.id} className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <span className="text-gray-500">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">Within 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat Clients</span>
                  <span className="font-medium">75%</span>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {mockTalentProfile.recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">&ldquo;{review.comment}&rdquo;</p>
                    <p className="text-xs text-gray-500">- {review.client}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Contact {mockTalentProfile.name}</h3>
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={contactData.projectType}
                    onChange={(e) => setContactData({...contactData, projectType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select project type</option>
                    <option value="wedding">Wedding Photography</option>
                    <option value="event">Event Photography</option>
                    <option value="portrait">Portrait Session</option>
                    <option value="commercial">Commercial Photography</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range (₹)
                  </label>
                  <select
                    value={contactData.budget}
                    onChange={(e) => setContactData({...contactData, budget: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select budget range</option>
                    <option value="10000-25000">₹10,000 - ₹25,000</option>
                    <option value="25000-50000">₹25,000 - ₹50,000</option>
                    <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                    <option value="100000+">₹1,00,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={contactData.timeline}
                    onChange={(e) => setContactData({...contactData, timeline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="When do you need this completed?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your project requirements..."
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Send Message
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
