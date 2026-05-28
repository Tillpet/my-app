// src/game/config.ts
import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { UIScene } from "./scenes/UIScene";

export function createPhaserConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: "game-container",
    transparent: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [GameScene, UIScene],
  };
}
