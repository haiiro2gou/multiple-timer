import * as React from "react";

export const useSound = () => {
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const isPlayingRef = React.useRef(false);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        const audio = new Audio("/sounds/alarm.mp3");
        audioRef.current = audio;

        const handlePlay = () => {
            isPlayingRef.current = true;
        };
        const handleEnd = () => {
            isPlayingRef.current = false;
            // eslint-disable-next-line functional/immutable-data
            audio.currentTime = 0;
        };
        const handleError = () => {
            console.error("Error playing sound");
            isPlayingRef.current = false;
        };

        audio.addEventListener("play", handlePlay);
        audio.addEventListener("ended", handleEnd);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("ended", handleEnd);
            audio.removeEventListener("error", handleError);
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    const initAudio = React.useCallback(() => {
        const audio = audioRef.current;
        if (audio === null) return;

        // eslint-disable-next-line functional/immutable-data
        audio.volume = 0.0;
        audio.play().catch(() => {
            /* ignore */
        });
        // eslint-disable-next-line functional/immutable-data
        audio.currentTime = 0;
        // eslint-disable-next-line functional/immutable-data
        audio.volume = 1.0;
    }, []);

    const playAlarmSound = React.useCallback(() => {
        const audio = audioRef.current;
        if (audio === null || isPlayingRef.current) return;
        audio.play().catch((e: unknown) => {
            console.error("Error playing sound", e);
        });
    }, []);

    return { initAudio, playAlarmSound };
};
