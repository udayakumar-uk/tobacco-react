import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
import { useState, useRef } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../utils/formatTime';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import {useAuth} from '../../context/AuthContext';

// ----------------------------------------------------------------------


export default function NotificationsPopover() {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const { bornDetail } = useAuth();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);

    console.log('barnDetails:', bornDetail );

  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40, marginRight: 2 }}
      >
        <Iconify icon="eva:clock-outline" width={30} height={30} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 350, p: 0, }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
            <Typography variant="subtitle1">Activites</Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 400, sm: 'auto' } }}>
          {bornDetail && <List
            disablePadding
            // subheader={
            //   <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
            //     New
            //   </ListSubheader>
            // }
          >
            {bornDetail.map(details => (
              <NotificationItem key={faker.datatype.uuid()} activityData={details.data} />
            ))}
          </List>}

          {!bornDetail.length && <Typography align='center'>No Activites</Typography>}

        </Scrollbar>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </MenuPopover>
    </>
  );
}


function renderContent(By, At) {
    return (
      <Typography 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>

          <Typography variant="subtitle2" noWrap sx={{ }}>
            {By} 
          </Typography>
          
          <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0}} >
              {/* <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16, verticalAlign: 'middle' }} /> */}
              {At}
            </Typography>
      </Typography>
    )
}

// ----------------------------------------------------------------------

function NotificationItem({ activityData }) {

  return (
    <ListItemButton sx={{ py: 0.5, px: 1.5, alignItems: 'start'}} >
      {/* <ListItemAvatar> */}
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 35, height: 35, fontSize: '1rem' }} alt={activityData.updatedBy}>{activityData?.updatedBy?.slice(0, 1)}</Avatar>
      {/* </ListItemAvatar> */}
      <ListItemText
        primary={renderContent(activityData?.updatedBy, activityData?.updatedAt)}
        secondary={
          <>
            <Typography variant="caption" sx={{ color: 'text.disabled'}}>
              Changed to:  {' '}
            </Typography>
            {activityData?.remarks}
          </>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

// function renderContent(notification) {
//   const title = (
//     <Typography variant="subtitle2">
//       {notification.title}
//       <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//         &nbsp; {noCase(notification.description)}
//       </Typography>
//     </Typography>
//   );

//   if (notification.type === 'order_placed') {
//     return {
//       avatar: <img alt={notification.title} src="/static/icons/ic_notification_package.svg" />,
//       title,
//     };
//   }
//   if (notification.type === 'order_shipped') {
//     return {
//       avatar: <img alt={notification.title} src="/static/icons/ic_notification_shipping.svg" />,
//       title,
//     };
//   }
//   if (notification.type === 'mail') {
//     return {
//       avatar: <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />,
//       title,
//     };
//   }
//   if (notification.type === 'chat_message') {
//     return {
//       avatar: <img alt={notification.title} src="/static/icons/ic_notification_chat.svg" />,
//       title,
//     };
//   }
//   return {
//     avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
//     title,
//   };
// }
