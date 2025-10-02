import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Grid, Box, Button, CircularProgress, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { usePutFetch } from '../../../hooks/usePutFetch';
import DropDownControl from '../../../components/DropdownControl';
import {useAuth} from '../../../context/AuthContext';
import AlertComponent from '../../../components/AlertComponent';

// ----------------------------------------------------------------------


export default function EditUserForm({ userData, open, profileId }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const { id } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateData, setupdateData] = useState("");
  const { setUserName, setUserEmail, setUserNumber } = useAuth();

  const [putData, { loading: updateLoading }] = usePutFetch();
  
  const villageCode = ['20001', '20002', '20003', '20004', '20005'];
  const states = ['AP', 'KA'];
  const roles = ['FO','FA','SGO','AS','RMO','HQ_AP_KK','HQ_KK'];

  const EditUserSchema = Yup.object().shape({
    officerName: Yup.string().required('Officer name required'),
    role: Yup.string().required('Officer role required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string(), // Optional for update
    mobileNumber: Yup.string().required('Mobile Number is required'),
    officerId: Yup.string().required('Officer Id is required'),
    rmoRegion: Yup.string().required('RMO Region is required'),
    apfLocation: Yup.string().required('APF Location is required'),
    foCode: Yup.string().required('FO Code is required'),
    clusterCode: Yup.string().required('Cluster Code is required'),
    villageCode: Yup.array().min(1, 'Select at least one village code').required('Village Code is required'),
    state: Yup.array().min(1, 'Select at least one state').required('State is required'),
  });

  // Set default values from userData
  const defaultValues = {
    officerName: userData?.officerName || '',
    role: userData?.role?.split(',') || '',
    email: userData?.email || '',
    password: '', // Don't prefill password
    mobileNumber: userData?.mobileNumber || '',
    officerId: userData?.officerId || '',
    rmoRegion: userData?.rmoRegion || '',
    apfLocation: userData?.apfLocation || '',
    foCode: userData?.foCode || '',
    clusterCode: userData?.clusterCode || '',
    villageCode: userData?.villageCode?.split(',') || [],
    state: userData?.state?.split(',') || [],
  };

  const methods = useForm({
    resolver: yupResolver(EditUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      Object.keys(defaultValues).forEach((key) => {
        if (key === 'villageCode' || key === 'state') {
          if(userData[key]){
            setValue(key, defaultValues[key]);
          }else {
            setValue(key, []);
          }
        } else {
          setValue(key, userData[key] );
        }
      });
    }
  }, [userData]);

  const onSubmitForm = async (formData) => {
    // Convert arrays to comma-separated strings
    const payload = {
      ...formData,
      'id': id ?? profileId,
      villageCode: Array.isArray(formData.villageCode) ? formData.villageCode.join(',') : formData.villageCode,
      state: Array.isArray(formData.state) ? formData.state.join(',') : formData.state,
    };

    try {
      const data = await putData(`user/update`, payload);
      
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

  
  const handleBack = (event) => {
      event.preventDefault();
      navigate(-1);
  };

  return (
    <>
      
      <AlertComponent success={success} successMsg={updateData.response} error={error} errorMsg={error} setSuccess={setSuccess} setError={setError}  />

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
              <RHFTextField
                name="officerName"
                label="Officer Name"
                onInput={e => setUserName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <DropDownControl controls={control} errors={errors} name="role" label="Officer Role" data={roles}  />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <RHFTextField name="email" type="email" label="Email address" onInput={e => setUserEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <RHFTextField name="mobileNumber" label="Mobile Number" onInput={e => setUserNumber(e.target.value)}/>
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
            <Grid item xs={12} md={4} sm={6}>
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

            <Grid item xs={12} md={4} sm={6}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel id="village_code_label">State</InputLabel>
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: "State Code is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="state_code_label"
                      id="vstate_code"
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
          <Button onClick={handleBack} sx={{ mr: 2}} fullWidth={false} type="button" variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton fullWidth={false} type="submit" variant="contained" loading={isSubmitting}>
            Update User
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}
