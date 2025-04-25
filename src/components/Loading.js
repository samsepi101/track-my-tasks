import React, { useEffect } from 'react';
import { Spinner } from './Spinner';

const Loading = ({ fullScreen = true }) => {
    useEffect(() => {
        const target = document.getElementById('spinner-container');
        const spinner = new Spinner({
            color: '#3498db',
            lines: 12,
            length: 7,
            width: 5,
            radius: 10,
            speed: 1,
        }).spin(target);

        return () => {
            spinner.stop();
        };
    }, []);

    return (
        <div
            id="spinner-container"
            style={{
                width: '100%',
                height: fullScreen ? '100vh' : '100px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    );
};

export default Loading;
