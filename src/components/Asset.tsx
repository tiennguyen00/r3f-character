/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useCategories } from "../store";

interface AssetProps {
  url: string;
  skeleton?: THREE.Skeleton;
}

const Asset = ({ url, skeleton }: AssetProps) => {
  const { scene } = useGLTF(url);
  const { customization, currentCategory } = useCategories();
  const [attachedItems, setAttachedItems] = useState([]);

  useEffect(() => {
    if (currentCategory) {
      const assetColor = customization.find(
        (c) => c.name === currentCategory
      )?.selectedColor;
      const itesm = [];

      scene.traverse((child: any) => {
        if (child.isMesh) {
          if (
            child?.name.toLowerCase().includes(currentCategory.toLowerCase())
          ) {
            if (child.material?.name.includes("Color_"))
              child.material.color.set(assetColor);
            // only update the skin material whiile the current category is "head"
            if (
              child.material?.name.includes("Skin_") &&
              child.name.toLowerCase().includes("head")
            ) {
              child.material = new THREE.MeshStandardMaterial({
                color: assetColor,
                roughness: 1,
                name: "Skin_",
              });
            }
          }
          itesm.push({
            geometry: child.geometry,
            material: child.material,
          });
        }
      });
      setAttachedItems(itesm);
    }
  }, [currentCategory, customization, scene]);

  return attachedItems.map((item) => (
    <skinnedMesh
      key={item.geometry.uuid}
      geometry={item.geometry}
      material={item.material}
      skeleton={skeleton}
      castShadow
      receiveShadow
    />
  ));
};

export default Asset;
