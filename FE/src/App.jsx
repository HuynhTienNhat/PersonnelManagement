import { CssBaseline, ThemeProvider, createTheme,Box } from "@mui/material";
import EmployeeList from "./component/employee-list";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#7c4dff", // Purple color for primary actions (e.g., View Details)
    },
    secondary: {
      main: "#2196f3", // Blue color for secondary actions (optional)
    },
    error: {
      main: "#f44336", // Red color for delete actions
    },
    background: {
      default: "#f5f5f5", // Light gray background for the whole app
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 700, // Bold heading for consistency
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 20, // Rounded buttons for modern look
          padding: "8px 16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Consistent rounded corners for Paper components
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Subtle shadow for depth
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "24px", // Increased padding for better spacing
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh", // Ensure the app fills the entire viewport height
          bgcolor: "background.default", // Apply the default background color
          width: "100%", // Ensure full width
          overflowX: "hidden", // Prevent horizontal overflow
        }}
      >
        <EmployeeList />
      </Box>
    </ThemeProvider>
  );
}

export default App;