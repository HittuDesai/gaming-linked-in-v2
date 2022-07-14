import { useState } from "react";
import { Avatar, Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import { useRecoilValue } from "recoil";
import { userid } from "../atoms/userAtom";
import { useRouter } from "next/router";

export function ProfileUserData({ requestedUserData }) {
    console.log(requestedUserData);
    const loggedInUserID = useRecoilValue(userid);
    const requestedUserID = requestedUserData.uid;
    console.log({loggedInUserID, requestedUserID})
    const numPosts = requestedUserData.uploads?.length || 0;
    const numFollowers = requestedUserData.followers?.length || 0;
    const numFollowing = requestedUserData.following?.length || 0;

    const router = useRouter();
    const [isFollowFinished, setIsFollowFinished] = useState(false);
    const handleFollow = () => {
        setIsFollowFinished(true);
        const loggedInUserDocument = doc(db, `users/${loggedInUserID}`);
        const requestedUserDocument = doc(db, `users/${requestedUserID}`);
        updateDoc(requestedUserDocument, "followers", arrayUnion(loggedInUserID)).then(() => {
            updateDoc(loggedInUserDocument, "following", arrayUnion(requestedUserID)).then(() => {
                setIsFollowFinished(false);
                router.reload();
            })
        })
    }

    return (
        <Stack sx={{ margin: "1rem" }}>
            <Grid container direction="row" alignItems="center" justifyContent="space-evenly">
                <Box sx={{ height: "5rem", aspectRatio: "1" }}>
                    <Avatar sx={{ width: "100%", height: "100%" }} />
                    {/* src={requestedUserData} */}
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
            {requestedUserID === loggedInUserID ? 
            <Button fullWidth variant="contained" sx={{ margin: "1.5rem 0" }} onClick={() => {
                console.warn("CANNOT EDIT FORM IN THIS VERSION OF THE APP");
            }}>
                Edit Profile
            </Button> : 
            <LoadingButton loading={isFollowFinished} fullWidth variant="contained" sx={{ margin: "1.5rem 0" }} onClick={handleFollow}>
                Follow
            </LoadingButton>}
            <Divider><Typography variant="overline">Uploads</Typography></Divider>
        </Stack>
    );
}