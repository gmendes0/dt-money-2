import * as Dialog from "@radix-ui/react-dialog";
import { HeaderContainer, HeaderContent, NewTransactionButton } from "./styles";
import { NewTransactionModal } from "../NewTransactionModal";

import logoSVG from "../../assets/logo.svg";

export function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoSVG} alt="" />

        {/**
         * Cria um modal respeitando as regras de acessibilidade
         * Precisa ficar por volta de todo o contexto do modal, incluindo o elento
         * que vai fazer trigger e o proprio modal.
         */}
        <Dialog.Root>
          {/**
           * Caso nao coloque asChild, ele vira um botao, com asChild ele mescla
           * as props do children e nao cria um botao
           */}
          <Dialog.Trigger asChild>
            <NewTransactionButton>Nova transação</NewTransactionButton>
          </Dialog.Trigger>

          <NewTransactionModal />
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  );
}
