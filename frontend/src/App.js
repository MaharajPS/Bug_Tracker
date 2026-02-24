import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage'; // MY
import CreateIssuePage from './pages/CreateIssuePage'; // KS
import AssignIssuePage from './pages/AssignIssuePage'; // RS
import UpdateStatusPage from './pages/UpdateStatusPage'; // PK
import IssueListPage from './pages/IssueListPage'; // VJ

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-amazon-offwhite">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} /> {/* MY */}
            <Route path="/issues/create" element={<CreateIssuePage />} /> {/* KS */}
            <Route path="/issues/assign" element={<AssignIssuePage />} /> {/* RS */}
            <Route path="/issues/status" element={<UpdateStatusPage />} /> {/* PK */}
            <Route path="/issues" element={<IssueListPage />} /> {/* VJ */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;