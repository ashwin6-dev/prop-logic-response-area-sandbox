import React, { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { OmniInput } from '@components/OmniInput/OmniInput.component'
import { InputMode } from '@components/OmniInput/OmniInput.types'
import { OmniOutput } from '@components/OmniInput/utils'
import { ProcessingMode } from '@components/ResponseArea/useMathpix'
import {
  TruthTableSchema,
  parseVariablesFromFormula,
  buildEmptyTruthTableCells,
} from './PropositionalLogic.schema'

export type TruthTableSectionProps = {
  formula: string
  truthTable: TruthTableSchema | undefined
  onTruthTableChange: (truthTable: TruthTableSchema) => void
  allowDraw: boolean
  allowScan: boolean
  processingMode?: ProcessingMode
}

export const TruthTableSection: React.FC<TruthTableSectionProps> = ({
  formula,
  truthTable,
  onTruthTableChange,
  allowDraw,
  allowScan,
  processingMode = 'markdown',
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    row: number
    col: number
  } | null>(null)

  const handleAddTruthTable = useCallback(() => {
    const parsed = parseVariablesFromFormula(formula)
    const variables =
      parsed.length > 0 ? parsed : ['P', 'Q']
    const cells = buildEmptyTruthTableCells(variables)
    onTruthTableChange({ variables, cells })
  }, [formula, onTruthTableChange])

  const handleCellEditorChange = useCallback(
    (omniOutput: OmniOutput, _inputMode: InputMode) => {
      if (!selectedCell || !truthTable) return
      const { cells } = truthTable
      const next = cells.map((row, r) =>
        r === selectedCell.row
          ? row.map((val, c) =>
              c === selectedCell.col ? (omniOutput.raw ?? '') : val,
            )
          : row,
      )
      onTruthTableChange({ ...truthTable, cells: next })
    },
    [selectedCell, truthTable, onTruthTableChange],
  )

  const variables = truthTable?.variables ?? []
  const cells = truthTable?.cells ?? []
  const canAddTable = !truthTable

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
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Truth table for formula
          </Typography>
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
                        onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                        sx={{
                          cursor: 'pointer',
                          minWidth: 56,
                          minHeight: 40,
                          backgroundColor:
                            selectedCell?.row === rowIndex &&
                            selectedCell?.col === colIndex
                              ? 'action.selected'
                              : undefined,
                          border: '1px solid',
                          borderColor: 'divider',
                          verticalAlign: 'middle',
                        }}>
                        {cellValue || '·'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedCell && (
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                minHeight: 140,
              }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                Edit cell (row {selectedCell.row + 1}, col{' '}
                {selectedCell.col < variables.length
                  ? variables[selectedCell.col]
                  : 'Result'}
                ): type or draw below
              </Typography>
              <OmniInput
                key={`${selectedCell.row}-${selectedCell.col}`}
                defaultValue={cells[selectedCell.row]?.[selectedCell.col] ?? ''}
                onChange={handleCellEditorChange}
                processingMode={processingMode}
                allowDraw={allowDraw}
                allowScan={false}
                showPreview={false}
                enableRefinement={false}
                requireRefinement={false}
                showAssessment={false}
                showSubmitButton={false}
                placeholder="T / F / 1 / 0 or draw"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
