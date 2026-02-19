import z from 'zod'

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PropositionalLogic } from './PropositionalLogic.component'
import {
  PropositionalLogicAnswerSchema,
  PropositionalLogicConfigSchema,
  PropositionalLogicExpectedAnswerSchema,
  propositionalLogicConfigSchema,
} from './PropositionalLogic.schema'
import { PropositionalLogicWizard } from './PropositionalLogicWizard.component'

const EMPTY_ANSWER: PropositionalLogicAnswerSchema = {
  formula: '',
  truthTable: undefined,
}

const EMPTY_EXPECTED: PropositionalLogicExpectedAnswerSchema = {
  satisfiability: false,
  tautology: false,
  equivalent: null,
  validTruthTable: false,
}

export class PropositionalLogicResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PROPOSITIONAL_LOGIC'

  protected answerSchema = z.unknown()
  protected answer: string = JSON.stringify(EMPTY_ANSWER)

  protected configSchema = propositionalLogicConfigSchema
  protected config?: PropositionalLogicConfigSchema

  initWithDefault = () => {
    this.config = {
      allowHandwrite: true,
      allowPhoto: true,
      enableRefinement: false,
    }
    this.answer = JSON.stringify(EMPTY_ANSWER)
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    if (!this.config) throw new Error('Config missing')
    let parsedAnswer: PropositionalLogicAnswerSchema
    try {
      const raw = JSON.parse(props.answer)
      parsedAnswer = {
        formula: raw.formula ?? '',
        truthTable: raw.truthTable ?? undefined,
      }
    } catch {
      parsedAnswer = EMPTY_ANSWER
    }
    const handleChange = (answer: PropositionalLogicAnswerSchema) => {
      props.handleChange(JSON.stringify(answer))
    }
    return PropositionalLogic({
      ...props,
      hasPreview: false,
      handleChange,
      answer: parsedAnswer,
      allowDraw: this.config.allowHandwrite,
      allowScan: this.config.allowPhoto,
      enableRefinement: this.config.enableRefinement,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    if (!this.config) throw new Error('Config missing')

    const expectedAnswer: PropositionalLogicExpectedAnswerSchema =
      this.config.expectedAnswer ?? EMPTY_EXPECTED

    return PropositionalLogicWizard({
      expectedAnswer,
      allowHandwrite: this.config.allowHandwrite,
      allowPhoto: this.config.allowPhoto,
      setAllowSave: props.setAllowSave,
      onChange: args => {
        this.config = { ...this.config!, expectedAnswer: args.expectedAnswer }
        props.handleChange({
          responseType: this.responseType,
          config: this.config,
          answer: this.config.expectedAnswer,
        } as unknown as Parameters<typeof props.handleChange>[0])
      },
    })
  }
}
