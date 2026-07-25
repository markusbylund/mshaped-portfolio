import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ProjectCard } from "../components/ProjectCard";
import { getOrderedProjects, projects, type ProjectCategory } from "../data/projects";

const filters: Array<ProjectCategory | "Alla"> = ["Alla", "Webapp", "Website", "UX", "Automation"];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Alla");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "Alla") {
      return getOrderedProjects();
    }

    return getOrderedProjects(projects.filter((project) => project.category === activeFilter));
  }, [activeFilter]);

  return (
    <>
      <PageHeader
        eyebrow="Projekt"
        title="Utvalda arbeten och produktnära frontend"
        description="Case som visar strategi, UX/UI, frontend, 3D och produktutveckling från tidig prototyp till fungerande upplevelse."
      />

      <section className="section">
        <div className="container filter-bar" aria-label="Filtrera projekt">
          {filters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "is-selected" : undefined}
              type="button"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="container project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="container projects-future-note">
          <span />
          Fler projekt kommer snart
        </div>
      </section>
    </>
  );
}
