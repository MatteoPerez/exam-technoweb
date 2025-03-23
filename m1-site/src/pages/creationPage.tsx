import {useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './creationPage.module.css'
import { TextField , Checkbox , FormControlLabel } from '@mui/material';

export default function CreationPage() {

    const [checked, setChecked] = useState(false);


  return (
    <div className={styles.container}>


      <div className={styles.leftSection}>
        <h1>Book</h1>
        <div className={styles.textField}>
            <TextField
                label="Title"
                variant="outlined"
                sx={{
                    "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    paddingLeft: "30px"
                    },
                }}
            />
            <TextField
                label="Publication Year"
                fullWidth
                sx={{
                    "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    paddingLeft: "30px"
                    },
                }}
            />
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.rightSection}>
        <h1>Author</h1>
        <div className={styles.textField}>
            <FormControlLabel
                control={
                    <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
                }
                label="Author not yet existing"
            />
            <TextField
                label="First Name"
                variant="outlined"
                sx={{
                    "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    paddingLeft: "30px"
                    },
                }}
            />
            <TextField
                label="Publication Year"
                fullWidth
                sx={{
                    "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    paddingLeft: "30px"
                    },
                }}
            />
        </div>
      </div>
    </div>
  );
}