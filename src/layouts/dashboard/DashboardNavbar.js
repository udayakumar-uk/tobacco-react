import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import account from '../../_mock/account';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';

import { useAuth } from '../../context/AuthContext';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 65;
const APPBAR_DESKTOP = 60;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  borderBottom: `1px dashed ${theme.palette.divider}`,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
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

  const { myUser } = useAuth();

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

    
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
            {myUser && myUser.officerName ? myUser.officerName : 'Loading...'}
          </Typography>
        </Box>

        {/* <Searchbar />
        <Box sx={{ flexGrow: 1 }} /> */}

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}
          <AccountPopover setLoad={setLoad} />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
