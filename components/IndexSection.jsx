import { useRouter } from 'next/router';
import { SignIn } from './Signin';
import { SignUp } from './Signup';

import { useRecoilValue } from 'recoil';
import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';

import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export function IndexSection() {
    const router = useRouter();
    const wantsToSignin = useRecoilValue(wantsToSigninBool);
    const wantsToSignup = useRecoilValue(wantsToSignupBool);

    onAuthStateChanged(auth, (userCredentials) => {
        console.log(userCredentials);
        if(!userCredentials)
            return;
        const currentUserID = userCredentials.uid;
        router.push(`/fetch/${currentUserID}`);
    })

    return (
        <>
            {wantsToSignin && <SignIn />}
            {wantsToSignup && <SignUp />}
        </>
    );
}