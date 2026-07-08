import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About</h1>
        
        <section className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Digital Notice Board</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            A modern platform for sharing important announcements and notices in real-time.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Keep your community informed with an easy-to-use, efficient notice board solution.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Post and manage notices effortlessly</li>
            <li>✓ Real-time updates and notifications</li>
            <li>✓ Simple and intuitive interface</li>
            <li>✓ Organize notices by category</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
