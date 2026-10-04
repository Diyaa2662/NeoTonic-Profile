import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars
import { ArrowDown, Sparkles } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function Hero() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Eyebrow - شارة صغيرة فوق العنوان */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-brand-200/60 mb-8 shadow-sm"
          >
            <Sparkles size={16} className="text-gold" />
            <span className="text-sm font-medium tracking-wider text-brand-700 uppercase">
              {t("hero.tagline")}
            </span>
          </motion.div>

          {/* العنوان الرئيسي */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-brand-900 leading-[1.05] tracking-tight mb-8"
          >
            {t("hero.title")}
          </motion.h1>

          {/* الوصف */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-ink/70 leading-relaxed max-w-2xl mx-auto mb-12"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* الأزرار */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Button href="#products" variant="primary" size="lg">
              {t("hero.cta_primary")}
            </Button>
            <Button href="#contact" variant="outline" size="lg">
              {t("hero.cta_secondary")}
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      {/* <motion.a
        href="#about"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-700 hover:text-brand-900 transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase opacity-70">
          {t("nav.about")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.a> */}
    </section>
  );
}
