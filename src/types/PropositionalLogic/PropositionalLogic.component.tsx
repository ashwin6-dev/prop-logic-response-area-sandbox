import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import {
  OmniInputResponsArea,
  OmniInputResponsAreaProps,
} from '@components/OmniInput/OmniInputResponseArea.component'
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
  handleSubmit,
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

  // Remount OmniInput when symbol button is clicked so it shows updated value (it only reads defaultValue on mount)
  const [formulaKey, setFormulaKey] = useState(0)
  const pendingFromSymbolRef = useRef<string | null>(null)

  useEffect(() => {
    if (formulaKey > 0) pendingFromSymbolRef.current = null
  }, [formulaKey])

  const onFormulaChange = useCallback<OmniInputResponsAreaProps['handleChange']>(
    (newFormula) => {
      handleChange({
        formula: newFormula,
        truthTable: answerObject.truthTable,
      })
    },
    [answerObject.truthTable, handleChange],
  )

  const insertSymbol = useCallback(
    (symbol: string) => {
      const newValue = currentFormula + symbol
      handleChange({
        formula: newValue,
        truthTable: answerObject.truthTable,
      })
      pendingFromSymbolRef.current = newValue
      setFormulaKey(k => k + 1)
    },
    [currentFormula, answerObject.truthTable, handleChange],
  )

  const onTruthTableChange = useCallback(
    (truthTable: PropositionalLogicAnswerSchema['truthTable']) => {
      if (!truthTable) return
      handleChange({
        formula: currentFormula,
        truthTable,
      })
    },
    [currentFormula, handleChange],
  )

  const onRemoveTruthTable = useCallback(() => {
    handleChange({
      formula: currentFormula,
      truthTable: undefined,
    })
  }, [currentFormula, handleChange])

  const displayAnswer =
    pendingFromSymbolRef.current !== null ? pendingFromSymbolRef.current : currentFormula

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
        <OmniInputResponsArea
          key={formulaKey}
          handleChange={onFormulaChange}
          handleSubmit={handleSubmit}
          answer={displayAnswer}
          processingMode="markdown"
          allowDraw={allowDraw}
          allowScan={allowScan}
          hasPreview={hasPreview}
          enableRefinement={false}
          feedback={feedback}
          typesafeErrorMessage={typesafeErrorMessage}
          checkIsLoading={checkIsLoading}
          responsePreviewParams={responsePreviewParams}
          displayMode={displayMode}
        />
        <TruthTableSection
          formula={currentFormula}
          truthTable={answerObject.truthTable}
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
