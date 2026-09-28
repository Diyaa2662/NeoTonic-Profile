// src/components/three/Background3D.jsx
//
// ⬇️ سبب الغسيل/السطوع الزايد:
//   - preset "studio" هو غرفة بيضاء بالكامل تقريباً → كل الزجاج والمعادن
//     كانت تعكس أبيض، ومع خلفية الصفحة الكريمية ما بيبقى تباين.
//   - Bloom بعتبة منخفضة كان يضيف هالة ضو فوق العناصر الفاتحة أصلاً.
//   - الـ Vignette غامق وبيناقض خلفية صفحة فاتحة (شلناه).
//
// الأرقام الثلاثة تحت هي "مقابض التحكم" - عدّلها لحد ما ترتاح:
//   ENV_INTENSITY: شدة الانعكاسات (أعلى = ألمع)
//   EXPOSURE:      تعريض الصورة الكلي (أعلى = أفتح)
//   ENV_PRESET:    "forest" (أخضر/أغمق) أو "park" أو "city" أو "studio" (الأفتح)
//
// ملاحظة: بنسخ three الحديثة (r163+) الـ envMapIntensity يلي حطيته على كل
// مادة بيتجاهله المحرك - المتحكم الفعلي هو environmentIntensity هون.

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import CoreScene from "./CoreScene";

const ENV_PRESET = "forest";
const ENV_INTENSITY = 0.5;
const EXPOSURE = 0.9;

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: EXPOSURE,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Environment
            preset={ENV_PRESET}
            environmentIntensity={ENV_INTENSITY}
          />

          <Lighting />
          <CameraRig />
          <CoreScene />

          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.35}
            scale={14}
            blur={2.6}
            far={3.2}
            resolution={512}
            color="#2a3a1a"
          />
        </Suspense>

        {/* Bloom أخف بكتير: بس الأشياء المضيئة فعلاً (العناصر الذهبية/المضيئة) */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.15}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
