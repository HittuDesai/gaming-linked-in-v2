import { useState } from "react";
import { useRouter } from "next/router";

import { Avatar, Box, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ErrorIcon from "@mui/icons-material/Error";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { useRecoilValue } from "recoil";
import { userdata } from "../../atoms/userAtom";

import { db } from "../../firebase"
import { arrayUnion, collection, doc, getDocs, updateDoc } from "firebase/firestore";

export default function UserFeedPage({ usersArray, requestedUserData }) {
    const router = useRouter();
    const loggedInUserData = useRecoilValue(userdata);
    const loggedInUserID = loggedInUserData?.uid;
    const requestedUserID = requestedUserData.uid;

    console.log(usersArray);

    if(!usersArray)
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <CircularProgress />
                <Typography fontSize="small" variant="overline" sx={{marginTop: "1rem"}}>Signing You In</Typography>
            </Grid>
        );

    if(!loggedInUserID)
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <CircularProgress />
                <Typography fontSize="small" variant="overline" sx={{marginTop: "1rem"}}>Fetching Your Data</Typography>
            </Grid>
        );

    if(requestedUserID !== loggedInUserID)
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <ErrorIcon fontSize="large" sx={{ color: "red" }}/>
                <Typography fontSize="small" variant="overline" color="red" sx={{marginTop: "1rem"}}>You do not have enough permissions</Typography>
            </Grid>
        );

    const [isFollowFinished, setIsFollowFinished] = useState(false);
    const handleFollow = userID => {
        setIsFollowFinished(true);
        const loggedInUserDocument = doc(db, `users/${loggedInUserID}`);
        const requestedUserDocument = doc(db, `users/${userID}`);
        updateDoc(requestedUserDocument, "followers", arrayUnion(loggedInUserID)).then(() => {
            updateDoc(loggedInUserDocument, "following", arrayUnion(userID)).then(() => {
                setIsFollowFinished(false);
            })
        })
    }

    return (
        <>
            <Grid container direction="column" padding="0 1rem">
                {
                    usersArray.map((user, index) => {
                        const userID = user.uid;
                        const username = user.username;
                        const followers = user.followers;
                        return (
                            <Grid container direction="row" alignItems="center" justifyContent="space-between">
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Avatar sx={{ marginRight: "1rem" }} />
                                    <Grid container direction="column">
                                        <Typography fontSize="large" variant="overline" sx={{ lineHeight: "1.5rem", textTransform: "none" }}>{username}</Typography>
                                        <Typography fontSize={"small"}>{followers?.length} followers</Typography>
                                    </Grid>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => router.push(`/${user.username}/profile`)}>
                                        <PersonSearchIcon />
                                    </IconButton>
                                    <LoadingButton sx={{ minWidth: "0" }} loading={isFollowFinished}>
                                        <PersonAddIcon onClick={() => handleFollow(userID)}/>
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { username } = params;

    let usersArray = [];
    let currentUserData = null;
    const usersCollectionReference = collection(db, "users");
    const querySnapshot = getDocs(usersCollectionReference);
    const allUsers = (await querySnapshot).forEach(user => {
        const userData = user.data();
        if(userData.username === username)
            currentUserData = userData;
        else
            usersArray.push(userData);
    })
    
    return { props: { usersArray, requestedUserData: currentUserData }};
}