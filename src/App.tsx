import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollToTop } from "./components/ScrollToTop";
import { ScrollReveal } from "./components/ScrollReveal";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Projects } from "./pages/Projects";
import { Services } from "./pages/Services";
import { fallbackSeo, seoByPath } from "./data/seo";

const SolarExpanse = lazy(() =>
  import("./projects/solar-expanse").then((module) => ({ default: module.SolarExpanse })),
);

const PlaydatePlanner = lazy(() =>
  import("./projects/playdate-planner").then((module) => ({ default: module.PlaydatePlanner })),
);

const TheFiveCrystals = lazy(() =>
  import("./projects/the-five-crystals").then((module) => ({ default: module.TheFiveCrystals })),
);

const NordvikFastigheter = lazy(() =>
  import("./projects/nordvik-fastigheter").then((module) => ({
    default: module.NordvikFastigheter,
  })),
);

const EldEk = lazy(() =>
  import("./projects/eld-ek").then((module) => ({
    default: module.EldEk,
  })),
);

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoByPath[pathname] ?? fallbackSeo;
    const imageUrl = new URL(seo.image, window.location.origin).href;
    const canonicalUrl = new URL(pathname, window.location.origin).href;

    document.title = seo.title;
    setMetaContent('meta[name="description"]', seo.description);
    setMetaContent('meta[property="og:title"]', seo.title);
    setMetaContent('meta[property="og:description"]', seo.description);
    setMetaContent('meta[property="og:image"]', imageUrl);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', seo.title);
    setMetaContent('meta[name="twitter:description"]', seo.description);
    setMetaContent('meta[name="twitter:image"]', imageUrl);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
  }, [pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Hoppa till innehållet
      </a>
      <CustomCursor />
      <ScrollToTop />
      <ScrollReveal />
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/projects/solar-expanse"
            element={
              <Suspense fallback={<div className="route-loading">Laddar Solar Expanse...</div>}>
                <SolarExpanse />
              </Suspense>
            }
          />
          <Route
            path="/projects/playdate-planner"
            element={
              <Suspense fallback={<div className="route-loading">Laddar Playdate Planner...</div>}>
                <PlaydatePlanner />
              </Suspense>
            }
          />
          <Route
            path="/projects/the-five-crystals"
            element={
              <Suspense fallback={<div className="route-loading">Laddar The Five Crystals...</div>}>
                <TheFiveCrystals />
              </Suspense>
            }
          />
          <Route
            path="/projects/nordvik-fastigheter"
            element={
              <Suspense fallback={<div className="route-loading">Laddar Nordvik Fastigheter...</div>}>
                <NordvikFastigheter />
              </Suspense>
            }
          />
          <Route
            path="/projects/eld-ek"
            element={
              <Suspense fallback={<div className="route-loading">Laddar Eld & Ek...</div>}>
                <EldEk />
              </Suspense>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
