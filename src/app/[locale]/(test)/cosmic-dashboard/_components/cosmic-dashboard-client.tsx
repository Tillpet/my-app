"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function CosmicDashboardClient() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cosmic-bg text-cosmic-text">
      {mounted ? (
        <main className="relative z-10 flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-semibold tracking-wide text-cosmic-cyan">
            COSMIC MISSION CONTROL
          </h1>
        </main>
      ) : null}
    </div>
  );
}
