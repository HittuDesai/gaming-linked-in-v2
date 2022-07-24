import { useState } from "react";
import { MessagesSection } from "./MessagesSection";

import { Avatar, Button, Grid, OutlinedInput, Typography, IconButton } from "@mui/material";

import { db } from "../firebase";
import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";

import { useRouter } from "next/router";
import { Send } from "@mui/icons-material";

export function ChatArea({ messages, requestedUserData, loggedInUserData }) {
    const router = useRouter();
    const requestedUsername = requestedUserData?.username;

    const [chatText, setChatText] = useState("");
    const handleChatTextChange = event => {
        setChatText(event.target.value);
    }
    
    const handleSendText = () => {
        const chatsCollection = collection(db, `users/${loggedInUserData.uid}/chats/${requestedUserData.uid}/messages`);
    }

    return (
        <Grid container direction="column" alignItems="center" justifyContent="space-between" padding="1rem" sx={{ height: "100%" }}>
            <Grid container direction="column" alignItems="center" justifyContent="end" rowGap="1rem">
                <Avatar />
                <Typography fontSize="large" variant="overline" sx={{ lineHeight: "1.5rem", textTransform: "none" }}>{requestedUsername}</Typography>
                <Button variant="contained" onClick={() => router.push(`/${requestedUsername}/profile`)}>View Full Profile</Button>
            </Grid>
            <Grid container direction="column" alignItems="center" justifyContent="end" rowGap="1rem">
                {/* <MessagesSection messages={messages} /> */}
                <OutlinedInput
                fullWidth
                value={chatText}
                onChange={handleChatTextChange}
                endAdornment={<IconButton onClick={handleSendText}><Send /></IconButton>}
                sx={{ borderRadius: "10rem", paddingLeft: "0.6rem" }}
                />
            </Grid>
        </Grid>
    );
}