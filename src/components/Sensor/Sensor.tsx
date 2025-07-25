import React, { useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";
import { useShallow } from "zustand/react/shallow";
import useSensorStore, {
  type SensorType,
} from "../../store/useSensorStore.tsx";
import styles from "./Sensor.module.css";

type SensorProps = {
  sensor: SensorType;
  label: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const Sensor = ({ sensor, label, containerRef }: SensorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { transformState } = useTransformContext();
  const { isSensorCreationMode, updateSensor } = useSensorStore(
    useShallow(({ isSensorCreationMode, updateSensor }) => ({
      isSensorCreationMode,
      updateSensor,
    })),
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const initialX = e.clientX;
    const initialY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const scale = transformState.scale;
      const bounds = containerRef.current?.getBoundingClientRect();

      const deltaX = (moveEvent.clientX - initialX) / scale;
      const deltaY = (moveEvent.clientY - initialY) / scale;

      // Ensure sensor stays within bounds
      if (
        bounds &&
        sensor.position.x + deltaX >= 0 &&
        sensor.position.y + deltaY >= 0 &&
        sensor.position.x + deltaX <= bounds.width &&
        sensor.position.y + deltaY <= bounds.height
      ) {
        updateSensor(sensor.id, {
          position: {
            x: sensor.position.x + deltaX,
            y: sensor.position.y + deltaY,
          },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      title={isSensorCreationMode ? "" : "Drag to reposition"}
      className={styles.sensor}
      style={{
        left: sensor.position.x,
        top: sensor.position.y,
        cursor: isSensorCreationMode
          ? "unset"
          : isDragging
            ? "grabbing"
            : "grab",
        opacity: isDragging ? 0.6 : 1,
      }}
      onMouseDown={!isSensorCreationMode ? handleMouseDown : undefined}
    >
      {label}
    </div>
  );
};

export default Sensor;
