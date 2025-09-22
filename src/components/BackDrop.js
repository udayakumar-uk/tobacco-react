
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

export default function BackDrop({ open}) {
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, flexDirection: 'column' })}
            open={open}
        >
            <CircularProgress color="inherit" />
            {/* <Box mt={2}>
                <Typography variant="h6">{message}</Typography>
            </Box> */}
        </Backdrop>
    );
}