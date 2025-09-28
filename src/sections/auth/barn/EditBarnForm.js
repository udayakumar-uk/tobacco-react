import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Grid, Box, Alert, Snackbar, CircularProgress, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { usePutFetch } from '../../../hooks/usePutFetch';
import DropDownControl from '../../../components/DropdownControl';

// ----------------------------------------------------------------------


export default function EditBarnForm({ barnData, open }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const { id } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateData, setupdateData] = useState("");
  const [putData, { loading: updateLoading }] = usePutFetch();
  
  const states = ["AP","KA"];
  const burnTypes = ["Normal","Simplex","Duplex","Loose Leaf"];
  const burnIns = ["No Insulation","Pady Straw","Glass Wool"];
  const burnFur = ["Normal","Ventury"];
  const burnFuel = ["Coal","Electricity","Fuel","Wood","Husk","Others"];
  const burnCons = ["PUCCA", "KATCHA"];
  const burnRoof = ["Tiled","Zinc"];
  const burnHigh = ["Y", "N"];
  const burnCond = ["Fit", "Unfit","No Structure"];

  const DropDownSchema = ['state', 'barnType', 'insulation', 'furnace', 'fuelUsed', 'roof', 'constructionType', 'highYield', 'BarnCond']

  const EditBarnSchema = Yup.object().shape({
    cropYear: Yup.string().required('Crop Year is required'),
    state: Yup.array().min(1, 'Select at least one type').required('State is required'),
    district: Yup.string().required('District is required'),
    mandal: Yup.string().required('Mandal is required'),
    code: Yup.string().required('Code is required'),
    village: Yup.string().required('Village is required'),
    rmoRegion: Yup.string().required('RMO Region is required'),
    location: Yup.string().required('Location is required'),
    clusterCode: Yup.string().required('Cluster Code is required'),
    foCode: Yup.string().required('FO Code is required'),
    tbbrno: Yup.string().required('TBBR No is required'),
    barnSoil: Yup.string().required('Barn Soil is required'),
    barnUnit: Yup.string().required('Barn Unit is required'),
    barnLic: Yup.string().required('Barn Lic is required'),
    barnSize: Yup.string().required('Barn Size is required'),
    barnType: Yup.array().min(1, 'Select at least one type').required('Barn Type is required'),
    insulation: Yup.array().min(1, 'Select at least one insulation').required('Insulation is required'),
    furnace: Yup.array().min(1, 'Select at least one furnace').required('Furnace is required'),
    fuelUsed: Yup.array().min(1, 'Select at least one fuel').required('Fuel Used is required'),
    roof: Yup.array().min(1, 'Select at least one roof').required('Roof is required'),
    constructionType: Yup.array().min(1, 'Select at least one type').required('Construction Type is required'),
    highYield: Yup.array().min(1, 'Select at least one highyield').required('High Yield is required'),
    BarnCond: Yup.array().min(1, 'Select at least one condition').required('Barn Cond is required'),
    nboundary: Yup.string().required('N Boundary is required'),
    sboundary: Yup.string().required('S Boundary is required'),
    eboundary: Yup.string().required('E Boundary is required'),
    wboundary: Yup.string().required('W Boundary is required'),
    constructedYear: Yup.string().required('Constructed Year is required'),
    remarks: Yup.string().required('Remarks is required'),
  });

  // Set default values from barnData
  const defaultValues = {
    cropYear: barnData?.cropYear || '',
    state: barnData?.state?.split(',') || [],
    district: barnData?.district || '',
    mandal: barnData?.mandal || '',
    code: barnData?.code || '',
    village: barnData?.village || '',
    rmoRegion: barnData?.rmoRegion || '',
    location: barnData?.location || '',
    clusterCode: barnData?.clusterCode || '',
    foCode: barnData?.foCode || '',
    tbbrno: barnData?.tbbrno || '',
    barnSoil: barnData?.barnSoil || '',
    barnUnit: barnData?.barnUnit || '',
    barnLic: barnData?.barnLic || '',
    barnSize: barnData?.barnSize || '',
    barnType: barnData?.barnType?.split(',') || [],
    insulation: barnData?.insulation?.split(',') || [],
    furnace: barnData?.furnace?.split(',') || [],
    fuelUsed: barnData?.fuelUsed?.split(',') || [],
    roof: barnData?.roof?.split(',') || [],
    constructionType: barnData?.constructionType?.split(',') || [],
    highYield: barnData?.highYield?.split(',') || [],
    BarnCond: barnData?.BarnCond?.split(',') || [],
    nboundary: barnData?.nboundary || '',
    sboundary: barnData?.sboundary || '',
    eboundary: barnData?.eboundary || '',
    wboundary: barnData?.wboundary || '',
    constructedYear: barnData?.constructedYear || '',
    remarks: barnData?.remarks || '',
  };

  const methods = useForm({
    resolver: yupResolver(EditBarnSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  // Update form values when barnData changes
  useEffect(() => {
    if (barnData) {
      Object.keys(defaultValues).forEach((key) => {
        if (DropDownSchema.includes(key)) {
          if(barnData[key]){
            setValue(key, defaultValues[key]);
          }else {
            setValue(key, []);
          }
        } else {
          setValue(key, barnData[key] );
        }
      });
    }
  }, [barnData]);


  const onSubmitForm = async (formData) => {
    // Convert dropdown arrays to comma-separated strings
    const submitData = {
      ...formData,
      'id': id,
    };

    DropDownSchema.forEach((field) => {
      if (Array.isArray(submitData[field])) {
        submitData[field] = submitData[field].join(',');
      }
    });

    try {
      const data = await putData(`barn/update`, submitData);
      
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
              <RHFTextField name="cropYear" label="Crop Year" />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="state" label="State" data={states}  />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <RHFTextField name="district" label="District" />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <RHFTextField name="mandal" label="Mandal" />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <RHFTextField name="code" label="Code" />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <RHFTextField name="village" label="Village" />
            </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="rmoRegion" label="RMO Region" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="location" label="Location" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="clusterCode" label="Cluster Code" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="foCode" label="FO Code" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="tbbrno" label="TBBR No" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="barnSoil" label="Barn Soil" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="barnUnit" label="Barn Unit" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="barnLic" label="Barn Lic" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="barnSize" label="Barn Size" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="barnType" label="Barn Type" data={burnTypes} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="insulation" label="Insulation" data={burnIns} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="furnace" label="Furnace" data={burnFur} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="fuelUsed" label="Fuel Used" data={burnFuel} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="roof" label="Roof" data={burnRoof} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="constructionType" label="Construction Type" data={burnCons} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="highYield" label="High Yield" data={burnHigh} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <DropDownControl controls={control} errors={errors} name="BarnCond" label="Barn Cond" data={burnCond} />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="nboundary" label="N Boundary" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="sboundary" label="S Boundary" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="eboundary" label="E Boundary" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="wboundary" label="W Boundary" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="constructedYear" label="Constructed Year" />
              </Grid>
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="remarks" label="Remarks" />
              </Grid>
            
          </Grid>
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <LoadingButton fullWidth={false} size="large" type="submit" variant="contained" loading={isSubmitting}>
            Update Barn
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}
