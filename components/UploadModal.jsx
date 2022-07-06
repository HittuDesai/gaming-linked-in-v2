import { useState, useRef, useEffect } from 'react'
import { Grid, Dialog, Typography, Divider, Button, DialogActions, DialogTitle, Box, TextField, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useRecoilState, useRecoilValue } from "recoil";
import { userdata, userid } from "../atoms/userAtom";
import { wantsToUploadBool } from '../atoms/actionsAtom';

import { addDoc, collection, serverTimestamp, setDoc, doc } from "@firebase/firestore"
import { db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const stepsToUploadPost = [
    "Upload Media",
    "Post Description",
]

export function UploadModal() {
    const currentUserID = useRecoilValue(userid);
    const currentUserData = useRecoilValue(userdata);
    const [wantsToUpload, setWantsToUpload] = useRecoilState(wantsToUploadBool);

    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [altText, setAltText] = useState("");
    const [currentStep, setCurrentStep] = useState(stepsToUploadPost[0]);
    
    const handleOnPost = async () => {
        if(file===null || caption==="") {
            console.log("BRUH");
            return;
        }

        const postsCollection = collection(db, 'posts');
        const usersCollection = collection(db, 'users');
        const uploadsCollection = collection(usersCollection, `${currentUserID}/uploads`);
        const uploadTimestamp = serverTimestamp();
        var uploadData = {
            numberOfLikes: 0,
            likedBy: [],
            time: uploadTimestamp,
            caption: caption,
            uploaderID: currentUserID,
            // uploaderUsername: currentUserData.username,
            // uploaderDP: currentUserData.dp,
        }
        
        const imageRef = ref(storage, `${currentUserID}/uploads/${file.name}`);
        uploadBytes(imageRef, file)
        .then(snapshot => {
            getDownloadURL(snapshot.ref)
            .then(url => {
                uploadData = { ...uploadData, url: url, };
                addDoc(postsCollection, uploadData)
                .then(response => {
                    const idOfAddedDocument = response.id;
                    addDoc(uploadsCollection, { postID: idOfAddedDocument }).then(res => {
                        const uploadID = res.id;
                        setDoc(doc(db, `posts/${idOfAddedDocument}`), { uploadID: uploadID }, { merge: true })
                        .then(() => setShowModal(false))
                        .catch(error => console.log(error));
                    })
                })
                .catch(error => {
                    console.log("ERROR IN ADDING DOCUMENT TO UPLOADS COLLECTION", error);
                })
            })
            .catch(error => {
                console.log("ERROR IN GETTING DOWNLOAD URL FOR UPLOADED IMAGE", error);
            })
        })
        .catch(error => {
            console.log("ERROR IN IMAGE UPLOAD", error);
        })
    }

    const [dialogActionDisabled, setDialogActionDisabled] = useState(true);
    useEffect(() => {
        if(currentStep === "Upload Media")
            if(file === null)
                setDialogActionDisabled(true);
            else
                setDialogActionDisabled(false);
        else if(currentStep === "Post Description")
            if(caption === "")
                setDialogActionDisabled(true)
            else
                setDialogActionDisabled(false)
    }, [currentStep, file, caption])
    
    return (
        <Dialog
        fullWidth
        maxWidth="xs"
        open={wantsToUpload}
        >
            <DialogTitle fontSize="small" variant='overline' sx={{textAlign: "center"}}>{currentStep}</DialogTitle>
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{
                minHeight: "400px", padding: "1rem"
            }}>
                {currentStep === "Upload Media" && <>{file ? 
                    <Box sx={{width: "100%", background: "red", aspectRatio: "1"}}>
                        IMAGE CHOSEN SUCCESSFULLY
                    </Box> :
                    <>
                        <CloudUploadIcon fontSize='large' sx={{ marginBottom: "1rem" }}/>
                        <Typography align="center" fontSize="medium" variant="caption" sx={{margin: "0 1rem"}}>Drag and Drop a Photo</Typography>
                        <Divider sx={{width: "100%", padding: "1rem"}}>OR</Divider>
                        <input type="file" accept="image/*" style={{ display: 'none' }} id="raised-button-file" onChange={event => {
                            setFile(event.target.files[0]);
                        }} />
                        <label htmlFor="raised-button-file">
                            <Button variant='contained' component="span" sx={{width: "100%"}}>Select a File</Button>
                        </label>
                </>}</>}
                {currentStep === "Post Description" && <>
                    <Box sx={{width: "100%", background: "red", aspectRatio: "1", marginBottom: "1rem"}}>
                        IMAGE CHOSEN SUCCESSFULLY
                    </Box>
                    <TextField
                    required
                    fullWidth
                    variant='filled'
                    label="Caption"
                    placeholder="Write a caption"
                    onChange={event => setCaption(event.target.value)}
                    autoComplete="none"
                    value={caption}
                    sx={{marginBottom: "1rem"}}
                    />
                    <Accordion sx={{width: "100%", }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Accesibility</AccordionSummary>
                        <AccordionDetails>
                        <TextField
                        fullWidth
                        variant='filled'
                        placeholder="Write alt text"
                        onChange={event => setAltText(event.target.value)}
                        autoComplete="none"
                        value={altText}
                        sx={{marginBottom: "1rem"}}
                        />
                        </AccordionDetails>
                    </Accordion>
                </>}
            </Grid>
            <DialogActions>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Button onClick={() => {
                        setWantsToUpload(false);
                        setFile(null);
                        
                    }} sx={{color: "white", fontSize: "0.75rem"}}>Cancel</Button>
                    <Button
                    variant="outlined"
                    disabled={dialogActionDisabled}
                    onClick={() => {
                        if(file) {
                            setCurrentStep(stepsToUploadPost[1]);
                            return;
                        }
                    }}>
                        {currentStep === "Upload Media" && "Next"}
                        {currentStep === "Post Description" && "Post"}
                    </Button>
                </Grid>
            </DialogActions>
        </Dialog>
    );
}
