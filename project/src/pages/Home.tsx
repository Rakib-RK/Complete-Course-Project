import React from 'react';
import { Sparkles, PenTool } from 'lucide-react';

function Home() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <PenTool className="h-8 w-8 text-primary-500" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Formify
          </h1>
        </div>
        
        <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300">
          {getGreeting()}, form creator! 👋
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Create professional forms that elevate your data collection. Transform your ideas into elegant, 
          efficient forms with our intuitive platform.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Sparkles className="h-6 w-6 text-primary-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Professional & Elegant</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Design forms that reflect your professional standards with our sophisticated tools.
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <PenTool className="h-6 w-6 text-primary-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Intuitive Design</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create complex forms effortlessly with our streamlined drag & drop interface.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <a
            href="/create"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors duration-200"
          >
            Start Creating
            <span className="ml-2">→</span>
          </a>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Professional form creation platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;