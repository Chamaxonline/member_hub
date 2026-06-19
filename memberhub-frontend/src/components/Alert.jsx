import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const Alert = ({ type = 'error', children }) => {
    const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

    return (
        <div className={`alert alert-${type}`} role="alert">
            <Icon size={18} className="alert-icon" />
            <p>{children}</p>
        </div>
    );
};

export default Alert;
