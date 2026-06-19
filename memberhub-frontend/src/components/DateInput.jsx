import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';

const formatDisplayDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return '';
    return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
};

const parseDisplayDate = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
        const month = parseInt(slashMatch[1], 10);
        const day = parseInt(slashMatch[2], 10);
        const year = parseInt(slashMatch[3], 10);
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const [year, month, day] = trimmed.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
            return trimmed;
        }
        return null;
    }

    return null;
};

const DateInput = ({ value, onChange, id }) => {
    const pickerRef = useRef(null);
    const [textValue, setTextValue] = useState(formatDisplayDate(value));
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        setTextValue(formatDisplayDate(value));
        setInvalid(false);
    }, [value]);

    const handleTextChange = (event) => {
        const nextValue = event.target.value;
        setTextValue(nextValue);

        if (!nextValue.trim()) {
            setInvalid(false);
            onChange('');
            return;
        }

        const parsed = parseDisplayDate(nextValue);
        if (parsed) {
            setInvalid(false);
            onChange(parsed);
        } else {
            setInvalid(true);
        }
    };

    const handleTextBlur = () => {
        if (!textValue.trim()) {
            setInvalid(false);
            return;
        }

        const parsed = parseDisplayDate(textValue);
        if (parsed) {
            setTextValue(formatDisplayDate(parsed));
            setInvalid(false);
            onChange(parsed);
        } else {
            setInvalid(true);
        }
    };

    const handlePickerChange = (event) => {
        const isoDate = event.target.value;
        setTextValue(formatDisplayDate(isoDate));
        setInvalid(false);
        onChange(isoDate);
    };

    const openPicker = () => {
        if (pickerRef.current?.showPicker) {
            pickerRef.current.showPicker();
        } else {
            pickerRef.current?.focus();
            pickerRef.current?.click();
        }
    };

    return (
        <div className="date-input-group">
            <input
                type="text"
                id={id}
                className={`form-input monthly-cell-input ${invalid ? 'input-invalid' : ''}`}
                value={textValue}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                placeholder="M/D/YYYY"
                aria-invalid={invalid}
            />
            <input
                type="date"
                ref={pickerRef}
                className="date-picker-native"
                value={value || ''}
                onChange={handlePickerChange}
                tabIndex={-1}
                aria-hidden="true"
            />
            <button
                type="button"
                className="date-picker-btn"
                onClick={openPicker}
                aria-label="Open calendar"
            >
                <Calendar size={14} />
            </button>
        </div>
    );
};

export default DateInput;
