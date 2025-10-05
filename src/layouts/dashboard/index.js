import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import BottomNav from './BottomNav';
// import DashboardSidebar from './DashboardSidebar';
import BackDrop from '../../components/BackDrop';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 70;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 10,
  paddingBottom: APP_BAR_MOBILE + 20,
  [theme.breakpoints.up('lg')]: {
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  return (
    <RootStyle>
      <BackDrop open={load}/>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} setLoad={setLoad}/>
      {/* <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} /> */}
      <MainStyle>
        <Outlet />
      </MainStyle>
      <BottomNav setLoad={setLoad} />
    </RootStyle>
  );
}
