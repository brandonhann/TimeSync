import React, { useState, useEffect, useRef } from 'react';
import ReactSelect from 'react-select';
import { DateTime } from 'luxon';
import { Typography, Slider, Box, Paper } from '@mui/material';

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
        <Box sx={{ my: 2, p: 2, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            {isHomeCity && <Box component="span" sx={{ color: 'yellow', mr: 1 }}>⭐</Box>}
            <Typography variant="subtitle1" gutterBottom sx={{ mr: 2 }}>
                {label} ({timezone})
            </Typography>
            <Box ref={hoursRef} sx={{
                display: 'flex',
                overflowX: 'auto',
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

    useEffect(() => {
        const fetchHomeCity = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
                const data = await response.json();
                if (data.success && data.homeCity) {
                    const foundCity = cityOptions.find(option => option.value === data.homeCity);
                    if (foundCity) {
                        setHomeCity(foundCity);
                    }
                }
            }
        };

        fetchHomeCity();
    }, []);

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>Add Cities to Compare</Typography>
            <ReactSelect
                options={cityOptions.filter(option => option.value !== homeCity?.value)}
                onChange={(newValue: any) => setAdditionalCities(newValue || [])}
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
            <Typography gutterBottom>Adjust Time:</Typography>
            <Slider
                min={1}
                max={24}
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