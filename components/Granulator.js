import * as Tone from 'tone';
import { ToneAudioBuffer, 
        Envelope, 
        ToneBufferSource,
        Clock } from 'tone';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Slider,
    Typography,
    ButtonGroup, 
    Slide} from "@mui/material";
import Button from '@mui/material/Button';
import styles from './audioui.module.css';
import Canvas from './Canvas';
import axios from 'axios';
import { useStoreNew } from './store';

import InputLocalFileUI from './InputLocalFile';
/** User controls: 
  attack, release ** done
  spread ** done
  Pitch/playback rate ** done
  density = clock ticks per second ** done
  pitch deviation ** done

  let buffer playout without having to move slider

  mui ui for now ** done
  draw waveform ** done
  fix resizing waveform ** done
  upload file ** done
  random file ** done
  Make UI look well on phone
  threejs ui ** done

  type control for inputs - set limit to values being entered
 **/

function useFetchRandomAudioFile(randomState, setRandomState) {
    const [randomAudioURL, setRandomAudioURL] = useState(null);
    const [randomAudioName, setRandomAudioName] = useState(null);
    const [loadingFile, setLoadingFile] = useState(true);
    
    useEffect(() => {
        async function fetchRandomURL(){

            await axios.get('http://localhost:3000/api/random')
                    .then(function (response) {
                            console.log(response.data.name);
                            console.log(response.data.previews['preview-hq-mp3']);
                            setRandomAudioName(response.data.name);
                            setRandomAudioURL(response.data.previews['preview-hq-mp3']);
                            setLoadingFile(false);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })

        }
        if(randomState == true){
            fetchRandomURL();
            setRandomState(false);
            
        }
    }, [randomState]);

    return {randomAudioURL, loadingFile, randomAudioName};
}

function useFetchDefaultAudioFile(){
    const [defaultAudioURL, setDefaultAudioURL] = useState(null);
    const [defaultAudioName, setDefaultAudioName] = useState(null);
    const [loadingDefaultFile, setLoadingDefaultFile] = useState(true);

    useEffect(() => {
        async function fetchDefaultURL(){
            await axios.get('http://localhost:3000/api/default')
                    .then(function(response){
                        // console.log(response.data);
                        setDefaultAudioName(response.data.name);
                        setDefaultAudioURL(response.data.previews['preview-hq-mp3']);
                        setLoadingDefaultFile(false);
                    })
                    .catch(function(error){
                        console.log(error);
                    })
        }
        fetchDefaultURL();
    }, []);

    return { defaultAudioURL, defaultAudioName, loadingDefaultFile };
}

function Grain(props) {

    return(<></>)
}

