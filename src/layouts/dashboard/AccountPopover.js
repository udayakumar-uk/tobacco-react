import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Backdrop, CircularProgress, Button  } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import Iconify from '../../components/Iconify';

import { useAuth } from '../../context/AuthContext';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-outline',
    linkTo: '/profile',
  },
  // {
  //   label: 'Settings',
  //   icon: 'eva:settings-2-outline',
  //   linkTo: '#',
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ setLoad }) {
  const anchorRef = useRef(null);

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      setLoad(true);
      const data = await logout();

      console.log("Logout status:", data);


      if (data.status === 1) {
        navigate('/login');
      }

    } catch (error) {
        console.error("Logout error:", error);

        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    }
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={`https://avatar.iran.liara.run/public/boy?username=${user.userId}`} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap sx={{ textTransform: "capitalize" }}>
            {user && user.userDetails.officerName ? user.userDetails.officerName : 'Loading...'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user && user.userDetails.email ? user.userDetails.email : ''}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              <Iconify icon={option.icon} sx={{ mr: 1}} width={20} height={20} /> {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1, color: 'error.dark', '&:hover': {
            backgroundColor: 'error.lighter',
          }, }}>
          <Iconify icon="eva:log-out-outline" sx={{ mr: 1}} width={20} height={20} /> Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
