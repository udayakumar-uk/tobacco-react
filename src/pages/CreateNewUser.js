import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Breadcrumbs } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { RegisterForm } from '../sections/auth/register';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  // minHeight: '100vh',
  // display: 'flex',
  // justifyContent: 'center',
  // flexDirection: 'column',
  padding: theme.spacing(2, 0),
}));

// ----------------------------------------------------------------------

export default function CreateNewUser() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

   const navigate = useNavigate();

  const handleBack = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <Page title="Create New User">
      <Container>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link href="#" underline='hover' onClick={handleBack}>
            <Typography variant='h5' sx={{ color: 'text.primary' }}> User Management </Typography>
          </Link>

          <Typography variant='h5' sx={{ color: 'text.secondary' }}> Create new </Typography>
        </Breadcrumbs>
        <RootStyle>
        <Card sx={{width: '100%'}}>
          <Container>
            <ContentStyle>
             
              {/* <Typography variant="h4" gutterBottom> Create a new user </Typography> */}

              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Create a new user.</Typography>

              <RegisterForm />

            </ContentStyle>
          </Container>
        </Card>
      </RootStyle>
      </Container>
    </Page>
  );
}
