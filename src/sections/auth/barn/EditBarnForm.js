import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {Stack, Grid, Box, Alert, Snackbar, Button, CircularProgress, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Typography } from '@mui/material';
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

  const DropDownSchema = ['photos', 'state', 'barnType', 'insulation', 'furnace', 'fuelUsed', 'roof', 'constructionType', 'highYield', 'BarnCond']

  const EditBarnSchema = Yup.object().shape({
    cropYear: Yup.string().required('Crop Year is required'),
    state: Yup.string().required('State is required'),
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
    barnType: Yup.string().required('Barn Type is required'),
    insulation: Yup.string().required('Insulation is required'),
    furnace: Yup.string().required('Furnace is required'),
    fuelUsed: Yup.string().required('Fuel Used is required'),
    roof: Yup.string().required('Roof is required'),
    constructionType: Yup.string().required('Construction Type is required'),
    highYield: Yup.string().required('High Yield is required'),
    BarnCond: Yup.string().required('Barn Cond is required'),
    nboundary: Yup.string().required('N Boundary is required'),
    sboundary: Yup.string().required('S Boundary is required'),
    eboundary: Yup.string().required('E Boundary is required'),
    wboundary: Yup.string().required('W Boundary is required'),
    constructedYear: Yup.string().required('Constructed Year is required'),
    // remarks: Yup.string().required('Remarks is required'),
  });

  // Set default values from barnData
  const defaultValues = {
    cropYear: barnData?.cropYear || '',
    state: barnData?.state || [],
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
    barnType: barnData?.barnType || [],
    insulation: barnData?.insulation || [],
    furnace: barnData?.furnace || [],
    fuelUsed: barnData?.fuelUsed || [],
    roof: barnData?.roof || [],
    constructionType: barnData?.constructionType || [],
    highYield: barnData?.highYield || [],
    BarnCond: barnData?.BarnCond || [],
    nboundary: barnData?.nboundary || '',
    sboundary: barnData?.sboundary || '',
    eboundary: barnData?.eboundary || '',
    wboundary: barnData?.wboundary || '',
    constructedYear: barnData?.constructedYear || '',
    remarks: barnData?.remarks || '',
    geolocation: barnData?.geolocation || '',
    photos: barnData?.photos || [],
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
            if(key === 'photos'){
                setValue(key, JSON.parse(defaultValues[key]));
            }else{
                setValue(key, defaultValues[key]);
            }
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
        if(field === 'photos'){
            submitData[field] = JSON.stringify(submitData[field]);
        }else{
            submitData[field] = submitData[field].join(',');
        }
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

    const handleBack = (event) => {
        event.preventDefault();
        navigate(-1);
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
              <Grid item xs={12} md={4} sm={6}>
                <RHFTextField name="geolocation" label="GEO Location" />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="photos"
                  control={control}
                  render={({ field: { value = [], onChange } }) => {
                    // Helper to convert File to base64
                    const fileToBase64 = file => new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });

                    const handleFiles = async (e) => {
                      const files = Array.from(e.target.files || []);
                      const base64Files = await Promise.all(
                        files.map(async (file) => {
                          const base64 = await fileToBase64(file);
                          return { base64, name: file.name };
                        })
                      );
                      onChange([...(value || []), ...base64Files]);
                    };

                    const handleRemove = (idx) => {
                      const newArr = [...value];
                      newArr.splice(idx, 1);
                      onChange(newArr);
                    };

                    return (
                      <Box>
                        <Button
                          variant="outlined"
                          component="label"
                          size="large"
                          startIcon={<Iconify icon="eva:cloud-upload-outline" />}
                          sx={{ mb: 2 }}
                        >
                          Upload Photos
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleFiles}
                          />
                        </Button>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          {(value || []).map((file, idx) => (
                            <Box key={file.base64 || file.name || idx} sx={{ position: 'relative', width: 100, height: 100, mb: 1 }}>
                              <img
                                src={file.base64 || (typeof file === 'string' ? file : '')}
                                alt={file.name || `photo-${idx}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                              />
                              <Button
                                size="medium"
                                color="error"
                                onClick={() => handleRemove(idx)}
                                sx={{ position: 'absolute', backgroundColor: 'error.lighter', top: 2, right: 2, minWidth: 0, p: '5px', borderRadius: '50%' }}
                              >
                                <Iconify icon="eva:trash-2-outline" width={16} height={16} />
                              </Button>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    );
                  }}
                />
              </Grid>
            
          </Grid>
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button onClick={handleBack} sx={{ mr: 2}} fullWidth={false} type="button" variant="outlined" disabled={isSubmitting}>
            Cancel
            </Button>
          <LoadingButton fullWidth={false} type="submit" variant="contained" loading={isSubmitting}>
            Update Barn
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}
