
export default function BoxUI(props){

    return(
        <>
        <mesh position={props.position}>
            <boxGeometry args={[2, 2, 1]}/>
            <meshNormalMaterial/>
            {props.html}
        </mesh>
        </>
    );
}

BoxUI.default ={
    position: [0,0,0]
}