// src/game/logic/types.ts
export enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}

export interface TileData {
  id: number;
  value: number;
  row: number;
  col: number;
}

export type GridState = (TileData | null)[][];

export interface MoveResult {
  grid: GridState;
  score: number;
  moved: boolean;
  mergedTiles: TileData[];
}
