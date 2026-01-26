import { useCallback } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import {
  OmniInputResponsArea,
  OmniInputResponsAreaProps,
} from '@components/OmniInput/OmniInputResponseArea.component'
import { ResponseAreaOmniInputContainer } from '@modules/shared/components/ResponseArea/ResponseAreaOmniInputContainer.component'
import React from 'react'

import { BaseResponseAreaProps } from '../base-props.type'

type PropositionalLogicProps = Omit<
  BaseResponseAreaProps,
  'handleChange' | 'answer'
> & {
  handleChange: OmniInputResponsAreaProps['handleChange']
  answer: OmniInputResponsAreaProps['answer']
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
  // const insertSymbol = useCallback(
  //   (symbol: string) => {
  //     const currentValue = answer || ''
  //     handleChange(currentValue + symbol)
  //   },
  //   [answer, handleChange],
  // )

  const insertSymbol = useCallback(
    (symbol: string) => {
      console.log('insertSymbol called', { symbol, currentAnswer: answer })
      const currentValue = answer || ''
      const newValue = currentValue + symbol
      console.log('calling handleChange with:', newValue)
      handleChange(newValue)
    },
    [answer, handleChange],
  )

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
          key={answer}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          answer={answer}
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
    </ResponseAreaOmniInputContainer>
  )
}

export const HMR = true // ensure HMR triggers on parent imports