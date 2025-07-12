import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// TODO: mock API calls (loading)...

export type SensorType = {
  id: number;
  name: string;
  position: { x: number; y: number };
};

type SensorStore = {
  floorplanId: string;
  floorplanImageData: {
    src: string;
    displayWidth: number;
    displayHeight: number;
  } | null;
  setFloorplanImageData: (data: {
    src: string;
    displayWidth: number;
    displayHeight: number;
  }) => void;
  sensors: SensorType[];
  sensorCreationMode: boolean;
  setSensorCreationMode: (enabled: boolean) => void;
  loadSensors: () => void;
  createSensor: (newSensor: Omit<SensorType, "id">) => void;
  updateSensor: (sensorId: number, updates: Partial<SensorType>) => void;
  deleteSensor: (sensorId: number) => void;
};

const useSensorStore = create<SensorStore>()(
  persist(
    (set) => ({
      floorplanId: "floorplan-test-id", // Manually set during image upload
      floorplanImageData: null, // setFloorplanImageData updates this when floorplan image loads
      sensors: [],
      sensorCreationMode: false,

      setFloorplanImageData: ({ src, displayWidth, displayHeight }) =>
        set(() => ({
          floorplanImageData: { src, displayWidth, displayHeight },
        })),

      setSensorCreationMode: (enabled: boolean) =>
        set(() => ({ sensorCreationMode: enabled })),

      loadSensors: () => {
        const storedSensors = localStorage.getItem("sensor-store");
        if (!storedSensors) return;

        const parsedSensors = JSON.parse(storedSensors);
        set(() => ({
          // Also set `floorplanId` once multiple floorplans are supported
          sensors: parsedSensors.state?.sensors || [],
        }));
      },

      createSensor: (newSensorData) => {
        if (
          !newSensorData ||
          !newSensorData.name ||
          newSensorData.position.x < 0 ||
          newSensorData.position.y < 0
        ) {
          // Crude error handling for now
          alert("Invalid sensor data provided.");
          return;
        }

        const mockId = Math.ceil(Math.random() * 10000); // Set on API side

        set((state) => ({
          sensors: [...state.sensors, { ...newSensorData, id: mockId }],
        }));
      },

      updateSensor: (sensorId, updates) => {
        // Probably want to validate updates here in a real app
        set((state) => ({
          sensors: state.sensors.map((sensor) =>
            sensor.id === sensorId ? { ...sensor, ...updates } : sensor,
          ),
        }));
      },

      deleteSensor: (sensorId) =>
        set((state) => ({
          sensors: state.sensors.filter((sensor) => sensor.id !== sensorId),
        })),

      // TODO: could potentially add a `resetStore` method to clear all sensors
    }),
    {
      name: "sensor-store", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields
      partialize: (state) => ({
        floorplanId: state.floorplanId,
        sensors: state.sensors,
        floorplanImageData: state.floorplanImageData,
      }),
    },
  ),
);

export default useSensorStore;
