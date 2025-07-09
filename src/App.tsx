import React, { useState } from "react";
import Floorplan from "./components/FloorPlan/Floorplan.tsx";
import Sidebar from "./components/SideBar/SideBar.tsx";
import styles from "./App.module.css";

// TODO:
//  sensor add functionality
//  -- prompt ?
//  -- add sensor to state
//  -- validation - name, limit
//  sensor drag functionality!!
//  state store
//  persist data & API
//  ----
//  image upload functionality

export type SensorType = {
  id: number;
  name: string;
  position: { x: number; y: number };
};

// FIXME: mock only
const initialTestSensors = [
  { id: 1, name: "Sensor 1", position: { x: 400, y: 150 } },
  { id: 2, name: "Sensor 2", position: { x: 200, y: 250 } },
];

function App() {
  const [sensors, setSensors] = useState<SensorType[]>(initialTestSensors);

  const handleAddSensor = (e: React.MouseEvent) => {
    e.preventDefault();

    console.log("Add Sensor button clicked");
    // TODO: add logic
  };

  const handelUpdateSensorDetails = (sensorId: number, newName: string) => {
    setSensors((prevSensors) =>
      prevSensors.map((sensor) =>
        sensor.id === sensorId ? { ...sensor, name: newName } : sensor,
      ),
    );
  };

  const handleDeleteSensor = (sensorId: number) => {
    setSensors((prevSensors) =>
      prevSensors.filter((sensor) => sensor.id !== sensorId),
    );
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
          onAddSensor={handleAddSensor}
          onUpdateSensorDetails={handelUpdateSensorDetails}
          onDeleteSensor={handleDeleteSensor}
        />
        <Floorplan sensors={sensors} />
      </main>
    </div>
  );
}

export default App;
