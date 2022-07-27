import { Feed } from "../../components/Feed";
import { UploadModal } from "../../components/UploadModal";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { Grid, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

export default function UserHomePage({ userFound }) {
	return (
		<>
			{userFound ? (
				<Grid
					container
					direction="column"
					alignItems="center"
					justifyContent="center"
					sx={{ width: "100vw", height: "100vh" }}
				>
					<UploadModal />
					<Feed />
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
		</>
	);
}

export async function getServerSideProps(context) {
	const { params } = context;
	const { username } = params;

	const usersCollectionReference = collection(db, "users");
	const usernameQuery = query(
		usersCollectionReference,
		where("username", "==", username)
	);
	const querySnapshot = await getDocs(usernameQuery);
	const userFound = !querySnapshot.empty;
	if (userFound)
		return {
			redirect: {
				permanent: true,
				destination: `/${username}/feed`,
			},
		};
	return {
		redirect: {
			permanent: true,
			destination: `/`,
		},
	};
}
