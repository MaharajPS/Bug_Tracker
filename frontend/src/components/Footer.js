import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-amazon-navy text-amazon-lightgray py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <span className="px-3 py-1 bg-amazon-orange text-amazon-navy rounded font-medium">KIOT 2026</span>
          <span className="px-3 py-1 bg-amazon-darkorange text-white rounded">Hackathon Project</span>
        </div>
        <p className="text-sm">
          Team: Maharaj (TL) | Mythili | Kishore | Rajasabari | Priyanka | Vaijayanthi
        </p>
        <p className="text-xs mt-2 text-amazon-gray">
          Backend: Spring Boot | Frontend: React + Tailwind CSS | Database: H2
        </p>
      </div>
    </footer>
  );
};

export default Footer;