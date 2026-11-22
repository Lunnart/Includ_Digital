// Practical scam-protection guide. Content rule: only widely published guidance
// (banks never ask for passwords, codes or "safe account" transfers).

export type Scam = {
  id: string;
  title: string;
  howItWorks: string;
  whatToDo: string[];
};

export const GOLDEN_RULES: string[] = [
  "Nunca passe sua senha para ninguém, nem para quem diz ser do banco.",
  "Nunca informe códigos que chegam por mensagem no celular.",
  "O banco nunca pede para você transferir dinheiro para uma conta segura.",
  "O banco nunca manda alguém buscar seu cartão em casa.",
  "Na dúvida, desligue ou pare de responder e confirme por conta própria.",
];

export const SCAMS: Scam[] = [
  {
    id: "falso-parente",
    title: "Parente ou amigo com número novo",
    howItWorks:
      "Chega uma mensagem com a foto de alguém da família dizendo que trocou de número. Logo depois, a pessoa pede dinheiro com urgência.",
    whatToDo: [
      "Não faça nenhum Pix antes de confirmar.",
      "Ligue para o número antigo da pessoa, que você já tem salvo.",
      "Se preferir, peça uma ligação de voz ou de vídeo. Golpistas costumam inventar desculpas.",
    ],
  },
  {
    id: "falsa-central",
    title: "Falsa central do banco",
    howItWorks:
      "Alguém liga dizendo ser do banco e fala de uma compra estranha. Depois pede sua senha, um código ou uma transferência para proteger o dinheiro.",
    whatToDo: [
      "Desligue a ligação.",
      "Ligue você mesmo para o número que está atrás do seu cartão.",
      "Se puder, use outro telefone para fazer essa ligação.",
    ],
  },
  {
    id: "codigo-whatsapp",
    title: "Pedido do código do WhatsApp",
    howItWorks:
      "Alguém pede o código de 6 números que chegou por mensagem, com uma desculpa como uma pesquisa ou um cadastro. Com esse código, a pessoa toma conta do seu WhatsApp.",
    whatToDo: [
      "Nunca passe esse código para ninguém.",
      "Ative a confirmação em duas etapas: no WhatsApp, abra Configurações, depois Conta e depois Confirmação em duas etapas.",
      "Escolha uma senha de 6 números que só você saiba.",
    ],
  },
  {
    id: "links-falsos",
    title: "Links de prêmio, entrega ou dívida",
    howItWorks:
      "Chega uma mensagem sobre um prêmio, uma encomenda parada ou uma conta atrasada, com um link para resolver na hora.",
    whatToDo: [
      "Não toque no link.",
      "Confira a informação no aplicativo ou no site oficial da empresa, digitando você mesmo o endereço.",
      "Apague a mensagem.",
    ],
  },
  {
    id: "motoboy-cartao",
    title: "Funcionário que vai buscar o cartão",
    howItWorks:
      "Depois de uma falsa ligação do banco, dizem que um funcionário ou motoboy vai buscar seu cartão em casa.",
    whatToDo: [
      "Não entregue o cartão para ninguém.",
      "Se quiser se desfazer do cartão, corte-o você mesmo.",
      "Ligue para o banco pelo número atrás do cartão.",
    ],
  },
  {
    id: "pix-errado",
    title: "Pix enviado por engano",
    howItWorks:
      "Alguém diz que mandou um Pix para você por engano e pede que você devolva para outra conta.",
    whatToDo: [
      "Não transfira para a conta que a pessoa indicar.",
      "Confira no aplicativo do seu banco se o dinheiro chegou mesmo.",
      "Se chegou, use a opção de devolver o Pix no aplicativo do banco. Ela devolve para a conta de origem.",
    ],
  },
];

export const WARNING_SIGNS: string[] = [
  "Pressa: dizem que você precisa resolver agora.",
  "Pedido de segredo: pedem para não contar a ninguém.",
  "Prêmio inesperado ou oferta boa demais.",
  "Ameaça: dizem que sua conta ou seu nome vão ser bloqueados.",
  "Pedido de senha, código ou dados do cartão.",
];

export const IF_SCAMMED: { title: string; text: string }[] = [
  {
    title: "Ligue para o banco na hora",
    text: "Use o número que está atrás do cartão. Peça o bloqueio do cartão e da conta.",
  },
  {
    title: "Se foi um Pix, peça a contestação",
    text: "Avise o banco o quanto antes e peça para abrir a contestação do Pix. Quanto mais rápido, maior a chance de recuperar o dinheiro.",
  },
  {
    title: "Troque suas senhas",
    text: "Troque a senha do banco e dos aplicativos que podem ter sido usados.",
  },
  {
    title: "Registre um boletim de ocorrência",
    text: "Você pode ir a uma delegacia. Em muitos estados, também dá para registrar pela internet, no site da Polícia Civil.",
  },
  {
    title: "Avise sua família e seus contatos",
    text: "Se o seu WhatsApp foi usado, avise que não foi você quem pediu dinheiro.",
  },
];
