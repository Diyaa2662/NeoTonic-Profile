import { useEffect } from "react";
import { useScrollContext } from "../contexts/ScrollContext";

export function useActiveSection(sectionIds) {
  const { setActiveSection } = useScrollContext();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // ⬇️ نمشي من الآخر للأول، وأول قسم نلاقيه هو النشط
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
    };

    // ⬇️ تشغيل أولي
    handleScroll();

    // ⬇️ نستخدم passive لتحسين الأداء
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sectionIds, setActiveSection]);
}
