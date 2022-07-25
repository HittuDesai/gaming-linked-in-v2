import { useState } from "react";

import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TextsmsIcon from '@mui/icons-material/Textsms';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { db } from "../firebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

import { useRecoilState, useRecoilValue } from "recoil";
import { userdata } from "../atoms/userAtom";
import { useRouter } from "next/router";

export function ChatsPageUser({ user }) {
    const router = useRouter();
    const username = user.username;
    const followers = user.followers;

    const loggedInUserData = useRecoilValue(userdata);

    return (
        <Grid container direction="row" alignItems="center" justifyContent="space-between" paddingTop="1rem">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Avatar sx={{ marginRight: "1rem" }} />
                <Grid container direction="column">
                    <Typography fontSize="large" variant="overline" sx={{ lineHeight: "1.5rem", textTransform: "none" }}>{username}</Typography>
                    <Typography fontSize={"small"}>{followers?.length} followers</Typography>
                </Grid>
            </Box>
            <Box>
                <IconButton onClick={() => router.push(`/${username}/profile`)}>
                    <PersonSearchIcon />
                </IconButton>
                <IconButton onClick={() => router.push(`/${loggedInUserData.username}/chats/${username}`)}>
                    <TextsmsIcon />
                </IconButton>
            </Box>
        </Grid>
    );
}