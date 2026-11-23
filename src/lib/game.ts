// "Golpe ou seguro?" — a calm practice game. Content rule: same widely published guidance as
// src/lib/scams.ts. No timer, no lives, no stored score: a wrong answer only shows the explanation.

export type Verdict = "golpe" | "seguro";
export type Channel = "whatsapp" | "ligacao" | "sms" | "celular";

export type Round = {
  id: string;
  channel: Channel;
  from: string;
  /** Optional sentence that sets the scene before the message. */
  context?: string;
  message: string;
  answer: Verdict;
  explanation: string;
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  whatsapp: "Mensagem no WhatsApp",
  ligacao: "Ligação",
  sms: "Mensagem de texto (SMS)",
  celular: "Aviso no celular",
};

export const ROUNDS: Round[] = [
  {
    id: "filha-cafe",
    channel: "whatsapp",
    from: "Ana (filha) — número salvo nos contatos",
    message: "Mãe, chego aí às 15h para o café. Quer que eu leve pão?",
    answer: "seguro",
    explanation:
      "É seguro. A mensagem vem de um número que você já tinha salvo e não pede dinheiro, senha nem código.",
  },
  {
    id: "numero-novo-pix",
    channel: "whatsapp",
    from: "Número desconhecido, com a foto do seu filho",
    message:
      "Oi, troquei de número. Salva esse novo. Preciso de um Pix urgente de R$ 900, depois te explico.",
    answer: "golpe",
    explanation:
      "É golpe. Número novo com pedido de dinheiro urgente é o truque mais comum. Antes de qualquer Pix, ligue para o número antigo da pessoa.",
  },
  {
    id: "central-codigo",
    channel: "ligacao",
    from: "Diz ser da central do seu banco",
    message:
      "Identificamos uma compra estranha no seu cartão. Para cancelar, me diga o código que chegou por mensagem.",
    answer: "golpe",
    explanation:
      "É golpe. O banco nunca pede códigos nem senhas por telefone. Desligue e ligue você mesmo para o número que está atrás do cartão.",
  },
  {
    id: "atualizacao-sistema",
    channel: "celular",
    from: "Configurações do celular",
    context: "Você mesmo abriu as Configurações do seu celular e viu este aviso.",
    message:
      "Atualização do sistema disponível. Toque em Instalar quando estiver conectado ao Wi-Fi.",
    answer: "seguro",
    explanation:
      "É seguro. Atualizações dentro das Configurações do próprio celular são oficiais e deixam o aparelho mais protegido.",
  },
  {
    id: "encomenda-taxa",
    channel: "sms",
    from: "Número desconhecido",
    message:
      "Sua encomenda está parada. Pague a taxa de R$ 12,90 neste link para liberar: entrega-rapida-correio.xyz",
    answer: "golpe",
    explanation:
      "É golpe. Mensagens com link para pagar taxa de entrega são falsas. Confira sempre no site ou aplicativo oficial, digitando você mesmo o endereço.",
  },
  {
    id: "codigo-pedido-por-voce",
    channel: "sms",
    from: "WhatsApp",
    context: "Você acabou de instalar o WhatsApp no seu celular novo e pediu o código.",
    message: "Seu código do WhatsApp é 123-456. Não compartilhe este código com ninguém.",
    answer: "seguro",
    explanation:
      "É seguro, porque foi você quem pediu. Digite o código só no seu próprio celular e nunca passe para outra pessoa.",
  },
  {
    id: "premio-cartao",
    channel: "sms",
    from: "Número desconhecido",
    message:
      "Parabéns! Você ganhou R$ 5.000. Toque no link e informe os dados do seu cartão para receber o prêmio.",
    answer: "golpe",
    explanation:
      "É golpe. Ninguém pede dados do cartão para entregar prêmio. Se você não se inscreveu em nada, desconfie e apague a mensagem.",
  },
  {
    id: "motoboy-cartao",
    channel: "ligacao",
    from: "Diz ser do seu banco",
    message:
      "Seu cartão foi clonado. Vamos mandar um motoboy buscar o cartão na sua casa para trocar.",
    answer: "golpe",
    explanation:
      "É golpe. O banco nunca manda alguém buscar o cartão. Desligue e ligue para o banco por outro telefone, se puder.",
  },
  {
    id: "aviso-app-banco",
    channel: "celular",
    from: "Aplicativo oficial do seu banco",
    context: "Você abriu o aplicativo do banco que já usa e apareceu este aviso.",
    message: "Lembrete: nunca pedimos sua senha ou códigos por telefone, mensagem ou e-mail.",
    answer: "seguro",
    explanation:
      "É seguro. É um aviso de proteção dentro do aplicativo oficial, e ele não pede nada para você.",
  },
  {
    id: "pesquisa-codigo",
    channel: "whatsapp",
    from: "Número desconhecido",
    message:
      "Olá! Estamos fazendo uma pesquisa de saúde. Para participar, me passe o código de 6 números que vai chegar no seu celular.",
    answer: "golpe",
    explanation:
      "É golpe. Com esse código, a pessoa toma conta do seu WhatsApp. Nunca passe códigos que chegam por mensagem.",
  },
];

export function isCorrect(round: Round, choice: Verdict): boolean {
  return round.answer === choice;
}

/** Encouraging closing words; never a "you lost" message. */
export function finalMessage(correct: number, total: number): string {
  if (correct === total) return "Parabéns! Você reconheceu todas as mensagens.";
  if (correct >= Math.ceil(total * 0.7)) return "Muito bem! Você já está bem atento aos golpes.";
  return "Cada rodada ensina algo novo. Jogar de novo ajuda a fixar as dicas.";
}
