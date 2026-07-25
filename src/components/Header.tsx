import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation, siteMeta } from "../data/site";
import { useDarkMode } from "../hooks/useDarkMode";

const homeSectionTargets: Record<string, string> = {
  "/": "/#hem",
  "/projects": "/#projekt",
  "/services": "/#tjanster",
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeScrollHref, setActiveScrollHref] = useState("/");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { isDark, toggleTheme } = useDarkMode();
  const { pathname } = useLocation();

  useEffect(() => {
    let animationFrame = 0;

    function updateScrollState() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => setIsScrolled(window.scrollY > 18));
    }

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);

    if (pathname !== "/") {
      setActiveScrollHref(pathname);
      return;
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-section]"));
    if (!sections.length) return;

    function updateActiveSection() {
      const activationLine = 94 + window.innerHeight * 0.18;
      const activeSection =
        sections
          .filter((section) => section.getBoundingClientRect().top <= activationLine)
          .sort(
            (sectionA, sectionB) =>
              sectionB.getBoundingClientRect().top - sectionA.getBoundingClientRect().top,
          )[0] ?? sections[0];

      setActiveScrollHref(activeSection.dataset.navSection ?? "/");
    }

    const observer = new IntersectionObserver(
      updateActiveSection,
      {
        rootMargin: "-94px 0px -58% 0px",
        threshold: [0.08, 0.2, 0.4, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));
    const initialFrame = requestAnimationFrame(updateActiveSection);
    return () => {
      cancelAnimationFrame(initialFrame);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const firstLink = navRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const headerClassName = [
    "site-header",
    isScrolled ? "is-scrolled" : "",
    isOpen ? "is-menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <div className="container nav-shell">
        <Link className="brand" to="/" onClick={() => setIsOpen(false)}>
          <img src="/assets/brand/mshaped-mark-original.png" alt="" width="42" height="42" />
          <span>{siteMeta.name}</span>
        </Link>

        <nav
          className={`primary-nav ${isOpen ? "is-open" : ""}`}
          id="primary-navigation"
          ref={navRef}
          aria-label="Huvudnavigation"
        >
          {navigation.map((item) => {
            const target = pathname === "/" ? (homeSectionTargets[item.href] ?? item.href) : item.href;
            const isActive =
              pathname === "/"
                ? activeScrollHref === item.href
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={[
                  isActive ? "is-active" : "",
                  item.href === "/contact" ? "nav-contact" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={item.href}
                to={target}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Växla tema">
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            aria-controls="primary-navigation"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Stäng meny" : "Öppna meny"}
            className="icon-button menu-button"
            onClick={() => setIsOpen((current) => !current)}
            ref={menuButtonRef}
            type="button"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
