import { atom } from "recoil";

export const userid = atom({
    key: 'userid',
    default: null,
});

export const userdata = atom({
    key: 'userdata',
    default: null,
});

export const username = atom({
    key: 'username',
    default: null,
});

export const wantsToSeeProfileBool = atom({
    key: 'wantsToSeeProfileBool',
    default: false,
});

export const useruploads = atom({
    key: 'useruploads',
    default: [],
});