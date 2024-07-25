import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReactSelect from 'react-select';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

interface CityOption {
    value: string;
    label: string;
}

const cityOptions: CityOption[] = [
    { value: 'America/New_York', label: 'New York' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
];

const selectStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        color: 'black',
    }),
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1d1d1d',
        },
        text: {
            primary: '#ffffff',
        },
    },
});

interface User {
    name: string;
    email: string;
}

const Settings: React.FC = () => {
    const [homeCity, setHomeCity] = useState<CityOption | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
                const data = await response.json();
                if (data.success) {
                    setUserInfo(data.user);
                }
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const savedHomeCity = localStorage.getItem('homeCity');
        if (savedHomeCity) {
            setHomeCity(JSON.parse(savedHomeCity));
        }
    }, []);

    useEffect(() => {
        if (homeCity) {
            localStorage.setItem('homeCity', JSON.stringify(homeCity));
        }
    }, [homeCity]);

    const handleHomeCityChange = (newValue: CityOption | null) => {
        setHomeCity(newValue);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <Nav />
                <Container component="main" sx={{ flexGrow: 1, my: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Settings
                    </Typography>
                    {userInfo && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6">Account Information</Typography>
                            <Typography>Name: {userInfo.name}</Typography>
                            <Typography>Email: {userInfo.email}</Typography>
                        </Box>
                    )}
                    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
                        <Typography variant="h6" gutterBottom>Select Your Home City</Typography>
                        <ReactSelect
                            options={cityOptions}
                            onChange={handleHomeCityChange}
                            value={homeCity}
                            getOptionLabel={(option: CityOption) => option.label}
                            getOptionValue={(option: CityOption) => option.value}
                            styles={selectStyles}
                        />
                    </Box>
                </Container>
                <Box sx={{ mt: 'auto' }}>
                    <Footer />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Settings;