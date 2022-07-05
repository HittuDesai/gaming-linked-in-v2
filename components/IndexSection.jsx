import { useState } from 'react';
import { SignIn } from './Signin';
import { SignUp } from './Signup';

import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

import { useRecoilState, useRecoilValue } from 'recoil';
import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';
import { userid } from '../atoms/userAtom';

export function IndexSection() {
    const wantsToSignin = useRecoilValue(wantsToSigninBool);
    const wantsToSignup = useRecoilValue(wantsToSignupBool);
    const [currentUserID, setCurrentUserID] = useRecoilState(userid);

    const [signinEmail, setSigninEmail] = useState("");
    const [signinEmailError, setSigninEmailError] = useState("");
    const [signinPassword, setSigninPassword] = useState("");
    const [signinPasswordError, setSigninPasswordError] = useState("");
    
    const auth = getAuth();

    const handleSignIn = () => {    
        setPersistence(auth, browserSessionPersistence).then(() => {
            signInWithEmailAndPassword(auth, signinEmail, signinPassword)
            .then((userCredential) => {
                setCurrentUserID(userCredential.user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                if(errorCode === "auth/invalid-email")
                    setSigninEmailError("This Email is Invalid")
                else if(errorCode === "auth/wrong-password")
                    setSigninPasswordError("This Password is Wrong")
                else
                    setSigninPasswordError("There is some error at this time. Please try again later.")
            });
        })
    }

    return (
        <>
            {wantsToSignin && <SignIn />}
            {wantsToSignup && <SignUp />}
        </>
    );
}