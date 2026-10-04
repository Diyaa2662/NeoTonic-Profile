import { motion, AnimatePresence } from "framer-motion";
import { useScrollContext } from "../../contexts/ScrollContext";

// ═══════════════════════════════════════════════════
// 🖼️ إعدادات كل قسم: صورة + overlay
// ═══════════════════════════════════════════════════
// ⬇️ الصور من مجلد public/images/sections/
//    المسار النسبي: /images/sections/اسم-الصورة.jpg
const SECTION_IMAGES = {
  home: {
    url: "/images/sections/hero.jpg",
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.55) 0%, rgba(30,74,30,0.65) 100%)",
  },
  about: {
    url: "/images/sections/about.jpg",
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.7) 0%, rgba(201,169,97,0.4) 100%)",
  },
  products: {
    url: "/images/sections/products.jpg",
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.65) 0%, rgba(201,169,97,0.5) 100%)",
  },
  quality: {
    url: "/images/sections/quality.jpg",
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.75) 0%, rgba(180,220,220,0.5) 100%)",
  },
  contact: {
    url: "/images/sections/contact.jpg",
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.75) 0%, rgba(201,169,97,0.4) 100%)",
  },
};

// ═══════════════════════════════════════════════════
// 🎬 المكوّن الرئيسي
// ═══════════════════════════════════════════════════
export default function BackgroundSlideshow() {
  const { activeSection } = useScrollContext();
  const current = SECTION_IMAGES[activeSection] || SECTION_IMAGES.home;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-cream"
      aria-hidden="true"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
          }}
          className="absolute inset-0"
        >
          {/* ⬇️ Ken Burns: حركة بطيئة جداً (40s) */}
          <motion.div
            initial={{ scale: 1.05, x: 0, y: 0 }}
            animate={{
              scale: [1.05, 1.12, 1.05],
              x: [0, 12, 0],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <img
              src={current.url}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* ⬇️ Overlay (radial gradient) */}
          <div
            className="absolute inset-0"
            style={{ background: current.overlay }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
