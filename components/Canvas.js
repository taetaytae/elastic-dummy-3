import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useStoreNew } from "../src/store";

const Canvas = (props) => {
    const { setCanvasRef } = useStoreNew();
    let ref = useRef();

    useEffect(() => {
        setCanvasRef(ref);
    }, [props.bufferChannelData]);

    const getPixelRatio = context => {
        let backingStore = 
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;

        return (window.devicePixelRatio || 1) / backingStore;
    }

    const drawBuffer = (width, height, context, bufferData) => {
        let data = bufferData;
        let step = Math.ceil( data.length / width);
        let amp = height / 2;

        for(let i=0; i<width; i++){
            let min = 1.0;
            let max = -1.0;
            for(let j=0; j<step; j++){
                let dataum = data[(i*step)+j];
                if(dataum < min)
                    min = dataum;
                if(dataum > max)
                    max = dataum;
            }
            context.fillRect(i, (1+min)*amp, 1, Math.max(1, (max-min)*amp));
        }


    }
   
    let divRef = useRef(null);
    const [triggerRender, setTriggerRender] = useState(false);

    const debouncedResize = useDebouncedCallback(() => {
        setTriggerRender(!triggerRender);
    }, 10);
    
    useEffect(() => {
        let canvas = ref.current;
        let context = canvas.getContext('2d');

        let ratio = getPixelRatio(context);
        // This does not update the width value on rerenders
        // let width = getComputedStyle(canvas)
        //         .getPropertyValue('width')
        //         .slice(0, -2);
        //This does update the width value on rerenders
        let width = document.getElementById('canvasDiv').offsetWidth;
        let height = getComputedStyle(canvas)
                .getPropertyValue('height')
                .slice(0, -2);

        
        canvas.width = width *ratio;
        canvas.height = height *ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        if(props.bufferLoaded){
            drawBuffer(canvas.width, canvas.height, context, props.bufferChannelData);
        }
        
        window.addEventListener('resize', () => {
            // console.log('div width: ', document.getElementById('canvasDiv').offsetWidth); 
            // console.log('canvas width: ', width);
            debouncedResize();
        });

        return () => {window.removeEventListener('resize', () => {console.log('resize done')})};
        

    }, [props.bufferChannelData, triggerRender])

    return(
        <div ref={divRef} id="canvasDiv">
            <canvas
                ref={ref}
                style={{ width: '100%', height: '200px', display: 'none' }}
            />
        </div>
    );
}

export default Canvas;