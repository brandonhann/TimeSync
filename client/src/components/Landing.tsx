import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Box, useTheme } from '@mui/material';

function Landing() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary
            }}
        >
            <Typography variant="h1" component="h1" gutterBottom>
                Welcome to TimeSync!
            </Typography>
            <Typography variant="h6" component="p" mb={4}>
                Join us today and explore more.
            </Typography>
            <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                sx={{ mb: 2, width: '200px' }}
            >
                Register
            </Button>
            <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
                sx={{ width: '200px' }}
            >
                Login
            </Button>
        </Box>
    );
}

export default Landing;