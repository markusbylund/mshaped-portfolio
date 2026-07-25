import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PlanetScene } from "./components/PlanetScene";
import "./styles/solar-expanse.css";

export function SolarExpanse() {
  return (
    <div className="solar-expanse-route">
      <Link className="expanse-back-link" to="/projects">
        <ArrowLeft size={17} />
        Projekt
      </Link>
      <PlanetScene />
    </div>
  );
}
