
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, ThemeProvider } from '@mui/material';
import theme from '../theme';
import Landing from '../components/Landing';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            localStorage.setItem('userId', userId);
            localStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true);
            navigate('/');
        } else {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
        }
    }, [searchParams, navigate]);

    if (!isLoggedIn) {
        return <Landing />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                }}
            >
                <Nav />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexGrow: 1,
                        p: 2,
                    }}
                >
                    <Typography variant="h1" sx={{ mt: 4, mb: 2 }}>
                        Home Page
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Welcome back! Explore what's new!
                    </Typography>
                    <Button variant="contained" color="primary">
                        Explore
                    </Button>
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>
    );
}

export default Home;