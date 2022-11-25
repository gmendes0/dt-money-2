import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchFormContainer } from './styles'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

/**
 * Por que um componente renderiza no React:
 * - Hooks changed (mudou state, context, reducer)
 * - Props changed
 * - Parent rerendered (componente pai renderizou)
 *
 * Fluxo de renderização:
 * 1. O React recria o HTML da interface do componente
 * 2. O React compara a versão do HTML recriado com a versão anterior
 * 3. Se houverem mudanças, o React reescreve o HTML em tela
 *
 * O Processo de renderização é bem rápido, portanto nem sempre faz
 * sentido tentar evitar renderizações. Faz sentido evitar quando
 * o componente retorna um HTML muito grande e complexo que causaria
 * lentidao na geração e na comparação, um exemplo são listas grandes
 * que retornam HTMLs grandes.
 *
 * Memo:
 * Adiciona alguns passos antes dos passos citados no Fluxo acima
 * 0.: Verifica se: Hooks changed, Props changed (deep comparison)
 * 0.1: Compara com a versão anterior dos Hooks e Props
 * 0.2: Se houverem mudanças, permite a nova renderização
 *
 * O memo só faz sentido ser utilizado em componentes com HTML mais pesados,
 * pois o deep comparison pode ser mais custoso que recriar o HTML em memória
 * e comparar as versões.
 *
 * Nesse caso nao vale a pena utilizar o memo, pois o compnente é
 * bem simples.
 *
 */

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormInputs = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => context.fetchTransactions,
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    defaultValues: {
      query: '',
    },
    resolver: zodResolver(searchFormSchema),
  })

  async function handleSearchTransactions(data: SearchFormInputs) {
    fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register('query')}
      />

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} /> Buscar
      </button>
    </SearchFormContainer>
  )
}
