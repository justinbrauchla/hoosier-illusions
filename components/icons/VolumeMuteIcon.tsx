
import React from 'react';

export const VolumeMuteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5L6 9H2v6h4l5 4V5zm10.59 4.59L16 15M16 9.41l5.59 5.59"
    />
  </svg>
);
