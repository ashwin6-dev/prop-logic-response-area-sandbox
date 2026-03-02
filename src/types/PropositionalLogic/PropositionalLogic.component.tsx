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
import Box from '@mui/system/Box'

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
  const [displayAnswer, setDisplayAnswer] = useState(currentFormula)

  // Sync displayAnswer with answer prop when it changes
  useEffect(() => {
    setDisplayAnswer(currentFormula)
  }, [currentFormula])

  const omniInputContainerRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef({ start: 0, end: 0 })
  const pendingCursorRef = useRef<number | null>(null)

  const onFormulaChange = useCallback<OmniInputResponsAreaProps['handleChange']>(
    (newFormula) => {
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
      const { start, end } = cursorRef.current
      const newValue =
        displayAnswer.slice(0, start) + symbol + displayAnswer.slice(end)
      setDisplayAnswer(newValue)
      const answerToSubmit = {
        formula: newValue,
        truthTable: answerObject.truthTable,
      }
      handleChange(answerToSubmit)
      pendingCursorRef.current = start + symbol.length
      setFormulaKey(k => k + 1)
    },
    [displayAnswer, answerObject.truthTable, handleChange],
  )

  // Attach cursor-tracking listeners to OmniInput's textarea (found via DOM)
  useEffect(() => {
    const container = omniInputContainerRef.current
    if (!container) return

    let timeoutId: ReturnType<typeof setTimeout>
    let cleanup: (() => void) | undefined

    const tryAttach = () => {
      const textarea = container.querySelector('textarea')
      if (textarea) {
        const updateCursor = () => {
          cursorRef.current = {
            start: textarea.selectionStart ?? 0,
            end: textarea.selectionEnd ?? 0,
          }
        }
        const events = ['select', 'keyup', 'mouseup', 'blur', 'focus', 'input'] as const
        events.forEach(ev => textarea.addEventListener(ev, updateCursor))
        cleanup = () => {
          events.forEach(ev => textarea.removeEventListener(ev, updateCursor))
        }
        return
      }
      timeoutId = setTimeout(tryAttach, 50)
    }

    tryAttach()

    return () => {
      clearTimeout(timeoutId)
      cleanup?.()
    }
  }, [formulaKey])

  // Restore cursor position after symbol insert (OmniInput remounts)
  useEffect(() => {
    const pos = pendingCursorRef.current
    if (pos === null) return

    const container = omniInputContainerRef.current
    if (!container) return

    const tryRestore = () => {
      const textarea = container.querySelector('textarea')
      if (textarea) {
        pendingCursorRef.current = null
        textarea.focus()
        textarea.setSelectionRange(pos, pos)
        return true
      }
      return false
    }

    if (!tryRestore()) {
      const id = setTimeout(() => tryRestore(), 0)
      return () => clearTimeout(id)
    }
  }, [displayAnswer, formulaKey])

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
        <Box ref={omniInputContainerRef}>
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
        </Box>
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
