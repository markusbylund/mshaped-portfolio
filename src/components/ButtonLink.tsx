import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonLinkProps = {
  to: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ to, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link className={`button button-${variant}`} to={to}>
      <span>{children}</span>
      {variant === "primary" ? <ArrowRight size={18} aria-hidden="true" /> : null}
    </Link>
  );
}
