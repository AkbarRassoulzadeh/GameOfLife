import { render, screen } from '@testing-library/react';
import {
  App, testCell,
  initializeGrid, updateGridWithCell,
  countNeighbours, updateGridWithCellBatch, updateCell,
} from './App';

let grid = initializeGrid(5, 10);
let cellOn = { state: true, count: 0 };
let cellOff = { state: false, count: 0 };

// ------------testCell------------------ 

test("testCell on undefind rows or columns", () => {
  expect(testCell(-1, 0, grid)).toBe(0);
  expect(testCell(-1, 11, grid)).toBe(0);
  expect(testCell(-1, -1, grid)).toBe(0);
  expect(testCell(0, -1, grid)).toBe(0);
  expect(testCell(15, 20, grid)).toBe(0);
});

test("testCell on inner part of grid", () => {
  expect(testCell(0, 0, updateGridWithCell(grid, 0, 0, cellOn))).toBe(1);
  expect(testCell(3, 3, updateGridWithCell(grid, 3, 3, cellOn))).toBe(1);
  expect(testCell(1, 3, updateGridWithCell(grid, 1, 3, cellOn))).toBe(1);
});

// -------------countNeighbours--------------
test("countNeighbours on edges of the grid", () => {
  let testGrid = updateGridWithCellBatch(grid, [[0, 1], [1, 0], [1, 1]], cellOn);
  expect(countNeighbours(0, 0, testGrid)).toBe(3);
});

test("countNeighbours on the inner part of the grid", () => {
  let testGrid = updateGridWithCellBatch(
    grid,
    [[1, 1], [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2], [3, 3]],
    cellOn);
  expect(countNeighbours(2, 2, testGrid)).toBe(8);
});

// -------------updateCell-------------------
test("updateCell", () => {
  expect(updateCell({ state: true, count: 1 })).toStrictEqual({ state: false, count: 1 });
  expect(updateCell({ state: true, count: 4 })).toStrictEqual({ state: false, count: 4 });
  expect(updateCell({ state: true, count: 2 })).toStrictEqual({ state: true, count: 2 });
  expect(updateCell({ state: true, count: 3 })).toStrictEqual({ state: true, count: 3 });
  expect(updateCell({ state: false, count: 3 })).toStrictEqual({ state: true, count: 3 });
  expect(updateCell({ state: false, count: 1 })).toStrictEqual({ state: false, count: 1 });
  expect(updateCell({ state: false, count: 4 })).toStrictEqual({ state: false, count: 4 });
});