import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Box,
  IconButton,
  colors,
  Snackbar,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// custom hook to fetch users
import { useGetFetch } from '../hooks/useGetFetch';
import { usePostFetch } from '../hooks/usePostFetch';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: 'Action', alignRight: false, minWidth: 50 },
  { id: 'cropYear', label: 'Crop Year', alignRight: false, minWidth: 100 },
  { id: 'state', label: 'State', alignRight: false, minWidth: 100 },
  { id: 'district', label: 'District', alignRight: false },
  { id: 'mandal', label: 'Mandal', alignRight: false },
  { id: 'code', label: 'Code ', alignRight: false },
  { id: 'village', label: 'Village', alignRight: false },
  { id: 'rmoRegion', label: 'RMO Region', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'clusterCode', label: 'Cluster Code', alignRight: false },
  { id: 'foCode', label: 'FO Code', alignRight: false },
  { id: 'tbbrno', label: 'TBBR No', alignRight: false, minWidth: 100 },
  { id: 'barnSoil', label: 'Barn Soil', alignRight: false, minWidth: 100 },
  { id: 'barnUnit', label: 'Barn Unit', alignRight: false, minWidth: 100 },
  { id: 'barnLic', label: 'Barn Lic', alignRight: false, minWidth: 100 },
  { id: 'barnSize', label: 'Barn Size', alignRight: false },
  { id: 'barnType', label: 'Barn Type', alignRight: false },
  { id: 'insulation', label: 'Insulation', alignRight: false },
  { id: 'furnace', label: 'Furnace', alignRight: false },
  { id: 'fuelUsed', label: 'Fuel Used', alignRight: false },
  { id: 'roof', label: 'Roof', alignRight: false },
  { id: 'constructionType', label: 'Construction Type', alignRight: false, minWidth: 200 },
  { id: 'highYield', label: 'High Yield', alignRight: false },
  { id: 'BarnCond', label: 'Barn Cond', alignRight: false },
  { id: 'nboundary', label: 'N Boundary', alignRight: false},
  { id: 'sboundary', label: 'S Boundary', alignRight: false},
  { id: 'eboundary', label: 'E Boundary', alignRight: false},
  { id: 'wboundary', label: 'W Boundary', alignRight: false},
  { id: 'constructedYear', label: 'Constructed Year', alignRight: false, minWidth: 200 },
  { id: 'remarks', label: 'Remarks', alignRight: false },
  // { id: 'status', label: 'Barn Soil', alignRight: false },
];

// ----------------------------------------------------------------------

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    const lowerQuery = query.toLowerCase();
    return filter(array, (_user) => {
      return [        
        _user.cropYear,
        _user.state,
        _user.district,
        _user.mandal,
        _user.code,
        _user.village,
        _user.rmoRegion,
        _user.location,
        _user.clusterCode,
        _user.foCode,
        _user.tbbrno,
        _user.barnSoil,
        _user.barnUnit,
        _user.barnLic,
        _user.barnSize,
        _user.barnType,
        _user.insulation,
        _user.furnace,
        _user.fuelUsed,
        _user.roof,
        _user.constructionType,
        _user.highYield,
        _user.BarnCond,
        _user.nboundary,
        _user.sboundary,
        _user.eboundary,
        _user.wboundary,
        _user.constructedYear,
        _user.remarks
      ].some(field => field && field.toString().toLowerCase().includes(lowerQuery));
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('officerName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [importedBarns, setImportedBarns] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [postData] = usePostFetch();
  
  const [fileName, setFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  const [fetchUsers, { data, loading, error }] = useGetFetch('barn/getList');

  useEffect(() => {
    fetchUsers();
  }, [importedBarns]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setUploadError('');
    setLoadingSheet(true);
    try {
      const sheetData = await file.arrayBuffer();
      const workbook = XLSX.read(sheetData, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const barnData = await postData('barn/insert', jsonData);
      setImportedBarns(jsonData);
      setSuccess(true);
      if (barnData.status) {
        console.log('Barn Added Successfully!');
      } else {
        console.log(barnData.response || 'Barn failed');
      }
      // You can handle the imported data here (e.g., send to API, show preview, etc.)
      console.log('Imported barns:', jsonData);
    } catch (err) {
      setUploadError('Failed to parse file. Please upload a valid Excel file.');
    } finally{
      setLoadingSheet(false);
    }
  };

  return (
    <Page title="Barn">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5">
            Barn Management
          </Typography>
          
          <Button
            component="label"
            variant="contained"
            tabIndex={0}
            disabled={loadingSheet}
            startIcon={loadingSheet ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="eva:cloud-upload-outline" />}
          >
            {loadingSheet ? 'Processing...' : 'Upload Sheet'}
            <VisuallyHiddenInput
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              aria-label="Upload Excel File"
              disabled={loadingSheet}
            />
          </Button>
        
        </Stack>

        <Card>

          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          
          {success && (
            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{position: 'absolute', top: {xs: 10}, right: {xs: 10} }}>
              <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                Imported Successfully
              </Alert>
            </Snackbar>
          )}

          {uploadError && (
            <Alert severity="error" variant="filled" sx={{ my: 2 }}>
              {uploadError}
            </Alert>
          )}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { 
                      cropYear,
                      state,
                      district,
                      mandal,
                      code,
                      village,
                      rmoRegion,
                      location,
                      clusterCode,
                      foCode,
                      tbbrno,
                      barnSoil,
                      barnUnit,
                      barnLic,
                      barnSize,
                      barnType,
                      insulation,
                      furnace,
                      fuelUsed,
                      roof,
                      constructionType,
                      highYield,
                      BarnCond,
                      nboundary,
                      sboundary,
                      eboundary,
                      wboundary,
                      constructedYear,
                      remarks,
                      _id
                    } = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, _id)} />
                        </TableCell> */}
                        <TableCell align="center" size="small" padding='normal' sx={{lineHeight: 1.2}}>
                          {/* <UserMoreMenu /> */}
                          <IconButton
                            sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'primary.lighter' } }}
                            onClick={() => navigate(`/barn/edit/${_id}`)}
                          >
                            <Iconify icon="eva:edit-outline" width={20} height={20} />
                          </IconButton>
                        </TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{cropYear}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{state}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{district}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{mandal}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{code}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{village}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{rmoRegion}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{location}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{clusterCode}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{foCode}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{tbbrno}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{barnSoil}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{barnUnit}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{barnLic}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{barnSize}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{barnType}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{insulation}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{furnace}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{fuelUsed}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{roof}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{constructionType}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{highYield}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{BarnCond}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{nboundary}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{sboundary}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{eboundary}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{wboundary}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{constructedYear}</TableCell>
                        <TableCell align="left" size="small" padding='normal' sx={{lineHeight: 1.2}}>{remarks}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={10} />
                    </TableRow>
                  )}
                </TableBody>

                {loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <Typography gutterBottom align="center" variant="subtitle1">
                            <CircularProgress size="30px" />
                            <Box>Loading...</Box>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {isUserNotFound && !loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
