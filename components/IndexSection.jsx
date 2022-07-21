import { useRouter } from 'next/router';
import { SignIn } from './Signin';
import { SignUp } from './Signup';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';
import { userid } from '../atoms/userAtom';

import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function IndexSection() {
    const wantsToSignin = useRecoilValue(wantsToSigninBool);
    const wantsToSignup = useRecoilValue(wantsToSignupBool);

    return (
        <>
            {wantsToSignin && <SignIn />}
            {wantsToSignup && <SignUp />}
        </>
    );
}