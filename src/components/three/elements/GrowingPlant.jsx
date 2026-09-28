// src/components/three/elements/GrowingPlant.jsx
//
// ⬇️ التغيير الجوهري: الأوراق كانت عبارة عن كرات مفلطحة (sphere مع scale
// غريب) وهاد اللي كان يعطيها شكل "بالون" مش ورقة. صرنا نبني شكل ورقة حقيقي
// عبر THREE.Shape (منحنيات Bezier) ثم نطبّق عليها طيّة طبيعية عند العرق
// الأوسط وانحناء خفيف للخلف عند الطرف - نفس الشي يلي بتلاحظه بورقة حقيقية.
// كمان ضفنا: عرق أوسط بارز، مادة فيها transmission (الضو يعدّي جزئياً من
// الورقة متل الطبيعة)، وكومة تربة بسيطة تحت الساق عشان الغرسة "تطلع من الأرض"
// مش عم تطفو بالفراغ.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScrollContext } from "../../../contexts/ScrollContext";
import * as THREE from "three";

// ═══════════════════════════════════════════════════
// 🍃 مولّد هندسة الورقة (شكل حقيقي + طية طبيعية)
// ═══════════════════════════════════════════════════
function buildLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.32, 0.15, 0.36, 0.45);
  shape.quadraticCurveTo(0.4, 0.78, 0, 1.05);
  shape.quadraticCurveTo(-0.4, 0.78, -0.36, 0.45);
  shape.quadraticCurveTo(-0.32, 0.15, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape, 16);
  const pos = geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const ny = y / 1.05;
    // ⬇️ طية عند العرق الأوسط (زاوية V خفيفة متل الأوراق الحقيقية)
    const fold = -Math.abs(x) * 0.4 * ny;
    // ⬇️ انحناء خفيف للخلف كلما اقتربنا من الطرف
    const droop = -Math.pow(ny, 2) * 0.14;
    pos.setZ(i, fold + droop);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// مادة الورقة الموحّدة - فيها transmission خفيف يخلي الضو يعدّي جزئياً
function leafMaterialProps(color = "#5aad5a") {
  return {
    color,
    roughness: 0.35,
    metalness: 0.02,
    transmission: 0.3,
    thickness: 0.15,
    clearcoat: 0.4,
    clearcoatRoughness: 0.35,
    side: THREE.DoubleSide,
    envMapIntensity: 0.6,
  };
}

