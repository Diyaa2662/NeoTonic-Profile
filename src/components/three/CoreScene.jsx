import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScrollContext } from "../../contexts/ScrollContext";
import FluidWave from "./elements/FluidWave";
import Particles from "./elements/Particles";
import GrowingPlant from "./elements/GrowingPlant";
// import Fruits from "./elements/Fruits";
// import Bottles from "./elements/Bottles";
// import Molecule from "./elements/Molecule";
// import Map from "./elements/Map";

export default function CoreScene() {
  const { activeSection } = useScrollContext();
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetRotY =
      activeSection === "products"
        ? 0.15
        : activeSection === "about"
          ? -0.15
          : 0;
    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * Math.min(delta * 1.5, 1);
  });

  return (
    <group ref={groupRef}>
      <FluidWave />
      <Particles count={120} />
      <GrowingPlant /> {/* Hero */}
      {/* <Fruits /> About */}
      {/* <Bottles /> Products */}
      {/* <Molecule /> Quality */}
      {/* <Map /> Contact */}
    </group>
  );
}
