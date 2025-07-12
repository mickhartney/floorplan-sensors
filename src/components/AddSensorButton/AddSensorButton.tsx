import useSensorStore from "../../store/useSensorStore.tsx";
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

  const enableAddNewSensor = () => {
    if (sensors.length >= 10) {
      console.warn("Max sensors reached.");
      return;
    }
    setIsSensorCreationMode(true);
  };

  const buttonText = isSensorCreationMode
    ? "Cancel New Sensor"
    : sensors.length >= 10
      ? "Maximum sensors reached"
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
      disabled={!isSensorCreationMode && sensors.length >= 10}
    >
      {buttonText}
    </button>
  );
};

export default AddSensorButton;
