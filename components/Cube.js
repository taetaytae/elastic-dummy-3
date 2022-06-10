import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { meshBounds, Html } from "@react-three/drei";
import { useStoreNew } from '../src/store';
import { Select } from '@react-three/postprocessing';


function Cube(props) {

    const group = useRef();
    const { viewport } = useThree();
    const [click, isClicking] = useState(false);
    const [hovered, setHovered] = useState(null);
    const { isDragging, addDragging, clearDragging } = useStoreNew();

    useFrame(({ mouse }) => {
        const x = mouse.x*viewport.width/2;
        const y = mouse.y*(viewport.height)/2;

        
     
        if(click && isDragging[0] == props.label){
            props.setParameter(x, y, -viewport.width/2,  viewport.width/2, -viewport.height/2, viewport.height/2);
            group.current.position.set(x, y, 0);
        }

    });

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }, [hovered]);

    const handlePointerUp = () => {
        isClicking(false);
        clearDragging();
    }

    const handlePointerDown = () => {
        isClicking(true);
        addDragging(props.label);
    }

    return(
        <Select enabled={hovered}>
        <group ref={group} position={props.position}>
            <mesh onPointerUp={handlePointerUp} onPointerDown={handlePointerDown} raycast={meshBounds} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <sphereBufferGeometry args={[0.8, 30, 30]}/>
            <meshBasicMaterial color='cyan' toneMapped={false}/>
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

Cube.defaultProps = {
    material: <meshStandardMaterial color='orchid'/>,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
};

export default Cube;