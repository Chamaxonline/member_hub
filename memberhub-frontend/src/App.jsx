import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FileSpreadsheet, Home, UserPlus, Users } from 'lucide-react';
import HomeMenu from './components/HomeMenu';
import MemberList from './components/MemberList';
import RegistrationForm from './components/RegistrationForm';
import MemberMonthlyRecords from './components/MemberMonthlyRecords';
import MemberRecordsPicker from './components/MemberRecordsPicker';

const navItems = [
    { to: '/', label: 'Menu', icon: Home, exact: true },
    { to: '/directory', label: 'Directory', icon: Users, match: (path) => path === '/directory' || path.startsWith('/edit/') },
    { to: '/register', label: 'Register', icon: UserPlus, match: (path) => path === '/register' },
    { to: '/records', label: 'Monthly Records', icon: FileSpreadsheet, match: (path) => path === '/records' || path.includes('/records') }
];

const Navigation = () => {
    const location = useLocation();

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.to;
        if (item.match) return item.match(location.pathname);
        return location.pathname === item.to;
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-mark">
                    <Users size={18} color="white" />
                </span>
                <span className="title-gradient">MemberHub</span>
            </Link>
            <div className="navbar-links">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`nav-link ${isActive(item) ? 'active' : ''}`}
                        >
                            <span className="nav-link-content">
                                <Icon size={16} />
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <div className="app-shell">
                <div className="app-grid-bg" aria-hidden="true" />
                <Navigation />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<HomeMenu />} />
                        <Route path="/directory" element={<MemberList />} />
                        <Route path="/register" element={<RegistrationForm />} />
                        <Route path="/edit/:id" element={<RegistrationForm />} />
                        <Route path="/records" element={<MemberRecordsPicker />} />
                        <Route path="/members/:id/records" element={<MemberMonthlyRecords />} />
                    </Routes>
                </main>
                <footer className="app-footer">
                    MemberHub &mdash; Member registration &amp; monthly records management
                </footer>
            </div>
        </Router>
    );
}

export default App;
