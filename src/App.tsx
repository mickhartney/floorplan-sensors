import Floorplan from "./components/FloorPlan/Floorplan";
import Sidebar from "./components/SideBar/SideBar";
import styles from "./App.module.css";

function App() {
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
        <Sidebar />
        <Floorplan />
      </main>
    </div>
  );
}

export default App;
