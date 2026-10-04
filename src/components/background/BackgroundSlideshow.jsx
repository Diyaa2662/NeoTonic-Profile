import { motion, AnimatePresence } from "framer-motion";
import { useScrollContext } from "../../contexts/ScrollContext";

// ═══════════════════════════════════════════════════
// 🖼️ إعدادات كل قسم: صورة + overlay
// ═══════════════════════════════════════════════════
const SECTION_IMAGES = {
  home: {
    // غابة ضبابية خضراء — طبيعة، هدوء، عمق
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
    // overlay: أخضر داكن للحواف، شفاف في النص
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.55) 0%, rgba(30,74,30,0.65) 100%)",
  },
  about: {
    // ثمار وأعشاب على طاولة — دافئ، طبيعي
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1920&q=80",
    // overlay: كريمي دافئ للقراءة
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.7) 0%, rgba(201,169,97,0.4) 100%)",
  },
  products: {
    // قوارير زيت عطرية متعددة — ذهبي، دافئ
    url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=80",
    // overlay: ذهبي خفيف
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.65) 0%, rgba(201,169,97,0.5) 100%)",
  },
  quality: {
    // أنابيب اختبار في مختبر — علمي، نظيف
    url: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80",
    // overlay: أبيض/كريمي نظيف
    overlay:
      "radial-gradient(ellipse at center, rgba(247,245,239,0.75) 0%, rgba(180,220,220,0.5) 100%)",
  },
  contact: {
    // خريطة قديمة/تفصيلية — جغرافي، كلاسيكي
    url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80",
    // overlay: كريمي دافئ
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
