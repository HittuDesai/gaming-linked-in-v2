import { useState } from "react";

import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { db } from "../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

import { useRecoilValue } from "recoil";
import { userdata } from "../atoms/userAtom";

export function ExplorePageUser({ user }) {
    const userID = user.uid;
    const username = user.username;
    const followers = user.followers;

    const loggedInUserData = useRecoilValue(userdata);
    const loggedInUserID = loggedInUserData.uid;
    const followingOfLoggedInUser = loggedInUserData.following;
    const loggedInUserFollows = followingOfLoggedInUser.includes(userID);

    const [isFollowFinished, setIsFollowFinished] = useState(false);
    const handleFollow = () => {
        setIsFollowFinished(true);
        const loggedInUserDocument = doc(db, `users/${loggedInUserID}`);
        const requestedUserDocument = doc(db, `users/${userID}`);
        updateDoc(requestedUserDocument, "followers", arrayUnion(loggedInUserID)).then(() => {
            updateDoc(loggedInUserDocument, "following", arrayUnion(userID)).then(() => {
                setIsFollowFinished(false);
            })
        })
    }

    const [isRemoveFollowFinished, setIsRemoveFollowFinished] = useState(false);
    const handleRemoveFollow = () => {
        setIsRemoveFollowFinished(true);
        const loggedInUserDocument = doc(db, `users/${loggedInUserID}`);
        const requestedUserDocument = doc(db, `users/${userID}`);
        updateDoc(requestedUserDocument, "followers", arrayRemove(loggedInUserID)).then(() => {
            updateDoc(loggedInUserDocument, "following", arrayRemove(userID)).then(() => {
                setIsRemoveFollowFinished(false);
            })
        })
    }

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
                {loggedInUserFollows ?
                <LoadingButton sx={{ minWidth: "0" }} loading={isRemoveFollowFinished}>
                    <PersonRemoveIcon onClick={handleRemoveFollow} />
                </LoadingButton> :
                <LoadingButton sx={{ minWidth: "0" }} loading={isFollowFinished}>
                    <PersonAddIcon onClick={handleFollow} />
                </LoadingButton>
                }
            </Box>
        </Grid>
    );
}