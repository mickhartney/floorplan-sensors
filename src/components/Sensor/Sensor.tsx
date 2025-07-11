import React from "react";
import type { SensorType } from "../../App";
import { useTransformContext } from "react-zoom-pan-pinch";
import styles from "./Sensor.module.css";

type SensorProps = {
  sensor: SensorType;
  label: string;
  onDrag: (sensorId: number, newPosition: { x: number; y: number }) => void;
};

const Sensor = ({ sensor, label, onDrag }: SensorProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const { transformState } = useTransformContext();

  const handleMouseDown = (e: React.MouseEvent, sensorId: number) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    const initialX = e.clientX;
    const initialY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentScale = transformState.scale;
      const deltaX = (moveEvent.clientX - initialX) / currentScale;
      const deltaY = (moveEvent.clientY - initialY) / currentScale;

      // Prevent moving outside the bounds
      if (sensor.position.x + deltaX < 0 || sensor.position.y + deltaY < 0) {
        return;
      }

      onDrag(sensorId, {
        x: sensor.position.x + deltaX,
        y: sensor.position.y + deltaY,
      });
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
      title="Click and drag to reposition sensor"
      className={styles.sensor}
      style={{
        left: sensor.position.x,
        top: sensor.position.y,
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.6 : 1,
      }}
      onMouseDown={(e) => handleMouseDown(e, sensor.id)}
    >
      {label}
    </div>
  );
};

export default Sensor;
