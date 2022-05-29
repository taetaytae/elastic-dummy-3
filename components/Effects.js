import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

extend({ EffectComposer, RenderPass, UnrealBloomPass, ShaderPass })

export default function Effects({children}) {
    const { gl, camera, size } = useThree();
    const [scene, setScene] = useState();
    const composer = useRef();

    useEffect(() => void scene && composer.current.setSize(size.width, size.height), [size])
    useFrame(() => composer.current.render(), 1)

  return (
    <>
      <scene ref={setScene}>{children}</scene>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera}/>
        <unrealBloomPass attachArray="passes" args={[undefined, 1.5, 1, 0]} />
        {/* <shaderPass attachArray="passes" args={[FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} /> */}
      </effectComposer>
    </>
  );
};