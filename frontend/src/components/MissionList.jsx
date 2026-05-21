import React, { useMemo } from 'react';
import MissionCard from './MissionCard';

const MissionList = ({ missions, onDelete, searchTerm = '' }) => {
  const filteredMissions = useMemo(() => {
    console.log('--- Filtering and sorting missions (memoized) ---');
    return missions
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));
  }, [missions, searchTerm]);

  return (
    <div className="list-wrapper">
      <div className="search-area">
        {/* Search input could be added here */}
      </div>
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Nodes</span>
          <span className="stat-value">{filteredMissions.length}</span>
        </div>
      </div>
      <div className="mission-grid">
        {filteredMissions.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onDelete={onDelete}
            style={{ marginBottom: '0' }}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionList;
