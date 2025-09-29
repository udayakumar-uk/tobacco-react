import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Grid, Box, Alert, Snackbar, CircularProgress, OutlinedInput, Button, InputLabel, MenuItem, FormControl, Select, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { usePostFetch } from '../../../hooks/usePostFetch';
import DropDownControl from '../../../components/DropdownControl';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [regData, setRegData] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const theme = useTheme();

  const villageCode = ['20001', '20002', '20003', '20004', '20005'];
  const states = ['AP', 'KA'];  
  const roles = ['FO','FA','SGO','AS','RMO','HQ_AP_KK','HQ_KK'];
  

  const RegisterSchema = Yup.object().shape({
    officerName: Yup.string().required('Officer name required'),
    role: Yup.string().required('Officer role required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    officerId: Yup.string().required('Officer Id is required'),
    rmoRegion: Yup.string().required('RMO Region is required'),
    apfLocation: Yup.string().required('APF Location is required'),
    foCode: Yup.string().required('FO Code is required'),
    clusterCode: Yup.string().required('Cluster Code is required'),
    villageCode: Yup.array().min(1, 'Select at least one village code').required('Village Code is required'),
    state: Yup.array().min(1, 'Select at least one state').required('State is required'),
  });

  const defaultValues = {
    officerName: '',
    role: '',
    email: '',
    password: '',
    mobileNumber: '',
    officerId: '',
    rmoRegion: '',
    apfLocation: '',
    foCode: '',
    clusterCode: '',
    villageCode: [],
    state: [],
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors }
  } = methods;
  
  const [postData, { loadingState }] = usePostFetch();

  const onSubmitForm = async (formData) => {
    // Convert arrays to comma-separated strings
    const submitData = {
      ...formData,
      villageCode: Array.isArray(formData.villageCode) ? formData.villageCode.join(',') : formData.villageCode,
      state: Array.isArray(formData.state) ? formData.state.join(',') : formData.state,
    };
    const payload = {
      data: {...submitData}
    }
    try {
      const data = await postData('user/register', payload);
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

  const handleBack = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
  <>    
    {error && (
      <Alert severity="error" variant="filled" sx={{ my: 4 }}>
        {error}
      </Alert>
    )}

    {(isSubmitting) && (
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
            <DropDownControl
              controls={control}
              errors={errors}
              name="role"
              label="Officer Role"
              data={roles}
            />
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
            <FormControl fullWidth error={!!errors.villageCode}>
              <InputLabel id="village_code_label">Village Code</InputLabel>
              <Controller
                name="villageCode"
                control={control}
                rules={{ required: "Village Code is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="village_code_label"
                    id="village_code"
                    multiple
                    input={<OutlinedInput label="Village Code" />}
                  >
                    {villageCode.map((village) => (
                      <MenuItem key={village} value={village}>
                        {village}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.villageCode && (
                <Typography sx={{ color: 'error.main', fontSize: "12px" }}>
                  {errors.villageCode.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.state}>
              <InputLabel id="state_code_label">State</InputLabel>
              <Controller
                name="state"
                control={control}
                rules={{ required: "State Code is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="state_code_label"
                    id="state_code"
                    multiple
                    input={<OutlinedInput label="State Code" />}
                  >
                    {states.map((st) => (
                      <MenuItem key={st} value={st}>
                        {st}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.state && (
                <Typography sx={{ color: 'error.main', fontSize: "12px" }}>
                  {errors.state.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Stack>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button onClick={()=> reset()} sx={{ mr: 2}}>Reset</Button>
        <Button onClick={handleBack} sx={{ mr: 2}} fullWidth={false} type="button" variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <LoadingButton fullWidth={false} type="submit" variant="contained" loading={isSubmitting}>
          Create User
        </LoadingButton>
      </Box>
    </FormProvider>
    </>
  );
}
