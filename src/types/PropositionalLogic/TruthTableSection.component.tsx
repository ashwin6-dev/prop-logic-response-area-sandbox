import React, { useCallback, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { TruthTableSchema } from './PropositionalLogic.schema'
import { PROPOSITIONAL_LOGIC_SYMBOLS } from './symbols'

const TRUE_FALSE_OPTIONS = [
  { value: '', label: '—' },
  { value: '⊤', label: '⊤ (true)' },
  { value: '⊥', label: '⊥ (false)' },
]

export type TruthTableSectionProps = {
  formula: string
  truthTable: TruthTableSchema | undefined
  onTruthTableChange: (truthTable: TruthTableSchema) => void
  onRemoveTruthTable?: () => void
  allowDraw: boolean
  allowScan: boolean
  processingMode?: string
}

export const TruthTableSection: React.FC<TruthTableSectionProps> = ({
  formula,
  truthTable,
  onTruthTableChange,
  onRemoveTruthTable,
}) => {

  const handleAddTruthTable = useCallback(() => {
    // Start with 1x1 table with formula as column name
    const initialColumnName = formula || 'Expression'
    const cells = [['']] // 1 row, 1 column
    onTruthTableChange({ variables: [initialColumnName], cells })
  }, [formula, onTruthTableChange])

  const handleCellChange = useCallback(
    (rowIndex: number, colIndex: number, value: string) => {
      if (!truthTable) return
      const { cells } = truthTable
      const next = cells.map((row, r) =>
        r === rowIndex
          ? row.map((val, c) => (c === colIndex ? value : val))
          : row,
      )
      onTruthTableChange({ ...truthTable, cells: next })
    },
    [truthTable, onTruthTableChange],
  )

  const handleColumnNameChange = useCallback(
    (colIndex: number, newName: string) => {
      if (!truthTable) return
      const { variables } = truthTable
      const next = variables.map((v, i) => (i === colIndex ? newName : v))
      onTruthTableChange({ ...truthTable, variables: next })
    },
    [truthTable, onTruthTableChange],
  )

  const handleAddRow = useCallback(() => {
    if (!truthTable) return
    const { cells, variables } = truthTable
    const numCols = variables.length
    const newRow = Array(numCols).fill('')
    const nextCells = [...cells, newRow]
    onTruthTableChange({ ...truthTable, cells: nextCells })
  }, [truthTable, onTruthTableChange])

  const handleRemoveRow = useCallback(
    (rowIndex: number) => {
      if (!truthTable) return
      const { cells } = truthTable
      const nextCells = cells.filter((_, idx) => idx !== rowIndex)
      onTruthTableChange({ ...truthTable, cells: nextCells })
    },
    [truthTable, onTruthTableChange],
  )

  const handleAddColumn = useCallback(() => {
    if (!truthTable) return
    const { cells, variables } = truthTable
    // Add empty column name before the last column (which is the formula)
    // Ensure the last column is always the formula
    const formulaColumn = formula || 'Expression'
    const nextVariables = [...variables.slice(0, -1), '', formulaColumn]
    // Add empty cell to each row before the last column
    const nextCells = cells.map(row => [...row.slice(0, -1), '', row[row.length - 1] || ''])
    onTruthTableChange({ variables: nextVariables, cells: nextCells })
  }, [truthTable, formula, onTruthTableChange])

  const handleRemoveColumn = useCallback(
    (colIndex: number) => {
      if (!truthTable) return
      const { variables, cells } = truthTable
      // Don't remove the last column (formula) and don't allow empty variable list
      if (variables.length <= 1 || colIndex === variables.length - 1) return

      const nextVariables = variables.filter((_, idx) => idx !== colIndex)
      const nextCells = cells.map(row =>
        row.filter((_, idx) => idx !== colIndex),
      )
      onTruthTableChange({ variables: nextVariables, cells: nextCells })
    },
    [truthTable, onTruthTableChange],
  )

  const columnNames = truthTable?.variables ?? []
  const cells = truthTable?.cells ?? []
  const canAddTable = !truthTable
  
  // Track which column input has focus for symbol insertion
  const [focusedColumnIndex, setFocusedColumnIndex] = useState<number | null>(null)
  const columnInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const handleInsertSymbol = useCallback(
    (symbol: string, colIndex: number) => {
      if (!truthTable) return
      const { variables } = truthTable
      const currentName = variables[colIndex] || ''
      const newName = currentName + symbol
      handleColumnNameChange(colIndex, newName)
      
      // Focus back on the input after inserting symbol
      setTimeout(() => {
        const input = columnInputRefs.current[colIndex]
        if (input) {
          input.focus()
          // Move cursor to end
          const len = input.value.length
          input.setSelectionRange(len, len)
        }
      }, 0)
    },
    [truthTable, handleColumnNameChange],
  )

  return (
    <Box sx={{ mt: 2 }}>
      {!truthTable ? (
        <Button
          variant="outlined"
          onClick={handleAddTruthTable}
          disabled={!canAddTable}
          size="small">
          Add truth table
        </Button>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ flex: 1 }}>
              Truth table for formula
            </Typography>
            {onRemoveTruthTable && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={onRemoveTruthTable}>
                Remove truth table
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              size="small">
              Add Row
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddColumn}
              size="small">
              Add Column
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columnNames.map((name, idx) => {
                    const isLastColumn = idx === columnNames.length - 1
                    const displayName = isLastColumn ? (formula || 'Expression') : name
                    return (
                      <TableCell key={idx} align="center" sx={{ fontWeight: 600 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <TextField
                            inputRef={(el: HTMLInputElement | null) => {
                              if (!isLastColumn) {
                                columnInputRefs.current[idx] = el
                              }
                            }}
                            value={displayName}
                            onChange={isLastColumn ? undefined : (e => handleColumnNameChange(idx, e.target.value))}
                            onFocus={isLastColumn ? undefined : () => setFocusedColumnIndex(idx)}
                            onBlur={isLastColumn ? undefined : () => setFocusedColumnIndex(null)}
                            placeholder={isLastColumn ? (formula || 'Expression') : 'Name column here'}
                            InputProps={{
                              readOnly: isLastColumn,
                            }}
                            size="small"
                            inputProps={{
                              style: { textAlign: 'center', fontWeight: 600 },
                            }}
                            sx={{
                              '& .MuiInputBase-root': {
                                fontSize: '0.875rem',
                              },
                              '& .MuiInputBase-input': {
                                padding: '4px 8px',
                              },
                              ...(isLastColumn && {
                                '& .MuiInputBase-input': {
                                  cursor: 'default',
                                },
                              }),
                            }}
                          />
                          {focusedColumnIndex === idx && !isLastColumn && (
                            <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                              {PROPOSITIONAL_LOGIC_SYMBOLS.map(sym => (
                                <Button
                                  key={sym.value}
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleInsertSymbol(sym.value, idx)}
                                  title={sym.title}
                                  sx={{ minWidth: 32, height: 28, fontSize: '0.75rem', padding: '2px 4px' }}
                                >
                                  {sym.label}
                                </Button>
                              ))}
                            </Stack>
                          )}
                          {!isLastColumn && (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                aria-label="Remove column"
                                onClick={() => handleRemoveColumn(idx)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    )
                  })}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {cells.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cellValue, colIndex) => (
                      <TableCell
                        key={colIndex}
                        align="center"
                        sx={{
                          minWidth: 72,
                          padding: 0.5,
                          verticalAlign: 'middle',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}>
                        <Select
                          value={cellValue ?? ''}
                          onChange={e =>
                            handleCellChange(
                              rowIndex,
                              colIndex,
                              e.target.value as string,
                            )
                          }
                          size="small"
                          displayEmpty
                          sx={{
                            minWidth: 56,
                            fontSize: '0.875rem',
                            '& .MuiSelect-select': { py: 0.75 },
                          }}>
                          {TRUE_FALSE_OPTIONS.map(opt => (
                            <MenuItem key={opt.value || 'empty'} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    ))}
                    <TableCell
                      align="center"
                      sx={{
                        width: 48,
                        padding: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}>
                      <IconButton
                        size="small"
                        aria-label="Remove row"
                        onClick={() => handleRemoveRow(rowIndex)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  )
}
