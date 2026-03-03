export type PropositionalLogicSymbol = {
  label: string
  value: string
  title: string
}

export const PROPOSITIONAL_LOGIC_SYMBOLS: PropositionalLogicSymbol[] = [
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

