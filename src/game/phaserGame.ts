// src/game/phaserGame.ts
import Phaser from "phaser";
import { createPhaserConfig } from "./config";

export function createPhaserGame(): Phaser.Game {
  const config = createPhaserConfig();
  return new Phaser.Game(config);
}
