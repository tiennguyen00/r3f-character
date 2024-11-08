/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { skinAsset, useCategories } from "../store";

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
          const childName = child?.name.toLowerCase();
          const catergoryName = currentCategory.toLocaleLowerCase();

          if (
            catergoryName.includes("head") ||
            catergoryName.includes("nose")
          ) {
            if (
              childName.includes("top") ||
              childName.includes("bottom") ||
              childName.includes("head") ||
              childName.includes("nose")
            ) {
              if (child.material?.name.includes("Skin_")) {
                child.material = new THREE.MeshStandardMaterial({
                  color: assetColor,
                  roughness: 1,
                  name: "Skin_",
                });
              }
            }
          } else if (
            childName.includes("top") ||
            childName.includes("bottom")
          ) {
            if (
              childName.includes(catergoryName) &&
              child.material?.name.includes("Color_")
            ) {
              child.material.color.set(assetColor);
            }
          } else {
            if (childName.includes(catergoryName)) {
              if (child.material?.name.includes("Color_"))
                child.material.color.set(assetColor);
              if (child.material?.name.includes("Skin_")) {
                child.material = new THREE.MeshStandardMaterial({
                  color: assetColor,
                  roughness: 1,
                  name: "Skin_",
                });
              }
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
