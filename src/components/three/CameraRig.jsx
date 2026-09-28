import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollContext } from "../../contexts/ScrollContext";

const CAMERA_STATES = {
  home: { pos: [0, 0.5, 8], lookAt: [0, 0.5, 0] },
  about: { pos: [0, 0.3, 7.5], lookAt: [0, 0, 0] },
  products: { pos: [0, 0, 8], lookAt: [0, 0, 0] },
  quality: { pos: [0, 0.5, 8], lookAt: [0, 0, 0] },
  contact: { pos: [0, 0.3, 7.5], lookAt: [0, 0, 0] },
};

export default function CameraRig() {
  const { activeSection, mousePos } = useScrollContext();
  const targetPos = useRef(new THREE.Vector3(0, 0, 7));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const config = CAMERA_STATES[activeSection] || CAMERA_STATES.home;
    const cam = state.camera;
    const mouseInfluence = 0.25;
    // ⬇️ سرعة أبطأ = انتقال سينمائي (1.5s)
    const speed = Math.min(delta * 1.2, 1);

    targetPos.current.set(
      config.pos[0] + mousePos.x * mouseInfluence,
      config.pos[1] + mousePos.y * mouseInfluence,
      config.pos[2],
    );
    targetLook.current.set(...config.lookAt);

    cam.position.lerp(targetPos.current, speed);

    // smooth lookAt
    const currentLook = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(cam.quaternion)
      .add(cam.position);
    currentLook.lerp(targetLook.current, speed);
    cam.lookAt(currentLook);
  });

  return null;
}
