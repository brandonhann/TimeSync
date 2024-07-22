import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1e293b',
        },
        secondary: {
            main: '#334155',
        },
        text: {
            primary: '#f1f5f9',
            secondary: '#60a5fa',
        },
    },
});

export default theme;