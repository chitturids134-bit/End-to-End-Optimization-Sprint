import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import MissionList from '../components/MissionList';

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const controller = new AbortController();
    const fetchMissions = async (currentPage) => {
      try {
        const response = await axios.get(`http://localhost:3001/api/missions?page=${currentPage}&limit=${limit}`, { signal: controller.signal });
        const data = response.data;
        setMissions(prev => (currentPage === 1 ? data.missions : [...prev, ...data.missions]));
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled');
        } else {
          console.error('Error fetching missions:', err);
          setLoading(false);
        }
      }
    };
    fetchMissions(1);
    return () => controller.abort();
  }, []);

  const handleDelete = useCallback((id) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    const controller = new AbortController();
    axios.get(`http://localhost:3001/api/missions?page=${nextPage}&limit=${limit}`, { signal: controller.signal })
      .then(res => {
        const data = res.data;
        setMissions(prev => [...prev, ...data.missions]);
        setLoading(false);
      })
      .catch(err => {
        if (!axios.isCancel(err)) console.error('Load more error', err);
        setLoading(false);
      });
  }, [page, limit]);
  const sortedMissions = useMemo(() => {
    return [...missions].sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));
  }, [missions]);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Space Mission Logs</h1>
        <p className="subtitle">Real-time telemetry and mission catalog</p>
      </header>

      {loading ? (
        <div className="loader"><div className="spinner"/></div>
      ) : (
        <>
          <MissionList missions={sortedMissions} onDelete={handleDelete} />
          {missions.length >= limit && (
            <button onClick={handleLoadMore} className="btn btn-primary">Load More</button>
          )}
        </>
      )}
    </div>
  );
};

export default MissionsPage;
