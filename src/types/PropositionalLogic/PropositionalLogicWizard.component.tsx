import { OmniInput } from '@components/OmniInput/OmniInput.component'
import { OmniOutput } from '@components/OmniInput/utils'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PropositionalLogicAnswerSchema } from './PropositionalLogic.schema'
import { TruthTableSection } from './TruthTableSection.component'

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

interface PropositionalLogicWizardProps {
  answer: PropositionalLogicAnswerSchema
  allowHandwrite: boolean
  allowPhoto: boolean
  onChange: (args: {
    answer: PropositionalLogicAnswerSchema
    allowHandwrite: boolean
    allowPhoto: boolean
  }) => void
  setAllowSave?: React.Dispatch<React.SetStateAction<boolean>>
}

export const PropositionalLogicWizard: React.FC<
  PropositionalLogicWizardProps
> = props => {
  const { answer, allowHandwrite, allowPhoto, onChange, setAllowSave } = props
  const formula = answer.formula ?? ''
  const truthTable = answer.truthTable ?? undefined

  const [formulaKey, setFormulaKey] = useState(0)
  const pendingFromSymbolRef = useRef<string | null>(null)

  useEffect(() => {
    setAllowSave?.(true)
  }, [setAllowSave])

  useEffect(() => {
    if (formulaKey > 0) pendingFromSymbolRef.current = null
  }, [formulaKey])

  const updateAnswer = useCallback(
    (updates: Partial<PropositionalLogicAnswerSchema>) => {
      onChange({
        answer: { ...answer, ...updates },
        allowHandwrite,
        allowPhoto,
      })
    },
    [answer, allowHandwrite, allowPhoto, onChange],
  )

  const onTruthTableChange = useCallback(
    (newTruthTable: PropositionalLogicAnswerSchema['truthTable']) => {
      if (!newTruthTable) return
      updateAnswer({ truthTable: newTruthTable })
    },
    [updateAnswer],
  )

  const onRemoveTruthTable = useCallback(() => {
    updateAnswer({ truthTable: undefined })
  }, [updateAnswer])

  const insertSymbol = useCallback(
    (symbol: string) => {
      const newValue = formula + symbol
      updateAnswer({ formula: newValue })
      pendingFromSymbolRef.current = newValue
      setFormulaKey(k => k + 1)
    },
    [formula, updateAnswer],
  )

  const displayFormula =
    pendingFromSymbolRef.current !== null ? pendingFromSymbolRef.current : formula

  return (
    <div>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
        Expected formula
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
        {SYMBOLS.map(sym => (
          <Button
            key={sym.value}
            variant="outlined"
            size="small"
            onClick={() => insertSymbol(sym.value)}
            title={sym.title}
            sx={{ minWidth: 40 }}
          >
            {sym.label}
          </Button>
        ))}
      </Stack>
      <OmniInput
        key={formulaKey}
        defaultValue={displayFormula}
        onChange={(omniOutput: OmniOutput) => {
          updateAnswer({ formula: omniOutput.raw ?? '' })
        }}
        placeholder="e.g. p ∧ q"
        processingMode="markdown"
      />
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 0.5 }}>
        Expected truth table (optional)
      </Typography>
      <TruthTableSection
        formula={formula}
        truthTable={truthTable}
        onTruthTableChange={onTruthTableChange}
        onRemoveTruthTable={onRemoveTruthTable}
        allowDraw={false}
        allowScan={false}
        processingMode="markdown"
      />
    </div>
  )
}

export const HMR = true // ensure HMR triggers on parent imports