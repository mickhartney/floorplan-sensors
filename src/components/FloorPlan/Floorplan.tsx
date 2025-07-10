import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Sensor from "../Sensor/Sensor";
import type { SensorType } from "../../App";
import floorplan from "/test_floorplan01.png";
import styles from "./Floorplan.module.css";

type FloorplanProps = {
  sensors: SensorType[];
  addNewSensorEnabled: boolean;
  onAddNewSensor: (e: React.MouseEvent) => void;
  onUpdateSensorPosition: (
    sensorId: number,
    newPosition: { x: number; y: number },
  ) => void;
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
};

const Floorplan = ({
  sensors,
  addNewSensorEnabled = false,
  onAddNewSensor,
  onUpdateSensorPosition,
  imageContainerRef,
}: FloorplanProps) => {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className={styles.transformContainer}>
          <div className={styles.zoomTools}>
            <button onClick={() => zoomIn()}>Zoom In</button>
            <button onClick={() => zoomOut()}>Zoom Out</button>
            <button onClick={() => resetTransform()}>Reset Zoom</button>
          </div>
          <TransformComponent>
            <div
              ref={imageContainerRef}
              onClick={addNewSensorEnabled ? onAddNewSensor : undefined}
              style={addNewSensorEnabled ? { cursor: "crosshair" } : undefined}
            >
              <img
                src={floorplan}
                alt="Floorplan name goes here" // FIXME
                className={styles.floorplanImage}
              />
              {sensors.map((sensor, index) => (
                <Sensor
                  key={sensor.id}
                  sensor={sensor}
                  label={(index + 1).toString()}
                  onDrag={onUpdateSensorPosition}
                />
              ))}
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

export default Floorplan;
