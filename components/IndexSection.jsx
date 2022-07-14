import { useRouter } from 'next/router';
import { SignIn } from './Signin';
import { SignUp } from './Signup';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';
import { userid } from '../atoms/userAtom';

import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function IndexSection() {
    const router = useRouter();
    const wantsToSignin = useRecoilValue(wantsToSigninBool);
    const wantsToSignup = useRecoilValue(wantsToSignupBool);
    const setCurrentUserID = useSetRecoilState(userid);

    onAuthStateChanged(auth, (userCredentials) => {
        console.log(userCredentials.uid);
        if(!userCredentials) {
            setCurrentUserID(null);
            router.push("/");
            return;
        }
        const currentUserID = userCredentials.uid;
        setCurrentUserID(currentUserID);
        router.push(`/fetch/${currentUserID}`);
    });

    return (
        <>
            {wantsToSignin && <SignIn />}
            {wantsToSignup && <SignUp />}
        </>
    );
}