// src/components/three/elements/Particles.jsx
//
// ⬇️ سبب اختفاء الجسيمات بالنسخة السابقة (سببين مجتمعين):
//   1) الـ ShaderMaterial كان يقرأ attribute اسمه "color" بدون ما يعرّفه
//      (three بتعرّفه بس إذا vertexColors=true) → خطأ compile بالـ console
//      وبالتالي ما بينرسم شي. الحل: attributes بأسماء خاصة (aColor/aSize/aPhase).
//   2) AdditiveBlending على خلفية فاتحة (كريمي) = "إضافة ضوء فوق ضوء" فبتختفي
//      حتى لو اشتغل الـ shader. الحل: NormalBlending + ألوان أغمق وأكثر تشبّعاً
//      (شلنا الأبيض لأنه ما بينشاف عالخلفية الفاتحة).
//
// تحسينات إضافية:
//   - توزيع الجسيمات صار بمستطيل يغطي الشاشة (كانت كرة، ونص الجسيمات بره الكادر)
//   - حجم كل جسيم بوحدات العالم + معايرة تلقائية حسب دقة الشاشة
//   - حركة عوم خفيفة + وميض بسيط داخل الـ shader (بدون تكلفة على الـ CPU)

/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ⬇️ نسيج دائري ناعم (نواة أوضح من قبل عشان تنشاف عالخلفية الفاتحة)
function createGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.85)");
  g.addColorStop(0.75, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const VERTEX_SHADER = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform float uTime;
  uniform float uScale;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    vec3 p = position;
    // عوم خفيف لكل جسيم بطور مختلف
    p.y += sin(uTime * 0.35 + aPhase * 6.2831) * 0.18;
    p.x += cos(uTime * 0.25 + aPhase * 6.2831) * 0.10;
    vTwinkle = 0.75 + 0.25 * sin(uTime * 0.9 + aPhase * 12.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uScale / max(-mv.z, 0.5);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float a = texture2D(uMap, gl_PointCoord).a;
    if (a < 0.02) discard;
    gl_FragColor = vec4(vColor, a * uOpacity * vTwinkle);
  }
`;

export default function Particles({ count = 220 }) {
  const pointsRef = useRef();
  const matRef = useRef();
  const glowTexture = useMemo(() => createGlowTexture(), []);

  const { positions, colors, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    // ⬇️ ألوان أغمق/أشبع من قبل - مناسبة للخلفية الكريمية الفاتحة
    const palette = [
      new THREE.Color("#c9a227"), // ذهبي
      new THREE.Color("#43a047"), // أخضر
      new THREE.Color("#2e7d32"), // أخضر غامق
      new THREE.Color("#b58a1f"), // ذهبي زيتي
    ];

    for (let i = 0; i < count; i++) {
      // ⬇️ مستطيل يغطي الكادر (بدل الكرة القديمة)
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -7 + Math.random() * 9;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // معظمها صغير وقليل منها كبير (إحساس عمق/bokeh)
      sizes[i] = 0.05 + Math.pow(Math.random(), 2) * 0.09;
      phases[i] = Math.random();
    }

    return { positions, colors, sizes, phases };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: glowTexture },
      uTime: { value: 0 },
      uScale: { value: 1000 },
      uOpacity: { value: 0.85 },
    }),
    [glowTexture],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (matRef.current) {
      const u = matRef.current.uniforms;
      u.uTime.value = t;
      // معايرة الحجم حسب ارتفاع الشاشة والـ DPR والـ FOV
      const fov = (state.camera.fov * Math.PI) / 180;
      u.uScale.value =
        (state.size.height * state.gl.getPixelRatio()) /
        (2 * Math.tan(fov / 2));
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(t * 0.05) * 0.1;
      pointsRef.current.rotation.x = Math.sin(t * 0.07) * 0.03;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={count}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
      />
    </points>
  );
}
