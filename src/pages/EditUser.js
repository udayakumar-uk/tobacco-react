import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Breadcrumbs } from '@mui/material';
import Page from '../components/Page';
import { useGetById } from '../hooks/useGetById';
import EditUserForm from '../sections/auth/register/EditUserForm';


const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  padding: theme.spacing(2, 0),
}));


export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
  const { getByData, fetchUserById, loading } = useGetById('user/getUserById');

    useEffect(() => {
      const fetchData = async () => {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (id && token) {
          await fetchUserById(id, token);
        }
      };
      fetchData();
    }, [id]);


  const handleBack = (event) => {
    event.preventDefault();
    navigate('/user');
  };

  return (

        <Page title="Edit User">
            <Container>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link href="#" underline='hover' onClick={handleBack}>
                    <Typography variant='h5' sx={{ color: 'text.primary' }}> User Management </Typography>
                </Link>

                <Typography variant='h5' sx={{ color: 'text.secondary' }}> Edit </Typography>
                    </Breadcrumbs>
                <RootStyle>
                <Card sx={{width: '100%'}}>
                    <Container>
                        <ContentStyle>
                        
                          <Typography sx={{ color: 'text.secondary', mb: 5 }}> Update user details and save changes below.</Typography>
                        
                          <EditUserForm userData={getByData} open={loading} />
                        </ContentStyle>
                    </Container>
                </Card>
            </RootStyle>
        </Container>
    </Page>

  );
}
