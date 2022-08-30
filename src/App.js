import React, { useState, useEffect } from 'react';
import './App.css';

function App(props) {
  const [gridData, setGridData] = useState(() => {
    return initializeGrid(props.row, props.col);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGridData(gridData => updateGrid(gridData));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="container">
        {gridData.reduce(function (acc, itm) {
          let item = itm.map((cell, index) => (
            <div
              key={acc.length + index}
              className={cell.state ? "state-on" : "state-off"}
            >
            </div>
          ));
          return acc.concat(item);
        }, [])}
      </div>
    </>
  );
}

export function initializeGrid(row, col) {
  let cell = { state: false, count: 0 }
  let grid = [];
  for (let y = 0; y < row; y++) {
    grid.push([]);
    for (let x = 0; x < col; x++) {
      grid[y].push(cell);
    }
  }
  return updateGridWithCellBatch(
    grid,
    [[1, 2], [2, 2], [3, 2], [2, 6], [2, 7], [2, 8]],
    { ...cell, state: true });
}

export function updateGrid(grid) {
  let newGrid = updateGridWithNeighboursCount(grid);
  return newGrid.map((row) => {
    return row.map((cell) => {
      return updateCell(cell);
    });
  });
}

export function updateCell(cell) {
  if (cell.state) {
    if (cell.count < 2 || cell.count > 3) {
      let newCell = { ...cell, state: false };
      return newCell;
    }
  } else {
    if (cell.count === 3) {
      let newCell = { ...cell, state: true };
      return newCell;
    }
  }
  return cell;
}

export function updateGridWithCell(grid, yIndex, xIndex, cell) {
  return grid.map((row, yidx) => {
    if (yidx !== yIndex) {
      return row;
    } else {
      return row.map((currentCell, xidx) => {
        if (xIndex !== xidx) {
          return currentCell;
        } else {
          return cell;
        }
      });
    }
  });
}

export function updateGridWithCellBatch(grid, indexTuples, cell) {
  return indexTuples.reduce((currentGrid, index) => {
    return updateGridWithCell(currentGrid, index[0], index[1], cell);
  }, grid);
}

export function updateGridWithNeighboursCount(grid) {
  return grid.map((row, yIndex) => {
    return row.map((cell, xIndex) => {
      return { ...cell, count: countNeighbours(yIndex, xIndex, grid) };
    })
  });
}

export function countNeighbours(yIndex, xIndex, grid) {
  let neighbours = [[1, -1], [1, 0], [1, 1], [0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1]];
  return neighbours.map(([y, x]) => testCell(yIndex + y, xIndex + x, grid))
    .reduce((acc, item) => acc + item, 0);
}

export function testCell(yIndex, xIndex, grid) {
  let row = grid.length;
  let col = grid[0].length;
  if (yIndex < 0 || yIndex > row - 1 || xIndex < 0 || xIndex > col - 1) {
    return 0;
  }
  if (grid[yIndex][xIndex].state) {
    return 1;
  } else {
    return 0;
  }
}

export default App;