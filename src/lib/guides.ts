// Step-by-step guides for common phone and internet questions.
// Content rule: only general, verifiable instructions. Menu names vary by phone model,
// so steps say where to look instead of promising an exact path.

export type GuideCategory = "celular" | "internet";

export type GuideStep = { text: string; detail?: string };
export type GuideTerm = { term: string; meaning: string };

export type Guide = {
  slug: string;
  category: GuideCategory;
  title: string;
  summary: string;
  intro: string;
  steps: GuideStep[];
  terms?: GuideTerm[];
  tip?: string;
  warning?: string;
};

export const CATEGORIES: { id: GuideCategory; title: string; description: string }[] = [
  {
    id: "celular",
    title: "Celular",
    description: "Tarefas do dia a dia no aparelho: letras, volume, contatos, fotos e bateria.",
  },
  {
    id: "internet",
    title: "Internet",
    description: "Como se conectar, pesquisar e reconhecer sites de confiança.",
  },
];

const MODEL_NOTE =
  "Os nomes dos menus podem mudar um pouco de um celular para outro. Se não encontrar, use a lupa de busca dentro das Configurações.";

export const GUIDES: Guide[] = [
  {
    slug: "fazer-uma-ligacao",
    category: "celular",
    title: "Fazer uma ligação",
    summary: "Ligue para alguém digitando o número ou pelos contatos.",
    intro: "Você pode ligar digitando o número ou escolhendo um contato já salvo.",
    steps: [
      {
        text: "Abra o aplicativo Telefone.",
        detail: "O ícone costuma ser verde, com o desenho de um telefone.",
      },
      {
        text: "Toque em Teclado para digitar o número.",
        detail: "Se a pessoa já está salva, toque em Contatos e escolha o nome dela.",
      },
      {
        text: "Digite o número com o DDD.",
      },
      {
        text: "Toque no botão verde para ligar.",
      },
      {
        text: "Para desligar, toque no botão vermelho.",
      },
    ],
    terms: [
      {
        term: "DDD",
        meaning: "São os dois números do código da cidade ou região, que vêm antes do telefone.",
      },
    ],
  },
  {
    slug: "atender-uma-ligacao",
    category: "celular",
    title: "Atender e desligar uma ligação",
    summary: "Saiba o que fazer quando o celular tocar.",
    intro: "Quando alguém liga, aparecem na tela um botão verde e um botão vermelho.",
    steps: [
      {
        text: "Para atender, toque no botão verde.",
        detail:
          "Em alguns celulares, é preciso arrastar o botão verde com o dedo. Se a tela estiver bloqueada no iPhone, deslize o botão para a direita.",
      },
      {
        text: "Encoste o celular na orelha ou toque em Viva-voz para ouvir sem segurar.",
      },
      {
        text: "Para recusar ou desligar, toque no botão vermelho.",
      },
    ],
    terms: [
      {
        term: "Viva-voz",
        meaning: "Faz o som da ligação sair mais alto, para você falar com o celular longe do rosto.",
      },
    ],
    tip: "Se não reconhecer o número, você não precisa atender. Quem precisa mesmo falar com você costuma deixar recado ou ligar de novo.",
  },
  {
    slug: "salvar-um-contato",
    category: "celular",
    title: "Salvar um contato novo",
    summary: "Guarde o número de alguém para ligar depois sem precisar digitar.",
    intro: "Com o contato salvo, o nome da pessoa aparece na tela quando ela liga.",
    steps: [
      {
        text: "Abra o aplicativo Contatos.",
        detail: "Ele também pode estar dentro do aplicativo Telefone, na aba Contatos.",
      },
      {
        text: "Toque no sinal de mais (+) ou em Criar contato.",
      },
      {
        text: "Escreva o nome da pessoa.",
      },
      {
        text: "Digite o número com o DDD.",
        detail: "Exemplo: 11 98765-4321. O DDD é o código da cidade.",
      },
      {
        text: "Toque em Salvar (no iPhone, OK).",
      },
    ],
    terms: [
      {
        term: "DDD",
        meaning: "São os dois números do código da cidade ou região, que vêm antes do telefone.",
      },
    ],
  },
  {
    slug: "aumentar-letras-do-celular",
    category: "celular",
    title: "Deixar as letras do celular maiores",
    summary: "Aumente o tamanho do texto em todo o aparelho.",
    intro: "Letras maiores cansam menos a vista. Esse ajuste vale para quase todos os aplicativos.",
    steps: [
      {
        text: "Abra as Configurações do celular.",
        detail: "É o ícone de engrenagem. No iPhone, o nome é Ajustes.",
      },
      {
        text: "Procure a opção Tela ou Acessibilidade.",
        detail: "No iPhone: toque em Tela e Brilho.",
      },
      {
        text: "Toque em Tamanho da fonte (no iPhone, Tamanho do Texto).",
      },
      {
        text: "Arraste a barrinha para a direita até as letras ficarem confortáveis.",
        detail: "Você vê o resultado na hora. Pode ajustar quantas vezes quiser.",
      },
    ],
    terms: [
      { term: "Fonte", meaning: "É o tipo e o tamanho das letras que aparecem na tela." },
      {
        term: "Acessibilidade",
        meaning: "Conjunto de ajustes que deixam o celular mais fácil de usar.",
      },
    ],
    tip: MODEL_NOTE,
  },
  {
    slug: "aumentar-o-volume",
    category: "celular",
    title: "Aumentar o volume das chamadas e do toque",
    summary: "Ouça melhor as ligações e não perca nenhuma chamada.",
    intro: "O celular tem volumes separados: um para o toque e outro para a ligação.",
    steps: [
      {
        text: "Durante uma ligação, aperte o botão de cima na lateral do celular.",
        detail: "Esse botão aumenta o volume da voz de quem está falando com você.",
      },
      {
        text: "Para o volume do toque, abra as Configurações (no iPhone, Ajustes).",
      },
      {
        text: "Toque em Sons (no iPhone, Sons e Tato).",
      },
      {
        text: "Arraste a barrinha do toque para a direita.",
        detail: "Confira também se o modo silencioso não está ligado.",
      },
    ],
    terms: [
      { term: "Toque", meaning: "É o som que o celular faz quando alguém liga para você." },
    ],
    tip: MODEL_NOTE,
  },
  {
    slug: "tirar-e-encontrar-fotos",
    category: "celular",
    title: "Tirar uma foto e encontrar depois",
    summary: "Fotografe e saiba onde suas fotos ficam guardadas.",
    intro: "Toda foto tirada com o celular fica guardada no próprio aparelho.",
    steps: [
      {
        text: "Abra o aplicativo Câmera.",
        detail: "O ícone costuma ter o desenho de uma máquina fotográfica.",
      },
      {
        text: "Aponte o celular para o que quer fotografar e segure firme.",
      },
      {
        text: "Toque no botão redondo grande, embaixo ou ao lado da tela.",
      },
      {
        text: "Para ver a foto, abra o aplicativo Galeria ou Fotos.",
        detail: "No iPhone, o aplicativo se chama Fotos. No Android, pode ser Galeria ou Fotos.",
      },
    ],
    tip: "Para tirar a foto de você mesmo, toque no botão com duas setinhas em círculo. Ele troca a câmera de trás pela da frente.",
  },
  {
    slug: "ligar-a-lanterna",
    category: "celular",
    title: "Ligar a lanterna",
    summary: "Use a luz do celular para enxergar no escuro.",
    intro: "A lanterna usa a luz que fica atrás do celular, perto da câmera.",
    steps: [
      {
        text: "No Android, deslize o dedo de cima para baixo na tela.",
        detail: "Aparece um painel com vários botões pequenos.",
      },
      {
        text: "No iPhone, abra a Central de Controle.",
        detail:
          "Nos modelos sem botão de início, deslize do canto de cima à direita para baixo. Nos modelos com botão, deslize de baixo para cima.",
      },
      {
        text: "Toque no ícone da lanterna.",
      },
      {
        text: "Para apagar, toque de novo no mesmo ícone.",
      },
    ],
  },
  {
    slug: "economizar-bateria",
    category: "celular",
    title: "Fazer a bateria durar mais",
    summary: "Ajustes simples para a carga durar o dia todo.",
    intro: "Alguns ajustes reduzem o gasto de bateria sem atrapalhar o uso.",
    steps: [
      {
        text: "Diminua um pouco o brilho da tela.",
        detail: "A tela é o que mais gasta bateria. O ajuste fica nas Configurações, em Tela.",
      },
      {
        text: "Ligue o modo de economia de energia.",
        detail:
          "No Android: Configurações e depois Bateria. No iPhone: Ajustes, Bateria e Modo de Pouca Energia.",
      },
      {
        text: "Use o carregador que veio com o celular ou um de marca confiável.",
      },
    ],
    terms: [
      {
        term: "Modo de economia de energia",
        meaning:
          "Ajuste que reduz algumas funções do celular para a bateria durar mais tempo. Pode ser desligado quando quiser.",
      },
    ],
    tip: MODEL_NOTE,
  },
  {
    slug: "senha-de-bloqueio",
    category: "celular",
    title: "Proteger o celular com senha de bloqueio",
    summary: "Impeça que outras pessoas usem seu celular se ele for perdido.",
    intro:
      "Com a senha de bloqueio, só quem sabe a senha consegue abrir o celular. Ela protege suas fotos, mensagens e aplicativos de banco.",
    steps: [
      {
        text: "Abra as Configurações do celular (no iPhone, Ajustes).",
      },
      {
        text: "Procure Segurança ou Tela de bloqueio.",
        detail: "No iPhone: toque em Face ID e Código ou em Touch ID e Código.",
      },
      {
        text: "Escolha o tipo de bloqueio, como um PIN de números.",
      },
      {
        text: "Crie uma senha fácil para você lembrar e difícil para os outros adivinharem.",
        detail: "Evite datas de nascimento e sequências como 1234.",
      },
      {
        text: "Digite a senha de novo para confirmar.",
      },
    ],
    terms: [
      { term: "PIN", meaning: "É uma senha feita só de números." },
      {
        term: "Biometria",
        meaning: "É abrir o celular com a digital ou com o rosto, em vez de digitar a senha.",
      },
    ],
    warning: "Essa senha é só sua. Não passe para ninguém, nem para quem diz ser de alguma empresa.",
    tip: MODEL_NOTE,
  },
  {
    slug: "atualizar-o-celular",
    category: "celular",
    title: "Atualizar o celular",
    summary: "Receba correções de segurança e melhorias.",
    intro:
      "As atualizações corrigem falhas de segurança. Manter o celular atualizado ajuda a proteger você.",
    steps: [
      {
        text: "Conecte o celular no Wi-Fi e no carregador.",
        detail: "A atualização pode ser grande e demorar um pouco.",
      },
      {
        text: "Abra as Configurações (no iPhone, Ajustes).",
      },
      {
        text: "Procure Atualização de software ou Sistema.",
        detail: "No iPhone: toque em Geral e depois em Atualização de Software.",
      },
      {
        text: "Se houver uma atualização, toque em Baixar e instalar.",
      },
      {
        text: "Aguarde. O celular pode desligar e ligar sozinho durante a atualização.",
      },
    ],
    terms: [
      {
        term: "Atualização",
        meaning: "É uma nova versão do sistema do celular, com correções e melhorias.",
      },
    ],
    tip: MODEL_NOTE,
  },
  {
    slug: "conectar-no-wifi",
    category: "internet",
    title: "Conectar no Wi-Fi de casa",
    summary: "Use a internet da sua casa no celular.",
    intro:
      "Conectado ao Wi-Fi, você usa a internet de casa e economiza o pacote de dados do celular.",
    steps: [
      {
        text: "Abra as Configurações do celular (no iPhone, Ajustes).",
      },
      {
        text: "Toque em Wi-Fi.",
        detail: "Em alguns celulares, fica dentro de Conexões ou de Rede e internet.",
      },
      {
        text: "Confira se o Wi-Fi está ligado.",
      },
      {
        text: "Toque no nome da rede da sua casa.",
        detail: "O nome e a senha costumam estar numa etiqueta embaixo ou atrás do aparelho de internet.",
      },
      {
        text: "Digite a senha do Wi-Fi e toque em Conectar.",
        detail: "Depois disso, o celular se conecta sozinho sempre que você estiver em casa.",
      },
    ],
    terms: [
      { term: "Wi-Fi", meaning: "É a internet sem fio que chega pelo aparelho instalado na casa." },
      {
        term: "Rede",
        meaning: "É o nome de cada Wi-Fi disponível por perto.",
      },
    ],
    warning:
      "A senha do Wi-Fi é digitada só no seu celular. Este site nunca vai pedir essa senha.",
  },
  {
    slug: "wifi-ou-dados-moveis",
    category: "internet",
    title: "Wi-Fi ou dados móveis: qual a diferença",
    summary: "Entenda de onde vem a internet do seu celular.",
    intro: "O celular pode usar a internet de dois jeitos diferentes.",
    steps: [
      {
        text: "Wi-Fi é a internet de um lugar, como sua casa. Não gasta o seu pacote.",
      },
      {
        text: "Dados móveis é a internet do seu plano com a operadora. Funciona na rua, mas tem limite.",
      },
      {
        text: "Para ligar ou desligar os dados móveis no Android, deslize o dedo de cima para baixo na tela e toque em Dados móveis.",
      },
      {
        text: "No iPhone, abra a Central de Controle e toque no ícone de antena.",
        detail:
          "Nos modelos sem botão de início, deslize do canto de cima à direita para baixo. Nos modelos com botão, deslize de baixo para cima.",
      },
    ],
    terms: [
      {
        term: "Operadora",
        meaning: "É a empresa do seu chip, que oferece o plano de ligações e internet.",
      },
      {
        term: "Pacote de dados",
        meaning: "É a quantidade de internet que o seu plano permite usar no mês.",
      },
    ],
  },
  {
    slug: "pesquisar-na-internet",
    category: "internet",
    title: "Fazer uma pesquisa na internet",
    summary: "Encontre informações, endereços e notícias.",
    intro: "Para pesquisar, você usa um navegador, o aplicativo que abre os sites.",
    steps: [
      {
        text: "Abra o navegador.",
        detail: "Os mais comuns são o Chrome (no Android) e o Safari (no iPhone).",
      },
      {
        text: "Toque na barra comprida no alto da tela.",
      },
      {
        text: "Escreva o que você procura com palavras simples.",
        detail: "Exemplo: farmácia aberta perto de mim.",
      },
      {
        text: "Toque em Ir ou na lupa do teclado.",
      },
      {
        text: "Toque em um dos resultados para abrir o site.",
        detail:
          "Os primeiros resultados às vezes são propagandas, marcadas como Patrocinado. Eles não são necessariamente os melhores.",
      },
    ],
    terms: [
      { term: "Navegador", meaning: "É o aplicativo que usamos para abrir sites." },
      { term: "Site", meaning: "É uma página na internet, como a de uma loja ou de um jornal." },
    ],
  },
  {
    slug: "reconhecer-site-confiavel",
    category: "internet",
    title: "Saber se um site é confiável",
    summary: "Sinais para conferir antes de comprar ou preencher dados.",
    intro: "Sites falsos imitam lojas e bancos conhecidos. Alguns cuidados ajudam a identificar.",
    steps: [
      {
        text: "Leia com atenção o endereço do site, na barra do alto.",
        detail:
          "Golpistas usam nomes quase iguais, com uma letra trocada ou palavras a mais.",
      },
      {
        text: "Prefira digitar você mesmo o endereço ou usar o aplicativo oficial.",
        detail: "Evite abrir sites a partir de links recebidos por mensagem.",
      },
      {
        text: "Desconfie de preços muito abaixo do normal.",
      },
      {
        text: "Na dúvida, não preencha nada e peça ajuda a alguém de confiança.",
      },
    ],
    terms: [
      {
        term: "Cadeado ao lado do endereço",
        meaning:
          "Mostra que a conexão é protegida, mas não garante que o site é honesto. Sites falsos também podem ter cadeado.",
      },
      {
        term: "Link",
        meaning: "É um texto ou botão que, ao ser tocado, abre um site.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guidesByCategory(category: GuideCategory): Guide[] {
  return GUIDES.filter((guide) => guide.category === category);
}
