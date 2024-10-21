/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Armature({ props }: { props?: THREE.Group }) {
  const group = useRef<THREE.Group>(null);
  const { nodes } = useGLTF("/Armature.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Plane"
            geometry={nodes.Plane.geometry}
            material={nodes.Plane.material}
            skeleton={nodes.Plane.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/Armature.glb");
