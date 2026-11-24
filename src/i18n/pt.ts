import type { Dictionary } from "./es";

const pt: Dictionary = {
  localeName: "Português",
  htmlLang: "pt-BR",
  ogLocale: "pt_BR",
  paths: { developments: "empreendimentos", credits: "creditos" },
  anchors: { developments: "empreendimentos", destinations: "destinos", invest: "investir", contact: "contato" },

  meta: {
    homeTitle: "Longone Inversiones Inmobiliárias — Imóveis à beira-mar no Brasil",
    homeDescription:
      "Empreendimentos residenciais no litoral do Nordeste: Maragogi, Tamandaré e Maria Farinha. Atendimento em português e espanhol para compradores do Brasil e do exterior.",
    developmentDescription: (name: string, place: string) =>
      `${name}, em ${place}. Tipologias, áreas de lazer, galeria e localização. Consulte a disponibilidade com um consultor da Longone.`,
    creditsTitle: "Créditos de imagens e fontes — Longone",
    creditsDescription: "Origem, autoria e licenças das imagens e das informações publicadas neste site.",
    notFoundTitle: "Página não encontrada — Longone",
  },

  nav: {
    developments: "Empreendimentos",
    destinations: "Destinos",
    invest: "Investir",
    contact: "Contato",
    advisor: "Falar com um consultor",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    skip: "Pular para o conteúdo",
    language: "Idioma",
    switchTo: "Ver em espanhol",
    home: "Início da Longone",
    main: "Navegação principal",
  },

  hero: {
    title: ["A arte de viver", "de frente para o mar."],
    lead: "Descubra oportunidades imobiliárias exclusivas em destinos extraordinários do Brasil.",
    explore: "Explorar empreendimentos",
    advisor: "Falar com um consultor",
    scroll: "Role para percorrer",
    loading: "Preparando a sequência",
    note: "Sequência cinematográfica ilustrativa. Não representa um empreendimento específico.",
    chapters: [
      { label: "Interior", line: "Ambientes pensados para a luz e o silêncio." },
      { label: "Passagem", line: "Cada espaço se abre para o horizonte." },
      { label: "Varanda", line: "O mar como parte do dia a dia." },
      { label: "Arquitetura", line: "Volumes contemporâneos no litoral brasileiro." },
      { label: "Horizonte", line: "Destinos onde o litoral dita o ritmo." },
    ],
    signatureSub: "Além do mercado imobiliário.",
    progress: "Progresso da sequência",
  },

  intro: {
    title: "Mais que imóveis. Uma nova forma de investir e viver.",
    body: [
      "A Longone reúne uma seleção de empreendimentos no litoral do Nordeste — Alagoas e Pernambuco — e acompanha cada comprador desde o primeiro contato.",
      "Atendemos em português e em espanhol, com informações verificadas de cada projeto e um interlocutor direto para tratar de disponibilidade, tipologias e condições com as incorporadoras.",
    ],
  },

  developments: {
    title: "Empreendimentos",
    lead: "Cinco projetos em três destinos do litoral nordestino. Cada página reúne as informações publicadas pelas incorporadoras e pela Longone.",
    view: "Ver empreendimento",
    ref: "Ref.",
    stage: "Etapa",
    delivery: "Previsão de entrega",
    typologies: "Tipologias",
    consult: "Consultar disponibilidade",
  },

  stages: {
    prelaunch: "Pré-lançamento",
    launch: "Lançamento",
    construction: "Em obras",
  },

  destinations: {
    title: "Destinos",
    lead: "Recifes, piscinas naturais e praias de águas mornas entre Recife e Maceió.",
    credit: "Foto",
    developmentsHere: "Empreendimentos neste destino",
    states: { AL: "Alagoas", PE: "Pernambuco" },
  },

  invest: {
    title: "Viver o litoral. Decidir com informação.",
    lead: "Um imóvel à beira-mar pode ser casa, refúgio de temporada ou parte de um patrimônio. Ajudamos você a avaliar cada opção com dados claros.",
    items: [
      {
        title: "Vida no litoral",
        text: "Projetos próximos ao mar, com áreas comuns de resort: piscinas, rooftops, spa e espaços para toda a família.",
      },
      {
        title: "Imóvel no Brasil",
        text: "Informação clara sobre como comprar um imóvel no Brasil, inclusive para estrangeiros, antes de qualquer passo.",
      },
      {
        title: "Segunda residência",
        text: "Studios e apartamentos de um a três quartos para férias ou temporadas mais longas.",
      },
      {
        title: "Locação por temporada",
        text: "Alguns projetos foram concebidos pelas incorporadoras para locação de curta duração e contam com gestão de hospedagem. Consulte as condições de cada um.",
      },
      {
        title: "Atendimento internacional",
        text: "Atendimento a distância no seu idioma, com documentação e informações de cada projeto antes de qualquer decisão.",
      },
    ],
    disclaimer:
      "As informações deste site são referenciais e não constituem oferta, promessa de rentabilidade nem garantia de valorização. Disponibilidade, preços e condições devem ser confirmados com a Longone.",
  },

  contact: {
    title: "Seu próximo investimento começa com uma conversa.",
    lead: "Conte o que você procura. Um consultor responderá com disponibilidade e informações dos projetos do seu interesse.",
    fields: {
      name: "Nome completo",
      country: "País de residência",
      language: "Idioma de preferência",
      email: "E-mail",
      whatsapp: "WhatsApp",
      development: "Empreendimento de interesse",
      message: "Mensagem",
      consent: "Aceito que a Longone use estes dados para responder ao meu contato.",
    },
    hints: {
      whatsapp: "Escolha o código do país e digite seu número.",
      optional: "opcional",
    },
    languages: { es: "Espanhol", pt: "Português", en: "Inglês" },
    anyDevelopment: "Ainda não sei / vários",
    ddi: "Código do país",
    otherDdi: "Outro código (digite com +)",
    ddiPlaceholder: "Código",
    phonePlaceholder: "Número",
    otherCountry: "Outro país",
    otherCountryLabel: "Digite seu país",
    countryPlaceholder: "Selecione um país",
    submit: "Enviar mensagem",
    whatsappNote: "Ao enviar, o WhatsApp abrirá com sua mensagem pronta para a Longone.",
    channel: "Atendimento pelo WhatsApp",
    office: "Escritório",
    officeMap: "Mapa com a localização do escritório da Longone em Olinda",
    openMaps: "Abrir no Google Maps",
    wa: {
      greeting: "Olá, Longone. Gostaria de receber informações.",
      footer: "Enviado pelo site",
    },
    opened: {
      title: "Sua mensagem está pronta no WhatsApp.",
      text: "Para concluir o contato, toque em enviar no WhatsApp. Se ele não abriu, use o botão abaixo.",
      open: "Abrir WhatsApp",
      again: "Escrever outra mensagem",
    },
    sending: "Enviando…",
    success: {
      title: "Mensagem enviada.",
      text: "Obrigado. Um consultor da Longone responderá pelo canal que você indicou.",
      again: "Enviar outra mensagem",
    },
    error: {
      title: "Não foi possível enviar sua mensagem.",
      text: "O servidor não confirmou o recebimento. Verifique sua conexão e tente novamente em alguns minutos.",
    },
    notConnected: {
      title: "O envio on-line ainda não está ativado.",
      text: "Esta proposta ainda não está conectada ao sistema de contatos da Longone, por isso sua mensagem não foi enviada. Os canais oficiais serão publicados quando a Longone os confirmar.",
      whatsapp: "Escrever pelo WhatsApp",
      email: "Escrever por e-mail",
    },
    errors: {
      required: "Preencha este campo.",
      email: "Informe um e-mail válido, por exemplo nome@dominio.com.",
      whatsapp: "Use apenas números, espaços ou hífens (6 a 15 dígitos).",
      ddi: "Escolha o código do país.",
      intl: "Digite o número completo começando com +.",
      consent: "Precisamos da sua autorização para responder.",
      summary: "Revise os campos destacados.",
    },
    channelsPending: "Canais oficiais de atendimento: aguardando confirmação da Longone.",
    privacy: "Seus dados são usados apenas para responder a este contato.",
  },

  dev: {
    back: "Todos os empreendimentos",
    overview: "Apresentação",
    facts: {
      location: "Localização",
      category: "Conceito",
      stage: "Etapa",
      delivery: "Previsão de entrega",
      units: "Unidades",
      towers: "Torres",
      floors: "Pavimentos",
      land: "Terreno",
      built: "Área construída",
      developer: "Incorporadora",
      builder: "Construtora",
      architect: "Projeto arquitetônico",
      management: "Gestão de hospedagem",
      code: "Referência Longone",
    },
    typologies: "Tipologias",
    area: "Área privativa",
    amenities: "Áreas de lazer",
    gallery: "Galeria",
    floorplans: "Plantas",
    location: "Localização",
    openMap: "Ver no mapa",
    progress: "Andamento da obra",
    progressSource: (source: string, date: string) => `Segundo ${source}, atualizado em ${date}.`,
    sources: "Fontes das informações",
    consulted: "Consultado em",
    imageNotice:
      "Imagens ilustrativas publicadas pela incorporadora ou por seus canais de venda. Pertencem aos seus autores e são exibidas para fins de apresentação; o uso público exige autorização.",
    watermarkNotice: "Algumas imagens mantêm a marca d'água do site de origem.",
    deliveryNote: "Datas e etapas conforme a informação comercial vigente; sujeitas a confirmação com a incorporadora.",
    related: "Outros empreendimentos",
    ctaTitle: "Tem interesse neste projeto?",
    ctaText: "Consulte disponibilidade, tipologias e condições com um consultor.",
    openImage: (n: number, total: number) => `Ampliar imagem ${n} de ${total}`,
  },

  lightbox: {
    close: "Fechar",
    prev: "Imagem anterior",
    next: "Próxima imagem",
    label: "Visualizador de imagens",
  },

  footer: {
    tagline: "Imóveis no litoral do Nordeste brasileiro.",
    explore: "Explorar",
    language: "Idioma",
    credits: "Créditos e fontes",
    proposal:
      "Proposta conceitual de redesign para a Longone Inversiones Inmobiliárias. Site de demonstração, não oficial.",
    images:
      "As imagens dos empreendimentos pertencem às suas incorporadoras e autores. As fotografias de destinos são publicadas sob licenças livres do Wikimedia Commons.",
    rights: "Longone Inversiones Inmobiliárias",
  },

  credits: {
    title: "Créditos e fontes",
    lead: "Origem das informações e das imagens exibidas neste site.",
    developments: "Empreendimentos",
    destinations: "Fotografias de destinos",
    film: "Sequência cinematográfica",
    filmText: "Vídeo original fornecido para esta proposta. Representa um ambiente ilustrativo, não um empreendimento específico.",
    brand: "Marca",
    brandText: "Logotipo original da Longone Inversiones Inmobiliárias, isolado do fundo sem alterar sua geometria.",
    license: "Licença",
    author: "Autor",
    source: "Fonte",
    images: "imagens",
  },

  notFound: {
    title: "Esta página não existe.",
    text: "O endereço pode ter mudado. Volte ao início ou explore os empreendimentos.",
    home: "Ir para o início",
  },
};

export default pt;
