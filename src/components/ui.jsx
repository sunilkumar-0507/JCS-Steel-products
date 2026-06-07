import { Link } from "react-router-dom";

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="container-px py-14 text-center sm:py-20">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Crumbs({ items }) {
  return (
    <nav className="container-px py-4 text-sm text-muted-foreground">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? (
            <Link to={it.to} className="hover:text-primary">
              {it.label}
            </Link>
          ) : (
            <span className="text-foreground">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}

/* Layout used by policy / legal pages */
export function PolicyLayout({ title, eyebrow, updated, children }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="container-px py-14">
        <article className="prose-jcs mx-auto max-w-3xl space-y-8">
          {updated && (
            <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          )}
          {children}
        </article>
      </div>
    </>
  );
}

export function PolicySection({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
