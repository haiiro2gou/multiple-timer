import * as React from "react";

export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = React.useState(Date.now());

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return currentTime;
};
