"use client";
import { Canvas } from "@react-three/fiber";
import {
  Backdrop,
  Environment,
  OrbitControls,
  SoftShadows,
} from "@react-three/drei";
import UI from "./components/UI";
import { Avatar } from "./components/Avatar";

const Experience = () => {
  return (
    <>
      <Backdrop scale={[50, 10, 5]} floor={1.5} receiveShadow position-z={-4}>
        <meshStandardMaterial color="#555" />
      </Backdrop>
      <group position-y={0}>
        <Avatar />
      </group>
      <SoftShadows size={52} samples={16} />
    </>
  );
};

function App() {
  return (
    <>
      <UI />
      <Canvas
        camera={{
          position: [-1, 1, 5],
          fov: 45,
        }}
        shadows
      >
        <color attach="background" args={["#555"]} />
        <fog attach="fog" args={["#555", 15, 25]} />
        <OrbitControls
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        {/* Enviroment */}
        <Environment preset="sunset" environmentIntensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2.2}
          castShadow
          // Higher values give better quality shadows at the cost of computation time.
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-5, 5, 5]} intensity={0.7} />
        {/* Backlight */}
        <directionalLight position={[1, 0.1, -5]} intensity={3} color="red" />
        <directionalLight position={[-1, 0.1, -5]} intensity={8} color="blue" />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
