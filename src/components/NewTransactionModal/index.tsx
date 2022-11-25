import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import { Controller, useForm } from 'react-hook-form'
import { useContextSelector } from 'use-context-selector'
import { z } from 'zod'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './styles'

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  /**
   * Como o state transactions do provider muda, o componente TransactionsProvider
   * é renderizado novamente, e todas as funções/variaveis são recridas em memória,
   * isso faz com que o valor passado para o TransactionsContext.Provider mude e o
   * contexto mude. Portanto, mesmo que o que mudou nao foi a função `createTransaction`,
   * o NewTransactionModal acaba renderizando novamente porque o contexto mudou. Isso
   * seria resolvido se o React permitisse que a gente selecionasse qual valor do
   * contexto queremos observar, esse metodo é chamado de "selector". Nativamente o
   * React nao possui essa função, então podemos utilizar a lib "use-context-selector"
   * que permite com que a gente obtenha essa funcionalidade sem ter que alterar muito
   * a forma com que utilizamos a context api.
   *
   * Na forma nativa do React, para buscarmos uma info do contexto fazemos o seguinte:
   *
   * `const { createTransaction } = useContext(TransactionsContext)`
   *
   * Com o "use-context-selector", fazemos da seguinte forma:
   *
   * const transactions = useContextSelector(TransactionsContext, ctx => ctx.transactions)
   */
  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => context.createTransaction,
  )

  /**
   * Sempre que precisarmos incluir uma info no form que nao vem de um elemento nativo do HTML,
   * precisamos usar o control
   */
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewTransactionFormInputs>({
    defaultValues: {
      type: 'income',
    },
  })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    createTransaction(data)

    reset()
  }

  return (
    <>
      {/**
       * Faz com que o modal seja renderizado como filho da tag body ao invés de
       * ser renderizado dentro da tag pai, nesse caso HeaderContent.
       * Funciona como o Portal do React, que permite que algo seja renderizado em
       * um nó fora do componente pai
       */}
      <Dialog.Portal>
        {/**
         * Fica por tras do modal na tela inteira
         */}
        <Overlay />

        <Content>
          {/**
           * pode ficar em qualquer lugar
           */}
          <CloseButton>
            <X size={24} />
          </CloseButton>

          {/**
           * O Radix vai usar o title para anunciar qual o tipo do modal
           * que foi aberto
           */}
          <Dialog.Title>Nova transação</Dialog.Title>

          <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
            <input
              type="text"
              placeholder="Descrição"
              required
              {...register('description')}
            />
            <input
              type="number"
              placeholder="Preço"
              required
              {...register('price', { valueAsNumber: true })}
            />
            <input
              type="text"
              placeholder="Categoria"
              required
              {...register('category')}
            />

            {/**
             * Permite integrar campos nao nativos do HTML
             * name: nome do input
             * control: control do useForm
             * render: deve retornar o componente que será o input
             *
             * parametros do render render:
             *    formState: estado do form (useForm), idual ao formState do proprio useForm
             *    fieldState: estado do campo ("type" nesse caso)
             *    field: podemos acessar os eventos, value, ref, etc
             */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <>
                  {/**
                   * RadioGroup.Root
                   *
                   * onValueChange: é chamado quando o valor muda, ou seja
                   * quando um outro RadioGroup.Item é selecionado
                   *
                   * onValueChange={field.onChange} é o mesmo que onValueChange={value => field.onChange(value)}
                   *
                   * É importante colocar o value={field.value} pois caso seja colocado um valor default no useForm,
                   * ele carrega esse valor no value ao renderizar pela primeira vez
                   */}
                  <TransactionType
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {/**
                     * RadioGroup.Item
                     */}
                    <TransactionTypeButton variant="income" value="income">
                      <ArrowCircleUp size={24} /> Entrada
                    </TransactionTypeButton>

                    {/**
                     * RadioGroup.Item
                     */}
                    <TransactionTypeButton variant="outcome" value="outcome">
                      <ArrowCircleDown size={24} /> Saída
                    </TransactionTypeButton>
                  </TransactionType>
                </>
              )}
            />

            <button type="submit" disabled={isSubmitting}>
              Cadastrar
            </button>
          </form>
        </Content>
      </Dialog.Portal>
    </>
  )
}
