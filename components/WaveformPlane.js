import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { Plane, MeshDistortMaterial } from "@react-three/drei";
import { useStore } from "../pages/screen";
import * as THREE from 'three';
import Canvas from "./Canvas";

const HTMLCanvasMaterial = ({ canvas }) => {

    const { gl } = useThree();
    // console.log(canvas, " we in html")

    let texture = new THREE.CanvasTexture(canvas.current);
    // console.log(texture);

    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    texture.flipY = true;
    texture.flipX = false;

        useFrame(() => {
            if (texture) {
            texture.needsUpdate = true;
            }
        });
    
        return (
            <MeshDistortMaterial
                color="#FFFFFF"
                attach="material"
                distort={0} // Strength, 0 disables the effect (default=1)
                speed={1} // Speed (default=1)
                roughness={9}
                reflectivity={0.9}
                refractionRatio={0.1}
                transparent={true}
                map={texture}
                side={THREE.DoubleSide}
                shininess={1000}
                depthTest={true}
            />
        );
    };

export default function WaveformPlane(props){

    const { canvasRef } = useStore();
    // console.log(canvasRef);
    let waveformComponent;

    if(canvasRef == null){
        waveformComponent = <meshBasicMaterial color="skyblue" wireframe/>
    } else{
        waveformComponent =  <HTMLCanvasMaterial canvas={canvasRef}/>
    }



    return(
        <Plane rotation-x={0} args={[10, 3, 4, 4]} position={[0,0,-5]}>
            {waveformComponent}
        </Plane>
    );
}