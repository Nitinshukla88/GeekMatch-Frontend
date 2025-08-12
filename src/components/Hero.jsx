import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8">
      <div className="animate-fade-in max-w-4xl mx-auto">
        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8">
          <span className="text-purple-gradient">
            Introducing GeekMatch
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-10 sm:mb-12 text-gray-80 font-medium">
          For developers From developers
        </p>
        
        {/* Static Get Started Button */}
        <Button 
          className="border-2 border-purple text-purple hover:bg-purple hover:text-white bg-transparent text-xl sm:text-2xl py-4 px-10 sm:px-12 rounded-lg transition-all duration-200"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Hero;