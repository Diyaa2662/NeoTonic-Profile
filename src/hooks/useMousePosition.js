import { useEffect } from "react";
import { useScrollContext } from "../contexts/ScrollContext";

export function useMousePosition() {
  const { updateMouse } = useScrollContext();

  useEffect(() => {
    const handleMouseMove = (e) => {
      // قيم من -1 إلى 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      updateMouse(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [updateMouse]);
}
