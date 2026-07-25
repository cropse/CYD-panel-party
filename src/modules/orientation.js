export function getDisplayGrid(config) {
  const columns = config?.gridColumns ?? 4;
  const rows = config?.gridRows ?? 3;
  return config?.vertical ? { columns: rows, rows: columns } : { columns, rows };
}

export function logicalToDisplay(col, row, logicalColumns, logicalRows, vertical, rotate180 = false) {
  if (!vertical) return { col, row };
  return rotate180
    ? { col: row, row: logicalColumns - 1 - col }
    : { col: logicalRows - 1 - row, row: col };
}

export function displayToLogical(col, row, logicalColumns, logicalRows, vertical, rotate180 = false) {
  if (!vertical) return { col, row };
  return rotate180
    ? { col: logicalColumns - 1 - row, row: col }
    : { col: row, row: logicalRows - 1 - col };
}

export function logicalToYamlGrid(col, row, logicalColumns, logicalRows, vertical, rotate180 = false) {
  return logicalToDisplay(col, row, logicalColumns, logicalRows, vertical, rotate180);
}

export function yamlGridToLogical(col, row, logicalColumns, logicalRows, vertical, rotate180 = false) {
  return displayToLogical(col, row, logicalColumns, logicalRows, vertical, rotate180);
}
