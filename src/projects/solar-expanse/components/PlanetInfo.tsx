import { motion, useReducedMotion } from "framer-motion";
import type { Planet } from "../data/planets";

type PlanetInfoProps = {
  planet: Planet;
};

export function PlanetInfo({ planet }: PlanetInfoProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="expanse-info"
      key={planet.id}
      initial={false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={reducedMotion ? undefined : { opacity: 0, y: -14, filter: "blur(8px)" }}
      transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="expanse-label">{planet.kind}</p>
      <h1>{planet.name}</h1>
      <p className="expanse-subtitle">{planet.subtitle}</p>
      <p className="expanse-description">{planet.shortDescription}</p>

      <dl className="expanse-facts">
        <div>
          <dt>Avstånd</dt>
          <dd>{planet.distanceFromSun}</dd>
        </div>
        <div>
          <dt>Diameter</dt>
          <dd>{planet.diameter}</dd>
        </div>
        <div>
          <dt>Omlopp</dt>
          <dd>{planet.orbitalPeriod}</dd>
        </div>
      </dl>

      <a className="expanse-read-more" href={`#${planet.id}`}>
        Läs mer
      </a>
    </motion.div>
  );
}
