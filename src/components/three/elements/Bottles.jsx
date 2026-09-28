// src/components/three/elements/Bottles.jsx
//
// ⬇️ التغيير الجوهري هون: بدل ما نركّب جسم القنينة من cylinder + cone ملزوقين
// (اللي كان بيعطي حافة حادة "مكسورة" عند الكتف)، صرنا نبني profile ناعم
// بنقاط تحكم قليلة ونمرره عبر THREE.CatmullRomCurve3 لنولّد منحني سلس،
// وبعدين نلفّه 360° بـ latheGeometry. هيك بيطلع شكل القنينة متصل وواقعي
// بدل قطع هندسية ملزوقة.
//
// كل مادة زجاجية صار إلها envMapIntensity مرفوع عشان تستغل الـ HDRI
// المضاف بـ Background3D.jsx وتعطي انعكاسات لامعة حقيقية.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScrollContext } from "../../../contexts/ScrollContext";
import * as THREE from "three";

// ═══════════════════════════════════════════════════
// 🔧 مولّد بروفايل ناعم لجسم القنينة
// نمرر نقاط تحكم قليلة [نصف القطر, الارتفاع] وبيرجع منحني سلس جاهز لـ Lathe
// ═══════════════════════════════════════════════════
function smoothProfile(controlPoints, segments = 48) {
  const curve = new THREE.CatmullRomCurve3(
    controlPoints.map(([r, y]) => new THREE.Vector3(r, y, 0)),
  );
  return curve
    .getPoints(segments)
    .map((p) => new THREE.Vector2(Math.max(p.x, 0.001), p.y));
}

// مادة الزجاج الموحّدة لكل القناني - بتستفيد من الـ HDRI بالمشهد
function glassMaterial(color, opacity = 0.5) {
  return (
    <meshPhysicalMaterial
      color={color}
      transparent
      opacity={opacity}
      transmission={0.92}
      thickness={0.5}
      ior={1.5}
      roughness={0.06}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={1.4}
    />
  );
}

// ═══════════════════════════════════════════════════
// 🧪 القطارة (Dropper Bottle)
// ═══════════════════════════════════════════════════
const DROPPER_PROFILE = [
  [0.001, -0.55],
  [0.27, -0.53],
  [0.28, -0.3],
  [0.28, 0.18],
  [0.24, 0.32],
  [0.13, 0.42],
  [0.12, 0.58],
  [0.15, 0.62],
];

function DropperBottle({ position, rotation, scale, color = "#8fca8f" }) {
  const profile = useMemo(() => smoothProfile(DROPPER_PROFILE), []);
  const liquidProfile = useMemo(
    () =>
      smoothProfile(DROPPER_PROFILE.slice(0, 5).map(([r, y]) => [r * 0.9, y])),
    [],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم */}
      <mesh>
        <latheGeometry args={[profile, 40]} />
        {glassMaterial(color, 0.5)}
      </mesh>
      {/* السائل داخل */}
      <mesh>
        <latheGeometry args={[liquidProfile, 40]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.75}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* الغطاء */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.16, 0.15, 0.26, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.25}
          metalness={0.75}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* حلقة الغطاء */}
      <mesh position={[0, 0.63, 0]}>
        <torusGeometry args={[0.155, 0.018, 12, 32]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>
      {/* القطارة (الأنبوب الداخلي) */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.55, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.1}
        />
      </mesh>
      {/* اللصقة البيضاء */}
      <mesh position={[0, -0.12, 0.285]}>
        <planeGeometry args={[0.34, 0.5]} />
        <meshStandardMaterial color="#fafafa" roughness={0.85} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🧴 زجاجة زيت (Oil Bottle)
// ═══════════════════════════════════════════════════
const OIL_PROFILE = [
  [0.001, -0.55],
  [0.34, -0.53],
  [0.35, -0.1],
  [0.34, 0.35],
  [0.25, 0.5],
  [0.13, 0.6],
  [0.12, 0.78],
  [0.15, 0.82],
];

function OilBottle({ position, rotation, scale, color = "#c9a961" }) {
  const profile = useMemo(() => smoothProfile(OIL_PROFILE), []);
  const liquidProfile = useMemo(
    () => smoothProfile(OIL_PROFILE.slice(0, 5).map(([r, y]) => [r * 0.92, y])),
    [],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم */}
      <mesh>
        <latheGeometry args={[profile, 40]} />
        {glassMaterial(color, 0.5)}
      </mesh>
      {/* السائل داخل */}
      <mesh>
        <latheGeometry args={[liquidProfile, 40]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.65}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>
      {/* الغطاء */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.16, 0.15, 0.22, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.25}
          metalness={0.75}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* اللصقة */}
      <mesh position={[0, -0.1, 0.345]}>
        <planeGeometry args={[0.48, 0.6]} />
        <meshStandardMaterial color="#fafafa" roughness={0.85} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🏺 برطمان (Jar)
// ═══════════════════════════════════════════════════
const JAR_PROFILE = [
  [0.001, -0.35],
  [0.45, -0.33],
  [0.46, 0.0],
  [0.44, 0.25],
  [0.4, 0.33],
  [0.42, 0.37],
];

function Jar({ position, rotation, scale, color = "#a8d5a8" }) {
  const profile = useMemo(() => smoothProfile(JAR_PROFILE), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم */}
      <mesh>
        <latheGeometry args={[profile, 44]} />
        {glassMaterial("#ffffff", 0.42)}
      </mesh>
      {/* السائل */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.44, 0.4, 40]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>
      {/* الغطاء */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.16, 40]} />
        <meshStandardMaterial
          color="#8a6a3a"
          roughness={0.55}
          metalness={0.35}
          envMapIntensity={1.1}
        />
      </mesh>
      {/* اللصقة */}
      <mesh position={[0, -0.05, 0.46]}>
        <planeGeometry args={[0.55, 0.4]} />
        <meshStandardMaterial color="#fafafa" roughness={0.85} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 🧪 القارورة المخروطية (Conical Flask)
// ═══════════════════════════════════════════════════
const FLASK_PROFILE = [
  [0.001, -0.6],
  [0.06, -0.58],
  [0.5, 0.12],
  [0.48, 0.24],
  [0.11, 0.55],
  [0.1, 0.75],
  [0.13, 0.79],
];

function ConicalFlask({ position, rotation, scale, color = "#5aad5a" }) {
  const profile = useMemo(() => smoothProfile(FLASK_PROFILE), []);
  const liquidProfile = useMemo(
    () =>
      smoothProfile(
        FLASK_PROFILE.slice(0, 4).map(([r, y]) => [r * 0.9, y - 0.05]),
      ),
    [],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم المخروطي */}
      <mesh>
        <latheGeometry args={[profile, 44]} />
        {glassMaterial("#ffffff", 0.4)}
      </mesh>
      {/* السائل */}
      <mesh>
        <latheGeometry args={[liquidProfile, 44]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.78}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.22}
        />
      </mesh>
      {/* السدادة */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.14, 0.11, 0.14, 32]} />
        <meshStandardMaterial
          color="#c9a961"
          roughness={0.35}
          metalness={0.6}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// 💉 القارورة الصغيرة (Vial)
