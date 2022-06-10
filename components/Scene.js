import { useRef } from 'react';
import { extend, 
         useFrame, 
         useThree,
} from '@react-three/fiber';

import Cube from './Cube';
import Octa from './Octa';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Particles from './Particles';
import WaveformPlane from './WaveformPlane';
import { useStoreNew } from '../src/store';

import { EffectComposer, Selection, Outline } from '@react-three/postprocessing';

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

    return(
        <>
            <ambientLight intensity={0.8} />
            <pointLight intensity={1} position={[0, 6, 0]} />

                <color attach='background' args={['#D0D0D0']}/>
                <Particles count={1000} mouse={mouse}/>
                <WaveformPlane/>
                
            <Selection>
                    <Cube position={[-4,2,0]} setParameter={storeState.setGrainDensity} label={'Position/Density'}/>
                    <Cube position={[-4,-1,0]} setParameter={storeState.setCoordinates} label={'Pan'}/>
                    <Octa position={[0,1.5,0]} label={'Distribution'} setParameter={storeState.setFileOffset}/>
                    <Octa position={[0,3.5,0]} label={'Pitch Deviation'} setParameter={storeState.setPitchDeviation}/>
                    <Octa position={[0,-0.5,0]} label={'Attack'} setParameter={storeState.setGrainAttack}/>
                    <Octa position={[0,-2.5,0]} label={'Release'} setParameter={storeState.setGrainRelease}/>  
                
                <EffectComposer multisampling={8} autoClear={false}>
                    <Outline blur visibleEdgeColor="white" edgeStrength={50} width={1000} />
                </EffectComposer>
            </Selection>
        </>
    );

}

export default Scene;