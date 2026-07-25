import { Link } from "react-router-dom";
import type { WheelEvent } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { getFeaturedProjects } from "../data/projects";

export function FeaturedProjects() {
  const featuredProjects = getFeaturedProjects();
  const carouselProjects = [...featuredProjects, ...featuredProjects];
  const handleCarouselWheel = (event: WheelEvent<HTMLDivElement>) => {
    const scrollAmount = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (scrollAmount === 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="section featured-carousel-section" data-nav-section="/projects" data-reveal id="projekt">
      <div className="container section-heading">
        <div>
          <p className="eyebrow">Utvalda projekt</p>
          <h2>Se hur jag löser problem och skapar resultat</h2>
        </div>
        <Link className="text-link" to="/projects">
          Se fler case
        </Link>
      </div>

      <div className="project-carousel" aria-label="Utvalda projekt" onWheel={handleCarouselWheel}>
        <div className="project-carousel-track">
          {carouselProjects.map((project, index) => (
            <div
              className="project-carousel-item"
              key={`${project.id}-${index}`}
              aria-hidden={index >= featuredProjects.length}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      <div className="container project-followup-panel">
        <div className="project-followup-content">
          <p>Har ni en liknande utmaning?</p>
          <Link className="text-link" to="/contact">
            Boka samtal
          </Link>
        </div>
      </div>
    </section>
  );
}
