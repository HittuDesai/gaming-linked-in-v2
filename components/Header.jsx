import { useEffect } from "react";
import { useRouter } from "next/router";
import { AppBar, Button, Grid, Typography } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import { useRecoilState, useRecoilValue } from "recoil";
import { wantsToSigninBool, wantsToSignupBool } from "../atoms/loginAtom";
import { userid, username } from "../atoms/userAtom";
import { auth } from "../firebase";

export function Header() {
	const router = useRouter();
	const loggedInUsername = useRecoilValue(username);
	useEffect(() => {
		const currentUser = auth.currentUser;
		if (currentUser && router.asPath === "/")
			router.push(`/${loggedInUsername}`);
	}, [router]);

	const currentUserID = useRecoilValue(userid);
	const [wantsToSignin, setWantsToSignin] = useRecoilState(wantsToSigninBool);
	const [wantsToSignup, setWantsToSignup] = useRecoilState(wantsToSignupBool);

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
