import { CodeResponseAreaTub } from './Code'
import { EssayResponseAreaTub } from './Essay'
import { ImagesResponseAreaTub } from './Images'
import { LikertResponseAreaTub } from './Likert'
import { MathMultiLinesResponseAreaTub } from './MathMultiLines'
import { MathSingleLineResponseAreaTub } from './MathSingleLine'
import { MatrixResponseAreaTub } from './Matrix'
import { MultipleChoiceResponseAreaTub } from './MultipleChoice'
import { NumberResponseAreaTub } from './NumberInput'
import { NumericUnitsResponseAreaTub } from './NumericUnits'
import { PropositionalLogicResponseAreaTub } from './PropositionalLogic'
import { ResponseAreaTub } from './response-area-tub'
import { isResponseAreaSandboxType } from './sandbox'
import { TableResponseAreaTub } from './Table'
import { TextResponseAreaTub } from './TextInput'
import { TrueFalseResponseAreaTub } from './TrueFalse'
import { VoidResponseAreaTub } from './void-response-area'

export const supportedResponseTypes = [
  'BOOLEAN',
  'TEXT',
  'NUMBER',
  'NUMERIC_UNITS',
  'MATRIX',
  'TABLE',
  'MULTIPLE_CHOICE',
  'GRAPH',
  'EXPRESSION',
  'ESSAY',
  'CODE',
  'MILKDOWN',
  'LIKERT',
  'MATH_SINGLE_LINE',
  'MATH_MULTI_LINES',
  'IMAGES',
  'PROPOSITIONAL_LOGIC'
]

const createReponseAreaTub = (type: string): ResponseAreaTub => {
  if (isResponseAreaSandboxType(type) && 'SandboxComponent' in window) {
    return new (window.SandboxComponent as new () => ResponseAreaTub)()
  }

  switch (type) {
    case 'PROPOSITIONAL_LOGIC':
      return new PropositionalLogicResponseAreaTub()
    case 'BOOLEAN':
      return new TrueFalseResponseAreaTub()
    case 'TEXT':
      return new TextResponseAreaTub()
    case 'NUMBER':
      return new NumberResponseAreaTub()
    case 'NUMERIC_UNITS':
      return new NumericUnitsResponseAreaTub()
    case 'MATRIX':
      return new MatrixResponseAreaTub()
    case 'TABLE':
      return new TableResponseAreaTub()
    case 'MULTIPLE_CHOICE':
      return new MultipleChoiceResponseAreaTub()
    case 'ESSAY':
      return new EssayResponseAreaTub()
    case 'CODE':
      return new CodeResponseAreaTub()
    case 'LIKERT':
      return new LikertResponseAreaTub()
    case 'MATH_SINGLE_LINE':
      return new MathSingleLineResponseAreaTub()
    case 'MATH_MULTI_LINES':
      return new MathMultiLinesResponseAreaTub()
    case 'IMAGES':
      return new ImagesResponseAreaTub()
    case 'VOID':
      return new VoidResponseAreaTub()
    default:
      console.error('Unknown ResponseAreaTub', { type })
      return new VoidResponseAreaTub()
  }
}

export { createReponseAreaTub }
