import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary,
    marginRight: theme.spacing(2),
}));

const Nav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                    <StyledLink to="/" sx={{ flexGrow: 1 }}>
                        TimeSync
                    </StyledLink>
                </Typography>
                <Box display="flex" alignItems="center">
                    <IconButton
                        component={Link}
                        to="/settings"
                        color="inherit"
                        sx={{ marginRight: 2 }}
                    >
                        <SettingsIcon />
                    </IconButton>
                    <Button color="error" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Nav;