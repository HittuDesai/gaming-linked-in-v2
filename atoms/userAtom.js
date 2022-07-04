import { atom } from "recoil";

export const userid = atom({
    key: 'userid', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
});
