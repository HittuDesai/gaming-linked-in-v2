import { useState } from "react";
import { MessagesSection } from "./MessagesSection";

import {
	Avatar,
	Button,
	Grid,
	OutlinedInput,
	Typography,
	IconButton,
} from "@mui/material";

import { db } from "../firebase";
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	Timestamp,
	updateDoc,
} from "firebase/firestore";

import { useRouter } from "next/router";
import { Send } from "@mui/icons-material";

export function ChatArea({ messages, requestedUserData, loggedInUserData }) {
	const [currentMessages, setCurrentMessages] = useState(messages);
	const router = useRouter();
	const requestedUsername = requestedUserData?.username;

	const [chatText, setChatText] = useState("");
	const handleChatTextChange = event => {
		setChatText(event.target.value);
	};

	const handleSendText = () => {
		const loggedInUserChatDocument = doc(
			db,
			`users/${loggedInUserData.uid}/chats/${requestedUserData.uid}`
		);
		const requestedUserChatDocument = doc(
			db,
			`users/${requestedUserData.uid}/chats/${loggedInUserData.uid}`
		);
		const currentTime = Timestamp.now();
		const messageObject = {
			senderID: loggedInUserData.uid,
			messageText: chatText,
			messageTime: currentTime,
			reactions: [],
		};
		if (currentMessages.length === 0) {
			setDoc(loggedInUserChatDocument, {
				messages: [messageObject],
				media: [],
				startTimestamp: currentTime,
			})
				.then(() => {
					setDoc(requestedUserChatDocument, {
						messages: [messageObject],
						media: [],
						startTimestamp: currentTime,
					})
						.then(() => {
							getDoc(loggedInUserChatDocument)
								.then(snapshot => {
									const chatData = snapshot.data();
									const newMessages = chatData.messages;
									setChatText("");
									setCurrentMessages(newMessages);
								})
								.catch(error => console.log(error));
						})
						.catch(error => console.log(error));
				})
				.catch(error => console.log(error));
		} else {
			updateDoc(loggedInUserChatDocument, {
				messages: arrayUnion(messageObject),
			})
				.then(() => {
					updateDoc(requestedUserChatDocument, {
						messages: arrayUnion(messageObject),
					})
						.then(() => {
							getDoc(loggedInUserChatDocument)
								.then(snapshot => {
									const chatData = snapshot.data();
									const newMessages = chatData.messages;
									setChatText("");
									setCurrentMessages(newMessages);
								})
								.catch(error => console.log(error));
						})
						.catch(error => console.log(error));
				})
				.catch(error => console.log(error));
		}
	};

	return (
		<Grid
			container
			direction="column"
			alignItems="center"
			justifyContent="space-between"
			padding="1rem"
			sx={{ width: "100%", height: "100%" }}
		>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="end"
				rowGap="1rem"
			>
				<Avatar />
				<Typography
					fontSize="large"
					variant="overline"
					sx={{ lineHeight: "1.5rem", textTransform: "none" }}
				>
					{requestedUsername}
				</Typography>
				<Button
					variant="contained"
					onClick={() => router.push(`/${requestedUsername}/profile`)}
				>
					View Full Profile
				</Button>
			</Grid>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="end"
				rowGap="1rem"
			>
				<MessagesSection messages={currentMessages} />
				<OutlinedInput
					fullWidth
					value={chatText}
					onChange={handleChatTextChange}
					endAdornment={
						<IconButton onClick={handleSendText}>
							<Send />
						</IconButton>
					}
					sx={{ borderRadius: "10rem", paddingLeft: "0.6rem" }}
				/>
			</Grid>
		</Grid>
	);
}
