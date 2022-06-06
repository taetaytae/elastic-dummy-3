import styles from '../styles/Popup.module.css';

export default function Popup(props) {

    const clickHandler = () => {
        props.togglePopup();
    }

    return(
        <div className={styles.popup}>
            
            <div className={styles.popupclose}>
                <span onClick={clickHandler}>❌</span> 
            </div>
            <h2>How it Works</h2>
           
            <p>
                Flip the render switch to start the scene. Move the objects in the scene<br/>
                using your mouse in order to control the grain parameters.
                
            </p>
            <ul>
                <li>Pitch Deviation: random pitch deviation for each grain</li>
                <li>Distribution: offset file position for each grain</li>
                <li>Attack: grain fade-in</li>
                <li>Release: grain fade-out</li>
            </ul>
            <br></br>
            <ul>
                <li>Position/Density: X axis for file position. Y axis for number of<br/>grains per second</li>
                <li>Pan: X/Y axis controls positional panning</li>
            </ul>
            <p>
                Use the buttons in the interface to pause and play the audio, change<br/> 
                the playback rate, fetch a random audio file, or submit your own file.
            </p>
        </div>
    )
}