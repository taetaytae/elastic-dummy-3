import React from 'react';
import {
    Canvas,
} from '@react-three/fiber';

import Scene from './Scene';
import { Preload } from '@react-three/drei';
import { Suspense } from 'react';

class World extends React.Component {
    render(){
        return(
            <div id='scene-container'>
                 <style jsx>{`
                   #scene-container {
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
                <Canvas camera={{fov:35, aspect:1, near:0.1, far: 200, position:[0,0,15], zoom:1}} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <Preload all={true}/>
                        <Scene/>
                    </Suspense>
                </Canvas>
            </div>
        );
    }
}

export default World;