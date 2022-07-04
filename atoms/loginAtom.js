import { atom } from "recoil";

export const wantsToSigninBool = atom({
    key: 'wantsToSigninBool',
    default: false,
});

export const wantsToSignupBool = atom({
    key: 'wantsToSignupBool',
    default: false,
});