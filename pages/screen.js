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

        return(
            <div className='mainScreen' style={{'backgroundColor': '#D0D0D0', 'height': '100vh', 'overflow': 'auto'}}>
            <Layout>
                 <div className='homePage' style={{'gridTemplateRows': 'auto',
                                            'display': 'grid'}}>
                    <div className='interface' style={{
                        'justifySelf' : 'center',
                        'width': '80%',
                        'color':'#1F212B'
                    }}>
                        <AudioButton/>
                        <UpdatePosition/>
                        <FormControlLabel control={renderSwitch} label='Render'/>
                    </div>
                    <div id='world-container'>
                        <style jsx>{`
                            #world-container {
                                border:'1px solid #000000';
                                display: block;
                                margin: 0 auto
                                width:80vw;
                                height:80vh;
                            
                                /*
                                Set the container's background color to the same as the scene's
                                background to prevent flashing on load
                                */
                                background-color: #D0D0D0;
                            }
                        `}</style>
                        {world}
                    </div>
                </div>
            </Layout>
            <Footer/>
            </div>
        );
    }
}

export default Screen;