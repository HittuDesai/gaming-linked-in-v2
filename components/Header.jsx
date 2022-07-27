import { useEffect } from "react";
import { AppBar, Button, Grid, Typography } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import { useRecoilState, useSetRecoilState } from "recoil";
import { wantsToSigninBool, wantsToSignupBool } from "../atoms/loginAtom";
import { userdata, userid, username } from "../atoms/userAtom";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";

export function Header() {
	const router = useRouter();
	const setCurrentUserData = useSetRecoilState(userdata);
	const [currentUserID, setCurrentUserID] = useRecoilState(userid);
	const [currentUsername, setCurrentUsername] = useRecoilState(username);
	const [wantsToSignin, setWantsToSignin] = useRecoilState(wantsToSigninBool);
	const [wantsToSignup, setWantsToSignup] = useRecoilState(wantsToSignupBool);

	useEffect(() => {
		router.push(`/${currentUsername}`);
	}, [currentUsername, router]);

	onAuthStateChanged(auth, userCredentials => {
		if (!userCredentials) {
			setCurrentUserID(null);
			router.push("/");
			return;
		}

		const currentUserID = userCredentials.uid;
		const userDocumentReference = doc(db, `users/${currentUserID}`);
		getDoc(userDocumentReference)
			.then(querySnapshot => {
				const currentUserData = querySnapshot.data();
				setCurrentUserID(currentUserID);
				setCurrentUserData(currentUserData);
				const loggedInUsername = currentUserData.username;
				setCurrentUsername(loggedInUsername);
			})
			.catch(error => console.log(error));
	});

	const HeaderWithoutSession = () => (
		<AppBar position="static">
			<Grid
				container
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				padding="1rem"
			>
				<SportsEsportsIcon />
				{wantsToSignin || wantsToSignup ? (
					<Button
						variant="text"
						onClick={() => {
							setWantsToSignin(false);
							setWantsToSignup(false);
						}}
					>
						Cancel
					</Button>
				) : (
					<div>
						<Button
							variant="text"
							onClick={() => setWantsToSignin(true)}
						>
							Sign In
						</Button>
						<Button
							variant="contained"
							onClick={() => setWantsToSignup(true)}
						>
							Sign Up
						</Button>
					</div>
				)}
			</Grid>
		</AppBar>
	);

	const currentAsPath = router.asPath;
	const individualPaths = currentAsPath.split("/");

	const HeaderWithSession = () => (
		<AppBar position="static">
			<Grid
				container
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				padding="1rem"
			>
				<SportsEsportsIcon />
				<Typography variant="overline" fontSize="large">
					Hittugram
				</Typography>
			</Grid>
		</AppBar>
	);

	return (
		<>{currentUserID ? <HeaderWithSession /> : <HeaderWithoutSession />}</>
	);
}
