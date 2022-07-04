import { RecoilRoot } from "recoil";
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App({ Component }) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <RecoilRoot>
        <Component />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
