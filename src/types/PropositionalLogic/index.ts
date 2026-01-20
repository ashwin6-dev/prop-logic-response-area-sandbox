import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PropositionalLogic } from './PropositionalLogic.component'
import { propositionalLogicAnswerSchema } from './PropositionalLogic.schema'

export class PropositionalLogicResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PROPOSITIONAL_LOGIC'

  protected answerSchema = propositionalLogicAnswerSchema

  protected answer?: string

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return PropositionalLogic({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return PropositionalLogic({
      ...props,
      answer: this.answer,
      handleChange: answer => {
        props.handleChange({
          responseType: this.responseType,
          answer,
        })
      },
    })
  }
}