// ═══════════════════════════════════════════════════
// 🪴 كومة تربة بسيطة تحت الساق
// ═══════════════════════════════════════════════════
function SoilMound() {
  return (
    <group position={[0, -0.42, 0]}>
      <mesh scale={[1, 0.28, 1]}>
        <sphereGeometry args={[0.55, 32, 16]} />
        <meshStandardMaterial color="#4a3423" roughness={0.95} metalness={0} />
      </mesh>
      {/* حبيبات صغيرة للملمس */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 0.25 + (i % 3) * 0.08;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.06, Math.sin(angle) * r]}
            scale={0.04 + (i % 2) * 0.02}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#5a4230" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function GrowingPlant() {
  const groupRef = useRef();
  const stemRef = useRef();
  const leaf1Ref = useRef();
  const leaf2Ref = useRef();
  const leaf3Ref = useRef();
  const leaf4Ref = useRef();
  const budRef = useRef();

  const leafGeometry = useMemo(() => buildLeafGeometry(), []);

  // ⬇️ نتبع نمو النبتة (0 = ما نمت، 1 = نمت كاملة)
  const growthRef = useRef(0);
  const { activeSection } = useScrollContext();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const isActive = activeSection === "home";

    // ⬇️ الهدف: 1 إذا في Hero، 0 إذا لأ
    const targetGrowth = isActive ? 1 : 0;

    // ⬇️ نمو تدريجي (بطيء شوي عشان يبان)
    growthRef.current +=
      (targetGrowth - growthRef.current) * Math.min(delta * 1.2, 1);
    const growth = growthRef.current;

    // ⬇️ تطبيق النمو على الـ scale
    groupRef.current.scale.y = 0.1 + growth * 0.9;
    groupRef.current.scale.x = 0.3 + growth * 0.7;
    groupRef.current.scale.z = 0.3 + growth * 0.7;

    // ⬇️ تمايل خفيف مع "الهوا"
    if (stemRef.current) {
      stemRef.current.rotation.z = Math.sin(t * 0.5) * 0.05 * growth;
    }

    // ⬇️ الأوراق بتفتح تدريجياً مع النمو
    const leafOpening = growth * 0.8;

    if (leaf1Ref.current) {
      leaf1Ref.current.rotation.z =
        -0.5 - leafOpening * 0.3 + Math.sin(t * 0.7) * 0.08;
    }
    if (leaf2Ref.current) {
      leaf2Ref.current.rotation.z =
        0.5 + leafOpening * 0.3 + Math.sin(t * 0.6 + 1) * 0.08;
    }
    if (leaf3Ref.current) {
      leaf3Ref.current.rotation.x =
        -0.3 - leafOpening * 0.2 + Math.sin(t * 0.8 + 2) * 0.06;
    }
    if (leaf4Ref.current) {
      leaf4Ref.current.rotation.x =
        0.3 + leafOpening * 0.2 + Math.sin(t * 0.75 + 3) * 0.06;
    }

    // ⬇️ البرعم يتنفس + يلمع مع النمو
    if (budRef.current) {
      budRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05);
      budRef.current.material.emissiveIntensity = 0.2 + growth * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      <SoilMound />

      {/* ⬇️ الساق */}
      <mesh ref={stemRef} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.08, 3, 16]} />
        <meshPhysicalMaterial
          color="#3a7a3a"
          roughness={0.5}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* ⬇️ ورقة 1 (يسار) */}
      <group
        ref={leaf1Ref}
        position={[-0.5, 1, 0]}
        rotation={[0, 0.3, -0.5]}
        scale={0.85}
      >
        <mesh geometry={leafGeometry} rotation={[0, 0, Math.PI / 2]}>
          <meshPhysicalMaterial {...leafMaterialProps("#5aad5a")} />
        </mesh>
        {/* العرق الأوسط */}
        <mesh position={[0.5, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.02, 1.0]} />
          <meshStandardMaterial
            color="#2f5a2f"
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ⬇️ ورقة 2 (يمين) */}
      <group
        ref={leaf2Ref}
        position={[0.5, 1.5, 0]}
        rotation={[0, -0.3, 0.5]}
        scale={0.85}
      >
        <mesh geometry={leafGeometry} rotation={[0, 0, -Math.PI / 2]}>
          <meshPhysicalMaterial {...leafMaterialProps("#5aad5a")} />
        </mesh>
        <mesh position={[-0.5, 0, 0.02]} rotation={[0, 0, -Math.PI / 2]}>
          <planeGeometry args={[0.02, 1.0]} />
          <meshStandardMaterial
            color="#2f5a2f"
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ⬇️ ورقة 3 (خلف) */}
      <group
        ref={leaf3Ref}
        position={[0, 2, -0.3]}
        rotation={[-0.3, 0, 0.15]}
        scale={0.7}
      >
        <mesh geometry={leafGeometry}>
          <meshPhysicalMaterial {...leafMaterialProps("#6bbd6b")} />
        </mesh>
        <mesh position={[0, 0.5, 0.02]}>
          <planeGeometry args={[0.018, 0.95]} />
          <meshStandardMaterial
            color="#2f5a2f"
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ⬇️ ورقة 4 (قدام) */}
      <group
        ref={leaf4Ref}
        position={[0, 2, 0.3]}
        rotation={[0.3, 0, -0.15]}
        scale={0.7}
      >
        <mesh geometry={leafGeometry}>
          <meshPhysicalMaterial {...leafMaterialProps("#6bbd6b")} />
        </mesh>
        <mesh position={[0, 0.5, 0.02]}>
          <planeGeometry args={[0.018, 0.95]} />
          <meshStandardMaterial
            color="#2f5a2f"
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ⬇️ البرعم */}
      <mesh ref={budRef} position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshPhysicalMaterial
          color="#8fca8f"
          emissive="#c9a961"
          emissiveIntensity={0.3}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
}
