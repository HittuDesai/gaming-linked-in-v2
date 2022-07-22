import { useState } from "react";

import { Avatar, Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { db } from "../firebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

import { useRecoilState } from "recoil";
import { userdata } from "../atoms/userAtom";
import { useRouter } from "next/router";

export function ChatArea({ chats, requestedUserData }) {
    const router = useRouter();
    const requestedUsername = requestedUserData?.username;
    const requestedUserFollowers = requestedUserData?.followers;

    return (
        <Grid container direction="column" alignItems="center" justifyContent="end">
            <Grid container direction="column" alignItems="center" justifyContent="end" rowGap="1rem">
                <Avatar />
                <Typography fontSize="large" variant="overline" sx={{ lineHeight: "1.5rem", textTransform: "none" }}>{requestedUsername}</Typography>
                {/* <Typography fontSize={"small"}>{requestedUserFollowers?.length} followers</Typography> */}
                <Button variant="contained" onClick={() => router.push(`/${requestedUsername}/profile`)}>View Full Profile</Button>
            </Grid>
            <Box>
                MESSAGES
            </Box>
        </Grid>
    );
}