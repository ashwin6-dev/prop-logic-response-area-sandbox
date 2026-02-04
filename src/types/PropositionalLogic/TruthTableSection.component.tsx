import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import {
  TruthTableSchema,
  parseVariablesFromFormula,
  buildEmptyTruthTableCells,
} from './PropositionalLogic.schema'

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
    const variables = parseVariablesFromFormula(formula)
    if (variables.length === 0) return
    const cells = buildEmptyTruthTableCells(variables)
    onTruthTableChange({ variables, cells })
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

  const variables = truthTable?.variables ?? []
  const cells = truthTable?.cells ?? []
  const canAddTable = !truthTable && formula.trim() !== ''

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
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {variables.map(v => (
                    <TableCell key={v} align="center" sx={{ fontWeight: 600 }}>
                      {v}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Result
                  </TableCell>
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
