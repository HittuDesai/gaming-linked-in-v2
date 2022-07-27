import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MessagesSection } from "./MessagesSection";

import {
	Avatar,
	Grid,
	OutlinedInput,
	Typography,
	IconButton,
	Box,
	Paper,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { db } from "../firebase";
import {
	arrayUnion,
	doc,
	getDoc,
	setDoc,
	Timestamp,
	updateDoc,
} from "firebase/firestore";

export function ChatArea({ messages, requestedUserData, loggedInUserData }) {
	const [currentMessages, setCurrentMessages] = useState(messages);
	const router = useRouter();
	const requestedUsername = requestedUserData?.username;

	const [chatText, setChatText] = useState("");
	const handleChatTextChange = event => {
		setChatText(event.target.value);
	};

	const handleSendText = () => {
		if (chatText === "") return;

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

	const enclosingGridRef = useRef(null);
	const inputRef = useRef(null);
	const [heightOfMessageSection, setMessageSectionHeight] = useState(0);
	useEffect(() => {
		const heightOfEnclosingGrid = enclosingGridRef.current.clientHeight;
		const heightOfInputField = inputRef.current.clientHeight;
		setMessageSectionHeight(heightOfEnclosingGrid - heightOfInputField);
	}, []);

	return (
		<>
			<Paper elevation={24} sx={{ width: "100%" }}>
				<Grid
					container
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ width: "100%", padding: "1rem" }}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ marginRight: "0.5rem" }} />
						<Typography
							fontSize="large"
							variant="overline"
							sx={{ lineHeight: "1.5rem", textTransform: "none" }}
						>
							{requestedUsername}
						</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<IconButton
							onClick={() =>
								router.push(`/${requestedUsername}/profile`)
							}
						>
							<PersonSearchIcon />
						</IconButton>
						<IconButton onClick={() => router.back()}>
							<ArrowBackIcon />
						</IconButton>
					</Box>
				</Grid>
			</Paper>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="end"
				sx={{
					flexGrow: 1,
					borderColor: "green",
				}}
			>
				<Grid flexGrow={1} ref={enclosingGridRef} padding="1rem">
					<MessagesSection
						messages={currentMessages}
						height={heightOfMessageSection}
					/>
				</Grid>
				<Grid padding="0 1rem" sx={{ width: "100%" }}>
					<OutlinedInput
						ref={inputRef}
						fullWidth
						value={chatText}
						onChange={handleChatTextChange}
						endAdornment={
							<IconButton onClick={handleSendText}>
								<Send />
							</IconButton>
						}
						sx={{
							borderRadius: "10rem",
							paddingLeft: "0.6rem",
						}}
						onKeyDown={event => {
							const keyCode = event.code;
							if (keyCode !== "Enter") return;
							handleSendText();
						}}
					/>
				</Grid>
			</Grid>
		</>
	);
}
