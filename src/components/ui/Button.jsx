import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 relative overflow-hidden group";

  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/40",
    outline:
      "border-2 border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-white",
    ghost: "text-brand-700 hover:bg-brand-50",
    gold: "bg-gold text-ink hover:bg-gold/90 shadow-lg shadow-gold/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = clsx(base, variants[variant], sizes[size], className);

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}
