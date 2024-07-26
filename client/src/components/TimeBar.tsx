import React, { useEffect, useRef } from 'react';
import { DateTime } from 'luxon';
import { Typography, Box, Paper, alpha } from '@mui/material';
import theme from '../theme';

interface TimeBarProps {
    label: string;
    timezone: string;
    sliderHour: number;
    isHomeCity?: boolean;
}

export const TimeBar: React.FC<TimeBarProps> = ({ label, timezone, sliderHour, isHomeCity }) => {
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
                    const isNight = numericHour < 6 || numericHour >= 19;
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