import React from 'react';

export const TransactionSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="skeleton h-16 rounded-lg"></div>
    ))}
  </div>
);

export const LoanCardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="skeleton h-48 rounded-lg"></div>
    ))}
  </div>
);