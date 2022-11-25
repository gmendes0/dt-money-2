import { useMemo } from 'react'
import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../contexts/TransactionsContext'

interface SummaryType {
  income: number
  outcome: number
  total: number
}

export function useSummary() {
  const transactions = useContextSelector(
    TransactionsContext,
    (context) => context.transactions,
  )

  /**
   * Faz com que esse calculo só seja refeito quando alguma variavel da
   * qual ela depende mudar, nesse caso, a transactions.
   */
  const summary = useMemo(
    () =>
      transactions.reduce<SummaryType>(
        (acc, transaction) => {
          switch (transaction.type) {
            case 'income':
              return {
                ...acc,
                income: acc.income + transaction.price,
                total: acc.total + transaction.price,
              }
            case 'outcome':
              return {
                ...acc,
                outcome: acc.outcome + transaction.price,
                total: acc.total - transaction.price,
              }
            default:
              return acc
          }
        },
        {
          income: 0,
          outcome: 0,
          total: 0,
        },
      ),
    [transactions],
  )

  return summary
}
