import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMember, getMember, updateMember } from '../api';
import { Save, UserPlus, X } from 'lucide-react';
import PageHeader from './PageHeader';
import Alert from './Alert';

const RegistrationForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        registrationNumber: '',
        registrationDate: new Date().toISOString().split('T')[0],
        address: '',
        mobileNumber: ''
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
                address: member.address || '',
                mobileNumber: member.mobileNumber || ''
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
        setFormData(prev => ({ ...prev, [name]: value }));
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

            setTimeout(() => navigate('/directory'), 1000);
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
        <div className="animate-fade-in form-page">
            <PageHeader
                eyebrow={isEditMode ? 'Edit' : 'Registration'}
                title={isEditMode ? 'Edit Member' : 'Member Registration'}
                subtitle={isEditMode
                    ? 'Update registration details for this member.'
                    : 'Enter member information to add them to the directory.'}
                icon={UserPlus}
                backTo={isEditMode ? '/directory' : '/'}
                backLabel={isEditMode ? 'Back to Directory' : 'Back to Menu'}
            />

            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            <form onSubmit={handleSubmit} className="glass-panel panel-static">
                <div className="form-grid-2">
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

                <div className="form-grid-2">
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
                    <label className="form-label" htmlFor="mobileNumber">Mobile Number (Optional)</label>
                    <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        className="form-input"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="07XXXXXXXX"
                    />
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
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(isEditMode ? '/directory' : '/')}>
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
