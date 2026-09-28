import clsx from "clsx";

export default function Container({ children, className, size = "default" }) {
  const sizes = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]",
  };

  return (
    <div
      className={clsx("mx-auto px-6 md:px-8 lg:px-12", sizes[size], className)}
    >
      {children}
    </div>
  );
}
