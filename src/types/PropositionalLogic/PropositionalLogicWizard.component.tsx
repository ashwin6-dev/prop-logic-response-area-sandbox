import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef } from 'react'

import { PropositionalLogicExpectedAnswerSchema } from './PropositionalLogic.schema'
import { PropositionalLogicSymbolKeyboard } from './PropositionalLogicSymbolKeyboard.component'

type AnswerKind = 'satisfiability' | 'tautology' | 'equivalent' | 'validTruthTable'

const EMPTY_EXPECTED: PropositionalLogicExpectedAnswerSchema = {
  satisfiability: false,
  tautology: false,
  equivalent: null,
  validTruthTable: false,
}

function getSelectedKind(
  expected: PropositionalLogicExpectedAnswerSchema,
): AnswerKind {
  if (expected.satisfiability) return 'satisfiability'
  if (expected.tautology) return 'tautology'
  if (expected.equivalent !== null) return 'equivalent'
  if (expected.validTruthTable) return 'validTruthTable'
  return 'satisfiability'
}

interface PropositionalLogicWizardProps {
  expectedAnswer: PropositionalLogicExpectedAnswerSchema
  allowHandwrite: boolean
  allowPhoto: boolean
  onChange: (args: {
    expectedAnswer: PropositionalLogicExpectedAnswerSchema
    allowHandwrite: boolean
    allowPhoto: boolean
  }) => void
  setAllowSave?: React.Dispatch<React.SetStateAction<boolean>>
}

export const PropositionalLogicWizard: React.FC<
  PropositionalLogicWizardProps
> = props => {
  const {
    expectedAnswer,
    allowHandwrite,
    allowPhoto,
    onChange,
    setAllowSave,
  } = props
  const kind = getSelectedKind(expectedAnswer)

  useEffect(() => {
    setAllowSave?.(true)
  }, [setAllowSave])

  const setKind = useCallback(
    (newKind: AnswerKind) => {
      const next: PropositionalLogicExpectedAnswerSchema = {
        ...EMPTY_EXPECTED,
        ...(newKind === 'satisfiability' && { satisfiability: true }),
        ...(newKind === 'tautology' && { tautology: true }),
        ...(newKind === 'equivalent' && {
          equivalent: expectedAnswer.equivalent ?? '',
        }),
        ...(newKind === 'validTruthTable' && { validTruthTable: true }),
      }
      onChange({ expectedAnswer: next, allowHandwrite, allowPhoto })
    },
    [
      expectedAnswer.equivalent,
      allowHandwrite,
      allowPhoto,
      onChange,
    ],
  )

  const equivalentInputRef = useRef<HTMLInputElement | null>(null)
  const cursorRef = useRef({ start: 0, end: 0 })
  const pendingCursorRef = useRef<number | null>(null)

  const setEquivalentFormula = useCallback(
    (formula: string) => {
      onChange({
        expectedAnswer: { ...EMPTY_EXPECTED, equivalent: formula },
        allowHandwrite,
        allowPhoto,
      })
    },
    [allowHandwrite, allowPhoto, onChange],
  )

  const insertSymbol = useCallback(
    (symbol: string) => {
      const current = expectedAnswer.equivalent ?? ''
      const { start, end } = cursorRef.current
      const newValue =
        current.slice(0, start) + symbol + current.slice(end)
      setEquivalentFormula(newValue)
      pendingCursorRef.current = start + symbol.length
    },
    [expectedAnswer.equivalent, setEquivalentFormula],
  )

  const updateCursor = useCallback(
    (e: React.SyntheticEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      if ('selectionStart' in target && 'selectionEnd' in target) {
        cursorRef.current = {
          start: target.selectionStart ?? 0,
          end: target.selectionEnd ?? 0,
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (pendingCursorRef.current !== null && equivalentInputRef.current) {
      const pos = pendingCursorRef.current
      pendingCursorRef.current = null
      equivalentInputRef.current.focus()
      equivalentInputRef.current.setSelectionRange(pos, pos)
    }
  }, [expectedAnswer.equivalent])

  return (
    <div>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Expected answer (choose one)
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={kind}
          onChange={e => setKind(e.target.value as AnswerKind)}
        >
          <FormControlLabel
            value="satisfiability"
            control={<Radio />}
            label="Should be satisfiable"
          />
          <FormControlLabel
            value="tautology"
            control={<Radio />}
            label="Should be a tautology"
          />
          <FormControlLabel
            value="equivalent"
            control={<Radio />}
            label="Should be equivalent to (enter formula below)"
          />
          <FormControlLabel
            value="validTruthTable"
            control={<Radio />}
            label="Should be a valid truth table"
          />
        </RadioGroup>
      </FormControl>

      {kind === 'equivalent' && (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <PropositionalLogicSymbolKeyboard onInsert={insertSymbol} />
          <TextField
            fullWidth
            label="Equivalent formula"
            placeholder="e.g. p ∧ q"
            value={expectedAnswer.equivalent ?? ''}
            onChange={e => {
              updateCursor(e)
              setEquivalentFormula(e.target.value)
            }}
            onSelect={updateCursor}
            onKeyUp={updateCursor}
            onMouseUp={updateCursor}
            onBlur={updateCursor}
            onFocus={updateCursor}
            inputRef={equivalentInputRef}
            variant="outlined"
          />
        </Stack>
      )}
    </div>
  )
}

export const HMR = true
