import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      let secondFrame = 0;
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          const target = document.querySelector(hash);
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      return () => {
        cancelAnimationFrame(firstFrame);
        cancelAnimationFrame(secondFrame);
      };
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [hash, pathname]);

  return null;
}
