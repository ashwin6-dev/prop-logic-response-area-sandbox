import { propositionalLogicAnswerSchema, PropositionalLogicAnswerSchema } from "../PropositionalLogic.schema"

export type PersistedAnswer = {
  formula: string
  truthTable: string | null
}

export function serializeAnswer(
  answer: PropositionalLogicAnswerSchema
): PersistedAnswer {
  return {
    formula: answer.formula,
    truthTable: answer.truthTable
      ? JSON.stringify(answer.truthTable)
      : null,
  }
}

export function deserializeAnswer(raw: string): PropositionalLogicAnswerSchema | undefined {
  if (!raw || typeof raw !== 'object') return undefined

  const stored = raw as Partial<PersistedAnswer>

  // let parsedTruthTable: PropositionalLogicAnswerSchema['truthTable'] = undefined

  if (typeof stored.truthTable === 'string') {
    try {
      const json = JSON.parse(stored.truthTable)
      const validated = propositionalLogicAnswerSchema.safeParse({
        formula: stored.formula ?? '',
        truthTable: json,
      })

      if (validated.success) {
        return validated.data
      }
    } catch {
      // corrupted JSON -> ignore
    }
  }

  return {
    formula: stored.formula ?? '',
    truthTable: undefined,
  }
}