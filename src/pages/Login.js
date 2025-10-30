import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const HeaderStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
}));

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 100px)'
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  // maxHeight: '95vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: '1rem'
  // margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  margin: 'auto',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    minHeight: '100vh',
  },
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      
        {mdUp && (

          <HeaderStyle>
            <Box component="img" width={250} sx={{ p: 1}} src="/static/logo.png" alt="Tobacco Board"  />
            <Box component="img" width={250} sx={{ p: 1}} src="/static/logo-1.png" alt="MCI"  />
            
          </HeaderStyle>
        )}

      <RootStyle>
        
        {false && (
          <SectionStyle>
            <Logo disabledLink={'true'} width={300} sx={{ p: 3, margin: 'auto' }} />

            {/* <Typography variant="h3" sx={{ px: 5}}> Hi, Welcome Back </Typography> */}
            <Box component="img" src="/static/illustrations/Authentication.svg" alt="login"  />
          </SectionStyle>
        )}
      
        <Card>
          {/* <Container maxWidth="sm"> */}
            <ContentStyle>
              {!mdUp && (
                <>
                  {/* <Logo disabledLink={'true'} width={300} sx={{ py: 2 }} /> */}
                  <Box component="img" width={300} sx={{ p: 1}} src="/static/logo-1.png" alt="MCI"  />
                  <Box component="img" width={300} sx={{ p: 1}} src="/static/logo.png" alt="Tobacco Board"  />
                </>
              )}
              <Typography variant="h4" gutterBottom> Login to Tobacco Board </Typography>

              <Typography sx={{ color: 'text.secondary', mb: 2 }}>Enter your details below.</Typography>

              <LoginForm />

            </ContentStyle>
          {/* </Container> */}
        </Card>
      </RootStyle>
    </Page>
  );
}
