import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect } from 'react'

import { PropositionalLogicExpectedAnswerSchema } from './PropositionalLogic.schema'

const SYMBOLS = [
  { label: '¬', value: '¬', title: 'Not' },
  { label: '∧', value: '∧', title: 'And' },
  { label: '∨', value: '∨', title: 'Or' },
  { label: '→', value: '→', title: 'Implies' },
  { label: '↔', value: '↔', title: 'If and only if' },
  { label: '⊥', value: '⊥', title: 'False' },
  { label: '⊤', value: '⊤', title: 'True' },
  { label: '(', value: '(', title: 'Left parenthesis' },
  { label: ')', value: ')', title: 'Right parenthesis' },
]

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
      setEquivalentFormula(current + symbol)
    },
    [expectedAnswer.equivalent, setEquivalentFormula],
  )

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
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {SYMBOLS.map(sym => (
              <Button
                key={sym.value}
                variant="outlined"
                size="small"
                onClick={() => insertSymbol(sym.value)}
                title={sym.title}
                sx={{ minWidth: '40px' }}
              >
                {sym.label}
              </Button>
            ))}
          </Stack>
          <TextField
            fullWidth
            label="Equivalent formula"
            placeholder="e.g. p ∧ q"
            value={expectedAnswer.equivalent ?? ''}
            onChange={e => setEquivalentFormula(e.target.value)}
            variant="outlined"
          />
        </Stack>
      )}
    </div>
  )
}

export const HMR = true
