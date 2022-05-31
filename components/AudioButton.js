import React, { useRef } from "react";
import * as Tone from 'tone';
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { useStore } from "../pages/screen";
import Granulator from "./Granulator";
import styles from '../styles/AudioUI.module.css';
import { FormControl, InputLabel, Input, Typography } from "@mui/material";
import { Grid } from "@mui/material";

import { useStoreNew } from "./store";

import axios from "axios";

export function UpdatePosition(props){
    const { x, y } = useStore();
    useEffect(() => {
        // Tone.Listener.positionX.value = -x;
        // Tone.Listener.positionY.value = y;
    })
    return(<></>)
}

function useTestFetchAPICall(fetchState, setFetchState){
    useEffect(() => {
        async function axiosFetch(){
            await axios.get(process.env.NEXT_PUBLIC_DEFAULT)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
    }

        if(fetchState == true){
            axiosFetch();
            setFetchState(false);
        }
    }, [fetchState]);
}

function AudioButton(props){
    const [audioFile, setAudioFile] = useState();
    const [fileName, setFileName] = useState('---');
    const [fileURL, setFileURL] = useState(null);
    const [audioCtxState, setAudioCtx] = useState(false);

    const fileInput = useRef();
    const granulatorRef = useRef();

    useEffect(() => {
        useStoreNew.getState().setGranulatorRef(granulatorRef);
    }, [granulatorRef]);

    let button;
    let grain;
    let upload;

    const [fetchState, setFetchState] = useState(false);

    const apiData = useTestFetchAPICall(fetchState, setFetchState);

    const samplePlay = () => {
        // audioFile.loaded===true ? 
        //     (audioFile.state === 'stopped' ? audioFile.start() : audioFile.stop())
        //     : console.log('File not Loaded');
        setFetchState(true);
    }

    const handleAudioCtx = () => {
        setAudioCtx(true);
    }

    const handleSubmit = e => {
        e.preventDefault();
        alert(
            `Selected file - ${fileInput.current.files[0].name}`
        );

        setFileURL(URL.createObjectURL(fileInput.current.files[0]));
    }

    const handleFileChange = () => {
        setFileName(fileInput.current.files[0].name);
    }

    if(!audioCtxState){
        button =  <Button variant='outlined' onClick={async () => {
                        await Tone.start();
                        console.log('audio is ready')
                        handleAudioCtx();

                        const newPan = new Tone.Panner3D({
                            panningModel:'HRTF',
                            distanceModel: 'exponential',
                            positionX: 0,
                            positionY: 0,
                            positionZ: 0,
                        }).toDestination();
                
                        const newAudioFile = (new Tone.Player('http://127.0.0.1:8080/audio/toneTest.wav').connect(newPan));
                        setAudioFile(newAudioFile);
                    }}>Tone Start</Button>;
        grain = <></>
        upload = <></>
        
    } else {
        button = <Button variant='outlined' onClick={samplePlay} className={styles.button}>Sound</Button>;
        // button = <></>;
        grain = <Granulator ref={granulatorRef} localFileURL={fileURL}/>
        upload = <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <label htmlFor="contained-button-file">
                        {/* <Input ref={fileInput} inputProps={{accept: "audio/*"}} id="contained-button-file" multiple type="file" style={{display:'none'}}/> */}
                        <input ref={fileInput} type="file" id="contained-button-file" accept="audio/*" style={{display: 'none'}} onChange={handleFileChange}/>
                        <Button variant="contained" component="span" className={styles.button}>
                        Select
                        </Button>
                        <Typography style={{'justifyContent':'center', 'display':'flex'}}>Selected Local File: {fileName}</Typography>
                        {/* <Typography>{console.log(!fileInput.current)}</Typography> */}
                        <Button variant='outlined' type='submit' className={styles.button}>Submit</Button>
                    </label>
                </form>
    }

    return(
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
       >
        <div className={styles.audioui}>
            <Grid item xs={20}>
                {button}
            </Grid>
            {/* {upload} */}
            {grain}
            <div className="sliderPanel">
            </div>
        </div>
        </Grid>
    );
}

export default AudioButton;