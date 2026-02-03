import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

function normalizeAnswer(
  answer: PropositionalLogicAnswerSchema | undefined,
): PropositionalLogicAnswerSchema {
  if (answer == null) return { formula: '', truthTable: undefined }
  if (typeof answer === 'string') return { formula: answer, truthTable: undefined }
  return answer
}

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
  const normalized = useMemo(
    () => normalizeAnswer(answer),
    [answer],
  )

  // Live formula so TruthTableSection and Check button see typed content even if parent doesn't re-render
  const [liveFormula, setLiveFormula] = useState(() => normalized.formula ?? '')
  useEffect(() => {
    setLiveFormula(normalized.formula ?? '')
  }, [normalized.formula])

  const onFormulaChange = useCallback<OmniInputResponsAreaProps['handleChange']>(
    (newFormula) => {
      setLiveFormula(newFormula)
      handleChange({ ...normalized, formula: newFormula })
    },
    [normalized, handleChange],
  )

  const insertSymbol = useCallback(
    (symbol: string) => {
      const newFormula = (liveFormula ?? '') + symbol
      setLiveFormula(newFormula)
      handleChange({ ...normalized, formula: newFormula })
    },
    [normalized, liveFormula, handleChange],
  )

  const onTruthTableChange = useCallback(
    (truthTable: PropositionalLogicAnswerSchema['truthTable']) => {
      if (!truthTable) return
      handleChange({ ...normalized, truthTable })
    },
    [normalized, handleChange],
  )

  return (
    <ResponseAreaOmniInputContainer
      preResponseText={preResponseText}
      postResponseText={postResponseText}>
      <Stack spacing={2}>
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
            handleChange={onFormulaChange}
            handleSubmit={handleSubmit}
            answer={normalized.formula}
            processingMode="markdown"
            allowDraw={allowDraw}
            allowScan={allowScan}
            hasPreview={hasPreview}
            enableRefinement={enableRefinement}
            feedback={feedback}
            typesafeErrorMessage={typesafeErrorMessage}
            checkIsLoading={checkIsLoading}
            responsePreviewParams={responsePreviewParams}
            displayMode={displayMode}
          />
        </Stack>

        <TruthTableSection
          formula={liveFormula}
          truthTable={normalized.truthTable}
          onTruthTableChange={onTruthTableChange}
          allowDraw={allowDraw}
          allowScan={allowScan}
          processingMode="markdown"
        />
      </Stack>
    </ResponseAreaOmniInputContainer>
  )
}

export const HMR = true
