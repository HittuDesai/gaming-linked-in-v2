import { useRouter } from "next/router";
import { ExplorePageUser } from "../../components/ExplorePageUser";

import { CircularProgress, Grid, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { useRecoilValue } from "recoil";
import { userdata } from "../../atoms/userAtom";

import { db } from "../../firebase"
import { collection, getDocs } from "firebase/firestore";

export default function UserFeedPage({ usersArray, requestedUserData }) {
    const router = useRouter();
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

    return (
        <>
            <Grid container direction="column" padding="0 1rem">{
                usersArray.map((user, index) => <ExplorePageUser key={index} user={user} />)
            }</Grid>
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