import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { PlanetInfo } from "./PlanetInfo";
import { PlanetNav } from "./PlanetNav";
import { Starfield } from "./Starfield";
import { planets, type Planet } from "../data/planets";

function clampIndex(index: number) {
  return Math.max(0, Math.min(planets.length - 1, index));
}

function getSectionTop(section: HTMLElement) {
  return section.getBoundingClientRect().top + window.scrollY;
}

function getScrollStep() {
  return Math.max(1, window.innerHeight * 1.2);
}

function smoothstep(start: number, end: number, value: number) {
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

function getPlanetMotion(index: number, scrollIndex: number) {
  const distance = index - scrollIndex;

  if (distance <= 0 && distance > -1.18) {
    const progress = smoothstep(0, 1.18, Math.abs(distance));

    return {
      opacity: 1 - progress * 0.86,
      scale: 1 - progress * 0.58,
      y: progress * -210,
      rotateX: progress * -34,
      blur: progress * 7,
      brightness: 1 - progress * 0.42,
      zIndex: 11,
    };
  }

  if (distance > 0 && distance < 1.22) {
    const progress = smoothstep(0, 1.22, 1.22 - distance);

    return {
      opacity: progress,
      scale: 0.82 + progress * 0.18,
      y: 520 - progress * 520,
      rotateX: 10 - progress * 10,
      blur: (1 - progress) * 6,
      brightness: 0.78 + progress * 0.22,
      zIndex: 13,
    };
  }

  return {
    opacity: 0,
    scale: 0.76,
    y: 520,
    rotateX: 0,
    blur: 10,
    brightness: 0.7,
    zIndex: 1,
  };
}

function PlanetOrb({ planet, index, scrollIndex }: { planet: Planet; index: number; scrollIndex: number }) {
  const motion = getPlanetMotion(index, scrollIndex);

  if (motion.opacity <= 0.01) {
    return null;
  }

  return (
    <div
      className={`expanse-planet expanse-planet-${planet.id}`}
      style={
        {
          "--planet-size": planet.size,
          "--planet-color": planet.color,
          "--planet-glow": planet.glowColor,
          "--planet-texture": planet.textureGradient,
          opacity: motion.opacity,
          filter: `saturate(1.18) contrast(1.1) brightness(${1.18 * motion.brightness}) blur(${motion.blur}px)`,
          transform: `translate3d(-50%, calc(-50% + ${motion.y}px), 0) rotateX(${motion.rotateX}deg) scale(${motion.scale})`,
          zIndex: motion.zIndex,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {planet.id === "saturn" ? <span className="saturn-ring" /> : null}
    </div>
  );
}

export function PlanetScene() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [scrollIndex, setScrollIndex] = useState(0);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const activePlanet = planets[activeIndex];

  const observerThresholds = useMemo(() => [0.42, 0.56, 0.72], []);

  function scrollToPlanet(index: number) {
    const nextIndex = clampIndex(index);
    const section = sectionRefs.current[nextIndex];

    if (!section) {
      return;
    }

    setDirection(nextIndex > activeIndex ? 1 : -1);
    window.scrollTo({ top: getSectionTop(section), behavior: reducedMotion ? "auto" : "smooth" });
  }

  useEffect(() => {
    if (reducedMotion) {
      setScrollIndex(activeIndex);
      return;
    }

    let frame = 0;

    function updateScrollIndex() {
      frame = 0;
      const rawIndex = window.scrollY / getScrollStep();
      const nextScrollIndex = Math.max(0, Math.min(planets.length - 1, rawIndex));
      const nextActiveIndex = clampIndex(Math.floor(nextScrollIndex + 0.62));

      setScrollIndex(nextScrollIndex);
      setActiveIndex((currentIndex) => {
        if (nextActiveIndex !== currentIndex) {
          setDirection(nextActiveIndex > currentIndex ? 1 : -1);
        }

        return nextActiveIndex;
      });
    }

    function requestUpdate() {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateScrollIndex);
    }

    updateScrollIndex();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    if (!reducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!activeEntry) {
          return;
        }

        const nextIndex = Number(activeEntry.target.getAttribute("data-index"));
        setActiveIndex((currentIndex) => {
          if (nextIndex !== currentIndex) {
            setDirection(nextIndex > currentIndex ? 1 : -1);
          }
          return nextIndex;
        });
      },
      {
        threshold: observerThresholds,
      },
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [observerThresholds, reducedMotion]);

  useEffect(() => {
    const planetId =
      new URLSearchParams(window.location.search).get("planet") ?? window.location.hash.replace("#", "");

    if (!planetId) {
      return;
    }

    const linkedIndex = planets.findIndex((planet) => planet.id === planetId);

    if (linkedIndex === -1) {
      return;
    }

    const scrollToLinkedPlanet = () => {
      const section = sectionRefs.current[linkedIndex];

      if (!section) {
        return;
      }

      setActiveIndex(linkedIndex);
      setScrollIndex(linkedIndex);
      window.scrollTo({ top: getSectionTop(section), behavior: "auto" });
    };

    window.requestAnimationFrame(scrollToLinkedPlanet);
    const retry = window.setTimeout(scrollToLinkedPlanet, 180);

    return () => window.clearTimeout(retry);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      event.preventDefault();
      scrollToPlanet(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, reducedMotion]);

  return (
    <article className="expanse-page">
      <Starfield />
      <div
        className="expanse-radial-glow"
        style={{ "--planet-glow": activePlanet.glowColor } as React.CSSProperties}
        aria-hidden="true"
      />
      <PlanetNav activeIndex={activeIndex} planets={planets} onSelect={scrollToPlanet} />

      <div className="expanse-planet-layer" aria-hidden="true">
        {planets.map((planet, index) => (
          <PlanetOrb planet={planet} index={index} key={planet.id} scrollIndex={reducedMotion ? activeIndex : scrollIndex} />
        ))}
      </div>

      <div className="expanse-stage" aria-live="polite">
        <AnimatePresence mode="wait" custom={direction}>
          <PlanetInfo planet={activePlanet} key={activePlanet.id} />
        </AnimatePresence>
      </div>

      <div className="expanse-scroll">
        {planets.map((planet, index) => (
          <section
            id={planet.id}
            className="expanse-section"
            data-index={index}
            key={planet.id}
            ref={(element) => {
              sectionRefs.current[index] = element;
            }}
            aria-label={planet.name}
          />
        ))}
      </div>
    </article>
  );
}
