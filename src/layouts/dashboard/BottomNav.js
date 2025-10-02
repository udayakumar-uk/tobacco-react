
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import Iconify from '../../components/Iconify';
import InternetConnectionAlert from '../../components/InternetConnectionAlert';

export default function BottomNav() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

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
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, py: 1, zIndex: 1201 }} elevation={6}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavChange}
        >
          <BottomNavigationAction label="User Management" icon={<Iconify icon="eva:people-outline" width={30} height={30} />} />
          <BottomNavigationAction label="Barn Management" icon={<Iconify icon="eva:home-outline"  width={30} height={30} />} />
          <BottomNavigationAction label="Profile" icon={<Iconify icon="eva:person-outline"  width={30} height={30} />} />
        </BottomNavigation>
      </Paper>
    </>
  )
}
