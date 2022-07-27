import { RecoilRoot } from "recoil";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function App({ Component, pageProps }) {
	const darkTheme = createTheme({
		palette: {
			mode: "dark",
		},
	});

	return (
		<ThemeProvider theme={darkTheme}>
			<RecoilRoot>
				<CssBaseline />
				<Component {...pageProps} />
			</RecoilRoot>
		</ThemeProvider>
	);
}

export default App;
