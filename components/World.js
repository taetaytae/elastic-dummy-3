import React from 'react';
import {
    Canvas,
} from '@react-three/fiber';

import Scene from './Scene';
import { Preload } from '@react-three/drei';
import { Suspense } from 'react';
import styles from '../styles/Screen.module.css';

class World extends React.Component {
    render(){
        return(
            <div className={styles.worldcontainer}>
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