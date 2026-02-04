import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PropositionalLogic } from './PropositionalLogic.component'
import { 
  propositionalLogicConfigSchema,
  PropositionalLogicConfigSchema,
  propositionalLogicAnswerSchema,
  PropositionalLogicAnswerSchema,
 } from './PropositionalLogic.schema'

 import { PropositionalLogicWizard } from './PropositionalLogicWizard.component'

export class PropositionalLogicResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PROPOSITIONAL_LOGIC' // seems that it must be called SANDBOX?

  public readonly canToggleLatexInStats = false

  public readonly delegatePreResponseText = false

  public readonly delegatePostResponseText = false

  public readonly delegateLivePreview = false

  public readonly delegateFeedback = false

  public readonly delegateCheck = false

  public readonly delegateErrorMessage = false

  public readonly displayInFlexContainer = false

  protected answerSchema = propositionalLogicAnswerSchema

  protected answer?: PropositionalLogicAnswerSchema

  protected configSchema = propositionalLogicConfigSchema

  protected config?: PropositionalLogicConfigSchema

  initWithDefault = () => {
    this.config = {
      allowHandwrite: true,
      allowPhoto: true,
      enableRefinement: false,
    }
    this.answer = { formula: '', truthTable: undefined }
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    if (!this.config) throw new Error('Config missing')
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    const handleChange = (answer: PropositionalLogicAnswerSchema) => {
      props.handleChange(
        answer as unknown as Parameters<typeof props.handleChange>[0],
      )
    }

    return PropositionalLogic({
      ...props,
      hasPreview: false,
      handleChange,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
      allowDraw: this.config.allowHandwrite,
      allowScan: this.config.allowPhoto,
      enableRefinement: this.config.enableRefinement,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    if (!this.config) throw new Error('Config missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    const formula =
      typeof this.answer === 'object' && this.answer && 'formula' in this.answer
        ? (this.answer as PropositionalLogicAnswerSchema).formula
        : typeof this.answer === 'string'
          ? this.answer
          : ''
    const existingTruthTable =
      typeof this.answer === 'object' &&
      this.answer &&
      'truthTable' in this.answer
        ? (this.answer as PropositionalLogicAnswerSchema).truthTable
        : undefined

    return PropositionalLogicWizard({
      answer: formula,
      ...this.config,
      onChange: args => {
        props.handleChange({
          responseType: this.responseType,
          config: {
            allowHandwrite: args.allowHandwrite,
            allowPhoto: args.allowPhoto,
          },
          answer: {
            formula: args.answer,
            truthTable: existingTruthTable,
          },
        } as unknown as Parameters<typeof props.handleChange>[0])
      },
    })
  }
}