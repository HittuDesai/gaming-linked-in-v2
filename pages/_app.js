import { RecoilRoot } from "recoil";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";

function App({ Component }) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <RecoilRoot>
        <CssBaseline />
        <Component />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
