import * as Tone from 'tone';
import { ToneAudioBuffer, 
        Envelope, 
        ToneBufferSource,
        Clock } from 'tone';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Slider,
    Typography,
    ButtonGroup, 
    Slide,
    CircularProgress } from "@mui/material";
import Button from '@mui/material/Button';
import styles from '../styles/AudioUI.module.css';
import Canvas from './Canvas';
import axios from 'axios';

import { useStoreNew } from '../src/store';
import { useStoreWithSelector } from '../src/store';

import InputLocalFileUI from './InputLocalFile';
import GranulatorUI from './GranulatorUI';
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

            await axios.get(process.env.NEXT_PUBLIC_RANDOM)
                    .then(function (response) {
                            console.log(response.data);
                            console.log(response.data.previews['preview-hq-mp3']);
                            // useStoreNew.getState().updateCurrentAudioFile(response.data.name);
                            useStoreWithSelector.getState().updateCurrentAudioFile(response.data.name);
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

    return {randomAudioURL, loadingFile, randomAudioName, setRandomAudioURL, setRandomAudioName};
}

function useFetchDefaultAudioFile(){
    const [defaultAudioURL, setDefaultAudioURL] = useState(null);
    const [defaultAudioName, setDefaultAudioName] = useState(null);
    const [loadingDefaultFile, setLoadingDefaultFile] = useState(true);

    useEffect(() => {
        async function fetchDefaultURL(){
            await axios.get(process.env.NEXT_PUBLIC_DEFAULT)
                    .then(function(response){
                        // console.log(response.data);
                        // useStoreNew.getState().updateCurrentAudioFile(response.data.name);
                        useStoreWithSelector.getState().updateCurrentAudioFile(response.data.name);
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

    return { defaultAudioURL, defaultAudioName, loadingDefaultFile, setDefaultAudioURL };
}

function Grain(props) {

    return(<></>)
}

const Granulator = forwardRef((props, ref) => {

    const granulatorUIRef = useRef();

    useEffect(() => {
        useStoreNew.getState().setGranulatorUIRef(granulatorUIRef);
    }, [granulatorUIRef])

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
    let {randomAudioURL, loadingFile, randomAudioName, setRandomAudioURL, setRandomAudioName} = useFetchRandomAudioFile(randomState, setRandomState);

    let {defaultAudioURL, defaultAudioName, loadingDefaultFile, setDefaultAudioURL} = useFetchDefaultAudioFile();

    const [bufferSizeInSeconds, setBufferSizeInSeconds] = useState(null);
    const [bufferChannelData, setBufferChannelData] = useState(null);
    const [bufferLoaded, setBufferLoaded] = useState(false);
    const [bufferLoading, setBufferLoading] = useState(true);

    //Set URL to relevant value
    let bufferURL = null;

        if(localFileURL && !randomState){
            if(clock.state != 'stopped'){
                stopClock();
            }
           bufferURL = localFileURL;
        } else{
            if(randomState || randomAudioURL != null){
                    bufferURL = randomAudioURL;
            } else {
                    bufferURL = defaultAudioURL;
            }
        }

    const buffer = new ToneAudioBuffer({
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
                // console.log('duration ', buffer.duration)
                // console.log('stopped loading');
                // console.log('previous file: ' + bufferSizeInSeconds);
                // console.log('current file: ' + getFileLengthInSeconds());
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
        //Make sure local file is null because it is used to check which url will be used for the buffer
        //Otherwise local file input will be used again instead of random and the program will be stuck loading
        setLocalFileURL(null);
        
        setBufferLoading(true);
        setRandomState(true);
        setDefaultAudioURL(null);
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
            //Clear random audio url so buffer does not load old random file when a new one is requested
            setRandomAudioURL(null);
            setRandomAudioName(null);
            setDefaultAudioURL(null);

            setBufferLoading(true);
            // useStoreNew.getState().updateCurrentAudioFile(fileInputRef.current.files[0].name);
            useStoreWithSelector.getState().updateCurrentAudioFile(fileInputRef.current.files[0].name);
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

    const playbackFnOne = () => {
        playbackRate[0] = 1;
    }

    const playbackFnOneHalf = () => {
        playbackRate[0] = 0.5;
    }

    const playbackFnTwo = () => {
        playbackRate[0] = 2;
    }

    let fileUI;

    if(bufferLoading){
        fileUI = <p className={styles.bufferloading}>
                    <span className={styles.loadingtext}>Buffer is Loading...</span>
                    <CircularProgress className={styles.circularprogress}/>
                </p>
    } else{
        fileUI = <GranulatorUI bufferLoaded={bufferLoaded} 
                               playbackFnOne={playbackFnOne} 
                               playbackFnOneHalf={playbackFnOneHalf} 
                               playbackFnTwo={playbackFnTwo} 
                               startClock={startClock} 
                               handleRandomButton={handleRandomButton}
                               ref={granulatorUIRef}/>
    }

    return(
        <div className='granulator' style={{
            'justifyContent':'center',
            'display':'flex',
            'flexDirection':'column'
        }}>
            <div className='granulatorui' style={{
                'justifyContent':'center',
                'display':'flex',
                'flexDirection':'row'
            }}>
                {fileUI}
                <InputLocalFileUI handleSubmit={handleSubmit} handleFileChange={handleFileChange} fileInputRef={fileInputRef} fileName={fileName}/>
            </div>
            
            {/* Material UI interface for testing/debugging */}

            {/* <Typography id='bufferPosition'style={{'justifyContent':'center', 'display':'flex'}}>Audio file Controls</Typography> */}
            {/* <br></br> */}
            {/* <Slider id='bufferPosSlider' max={bufferSizeInSeconds} min={0} defaultValue={0} step={1} onChange={handleBufferSlider}/> */}
            
            {/* {fileUI} */}
            {/* <p style={{'display':'flex',
                       'justifyContent':'center', 'margin':'0'}}>{loadingFile || bufferLoading ? (loadingDefaultFile ? '---' : defaultAudioName): randomAudioName}</p> */}

            {/* <InputLocalFileUI handleSubmit={handleSubmit} handleFileChange={handleFileChange} fileInputRef={fileInputRef} fileName={fileName}/> */}

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
