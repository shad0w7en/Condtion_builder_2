
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import ConditionBuilderDemo from './ConditionBuilderDemo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d50000',
      light: '#ef5350',
    },
    secondary: {
      main: '#555555',
      light: 'f5f5f5'
    },
  }, typography: {
    htmlFontSize: 18,
  }
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