"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import UI from "./components/UI";
import { Armature } from "./components/Armature";

const Experience = () => {
  return (
    <>
      <Armature />
    </>
  );
};

function App() {
  return (
    <>
      <UI />
      <Canvas
        camera={{
          position: [3, 3, 3],
        }}
      >
        <color attach="background" args={["#333"]} />
        <OrbitControls />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
