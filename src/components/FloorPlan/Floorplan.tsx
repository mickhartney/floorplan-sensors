import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Sensor from "../Sensor/Sensor.tsx";
import type { SensorType } from "../../App.tsx";
import floorplan from "/test_floorplan01.png";
import styles from "./Floorplan.module.css";

type FloorplanProps = {
  sensors: SensorType[];
};

const Floorplan = ({ sensors }: FloorplanProps) => {
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
            <div>
              <img
                src={floorplan}
                alt="Floorplan name goes here"
                className={styles.floorplanImage}
              />
              {sensors.map((sensor, index) => (
                <Sensor sensor={sensor} key={sensor.id} marker={index + 1} />
              ))}
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

export default Floorplan;
