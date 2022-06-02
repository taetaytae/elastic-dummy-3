import React from 'react';
import Layout from '../components/Layout';
import AudioButton from '../components/AudioButton';
import { UpdatePosition } from '../components/AudioButton';

import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import World from '../components/World';
import create from 'zustand';
import { useStoreNew } from '../components/store';
import Footer from '../components/Footer';
import styles from '../styles/Screen.module.css';

export const useStore = create((set) => ({
    x: 0,
    y: 0,
    isDragging:[],
    canvasRef: null,
    setCoordinates: (x, y) => set((state) => ({x: x, y: y})),
    setCanvasRef: (ref) => set(() => ({canvasRef:ref})),
    addDragging: (id) => set((state) => state.isDragging.push(id)),
    removeDragging: (id) => set((state) => {
        const index = state.isDragging.indexOf(id);
        if(index > -1){
            state.isDragging.splice(index, 1);
        } else{
            console.log('index not found')
        }
    }),
    clearDragging: () => set((state) => state.isDragging = []),
}));

class Screen extends React.Component {
    constructor(props){
        super(props);
       
        this.state = {
            renderCanvas: false,
            x: 0,
            y: 0,
            fileName: '',
        }

        this.toggleCanvasRender = this.toggleCanvasRender.bind(this);
        this.setCoordinates = this.setCoordinates.bind(this);

    }

    toggleCanvasRender(){
        if(useStoreNew.getState().granulatorRef.current != null){
            useStoreNew.getState().granulatorRef.current.refStopClock();
        }
        this.setState({renderCanvas: !this.state.renderCanvas})
        console.log('render state: ', this.state.renderCanvas);
    }

    setCoordinates(x, y){
        this.setState({x: x, y: y});
    }

    render() {
        const renderState = this.state.renderCanvas;
        let world;

        const renderSwitch = <Switch onChange={this.toggleCanvasRender}/>

        if(!renderState){
            world = <></>;
        } else {
            world = <World/>
        }

        useStoreNew.subscribe((state) => {
            this.setState({fileName: state.currentAudioFile})
        });

        return(
            <div className={styles.container}>
            <Layout>
                 <div className={styles.main}>
                    <div className={styles.worldcontainer}>
                        {world}
                    </div>
                    <div className={styles.interface}>
                        <AudioButton/>
                        <UpdatePosition/>
                        <div className={styles.secondrow}>
                            <FormControlLabel control={renderSwitch} label='Render'/>
                            <p>Current Audio File: {this.state.fileName}</p>
                        </div>
                    </div>
                </div>
            </Layout>
            <Footer/>
            </div>
        );
    }
}

export default Screen;