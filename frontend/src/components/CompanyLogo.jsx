import React, { useState } from 'react';
import { getCompanyLogoUrl, getCompanyInitial } from '../utils/companyLogos';

const CompanyLogo = ({ company, size = 'md', className = '', applyUrl }) => {
  const [failed, setFailed] = useState(false);
  const logoUrl = getCompanyLogoUrl(company, applyUrl);

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const baseClass = `${sizeClasses[size] || sizeClasses.md} rounded-xl flex items-center justify-center font-bold shrink-0 overflow-hidden ${className}`;

  if (logoUrl && !failed) {
    return (
      <div
        className={baseClass}
        style={{ backgroundColor: 'var(--bg-input)' }}
      >
        <img
          src={logoUrl}
          alt={`${company} logo`}
          className="w-[70%] h-[70%] object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} text-primary-500`}
      style={{ backgroundColor: 'rgba(167, 139, 250, 0.12)' }}
    >
      {getCompanyInitial(company)}
    </div>
  );
};

export default CompanyLogo;
