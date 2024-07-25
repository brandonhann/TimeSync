import React, { useState, useEffect } from 'react';
import theme from '../theme';
import { Box, Typography, Container, CssBaseline, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactSelect, { GroupBase } from 'react-select';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { cityOptions, CityOption } from '../data/CityOptions';
import { selectStyles } from '../css/selectSyles';

interface User {
    name: string;
    email: string;
}

const Settings: React.FC = () => {
    const [homeCity, setHomeCity] = useState<CityOption | null>(null);
    const [savedCities, setSavedCities] = useState<CityOption[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
                const data = await response.json();
                if (data.success) {
                    setUserInfo(data.user);
                    const foundHomeCity = cityOptions.find(option => option.value === data.homeCity);
                    if (foundHomeCity) {
                        setHomeCity(foundHomeCity);
                    }
                    const savedCityOptions = cityOptions.filter(option => data.savedCities.includes(option.value));
                    setSavedCities(savedCityOptions);
                }
            }
        };

        fetchUserInfo();
    }, []);

    const handleHomeCityChange = async (newValue: CityOption | null) => {
        setHomeCity(newValue);
        const userId = localStorage.getItem('userId');
        if (userId && newValue) {
            await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/homeCity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ homeCity: newValue.value }),
            });
        }
    };

    const handleRemoveHomeCity = async () => {
        setHomeCity(null);
        const userId = localStorage.getItem('userId');
        if (userId) {
            await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/homeCity`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    };

    // Filter and group options excluding the saved cities and the current home city
    const filteredCityOptions = cityOptions.filter(option => !savedCities.some(city => city.value === option.value) && option !== homeCity);
    const groupedHomeCityOptions = filteredCityOptions.reduce((groups, option) => {
        const groupIndex = groups.findIndex(group => group.label === option.region);
        if (groupIndex !== -1) {
            const newGroup = { ...groups[groupIndex] };
            newGroup.options = [...newGroup.options, option];
            groups = [...groups.slice(0, groupIndex), newGroup, ...groups.slice(groupIndex + 1)];
        } else {
            groups.push({ label: option.region, options: [option] });
        }
        return groups;
    }, [] as GroupBase<CityOption>[]);

    return (
        <ThemeProvider theme={theme}>
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
                            options={groupedHomeCityOptions}
                            onChange={handleHomeCityChange}
                            value={homeCity}
                            formatGroupLabel={(group) => group.label}
                            getOptionLabel={(option: CityOption) => option.displayLabel.split(' - ')[1]}
                            getOptionValue={(option: CityOption) => option.value}
                            styles={selectStyles}
                        />
                        {homeCity && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRemoveHomeCity}
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#f44336',
                                    '&:hover': {
                                        backgroundColor: '#d32f2f',
                                    }
                                }}
                            >
                                Remove
                            </Button>
                        )}
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