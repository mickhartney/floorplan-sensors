import useSensorStore from "../../store/useSensorStore.tsx";
import { useShallow } from "zustand/react/shallow";
import styles from "./AddSensorButton.module.css";

const AddSensorButton = () => {
  const { sensors, sensorCreationMode, setSensorCreationMode } = useSensorStore(
    useShallow(({ sensors, sensorCreationMode, setSensorCreationMode }) => ({
      sensors,
      sensorCreationMode,
      setSensorCreationMode,
    })),
  );

  const enableAddNewSensor = () => {
    if (sensors.length >= 10) {
      console.warn("Max sensors reached.");
      return;
    }
    setSensorCreationMode(true);
  };

  const buttonText = sensorCreationMode
    ? "Cancel New Sensor"
    : sensors.length >= 10
      ? "Maximum sensors reached"
      : "Add New Sensor";

  const buttonClass = sensorCreationMode
    ? styles.cancelNewSensorButton
    : styles.addNewSensorButton;

  const handleClick = sensorCreationMode
    ? () => setSensorCreationMode(false)
    : enableAddNewSensor;

  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      disabled={!sensorCreationMode && sensors.length >= 10}
    >
      {buttonText}
    </button>
  );
};

export default AddSensorButton;
