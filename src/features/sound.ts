import * as React from "react";

export const useSound = () => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        audioRef.current ??= new Audio("/sounds/alarm.mp3");
        const audio = audioRef.current;

        const handlePlay = () => {
            setIsPlaying(true);
        };
        const handleEnd = () => {
            setIsPlaying(false);
            // eslint-disable-next-line functional/immutable-data
            audio.currentTime = 0;
        };
        const handleError = () => {
            setIsPlaying(false);
        };

        audio.addEventListener("play", handlePlay);
        audio.addEventListener("ended", handleEnd);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("ended", handleEnd);
            audio.removeEventListener("error", handleError);
        };
    }, []);

    const initAudio = React.useCallback(() => {
        const audio = audioRef.current;
        if (audio === null) return;

        // eslint-disable-next-line functional/immutable-data
        audio.volume = 0;
        audio.play().catch(() => {
            /* ignore */
        });
        audio.pause();
        // eslint-disable-next-line functional/immutable-data
        audio.currentTime = 0;
        // eslint-disable-next-line functional/immutable-data
        audio.volume = 1;
    }, []);

    const playAlarmSound = React.useCallback(() => {
        const audio = audioRef.current;
        if (audio === null || isPlaying) return;
        audio.play().catch((e: unknown) => {
            console.error("Failed to play sound:", e);
        });
    }, [isPlaying]);

    return { initAudio, playAlarmSound };
};
