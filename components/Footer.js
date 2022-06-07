import Link from 'next/link';
import styles from '../styles/Footer.module.css';
import Image from 'next/image'

export default function Footer(props) {

    const toggleHandler = () => {
        props.togglePopup();
        console.log('bruv');
    }

    return(
        <div className={styles.footer}>
            <div className={styles.githublogo}>
                    <a href="https://github.com/taetaytae/elastic-dummy-3" target="_blank" rel="noopener noreferrer">
                        <Image src={'/github.svg'} alt='github' width={500} height={500}/>
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