// src/components/three/Lighting.jsx
//
// ⬇️ إضاءة استوديو (3-point lighting) بدل الإعداد المسطّح القديم.
// الفكرة: نور رئيسي دافئ (Key) + نور تعبئة أخضر ناعم (Fill) + نور حواف ذهبي (Rim)
// هاد التوزيع هو نفسه اللي بيستخدمه مصورو المنتجات لإبراز الزجاج والمعادن.
// لاحظ: شلنا الـ hemisphereLight لأنه الـ <Environment> (بملف Background3D)
// صار هو مصدر الإضاءة المحيطة الواقعية، ووجود الاثنين مع بعض كان يغسل التباين.

export default function Lighting() {
  return (
    <>
      {/* إضاءة محيطة خفيفة جداً - فقط لمنع الظلال من تصير سودة قاتمة */}
      <ambientLight intensity={0.25} color="#f7f5ef" />

      {/* ⬇️ Key Light - المصدر الرئيسي، دافئ كأنه ضو شمس ناعم داخل استوديو */}
      <directionalLight position={[6, 8, 5]} intensity={2.4} color="#fff4d6" />

      {/* ⬇️ Fill Light - يعبّي الظلال من الجهة المقابلة، أخضر ناعم يماشي هوية الشركة */}
      <directionalLight
        position={[-6, 2, -4]}
        intensity={0.55}
        color="#8fca8f"
      />

      {/* ⬇️ Rim Light - يفصل حواف العناصر عن الخلفية ويعطيها عمق (spotlight من الخلف) */}
      <spotLight
        position={[0, 4, -6]}
        intensity={1.4}
        angle={0.55}
        penumbra={0.9}
        color="#c9a961"
        decay={2}
      />

      {/* ⬇️ لمعة ذهبية خفيفة من تحت - تبرز انعكاسات القناني والشارة الذهبية */}
      <pointLight position={[0, -5, 4]} intensity={0.35} color="#c9a961" />
    </>
  );
}
