const stars = Array.from({ length: 95 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  delay: `${(index % 12) * 0.4}s`,
  size: `${1 + (index % 3) * 0.5}px`,
}));

export function Starfield() {
  return (
    <div className="expanse-starfield" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
    </div>
  );
}
