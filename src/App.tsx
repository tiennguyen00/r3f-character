"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import UI from "./components/UI";
import { Avatar } from "./components/Avatar";

const Experience = () => {
  return (
    <>
      <Avatar />
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
