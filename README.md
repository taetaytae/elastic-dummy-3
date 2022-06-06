# ED-003

ED-003 is a web-based granular synthesizer made in React using [Next.js](https://nextjs.org/). The project utilizes [Tone.js](https://tonejs.github.io/) to handle the audio, [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) and [Material UI](https://mui.com/) for the interface, [axios](https://axios-http.com/) to handle api requests, and [zustand](https://github.com/pmndrs/zustand) for state management.

The audio files used as the sound source for the synthesizer are primarily fetched from FreeSound using the [FreeSound API](https://freesound.org/docs/api/). The random file search was set up using the [Words API](https://www.wordsapi.com/).

Visit the project here: https://elastic-dummy-3.vercel.app/

## How it Works

Flip the render switch in order to toggle the React Three Fiber scene. Press Tone Start in order to initialize the audio framework.

The React Three Fiber UI is controlled by moving the shapes seen on the scene (four octahedrons and two spheres) using the mouse. The first four octahedrons use their X-axis position to control each grain's pitch deviation, file position offset, attack, and release. 

The two spheres use their X/Y-axis position to control their respective parameters. The first sphere uses its X-axis position to control each grain's starting position on the audio file and the Y-axis to set the density (grains per second) at which the grains are triggered. The second sphere uses its X/Y-position in order to set the audio's spatialized X/Y panning position.

The material UI interface has seven buttons. The buttons are used to play/pause the audio, fetch a new random file, select the audio playback speed, select your own local file from your system and submit yor selected file.

## Running Locally

In order to run the application locally, make sure to setup local environment variables containing a token from the FreeSound API, an API key for the Words API,
and two public variables pointing to the two API routes in the `pages/api` folder as seen in the `.env.example` file.
