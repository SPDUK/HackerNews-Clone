import React from 'react';

export default function Skeleton() {
  return (
    <div className="skeleton ph3 pv1 background-gray">
      {new Array(parseInt(window.innerHeight / 45)).fill().map((_, idx) => (
        <div key={idx} className="skeleton-container">
          <div style={{ maxWidth: Math.random() * 100 * 5 }} className="skeleton-title" />
          <div style={{ maxWidth: Math.random() * 100 * 5 }} className="skeleton-info" />
        </div>
      ))}
    </div>
  );
}
