import { AppBar, Button, Grid, IconButton, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import LogoutIcon from '@mui/icons-material/Logout';

import { useRecoilState, useRecoilValue } from 'recoil';
import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';
import { userid, username, wantsToSeeProfileBool } from '../atoms/userAtom';
import { wantsToUploadBool } from "../atoms/actionsAtom";

import { signOut } from 'firebase/auth';
import { auth } from '../firebase'
import { useRouter } from 'next/router';
import { Box } from '@mui/system';

export function Header() {
    const router = useRouter();
    const currentUsername = useRecoilValue(username);

    const currentUserID = useRecoilValue(userid);
    const [wantsToSeeProfile, setWantsToSeeProfile] = useRecoilState(wantsToSeeProfileBool);
    const [wantsToSignin, setWantsToSignin] = useRecoilState(wantsToSigninBool)
    const [wantsToSignup, setWantsToSignup] = useRecoilState(wantsToSignupBool)
    const [wantsToUpload, setWantsToUpload] = useRecoilState(wantsToUploadBool)

    const asPath = router.asPath;
    if(asPath.endsWith("profile") && !wantsToSeeProfile) {
        const routes = router.asPath.split("/");
        router.push(`/${routes[1]}`);
    }

    const HeaderWithoutSession = () => (
        <AppBar position="static" sx={{marginBottom: "1rem"}}>
            <Grid container direction="row" alignItems="center" justifyContent="space-between" padding="1rem">
                <SportsEsportsIcon />
                {(wantsToSignin || wantsToSignup) ? 
                <Button variant="text" onClick={() => {setWantsToSignin(false);setWantsToSignup(false)}}>
                    Cancel
                </Button> : 
                <div>
                    <Button variant="text" onClick={() => setWantsToSignin(true)}>
                        Sign In
                    </Button>
                    <Button variant="contained" onClick={() => setWantsToSignup(true)}>
                        Sign Up
                    </Button>
                </div>}
            </Grid>
        </AppBar>
    );

    // const handleSignOut = () => {
    //     signOut(auth).then(() => {
    //         router.push("/");
    //     })
    // }

    const WithSessionRight = () => (
        <Box>
            <Grid container direction="row" alignItems="center" justifyContent="center">
                {wantsToSeeProfile ? 
                    <IconButton onClick={() => {
                        setWantsToSeeProfile(false);
                        const routes = router.asPath.split("/");
                        router.push(`/${routes[1]}`);
                    }}>
                        <HomeIcon />
                    </IconButton> :
                    <IconButton onClick={() => {
                        setWantsToSeeProfile(true);
                        router.replace(`${currentUsername}/profile`)
                    }}>
                        <AccountCircleRoundedIcon />
                    </IconButton>
                }
                <IconButton onClick={() => {setWantsToUpload(true)}}>
                    <AddBoxRoundedIcon />
                </IconButton>
                {/* <IconButton onClick={handleSignOut}>
                    <LogoutIcon />
                </IconButton> */}
            </Grid>
        </Box>
    );

    const HeaderWithSession = () => (
        <AppBar position="static" sx={{marginBottom: "1rem"}}>
            <Grid container direction="row" alignItems="center" justifyContent="space-between" padding="1rem">
                <SportsEsportsIcon />
                <WithSessionRight />
            </Grid>
        </AppBar>
    );

    return (
        <>
        { currentUserID ? <HeaderWithSession /> : asPath === "/" ?  <HeaderWithoutSession /> : <HeaderWithSession />}
        </>
    );
}