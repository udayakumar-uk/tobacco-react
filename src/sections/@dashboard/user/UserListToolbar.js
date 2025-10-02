import {useState} from 'react'
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Box, Stack, TextField, Button } from '@mui/material';
import MenuPopover from '../../../components/MenuPopover';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 80,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
  [theme.breakpoints.up('sm')]: {
    height: 90,
    padding: theme.spacing(2),
  },
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, showFilter = false, advancedFilter, setAdvancedFilter }) {
  const [filterAnchorEl, setFilterAnchorEl] = useState(false);
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        showFilter && (
          <>
            <Tooltip title="Filter list">
              <IconButton onClick={e => setFilterAnchorEl(e.currentTarget)}>
                <Iconify icon="ic:round-filter-list" />
              </IconButton>
            </Tooltip>
            <MenuPopover
              open={Boolean(filterAnchorEl)}
              anchorEl={filterAnchorEl}
              onClose={() => setFilterAnchorEl(null)}
              sx={{ width: 250 }}
            >
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Advanced Filter</Typography>
                <Stack spacing={1}>
                  <TextField
                    label="RMO Region"
                    value={advancedFilter?.rmoRegion || ''}
                    onChange={e => setAdvancedFilter(f => ({ ...f, rmoRegion: e.target.value }))}
                    size="small"
                  />
                  <TextField
                    label="APF Location"
                    value={advancedFilter?.location || ''}
                    onChange={e => setAdvancedFilter(f => ({ ...f, location: e.target.value }))}
                    size="small"
                  />
                  <TextField
                    label="Cluster Code"
                    value={advancedFilter?.clusterCode || ''}
                    onChange={e => setAdvancedFilter(f => ({ ...f, clusterCode: e.target.value }))}
                    size="small"
                  />
                  <TextField
                    label="Village Code"
                    value={advancedFilter?.villageCode || ''}
                    onChange={e => setAdvancedFilter(f => ({ ...f, villageCode: e.target.value }))}
                    size="small"
                  />
                   {/* <Stack direction="row" alignItems="center" justifyContent="end" gap={1}> */}

                      {(advancedFilter?.rmoRegion || advancedFilter?.location || advancedFilter?.clusterCode || advancedFilter?.villageCode) && (
                        <Button variant="contained" onClick={() => setAdvancedFilter({ rmoRegion: '', location: '', clusterCode: '', villageCode: '' })}>
                          Clear Filter
                        </Button>
                      )}
                      {/* <Button variant="contained" fullwidth="true"  onClick={() => setFilterAnchorEl(null)} >
                        Apply
                      </Button> */}
                   {/* </Stack> */}
                </Stack>
              </Box>
            </MenuPopover>
          </>
        )
      )}
    </RootStyle>
  );
}
