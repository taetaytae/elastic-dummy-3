import styles from '../styles/AudioUI.module.css';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';

export default function InputLocalFileUI(props){
    const [selectBtnVariant, setSelectBtnVariant] = useState('outlined');

    const handleFileChange = () => {
        setSelectBtnVariant('contained');
    }

    return(<form method="post" encType="multipart/form-data" onSubmit={props.handleSubmit}>
                <label htmlFor="contained-button-file">
                    <input ref={props.fileInputRef} type="file" id="contained-button-file" accept="audio/*" style={{display: 'none'}} onChange={handleFileChange}/>
                    {/* <Typography style={{'justifyContent':'center', 'display':'flex'}}>Selected Local File: {props.fileName}</Typography> */}
                    <div style={{'flexDirection':'row','display':'flex'}} id="inputButtons">
                        <Button variant={selectBtnVariant} component="span" className={styles.button}>
                        Select
                        </Button>
                        <Button variant='outlined' type='submit' className={styles.button}>Submit</Button>
                    </div>
                </label>
            </form>);
}