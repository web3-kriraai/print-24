import React from 'react';
import BackButton from '../components/BackButton';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <BackButton fallbackPath="/" label="Back to Home" className="text-cream-600 hover:text-cream-900" />
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-cream-100">
          <h1 className="font-serif text-3xl font-bold text-cream-900 mb-6 text-center">Contact Us</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cream-700 mb-1">Name</label>
              <input type="text" className="w-full p-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent outline-none" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream-700 mb-1">Email</label>
              <input type="email" className="w-full p-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent outline-none" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream-700 mb-1">Message</label>
              <textarea rows={4} className="w-full p-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent outline-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full bg-cream-900 text-cream-50 py-3 rounded-lg font-bold hover:bg-cream-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;