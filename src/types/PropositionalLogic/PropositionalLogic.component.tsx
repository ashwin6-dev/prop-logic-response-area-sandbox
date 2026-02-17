import React, { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { ResponseAreaOmniInputContainer } from '@modules/shared/components/ResponseArea/ResponseAreaOmniInputContainer.component'
import { BaseResponseAreaProps } from '../base-props.type'
import { PropositionalLogicAnswerSchema } from './PropositionalLogic.schema'
import { TruthTableSection } from './TruthTableSection.component'

type PropositionalLogicProps = Omit<
  BaseResponseAreaProps,
  'handleChange' | 'answer'
> & {
  handleChange: (answer: PropositionalLogicAnswerSchema) => void
  answer: PropositionalLogicAnswerSchema | undefined
  allowDraw: boolean
  allowScan: boolean
  enableRefinement: boolean
}

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

export const PropositionalLogic: React.FC<PropositionalLogicProps> = ({
  handleChange,
  answer,
  allowDraw,
  allowScan,
  hasPreview,
  enableRefinement,
  feedback,
  typesafeErrorMessage,
  checkIsLoading,
  preResponseText,
  postResponseText,
  responsePreviewParams,
  displayMode,
}) => {
  // Normalize answer to object shape { formula, truthTable }
  const answerObject = answer ?? { formula: '', truthTable: undefined }
  const currentFormula = answerObject.formula ?? ''

  // displayAnswer tracks what we pass to handleChange, initialized from prop
  const [displayAnswer, setDisplayAnswer] = useState(currentFormula)

  // Sync displayAnswer with answer prop when it changes
  useEffect(() => {
    setDisplayAnswer(currentFormula)
  }, [currentFormula])

  const onFormulaChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFormula = event.target.value
      setDisplayAnswer(newFormula)
      const answerToSubmit = {
        formula: newFormula,
        truthTable: answerObject.truthTable,
      }
      handleChange(answerToSubmit)
    },
    [answerObject.truthTable, handleChange],
  )

  const insertSymbol = useCallback(
    (symbol: string) => {
      const newValue = displayAnswer + symbol
      setDisplayAnswer(newValue)
      const answerToSubmit = {
        formula: newValue,
        truthTable: answerObject.truthTable,
      }
      handleChange(answerToSubmit)
    },
    [displayAnswer, answerObject.truthTable, handleChange],
  )

  const onTruthTableChange = useCallback(
    (truthTable: PropositionalLogicAnswerSchema['truthTable']) => {
      if (!truthTable) return
      const answerToSubmit = {
        formula: displayAnswer,
        truthTable,
      }
      handleChange(answerToSubmit)
    },
    [displayAnswer, handleChange],
  )

  const onRemoveTruthTable = useCallback(() => {
    const answerToSubmit = {
      formula: displayAnswer,
      truthTable: undefined,
    }
    handleChange(answerToSubmit)
  }, [displayAnswer, handleChange])

  return (
    <ResponseAreaOmniInputContainer
      preResponseText={preResponseText}
      postResponseText={postResponseText}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {SYMBOLS.map(symbol => (
            <Button
              key={symbol.value}
              variant="outlined"
              size="small"
              onClick={() => insertSymbol(symbol.value)}
              title={symbol.title}
              sx={{ minWidth: '40px' }}
            >
              {symbol.label}
            </Button>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <TextField
            fullWidth
            value={displayAnswer}
            onChange={onFormulaChange}
            placeholder="e.g. p ∧ q"
            variant="outlined"
            multiline
            minRows={2}
            maxRows={6}
          />
        </Stack>
        <TruthTableSection
          formula={displayAnswer}
          truthTable={answerObject.truthTable ?? undefined}
          onTruthTableChange={onTruthTableChange}
          onRemoveTruthTable={onRemoveTruthTable}
          allowDraw={allowDraw}
          allowScan={allowScan}
          processingMode="markdown"
        />
      </Stack>
    </ResponseAreaOmniInputContainer>
  )
}

export const HMR = true
