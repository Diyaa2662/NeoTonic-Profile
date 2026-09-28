import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import Container from "../ui/Container";
import clsx from "clsx";

export default function Navbar() {
  const { t } = useTranslation();
  const { lang, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const links = [
    { href: "#home", label: t("nav.home") },
    { href: "#about", label: t("nav.about") },
    { href: "#products", label: t("nav.products") },
    { href: "#quality", label: t("nav.quality") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-cream/80 backdrop-blur-xl shadow-lg shadow-ink/5 py-3"
            : "bg-transparent py-6",
        )}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-semibold text-xl text-brand-800">
                  NeoTonic
                </span>
                <span className="text-[10px] tracking-widest text-brand-600 uppercase">
                  Botanical Extract
                </span>
              </div>
            </a>

            {/* Desktop links */}
            <nav className="hidden lg:flex items-center gap-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-ink/80 hover:text-brand-700 font-medium transition-colors group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-600/30 hover:border-brand-600 hover:bg-brand-50 transition-all text-sm font-medium text-brand-700"
              >
                <Globe size={16} />
                <span>{lang === "ar" ? "EN" : "ع"}</span>
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-brand-50 transition"
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: lang === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={clsx(
                "absolute top-0 bottom-0 w-80 max-w-[85vw] bg-cream shadow-2xl p-8",
                lang === "ar" ? "right-0" : "left-0",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-display font-semibold text-xl text-brand-800">
                  NeoTonic
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-brand-50"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => setMobileOpen(false)}
                    className="py-4 px-4 rounded-xl text-lg font-medium text-ink hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
