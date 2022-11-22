import * as Dialog from "@radix-ui/react-dialog";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from "./styles";

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(["income", "outcome"]),
});

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>;

export function NewTransactionModal() {
  /**
   * Sempre que precisarmos incluir uma info no form que nao vem de um elemento nativo do HTML,
   * precisamos usar o control
   */
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewTransactionFormInputs>();

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    console.log(data);
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
              {...register("description")}
            />
            <input
              type="number"
              placeholder="Preço"
              required
              {...register("price", { valueAsNumber: true })}
            />
            <input
              type="text"
              placeholder="Categoria"
              required
              {...register("category")}
            />

            {/**
             * RadioGroup.Root
             */}
            <TransactionType {...register("type")}>
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

            <button type="submit" disabled={isSubmitting}>
              Cadastrar
            </button>
          </form>
        </Content>
      </Dialog.Portal>
    </>
  );
}
