import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Grid, Box, Alert, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { usePostFetch } from '../../../hooks/usePostFetch';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [regData, setRegData] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const RegisterSchema = Yup.object().shape({
    officerName: Yup.string().required('Officer name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    officerId: Yup.string().required('Officer Id is required'),
    rmoRegion: Yup.string().required('RMO Region is required'),
    apfLocation: Yup.string().required('APF Location is required'),
    foCode: Yup.string().required('FO Code is required'),
    clusterCode: Yup.string().required('Cluster Code is required'),
    villageCode: Yup.string().required('Village Code is required'),
  });

  const defaultValues = {
    officerName: '',
    email: '',
    password: '',
    mobileNumber: '',
    officerId: '',
    rmoRegion: '',
    apfLocation: '',
    foCode: '',
    clusterCode: '',
    villageCode: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  
  const [postData, { loadingState }] = usePostFetch();

  const onSubmitForm = async (formData) => {
    try {
      const data = await postData('user/register', formData);
      if (data.status) {
        setShowToast(true);
        setRegData(data.response);
        setError('');
        reset();
      } else {
        setError(data.response || 'Registration failed');
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
  <>    
    {error && (
      <Alert severity="error" variant="filled" sx={{ my: 4 }}>
        {error}
      </Alert>
    )}

    <Snackbar open={showToast} autoHideDuration={30000} onClose={() => setShowToast(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{position: 'absolute', top: {xs: 10}, right: {xs: 10} }}>
      <Alert
        onClose={() => setShowToast(false)}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      > {regData}!
      </Alert>
    </Snackbar>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="officerName" label="Officer Name" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="email" type="email" label="Email address" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="mobileNumber" label="Mobile Number" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="password" label="Password" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="officerId" label="Officer Id" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="rmoRegion" label="RMO Region" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="apfLocation" label="APF Location" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="foCode" label="FO Code" />
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <RHFTextField name="clusterCode" label="Cluster Code" />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField name="villageCode" label="Village Code" />
          </Grid>
        </Grid>
      </Stack>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <LoadingButton fullWidth={false} size="large" type="submit" variant="contained" loading={isSubmitting}>
          Create User
        </LoadingButton>
      </Box>
    </FormProvider>
    </>
  );
}
