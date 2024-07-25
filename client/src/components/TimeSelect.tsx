import React, { useState, useEffect, useRef } from 'react';
import ReactSelect, { MultiValue } from 'react-select';
import { DateTime } from 'luxon';
import { Typography, Slider, Box, Paper, Button } from '@mui/material';

interface CityOption {
    value: string;
    label: string;
}

const cityOptions: CityOption[] = [
    { value: 'America/New_York', label: 'New York' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
];

interface TimeBarProps {
    label: string;
    timezone: string;
    sliderHour: number;
    isHomeCity?: boolean;
}

const selectStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        color: 'black',
    }),
};

const TimeBar: React.FC<TimeBarProps> = ({ label, timezone, sliderHour, isHomeCity }) => {
    const currentHour = DateTime.now().setZone(timezone).hour;
    const sliderAdjustedHour = (currentHour + sliderHour + 24) % 24;
    const localHour = DateTime.now().hour;
    const timeDifference = sliderAdjustedHour - localHour;

    const hours = Array.from({ length: 24 }, (_, index) => {
        return DateTime.now().setZone(timezone).startOf('day').plus({ hours: index }).toFormat('h a');
    });
    const hoursRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hoursRef.current) {
            const hourWidth = 40;
            const containerWidth = hoursRef.current.clientWidth;
            const centerPoint = containerWidth / 2;
            const scrollPosition = sliderAdjustedHour * hourWidth - centerPoint + hourWidth / 2;
            hoursRef.current.scrollLeft = scrollPosition;
        }
    }, [sliderHour, timezone, sliderAdjustedHour]);

    return (
        <Box sx={{ my: 2, p: 2, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                    {isHomeCity && <Box component="span" sx={{ color: 'yellow', mr: 1 }}>⭐</Box>}
                    {label} ({timezone})
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {timeDifference >= 0 ? `+${timeDifference} hours` : `${timeDifference} hours`}
                </Typography>
            </Box>
            <Box ref={hoursRef} sx={{
                display: 'flex',
                overflowX: 'auto',
                width: '100%',
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none'
            }}>
                {hours.map((hour, index) => (
                    <Paper key={index} elevation={index === sliderAdjustedHour ? 4 : 1}
                        sx={{
                            width: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            m: '2px',
                            bgcolor: index === sliderAdjustedHour ? 'primary.main' : 'background.paper',
                            color: index === sliderAdjustedHour ? 'primary.contrastText' : 'text.primary'
                        }}>
                        {hour}
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

function TimeSelect() {
    const [homeCity, setHomeCity] = useState<CityOption | null>(null);
    const [additionalCities, setAdditionalCities] = useState<CityOption[]>([]);
    const [sliderHour, setSliderHour] = useState(0);
    const [localTime, setLocalTime] = useState(DateTime.now().toFormat('hh:mm a'));

    useEffect(() => {
        const fetchCities = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
                const data = await response.json();
                if (data.success) {
                    if (data.homeCity) {
                        const foundCity = cityOptions.find(option => option.value === data.homeCity);
                        if (foundCity) {
                            setHomeCity(foundCity);
                        }
                    }
                    if (data.savedCities) {
                        const savedCityOptions = data.savedCities.map((cityValue: string) =>
                            cityOptions.find(option => option.value === cityValue)).filter(Boolean) as CityOption[];
                        setAdditionalCities(savedCityOptions);
                    }
                }
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLocalTime(DateTime.now().toFormat('hh:mm a'));
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleResetSlider = () => {
        setSliderHour(0);
    };

    const handleCityChange = async (newValue: MultiValue<CityOption>) => {
        const newCityValues = newValue as CityOption[];
        setAdditionalCities(newCityValues);
        const userId = localStorage.getItem('userId');
        if (userId) {
            const cityValues = newCityValues.map(city => city.value);
            await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/savedCities`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ savedCities: cityValues }),
            });
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>Add Cities to Compare</Typography>
                <Typography variant="subtitle1" sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    Your Local Time: {localTime}
                </Typography>
            </Box>
            <ReactSelect
                options={cityOptions.filter(option => option.value !== homeCity?.value)}
                onChange={handleCityChange}
                isMulti
                value={additionalCities}
                getOptionLabel={(option: CityOption) => option.label}
                getOptionValue={(option: CityOption) => option.value}
                styles={selectStyles}
            />
            {homeCity && (
                <TimeBar
                    label={homeCity.label}
                    timezone={homeCity.value}
                    sliderHour={sliderHour}
                    isHomeCity={true}
                />
            )}
            {additionalCities.map(city => (
                <TimeBar key={city.value} label={city.label} timezone={city.value} sliderHour={sliderHour} />
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography gutterBottom>Adjust Time:</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResetSlider}
                    sx={{ ml: 2, padding: '4px 8px', fontSize: '0.75rem' }}
                    size="small"
                >
                    Reset to Local Time
                </Button>
            </Box>
            <Slider
                min={0}
                max={23}
                step={1}
                value={sliderHour}
                onChange={(e, newValue) => setSliderHour(newValue as number)}
                aria-labelledby="time-slider"
                marks
                valueLabelDisplay="auto"
            />
        </Box>
    );
}

export default TimeSelect;