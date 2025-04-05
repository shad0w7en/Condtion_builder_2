import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import ConditionBuilderDemo from './ConditionBuilderDemo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Condition Builder Demo
          </Typography>
          <Paper sx={{ p: 2 }}>
            <ConditionBuilderDemo />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;