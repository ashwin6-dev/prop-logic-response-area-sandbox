import { z } from 'zod'

export const truthTableSchema = z.object({
  variables: z.array(z.string()),
  cells: z.array(z.array(z.string())),
})

export type TruthTableSchema = z.infer<typeof truthTableSchema>

/** Student answer (main component): formula + optional truth table. */
export const propositionalLogicAnswerSchema = z.object({
  formula: z.string(),
  truthTable: truthTableSchema.nullish().optional(),
})

export type PropositionalLogicAnswerSchema = z.infer<
  typeof propositionalLogicAnswerSchema
>

/**
 * Wizard-only: expected answer payload (teacher chooses one of four).
 * Stored in config.expectedAnswer, not in answer.
 * validTruthTable: true means "answer should be a valid truth table" (no table entry).
 */
export const propositionalLogicExpectedAnswerSchema = z.object({
  satisfiability: z.boolean(),
  tautology: z.boolean(),
  equivalent: z.string().nullable(),
  validTruthTable: z.boolean(),
})

export type PropositionalLogicExpectedAnswerSchema = z.infer<
  typeof propositionalLogicExpectedAnswerSchema
>

export const propositionalLogicConfigSchema = z.object({
  allowHandwrite: z.boolean(),
  allowPhoto: z.boolean(),
  enableRefinement: z.boolean().default(true),
  expectedAnswer: propositionalLogicExpectedAnswerSchema.optional(),
})

export type PropositionalLogicConfigSchema = z.infer<
  typeof propositionalLogicConfigSchema
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