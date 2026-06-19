import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMembers } from '../api';
import { Edit2, FileSpreadsheet, Search, UserPlus, Users, X } from 'lucide-react';
import PageHeader from './PageHeader';
import Alert from './Alert';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchMembers(page, searchQuery);
    }, [page, searchQuery]);

    const fetchMembers = async (currentPage, query) => {
        try {
            setLoading(true);
            const response = await getMembers(currentPage, pageSize, query);
            setMembers(response.data.items);
            setTotalCount(response.data.totalCount);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch members:", err);
            setError('Failed to load members. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page * pageSize < totalCount) setPage(page + 1);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setPage(1);
    };

    const isSearching = searchQuery.trim().length > 0;
    const showEmptyDirectory = !isSearching && members.length === 0;
    const showNoResults = isSearching && members.length === 0;

    if (loading && members.length === 0 && !error) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error && members.length === 0 && !isSearching) {
        return (
            <div className="animate-fade-in">
                <Alert type="error">{error}</Alert>
                <button className="btn btn-primary" onClick={() => fetchMembers(page, searchQuery)}>Retry</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                eyebrow="Members"
                title="Member Directory"
                subtitle="Search, view, and manage your organization's registered members."
                icon={Users}
                action={
                    <Link to="/register" className="btn btn-primary">
                        <UserPlus size={18} />
                        Add Member
                    </Link>
                }
            />

            <div className="search-bar glass-panel panel-static">
                <Search size={18} color="var(--text-muted)" />
                <input
                    type="text"
                    className="form-input search-input"
                    placeholder="Search by name, reg #, mobile, date, or address..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm search-clear-btn"
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {error && <Alert type="error">{error}</Alert>}

            {showEmptyDirectory ? (
                <div className="glass-panel panel-static empty-state">
                    <div className="empty-state-icon">
                        <Users size={28} />
                    </div>
                    <h3>No members yet</h3>
                    <p>Your directory is empty. Register the first member to get started.</p>
                    <Link to="/register" className="btn btn-primary">Register First Member</Link>
                </div>
            ) : showNoResults ? (
                <div className="glass-panel panel-static empty-state">
                    <div className="empty-state-icon">
                        <Search size={28} />
                    </div>
                    <h3>No matching members</h3>
                    <p>No results for &ldquo;{searchQuery}&rdquo;. Try a different search term.</p>
                    <button className="btn btn-secondary" onClick={handleClearSearch}>Clear search</button>
                </div>
            ) : (
                <>
                    <div className={`glass-panel table-panel panel-static ${loading ? 'is-loading' : ''}`}>
                        <div className="table-container">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Reg #</th>
                                        <th>Name</th>
                                        <th>Mobile</th>
                                        <th>Registration Date</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map(member => (
                                        <tr key={member.id}>
                                            <td><span className="badge">#{member.registrationNumber}</span></td>
                                            <td className="cell-name">{member.firstName} {member.lastName}</td>
                                            <td>{member.mobileNumber || '—'}</td>
                                            <td>{new Date(member.registrationDate).toLocaleDateString()}</td>
                                            <td>{member.address || '—'}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <Link to={`/members/${member.id}/records`} className="btn btn-secondary btn-sm">
                                                        <FileSpreadsheet size={14} /> Records
                                                    </Link>
                                                    <Link to={`/edit/${member.id}`} className="btn btn-secondary btn-sm">
                                                        <Edit2 size={14} /> Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pagination-bar">
                        <div className="pagination-info">
                            {totalCount === 0
                                ? 'No members to display'
                                : `Showing ${((page - 1) * pageSize) + 1} to ${Math.min(page * pageSize, totalCount)} of ${totalCount} members`}
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={handlePreviousPage}
                                disabled={page === 1 || loading}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={handleNextPage}
                                disabled={page * pageSize >= totalCount || loading}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MemberList;
