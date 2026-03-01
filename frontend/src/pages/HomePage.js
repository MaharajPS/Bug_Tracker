import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaPlus, FaTasks, FaList, FaChartLine } from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: <FaUsers size={40} />,
      title: "User Management",
      desc: "Create and manage users with roles (Admin, Developer, Tester)",
      link: "/users",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <FaPlus size={40} />,
      title: "Create Issues",
      desc: "Log new bugs/issues with priority and description",
      link: "/issues/create",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <FaTasks size={40} />,
      title: "Assign & Update",
      desc: "Assign issues to developers and track status changes",
      link: "/issues/assign",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <FaList size={40} />,
      title: "Issue Dashboard",
      desc: "View filtered issues by status, assignee, or creator",
      link: "/issues",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Status Workflow",
      desc: "Enforce issue lifecycle: OPEN → IN_PROGRESS → RESOLVED → CLOSED",
      link: "/issues/status",
      color: "bg-red-100 text-red-800"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amazon-navy mb-4">
          Welcome to <span className="text-amazon-orange">BugTracker</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          KIOT 2026 Hackathon Project - A robust issue tracking system with strict business rules and role-based workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <Link 
            key={index} 
            to={feature.link}
            className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
          >
            <div className={`p-6 ${feature.color}`}>
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
              <p className="text-center text-gray-700">{feature.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
