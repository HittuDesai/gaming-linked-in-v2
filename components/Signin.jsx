import React, { useState } from "react";
import { Button, Box, Grid, TextField, Typography } from "@mui/material";

import { auth } from "../firebase";
import {
	signInWithEmailAndPassword,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { useRouter } from "next/router";

export function SignIn() {
	const router = useRouter();
	const [signinEmail, setSigninEmail] = useState("");
	const [signinEmailError, setSigninEmailError] = useState("");
	const [signinPassword, setSigninPassword] = useState("");
	const [signinPasswordError, setSigninPasswordError] = useState("");

	const handleSignIn = event => {
		event.preventDefault();
		if (signinEmail.length === 0) {
			setSigninEmailError("Email cannot be empty");
			setSigninPasswordError("");
			return;
		} else {
			const indexOfAtSymbol = signinEmail.indexOf("@");
			const indexOfPeriod = signinEmail.lastIndexOf(".");
			if (
				indexOfAtSymbol === -1 ||
				indexOfPeriod === -1 ||
				indexOfPeriod < indexOfAtSymbol ||
				indexOfPeriod === indexOfAtSymbol + 1
			) {
				setSigninEmailError("Email is not in the correct format");
				setSigninPasswordError("");
				return;
			}
		}

		if (signinPassword.length === 0) {
			setSigninEmailError("");
			setSigninPasswordError("Password cannot be empty");
			return;
		}

		setPersistence(auth, browserLocalPersistence).then(() => {
			signInWithEmailAndPassword(auth, signinEmail, signinPassword)
				.then(async userCredential => {
					const currentUserID = userCredential.user.uid;
					const usersCollectionReference = collection(db, "users");
					const usernameQuery = query(
						usersCollectionReference,
						where("uid", "==", currentUserID)
					);
					const querySnapshot = await getDocs(usernameQuery);
					const userFound = !querySnapshot.empty;
					if (userFound) {
						const currentUsername =
							querySnapshot.docs[0].data().username;
						router.push(`/${currentUsername}`);
					}
				})
				.catch(error => {
					const errorCode = error.code;
					if (errorCode === "auth/invalid-email") {
						setSigninEmailError("This Email is Invalid");
						setSigninPasswordError("");
					} else if (errorCode === "auth/wrong-password") {
						setSigninEmailError("");
						setSigninPasswordError("This Password is Wrong");
					} else {
						setSigninEmailError("");
						setSigninPasswordError(
							"There is some error at this time. Please try again later."
						);
					}
				});
		});
	};

	return (
		<form>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				sx={{ width: "100%", height: "100vh" }}
			>
				<Box sx={{ width: "100%", padding: "0rem 1rem 1rem 1rem" }}>
					<TextField
						required
						fullWidth
						type="email"
						variant="filled"
						label="Email"
						placeholder="Your Email"
						onChange={event => setSigninEmail(event.target.value)}
						autoComplete="none"
						value={signinEmail}
					/>
					{signinEmailError !== "" && (
						<Typography
							size="xs"
							style={{ fontStyle: "italic" }}
							weight="bolder"
							color="red"
						>
							{signinEmailError}
						</Typography>
					)}
				</Box>

				<Box sx={{ width: "100%", padding: "0rem 1rem 1rem 1rem" }}>
					<TextField
						required
						fullWidth
						variant="filled"
						label="Password"
						placeholder="Your Password"
						onChange={event =>
							setSigninPassword(event.target.value)
						}
						autoComplete="none"
						value={signinPassword}
					/>
					{signinPasswordError !== "" && (
						<Typography
							size="xs"
							style={{ fontStyle: "italic" }}
							weight="bolder"
							color="red"
						>
							{signinPasswordError}
						</Typography>
					)}
				</Box>

				<Box
					direction="row"
					position="center"
					style={{ width: "100%", padding: "0rem 1rem 0rem 1rem" }}
				>
					<Button
						variant="contained"
						onClick={event => handleSignIn(event)}
						style={{ width: "100%" }}
					>
						Sign In
					</Button>
				</Box>
			</Grid>
		</form>
	);
}
