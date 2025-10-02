import {useState, useEffect} from 'react';
import { Slide, Alert } from '@mui/material';

export default function AlertComponent({success, error, successMsg, errorMsg, setSuccess, setError}) {
    useEffect(() => {
        if (success || error) {
            const succTimer = setTimeout(() => {
                if(success){
                    setSuccess(false)
                }
                if(error){
                    setError(false);
                }
            }, 3000);
            return () => clearTimeout(succTimer);
        }
    }, [success, error]);

    return (
        <>
            {success && (
                <Slide direction="left" in={success} mountOnEnter unmountOnExit>
                    <Alert
                        sx={{ position: 'fixed', py: 1, top: 65, left: 0, right: 0, zIndex: 1300, borderRadius: 0 }}
                        onClose={() => setSuccess(false)}
                        severity="success"
                        variant="filled"
                    > {successMsg}!
                    </Alert>
                </Slide>
              )}

              {error && (
                <Slide direction="left" in={error} mountOnEnter unmountOnExit>
                    <Alert
                        sx={{ position: 'fixed', py: 1, top: 65, left: 0, right: 0, zIndex: 1300, borderRadius: 0 }}
                        onClose={() => setError(false)}
                        severity="error"
                        variant="filled"
                    > {errorMsg}!
                    </Alert>
                </Slide>
              )}
        </>
    )
}