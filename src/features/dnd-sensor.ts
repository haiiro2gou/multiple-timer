import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    type KeyboardSensorOptions,
} from "@dnd-kit/core";

const keyboardSensorOptions: KeyboardSensorOptions = {
    coordinateGetter: event => {
        const target = event.target as HTMLElement;
        const scrollingContainer = target.closest(
            "[data-dnd-scrolling-container='true']"
        );
        if (scrollingContainer === null) return { x: 0, y: 0 };

        const rect = scrollingContainer.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    },
};

export const useDndSensors = () =>
    useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, keyboardSensorOptions)
    );
