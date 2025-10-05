import PropTypes from 'prop-types';
// material
import { useLocation } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';

import { useAuth } from '../../context/AuthContext';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 65;
const APPBAR_DESKTOP = 60;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: theme.palette.common.white,
  // [theme.breakpoints.up('lg')]: {
  //   width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  // },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar, setLoad }) {

  const { user } = useAuth();
  const location = useLocation();

  // Only show NotificationsPopover on /barn edit page
  const showNotifications = location.pathname.startsWith('/barn/edit');

  return (
    <RootStyle>
      <ToolbarStyle>
        {/* <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-outline" />
        </IconButton> */}

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(90deg, #465B3C, #384533)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              display: "inline-block",
              textTransform: "capitalize"
            }}
          >
            {user && user.userDetails.officerName ? user.userDetails.officerName : 'Loading...'}
          </Typography>
        </Box>

        {/* <Searchbar />
        <Box sx={{ flexGrow: 1 }} /> */}

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {/* <LanguagePopover /> */}
          {showNotifications && <NotificationsPopover />}
          <AccountPopover setLoad={setLoad} />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
