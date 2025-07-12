import useSensorStore from "../../store/useSensorStore.tsx";
import SensorItemDetails from "../SensorItemDetails/SensorItemDetails";
import AddSensorButton from "../AddSensorButton/AddSensorButton.tsx";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const sensors = useSensorStore((state) => state.sensors);

  return (
    <div className={styles.sidebar}>
      <h2>Manage Sensors</h2>
      <AddSensorButton />
      <p className={styles.helpText}>
        To add a new sensor, click the button above and then click on the
        floorplan image to define the sensor position and name. To reposition an
        existing sensor, click and drag it on the floorplan.
      </p>

      {sensors.length > 0 ? (
        <ol className={styles.sensorList}>
          {sensors.map((sensor) => (
            <li key={sensor.id}>
              <SensorItemDetails sensor={sensor} />
            </li>
          ))}
        </ol>
      ) : (
        <p>No sensors added yet.</p>
      )}
    </div>
  );
};

export default Sidebar;
