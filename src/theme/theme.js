import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5"
    },
    secondary: {
      main: "#14B8A6"
    },
    background: {
      default: "#F9FAFB"
    }
  },

  typography: {
    fontFamily: "Poppins, Roboto, sans-serif"
  }
});

export default theme;