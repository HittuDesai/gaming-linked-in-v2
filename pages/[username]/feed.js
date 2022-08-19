import { useEffect } from "react";
import { useRouter } from "next/router";
import { Post } from "../../components/Post";
import { HeaderAndBottomAdder } from "../../components/HeaderAndBottomAdder";
import { CircularProgress, Grid, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { useRecoilValue } from "recoil";
import { userdata } from "../../atoms/userAtom";

import { auth, db } from "../../firebase";
import {
	collection,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";

export default function UserFeedPage({ feedArray, requestedUserData }) {
	const loggedInUserData = useRecoilValue(userdata);
	const loggedInUserID = loggedInUserData?.uid;
	const requestedUserID = requestedUserData.uid;
	const router = useRouter();
	useEffect(() => {
		if (!loggedInUserID) router.push("/");
	}, []);

	useEffect(() => {
		const hasRedirectionHappened = localStorage.getItem(
			"hasRedirectionHappened"
		);
		if (hasRedirectionHappened) {
			localStorage.removeItem("hasRedirectionHappened");
			return;
		}
		if (window.performance.getEntries()[0].type === "reload") {
			localStorage.setItem("hasRedirectionHappened", true);
			router.push("/");
		}
	}, []);

	if (!feedArray)
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

	if (!loggedInUserID) {
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
	}

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
			<Grid
				container
				direction="column"
				padding="0 1rem"
				paddingTop="1rem"
			>
				{feedArray.map((post, index) => {
					return <Post key={index} post={post} />;
				})}
			</Grid>
		</HeaderAndBottomAdder>
	);
}

export async function getServerSideProps(context) {
	const { req, params } = context;
	const { headers } = req;
	const { referer } = headers;
	const { username } = params;

	let feedArray = [];
	const usersCollectionReference = collection(db, "users");
	const usernameQuery = query(
		usersCollectionReference,
		where("username", "==", username)
	);
	const querySnapshot = await getDocs(usernameQuery);
	const currentUserData = querySnapshot.docs[0].data();
	const currentUserID = currentUserData.uid;

	// const loggedInUserID = auth.currentUser.uid;
	// if (currentUserID !== loggedInUserID)
	// 	return {
	// 		redirect: {
	// 			destination: "/navigation/permissions",
	// 			permanent: true,
	// 		},
	// 	};

	const allPostsCollectionReference = collection(db, "/posts");
	const feedQuery = query(
		allPostsCollectionReference,
		where("uploaderID", "!=", currentUserID)
	);
	const allPostsSnapshot = await getDocs(feedQuery);
	const allPostDocuments = allPostsSnapshot.docs;

	for (const postDocument of allPostDocuments) {
		const postID = postDocument.id;
		const postData = postDocument.data();
		postData.time = postData.time.toJSON();
		postData.postID = postID;
		const postCommentsCollection = collection(
			db,
			`/posts/${postID}/comments`
		);
		const postCommentsSnapshot = await getDocs(postCommentsCollection);
		const numberOfComments = postCommentsSnapshot.docs.length;
		postData.numberOfComments = numberOfComments;
		feedArray.push(postData);
	}

	return { props: { feedArray, requestedUserData: currentUserData } };
}
