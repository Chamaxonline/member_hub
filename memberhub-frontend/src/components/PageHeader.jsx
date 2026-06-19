import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ eyebrow, title, subtitle, icon: Icon, action, backTo, backLabel = 'Back' }) => {
    return (
        <header className="page-header">
            {backTo && (
                <Link to={backTo} className="btn btn-ghost btn-sm page-back-link">
                    <ArrowLeft size={16} />
                    {backLabel}
                </Link>
            )}
            <div className="page-header-main">
                <div className="page-header-text">
                    {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}
                    <div className="page-title-row">
                        {Icon && (
                            <span className="page-title-icon">
                                <Icon size={24} />
                            </span>
                        )}
                        <h1 className="page-title">{title}</h1>
                    </div>
                    {subtitle && <p className="page-subtitle">{subtitle}</p>}
                </div>
                {action && <div className="page-header-action">{action}</div>}
            </div>
        </header>
    );
};

export default PageHeader;
