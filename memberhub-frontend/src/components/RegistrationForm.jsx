import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMember, getMember, updateMember } from '../api';
import { Save, X } from 'lucide-react';

const RegistrationForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        registrationNumber: '',
        registrationDate: new Date().toISOString().split('T')[0],
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchMember();
        }
    }, [id]);

    const fetchMember = async () => {
        try {
            setLoading(true);
            const response = await getMember(id);
            const member = response.data;
            setFormData({
                firstName: member.firstName,
                lastName: member.lastName,
                registrationNumber: member.registrationNumber || '',
                registrationDate: new Date(member.registrationDate).toISOString().split('T')[0],
                address: member.address || ''
            });
        } catch (err) {
            console.error("Failed to fetch member:", err);
            setError("Could not load member details.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                ...formData,
                registrationNumber: parseInt(formData.registrationNumber, 10),
                registrationDate: new Date(formData.registrationDate).toISOString()
            };

            if (isEditMode) {
                payload.id = parseInt(id, 10);
                await updateMember(id, payload);
                setSuccess('Member updated successfully!');
            } else {
                await createMember(payload);
                setSuccess('Member registered successfully!');
            }

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            console.error("Submit error:", err);
            setError('Failed to save member. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode && !formData.firstName) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="title-gradient" style={{ marginBottom: '0.5rem' }}>
                {isEditMode ? 'Edit Member' : 'Member Registration'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                {isEditMode ? 'Update the details for this member.' : 'Enter details to register a new member in the system.'}
            </p>

            {error && (
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', borderColor: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                    <p style={{ color: 'var(--danger)', margin: 0 }}>{error}</p>
                </div>
            )}

            {success && (
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', borderColor: 'var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <p style={{ color: 'var(--success)', margin: 0 }}>{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="form-input"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="form-input"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="registrationNumber">Registration Number</label>
                        <input
                            type="number"
                            id="registrationNumber"
                            name="registrationNumber"
                            className="form-input"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="registrationDate">Registration Date</label>
                        <input
                            type="date"
                            id="registrationDate"
                            name="registrationDate"
                            className="form-input"
                            value={formData.registrationDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        className="form-input"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        style={{ resize: 'vertical' }}
                    ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                        <X size={18} /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={18} />
                        {loading ? 'Saving...' : (isEditMode ? 'Update Member' : 'Register Member')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
