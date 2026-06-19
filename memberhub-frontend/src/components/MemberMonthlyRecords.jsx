import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileSpreadsheet, Save } from 'lucide-react';
import { getMember, getMemberMonthlyRecords, saveMemberMonthlyRecords } from '../api';
import DateInput from './DateInput';
import PageHeader from './PageHeader';
import Alert from './Alert';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DEFAULT_FEE = '50';

const createEmptyMonths = () =>
    MONTH_NAMES.map((_, index) => ({
        month: index + 1,
        fee: DEFAULT_FEE,
        signature: '',
        paymentDate: ''
    }));

const toIsoDate = (value) => {
    if (!value) return '';
    return value.split('T')[0];
};

const MemberMonthlyRecords = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);

    const [member, setMember] = useState(null);
    const [year, setYear] = useState(currentYear);
    const [months, setMonths] = useState(createEmptyMonths());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadMember();
    }, [id]);

    useEffect(() => {
        if (member) {
            loadRecords();
        }
    }, [member, year]);

    const loadMember = async () => {
        try {
            setLoading(true);
            const response = await getMember(id);
            setMember(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to load member:', err);
            setError('Could not load member details.');
        } finally {
            setLoading(false);
        }
    };

    const loadRecords = async () => {
        try {
            setLoading(true);
            const response = await getMemberMonthlyRecords(id, year);
            const records = response.data.months || [];

            setMonths(MONTH_NAMES.map((_, index) => {
                const monthNumber = index + 1;
                const record = records.find((item) => item.month === monthNumber);
                return {
                    month: monthNumber,
                    fee: record?.fee != null ? String(record.fee) : DEFAULT_FEE,
                    signature: record?.signature || '',
                    paymentDate: toIsoDate(record?.paymentDate)
                };
            }));
            setError('');
        } catch (err) {
            console.error('Failed to load monthly records:', err);
            setError('Could not load monthly records.');
        } finally {
            setLoading(false);
        }
    };

    const updateMonthField = (monthIndex, field, value) => {
        setMonths((prev) => prev.map((item, index) =>
            index === monthIndex ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const hasInvalidDate = months.some((item) => {
            if (!item.paymentDate) return false;
            const [yearPart, monthPart, dayPart] = item.paymentDate.split('-').map(Number);
            const date = new Date(yearPart, monthPart - 1, dayPart);
            return date.getFullYear() !== yearPart || date.getMonth() !== monthPart - 1 || date.getDate() !== dayPart;
        });

        if (hasInvalidDate) {
            setError('Please fix invalid dates before saving.');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                year,
                months: months.map((item) => ({
                    month: item.month,
                    fee: item.fee === '' ? null : Number(item.fee),
                    signature: item.signature.trim() || null,
                    paymentDate: item.paymentDate ? new Date(item.paymentDate).toISOString() : null
                }))
            };

            await saveMemberMonthlyRecords(id, payload);
            setSuccess('Monthly records saved successfully.');
            await loadRecords();
        } catch (err) {
            console.error('Failed to save monthly records:', err);
            setError('Failed to save monthly records. Please check your inputs.');
        } finally {
            setSaving(false);
        }
    };

    if (loading && !member) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error && !member) {
        return (
            <div className="animate-fade-in">
                <Alert type="error">{error}</Alert>
                <button className="btn btn-primary" onClick={() => navigate('/records')}>
                    Back to Records
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                eyebrow="Monthly Records"
                title={`${member.firstName} ${member.lastName}`}
                subtitle={`Registration #${member.registrationNumber} · Track fees, signatures, and payment dates`}
                icon={FileSpreadsheet}
                backTo="/records"
                backLabel="Back to Member Selection"
                action={
                    <div className="year-selector">
                        <label className="form-label" htmlFor="year">Year</label>
                        <select
                            id="year"
                            className="form-input year-select"
                            value={year}
                            onChange={(event) => setYear(Number(event.target.value))}
                        >
                            {yearOptions.map((optionYear) => (
                                <option key={optionYear} value={optionYear}>{optionYear}</option>
                            ))}
                        </select>
                    </div>
                }
            />

            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            <form onSubmit={handleSubmit} className="glass-panel monthly-records-form panel-static">
                <div className="table-container monthly-records-table-wrap">
                    <table className="premium-table monthly-records-table">
                        <thead>
                            <tr>
                                <th className="monthly-row-label"></th>
                                {MONTH_NAMES.map((monthName) => (
                                    <th key={monthName}>{monthName}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="monthly-row-label">Fee</th>
                                {months.map((item, index) => (
                                    <td key={`fee-${item.month}`}>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="form-input monthly-cell-input"
                                            value={item.fee}
                                            onChange={(event) => updateMonthField(index, 'fee', event.target.value)}
                                            placeholder="50"
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th className="monthly-row-label">Signature</th>
                                {months.map((item, index) => (
                                    <td key={`signature-${item.month}`}>
                                        <input
                                            type="text"
                                            className="form-input monthly-cell-input"
                                            value={item.signature}
                                            onChange={(event) => updateMonthField(index, 'signature', event.target.value)}
                                            placeholder="Signature"
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th className="monthly-row-label">Date</th>
                                {months.map((item, index) => (
                                    <td key={`date-${item.month}`}>
                                        <DateInput
                                            id={`payment-date-${item.month}`}
                                            value={item.paymentDate}
                                            onChange={(value) => updateMonthField(index, 'paymentDate', value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving || loading}>
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Records'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MemberMonthlyRecords;
