import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';

import Home from '../pages/Home';
import Customers from '../pages/Customers';
import Trainings from '../pages/Trainings';
import CalendarPage from '../pages/Calendar';
import Statistics from '../pages/Statistics';

const tabs = [
  { label: 'HOME', path: '/home', component: <Home /> },
  { label: 'CUSTOMERS', path: '/customers', component: <Customers /> },
  { label: 'TRAININGS', path: '/trainings', component: <Trainings /> },
  { label: 'CALENDAR', path: '/calendar', component: <CalendarPage /> },
  { label: 'STATISTICS', path: '/statistics', component: <Statistics /> },
];

export default function BasicTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavChange = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <nav className="nav-container">
        {/* Desktop Navigation */}
        <div className="nav-desktop">
          {tabs.map((tab) => (
            <a
              key={tab.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavChange(tab.path);
              }}
              className={location.pathname === tab.path ? 'active' : ''}
            >
              {tab.label}
            </a>
          ))}
        </div>
        {/* Mobile Navigation */}
        <div className="nav-mobile">
          <select
            value={location.pathname}
            onChange={(e) => handleNavChange(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.label} value={tab.path}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <Box sx={{ p: 2 }}>
        {tabs.find((tab) => tab.path === location.pathname)?.component || <Home />}
      </Box>
    </Box>
  );
}