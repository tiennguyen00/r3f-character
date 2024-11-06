/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Skeleton } from "three";
import { useCategories } from "../store";

interface AssetProps {
  url: string;
  skeleton?: Skeleton;
}

const Asset = ({ url, skeleton }: AssetProps) => {
  const { scene } = useGLTF(url);
  const { customization, currentCategory } = useCategories();

  useEffect(() => {
    if (currentCategory) {
      const assetColor = customization.find(
        (c) => c.name === currentCategory
      )?.selectedColor;

      scene.traverse((child: any) => {
        if (child.isMesh) {
          if (
            child.material?.name.includes("Color_") &&
            child?.name.toLowerCase().includes(currentCategory.toLowerCase())
          )
            child.material.color.set(assetColor);
        }
      });
    }
  }, [currentCategory, customization, scene]);

  const attachedItems = useMemo(() => {
    const items: any[] = [];
    scene.traverse((child: any) => {
      if (child.isMesh) {
        items.push({
          geometry: child.geometry,
          material: child.material,
        });
      }
    });

    return items;
  }, [scene]);

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
