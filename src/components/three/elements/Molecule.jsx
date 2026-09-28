// src/components/three/elements/Molecule.jsx
//
// ⬇️ التحسينات هون:
//   - الجزيء: نفس البنية، بس رفعنا envMapIntensity على الذرات والروابط
//     عشان تلمع فعلياً تحت الـ HDRI بدل ما تبين مادة معدنية باهتة.
//   - شارة GMP: كانت مجرد حلقتين + قرص + مخروط مجرد بالنص - ما في أي إشارة
//     فعلية لـ "GMP". صرنا نحط نص GMP حقيقي (عبر <Text> من drei) + إكليل غار
//     ذهبي صغير حوالين الحافة السفلية - نفس الشكل يلي بتشوفه بشارات الجودة
//     والاعتمادات الحقيقية، وهاد بيخدم مباشرة قسم "الجودة والاعتمادات".

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useScrollContext } from "../../../contexts/ScrollContext";
import * as THREE from "three";

// ═══════════════════════════════════════════════════
// 🧪 الجزيء (Molecule)
// ═══════════════════════════════════════════════════
function Molecule3D() {
  const groupRef = useRef();

  const atoms = useMemo(
    () => [
      { pos: [0, 0, 0], size: 0.35, color: "#c9a961" },
      { pos: [1.2, 0.5, 0], size: 0.28, color: "#8fca8f" },
      { pos: [-1.2, 0.3, 0.5], size: 0.28, color: "#8fca8f" },
      { pos: [0.5, -1.2, 0], size: 0.25, color: "#5aad5a" },
      { pos: [-0.6, -1, 0.3], size: 0.25, color: "#5aad5a" },
      { pos: [0, 1.5, -0.5], size: 0.22, color: "#a8d5a8" },
    ],
    [],
  );

  const bonds = useMemo(() => {
    const pairs = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 5],
      [2, 5],
      [3, 4],
    ];
    return pairs.map(([i, j]) => ({ start: atoms[i].pos, end: atoms[j].pos }));
  }, [atoms]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;

    groupRef.current.children.forEach((child, i) => {
      if (child.userData.isAtom) {
        const baseScale = child.userData.baseScale;
        const pulse = 1 + Math.sin(t * 2 + i * 0.8) * 0.08;
        child.scale.setScalar(baseScale * pulse);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {atoms.map((atom, i) => (
        <mesh
          key={i}
          position={atom.pos}
          scale={atom.size}
          userData={{ isAtom: true, baseScale: atom.size }}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color={atom.color}
            roughness={0.12}
            metalness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.05}
            emissive={atom.color}
            emissiveIntensity={0.22}
            envMapIntensity={1.3}
          />
        </mesh>
      ))}

      {bonds.map((bond, i) => {
        const start = new THREE.Vector3(...bond.start);
        const end = new THREE.Vector3(...bond.end);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const direction = end.clone().sub(start);
        const length = direction.length();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.clone().normalize(),
        );

        return (
          <mesh key={i} position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.03, 0.03, length, 12]} />
            <meshStandardMaterial
              color="#d4e8d4"
              roughness={0.35}
              metalness={0.4}
              emissive="#8fca8f"
              emissiveIntensity={0.15}
              envMapIntensity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🌿 ورقة غار صغيرة (لبناء إكليل الشارة)
// ═══════════════════════════════════════════════════
function LaurelLeaf({ position, rotation, scale = 1 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <sphereGeometry args={[0.09, 8, 8]} />
      <meshStandardMaterial
        color="#c9a961"
        roughness={0.3}
        metalness={0.85}
        emissive="#c9a961"
        emissiveIntensity={0.2}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

// إكليل غار كامل (فرعين متقابلين حوالين الحافة السفلية للشارة)
function LaurelWreath({ radius = 0.78 }) {
  const leaves = useMemo(() => {
    const items = [];
    const leafCount = 7;
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < leafCount; i++) {
        // ⬇️ توزيع الأوراق من أسفل الشارة صعوداً لجهة واحدة (يسار/يمين)
        const angle = Math.PI * 0.5 + side * (0.15 + i * 0.16);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        items.push({
          position: [x, y, 0.02],
          rotation: [0, 0, angle + Math.PI / 2],
          scale: 1 - i * 0.06,
        });
      }
    }
    return items;
  }, [radius]);

  return (
    <group>
      {leaves.map((leaf, i) => (
        <LaurelLeaf key={i} {...leaf} />
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🏆 ختم GMP الذهبي - نص حقيقي + إكليل غار
// ═══════════════════════════════════════════════════
function GMPBadge() {
  const badgeRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    if (!badgeRef.current) return;
    const t = state.clock.elapsedTime;

    badgeRef.current.rotation.y = -t * 0.15;

    if (innerRef.current) {
      innerRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group position={[2.8, -0.5, -1]} scale={0.7}>
      {/* ⬇️ الحلقة الخارجية */}
      <mesh ref={badgeRef}>
        <torusGeometry args={[0.9, 0.1, 16, 64]} />
        <meshStandardMaterial
          color="#c9a961"
          roughness={0.18}
          metalness={1}
          emissive="#c9a961"
          emissiveIntensity={0.3}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* ⬇️ حلقة داخلية */}
      <mesh ref={innerRef}>
        <torusGeometry args={[0.65, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#8fca8f"
          roughness={0.3}
          metalness={0.8}
          emissive="#8fca8f"
          emissiveIntensity={0.5}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* ⬇️ مركز الختم (قرص) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
        <meshStandardMaterial
          color="#f7f5ef"
          roughness={0.4}
          metalness={0.2}
          envMapIntensity={0.7}
        />
      </mesh>

      {/* ⬇️ نص GMP الحقيقي على وجه الشارة */}
      <Text
        position={[0, 0.12, 0.03]}
        fontSize={0.28}
        color="#7a5a1a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        font={undefined}
      >
        GMP
      </Text>
      <Text
        position={[0, -0.22, 0.03]}
        fontSize={0.075}
        color="#5a7a4a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        font={undefined}
      >
        CERTIFIED
      </Text>

      {/* ⬇️ إكليل غار ذهبي حوالين الحافة السفلية */}
      <LaurelWreath radius={0.78} />

      {/* ⬇️ نجمة صغيرة أعلى الشارة (موضع تعليق الميدالية) */}
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.16, 5]} />
        <meshStandardMaterial
          color="#c9a961"
          roughness={0.2}
          metalness={1}
          emissive="#c9a961"
          emissiveIntensity={0.6}
          envMapIntensity={1.3}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// المشهد الرئيسي
// ═══════════════════════════════════════════════════
export default function Molecule() {
  const groupRef = useRef();
  const { activeSection } = useScrollContext();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const isActive = activeSection === "quality";
    const targetScale = isActive ? 1 : 0.001;
    const targetOpacity = isActive ? 1 : 0;
    const speed = Math.min(delta * 1.5, 1);

    groupRef.current.scale.x +=
      (targetScale - groupRef.current.scale.x) * speed;
    groupRef.current.scale.y +=
      (targetScale - groupRef.current.scale.y) * speed;
    groupRef.current.scale.z +=
      (targetScale - groupRef.current.scale.z) * speed;

    groupRef.current.traverse((child) => {
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity +=
          (targetOpacity - child.material.opacity) * speed;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Molecule3D />
      <GMPBadge />
    </group>
  );
}
