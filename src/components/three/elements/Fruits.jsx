// src/components/three/elements/Fruits.jsx
//
// ⬇️ التحسينات هون:
//   - اللوز: بروفايل Lathe واقعي (بدل sphere+cone ملزوقين) مع تفليط جانبي
//   - العنب والرمان: نتوءات عضوية خفيفة على السطح (organicSphere) بدل الكرة
//     المثالية الملساء - هاد بيكسر "مظهر البلاستيك"
//   - ورقة النعنع: شكل ورقة حقيقي (نفس أسلوب GrowingPlant) بدل كرة مسطّحة
//   - كل المواد صار إلها envMapIntensity تستفيد من الـ HDRI

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScrollContext } from "../../../contexts/ScrollContext";
import * as THREE from "three";

// ═══════════════════════════════════════════════════
// 🔧 أدوات مساعدة
// ═══════════════════════════════════════════════════

// بروفايل ناعم عبر منحني - لأي جسم "لوزي/بيضاوي" مبني بالـ Lathe
function smoothProfile(controlPoints, segments = 32) {
  const curve = new THREE.CatmullRomCurve3(
    controlPoints.map(([r, y]) => new THREE.Vector3(r, y, 0)),
  );
  return curve
    .getPoints(segments)
    .map((p) => new THREE.Vector2(Math.max(p.x, 0.001), p.y));
}

// كرة "عضوية" فيها نتوءات خفيفة غير منتظمة (بدل الكرة المثالية الصناعية)
function organicSphere(radius, detail = 3, bumpiness = 0.06, seed = 1) {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    const noise =
      Math.sin(n.x * 6 + seed) * Math.cos(n.y * 5 + seed * 2) +
      Math.sin(n.z * 7 + seed * 3) * 0.6;
    v.multiplyScalar(1 + noise * bumpiness);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// شكل ورقة حقيقي (نفس أسلوب GrowingPlant.jsx) - مصغّر ومبسّط لورقة النعنع
function buildMintLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.28, 0.12, 0.3, 0.35);
  shape.quadraticCurveTo(0.3, 0.6, 0, 0.75);
  shape.quadraticCurveTo(-0.3, 0.6, -0.3, 0.35);
  shape.quadraticCurveTo(-0.28, 0.12, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape, 12);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const ny = y / 0.75;
    pos.setZ(i, -Math.abs(x) * 0.5 * ny - Math.pow(ny, 2) * 0.08);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// ═══════════════════════════════════════════════════
// 🥜 اللوز - بروفايل Lathe واقعي بدل sphere+cone
// ═══════════════════════════════════════════════════
const ALMOND_PROFILE = [
  [0.001, -0.5],
  [0.32, -0.32],
  [0.4, 0.0],
  [0.34, 0.3],
  [0.16, 0.52],
  [0.001, 0.65],
];

function Almond({ position, rotation, scale }) {
  const geometry = useMemo(() => smoothProfile(ALMOND_PROFILE), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم - مفلطح جانبياً عبر scale.z */}
      <mesh scale={[1, 1, 0.5]}>
        <latheGeometry args={[geometry, 32]} />
        <meshStandardMaterial
          color="#c89468"
          roughness={0.72}
          metalness={0.05}
          envMapIntensity={0.7}
        />
      </mesh>
      {/* خط في الوسط (شق) */}
      <mesh position={[0, 0, 0.13]}>
        <boxGeometry args={[0.015, 0.75, 0.015]} />
        <meshStandardMaterial color="#8a5a2a" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🍇 العنب - عنقود 15 حبة بنتوءات عضوية + ساق + ورقة حقيقية
// ═══════════════════════════════════════════════════
function Grape({ position, rotation, scale }) {
  const leafGeometry = useMemo(() => buildMintLeafGeometry(), []);

  const grapes = useMemo(() => {
    const positions = [];
    const rows = [
      { count: 6, y: 0, radius: 0.3 },
      { count: 5, y: -0.2, radius: 0.25 },
      { count: 3, y: -0.4, radius: 0.18 },
      { count: 1, y: -0.55, radius: 0 },
    ];
    let seed = 0;
    rows.forEach((row) => {
      for (let i = 0; i < row.count; i++) {
        const angle = (i / row.count) * Math.PI * 2;
        const size = 0.15 + ((seed * 37) % 5) * 0.006;
        positions.push({
          pos: [
            Math.cos(angle) * row.radius,
            row.y,
            Math.sin(angle) * row.radius,
          ],
          geometry: organicSphere(size, 2, 0.035, seed),
          seed: seed++,
        });
      }
    });
    return positions;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الحبات - كل وحدة بنتوء عضوي خفيف مختلف */}
      {grapes.map(({ pos, geometry }, i) => (
        <mesh key={i} position={pos} geometry={geometry}>
          <meshPhysicalMaterial
            color="#5a2a5a"
            roughness={0.15}
            metalness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#3a1a3a"
            emissiveIntensity={0.15}
            envMapIntensity={1.1}
          />
        </mesh>
      ))}
      {/* الساق */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.8} />
      </mesh>
      {/* ورقة حقيقية */}
      <mesh
        geometry={leafGeometry}
        position={[0.2, 0.35, 0]}
        rotation={[0, 0, -0.9]}
        scale={0.7}
      >
        <meshPhysicalMaterial
          color="#4a7a3a"
          roughness={0.5}
          transmission={0.25}
          thickness={0.1}
          side={THREE.DoubleSide}
          envMapIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🍎 الرمان - كرة عضوية + تاج مفصّل
// ═══════════════════════════════════════════════════
function Pomegranate({ position, rotation, scale }) {
  const bodyGeometry = useMemo(() => organicSphere(0.5, 3, 0.04, 7), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم - كرة عضوية مسطّحة قليلاً */}
      <mesh geometry={bodyGeometry} scale={[1, 0.95, 1]}>
        <meshPhysicalMaterial
          color="#8a1a1a"
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive="#5a1010"
          emissiveIntensity={0.2}
          envMapIntensity={0.9}
        />
      </mesh>
      {/* التاج - 4 فصوص */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.08, 0.5, Math.sin(angle) * 0.08]}
            rotation={[0.2, 0, 0]}
          >
            <coneGeometry args={[0.05, 0.15, 6]} />
            <meshStandardMaterial color="#6a1010" roughness={0.5} />
          </mesh>
        );
      })}
      {/* مركز التاج */}
      <mesh position={[0, 0.55, 0]}>
        <coneGeometry args={[0.07, 0.12, 8]} />
        <meshStandardMaterial color="#7a1515" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// ⚫ الحبة السوداء - بذرة حقيقية (مسطحة، بيضاوية)
