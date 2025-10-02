import React, { useEffect, useState } from 'react';
import { Alert, Slide } from '@mui/material';

export default function InternetConnectionAlert() {
  const [online, setOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShow(true);
      setTimeout(() => setShow(false), 2000);
    };
    const handleOffline = () => {
      setOnline(false);
      setShow(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!show && online) return null;

  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <Alert variant="filled" severity={online ? 'success' : 'error'} sx={{ position: 'fixed', bottom: 60, py: 0, left: 0, right: 0, borderRadius: 0, zIndex: 1300 }}>
        {online ? 'Back online!' : 'No internet connection'}
      </Alert>
    </Slide>
  );
}