// ═══════════════════════════════════════════════════
const VIAL_PROFILE = [
  [0.001, -0.35],
  [0.12, -0.33],
  [0.13, 0.25],
  [0.12, 0.33],
  [0.14, 0.37],
];

function Vial({ position, rotation, scale, color = "#c9a961" }) {
  const profile = useMemo(() => smoothProfile(VIAL_PROFILE), []);
  const liquidProfile = useMemo(
    () =>
      smoothProfile(VIAL_PROFILE.slice(0, 3).map(([r, y]) => [r * 0.85, y])),
    [],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* الجسم */}
      <mesh>
        <latheGeometry args={[profile, 32]} />
        {glassMaterial("#ffffff", 0.45)}
      </mesh>
      {/* السائل */}
      <mesh>
        <latheGeometry args={[liquidProfile, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>
      {/* الغطاء */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.14, 32]} />
        <meshStandardMaterial
          color="#c9a961"
          roughness={0.25}
          metalness={0.8}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// المشهد الرئيسي (نفس منطق الحركة والتموضع السابق - غيّرنا الأشكال فقط)
// ═══════════════════════════════════════════════════
export default function Bottles() {
  const groupRef = useRef();
  const { activeSection } = useScrollContext();

  const bottles = useMemo(
    () => [
      {
        Component: DropperBottle,
        position: [-2.8, -0.2, 0],
        rotation: [0, 0, 0],
        scale: 1.0,
        color: "#8fca8f",
      },
      {
        Component: OilBottle,
        position: [-1.4, -0.3, 0.3],
        rotation: [0, 0.3, 0],
        scale: 1.0,
        color: "#c9a961",
      },
      {
        Component: Jar,
        position: [0, -0.4, -0.3],
        rotation: [0, 0.5, 0],
        scale: 1.1,
        color: "#a8d5a8",
      },
      {
        Component: ConicalFlask,
        position: [1.4, -0.3, 0.3],
        rotation: [0, -0.3, 0],
        scale: 1.0,
        color: "#5aad5a",
      },
      {
        Component: Vial,
        position: [2.8, -0.2, 0],
        rotation: [0, 0, 0],
        scale: 1.0,
        color: "#c9a961",
      },
    ],
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const isActive = activeSection === "products";
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
      child.rotation.y = t * 0.3 + i * 0.5;

      if (child.userData.initialY === undefined) {
        child.userData.initialY = child.position.y;
      }
      child.position.y = child.userData.initialY + Math.sin(t * 0.8 + i) * 0.12;
    });
  });

  return (
    <group ref={groupRef}>
      {bottles.map(({ Component, position, rotation, scale, color }, i) => (
        <Component
          key={i}
          position={position}
          rotation={rotation}
          scale={scale}
          color={color}
        />
      ))}
    </group>
  );
}
