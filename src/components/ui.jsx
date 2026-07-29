import { Link } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

/** Inline spinner for anything waiting on the API. */
export function Loader({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-muted-foreground ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

/** Shown when an API call fails — always offers a way to retry. */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-6 py-14 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        {message || "Something went wrong."}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-6">
          Try again
        </button>
      )}
    </div>
  );
}

/** Skeleton grid used while product lists load. */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

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
        <article className="prose-dp mx-auto max-w-3xl space-y-8">
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
