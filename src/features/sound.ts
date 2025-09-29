export const initAudio = (): AudioContext | null => {
    try {
        if (typeof window.AudioContext !== "undefined") {
            return new window.AudioContext();
        } else if (
            typeof (window as { webkitAudioContext?: typeof AudioContext })
                .webkitAudioContext !== "undefined"
        ) {
            return new (
                window as unknown as { webkitAudioContext: typeof AudioContext }
            ).webkitAudioContext();
        } else {
            throw new Error("Web Audio API is not supported in this browser");
        }
    } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
        return null;
    }
};

export const playNotificationSound = () => {
    const audioCtx = initAudio();
    if (audioCtx === null) {
        console.warn(
            "AudioContext could not be initialized. Sound was not played."
        );
        return;
    }

    if (audioCtx.state === "suspended") {
        audioCtx.resume().catch((e: unknown) => {
            console.error("Failed to resume AudioContext:", e);
        });
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Volume

    oscillator.start(audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.5
    ); // Fade out
    oscillator.stop(audioCtx.currentTime + 0.5);
};
