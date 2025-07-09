import type { SensorType } from "../../App.tsx";
import styles from "./Sensor.module.css";

type SensorProps = {
  sensor: SensorType;
  marker: number;
};

const Sensor = ({ sensor, marker }: SensorProps) => {
  return (
    <div
      className={styles.sensor}
      style={{
        left: sensor.position.x,
        top: sensor.position.y,
      }}
    >
      {marker}
    </div>
  );
};

export default Sensor;
