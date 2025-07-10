import React, { useState, useRef } from "react";
import Floorplan from "./components/FloorPlan/Floorplan";
import Sidebar from "./components/SideBar/SideBar";
import styles from "./App.module.css";

// TODO:
//  fix move sensor position when zoomed in
//  add store (parent metadata)
//  persist sensors in local storage
//  test/refactor...
//  ----
//  image upload

export type SensorType = {
  id: number;
  name: string;
  position: { x: number; y: number };
};

const initialTestSensors = [
  { id: 1, name: "Sensor 1", position: { x: 400, y: 150 } },
  { id: 2, name: "Sensor 2", position: { x: 200, y: 250 } },
];

function App() {
  const [sensors, setSensors] = useState<SensorType[]>(initialTestSensors);
  const [addNewSensorEnabled, setAddNewSensorEnabled] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const enableAddNewSensor = () => {
    if (sensors.length >= 10) return console.warn("Max sensors reached.");
    setAddNewSensorEnabled(true);
  };

  const disableAddNewSensor = () => setAddNewSensorEnabled(false);

  const handleAddNewSensor = (e: React.MouseEvent) => {
    if (!addNewSensorEnabled) return console.warn("Adding not enabled.");

    const newSensorName = prompt("Enter sensor name:") || "Unnamed Sensor";
    const bounds = imageContainerRef.current?.getBoundingClientRect();
    if (!bounds) return console.warn("No bounds found.");

    const newSensor = {
      id: Math.ceil(Math.random() * 10000),
      name: newSensorName,
      position: { x: e.clientX - bounds.left, y: e.clientY - bounds.top },
    };

    setSensors((prev) => [...prev, newSensor]);
    setAddNewSensorEnabled(false);
  };

  const updateSensor = (sensorId: number, updates: Partial<SensorType>) => {
    setSensors((prev) =>
      prev.map((sensor) =>
        sensor.id === sensorId ? { ...sensor, ...updates } : sensor,
      ),
    );
  };

  const deleteSensor = (sensorId: number) => {
    setSensors((prev) => prev.filter((sensor) => sensor.id !== sensorId));
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img
            src="https://www.t-scan.com/wp-content/uploads/2023/06/t-scan-solutions.png"
            alt="t-Scan Logo"
          />
        </div>
        <h1>Floorplan Sensors</h1>
      </header>
      <main className={styles.content}>
        <Sidebar
          sensors={sensors}
          addSensorButton={
            addNewSensorEnabled ? (
              <button
                className={styles.cancelNewSensorButton}
                onClick={disableAddNewSensor}
              >
                Cancel New Sensor
              </button>
            ) : (
              <button
                className={styles.addNewSensorButton}
                onClick={enableAddNewSensor}
                disabled={sensors.length >= 10}
              >
                {sensors.length >= 10
                  ? "Maximum sensors reached"
                  : "Add New Sensor"}
              </button>
            )
          }
          onUpdateSensorDetails={(id, name) => updateSensor(id, { name })}
          onDeleteSensor={deleteSensor}
        />
        <Floorplan
          sensors={sensors}
          addNewSensorEnabled={addNewSensorEnabled}
          onAddNewSensor={handleAddNewSensor}
          onUpdateSensorPosition={(id, position) =>
            updateSensor(id, { position })
          }
          imageContainerRef={imageContainerRef}
        />
      </main>
    </div>
  );
}

export default App;
