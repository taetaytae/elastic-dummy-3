import styles from '../styles/AudioUI.module.css';
import { ButtonGroup, Button } from '@mui/material';
import { useState, forwardRef, useImperativeHandle } from 'react';

const GranulatorUI = forwardRef((props, ref) => {
    const [playState, setPlayState] = useState('Play');

    useImperativeHandle(ref, () => ({
        resetPlayBtn: () => {
            canvasWasToggled();
        }
    }))

    const handlePlayClick = () => {
        if(props.bufferLoaded){
            props.startClock();
            setPlayState(playState == 'Play' ? 'Pause' : 'Play');
        }
    }

    const canvasWasToggled = () => {
        setPlayState('Play');
    }

    return(
        <div style={{
            'flexDirection':'row',
            'display':'flex',
            }}>
                <Button className={styles.button} variant='outlined' onClick={handlePlayClick}>{playState}</Button>
                <Button className={styles.button} variant='outlined' onClick={props.handleRandomButton}>Rng🔀</Button>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button onClick={props.playbackFnOneHalf}>1/2x</Button>
                    <Button onClick={props.playbackFnOne}>1x</Button>
                    <Button onClick={props.playbackFnTwo}>2x</Button>
                </ButtonGroup>
        </div>
    )
})

GranulatorUI.displayName = 'GranulatorUI';

export default GranulatorUI;