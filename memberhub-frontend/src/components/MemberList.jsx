import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMembers } from '../api';
import { Edit2, Users } from 'lucide-react';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await getMembers();
            setMembers(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch members:", err);
            setError('Failed to load members. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', borderColor: 'var(--danger)' }}>
                <p style={{ color: 'var(--danger)' }}>{error}</p>
                <button className="btn btn-primary" onClick={fetchMembers} style={{ marginTop: '1rem' }}>Retry</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Member Directory</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your organization's members</p>
                </div>
                <Link to="/register" className="btn btn-primary">
                    <Users size={18} />
                    Add Member
                </Link>
            </div>

            {members.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Users size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <h3>No members found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>It looks like your directory is empty.</p>
                    <Link to="/register" className="btn btn-primary">Register First Member</Link>
                </div>
            ) : (
                <div className="table-container glass-panel" style={{ padding: '0' }}>
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
                                    <td>#{member.registrationNumber}</td>
                                    <td style={{ fontWeight: '500' }}>{member.firstName} {member.lastName}</td>
                                    <td>{member.mobileNumber || '-'}</td>
                                    <td>{new Date(member.registrationDate).toLocaleDateString()}</td>
                                    <td>{member.address}</td>
                                    <td>
                                        <div className="action-btns">
                                            <Link to={`/edit/${member.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                <Edit2 size={14} /> Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MemberList;
