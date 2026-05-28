// src/game/scenes/GameScene.ts
import Phaser from "phaser";
import {
  createEmptyGrid,
  spawnTile,
  moveGrid,
  canMove,
  hasWon,
  resetIdCounter,
} from "../logic/grid";
import { Direction, GridState, TileData } from "../logic/types";

const GRID_SIZE = 4;
const PADDING = 12;
const HEADER_HEIGHT = 80;
const TILE_COLORS: Record<number, number> = {
  2: 0xeee4da,
  4: 0xede0c8,
  8: 0xf2b179,
  16: 0xf59563,
  32: 0xf67c5f,
  64: 0xf65e3b,
  128: 0xedcf72,
  256: 0xedcc61,
  512: 0xedc850,
  1024: 0xedc53f,
  2048: 0xedc22e,
};
const TILE_TEXT_COLORS: Record<number, string> = {
  2: "#776e65",
  4: "#776e65",
};
const BG_COLOR = 0xbbada0;
const EMPTY_CELL_COLOR = 0xcdc1b4;

export class GameScene extends Phaser.Scene {
  private grid: GridState = createEmptyGrid();
  private score: number = 0;
  private isAnimating: boolean = false;
  private tileContainers: Map<number, Phaser.GameObjects.Container> = new Map();
  private cellSize: number = 0;
  private gridOffsetX: number = 0;
  private gridOffsetY: number = 0;
  private hasWonFlag: boolean = false;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    this.calculateLayout();
    this.drawBackground();
    this.input.keyboard?.on("keydown", this.handleKey, this);
    this.scale.on("resize", this.handleResize, this);
    this.events.on("restart", this.restartGame, this);

