// src/game/logic/grid.ts
import { Direction, GridState, MoveResult, TileData } from "./types";

const GRID_SIZE = 4;
let nextId = 1;

export function resetIdCounter(): void {
  nextId = 1;
}

export function createEmptyGrid(): GridState {
  return Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );
}

export function spawnTile(grid: GridState): GridState {
  const emptyCells: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }
  if (emptyCells.length === 0) return grid;

  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map((row) => [...row]);
  const value = Math.random() < 0.9 ? 2 : 4;
  newGrid[cell.row][cell.col] = {
    id: nextId++,
    value,
    row: cell.row,
    col: cell.col,
  };
  return newGrid;
}

function rotateGrid90CW(grid: GridState): GridState {
  const size = grid.length;
  const rotated: GridState = createEmptyGrid();
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      rotated[col][size - 1 - row] = grid[row][col];
      if (rotated[col][size - 1 - row]) {
        rotated[col][size - 1 - row] = {
          ...rotated[col][size - 1 - row]!,
          row: col,
          col: size - 1 - row,
        };
      }
    }
  }
  return rotated;
}

function rotateGrid90CCW(grid: GridState): GridState {
  const size = grid.length;
  const rotated: GridState = createEmptyGrid();
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      rotated[size - 1 - col][row] = grid[row][col];
      if (rotated[size - 1 - col][row]) {
        rotated[size - 1 - col][row] = {
          ...rotated[size - 1 - col][row]!,
          row: size - 1 - col,
          col: row,
        };
      }
    }
  }
  return rotated;
}

function slideLeft(grid: GridState): MoveResult {
  let score = 0;
  let moved = false;
  const mergedTiles: TileData[] = [];
  const newGrid = createEmptyGrid();

  for (let row = 0; row < GRID_SIZE; row++) {
    const tiles: TileData[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        tiles.push(grid[row][col]!);
      }
    }

    const merged: TileData[] = [];
    let i = 0;
    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
        const newValue = tiles[i].value * 2;
        score += newValue;
        const mergedTile: TileData = {
          id: nextId++,
          value: newValue,
          row: row,
          col: merged.length,
        };
        merged.push(mergedTile);
        mergedTiles.push(mergedTile);
        i += 2;
      } else {
        merged.push({
          ...tiles[i],
          row: row,
          col: merged.length,
        });
        i++;
      }
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      if (col < merged.length) {
        newGrid[row][col] = { ...merged[col], row, col };
      }
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      const oldTile = grid[row][col];
      const newTile = newGrid[row][col];
      if (
        (oldTile === null && newTile !== null) ||
        (oldTile !== null && newTile !== null && oldTile.id !== newTile.id)
      ) {
        moved = true;
      }
    }
  }

  return { grid: newGrid, score, moved, mergedTiles };
}

export function moveGrid(grid: GridState, direction: Direction): MoveResult {
  let rotated = grid;

  switch (direction) {
    case Direction.Up:
      rotated = rotateGrid90CCW(rotated);
      break;
    case Direction.Down:
      rotated = rotateGrid90CW(rotated);
      break;
    case Direction.Right:
      rotated = rotateGrid90CW(rotated);
      rotated = rotateGrid90CW(rotated);
      break;
    case Direction.Left:
      break;
  }

  const result = slideLeft(rotated);

  let finalGrid = result.grid;
  switch (direction) {
    case Direction.Up:
      finalGrid = rotateGrid90CW(finalGrid);
      break;
    case Direction.Down:
      finalGrid = rotateGrid90CCW(finalGrid);
      break;
    case Direction.Right:
      finalGrid = rotateGrid90CCW(finalGrid);
      finalGrid = rotateGrid90CCW(finalGrid);
      break;
    case Direction.Left:
      break;
  }

  // Fix row/col positions after rotation
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (finalGrid[row][col] !== null) {
        finalGrid[row][col] = {
          ...finalGrid[row][col]!,
          row,
          col,
        };
      }
    }
  }

  return {
    grid: finalGrid,
    score: result.score,
    moved: result.moved,
    mergedTiles: result.mergedTiles,
  };
}

export function canMove(grid: GridState): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) return true;
      const value = grid[row][col]!.value;
      if (col + 1 < GRID_SIZE && grid[row][col + 1]?.value === value)
        return true;
      if (row + 1 < GRID_SIZE && grid[row + 1][col]?.value === value)
        return true;
    }
  }
  return false;
}

export function hasWon(grid: GridState): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col]?.value === 2048) return true;
    }
  }
  return false;
}
