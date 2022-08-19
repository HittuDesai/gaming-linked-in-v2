import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HeaderAndBottomAdder } from "../../components/HeaderAndBottomAdder";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	Typography,
	Divider,
	Button,
	Box,
	TextField,
	IconButton,
	CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { userdata } from "../../atoms/userAtom";

export default function UserFeedPage() {
	const [loggedInUserData, setLoggedInUserData] = useRecoilState(userdata);
	const loggedInUserID = loggedInUserData?.uid;
	const router = useRouter();
	useEffect(() => {
		if (!loggedInUserID) router.push("/");
	}, []);

	const [file, setFile] = useState(null);
	const [caption, setCaption] = useState("");
	const [altText, setAltText] = useState("");
	const [currentStep, setCurrentStep] = useState("Upload Media");

	const [uploadMediaExpanded, setUploadMediaExpanded] = useState(true);
	const [postDescriptionExpanded, setPostDescriptionExpanded] =
		useState(false);
	const [postDescriptionDisabled, setPostDescriptionDisabled] =
		useState(true);
	const [selectTagsExpanded, setSelectTagsExpanded] = useState(false);
	const [selectTagsDisabled, setSelectTagsDisabled] = useState(true);

	const UploadingComponent = () => (
		<>
			<CircularProgress />
			<Typography>Uploading Your Post</Typography>
		</>
	);

	const handleOnPost = () => {
		if (file === null || caption === "") {
			console.log("You need to select a file and write a caption");
			return;
		}

		setCurrentStep("Uploading Post");
		const postsCollection = collection(db, "posts");
		const userDocument = doc(db, `users/${currentUserID}`);
		const uploadTimestamp = serverTimestamp();
		const currentUsername = currentUserData.username;
		var uploadData = {
			numberOfLikes: 0,
			likedBy: [],
			time: uploadTimestamp,
			caption: caption,
			uploaderID: currentUserID,
			uploaderUsername: currentUsername,
			// uploaderDP: currentUserData.dp,
		};

		const imageRef = ref(storage, `${currentUserID}/uploads/${file.name}`);
		uploadBytes(imageRef, file)
			.then(snapshot => {
				getDownloadURL(snapshot.ref)
					.then(url => {
						uploadData = { ...uploadData, url: url };
						addDoc(postsCollection, uploadData)
							.then(response => {
								const idOfAddedDocument = response.id;
								updateDoc(userDocument, {
									uploads: arrayUnion(idOfAddedDocument),
									numPosts: increment(1),
								})
									.then(() => {
										setFile(null);
										setAltText("");
										setCaption("");
										setDialogActionDisabled(true);
										setCurrentStep("Upload Media");
										router.push(
											`/${currentUsername}/profile`
										);
									})
									.catch(error => console.log(error));
							})
							.catch(error => {
								console.log(
									"ERROR IN ADDING DOCUMENT TO UPLOADS COLLECTION",
									error
								);
							});
					})
					.catch(error => {
						console.log(
							"ERROR IN GETTING DOWNLOAD URL FOR UPLOADED IMAGE",
							error
						);
					});
			})
			.catch(error => {
				console.log("ERROR IN IMAGE UPLOAD", error);
			});
	};

	return (
		<HeaderAndBottomAdder>
			<Grid container flexDirection="column">
				{currentStep === "Uploading Post" ? (
					<UploadingComponent />
				) : (
					<>
						<Accordion expanded={uploadMediaExpanded}>
							<AccordionSummary
								expandIcon={
									<IconButton
										onClick={() =>
											setUploadMediaExpanded(
												value => !value
											)
										}
									>
										<ExpandMoreIcon />
									</IconButton>
								}
							>
								Upload Media
							</AccordionSummary>
							<AccordionDetails>
								<Grid
									container
									direction="column"
									alignItems="center"
									justifyContent="center"
									sx={{
										minHeight: "400px",
										padding: "1rem",
									}}
								>
									{file ? (
										<>
											<Box
												sx={{
													width: "100%",
													background: "red",
													aspectRatio: "1",
												}}
											>
												IMAGE CHOSEN SUCCESSFULLY
											</Box>
											<Grid
												container
												direction="row"
												alignItems="center"
												justifyContent="center"
												columnGap="1rem"
											>
												<Button
													variant="outlined"
													onClick={() => {
														setFile(null);
														setCurrentStep(
															"Upload Media"
														);
														setPostDescriptionDisabled(
															true
														);
														setPostDescriptionExpanded(
															false
														);
														setSelectTagsDisabled(
															true
														);
														setSelectTagsExpanded(
															false
														);
													}}
													sx={{
														marginTop: "1rem",
													}}
												>
													Back
												</Button>
												<Button
													variant="contained"
													onClick={() => {
														setUploadMediaExpanded(
															false
														);
														setCurrentStep(
															"Post Description"
														);
														setPostDescriptionExpanded(
															true
														);
														setPostDescriptionDisabled(
															false
														);
													}}
													sx={{
														marginTop: "1rem",
														flexGrow: 1,
													}}
												>
													Next
												</Button>
											</Grid>
										</>
									) : (
										<>
											<CloudUploadIcon
												fontSize="large"
												sx={{ marginBottom: "1rem" }}
											/>
											<Typography
												align="center"
												fontSize="medium"
												variant="caption"
												sx={{ margin: "0 1rem" }}
											>
												Drag and Drop a Photo
											</Typography>
											<Divider
												sx={{
													width: "100%",
													padding: "1rem",
												}}
											>
												OR
											</Divider>
											<input
												type="file"
												accept="image/*"
												style={{ display: "none" }}
												id="raised-button-file"
												onChange={event => {
													setFile(
														event.target.files[0]
													);
												}}
											/>
											<label htmlFor="raised-button-file">
												<Button
													variant="contained"
													component="span"
													sx={{ width: "100%" }}
												>
													Select a File
												</Button>
											</label>
										</>
									)}
								</Grid>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={postDescriptionExpanded}
							disabled={postDescriptionDisabled}
						>
							<AccordionSummary
								expandIcon={
									<IconButton
										onClick={() =>
											setPostDescriptionExpanded(
												value => !value
											)
										}
									>
										<ExpandMoreIcon />
									</IconButton>
								}
							>
								Post Description
							</AccordionSummary>
							<AccordionDetails>
								<TextField
									required
									fullWidth
									variant="filled"
									label="Caption"
									placeholder="Write a caption"
									onChange={event =>
										setCaption(event.target.value)
									}
									autoComplete="none"
									value={caption}
									sx={{ marginBottom: "1rem" }}
								/>
								<Accordion sx={{ width: "100%" }}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
									>
										Accesibility
									</AccordionSummary>
									<AccordionDetails>
										<TextField
											fullWidth
											variant="filled"
											placeholder="Write alt text"
											onChange={event =>
												setAltText(event.target.value)
											}
											autoComplete="none"
											value={altText}
											sx={{ marginBottom: "1rem" }}
										/>
									</AccordionDetails>
								</Accordion>
								<Grid
									container
									direction="row"
									alignItems="center"
									justifyContent="center"
									columnGap="1rem"
								>
									<Button
										variant="outlined"
										onClick={() => {
											setCurrentStep("Upload Media");
											setPostDescriptionExpanded(false);
											setUploadMediaExpanded(true);
										}}
										sx={{
											marginTop: "1rem",
										}}
									>
										Back
									</Button>
									<Button
										variant="contained"
										onClick={() => {
											setPostDescriptionExpanded(false);
											setCurrentStep("Select Tags");
											setSelectTagsExpanded(true);
											setSelectTagsDisabled(false);
										}}
										sx={{
											marginTop: "1rem",
											flexGrow: 1,
										}}
										disabled={!caption}
									>
										Next
									</Button>
								</Grid>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={selectTagsExpanded}
							disabled={selectTagsDisabled}
						>
							<AccordionSummary
								expandIcon={
									<IconButton
										onClick={() =>
											setSelectTagsExpanded(
												value => !value
											)
										}
									>
										<ExpandMoreIcon />
									</IconButton>
								}
							>
								Select Tags
							</AccordionSummary>
							<AccordionDetails>
								<Typography variant="overline">
									Please Select Tags
								</Typography>
								<Grid
									container
									direction="row"
									alignItems="center"
									justifyContent="center"
									columnGap="1rem"
								>
									<Button
										variant="outlined"
										onClick={() => {
											setCurrentStep("Post Description");
											setSelectTagsExpanded(false);
											setPostDescriptionExpanded(true);
										}}
										sx={{
											marginTop: "1rem",
										}}
									>
										Back
									</Button>
									<Button
										variant="contained"
										onClick={handleOnPost}
										sx={{
											marginTop: "1rem",
											flexGrow: 1,
										}}
										disabled={true}
									>
										Post
									</Button>
								</Grid>
							</AccordionDetails>
						</Accordion>
					</>
				)}
			</Grid>
		</HeaderAndBottomAdder>
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
	const currentUserData = querySnapshot.docs[0].data();

	return { props: { requestedUserData: currentUserData } };
}