    this.startNewGame();
  }

  private calculateLayout(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const availableSize = Math.min(width, height - HEADER_HEIGHT) - PADDING * 2;
    this.cellSize = Math.floor((availableSize - PADDING * (GRID_SIZE + 1)) / GRID_SIZE);
    const gridSize = this.cellSize * GRID_SIZE + PADDING * (GRID_SIZE + 1);
    this.gridOffsetX = (width - gridSize) / 2;
    this.gridOffsetY = HEADER_HEIGHT + (height - HEADER_HEIGHT - gridSize) / 2;
  }

  private drawBackground(): void {
    const gridSize = this.cellSize * GRID_SIZE + PADDING * (GRID_SIZE + 1);
    const bg = this.add.rectangle(
      this.gridOffsetX + gridSize / 2,
      this.gridOffsetY + gridSize / 2,
      gridSize,
      gridSize,
      BG_COLOR,
      1
    );
    bg.setDepth(0);

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = this.gridOffsetX + PADDING + col * (this.cellSize + PADDING) + this.cellSize / 2;
        const y = this.gridOffsetY + PADDING + row * (this.cellSize + PADDING) + this.cellSize / 2;
        const cell = this.add.rectangle(x, y, this.cellSize, this.cellSize, EMPTY_CELL_COLOR, 1);
        cell.setDepth(1);
      }
    }
  }

  private getCellPosition(row: number, col: number): { x: number; y: number } {
    return {
      x: this.gridOffsetX + PADDING + col * (this.cellSize + PADDING) + this.cellSize / 2,
      y: this.gridOffsetY + PADDING + row * (this.cellSize + PADDING) + this.cellSize / 2,
    };
  }

  private getTileColor(value: number): number {
    return TILE_COLORS[value] ?? 0x3c3a32;
  }

  private getTileTextColor(value: number): string {
    return TILE_TEXT_COLORS[value] ?? "#f9f6f2";
  }

  private createTileContainer(tile: TileData): Phaser.GameObjects.Container {
    const pos = this.getCellPosition(tile.row, tile.col);
    const container = this.add.container(pos.x, pos.y);
    container.setDepth(2);

    const bg = this.add.rectangle(0, 0, this.cellSize, this.cellSize, this.getTileColor(tile.value));
    bg.setDepth(0);

    const fontSize = tile.value >= 1024 ? this.cellSize * 0.25 : this.cellSize * 0.35;
    const text = this.add.text(0, 0, String(tile.value), {
      fontSize: `${fontSize}px`,
      fontFamily: "Arial, sans-serif",
      fontStyle: "bold",
      color: this.getTileTextColor(tile.value),
    });
    text.setOrigin(0.5, 0.5);
    text.setDepth(1);

    container.add([bg, text]);
    this.tileContainers.set(tile.id, container);
    return container;
  }

  private startNewGame(): void {
    resetIdCounter();
    this.grid = createEmptyGrid();
    this.grid = spawnTile(this.grid);
    this.grid = spawnTile(this.grid);
    this.score = 0;
    this.hasWonFlag = false;
    this.isAnimating = false;

    this.renderAllTiles();
    this.updateUIScore();
  }

  private renderAllTiles(): void {
    this.tileContainers.forEach((container) => container.destroy());
    this.tileContainers.clear();

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tile = this.grid[row][col];
        if (tile) {
          this.createTileContainer(tile);
        }
      }
    }
  }

  private handleKey(event: KeyboardEvent): void {
    if (this.isAnimating) return;

    let direction: Direction | null = null;
    switch (event.key) {
      case "ArrowUp":
        direction = Direction.Up;
        break;
      case "ArrowDown":
        direction = Direction.Down;
        break;
      case "ArrowLeft":
        direction = Direction.Left;
        break;
      case "ArrowRight":
        direction = Direction.Right;
        break;
    }

    if (direction === null) return;
    event.preventDefault();

    this.performMove(direction);
  }

  private performMove(direction: Direction): void {
    const result = moveGrid(this.grid, direction);
    if (!result.moved) return;

    this.isAnimating = true;
    this.score += result.score;

    const oldPositions = new Map<number, { x: number; y: number }>();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tile = this.grid[row][col];
        if (tile) {
          const pos = this.getCellPosition(row, col);
          oldPositions.set(tile.id, pos);
        }
      }
    }

    const newGrid = result.grid;
    const mergedIds = new Set(result.mergedTiles.map((t) => t.id));

    // Animate existing tiles to new positions
    this.tileContainers.forEach((container, oldId) => {
      // Check if tile still exists in new grid (not consumed by merge)
      let found = false;
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const newTile = newGrid[row][col];
          if (newTile && newTile.id === oldId) {
            const dest = this.getCellPosition(row, col);
            this.tweens.add({
              targets: container,
              x: dest.x,
              y: dest.y,
              duration: 150,
              ease: "Power1",
            });
            found = true;
          }
        }
      }

      // Tile consumed by merge - slide to merge destination
      if (!found) {
        const oldTile = this.grid.flat().find((t) => t && t.id === oldId);
        if (oldTile) {
          let targetRow = oldTile.row;
          let targetCol = oldTile.col;
          switch (direction) {
            case Direction.Left:
              targetCol = 0;
              break;
            case Direction.Right:
              targetCol = GRID_SIZE - 1;
              break;
            case Direction.Up:
              targetRow = 0;
              break;
            case Direction.Down:
              targetRow = GRID_SIZE - 1;
              break;
          }
          for (const mt of result.mergedTiles) {
            const isInLine =
              direction === Direction.Left || direction === Direction.Right
                ? mt.row === oldTile.row
                : mt.col === oldTile.col;
            if (isInLine) {
              targetRow = mt.row;
              targetCol = mt.col;
              break;
            }
          }
          const dest = this.getCellPosition(targetRow, targetCol);
          this.tweens.add({
            targets: container,
            x: dest.x,
            y: dest.y,
            duration: 150,
            ease: "Power1",
          });
        }
      }
    });

    // After slide completes
    this.time.delayedCall(160, () => {
      this.tileContainers.forEach((container) => container.destroy());
      this.tileContainers.clear();

      this.grid = newGrid;
      this.grid = spawnTile(this.grid);

      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const tile = this.grid[row][col];
          if (tile) {
            const container = this.createTileContainer(tile);

            // Spawn animation for newly spawned tile
            const wasInOldGrid = oldPositions.has(tile.id);
            if (!wasInOldGrid && !mergedIds.has(tile.id)) {
              container.setScale(0);
              this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 120,
                ease: "Back.easeOut",
              });
            }

            // Merge pulse
            if (mergedIds.has(tile.id)) {
              this.tweens.add({
                targets: container,
                scaleX: 1.15,
                scaleY: 1.15,
                duration: 50,
                ease: "Power1",
                yoyo: true,
              });
            }
          }
        }
      }

      this.updateUIScore();

      if (!this.hasWonFlag && hasWon(this.grid)) {
        this.hasWonFlag = true;
        this.events.emit("gameWon");
      } else if (!canMove(this.grid)) {
        this.events.emit("gameOver");
      }

      this.isAnimating = false;
    });
  }

  private updateUIScore(): void {
    const uiScene = this.scene.get("UIScene");
    if (uiScene && uiScene.scene.isActive()) {
      uiScene.events.emit("scoreUpdate", this.score);
    }
  }

  private handleResize(): void {
    this.calculateLayout();
    this.children.removeAll();
    this.tileContainers.clear();
    this.drawBackground();
    this.renderAllTiles();
  }

  private restartGame(): void {
    this.children.removeAll();
    this.tileContainers.clear();
    this.startNewGame();
  }
}
