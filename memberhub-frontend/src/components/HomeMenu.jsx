import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FileSpreadsheet, LayoutGrid, UserPlus, Users } from 'lucide-react';

const menuItems = [
    {
        title: 'Member Directory',
        description: 'Browse, search, and manage all registered members in one place.',
        to: '/directory',
        icon: Users,
        tone: 'primary'
    },
    {
        title: 'Register Member',
        description: 'Add a new member with registration number, contact, and address details.',
        to: '/register',
        icon: UserPlus,
        tone: 'secondary'
    },
    {
        title: 'Monthly Records',
        description: 'Track monthly fees, signatures, and payment dates for each member.',
        to: '/records',
        icon: FileSpreadsheet,
        tone: 'success'
    }
];

const HomeMenu = () => {
    return (
        <div className="animate-fade-in">
            <section className="menu-hero">
                <span className="menu-hero-badge">
                    <LayoutGrid size={14} />
                    Organization Portal
                </span>
                <h1 className="title-gradient">Welcome to MemberHub</h1>
                <p>
                    A professional workspace for member registration, directory management,
                    and monthly record keeping.
                </p>
            </section>

            <div className="menu-grid">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.to} to={item.to} className="menu-card glass-panel">
                            <div className={`menu-card-icon ${item.tone}`}>
                                <Icon size={26} />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <span className="menu-card-action">
                                Open Form
                                <ArrowRight size={16} />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default HomeMenu;
