import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Card, Stack, Box, Avatar, Link, Container, Typography } from '@mui/material';
import Page from '../components/Page';
import { useGetById } from '../hooks/useGetById';
import EditUserForm from '../sections/auth/register/EditUserForm';
import { useAuth } from '../context/AuthContext';


const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  padding: theme.spacing(2, 0),
}));


export default function EditUser() {
    const navigate = useNavigate();
    const {user, userName, userEmail, userNumber} = useAuth();
    const { getByData, fetchUserById, loading } = useGetById('user/getUserById');

    useEffect(() => {
      const fetchData = async () => {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (user.userId && token) {
          await fetchUserById(user.userId, token);
        }
      };
      fetchData();
    }, [user.userId]);

  return (

    <Page title="Edit User">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Account</Typography>
            </Stack>
            {/* <Card sx={{ mb: 3, p: 3, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, mr: 3 }} src={`https://avatar.iran.liara.run/public/boy?username=${user.userId}`} alt="photoURL" />
                <Box>
                    <Typography variant="h6">{userName || user?.userDetails?.officerName || '-'}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{userEmail || user?.userDetails?.email || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">{userNumber || user?.userDetails?.mobileNumber || '-'}</Typography>
                </Box>
            </Card> */}
            <Card sx={{width: '100%'}}>
                <Container>
                    <ContentStyle>
                    
                    <Typography sx={{ color: 'text.secondary', mb: 5 }}> Update user details and save changes below.</Typography>
                    
                    <EditUserForm userData={getByData} open={loading} profileId={user.userId} />
                    </ContentStyle>
                </Container>
            </Card>
        </Container>
    </Page>
  );
}