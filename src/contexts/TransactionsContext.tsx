import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

/**
 * É melhor criar a tipagem aqui do que importar a do NewTransactionModal pois a ideia do context é servir
 * para diferentes componentes, e importar a tipagem de lá acaba criando uma dependencia com ele,
 * já que se eu deletar o componente, a tipagem para de existir.
 */
interface CreateTransactionData {
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
}

interface TransactionsContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionData) => void
}

export const TransactionsContext = createContext({} as TransactionsContextType)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function fetchTransactions(query?: string) {
    const response = await api.get<Transaction[]>('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'DESC',
        q: query,
      },
    })

    setTransactions(response.data)
  }

  /**
   * É melhor fazer com que o context faça o cadastro e atualize o transactions ao invés de expor uma
   * função que atualize o estado transactions, pois com isso seria possível que qualquer componente
   * alterasse o estado da maneira que ele quisesse.
   */
  async function createTransaction(data: CreateTransactionData) {
    try {
      const response = await api.post('/transactions', {
        ...data,
        createdAt: new Date(),
      })

      setTransactions((state) => [response.data, ...state])
    } catch (error) {
      console.log('Não foi possível criar uma nova transação')
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
