import create from 'zustand';

export const useStoreNew = create((set) => ({
    x: 0,
    y: 0,
    isDragging:[],
    canvasRef: null,
    granulatorRef: null,
    granulatorUIRef: null,
    filePosition: 0,
    fileOffsetMax: 0,
    pitchOffsetMax: 0,
    grainAttack: 0,
    grainRelease: 0,
    grainDensity: 1,
    bufferSizeInSeconds: null,
    currentAudioFile: '---',

    setCoordinates: (x, y, xMin, xMax, yMin, yMax) => set((state) => ({x: x, y: y})),
    setCanvasRef: (ref) => set(() => ({canvasRef:ref})),
    setGranulatorRef: (ref) => set(() => ({granulatorRef:ref})),
    setGranulatorUIRef: (ref) => set(() => ({granulatorUIRef: ref})),

    setFileOffset: (input, inputMin, inputMax) => set((state) => {
        const outputMax = 5;
        const outputMin = 0;
        const scaledValue = (outputMax - outputMin) * input/inputMax + outputMin;
        const fileOffsetMaxDecimal = Math.min(Math.max(scaledValue, outputMin), outputMax);
        state.fileOffsetMax = Math.round(fileOffsetMaxDecimal * 100) / 100;
    }),
    setPitchDeviation: (input, inputMin, inputMax) => set((state) => {
        const scaledValue = input/inputMax;
        const pitchOffsetMaxDecimal = Math.min(Math.max(scaledValue, 0), 1);
        state.pitchOffsetMax = Math.round(pitchOffsetMaxDecimal * 100) / 100;
    }),
    setGrainAttack: (input, inputMin, inputMax) => set((state) => {
        //Input value between 0 and 6
        // if input needs to be between 0 and 1 then input/inputMax
        //Output value between 0 and 1
        const scaledValue = input/inputMax;
        const grainAttackDecimal = Math.min(Math.max(scaledValue, 0), 1);
        state.grainAttack = Math.round(grainAttackDecimal * 100) / 100;
    }),
    setGrainRelease: (input, inputMin, inputMax) => set((state) => {
        const scaledValue = input/inputMax;
        const grainReleaseDecimal = Math.min(Math.max(scaledValue, 0), 1);
        state.grainRelease = Math.round(grainReleaseDecimal * 100) / 100;
    }),

    setGrainDensity: (x, y, xMin, xMax, yMin, yMax) => set((state) => {
        const outputGrainMax = 15;
        const outputGrainMin = 0.1;
        const inputYPercentage = (y - yMin)/(yMax - yMin);
        const scaledYValue = (outputGrainMax - outputGrainMin) * inputYPercentage + outputGrainMin;
        const grainDensityDecimal = Math.min(Math.max(scaledYValue, outputGrainMin), outputGrainMax);
        state.grainDensity = Math.round(grainDensityDecimal * 10) / 10;

        if(state.bufferSizeInSeconds != null){
            const filePosMax = state.bufferSizeInSeconds;
            const filePosMin = 0;
            const inputXPercentage = (x - xMin)/(xMax - xMin);
            const scaledXValue = (filePosMax - filePosMin) * inputXPercentage + filePosMin;
            const filePosDecimal = Math.min(Math.max(scaledXValue, filePosMin), filePosMax);
            state.filePosition = Math.round(filePosDecimal);
        } else{
            state.filePosition = 0;
        }
    }),
    setBufferSizeInSeconds: (bufferSizeInSeconds) => set((state) => {
        state.bufferSizeInSeconds = bufferSizeInSeconds;
    }),
    updateCurrentAudioFile: (newFileName) => set((state) => {
        state.currentAudioFile = newFileName;
    }),


    addDragging: (id) => set((state) => state.isDragging.push(id)),
    removeDragging: (id) => set((state) => {
        const index = state.isDragging.indexOf(id);
        if(index > -1){
            state.isDragging.splice(index, 1);
        } else{
            console.log('index not found')
        }
    }),
    clearDragging: () => set((state) => state.isDragging = []),
}));