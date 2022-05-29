import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { meshBounds, Html } from "@react-three/drei";
import { useStore } from '../pages/screen';
import { MathUtils } from 'three';
import { Select } from '@react-three/postprocessing';
import { useStoreNew } from './store';


function Octa(props) {

    const group = useRef();
    const { viewport } = useThree();
    const [click, isClicking] = useState(false);
    const [hovered, setHovered] = useState(null);
    const { setCoordinates } = useStore();

    const radiansPerSecond = MathUtils.degToRad(80);

    // const storeRef = useRef(useStoreNew.getState());

    // const { setCoordinates } = useStoreNew();

    // useEffect(() => {

    //     useStoreNew.subscribe(console.log('subscribed'));

    //     console.log('current position x: ',group.current.position.x);
    //     console.log('ref offset: ', storeRef.current.fileOffsetMax[0]);
    //     console.log('store value: ', props.test);
    // }, []);

    useFrame(({ mouse, clock }, delta) => {
        const x = mouse.x*viewport.width/2;
        const y = mouse.y*(viewport.height)/2;

        // group.current.rotation.x = clock.getElapsedTime();
        group.current.rotation.x += radiansPerSecond * delta;
    
        if(click && x>(0) && x<(viewport.width/2)){
            //Set parameter takes in value to set, input min, and input max for scaling

            // this is wrong because I'm trigerring a render on every frame
            props.setParameter(x, 0, viewport.width/2);
            // setCoordinates(x, y);

            // useStoreNew.getState().setFileOffset(x, 0, 6);
            // console.log(useStoreNew.getState().fileOffsetMax);
        
            // console.log('store value: ', props.test);
            // this is fine because I'm just mutating ref
            group.current.position.set(x, group.current.position.y, 0);
        }

    });

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }, [hovered]);

    return(
        <Select enabled={hovered}>
        <group ref={group} position={props.position}>
            <mesh onPointerUp={() => isClicking(false)} onPointerDown={() => isClicking(true)} raycast={meshBounds} onPointerOut={() => {setHovered(false); isClicking(false)}} onPointerOver={() => setHovered(true)}>
            <octahedronBufferGeometry args={[0.7, 0]}/>
            <meshNormalMaterial opacity={1} color='red' toneMapped={false}/>
            <Html position={[0.9, 0.5, 0]}>
                <div style={{'textAlign': 'left',
                            'background': '#202035',
                            'color': 'white',
                            'padding': '1px 1px',
                            'borderRadius': '5px',
                            'userSelect':'none'}} className="content">
                    {`${props.label}`}
                </div>
            </Html>
            </mesh>
        </group>
        </Select>
    );
}

Octa.defaultProps = {
    material: <meshStandardMaterial color='orchid'/>,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
};

export default Octa;