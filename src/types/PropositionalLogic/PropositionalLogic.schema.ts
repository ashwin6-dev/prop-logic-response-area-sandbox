import { z } from 'zod'

export const propositionalLogicConfigSchema = z.object({
  allowHandwrite: z.boolean(),
  allowPhoto: z.boolean(),
  enableRefinement: z.boolean().default(true),
})


export type PropositionalLogicConfigSchema = z.infer<
  typeof propositionalLogicConfigSchema
>

export const propositionalLogicAnswerSchema = z.string()

export type PropositionalLogicAnswerSchema = z.infer<
  typeof propositionalLogicAnswerSchema
>