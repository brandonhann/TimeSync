import React, { useState, useEffect } from 'react';
import ReactSelect, { GroupBase, MultiValue } from 'react-select';
import { DateTime } from 'luxon';
import { Typography, Slider, Box, Button } from '@mui/material';
import { cityOptions, CityOption } from '../data/CityOptions';
import { selectStyles } from '../css/selectSyles'
import { TimeBar } from './TimeBar';

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