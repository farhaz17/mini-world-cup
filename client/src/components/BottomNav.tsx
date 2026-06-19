import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/',        label: 'Home',    icon: '🏠' },
  { path: '/league',  label: 'League',  icon: '🏆' },
  { path: '/fantasy', label: 'Fantasy', icon: '⚽' },
  { path: '/players', label: 'Players', icon: '🎴' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-[#EEEFF2] shadow-lg z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5 relative"
            >
              {isActive && (
                <div
                  className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-b-full"
                  style={{ background: 'linear-gradient(90deg, #00E676, #76FF03)' }}
                />
              )}
              <span className="text-lg">{tab.icon}</span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-dark' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
