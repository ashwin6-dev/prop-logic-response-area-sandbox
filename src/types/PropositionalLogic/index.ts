import z from 'zod'

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PropositionalLogic } from './PropositionalLogic.component'
import {
  PropositionalLogicAnswerSchema,
  propositionalLogicConfigSchema,
  PropositionalLogicConfigSchema,
} from './PropositionalLogic.schema'
import { PropositionalLogicWizard } from './PropositionalLogicWizard.component'
// import { deserializeAnswer, PersistedAnswer, serializeAnswer } from './utils/serialize'

const EMPTY_ANSWER: PropositionalLogicAnswerSchema = {
  formula: '',
  truthTable: null,
}

export class PropositionalLogicResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PROPOSITIONAL_LOGIC'

  protected answerSchema = z.unknown()//propositionalLogicAnswerSchema
  protected answer: string = JSON.stringify({ formula: '', truthTable: null })

  protected configSchema = propositionalLogicConfigSchema
  protected config?: PropositionalLogicConfigSchema

  /**
   * Default MUST respect legacy schema
   */
  initWithDefault = () => {
    this.config = {
      allowHandwrite: true,
      allowPhoto: true,
      enableRefinement: false,
    }

    this.answer = JSON.stringify({ formula: '', truthTable: null })
  }
  InputComponent = (props: BaseResponseAreaProps) => {
    if (!this.config) throw new Error('Config missing')

    let parsedAnswer
    try {
      parsedAnswer = JSON.parse(props.answer)
    } catch {
      parsedAnswer = EMPTY_ANSWER
    }

    const handleChange = (answer: PropositionalLogicAnswerSchema) => {
      console.log('Answer changed:', answer)
      props.handleChange(
        JSON.stringify(answer) // <- platform safe
      )
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
    if (!this.answer) throw new Error('Answer missing')

    const answerObject =
      JSON.parse(this.answer) ?? { formula: '', truthTable: null }

    return PropositionalLogicWizard({
      answer: answerObject,
      allowHandwrite: this.config.allowHandwrite,
      allowPhoto: this.config.allowPhoto,
      setAllowSave: props.setAllowSave,
      onChange: args => {
        console.log('Wizard answer changed:', args.answer)
        props.handleChange({
          responseType: this.responseType,
          config: this.config,
          answer: JSON.stringify(args.answer)
        })
      },
    })
  }
}
