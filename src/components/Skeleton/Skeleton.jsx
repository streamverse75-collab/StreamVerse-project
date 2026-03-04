import React from 'react'
import './Skeleton.css'

const Skeleton = ({ count = 8 }) => {
  return (
    <div className="skeleton-row">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img shimmer"></div>
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-subtitle shimmer"></div>
        </div>
      ))}
    </div>
  )
}

export default Skeleton