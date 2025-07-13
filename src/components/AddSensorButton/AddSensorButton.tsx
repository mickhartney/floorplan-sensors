import useSensorStore, { MAX_SENSORS } from "../../store/useSensorStore.tsx";
import { useShallow } from "zustand/react/shallow";
import styles from "./AddSensorButton.module.css";

const AddSensorButton = () => {
  const { sensors, isSensorCreationMode, setIsSensorCreationMode } =
    useSensorStore(
      useShallow(
        ({ sensors, isSensorCreationMode, setIsSensorCreationMode }) => ({
          sensors,
          isSensorCreationMode,
          setIsSensorCreationMode,
        }),
      ),
    );

  const isMaxSensorsReached = sensors.length >= MAX_SENSORS;

  const enableAddNewSensor = () => {
    if (isMaxSensorsReached) {
      console.warn(`Maximum ${MAX_SENSORS} sensors reached.`);
      return;
    }
    setIsSensorCreationMode(true);
  };

  const buttonText = isSensorCreationMode
    ? "Cancel New Sensor"
    : isMaxSensorsReached
      ? `Maximum ${MAX_SENSORS} sensors reached`
      : "Add New Sensor";

  const buttonClass = isSensorCreationMode
    ? styles.cancelNewSensorButton
    : styles.addNewSensorButton;

  const handleClick = isSensorCreationMode
    ? () => setIsSensorCreationMode(false)
    : enableAddNewSensor;

  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      disabled={!isSensorCreationMode && isMaxSensorsReached}
    >
      {buttonText}
    </button>
  );
};

export default AddSensorButton;
