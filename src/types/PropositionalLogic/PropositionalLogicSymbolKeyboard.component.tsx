import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import React from 'react'

import { PROPOSITIONAL_LOGIC_SYMBOLS } from './symbols'

type PropositionalLogicSymbolKeyboardProps = {
  onInsert: (symbol: string) => void
}

export const PropositionalLogicSymbolKeyboard: React.FC<
  PropositionalLogicSymbolKeyboardProps
> = ({ onInsert }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap">
    {PROPOSITIONAL_LOGIC_SYMBOLS.map(symbol => (
      <Button
        key={symbol.value}
        variant="outlined"
        size="small"
        onClick={() => onInsert(symbol.value)}
        title={symbol.title}
        sx={{ minWidth: '40px' }}
      >
        {symbol.label}
      </Button>
    ))}
  </Stack>
)

