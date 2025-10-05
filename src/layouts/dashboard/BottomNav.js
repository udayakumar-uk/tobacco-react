
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import Iconify from '../../components/Iconify';
import InternetConnectionAlert from '../../components/InternetConnectionAlert';

import { useAuth } from '../../context/AuthContext';

export default function BottomNav({setLoad}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const { logout, user } = useAuth();

  // Sync tab with route
  useEffect(() => {
    if (location.pathname.startsWith('/user')) {
      setValue(0);
    } else if (location.pathname.startsWith('/barn')) {
      setValue(1);
    } else if (location.pathname.startsWith('/profile')) {
      setValue(2);
    }
  }, [location.pathname]);

  const handleNavChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/user');
    } else if (newValue === 1) {
      navigate('/barn');
    } else if (newValue === 2) {
      navigate('/profile');
    } 
  };


  return (
    <>
      <InternetConnectionAlert />
      <Paper sx={{borderTop: `1px solid ${theme.palette.divider}`, borderRadius: 0, position: 'fixed', bottom: 0, left: 0, right: 0, py: 1, zIndex: 1201 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavChange}
        >
          {user?.userDetails?.role === 'ADMIN' && <BottomNavigationAction label="User Management" icon={<Iconify icon="eva:people-outline" width={30} height={30} />} />}
          <BottomNavigationAction label="Barn Management" icon={<Iconify icon="eva:home-outline"  width={30} height={30} />} />
          <BottomNavigationAction label="Profile" icon={<Iconify icon="eva:person-outline"  width={30} height={30} />} />
          <BottomNavigationAction onClick={()=> {
            logout()
            setLoad(true)
            }} label="Logout" icon={<Iconify icon="eva:log-out-outline"  width={30} height={30} />} />
        </BottomNavigation>
      </Paper>
    </>
  )
}
