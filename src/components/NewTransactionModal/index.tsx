import * as Dialog from "@radix-ui/react-dialog";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from "./styles";

export function NewTransactionModal() {
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

          <form action="">
            <input type="text" placeholder="Descrição" required />
            <input type="number" placeholder="Preço" required />
            <input type="text" placeholder="Categoria" required />

            {/**
             * RadioGroup.Root
             */}
            <TransactionType>
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

            <button type="submit">Cadastrar</button>
          </form>
        </Content>
      </Dialog.Portal>
    </>
  );
}
