import { ArrowUpRight, Code2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

type ProjectCardProps = {
  project: Project;
};

function ProjectLink({
  children,
  className,
  label,
  url,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  url: string;
}) {
  if (url.startsWith("/")) {
    return (
      <Link aria-label={label} className={className} to={url}>
        {children}
      </Link>
    );
  }

  return (
    <a aria-label={label} className={className} href={url} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}

function ProjectVisual({ project }: ProjectCardProps) {
  const content = project.image ? (
    <picture>
      {project.mobileImage ? (
        <source media="(max-width: 540px)" srcSet={project.mobileImage} />
      ) : null}
      <img
        alt={project.imageAlt ?? ""}
        height={900}
        loading="lazy"
        src={project.image}
        width={1440}
      />
    </picture>
  ) : (
    <div className={`project-mockup is-${project.mockup ?? "space-interface"}`}>
      <span className="project-mockup-grid" />
      <span className="project-mockup-window">
        <i />
        <i />
        <i />
      </span>
      <span className="project-mockup-focus" />
      <span className="project-mockup-detail" />
    </div>
  );

  return project.projectUrl ? (
    <ProjectLink className="project-media" label={`Besök ${project.title}`} url={project.projectUrl}>
      {content}
    </ProjectLink>
  ) : (
    <div className="project-media">{content}</div>
  );
}

function getProjectStatus(project: Project) {
  if (project.status === "upcoming") {
    return {
      label: "Kommande case",
      text: "Under uppbyggnad",
    };
  }

  if (project.status === "ongoing") {
    return {
      label: "Pågående projekt",
      text: "Byggs och dokumenteras stegvis",
    };
  }

  return {
    label: "Under vidareutveckling",
    text: "Case förbättras löpande",
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isUpcoming = project.status === "upcoming";
  const isOngoing = project.status === "ongoing";
  const primaryUrl = project.projectUrl ?? project.githubUrl;
  const status = getProjectStatus(project);
  const kicker = isUpcoming
    ? "Kommande case"
    : isOngoing
      ? `Pågående projekt · ${project.category}`
      : `Case ${String(project.order).padStart(2, "0")} · ${project.category}`;

  return (
    <article
      className={`project-card ${primaryUrl ? "is-clickable" : ""} ${isUpcoming ? "is-upcoming" : ""} ${isOngoing ? "is-ongoing" : ""}`}
    >
      {primaryUrl ? (
        <ProjectLink
          className="project-card-overlay"
          label={`Öppna ${project.title}`}
          url={primaryUrl}
        >
          <span className="sr-only">Öppna {project.title}</span>
        </ProjectLink>
      ) : null}

      <ProjectVisual project={project} />

      <div className="project-card-body">
        <div className="project-card-copy">
          <p className="card-kicker">
            <span />
            {kicker}
          </p>
          <h3>
            {project.projectUrl ? (
              <ProjectLink label={`Besök ${project.title}`} url={project.projectUrl}>
                {project.title}
              </ProjectLink>
            ) : (
              project.title
            )}
          </h3>
          <p>{project.shortDescription}</p>
        </div>

        {project.caseStudy ? (
          <dl className="project-case-points">
            <div>
              <dt>Utmaning</dt>
              <dd>{project.caseStudy.problem}</dd>
            </div>
            <div>
              <dt>Lösning</dt>
              <dd>{project.caseStudy.solution}</dd>
            </div>
            <div>
              <dt>Resultat</dt>
              <dd>{project.caseStudy.designDecisions[0]}</dd>
            </div>
          </dl>
        ) : null}

        <ul className="tag-list" aria-label={`Tekniker för ${project.title}`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="project-card-footer">
          <div className="project-status-panel">
            <span />
            <div>
              <strong>{status.label}</strong>
              <p>{status.text}</p>
            </div>
          </div>

          {project.projectUrl || project.githubUrl ? (
            <div className="card-actions">
              {project.projectUrl ? (
                <ProjectLink label={`Besök ${project.title}`} url={project.projectUrl}>
                  Läs mer
                  <ArrowUpRight size={17} />
                </ProjectLink>
              ) : null}
              {project.githubUrl ? (
                <ProjectLink label={`Se koden för ${project.title}`} url={project.githubUrl}>
                  <Code2 size={17} />
                  GitHub
                </ProjectLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
