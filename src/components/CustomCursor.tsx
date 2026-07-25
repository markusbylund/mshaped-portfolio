import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const cursorDot: HTMLSpanElement = dot;
    const cursorRing: HTMLSpanElement = ring;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let animationFrame = 0;
    let isAnimating = false;

    document.documentElement.classList.add("has-custom-cursor");

    function renderCursor() {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      if (Math.abs(pointerX - ringX) > 0.1 || Math.abs(pointerY - ringY) > 0.1) {
        animationFrame = requestAnimationFrame(renderCursor);
      } else {
        isAnimating = false;
      }
    }

    function updatePointer(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursorDot.classList.add("is-visible");
      cursorRing.classList.add("is-visible");
      const target = event.target as Element | null;
      const isInteractive = Boolean(
        target?.closest("a, button, [role='button'], .project-card, .service-card"),
      );
      const usesNativeCursor = Boolean(target?.closest("input, textarea, select, canvas"));

      cursorRing.classList.toggle("is-interactive", isInteractive);
      cursorDot.classList.toggle("is-hidden", usesNativeCursor);
      cursorRing.classList.toggle("is-hidden", usesNativeCursor);

      if (!isAnimating) {
        isAnimating = true;
        animationFrame = requestAnimationFrame(renderCursor);
      }
    }

    function showCursor() {
      cursorDot.classList.add("is-visible");
      cursorRing.classList.add("is-visible");
    }

    function hideCursor() {
      cursorDot.classList.remove("is-visible");
      cursorRing.classList.remove("is-visible");
    }

    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.documentElement.addEventListener("mouseenter", showCursor);
    document.documentElement.addEventListener("mouseleave", hideCursor);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", updatePointer);
      document.documentElement.removeEventListener("mouseenter", showCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="custom-cursor">
      <span className="custom-cursor-ring" ref={ringRef} />
      <span className="custom-cursor-dot" ref={dotRef} />
    </div>
  );
}
