import { motion } from "framer-motion";
import clsx from "clsx";

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}) {
  return (
    <div
      className={clsx(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-start",
      )}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className={clsx(
            "inline-block text-sm font-semibold tracking-widest uppercase mb-4",
            light ? "text-gold" : "text-brand-600",
          )}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={clsx(
          "font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={clsx(
            "mt-6 text-lg leading-relaxed",
            light ? "text-white/70" : "text-ink/70",
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
