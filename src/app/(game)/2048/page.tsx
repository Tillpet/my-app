// src/app/(game)/2048/page.tsx
"use client";

import { useEffect, useRef } from "react";

export default function Game2048Page() {
  const gameRef = useRef<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initGame = async () => {
      const { createPhaserGame } = await import("@/game/phaserGame");
      gameRef.current = createPhaserGame();
    };

    initGame();

    return () => {
      if (gameRef.current) {
        const game = gameRef.current as { destroy: (removeCanvas: boolean) => void };
        game.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div ref={containerRef} id="game-container" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
