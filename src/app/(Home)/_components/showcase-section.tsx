interface ShowcaseSectionProps {
  heading: string;
  description: string;
  imageAlt: string;
}

export function ShowcaseSection({
  heading,
  description,
  imageAlt,
}: ShowcaseSectionProps) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-xl border bg-card shadow-2xl">
            <div className="flex h-10 items-center gap-2 border-b bg-muted/50 px-4">
              <div className="h-3 w-3 rounded-full bg-red-400/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <div className="h-3 w-3 rounded-full bg-green-400/80" />
              <span className="ml-3 text-xs text-muted-foreground">
                AI Chat
              </span>
            </div>
            <div
              className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8"
              role="img"
              aria-label={imageAlt}
            >
              <div className="flex w-full max-w-lg flex-col gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    How can I optimize my React component for better
                    performance?
                  </p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm">
                    Great question! Here are three key strategies you can apply
                    immediately...
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      useMemo
                    </span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      React.memo
                    </span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      Code Splitting
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
