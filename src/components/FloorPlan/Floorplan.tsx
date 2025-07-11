import React, { useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useShallow } from "zustand/react/shallow";
import useSensorStore from "../../store/useSensorStore.tsx";
import Sensor from "../Sensor/Sensor";
import floorplanImageSrc from "/test_floorplan01.png";
import styles from "./Floorplan.module.css";

const Floorplan = () => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
    sensors,
    createSensor,
    sensorCreationMode,
    setSensorCreationMode,
    setFloorplanImageData,
  } = useSensorStore(
    useShallow(
      ({
        sensors,
        createSensor,
        sensorCreationMode,
        setSensorCreationMode,
        setFloorplanImageData,
      }) => ({
        sensors,
        createSensor,
        sensorCreationMode,
        setSensorCreationMode,
        setFloorplanImageData,
      }),
    ),
  );

  useEffect(() => {
    const imgEl = imageRef.current;
    if (!imgEl) return;

    const handleImageLoad = () => {
      const containerBounds = imgEl.getBoundingClientRect();
      if (!containerBounds) return console.warn("No bounds found.");

      setFloorplanImageData({
        src: floorplanImageSrc.slice(1),
        displayWidth: containerBounds.width,
        displayHeight: containerBounds.height,
      });
    };

    imgEl.addEventListener("load", handleImageLoad);
    return () => imgEl.removeEventListener("load", handleImageLoad);
  }, [setFloorplanImageData]);

  const handleAddNewSensor = (e: React.MouseEvent) => {
    if (!sensorCreationMode) return console.warn("Adding not enabled.");

    const newSensorName = prompt("Enter sensor name:") || "Unnamed Sensor";
    const containerBounds = imageContainerRef.current?.getBoundingClientRect();
    if (!containerBounds) return console.warn("No bounds found.");

    createSensor({
      id: Math.ceil(Math.random() * 10000),
      name: newSensorName,
      position: {
        x: e.clientX - containerBounds.left,
        y: e.clientY - containerBounds.top,
      },
    });
    setSensorCreationMode(false);
  };

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
              onClick={sensorCreationMode ? handleAddNewSensor : undefined}
              style={sensorCreationMode ? { cursor: "crosshair" } : undefined}
              className={styles.imageContainer}
            >
              <img
                ref={imageRef}
                src={floorplanImageSrc}
                alt="Floorplan"
                className={styles.floorplanImage}
              />
              {sensors.map((sensor, index) => (
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
