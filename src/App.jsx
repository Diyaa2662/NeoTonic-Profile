import Layout from "./components/layout/Layout";
import { ScrollProvider } from "./contexts/ScrollContext";
import { useActiveSection } from "./hooks/useActiveSection";
import { useMousePosition } from "./hooks/useMousePosition";
// import Background3D from "./components/three/Background3D";
import BackgroundSlideshow from "./components/background/BackgroundSlideshow";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Products from "./components/sections/Products";
import Quality from "./components/sections/Quality";
import Contact from "./components/sections/Contact";

function AppContent() {
  useActiveSection(["home", "about", "products", "quality", "contact"]);
  useMousePosition();

  return (
    <>
      {/* ⬇️ الخلفيات — اختر وحدة بس حالياً */}
      {/* <Background3D /> */}
      <BackgroundSlideshow />

      <div className="relative z-10">
        <Layout>
          <Hero />
          <Products />
          <Quality />
          <About />
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
