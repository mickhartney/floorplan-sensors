import { useRef, useState, useEffect } from "react";
import type { SensorType } from "../../App";
import styles from "./SensorItemDetails.module.css";

type SensorItemDetailsProps = {
  sensor: SensorType;
  onUpdateSensorDetails: (sensorId: number, newName: string) => void;
  onDeleteSensor: (sensorId: number) => void;
};

const SensorItemDetails = ({
  sensor,
  onUpdateSensorDetails,
  onDeleteSensor,
}: SensorItemDetailsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveSensorDetails = () => {
    const newName: string | undefined = inputRef.current?.value.trim();

    // Validate the new name
    if (!newName || newName === sensor.name) {
      setIsEditing(false);
      return;
    }

    onUpdateSensorDetails(sensor.id, newName || sensor.name);
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
          <button onClick={() => handleSaveSensorDetails()}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button onClick={() => onDeleteSensor(sensor.id)}>Delete</button>
      </span>
    </div>
  );
};

export default SensorItemDetails;
