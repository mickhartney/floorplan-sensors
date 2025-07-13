import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// TODO: (possible enhancements & future iterations)
//  - Fix updateSensor to prevent excessive API calls on sensor drag!!
//  - Add API (async handlers, error handling, loading states / optimistic etc.)
//  - Add loadSensors (from API) on initial load - currently using localStorage
//  - Add improved validation
//  - Add reset method
//  - Add image upload functionality

type ApiCallType =
  | "setImageData"
  | "createSensor"
  | "updateSensor"
  | "deleteSensor";

// Crude Mock API just to demonstrate data flow
const mockApiCall = (type: ApiCallType, payload: unknown) => {
  console.log(`Mock API call: ${type}`, payload);
};

export type SensorType = {
  id: number;
  name: string;
  position: { x: number; y: number };
};

type SensorStore = {
  floorplanId: string;
  imageData: {
    src: string;
    displayWidth: number;
    displayHeight: number;
  } | null;
  setImageData: (data: {
    src: string;
    displayWidth: number;
    displayHeight: number;
  }) => void;
  sensors: SensorType[];
  isSensorCreationMode: boolean;
  setIsSensorCreationMode: (enabled: boolean) => void;
  createSensor: (newSensor: Omit<SensorType, "id">) => void;
  updateSensor: (
    sensorId: number,
    updates: Omit<Partial<SensorType>, "id">,
  ) => void;
  deleteSensor: (sensorId: number) => void;
};

export const MAX_SENSORS = 10;

const useSensorStore = create<SensorStore>()(
  persist(
    (set, get) => ({
      floorplanId: "floorplan-test-id", // Manually set during image upload
      imageData: null, // setImageData updates this when floorplan image loads
      sensors: [],
      isSensorCreationMode: false,

      setImageData: (data) => {
        const currentImageData = get().imageData;
        const floorplanId = get().floorplanId;

        set(() => ({ imageData: data }));

        // Simulate an API call to save the floorplan image data (only if data has changed)
        if (
          !currentImageData ||
          currentImageData.src !== data.src ||
          currentImageData.displayWidth !== data.displayWidth ||
          currentImageData.displayHeight !== data.displayHeight
        ) {
          mockApiCall("setImageData", {
            floorplanId,
            imageData: data,
          });
        }
      },

      setIsSensorCreationMode: (enabled: boolean) =>
        set(() => ({ isSensorCreationMode: enabled })),

      createSensor: (newSensorData) => {
        const floorplanId = get().floorplanId;
        const currentSensors = get().sensors;

        // Crude error handling for now
        if (currentSensors.length >= MAX_SENSORS) {
          alert(`Maximum of ${MAX_SENSORS} sensors allowed.`);
          return;
        }

        if (
          !newSensorData ||
          !newSensorData.name ||
          newSensorData.position.x < 0 ||
          newSensorData.position.y < 0
        ) {
          alert("Invalid sensor data provided.");
          return;
        }

        const mockId = Date.now();

        set((state) => ({
          sensors: [...state.sensors, { ...newSensorData, id: mockId }],
        }));

        // Simulate an API call to create the sensor
        mockApiCall("createSensor", {
          floorplanId,
          sensor: { ...newSensorData, id: mockId }, // id probably set server side in a real app
        });
      },

      updateSensor: (sensorId, updates) => {
        set((state) => {
          const updatedSensors = state.sensors.map((sensor) =>
            sensor.id === sensorId ? { ...sensor, ...updates } : sensor,
          );
          const updatedSensor = updatedSensors.find((s) => s.id === sensorId);

          // Simulate API call to update the sensor - after local state update
          // FIXME: prevent excessive calls on sensor drag
          //  - split into updateSensorDraft (no api call) and commitSensorUpdate methods (api call)
          //  - refactor Sensor.tsx accordingly
          mockApiCall("updateSensor", {
            floorplanId: state.floorplanId,
            sensorId,
            updatedSensorData: updatedSensor,
          });

          return { sensors: updatedSensors };
        });
      },

      deleteSensor: (sensorId) => {
        const floorplanId = get().floorplanId;

        set((state) => ({
          sensors: state.sensors.filter((sensor) => sensor.id !== sensorId),
        }));

        // Simulate an API call to delete the sensor
        mockApiCall("deleteSensor", {
          floorplanId,
          sensorId,
        });
      },
    }),
    {
      name: "sensor-store", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields
      partialize: (state) => ({
        floorplanId: state.floorplanId,
        sensors: state.sensors,
        imageData: state.imageData,
      }),
    },
  ),
);

export default useSensorStore;
