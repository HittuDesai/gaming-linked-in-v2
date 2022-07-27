import { HeaderAndBottomAdder } from "../../../components/HeaderAndBottomAdder";
import { ChatArea } from "../../../components/ChatArea";

import { db } from "../../../firebase";
import {
	collection,
	getDoc,
	getDocs,
	query,
	where,
	doc,
} from "firebase/firestore";

import { Grid, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

export default function UserHomePage({
	userFound,
	loggedInUserData,
	requestedUserData,
	messages,
}) {
	return (
		<HeaderAndBottomAdder>
			{userFound ? (
				<Grid
					container
					direction="column"
					alignItems="center"
					justifyContent="center"
					sx={{ width: "100vw", height: "87vh" }}
				>
					<ChatArea
						messages={messages}
						loggedInUserData={loggedInUserData}
						requestedUserData={requestedUserData}
					/>
				</Grid>
			) : (
				<Grid
					container
					direction="column"
					alignItems="center"
					justifyContent="center"
					sx={{ width: "100vw", height: "100vh" }}
				>
					<ErrorIcon fontSize="large" sx={{ color: "red" }} />
					<Typography
						fontSize="small"
						variant="overline"
						color="red"
						sx={{ marginTop: "1rem" }}
					>
						Error in fetching data
					</Typography>
					<Typography fontSize="small" variant="overline" color="red">
						Please trying signing in again
					</Typography>
				</Grid>
			)}
		</HeaderAndBottomAdder>
	);
}

export async function getServerSideProps(context) {
	const { params } = context;
	const { username, otherUsername } = params;
	if (username === otherUsername)
		return {
			redirect: {
				permanent: true,
				destination: `/`,
			},
		};

	const usersCollectionReference = collection(db, "users");
	const usernameQuery = query(
		usersCollectionReference,
		where("username", "==", username)
	);
	const querySnapshot = await getDocs(usernameQuery);
	const otherUsernameQuery = query(
		usersCollectionReference,
		where("username", "==", otherUsername)
	);
	const otherQuerySnapshot = await getDocs(otherUsernameQuery);
	const userFound = !(querySnapshot.empty || otherQuerySnapshot.empty);
	if (!userFound)
		return {
			redirect: {
				permanent: true,
				destination: `/`,
			},
		};
	const userData = querySnapshot.docs[0].data();
	const otherUserData = otherQuerySnapshot.docs[0].data();

	const chatDocumentReference = doc(
		db,
		`users/${userData.uid}/chats/${otherUserData.uid}`
	);
	const chatDocument = await getDoc(chatDocumentReference);
	const chatData = chatDocument.data();
	if (!chatData)
		return {
			props: {
				userFound,
				loggedInUserData: userData,
				requestedUserData: otherUserData,
				messages: [],
			},
		};

	const messages = chatData.messages;
	for (const message of messages) {
		message.messageTime = message.messageTime.toJSON();
	}

	return {
		props: {
			userFound,
			loggedInUserData: userData,
			requestedUserData: otherUserData,
			messages,
		},
	};
}
