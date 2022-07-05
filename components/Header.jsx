import { AppBar, Button, Grid, IconButton, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutIcon from '@mui/icons-material/Logout';

import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';
import { userid } from '../atoms/userAtom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase'
import { useRouter } from 'next/router';
import { Box } from '@mui/system';

export function Header() {
    const router = useRouter();
    const asPath = router.asPath;
    const [wantsToSignin, setWantsToSignin] = useRecoilState(wantsToSigninBool)
    const [wantsToSignup, setWantsToSignup] = useRecoilState(wantsToSignupBool)
    const currentUserID = useRecoilValue(userid);

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

    const handleSignOut = () => {
        signOut(auth).then(() => {
            router.push("/");
        })
    }

    const WithSessionRight = () => (
        <Box>
            <Grid container direction="row" alignItems="center" justifyContent="center">
                <IconButton onClick={() => setShowUserProfile(!showUserProfile)}>
                    <AccountCircleRoundedIcon />
                </IconButton>
                <IconButton onClick={handleSignOut}>
                    <LogoutIcon />
                </IconButton>
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