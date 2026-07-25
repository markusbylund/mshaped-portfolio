import type { Planet } from "../data/planets";

type PlanetNavProps = {
  activeIndex: number;
  planets: Planet[];
  onSelect: (index: number) => void;
};

export function PlanetNav({ activeIndex, planets, onSelect }: PlanetNavProps) {
  return (
    <nav className="expanse-nav" aria-label="Planetnavigering">
      {planets.map((planet, index) => (
        <button
          key={planet.id}
          className={index === activeIndex ? "is-active" : undefined}
          type="button"
          onClick={() => onSelect(index)}
          style={{ "--planet-color": planet.color } as React.CSSProperties}
        >
          <span className="expanse-nav-dot" />
          <span className="expanse-nav-name">{planet.name}</span>
          <span className="expanse-nav-distance">{planet.distanceFromSun}</span>
        </button>
      ))}
    </nav>
  );
}
