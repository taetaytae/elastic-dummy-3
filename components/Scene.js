import { useEffect, useRef, useState } from 'react';
import { extend, 
         useFrame, 
         useThree,
} from '@react-three/fiber';

import Cube from './Cube';
import Lights from './Lights';
import Octa from './Octa';
import BoxUI from './BoxUI';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { degToRad } from 'three/src/math/MathUtils';
import Particles from './Particles';
import Effects from './Effects';
import Main from './Main';
import { Slider, Button, ButtonGroup } from "@mui/material";
import WaveformPlane from './WaveformPlane';
import { useStoreNew } from '../src/store';

import { EffectComposer, Selection, Bloom, Outline } from '@react-three/postprocessing';

// make OrbitControls available as a jsx element
extend({ OrbitControls });

const CameraControls = () => {
    const {
        camera,
        gl: {domElement},
    } = useThree();
    const controls = useRef();
    useFrame((state) => controls.current.update());

    return <orbitControls ref={controls} 
                          args={[camera, domElement]} 
                          enableDamping={true}
                          enableZoom={true}
                          maxPolarAngle={Math.PI/3}
                          minPolarAngle={Math.PI/3}/>
};

function Scene() {

    const mouse = useRef([0, 0]);

    const storeState = useStoreNew.getState();
    useEffect(() => {
        useStoreNew.subscribe((state) => {
        //    console.log("filePosition: ", state.filePosition, " grain density: ", state.grainDensity);
        })
    }, []);

    useFrame(({ clock }, delta) => {

    });

    return(
        <>
            {/* <CameraControls/> */}
            {/* <mesh position={[0,0,0]} scale={10} rotation={[degToRad(-90),0,0]}>
                <planeBufferGeometry width={10} height={10}/>
                <meshNormalMaterial/>
            </mesh> */}
            {/* <gridHelper args={[10, 10, 'black', 'black']}/> */}

            {/* Lights examples */}
            {/* <ambientLight intensity={0.5} /> */}
            <ambientLight intensity={0.8} />
            <pointLight intensity={1} position={[0, 6, 0]} />
            {/* <directionalLight color="red" position={[0, 0, 5]} /> */}
           

                <color attach='background' args={['#D0D0D0']}/>
                <Particles count={1000} mouse={mouse}/>
                <WaveformPlane/>
                {/* <Lights position={[2,0,20]}/> */}
            <Selection>
                    <Cube position={[-4,2,0]} setParameter={storeState.setGrainDensity} label={'Position/Density'}/>
                    <Cube position={[-4,-1,0]} setParameter={storeState.setCoordinates} label={'Pan'}/>
                    <Octa position={[0,1.5,0]} label={'Distribution'} setParameter={storeState.setFileOffset}/>
                    <Octa position={[0,3.5,0]} label={'Pitch Deviation'} setParameter={storeState.setPitchDeviation}/>
                    <Octa position={[0,-0.5,0]} label={'Attack'} setParameter={storeState.setGrainAttack}/>
                    <Octa position={[0,-2.5,0]} label={'Release'} setParameter={storeState.setGrainRelease}/>
                    {/* <BoxUI position={[-4,2.5,0]} html={btnUI}/> */}

            
                    
                
                <EffectComposer multisampling={8} autoClear={false}>
                    {/* <Bloom intensity={2} luminanceThreshold={0} luminanceSmoothing={0.9} height={400} /> */}
                    {/* <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
                    <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} height={400}/> */}
                    <Outline blur visibleEdgeColor="white" edgeStrength={50} width={1000} />
                </EffectComposer>
            </Selection>
        </>
    );

}

export default Scene;