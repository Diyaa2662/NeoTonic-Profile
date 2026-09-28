// src/components/three/elements/Map.jsx
//
// ⬇️ المشكلة بالنسخة القديمة: "خريطة سوريا" كانت فعلياً مجرد plane مربع +
// شبكة حواف (edgesGeometry) على مستطيل - ما إلها أي علاقة بشكل سوريا
// الحقيقي. صرنا نبني Shape فعلي بخط حدود مبسّط (تقريبي وليس دقيق GPS، بس
// عم يعطي صورة معترف فيها كبلد) ونبثقه (extrude) بعمق خفيف مع bevel، فيصير
// شكله كـ "لوحة زجاجية محفور فيها الحدود" بدل مربع عشوائي. خط الحدود
// المضيء استفاد من الـ Bloom يلي ضفناه بـ Background3D - خط رفيع بيلمع
// تلقائياً بدل ما نحتاج مكتبة خطوط سميكة إضافية.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScrollContext } from "../../../contexts/ScrollContext";
import * as THREE from "three";

// ═══════════════════════════════════════════════════
// 📍 نقاط المدن السورية (مواقع تقديرية على شكل سوريا)
// ═══════════════════════════════════════════════════
const CITIES = [
  { name_ar: "دمشق", name_en: "Damascus", pos: [-0.3, -0.5, 0], isHQ: true },
  { name_ar: "حلب", name_en: "Aleppo", pos: [0.4, 0.7, 0], isHQ: false },
  { name_ar: "حمص", name_en: "Homs", pos: [0, 0.1, 0], isHQ: false },
  {
    name_ar: "اللاذقية",
    name_en: "Latakia",
    pos: [-0.9, 0.5, 0.2],
    isHQ: false,
  },
  { name_ar: "حماة", name_en: "Hama", pos: [-0.3, 0.3, 0.1], isHQ: false },
  {
    name_ar: "دير الزور",
    name_en: "Deir ez-Zor",
    pos: [0.9, 0.2, -0.3],
    isHQ: false,
  },
  { name_ar: "الحسكة", name_en: "Hasakah", pos: [1.2, 0.6, -0.5], isHQ: false },
  { name_ar: "درعا", name_en: "Daraa", pos: [-0.5, -1, 0.1], isHQ: false },
];

// ⬇️ بروفايل حدود مبسّط لشكل سوريا (تقريبي/ستايلايزد - مو دقة GPS)
const SYRIA_OUTLINE = [
  [-0.75, 0.78],
  [-0.25, 0.88],
  [0.15, 0.92],
  [0.6, 0.86],
  [1.05, 0.78],
  [1.35, 0.55],
  [1.32, 0.15],
  [1.05, -0.25],
  [0.65, -0.55],
  [0.15, -0.8],
  [-0.35, -1.05],
  [-0.68, -0.85],
  [-0.6, -0.45],
  [-0.85, -0.1],
  [-1.02, 0.3],
  [-0.92, 0.6],
];

// ═══════════════════════════════════════════════════
// 🗺️ شكل سوريا الفعلي - Shape مبثوق بدل مربع شبكي
// ═══════════════════════════════════════════════════
function SyriaShape() {
  const shapeRef = useRef();

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    SYRIA_OUTLINE.forEach(([x, y], i) => {
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
  }, []);

  // خط الحدود المضيء (بيستفيد من الـ Bloom تلقائياً)
  const borderPoints = useMemo(() => {
    const points = [...SYRIA_OUTLINE, SYRIA_OUTLINE[0]].map(
      ([x, y]) => new THREE.Vector3(x, y, 0.07),
    );
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state) => {
    if (!shapeRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.5) * 0.015;
    shapeRef.current.scale.set(pulse, pulse, 1);
  });

  return (
    <group
      ref={shapeRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
    >
      {/* ⬇️ اللوحة المبثوقة - شكل سوريا الحقيقي */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#a8d5a8"
          transparent
          opacity={0.4}
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.6}
          transmission={0.2}
          envMapIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ⬇️ خط الحدود المضيء */}
      <line geometry={borderPoints}>
        <lineBasicMaterial color="#c9a961" transparent opacity={0.9} />
      </line>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 📍 نقطة مدينة
// ═══════════════════════════════════════════════════
function CityPoint({ position, isHQ }) {
  const pointRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (pointRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.3;
      pointRef.current.scale.setScalar(pulse);
    }

    if (ringRef.current) {
      const cycle = (t * 0.8) % 2;
      const scale = 0.5 + cycle;
      const opacity = Math.max(0, 1 - cycle);
      ringRef.current.scale.setScalar(scale);
      ringRef.current.material.opacity = opacity * 0.6;
    }
  });

  return (
    <group position={position}>
      <mesh ref={pointRef}>
        <sphereGeometry args={[isHQ ? 0.1 : 0.07, 16, 16]} />
        <meshStandardMaterial
          color={isHQ ? "#c9a961" : "#8fca8f"}
          emissive={isHQ ? "#c9a961" : "#8fca8f"}
          emissiveIntensity={1.5}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial
          color={isHQ ? "#c9a961" : "#8fca8f"}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshBasicMaterial
          color={isHQ ? "#c9a961" : "#8fca8f"}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🌐 خطوط الاتصال بين المدن
// ═══════════════════════════════════════════════════
function ConnectionLines() {
  const lines = useMemo(() => {
    const hq = CITIES[0];
    return CITIES.slice(1).map((city) => ({ start: hq.pos, end: city.pos }));
  }, []);

  return (
    <group>
      {lines.map((line, i) => {
        const start = new THREE.Vector3(...line.start);
        const end = new THREE.Vector3(...line.end);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        mid.y += 0.3;

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#c9a961" transparent opacity={0.4} />
          </line>
        );
      })}
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🌐 حلقة الانتشار الخارجية
// ═══════════════════════════════════════════════════
function ExpansionRing() {
  const ringRef = useRef();

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
  });

  return (
    <mesh
      ref={ringRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.05, 0]}
    >
      <torusGeometry args={[2.3, 0.015, 16, 100]} />
      <meshStandardMaterial
        color="#c9a961"
        emissive="#c9a961"
        emissiveIntensity={0.8}
        roughness={0.3}
        metalness={0.8}
        envMapIntensity={1}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════
// المشهد الرئيسي (نفس منطق الظهور/الاختفاء السابق)
// ═══════════════════════════════════════════════════
export default function Map() {
  const groupRef = useRef();
  const { activeSection } = useScrollContext();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const isActive = activeSection === "contact";
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
      if (child.material && !child.userData.keepOpacity) {
        child.material.transparent = true;
        child.material.opacity +=
          (targetOpacity - child.material.opacity) * speed;
      }
    });

    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <SyriaShape />
      <ConnectionLines />
      <ExpansionRing />

      {CITIES.map((city, i) => (
        <CityPoint key={i} position={city.pos} isHQ={city.isHQ} />
      ))}
    </group>
  );
}
