import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Search, UserPlus } from 'lucide-react';
import { getMembers } from '../api';
import PageHeader from './PageHeader';
import Alert from './Alert';

const MemberRecordsPicker = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(searchInput), 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchMembers();
    }, [searchQuery]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await getMembers(1, 100, searchQuery);
            setMembers(response.data.items);
            setError('');
        } catch (err) {
            console.error('Failed to fetch members:', err);
            setError('Failed to load members. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <PageHeader
                eyebrow="Monthly Records"
                title="Select Member"
                subtitle="Choose a member to open their monthly fee, signature, and payment date form."
                icon={FileSpreadsheet}
                backTo="/"
                backLabel="Back to Menu"
            />

            <div className="search-bar glass-panel panel-static">
                <Search size={18} color="var(--text-muted)" />
                <input
                    type="text"
                    className="form-input search-input"
                    placeholder="Search by name, reg #, or mobile..."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                />
            </div>

            {error && <Alert type="error">{error}</Alert>}

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : members.length === 0 ? (
                <div className="glass-panel panel-static empty-state">
                    <div className="empty-state-icon">
                        <FileSpreadsheet size={28} />
                    </div>
                    <h3>No members found</h3>
                    <p>Register a member first, then return here to add monthly records.</p>
                    <Link to="/register" className="btn btn-primary">
                        <UserPlus size={18} />
                        Register Member
                    </Link>
                </div>
            ) : (
                <div className="picker-list">
                    {members.map((member) => (
                        <button
                            key={member.id}
                            type="button"
                            className="picker-item glass-panel panel-static"
                            onClick={() => navigate(`/members/${member.id}/records`)}
                        >
                            <div>
                                <div className="picker-item-name">
                                    {member.firstName} {member.lastName}
                                </div>
                                <div className="picker-item-meta">
                                    Reg #{member.registrationNumber}
                                    {member.mobileNumber ? ` · ${member.mobileNumber}` : ''}
                                </div>
                            </div>
                            <span className="btn btn-secondary btn-sm">
                                <FileSpreadsheet size={14} /> Open Records
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MemberRecordsPicker;
