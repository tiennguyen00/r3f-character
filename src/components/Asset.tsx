/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Skeleton } from "three";

interface AssetProps {
  url: string;
  skeleton?: Skeleton;
}

const Asset = ({ url, skeleton }: AssetProps) => {
  const { scene } = useGLTF(url);

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
