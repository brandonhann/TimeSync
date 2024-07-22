import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.secondary,
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body1" align="center">
                    TimeSync © {new Date().getFullYear()}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;