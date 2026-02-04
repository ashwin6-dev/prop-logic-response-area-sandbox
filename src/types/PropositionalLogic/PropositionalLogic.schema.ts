import { z } from 'zod'

export const propositionalLogicConfigSchema = z.object({
  allowHandwrite: z.boolean(),
  allowPhoto: z.boolean(),
  enableRefinement: z.boolean().default(true),
})

export type PropositionalLogicConfigSchema = z.infer<
  typeof propositionalLogicConfigSchema
>

export const truthTableSchema = z.object({
  variables: z.array(z.string()),
  cells: z.array(z.array(z.string())),
})

export type TruthTableSchema = z.infer<typeof truthTableSchema>

export const propositionalLogicAnswerSchema = z.union([
  z.string().transform(s => ({ formula: s, truthTable: undefined })),
  z.object({
    formula: z.string(),
    truthTable: truthTableSchema.optional(),
  }),
])

export type PropositionalLogicAnswerSchema = z.infer<
  typeof propositionalLogicAnswerSchema
>

/** Parse unique single-letter variable names (A–Z or a–z) from a formula, sorted. */
export function parseVariablesFromFormula(formula: string): string[] {
  const letters = formula.match(/\b[A-Za-z]\b/g) ?? []
  return [...new Set(letters)].sort()
}

/** Build empty cells grid: 2^n rows × (variables.length + 1) columns (last = result). */
export function buildEmptyTruthTableCells(
  variables: string[],
): string[][] {
  const rows = 2 ** variables.length
  const cols = variables.length + 1
  return Array.from({ length: rows }, () => Array(cols).fill(''))
}