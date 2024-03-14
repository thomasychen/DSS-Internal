import React from 'react';
import './Loading.css'; // This will be your CSS file for animations

export default function LogoLoading() {
  return (
    <div className="logo-loading-container">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Hollow circles with a stroke */}
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="150" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="150" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="150" cy="150" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        
        {/* Static grey lines */}
        <path d="M50,50 L150,50" stroke="#ddd" strokeWidth="4" fill="none" />
        <path d="M150,50 L100,100" stroke="#ddd" strokeWidth="4" fill="none" />
        <path d="M100,100 L50,150" stroke="#ddd" strokeWidth="4" fill="none" />
        <path d="M100,100 L150,150" stroke="#ddd" strokeWidth="4" fill="none" />

        {/* Teal highlight paths with animation */}
        <path d="M50,50 L150,50" stroke="teal" strokeWidth="4" fill="none" className="teal-path-animation" />
        <path d="M150,50 L100,100" stroke="teal" strokeWidth="4" fill="none" className="teal-path-animation" />
        <path d="M100,100 L50,150" stroke="teal" strokeWidth="4" fill="none" className="teal-path-animation" />
        <path d="M100,100 L150,150" stroke="teal" strokeWidth="4" fill="none" className="teal-path-animation" />
      </svg>
    </div>
  );
};