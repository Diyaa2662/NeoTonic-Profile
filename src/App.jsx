import Layout from "./components/layout/Layout";
import { ScrollProvider } from "./contexts/ScrollContext";
import { useActiveSection } from "./hooks/useActiveSection";
import { useMousePosition } from "./hooks/useMousePosition";
import Background3D from "./components/three/Background3D";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Products from "./components/sections/Products";
import Quality from "./components/sections/Quality";
import Contact from "./components/sections/Contact";

function AppContent() {
  // ⬇️ تفعيل تتبع القسم النشط
  useActiveSection(["home", "about", "products", "quality", "contact"]);

  // ⬇️ تفعيل تتبع الماوس
  useMousePosition();

  return (
    <>
      {/* 3D Background - ثابت في كل الصفحة */}
      <Background3D />

      {/* المحتوى - فوق الـ 3D */}
      <div className="relative z-10">
        <Layout>
          <Hero />
          <About />
          <Products />
          <Quality />
          <Contact />
        </Layout>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ScrollProvider>
      <AppContent />
    </ScrollProvider>
  );
}
