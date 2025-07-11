import { useRef, useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useSensorStore, {
  type SensorType,
} from "../../store/useSensorStore.tsx";
import styles from "./SensorItemDetails.module.css";

type SensorItemDetailsProps = {
  sensor: SensorType;
};

const SensorItemDetails = ({ sensor }: SensorItemDetailsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { updateSensor, deleteSensor } = useSensorStore(
    useShallow((state) => ({
      updateSensor: state.updateSensor,
      deleteSensor: state.deleteSensor,
    })),
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const saveSensorUpdate = () => {
    const newName = inputRef.current?.value.trim();
    if (newName && newName !== sensor.name) {
      updateSensor(sensor.id, { name: newName });
    }
    setIsEditing(false);
  };

  return (
    <div className={styles.sensorItem}>
      {isEditing ? (
        <input
          ref={inputRef}
          defaultValue={sensor.name}
          className={styles.sensorInput}
        />
      ) : (
        <span className={styles.sensorName}>{sensor.name}</span>
      )}
      <span className={styles.editSensorControls}>
        {isEditing ? (
          <button onClick={saveSensorUpdate}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Rename</button>
        )}
        <button onClick={() => deleteSensor(sensor.id)}>Delete</button>
      </span>
    </div>
  );
};

export default SensorItemDetails;
