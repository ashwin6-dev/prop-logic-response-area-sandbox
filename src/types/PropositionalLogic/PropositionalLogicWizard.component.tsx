import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect } from 'react'

import { PropositionalLogicAnswerSchema } from './PropositionalLogic.schema'
import { TruthTableSection } from './TruthTableSection.component'

interface PropositionalLogicWizardProps {
  answer: PropositionalLogicAnswerSchema
  allowHandwrite: boolean
  allowPhoto: boolean
  onChange: (args: {
    answer: PropositionalLogicAnswerSchema
    allowHandwrite: boolean
    allowPhoto: boolean
  }) => void
  setAllowSave?: React.Dispatch<React.SetStateAction<boolean>>
}

export const PropositionalLogicWizard: React.FC<
  PropositionalLogicWizardProps
> = props => {
  const { answer, allowHandwrite, allowPhoto, onChange, setAllowSave } = props
  const truthTable = answer.truthTable ?? undefined

  useEffect(() => {
    setAllowSave?.(true)
  }, [setAllowSave])

  const onTruthTableChange = useCallback(
    (newTruthTable: PropositionalLogicAnswerSchema['truthTable']) => {
      if (!newTruthTable) return
      onChange({
        answer: { ...answer, truthTable: newTruthTable },
        allowHandwrite,
        allowPhoto,
      })
    },
    [answer, allowHandwrite, allowPhoto, onChange],
  )

  const onRemoveTruthTable = useCallback(() => {
    onChange({
      answer: { ...answer, truthTable: undefined },
      allowHandwrite,
      allowPhoto,
    })
  }, [answer, allowHandwrite, allowPhoto, onChange])

  return (
    <div>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
        Expected truth table (optional)
      </Typography>
      <TruthTableSection
        formula={answer.formula ?? ''}
        truthTable={truthTable}
        onTruthTableChange={onTruthTableChange}
        onRemoveTruthTable={onRemoveTruthTable}
        allowDraw={false}
        allowScan={false}
        processingMode="markdown"
      />
    </div>
  )
}

export const HMR = true // ensure HMR triggers on parent imports