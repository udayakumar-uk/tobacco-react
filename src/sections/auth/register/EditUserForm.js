import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Grid, Box, Alert, Snackbar, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { usePutFetch } from '../../../hooks/usePutFetch';

// ----------------------------------------------------------------------


export default function EditUserForm({ userData, open }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const { id } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateData, setupdateData] = useState("");
  const [putData, { loading: updateLoading }] = usePutFetch();

  const EditUserSchema = Yup.object().shape({
    officerName: Yup.string().required('Officer name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string(), // Optional for update
    mobileNumber: Yup.string().required('Mobile Number is required'),
    officerId: Yup.string().required('Officer Id is required'),
    rmoRegion: Yup.string().required('RMO Region is required'),
    apfLocation: Yup.string().required('APF Location is required'),
    foCode: Yup.string().required('FO Code is required'),
    clusterCode: Yup.string().required('Cluster Code is required'),
    villageCode: Yup.string().required('Village Code is required'),
  });

  // Set default values from userData
  const defaultValues = {
    officerName: userData?.officerName || '',
    email: userData?.email || '',
    password: '', // Don't prefill password
    mobileNumber: userData?.mobileNumber || '',
    officerId: userData?.officerId || '',
    rmoRegion: userData?.rmoRegion || '',
    apfLocation: userData?.apfLocation || '',
    foCode: userData?.foCode || '',
    clusterCode: userData?.clusterCode || '',
    villageCode: userData?.villageCode || '',
  };

  const methods = useForm({
    resolver: yupResolver(EditUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, userData[key] || (key === 'password' ? '' : ''));
      });
    }
  }, [userData]);


  const onSubmitForm = async (formData) => {
    try {
      const formsData = { ...formData, 'id': id }

      const data = await putData(`user/update`, formsData);
      if (data.status) {
        setSuccess(true);
        setupdateData(data);
        setError("");
      } else {
        setError(data.response || "Update failed");
      }
    } catch (err) {
      setError("Update failed");
    }
  };

  return (
    <>
      
      {success && (
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{position: 'absolute', top: {xs: 10}, right: {xs: 10} }}>
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            {updateData.response}
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Alert severity="error" variant="filled" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {(open || isSubmitting) && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backgroundColor: alpha(theme.palette.background.default, 0.50)
          }}
        >
          <CircularProgress size={48} />
        </Box>
      )}

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
            {/* <Grid item xs={12} md={4} sm={6}>
              <RHFTextField name="password" label="Password" />
            </Grid> */}
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
            Update User
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}
