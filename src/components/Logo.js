import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

// Logo.propTypes = {
//   disabledLink: PropTypes.bool,
//   sx: PropTypes.object,
// };

export default function Logo({ disabledLink = false, width = 250, sx }) {

  const logo = <Box component="img" src="/static/logo.png" sx={{ width, height: 'auto', ...sx }} />

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/user">{logo}</RouterLink>;
}
