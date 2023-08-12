import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    background: {
      default: '#313338'
    }
  },
  typography: {
    fontFamily: "'Noto Sans', sans-serif"
  },
  components: {
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true
      }
    }
  }
});
