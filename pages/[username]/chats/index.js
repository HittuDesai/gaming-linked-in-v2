import { ChatsPageUser } from "../../../components/ChatsPageUser";
import { HeaderAndBottomAdder } from "../../../components/HeaderAndBottomAdder";

import {
	CircularProgress,
	Grid,
	TextField,
	Typography,
	Autocomplete,
	Box,
	Avatar,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { useRecoilValue } from "recoil";
import { userdata } from "../../../atoms/userAtom";

import { db } from "../../../firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";

import { Search } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function UserChatsPage({
	usersArray,
	requestedUserData,
	allChatsUsers,
}) {
	const router = useRouter();
	const loggedInUserData = useRecoilValue(userdata);
	const loggedInUserID = loggedInUserData?.uid;
	const requestedUserID = requestedUserData.uid;

	if (!usersArray)
		return (
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				sx={{ width: "100vw", height: "100vh" }}
			>
				<CircularProgress />
				<Typography
					fontSize="small"
					variant="overline"
					sx={{ marginTop: "1rem" }}
				>
					Signing You In
				</Typography>
			</Grid>
		);

	if (!loggedInUserID)
		return (
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				sx={{ width: "100vw", height: "100vh" }}
			>
				<CircularProgress />
				<Typography
					fontSize="small"
					variant="overline"
					sx={{ marginTop: "1rem" }}
				>
					Fetching Your Data
				</Typography>
			</Grid>
		);

	if (requestedUserID !== loggedInUserID)
		return (
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
					You do not have enough permissions
				</Typography>
			</Grid>
		);

	return (
		<HeaderAndBottomAdder>
			<Grid container direction="column" padding="0 1rem">
				<Autocomplete
					options={usersArray}
					renderInput={params => (
						<TextField fullWidth {...params} label="Search" />
					)}
					getOptionLabel={option => option.username}
					renderOption={(props, option) => {
						const username = option.username;
						const followers = option.followers;
						return (
							<Box
								key={option.uid}
								{...props}
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingLeft: "1rem",
								}}
							>
								<Avatar sx={{ marginRight: "1rem" }} />
								<Grid container direction="column">
									<Typography
										fontSize="large"
										variant="overline"
										sx={{
											lineHeight: "1.5rem",
											textTransform: "none",
										}}
									>
										{username}
									</Typography>
									<Typography fontSize={"small"}>
										{followers?.length} followers
									</Typography>
								</Grid>
							</Box>
						);
					}}
					onChange={(event, option) => {
						if (!option) return;
						const usernameOfOtherPerson = option.username;
						const currentAsPath = router.asPath;
						router.push(
							`${currentAsPath}/${usernameOfOtherPerson}`
						);
					}}
					autoComplete
					selectOnFocus
					clearIcon={null}
					popupIcon={<Search />}
					sx={{ width: "100%" }}
				/>
				{/* {allChatsUsers.map((user, index) => (
					<ChatsPageUser key={index} user={user} />
				))} */}
			</Grid>
		</HeaderAndBottomAdder>
	);
}

export async function getServerSideProps(context) {
	const { params } = context;
	const { username } = params;

	// let usersArray = [];
	// let currentUserData = null;
	// const usersCollectionReference = collection(db, "users");
	// const usersSnapshot = getDocs(usersCollectionReference);
	// (await usersSnapshot).forEach(user => {
	// 	const userData = user.data();
	// 	if (userData.username === username) currentUserData = userData;
	// 	else usersArray.push(userData);
	// });

	const usersCollectionReference = collection(db, "users");
	const usernameQuery = query(
		usersCollectionReference,
		where("username", "==", username)
	);
	const querySnapshot = await getDocs(usernameQuery);
	const currentUserData = querySnapshot.docs[0].data();

	// const currentUserID = currentUserData.uid;
	// const chatsCollectionReference = collection(
	// 	db,
	// 	`users/${currentUserID}/chats`
	// );
	// const chatsSnapshot = getDocs(chatsCollectionReference);
	// let allOtherUserIDsWithChats = [];
	// (await chatsSnapshot).forEach(chatDocument => {
	// 	const chatID = chatDocument.id;
	// 	allOtherUserIDsWithChats.push(chatID);
	// });

	// let allOtherUserDatasWithChats = [];
	// for (const userID of allOtherUserIDsWithChats) {
	// 	const userDocumentReference = doc(db, `users/${userID}`);
	// 	const userSnapshot = await getDoc(userDocumentReference);
	// 	const userData = userSnapshot.data();
	// 	allOtherUserDatasWithChats.push(userData);
	// }

	return {
		props: {
			usersArray,
			requestedUserData: currentUserData,
			// allChatsUsers: allOtherUserDatasWithChats,
		},
	};
}