// ═══════════════════════════════════════════════════
function BlackSeed({ position, rotation, scale }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh scale={[0.6, 0.35, 0.9]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.4}
          metalness={0.3}
          emissive="#1a1a1a"
          emissiveIntensity={0.1}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* خط خفيف */}
      <mesh position={[0, 0.14, 0]} scale={[0.04, 0.02, 0.6]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🫒 الزيتون - بروفايل Lathe بيضاوي + خط + ساق
// ═══════════════════════════════════════════════════
const OLIVE_PROFILE = [
  [0.001, -0.45],
  [0.24, -0.3],
  [0.28, 0.0],
  [0.24, 0.28],
  [0.1, 0.42],
  [0.001, 0.48],
];

function Olive({ position, rotation, scale }) {
  const geometry = useMemo(() => smoothProfile(OLIVE_PROFILE), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم */}
      <mesh>
        <latheGeometry args={[geometry, 28]} />
        <meshPhysicalMaterial
          color="#3a5a1a"
          roughness={0.25}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive="#1a2a0a"
          emissiveIntensity={0.1}
          envMapIntensity={1}
        />
      </mesh>
      {/* ساق صغير */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#4a3a1a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🍃 ورقة نعنع (للزينة) - شكل حقيقي بدل كرة مسطّحة
// ═══════════════════════════════════════════════════
function MintLeaf({ position, rotation, scale }) {
  const geometry = useMemo(() => buildMintLeafGeometry(), []);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshPhysicalMaterial
        color="#5a9a4a"
        roughness={0.4}
        transmission={0.3}
        thickness={0.15}
        side={THREE.DoubleSide}
        clearcoat={0.5}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════
// المشهد الرئيسي (نفس منطق الحركة والتموضع السابق)
// ═══════════════════════════════════════════════════
export default function Fruits() {
  const groupRef = useRef();
  const { activeSection } = useScrollContext();

  const fruits = useMemo(
    () => [
      {
        Component: Almond,
        position: [-2.8, 0.8, 0],
        rotation: [0, 0, 0.3],
        scale: 1.1,
      },
      {
        Component: Grape,
        position: [-1.4, -0.4, 0.3],
        rotation: [0, 0.3, 0],
        scale: 1.0,
      },
      {
        Component: Pomegranate,
        position: [0, 0.9, -0.3],
        rotation: [0, 0.5, 0],
        scale: 1.2,
      },
      {
        Component: BlackSeed,
        position: [1.4, 0.4, 0.3],
        rotation: [0, 0.7, 0.3],
        scale: 1.3,
      },
      {
        Component: Olive,
        position: [2.8, -0.5, 0],
        rotation: [0, 0, -0.2],
        scale: 1.1,
      },
      // زينة: أوراق نعنع
      {
        Component: MintLeaf,
        position: [-0.5, 1.5, 0.2],
        rotation: [0, 0, 0.5],
        scale: 1,
      },
      {
        Component: MintLeaf,
        position: [0.8, -1.2, 0.3],
        rotation: [0, 0, -0.7],
        scale: 0.8,
      },
    ],
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const isActive = activeSection === "about";
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

    groupRef.current.children.forEach((child, i) => {
      child.rotation.y = t * 0.2 + i * 0.5;

      if (child.userData.initialY === undefined) {
        child.userData.initialY = child.position.y;
      }
      child.position.y = child.userData.initialY + Math.sin(t * 0.8 + i) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {fruits.map(({ Component, position, rotation, scale }, i) => (
        <Component
          key={i}
          position={position}
          rotation={rotation}
          scale={scale}
        />
      ))}
    </group>
  );
}