const Granulator = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        refStopClock: () => {
            if(clock.state != 'stopped'){
                stopClock();
            }
        }
    }))

    //Local Input file variables
    const [fileName, setFileName] = useState('---');
    const [localFileURL, setLocalFileURL] = useState(null);
    const fileInputRef = useRef();

    const [clockFrequency, setClockFrequency] = useState([1]);
    const clock = new Clock((time, ticks) => {
        // console.log(ticks);
        grainPlay();
        // console.log("clockFreq: ", clock.frequency.value);
        // console.log("grain pan x: ", grainPan.positionX);
        // bufferPosition++;
    }, clockFrequency[0]);

    //Not waiting until component is mounted because otherwise it
    // has to wait for a refresh in order to update the value (for some reason idk)
    useStoreNew.subscribe((state) => {
        clock.set({frequency: state.grainDensity});
        clockFrequency[0] = state.grainDensity;
        grainPan.set({positionX: state.x, positionY:state.y});
    })

    //Binding component to store and forwarding changed values after component is mounted
    useEffect(() => {
        useStoreNew.subscribe((state) => {
            offsetMax[0] = state.fileOffsetMax;
            pitchOffsetMax[0] = state.pitchOffsetMax;
            grainFadeIn[0] = state.grainAttack;
            grainFadeOut[0] = state.grainRelease;

            bufferPosition[0] = state.filePosition;
           
        })
        console.log("mounted/unmounted granulator")
    }, []);

    //Variable to determine when to fetch a new random file
    const [randomState, setRandomState] = useState(false);
    let {randomAudioURL, loadingFile, randomAudioName} = useFetchRandomAudioFile(randomState, setRandomState);

    let {defaultAudioURL, defaultAudioName, loadingDefaultFile} = useFetchDefaultAudioFile();

    const [bufferSizeInSeconds, setBufferSizeInSeconds] = useState(null);
    const [bufferChannelData, setBufferChannelData] = useState(null);
    const [bufferLoaded, setBufferLoaded] = useState(false);
    const [bufferLoading, setBufferLoading] = useState(false);

    //Set URL to relevant value
    let bufferURL = null;

    if(localFileURL){
        if(clock.state != 'stopped'){
            stopClock();
        }
       bufferURL = localFileURL;
    } else{
        if(randomState || randomAudioURL != null){
            bufferURL = randomAudioURL;
        } else {
            bufferURL = defaultAudioURL;
            // bufferURL = 'http://127.0.0.1:8080/audio/toneTest.wav';
        }
    }

    const buffer = new ToneAudioBuffer({
        // url: !props.localFileURL ? 'http://127.0.0.1:8080/audio/toneTest.wav' : props.localFileURL,
        url: bufferURL,
        onload: () => {
            // console.log('buffer loaded');
            // console.log('offsetMax: ' + offsetMax);
            // console.log('pitchOffsetMax: ' + pitchOffsetMax);
            // console.log('grainFadeIn: ' + grainFadeIn);
            // console.log('grainFadeOut: ' + grainFadeOut);
            // console.log('clockFrequency: ' + clockFrequency);
            // console.log('playbackRate: ' + playbackRate);

            if(getFileLengthInSeconds() != bufferSizeInSeconds){
                console.log('stopped loading');
                console.log('previous file: ' + bufferSizeInSeconds);
                console.log('current file: ' + getFileLengthInSeconds());
                setBufferSizeInSeconds(getFileLengthInSeconds());
                useStoreNew.getState().setBufferSizeInSeconds(getFileLengthInSeconds());
                setBufferLoading(false);
                setBufferChannelData(getBufferChannelData());
                setBufferLoaded(true);
            }
            
            
        },
    });

    // let bufferPosition = 0;
    const [bufferPosition, setBufferPosition] = useState([0]);

    //Using State so that values don't get reset on rerenders
    const [offsetMax, setOffsetMax] = useState([0]);
    const [pitchOffsetMax, setPitchOffsetMax] = useState([0]);
    const [playbackRate, setPlaybackRate] = useState([1]);
    const [grainFadeIn, setGrainFadeIn] = useState([0.5]);
    const [grainFadeOut, setGrainFadeOut] = useState([0.5]);

    const grainSize = 0.05;
    const grainPan = new Tone.Panner3D({
        panningModel:'HRTF',
        distanceModel: 'exponential',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
    }).toDestination();
    const grainVolume = new Tone.Gain(0.5).toDestination();

    const envelope = new Envelope({
        // array of values determining the curve
        attackCurve: [],
        releaseCurve: [],
    })

    const getFileLengthInSeconds = () => {
        if(buffer.loaded){
            const newGrain = new ToneBufferSource({
                url:buffer
            })
    
            const fileLengthInSeconds = newGrain.sampleTime*buffer.length;
            newGrain.dispose();
    
            return fileLengthInSeconds;
        } else{
            console.log('file not loaded');
        }
        
    }

    const getBufferChannelData = () => {
        if(buffer.loaded){
            return buffer.getChannelData(0);
        } else{
            console.log('file not loaded');
        }
    }

    const grainPlay = () => {
        if(buffer.loaded){
            const playbackRateDeviation = playbackRate[0] + (Math.random() * pitchOffsetMax[0]);     
            const newGrain = new ToneBufferSource({
                url: buffer,
                fadeIn: grainFadeIn[0],
                fadeOut: grainFadeOut[0],
                curve: 'linear',
                playbackRate: playbackRateDeviation,
            }).chain(grainPan, grainVolume);

            const bufferOffset = Math.random() * offsetMax[0];
            

            (newGrain.state === 'stopped' ? newGrain.start(Tone.now(), bufferPosition[0]+bufferOffset, grainSize) : newGrain.stop());
            
        } else{
            console.log('file not loaded');
        }
    }

    const startClock = () => {
        if(clock.state == 'stopped'){
            buffer.loaded ? clock.start() : console.log('buffer not loaded');
        } else{
           stopClock();
        }
    }

    const stopClock = () => {
        clock.pause();
        clock.stop();
        console.log('paused clock');
    }

    const handleRandomButton = () => {
        if(clock.state != 'stopped'){
            stopClock();
        }
        setBufferLoading(true);
        setRandomState(true);
        //Make sure local file is null because it is used to check which url will be used for the buffer
        //Otherwise local file input will be used again instead of random and the program will be stuck loading
        setLocalFileURL(null);
    }

    const handleBufferSlider = (e) => {
        if(typeof e.target.value == 'number'){
           bufferPosition[0] = e.target.value;
        }
    }

    const handleSubmit = e => {
        if(clock.state != 'stopped'){
            stopClock();
        }
        e.preventDefault();

        if(fileInputRef.current.files[0]){
            alert(
                `Selected file - ${fileInputRef.current.files[0].name}`
              );
    
            setLocalFileURL(URL.createObjectURL(fileInputRef.current.files[0]));
        }
        else{
            alert('No audio file selected');
        }
        
    }

    const handleFileChange = () => {
        if(clock.state != 'stopped'){
            stopClock();
        }
        setFileName(fileInputRef.current.files[0].name);
    }

    let fileUI;

    if(bufferLoading){
        fileUI = <p style={{'display':'flex',
                            'justifyContent':'center'}}>Buffer is Loading</p>
    } else{
        fileUI = <div style={{
                'flexDirection':'row',
                'display':'flex',
                }}>
                    <Button className={styles.button} variant='outlined' onClick={startClock}>Play</Button>
                    <Button className={styles.button} variant='outlined' onClick={handleRandomButton}>Rng🔀</Button>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button onClick={() => {playbackRate[0] = 0.5}}>1/2x</Button>
                        <Button onClick={() => {playbackRate[0] = 1}}>1x</Button>
                        <Button onClick={() => {playbackRate[0] = 2}}>2x</Button>
                    </ButtonGroup>

                </div>;
    }

    return(
        <div className='granulator' style={{
            'justifyContent':'center',
            'display':'flex',
            'flexDirection':'column'
        }}>
            
            <Typography id='bufferPosition'style={{'justifyContent':'center', 'display':'flex'}}>Audio file Controls</Typography>
            <br></br>
            {/* <Slider id='bufferPosSlider' max={bufferSizeInSeconds} min={0} defaultValue={0} step={1} onChange={handleBufferSlider}/> */}
            
            {fileUI}
            <p style={{'display':'flex',
                       'justifyContent':'center'}}>{loadingFile || bufferLoading ? (loadingDefaultFile ? '---' : defaultAudioName): randomAudioName}</p>

            <InputLocalFileUI handleSubmit={handleSubmit} handleFileChange={handleFileChange} fileInputRef={fileInputRef} fileName={fileName}/>

            {/* <Typography id='distribution'>Distribution</Typography>
            <Slider id='distributionSlider' max={5} min={0} defaultValue={0} step={0.01} onChange={(e) => {offsetMax[0] = e.target.value}}/>
            <Typography id='density'>Density</Typography>
            <Slider id='densitySlider' max={50} min={1} defaultValue={1} step={0.1} onChange={(e) => {clock.set({frequency: e.target.value}); clockFrequency[0] = e.target.value;}}/>
            <Typography id='pitchDeviation'>Pitch Deviation</Typography>
            <Slider id='pitchDeviationSlider' max={1} min={0} step={0.01} defaultValue={0} onChange={(e) => {pitchOffsetMax[0] = e.target.value}}/> */}

            {/* <Typography id='attack'>Attack</Typography>
            <Slider id='attackSlider' max={1} min={0} defaultValue={0.5} step={0.01} onChange={(e) => {grainFadeIn[0] = e.target.value}}/>
            <Typography id='release'>Release</Typography>
            <Slider id='releaseSlider' max={1} min={0} defaultValue={0.5} step={0.01} onChange={(e) => {grainFadeOut[0] = e.target.value}}/> */}
            <Canvas bufferChannelData={bufferChannelData} bufferLoaded={bufferLoaded}/>
            {/* <a href={randomAudioURL} target='_blank'>{randomAudioURL}</a> */}
            
        </div>
    );
})

Granulator.displayName = 'Granulator';

Grain.defaultProps = {

};

export default Granulator;
