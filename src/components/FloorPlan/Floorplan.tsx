import React, { useRef } from "react";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useShallow } from "zustand/react/shallow";
import useSensorStore from "../../store/useSensorStore.tsx";
import Sensor from "../Sensor/Sensor";
import floorplanImageSrc from "/test_floorplan01.png";
import styles from "./Floorplan.module.css";

const Floorplan = () => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
    sensors,
    createSensor,
    isSensorCreationMode,
    setIsSensorCreationMode,
    setImageData,
  } = useSensorStore(
    useShallow(
      ({
        sensors,
        createSensor,
        isSensorCreationMode,
        setIsSensorCreationMode,
        setImageData,
      }) => ({
        sensors,
        createSensor,
        isSensorCreationMode,
        setIsSensorCreationMode,
        setImageData,
      }),
    ),
  );

  const handleImageLoad = () => {
    const imgEl = imageRef.current;
    if (!imgEl) return;

    const containerBounds = imgEl.getBoundingClientRect();
    if (!containerBounds) return console.warn("No bounds found.");

    setImageData({
      src: floorplanImageSrc,
      displayWidth: containerBounds.width,
      displayHeight: containerBounds.height,
    });
  };

  const handleAddNewSensor = (e: React.MouseEvent) => {
    if (!isSensorCreationMode) {
      console.warn(
        "Adding new sensor not enabled. Click 'Add New Sensor' first.",
      );
      return;
    }

    const newSensorName = prompt("Enter sensor name:") || "";
    const containerBounds = imageContainerRef.current?.getBoundingClientRect();
    const transformRef = transformComponentRef.current;

    if (!containerBounds || !transformRef) {
      console.warn("No bounds or transform ref found.");
      return;
    }

    const scale = transformRef.instance.transformState.scale;
    const x = (e.clientX - containerBounds.left) / scale;
    const y = (e.clientY - containerBounds.top) / scale;

    createSensor({
      name: newSensorName,
      position: { x, y },
    });

    setIsSensorCreationMode(false);
  };

  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      ref={transformComponentRef}
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
              onClick={isSensorCreationMode ? handleAddNewSensor : undefined}
              style={isSensorCreationMode ? { cursor: "crosshair" } : undefined}
              className={styles.imageContainer}
            >
              <img
                ref={imageRef}
                src={floorplanImageSrc}
                onLoad={handleImageLoad}
                alt="Floorplan image" // get this from props or store in the future
                className={styles.floorplanImage}
              />
              {sensors.length > 0 &&
                sensors.map((sensor, index) => (
                  <Sensor
                    key={sensor.id}
                    sensor={sensor}
                    label={(index + 1).toString()}
                    containerRef={imageContainerRef}
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
