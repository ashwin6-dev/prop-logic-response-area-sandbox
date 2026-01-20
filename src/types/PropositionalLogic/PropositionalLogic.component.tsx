import { useCallback, useRef } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { BaseResponseAreaProps } from '../base-props.type'

type PropositionalLogicProps = Omit<
  BaseResponseAreaProps,
  'handleChange' | 'answer'
> & {
  handleChange: (val: string) => void
  answer?: string
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
  answer = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertSymbol = useCallback(
    (symbol: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentValue = answer || ''
      const newValue =
        currentValue.slice(0, start) + symbol + currentValue.slice(end)

      handleChange(newValue)

      requestAnimationFrame(() => {
        if (textarea) {
          const newPosition = start + symbol.length
          textarea.focus()
          textarea.setSelectionRange(newPosition, newPosition)
        }
      })
    },
    [answer, handleChange],
  )

  const submitOnEnter: React.KeyboardEventHandler<HTMLTextAreaElement> =
    useCallback(
      event => {
        if (event.key !== 'Enter' || event.shiftKey || !handleSubmit) return
        event.preventDefault()
        return handleSubmit()
      },
      [handleSubmit],
    )

  return (
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
      <TextField
        inputRef={textareaRef}
        multiline
        rows={4}
        value={answer}
        onChange={event => {
          event.preventDefault()
          handleChange(event.target.value)
        }}
        onKeyDown={submitOnEnter}
        placeholder="Enter propositional logic formula..."
        fullWidth
      />
    </Stack>
  )
}

export const HMR = true