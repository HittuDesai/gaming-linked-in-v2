import { db } from "../../../firebase"
import { collection, getDocs, query, where } from "firebase/firestore";

import { Grid, Typography } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

export default function UserHomePage({ userFound, loggedInUserData, requestedUserData }) {
    console.log({userFound, loggedInUserData, requestedUserData});
    return (
        <>{userFound ?
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <>BRUH</>
            </Grid> :
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <ErrorIcon fontSize="large" sx={{ color: "red" }}/>
                <Typography fontSize="small" variant="overline" color="red" sx={{marginTop: "1rem"}}>Error in fetching data</Typography>
                <Typography fontSize="small" variant="overline" color="red">Please trying signing in again</Typography>
            </Grid>
        }</>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { username, otherUsername } = params;
    if(username === otherUsername) return { 
        redirect: {
            permanent: true,
            destination: `/`
        }
    }

    const usersCollectionReference = collection(db, "users");
    const usernameQuery = query(usersCollectionReference, where("username", "==", username));
    const querySnapshot = await getDocs(usernameQuery);
    const otherUsernameQuery = query(usersCollectionReference, where("username", "==", otherUsername));
    const otherQuerySnapshot = await getDocs(otherUsernameQuery);
    const userFound = !(querySnapshot.empty || otherQuerySnapshot.empty);
    if(!userFound) return { 
        redirect: {
            permanent: true,
            destination: `/`
        }
    }
    const userData = querySnapshot.docs[0].data();
    const otherUserData = otherQuerySnapshot.docs[0].data();
    return { 
        props: {
            userFound,
            loggedInUserData: userData,
            requestedUserData: otherUserData,
        }
    }
}