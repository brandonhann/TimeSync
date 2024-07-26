import React, { useState, useEffect, useRef } from 'react';
import ReactSelect, { GroupBase, MultiValue } from 'react-select';
import { DateTime } from 'luxon';
import { Typography, Slider, Box, Paper, Button, alpha } from '@mui/material';
import { cityOptions, CityOption } from '../data/CityOptions';
import { selectStyles } from '../css/selectSyles'
import theme from '../theme';

interface TimeBarProps {
    label: string;
    timezone: string;
    sliderHour: number;
    isHomeCity?: boolean;
}

const TimeBar: React.FC<TimeBarProps> = ({ label, timezone, sliderHour, isHomeCity }) => {
    const currentHour = DateTime.now().setZone(timezone).hour;
    const sliderAdjustedHour = (currentHour + sliderHour + 24) % 24;
    const localHour = DateTime.now().hour;
    const timeDifference = sliderAdjustedHour - localHour;

    const parts = timezone.split('/');
    const region = parts[0].replace(/_/g, ' ');
    const cityName = parts.pop()!.replace(/_/g, ' ');
    const formattedLabel = `${cityName} (${region})`;

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
        <Box sx={{ backgroundColor: alpha(theme.palette.primary.dark, 0.5), boxShadow: 5, borderRadius: '4px', my: 2, p: 2, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                    {isHomeCity && <Box component="span" sx={{ color: 'yellow', mr: 1 }}>⭐</Box>}
                    {formattedLabel}
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
                {hours.map((hour, index) => {
                    const hourValue = parseInt(hour.slice(0, -3));
                    const isPM = hour.slice(-2) === 'PM';
                    const numericHour = (hourValue % 12) + (isPM ? 12 : 0);
                    const isNight = numericHour < 6 || numericHour >= 20;
                    const activeGradient = `linear-gradient(to bottom, #dc2626, #991b1b)`;
                    const nightGradient = `linear-gradient(to bottom, #1e40af, #172554)`;
                    const dayGradient = `linear-gradient(to bottom, #fef9c3, #fde047)`;

                    return (
                        <Paper key={index} elevation={index === sliderAdjustedHour ? 4 : 1}
                            sx={{
                                width: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                m: '2px',
                                p: '4px',
                                background: index === sliderAdjustedHour ? activeGradient :
                                    (isNight ? nightGradient : dayGradient),
                                color: index === sliderAdjustedHour ? '#fef2f2' : (isNight ? '#dbeafe' : '#422006')
                            }}>
                            <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1 }}>
                                {hour.slice(0, -3)}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
                                {hour.slice(-2)}
                            </Typography>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};

const TimeSelect = () => {
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

    const filteredAndGroupedOptions = cityOptions
        .filter(option => option !== homeCity && !additionalCities.includes(option))
        .reduce((groups, option) => {
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
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>Add Cities to Compare</Typography>
                <Typography variant="subtitle1" sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    Your Local Time: {localTime}
                </Typography>
            </Box>
            <ReactSelect
                options={filteredAndGroupedOptions}
                onChange={handleCityChange}
                isMulti
                value={additionalCities}
                formatGroupLabel={(group) => group.label}
                getOptionLabel={(option: CityOption) => option.displayLabel.split(' - ')[1]}
                getOptionValue={(option: CityOption) => option.value}
                styles={selectStyles}
            />
            {homeCity && (
                <TimeBar
                    label={homeCity.displayLabel2}
                    timezone={homeCity.value}
                    sliderHour={sliderHour}
                    isHomeCity={true}
                />
            )}
            {additionalCities.map(city => (
                <TimeBar key={city.value} label={city.displayLabel2} timezone={city.value} sliderHour={sliderHour} />
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