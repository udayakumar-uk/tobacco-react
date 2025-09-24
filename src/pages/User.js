import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  colors
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// custom hook to fetch users
import { useGetFetch } from '../hooks/useGetFetch';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: 'Action', alignRight: false, minWidth: 50 },
  { id: 'officerName', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'mobileNumber', label: 'Mobile Number', alignRight: false },
  // { id: 'password', label: 'Password', alignRight: false },
  { id: 'officerId', label: 'Officer ID', alignRight: false },
  { id: 'rmoRegion', label: 'RMO Region ', alignRight: false },
  { id: 'apfLocation', label: 'APF Location', alignRight: false },
  { id: 'foCode', label: 'FO Code', alignRight: false },
  { id: 'clusterCode', label: 'Cluster Code', alignRight: false },
  { id: 'villageCode', label: 'Village Code', alignRight: false },
];

// ----------------------------------------------------------------------

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
        _user.officerName,
        _user.email,
        _user.mobileNumber,
        _user.officerId,
        _user.rmoRegion,
        _user.apfLocation,
        _user.foCode,
        _user.clusterCode,
        _user.villageCode
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
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const navigate = useNavigate();

  const { data, loading, error } = useGetFetch('user/getAllUsers');

  useEffect(() => {
    console.log(data, loading, error);
  }, [data, loading, error]);

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

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5">
            User Management
          </Typography>
          <Button variant="contained" component={RouterLink} to="./createnewuser" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

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
                      apfLocation, 
                      clusterCode, 
                      email, 
                      foCode, 
                      mobileNumber, 
                      officerId, 
                      officerName,
                      password,
                      rmoRegion,
                      villageCode,
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
                        <TableCell align="center" size="small">
                          {/* <UserMoreMenu /> */}
                          <IconButton
                            sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'primary.lighter' } }}
                            onClick={() => navigate(`/user/edit/${_id}`)}
                          >
                            <Iconify icon="eva:edit-fill" width={20} height={20} />
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row" size="small">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {officerName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left" size="small">{email}</TableCell>
                        <TableCell align="left" size="small">{mobileNumber}</TableCell>
                        {/* <TableCell align="left">{password}</TableCell> */}
                        <TableCell align="left" size="small">{officerId}</TableCell>
                        <TableCell align="left" size="small">{rmoRegion}</TableCell>
                        <TableCell align="left" size="small">{apfLocation}</TableCell>
                        <TableCell align="left" size="small">{foCode}</TableCell>
                        <TableCell align="left" size="small">{clusterCode}</TableCell>
                        <TableCell align="left" size="small">{villageCode}</TableCell>
                        {/* <TableCell align="left">
                          <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}
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
            rowsPerPageOptions={[5, 10, 25]}
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
