import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBug, FaUsers, FaPlus, FaTasks, FaList } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <FaBug />, label: 'Home' },
    { path: '/users', icon: <FaUsers />, label: 'Users' },
    { path: '/issues/create', icon: <FaPlus />, label: 'Create Issue' },
    { path: '/issues/assign', icon: <FaTasks />, label: 'Assign Issue' },
    { path: '/issues/status', icon: <FaTasks />, label: 'Update Status' },
    { path: '/issues', icon: <FaList />, label: 'Issue List' },
  ];

  return (
    <header className="bg-amazon-navy text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-amazon-orange text-amazon-navy font-bold text-xl px-3 py-1 rounded">
              🐞 BT
            </div>
            <span className="text-xl font-bold">BugTracker 2026</span>
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-amazon-orange text-amazon-navy font-semibold'
                        : 'hover:bg-amazon-lightnavy'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;