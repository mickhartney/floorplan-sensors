import { create } from "zustand";

// TODO: persist to localStorage, API support

export type SensorType = {
  id: number;
  name: string;
  position: { x: number; y: number };
};

const initialTestSensors: SensorType[] = [
  { id: 1, name: "Sensor 1", position: { x: 400, y: 150 } },
  { id: 2, name: "Sensor 2", position: { x: 200, y: 250 } },
];

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
  createSensor: (newSensor: SensorType) => void;
  updateSensor: (sensorId: number, updates: Partial<SensorType>) => void;
  deleteSensor: (sensorId: number) => void;
};

const useSensorStore = create<SensorStore>((set) => ({
  floorplanId: "test-id",
  floorplanImageData: null,
  sensors: initialTestSensors, // FIXME: get from localStorage || []
  sensorCreationMode: false,

  setFloorplanImageData: ({ src, displayWidth, displayHeight }) =>
    set(() => ({
      floorplanImageData: { src, displayWidth, displayHeight },
    })),

  setSensorCreationMode: (enabled: boolean) =>
    set(() => ({ sensorCreationMode: enabled })),

  createSensor: (newSensor: SensorType) =>
    set((state) => ({
      sensors: [...state.sensors, newSensor],
    })),

  updateSensor: (sensorId, updates) =>
    set((state) => ({
      sensors: state.sensors.map((sensor) =>
        sensor.id === sensorId ? { ...sensor, ...updates } : sensor,
      ),
    })),

  deleteSensor: (sensorId) =>
    set((state) => ({
      sensors: state.sensors.filter((sensor) => sensor.id !== sensorId),
    })),
}));

export default useSensorStore;
