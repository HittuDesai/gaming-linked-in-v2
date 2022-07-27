import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Box, Grid, TextField, Typography } from "@mui/material";

import { useSetRecoilState } from "recoil";
import { wantsToSignupBool } from "../atoms/loginAtom";

import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export function SignUp() {
	const router = useRouter();
	const [signupEmail, setSignupEmail] = useState("");
	const [signupEmailError, setSignupEmailError] = useState("");
	const [signupPassword, setSignupPassword] = useState("");
	const [signupPasswordError, setSignupPasswordError] = useState("");
	const [signupUsername, setSignupUsername] = useState("");
	const [signupUsernameError, setSignupUsernameError] = useState("");
	const setWantsToSignUp = useSetRecoilState(wantsToSignupBool);

	const auth = getAuth();
	const collectionReference = collection(db, "users");

	let allUsernames = [];
	getDocs(collectionReference)
		.then(querySnapshot => {
			querySnapshot.docs.forEach(doc => {
				allUsernames.push(doc.data().username);
			});
		})
		.catch(error => {
			console.log("Error in Getting All Usernames", error);
		});

	const handleSignUpWithEmail = () => {
		if (allUsernames.includes(signupUsername)) {
			setSignupUsernameError(
				"This Username is already taken. Please try another one"
			);
			return;
		}

		createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
			.then(userCredential => {
				const newUserID = userCredential.user.uid;
				const documentReference = doc(db, `users/${newUserID}`);
				setDoc(documentReference, {
					uid: newUserID,
					email: signupEmail,
					password: signupPassword,
					username: signupUsername,
					uploads: [],
					savedPosts: [],
					followers: [],
					following: [],
				}).then(() => {
					setSignupEmail("");
					setSignupPassword("");
					setSignupUsername("");
					setSignupEmailError("");
					setSignupPasswordError("");
					setSignupUsernameError("");
					setWantsToSignUp(false);
					router.replace(`/fetch/${newUserID}`);
				});
			})
			.catch(error => {
				console.log("error", error);
				const errorCode = error.code;
				if (errorCode === "auth/invalid-email")
					setSignupEmailError("This Email is invalid");
				else if (errorCode === "auth/email-already-in-use")
					setSignupPasswordError("This Email is already in use");
				else if (errorCode === "auth/weak-password")
					setSignupPasswordError("This Password is weak");
				else if (errorCode === "auth/internal-error")
					setSignupPasswordError(
						"There is some error at this time. Please try again later."
					);
				else
					setSignupPasswordError(
						"There is some error at this time. Please try again later."
					);
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
						label="Username"
						placeholder="Your Username"
						value={signupUsername}
						onChange={event =>
							setSignupUsername(event.target.value)
						}
						style={{ width: "100%" }}
						autoComplete="none"
					/>
					{signupUsernameError !== "" && (
						<Typography
							size="xs"
							style={{ fontStyle: "italic" }}
							weight="bolder"
							color="red"
						>
							{signupUsernameError}
						</Typography>
					)}
				</Box>

				<Box sx={{ width: "100%", padding: "0rem 1rem 1rem 1rem" }}>
					<TextField
						required
						fullWidth
						type="email"
						variant="filled"
						label="Email"
						placeholder="Your Email"
						onChange={event => setSignupEmail(event.target.value)}
						autoComplete="none"
						value={signupEmail}
					/>
					{signupEmailError !== "" && (
						<Typography
							size="xs"
							style={{ fontStyle: "italic" }}
							weight="bolder"
							color="red"
						>
							{signupEmailError}
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
							setSignupPassword(event.target.value)
						}
						autoComplete="none"
						value={signupPassword}
					/>
					{signupPasswordError !== "" && (
						<Typography
							size="xs"
							style={{ fontStyle: "italic" }}
							weight="bolder"
							color="red"
						>
							{signupPasswordError}
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
						onClick={event => handleSignUpWithEmail(event)}
						style={{ width: "100%" }}
					>
						Sign Up
					</Button>
				</Box>
			</Grid>
		</form>
	);
}
