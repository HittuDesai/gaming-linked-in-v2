import { ChatsPageUser } from "../../../components/ChatsPageUser"

import { CircularProgress, Grid, IconButton, TextField, InputAdornment, Typography, Autocomplete, Box, Avatar } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { useRecoilValue } from "recoil";
import { userdata, username } from "../../../atoms/userAtom";

import { db } from "../../../firebase"
import { collection, getDocs } from "firebase/firestore";

import { Cancel, Search } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function UserChatsPage({ usersArray, requestedUserData }) {
    const loggedInUserData = useRecoilValue(userdata);
    const loggedInUserID = loggedInUserData?.uid;
    const requestedUserID = requestedUserData.uid;

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

    const router = useRouter();
    return (
        <>
            <Grid container direction="column" padding="0 1rem">
                <Autocomplete
                options={usersArray}
                renderInput={params => <TextField fullWidth {...params} label="Search" />}

                getOptionLabel={option => option.username}
                renderOption={(props, option) => {
                    const username = option.username;
                    const followers = option.followers;
                    return <Box key={option.uid} {...props} sx={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "1rem" }}>
                        <Avatar sx={{ marginRight: "1rem" }} />
                        <Grid container direction="column">
                            <Typography fontSize="large" variant="overline" sx={{ lineHeight: "1.5rem", textTransform: "none" }}>{username}</Typography>
                            <Typography fontSize={"small"}>{followers?.length} followers</Typography>
                        </Grid>
                    </Box>
                }}

                onChange={(event, option) => {
                    if(!option) return;
                    const usernameOfOtherPerson = option.username;
                    const currentAsPath = router.asPath;
                    router.push(`${currentAsPath}/${usernameOfOtherPerson}`);
                }}

                autoComplete
                selectOnFocus
                clearIcon={null}
                popupIcon={<Search />}
                sx={{ width: "100%" }}
                />
                {/* {usersArray.map((user, index) => <ChatsPageUser key={index} user={user} />)} */}
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
    (await querySnapshot).forEach(user => {
        const userData = user.data();
        if(userData.username === username)
            currentUserData = userData;
        else
            usersArray.push(userData);
    })
    
    return { props: { usersArray, requestedUserData: currentUserData }};
}