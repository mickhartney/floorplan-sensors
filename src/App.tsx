import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import floorplan from "/test_floorplan01.png";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0)

  const handleAddSensor = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic to add a sensor
    console.log("Add Sensor button clicked");
    // You can implement the logic to add a sensor here
  };

  return (
    <div className={"app"}>
      <header className={"header"}>
        <div className={"logo"}>
          <img
            src="https://www.t-scan.com/wp-content/uploads/2023/06/t-scan-solutions.png"
            alt="t-Scan Logo"
          />
        </div>
        <h1>Floorplan Sensors</h1>
      </header>
      <main className={"content"}>
        <div className={"sidebar"}>
          <h2>Manage Sensors</h2>
          <button className={"addSensorButton"} onClick={handleAddSensor}>
            Add Sensor
          </button>
        </div>

        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <div className={"transformContainer"}>
              <div className="zoomTools">
                <button onClick={() => zoomIn()}>Zoom In</button>
                <button onClick={() => zoomOut()}>Zoom Out</button>
                <button onClick={() => resetTransform()}>Reset Zoom</button>
              </div>
              <TransformComponent>
                <div className={"floorplanContainer"}>
                  <img
                    src={floorplan}
                    alt="Floorplan"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </TransformComponent>
            </div>
          )}
        </TransformWrapper>
      </main>
    </div>
  );
}

export default App;
