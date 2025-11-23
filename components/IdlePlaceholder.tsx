import React from 'react';

const IdlePlaceholder: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center overflow-hidden relative animate-fade-in animated-gradient-bg">
      <div className="z-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-200 tracking-widest uppercase animate-pulse-glow">
          Hoosier Illusions
        </h2>
        <p className="mt-4 text-gray-400 font-sans">
          Enter a trigger phrase below to begin.
        </p>
      </div>
    </div>
  );
};

export default IdlePlaceholder;
