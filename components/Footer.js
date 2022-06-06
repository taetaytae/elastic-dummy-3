import Link from 'next/link';
import styles from '../styles/Footer.module.css';
import Popup from '../components/Popup';

/**
 * To-Do:
 * Update github readme -- done
 * Update portfolio page description/explanation
 * Default audio file put in correct link -- Awaiting moderation
 * Debug so it does not break
 *  -- While playing a submitted file, when you hit random it does not load and the audio does strange stuff -- Done
 *  -- Play button wonkiness when flipping render switch while audio is playing -- Done
 */

export default function Footer(props) {

    const toggleHandler = () => {
        props.togglePopup();
        console.log('bruv');
    }

    return(
        <div className={styles.footer}>
            <div className={styles.githublogo}>
                    <a href="https://github.com/taetaytae/elastic-dummy-3" target="_blank" rel="noopener noreferrer">
                        <img src={'/github.svg'} alt='github' />
                    </a>
            </div>
            <div className={styles.item}>
                <p>links</p>
                <a href={'https://mariosan.com/'} target="_blank" rel="noopener noreferrer">Mario Sanchez</a>
                <br/>
                <a href={'https://youtu.be/95w95OyoEjo'} target="_blank" rel="noopener noreferrer">Elastic Dummy</a>
            </div>
            <div className={styles.item}>
                <br></br>
                <a onClick={toggleHandler}>Help</a>
                <br></br>
                <Link href='/'>
                    <a>Home</a>
                </Link>
            </div>
        </div>
    )
}