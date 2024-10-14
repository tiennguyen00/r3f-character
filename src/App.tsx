import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [3, 3, 3],
        }}
      >
        <color attach="background" args={["#333"]} />
        <OrbitControls />
        <mesh></mesh>
      </Canvas>
    </>
  );
}

export default App;
