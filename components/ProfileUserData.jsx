import { useEffect, useState } from "react";
import { Avatar, Box, Button, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LogoutIcon from '@mui/icons-material/Logout';

import { auth, db } from "../firebase";
import { arrayUnion, doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { userdata } from "../atoms/userAtom";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { red } from "@mui/material/colors";

export function ProfileUserData({ requestedUserData }) {
    const [displayUserData, setDisplayUserData] = useState(requestedUserData);
    const setLoggedInUserData = useSetRecoilState(userdata);
    const loggedInUserData = useRecoilValue(userdata);
    const loggedInUserID = loggedInUserData?.uid;
    const loggedInUserFollowing = loggedInUserData?.following;
    const requestedUserID = displayUserData.uid;
    const numPosts = displayUserData.uploads?.length || 0;
    const numFollowers = displayUserData.followers?.length || 0;
    const numFollowing = displayUserData.following?.length || 0;

    const [isFollowFinished, setIsFollowFinished] = useState(false);
    const handleFollow = () => {
        setIsFollowFinished(true);
        const loggedInUserDocument = doc(db, `users/${loggedInUserID}`);
        const requestedUserDocument = doc(db, `users/${requestedUserID}`);
        updateDoc(requestedUserDocument, "followers", arrayUnion(loggedInUserID)).then(() => {
            updateDoc(loggedInUserDocument, "following", arrayUnion(requestedUserID)).then(() => {
                getDoc(requestedUserDocument)
                .then(snapshot => setDisplayUserData(snapshot.data()))
                .then(() => {
                    getDoc(loggedInUserDocument)
                    .then(snapshot => setLoggedInUserData(snapshot.data()))
                    .then(() => setIsFollowFinished(false));
                });
            })
        })
    }

    const [isRemoveFollowFinished, setIsRemoveFollowFinished] = useState(false);
    const handleRemoveFollow = () => {
        setIsRemoveFollowFinished(true);
        const loggedInUserDocument = doc(db, `users/${loggedInUserID}`);
        const requestedUserDocument = doc(db, `users/${requestedUserID}`);
        updateDoc(requestedUserDocument, "followers", arrayRemove(loggedInUserID)).then(() => {
            updateDoc(loggedInUserDocument, "following", arrayRemove(requestedUserID)).then(() => {
                getDoc(requestedUserDocument)
                .then(snapshot => setDisplayUserData(snapshot.data()))
                .then(() => {
                    getDoc(loggedInUserDocument)
                    .then(snapshot => setLoggedInUserData(snapshot.data()))
                    .then(() => setIsRemoveFollowFinished(false));
                });
            })
        })
    }

    return (
        <Stack sx={{ margin: "1rem" }}>
            <Grid container direction="row" alignItems="center" justifyContent="space-evenly">
                <Box sx={{ height: "5rem", aspectRatio: "1" }}>
                    <Avatar sx={{ width: "100%", height: "100%" }} />
                    {/* src={displayUserData} */}
                </Box>
                <Stack align="center">
                    <Typography fontSize="large">{numPosts}</Typography>
                    <Typography fontSize="small">POSTS</Typography>
                </Stack>
                <Stack align="center">
                    <Typography fontSize="large">{numFollowers}</Typography>
                    <Typography fontSize="small">FOLLOWERS</Typography>
                </Stack>
                <Stack align="center">
                    <Typography fontSize="large">{numFollowing}</Typography>
                    <Typography fontSize="small">FOLLOWING</Typography>
                </Stack>
            </Grid>
            <Grid container alignItems="center" justifyContent="space-between" columnGap="1rem">
                <Grid item flexGrow={1}>
                    {requestedUserID === loggedInUserID ?
                    <Button fullWidth variant="contained" sx={{ margin: "1.5rem 0" }} onClick={() => console.warn("CANNOT EDIT FORM IN THIS VERSION OF THE APP")}>
                        Edit Profile
                    </Button> : <>{
                        loggedInUserFollowing?.includes(requestedUserID) ? 
                        <LoadingButton fullWidth loading={isRemoveFollowFinished} variant="contained" sx={{ margin: "1.5rem 0" }} onClick={handleRemoveFollow}>
                            Following
                        </LoadingButton> :
                        <LoadingButton fullWidth loading={isFollowFinished} variant="contained" sx={{ margin: "1.5rem 0" }} onClick={handleFollow}>
                            Follow
                        </LoadingButton>
                    }</>}
                </Grid>
                <Grid item>
                    <Button color="error" variant="contained" onClick={() => signOut(auth)}>
                        <LogoutIcon />
                    </Button>
                </Grid>
            </Grid>
            <Divider><Typography variant="overline">Uploads</Typography></Divider>
        </Stack>
    );
}