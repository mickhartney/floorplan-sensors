import React from "react";
import type { SensorType } from "../../App";
import styles from "./Sidebar.module.css";
import SensorItemDetails from "../SensorItemDetails/SensorItemDetails";

type SidebarProps = {
  sensors: SensorType[];
  addSensorButton: React.ReactNode;
  onUpdateSensorDetails: (sensorId: number, newName: string) => void;
  onDeleteSensor: (sensorId: number) => void;
};

const Sidebar = ({
  sensors,
  addSensorButton,
  onUpdateSensorDetails,
  onDeleteSensor,
}: SidebarProps) => {
  return (
    <div className={styles.sidebar}>
      <h2>Manage Sensors</h2>
      {addSensorButton}
      <p className={styles.helpText}>
        To add a new sensor, click the button above and then click on the
        floorplan image to define the sensor position and name. To reposition an
        existing sensor, click and drag it on the floorplan.
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
