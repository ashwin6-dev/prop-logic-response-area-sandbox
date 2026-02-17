import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PropositionalLogic } from './PropositionalLogic.component'
import { PropositionalLogicWizard } from './PropositionalLogicWizard.component'
import {
  propositionalLogicConfigSchema,
  PropositionalLogicConfigSchema,
  propositionalLogicAnswerSchema,
  PropositionalLogicAnswerSchema,
} from './PropositionalLogic.schema'

export class PropositionalLogicResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PROPOSITIONAL_LOGIC'

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
      console.log("answer:: ", answer);
      props.handleChange(
        answer
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

    const parsed = this.answerSchema.safeParse(this.answer)
    const answerObject: PropositionalLogicAnswerSchema = parsed.success
      ? parsed.data
      : { formula: '', truthTable: undefined }

    return PropositionalLogicWizard({
      answer: answerObject,
      allowHandwrite: this.config.allowHandwrite,
      allowPhoto: this.config.allowPhoto,
      setAllowSave: props.setAllowSave,
      onChange: args => {
        props.handleChange({
          responseType: this.responseType,
          config: this.config,
          answer: JSON.stringify(args.answer) as unknown as PropositionalLogicAnswerSchema,
        } as unknown as Parameters<typeof props.handleChange>[0])
      },
    })
  }
}