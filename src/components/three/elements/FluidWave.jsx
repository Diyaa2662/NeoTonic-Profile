// src/components/three/elements/FluidWave.jsx
//
// ⬇️ المشكلة الأساسية بالنسخة القديمة: كانت بتحرّك ارتفاع (z) كل نقطة
// بموجة واحدة بسيطة، بس بلا ما تعيد حساب الـ normals - يعني رغم إنه
// السطح فعلياً متموّج، الإضاءة كانت "تشوفه" مسطّح تماماً (بلا أي بريق أو
// ظل على القمم/الوديان). هيك كان يبين كـ سطح أخضر باهت بلا حياة.
//
// التحسينات:
//   1) دمج عدة موجات بترددات واتجاهات مختلفة (بدل موجة واحدة) - نفس أسلوب
//      محاكاة سطح السوائل الحقيقي (Gerstner-like blending).
//   2) إعادة حساب computeVertexNormals() كل فريم - هيك الإضاءة (والـ HDRI
//      الجديد) صارت فعلاً تنعكس عن القمم وتغيب بالوديان، فيصير عنده بريق
//      حقيقي متل سائل يلمع.
//   3) مادة meshPhysicalMaterial بلمسة "سائل لامع" (clearcoat + إضاءة بيئية)
//      بدل meshStandardMaterial المسطّحة.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ⬇️ دمج عدة موجات بترددات/اتجاهات مختلفة لحركة سائل طبيعية غير متكررة
function waveHeight(x, y, t) {
  const wave1 = Math.sin(x * 0.5 + t * 0.4) * 0.35;
  const wave2 = Math.cos(y * 0.45 + t * 0.32) * 0.28;
  const wave3 = Math.sin((x + y) * 0.3 + t * 0.55) * 0.15;
  const wave4 = Math.cos((x - y) * 0.6 - t * 0.25) * 0.1;
  return wave1 + wave2 + wave3 + wave4;
}

export default function FluidWave() {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      positions.setZ(i, waveHeight(x, y, t));
    }
    positions.needsUpdate = true;
    // ⬇️ الخطوة المفصلية: بدونها الإضاءة ما بتتفاعل مع تموّج السطح إطلاقاً
    geometry.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -2, -2]}
    >
      <planeGeometry args={[20, 20, 96, 96]} />
      <meshPhysicalMaterial
        color="#a8d5a8"
        roughness={0.2}
        metalness={0.05}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
        transmission={0.15}
        thickness={0.3}
        transparent
        opacity={0.4}
        envMapIntensity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
