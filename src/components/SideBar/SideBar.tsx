import React from "react";
import type { SensorType } from "../../App.tsx";
import styles from "./Sidebar.module.css";
import SensorItemDetails from "../SensorItemDetails/SensorItemDetails.tsx";

type SidebarProps = {
  sensors: SensorType[];
  onAddSensor: (e: React.MouseEvent) => void;
  onUpdateSensorDetails: (sensorId: number, newName: string) => void;
  onDeleteSensor: (sensorId: number) => void;
};

const Sidebar = ({
  sensors,
  onAddSensor,
  onUpdateSensorDetails,
  onDeleteSensor,
}: SidebarProps) => {
  return (
    <div className={styles.sidebar}>
      <h2>Manage Sensors</h2>
      <button className={styles.addSensorButton} onClick={onAddSensor}>
        Add Sensor
      </button>
      <p className={styles.helpText}>
        To add a new sensor, click the button above and then click on the
        floorplan image to define the sensor position and name.
      </p>
      <ol className={styles.sensorList}>
        {sensors.map((sensor) => (
          <li key={sensor.id}>
            <SensorItemDetails
              sensor={sensor}
              onUpdateSensorDetails={onUpdateSensorDetails}
              onDeleteSensor={onDeleteSensor}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Sidebar;
