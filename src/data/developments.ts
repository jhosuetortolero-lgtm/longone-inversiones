/**
 * Centralized property database.
 *
 * Every published value comes from a source listed in `sources` and documented in
 * docs/SOURCE-VERIFICATION.md (raw evidence: research/*.json, consulted 2026-11-24).
 * Rules applied:
 *  - project facts: construtora / developer official source first, then Longone, then realtors;
 *  - commercial stage & delivery: developer source when it states one, otherwise Longone's listing;
 *  - conflicting values that cannot be reconciled are NOT published (see verification report);
 *  - prices, yields, appreciation claims and "% sold" claims are never published.
 */
import type { Localized } from "../i18n";
import type { DestinationSlug } from "./destinations";

export type Stage = "prelaunch" | "launch" | "construction";
export type FactKey =
  | "units"
  | "towers"
  | "floors"
  | "land"
  | "built"
  | "developer"
  | "builder"
  | "architect"
  | "management";

export interface Typology {
  label: Localized;
  area: Localized | null;
  note?: Localized;
}

export interface SourceRef {
  label: string;
  url: string;
  kind: Localized;
}

export interface Shot {
  id: string;
  alt: Localized;
}

export interface Development {
  slug: string;
  code: string;
  name: string;
  destination: DestinationSlug;
  place: Localized;
  category: Localized;
  stage: Stage;
  delivery: Localized | null;
  tagline: Localized;
  description: Localized<string[]>;
  facts: { key: FactKey; value: Localized }[];
  typologies: Typology[];
  typologyNote?: Localized;
  amenities: { group: Localized | null; items: Localized<string[]> }[];
  progress?: {
    source: string;
    date: string;
    stages: { label: Localized; items: { label: Localized; value: number }[] }[];
  };
  hero: { id: string; layout: "full" | "split"; focus?: string };
  card: { id: string; focus?: string };
  gallery: Shot[];
  floorplans?: Shot[];
  locationShot?: Shot;
  map: { query: string; lat?: number; lng?: number };
  sources: SourceRef[];
  watermarked?: boolean;
}

const L = (es: string, pt: string): Localized => ({ es, pt });
const both = (v: string): Localized => ({ es: v, pt: v });

const LONGONE = (id: string, slug: string): SourceRef => ({
  label: "Longone Inversiones Inmobiliárias",
  url: `https://longoneinversiones.com.br/empreendimento/${id}/${slug}`,
  kind: L("Ficha comercial oficial de Longone", "Ficha comercial oficial da Longone"),
});

export const developments: Development[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "green-sea-oceanique",
    code: "VEM_41910",
    name: "Green Sea Oceanique",
    destination: "maragogi",
    place: L("Maragogi, Alagoas", "Maragogi, Alagoas"),
    category: L("Home resort de estándar internacional", "Home resort de padrão internacional"),
    stage: "prelaunch",
    delivery: L("Noviembre de 2030", "Novembro de 2030"),
    tagline: L(
      "Home resort con Beach Club y Oceanique Mall en la costa de Maragogi.",
      "Home resort com Beach Club e Oceanique Mall no litoral de Maragogi.",
    ),
    description: {
      es: [
        "Green Sea Oceanique se presenta como un home resort de estándar internacional en la costa de Maragogi, en el litoral norte de Alagoas, entre Recife y Maceió.",
        "El proyecto reúne un Beach Club con más de 5.400 m² de ocio a orillas del mar, el Oceanique Mall y un programa de bienestar con Spa & Wellness Center, piscina con corriente, playa artificial y parque acuático infantil.",
        "Las tipologías van desde studios compactos hasta apartamentos de tres suites, con administración profesional integrada de las unidades.",
      ],
      pt: [
        "O Green Sea Oceanique se apresenta como um home resort de padrão internacional no litoral de Maragogi, na costa norte de Alagoas, entre Recife e Maceió.",
        "O projeto reúne um Beach Club com mais de 5.400 m² de lazer à beira-mar, o Oceanique Mall e um programa de bem-estar com Spa & Wellness Center, piscina com correnteza, praia artificial e parque aquático kids.",
        "As tipologias vão de studios compactos a apartamentos de três suítes, com administração profissional integrada das unidades.",
      ],
    },
    facts: [{ key: "land", value: L("Aprox. 14 hectáreas", "Aprox. 14 hectares") }],
    typologies: [
      { label: L("Studio (Torre Índico)", "Studio (Torre Índico)"), area: L("aprox. 19 a 23 m²", "aprox. 19 a 23 m²") },
      { label: L("Studio (Torre Atlântico)", "Studio (Torre Atlântico)"), area: L("aprox. 18 a 24 m²", "aprox. 18 a 24 m²") },
      { label: L("1 dormitorio (Torre Atlântico)", "1 quarto (Torre Atlântico)"), area: L("aprox. 33 a 38 m²", "aprox. 33 a 38 m²") },
      { label: L("3 dormitorios, 3 suites (Torre Atlântico)", "3 quartos, 3 suítes (Torre Atlântico)"), area: L("aprox. 88 m²", "aprox. 88 m²") },
      { label: L("3 dormitorios, 3 suites (Torre Atlântico Sul)", "3 quartos, 3 suítes (Torre Atlântico Sul)"), area: L("aprox. 162 a 165 m²", "aprox. 162 a 165 m²") },
    ],
    typologyNote: L("Áreas aproximadas informadas en la presentación comercial.", "Áreas aproximadas informadas na apresentação comercial."),
    amenities: [
      {
        group: null,
        items: {
          es: ["Beach Club", "Oceanique Mall", "Piscina con corriente", "Playa artificial", "Piscina infantil", "Parque acuático infantil", "Spa & Wellness Center", "Gimnasio con fachada de vidrio", "Cancha de tenis", "Cancha polideportiva", "Concha acústica", "Salón de juegos", "Sala de cine", "Coworking", "Espacio gourmet", "Restaurante", "Self-market", "Ludoteca", "Pista para caminar", "Ciclovía", "Pet place", "Rooftop lounge", "Túnel de conexión", "Seguridad con biometría facial"],
          pt: ["Beach Club", "Oceanique Mall", "Piscina com correnteza", "Praia artificial", "Piscina infantil", "Parque aquático kids", "Spa & Wellness Center", "Academia com pele de vidro", "Quadra de tênis", "Quadra poliesportiva", "Concha acústica", "Salão de jogos", "Sala de cinema", "Coworking", "Espaço gourmet", "Restaurante", "Self-market", "Brinquedoteca", "Pista de caminhada", "Ciclovia", "Pet place", "Rooftop lounge", "Túnel de ligação", "Segurança com biometria facial"],
        },
      },
    ],
    hero: { id: "oceanique-aerial-01", layout: "full", focus: "50% 80%" },
    card: { id: "oceanique-aerial-01", focus: "50% 88%" },
    gallery: [
      { id: "oceanique-facade-01", alt: L("Acceso principal de Green Sea Oceanique", "Entrada principal do Green Sea Oceanique") },
      { id: "oceanique-beachclub-02", alt: L("Deck del Beach Club con camastros frente al mar", "Deck do Beach Club com espreguiçadeiras de frente para o mar") },
      { id: "oceanique-pool-03", alt: L("Piscina rodeada de cocoteros", "Piscina cercada de coqueiros") },
      { id: "oceanique-exterior-01", alt: L("Edificio de recepción y bar con cubierta curva", "Edifício de recepção e bar com cobertura curva") },
      { id: "oceanique-beachclub-01", alt: L("Cabañas del Beach Club junto a la playa", "Cabanas do Beach Club junto à praia") },
      { id: "oceanique-pool-04", alt: L("Piscina con pérgola y vista al mar", "Piscina com pergolado e vista para o mar") },
      { id: "oceanique-leisure-05", alt: L("Rooftop lounge con vista al mar", "Rooftop lounge com vista para o mar") },
      { id: "oceanique-interior-01", alt: L("Hall de entrada con pilares revestidos en madera", "Hall de entrada com pilares revestidos em madeira") },
      { id: "oceanique-interior-02", alt: L("Sala de estar y comedor integrados de una unidad", "Sala de estar e jantar integradas de uma unidade") },
      { id: "oceanique-leisure-01", alt: L("Piscina del spa bajo pérgola de madera", "Piscina do spa sob pergolado de madeira") },
      { id: "oceanique-leisure-02", alt: L("Sala de masajes del spa con vista al mar", "Sala de massagem do spa com vista para o mar") },
      { id: "oceanique-leisure-03", alt: L("Sauna revestida en madera", "Sauna revestida em madeira") },
      { id: "oceanique-pool-05", alt: L("Piscina infantil con juegos acuáticos", "Piscina infantil com brinquedos aquáticos") },
      { id: "oceanique-leisure-06", alt: L("Salón de juegos", "Salão de jogos") },
      { id: "oceanique-mall-01", alt: L("Oceanique Mall", "Oceanique Mall") },
    ],
    map: { query: "Maragogi, Alagoas, Brasil" },
    sources: [
      LONGONE("41910", "green-sea-oceanique"),
      {
        label: "Júlio Veras Imobiliária — Green Sea Oceanique",
        url: "https://greenseaoceanique.julioverasimobiliaria.imb.br/",
        kind: L("Página de preventa de la inmobiliaria", "Página de pré-vendas da imobiliária"),
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "caminho-das-ondas",
    code: "VEM_41914",
    name: "Caminho das Ondas",
    destination: "maragogi",
    place: L("Maragogi, Alagoas", "Maragogi, Alagoas"),
    category: L("Studios de alto estándar", "Studios de alto padrão"),
    stage: "construction",
    delivery: L("Noviembre de 2028", "Novembro de 2028"),
    tagline: L("Studios en Maragogi con rooftop y vista al mar.", "Studios em Maragogi com rooftop e vista para o mar."),
    description: {
      es: [
        "Caminho das Ondas es un edificio de studios de alto estándar en Maragogi, Alagoas, desarrollado por Queiroz Almeida Construtora e Incorporadora.",
        "En la cubierta, un rooftop reúne piscina, prainha, deck, gimnasio y espacios de convivencia con vista al mar. En la planta baja, lavandería colectiva y smart market.",
        "Según la constructora, la estructura del proyecto fue diseñada para el alquiler por temporada (short stay).",
      ],
      pt: [
        "O Caminho das Ondas é um edifício de studios de alto padrão em Maragogi, Alagoas, da Queiroz Almeida Construtora e Incorporadora.",
        "Na cobertura, um rooftop reúne piscina, prainha, deck, academia e espaços de convivência com vista para o mar. No térreo, lavanderia coletiva e smart market.",
        "Segundo a construtora, a estrutura do projeto foi desenhada para locação por temporada (short stay).",
      ],
    },
    facts: [
      { key: "units", value: both("36") },
      { key: "towers", value: both("1") },
      { key: "floors", value: both("5") },
      { key: "developer", value: both("Queiroz Almeida Construtora e Incorporadora") },
    ],
    typologies: [{ label: L("Studio", "Studio"), area: L("22 a 24 m²", "22 a 24 m²") }],
    amenities: [
      {
        group: L("Rooftop", "Rooftop"),
        items: {
          es: ["Piscina", "Prainha", "Deck boulevard", "Gimnasio", "Restaurante y cocina de apoyo", "Espacios de convivencia con vista al mar"],
          pt: ["Piscina", "Prainha", "Deck boulevard", "Academia", "Restaurante e apoio de cozinha", "Espaços de convivência com vista para o mar"],
        },
      },
      {
        group: L("Edificio", "Edifício"),
        items: {
          es: ["Lavandería colectiva", "Smart market", "Ascensor", "Accesibilidad para personas con discapacidad"],
          pt: ["Lavanderia coletiva", "Smart market", "Elevador", "Apoio PcD"],
        },
      },
    ],
    hero: { id: "ondas-aerial-01", layout: "split", focus: "50% 45%" },
    card: { id: "ondas-aerial-02", focus: "50% 40%" },
    gallery: [
      { id: "ondas-aerial-02", alt: L("Vista aérea diurna del edificio con el mar al fondo", "Vista aérea diurna do edifício com o mar ao fundo") },
      { id: "ondas-rooftop-01", alt: L("Rooftop con piscina de borde de vidrio", "Rooftop com piscina de borda de vidro") },
      { id: "ondas-pool-01", alt: L("Piscina del rooftop con prainha y deck de madera", "Piscina do rooftop com prainha e deck de madeira") },
      { id: "ondas-interior-bedroom-01", alt: L("Studio con cama doble y armario de vidrio", "Studio com cama de casal e armário de vidro") },
      { id: "ondas-rooftop-02", alt: L("Deck del rooftop con mesas y palmeras", "Deck do rooftop com mesas e palmeiras") },
      { id: "ondas-rooftop-03", alt: L("Rooftop al atardecer con restaurante iluminado", "Rooftop ao entardecer com restaurante iluminado") },
      { id: "ondas-interior-living-01", alt: L("Studio con cocina integrada y panel de madera", "Studio com copa integrada e painel de madeira") },
      { id: "ondas-aerial-03", alt: L("Vista aérea nocturna del edificio", "Vista aérea noturna do edifício") },
      { id: "ondas-facade-01", alt: L("Fachada nocturna a nivel de la calle", "Fachada noturna ao nível da rua") },
      { id: "ondas-interior-kitchen-02", alt: L("Cocina del studio con muebles verdes", "Copa do studio com armários verdes") },
      { id: "ondas-interior-bathroom-01", alt: L("Baño con revestimiento verde", "Banheiro com revestimento verde") },
      { id: "ondas-leisure-gym-01", alt: L("Gimnasio", "Academia") },
      { id: "ondas-leisure-smartmarket-01", alt: L("Smart market", "Smart market") },
      { id: "ondas-leisure-laundry-01", alt: L("Lavandería colectiva", "Lavanderia coletiva") },
    ],
    locationShot: {
      id: "ondas-location-01",
      alt: L("Foto aérea con la ubicación del terreno marcada", "Foto aérea com a localização do terreno marcada"),
    },
    map: { query: "Maragogi, Alagoas, Brasil" },
    sources: [
      {
        label: "Queiroz Almeida Construtora e Incorporadora",
        url: "https://queirozalmeidaconstrutora.com.br/empreendimentos/caminho-das-ondas",
        kind: L("Sitio oficial de la constructora", "Site oficial da construtora"),
      },
      LONGONE("41914", "caminho-das-ondas"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "more-nature-spa",
    code: "VEM_41892",
    name: "Morê Nature Spa",
    destination: "tamandare",
    place: L("Tamandaré, Pernambuco", "Tamandaré, Pernambuco"),
    category: L("Flats tipo studio y apartamentos", "Flats tipo studio e apartamentos"),
    stage: "launch",
    delivery: L("36 meses a partir del lanzamiento, según la desarrolladora", "36 meses a partir do lançamento, segundo a incorporadora"),
    tagline: L(
      "Naturaleza, arquitectura y bienestar a unos 500 m del mar en Tamandaré.",
      "Natureza, arquitetura e bem-estar a cerca de 500 m do mar em Tamandaré.",
    ),
    description: {
      es: [
        "Morê Nature Spa es un proyecto de Morevie en Tamandaré, Pernambuco, concebido para integrar naturaleza, arquitectura y bienestar, a unos 500 m del mar y cerca de la Marina de Tamandaré.",
        "El edificio tiene planta baja, cinco pavimentos y un rooftop de ocio con piscina de borde infinito, bar, restaurante, sauna, spa y espacio gourmet. En la planta baja, piscinas para adultos y niños, dos prainhas, deck y jardines.",
        "Las unidades se entregan con muebles fijos planificados y la gestión de hospedaje está a cargo de AFT (Alugue Flat Temporada). Los huéspedes cuentan con carrito de golf hasta la playa y servicio de apoyo de playa propio.",
      ],
      pt: [
        "O Morê Nature Spa é um projeto da Morevie em Tamandaré, Pernambuco, concebido para integrar natureza, arquitetura e bem-estar, a cerca de 500 m do mar e perto da Marina de Tamandaré.",
        "O edifício tem térreo, cinco pavimentos e um rooftop de lazer com piscina de borda infinita, bar, restaurante, sauna, spa e espaço gourmet. No térreo, piscinas adulto e infantil, duas prainhas, deck e jardins.",
        "As unidades são entregues com móveis fixos planejados e a gestão de hospedagem é da AFT (Alugue Flat Temporada). Os hóspedes contam com carrinho de golfe até a praia e serviço de apoio de praia exclusivo.",
      ],
    },
    facts: [
      { key: "units", value: both("240") },
      { key: "towers", value: both("1") },
      { key: "floors", value: L("Planta baja, 5 pavimentos y rooftop", "Térreo, 5 pavimentos e rooftop") },
      { key: "land", value: both("2.400 m²") },
      { key: "built", value: both("8.209,39 m²") },
      { key: "developer", value: both("Morevie") },
      { key: "architect", value: both("Heitor Carvalho Studio") },
      { key: "management", value: both("AFT — Alugue Flat Temporada") },
    ],
    typologies: [
      { label: L("Studios (conceptos Wave, Summer, Beach, Nature y Ocean)", "Studios (conceitos Wave, Summer, Beach, Nature e Ocean)"), area: both("22,25 a 25,67 m²") },
      { label: L("Garden, con área externa privativa", "Garden, com área externa privativa"), area: both("22,25 m²") },
      { label: L("Apartamento Ocean", "Apartamento Ocean"), area: both("40,94 m²") },
    ],
    amenities: [
      {
        group: L("Planta baja", "Térreo"),
        items: {
          es: ["Piscinas para adultos y niños", "Dos prainhas", "Deck", "Jardines", "Lounge", "Recepción", "Cafetería"],
          pt: ["Piscinas adulto e infantil", "Duas prainhas", "Deck", "Jardins", "Lounge", "Recepção", "Cafeteria"],
        },
      },
      {
        group: L("Rooftop", "Rooftop"),
        items: {
          es: ["Piscina de borde infinito", "Bar", "Restaurante", "Sauna", "Spa", "Área de hamacas", "Lounge", "Whiskería", "Espacio gourmet", "Ludoteca"],
          pt: ["Piscina com borda infinita", "Bar", "Restaurante", "Sauna", "Spa", "Redário", "Lounge", "Whiskeria", "Espaço gourmet", "Brinquedoteca"],
        },
      },
      {
        group: L("Servicios", "Serviços"),
        items: {
          es: ["Gimnasio", "Mini market", "Pet place", "Carrito de golf hasta la playa", "Apoyo de playa exclusivo"],
          pt: ["Academia", "Mini market", "Pet place", "Carrinho de golfe até a praia", "Apoio de praia exclusivo"],
        },
      },
    ],
    hero: { id: "more-aerial-01", layout: "full", focus: "50% 60%" },
    card: { id: "more-aerial-02", focus: "55% 55%" },
    gallery: [
      { id: "more-aerial-02", alt: L("Vista aérea al atardecer", "Vista aérea ao entardecer") },
      { id: "more-facade-01", alt: L("Fachada frontal con vegetación tropical", "Fachada frontal com vegetação tropical") },
      { id: "more-pool-01", alt: L("Piscina de la planta baja entre los bloques", "Piscina do térreo entre os blocos") },
      { id: "more-rooftop-pool-01", alt: L("Piscina de borde infinito en el rooftop", "Piscina com borda infinita no rooftop") },
      { id: "more-facade-02", alt: L("Fachada en perspectiva desde la avenida", "Fachada em perspectiva a partir da avenida") },
      { id: "more-pool-02", alt: L("Deck y prainha junto a la piscina", "Deck e prainha junto à piscina") },
      { id: "more-rooftop-pool-02", alt: L("Rooftop con vista al mar", "Rooftop com vista para o mar") },
      { id: "more-rooftop-deck-01", alt: L("Deck del rooftop con sofás", "Deck do rooftop com sofás") },
      { id: "more-leisure-01", alt: L("Lounge con vegetación tropical", "Lounge com vegetação tropical") },
      { id: "more-lounge-01", alt: L("Lounge con vista a la piscina", "Lounge com vista para a piscina") },
      { id: "more-bar-02", alt: L("Bar", "Bar") },
      { id: "more-restaurant-01", alt: L("Restaurante", "Restaurante") },
      { id: "more-spa-01", alt: L("Sala de tratamientos del spa", "Sala de tratamentos do spa") },
      { id: "more-spa-02", alt: L("Espacio del spa revestido en madera", "Espaço do spa revestido em madeira") },
      { id: "more-lobby-01", alt: L("Recepción", "Recepção") },
      { id: "more-interior-02", alt: L("Studio con cocina integrada", "Studio com cozinha integrada") },
      { id: "more-interior-03", alt: L("Sala de estar de una unidad", "Sala de estar de uma unidade") },
      { id: "more-interior-01", alt: L("Studio decorado", "Studio decorado") },
      { id: "more-balcony-01", alt: L("Balcón con vista al conjunto", "Varanda com vista para o conjunto") },
      { id: "more-garden-unit-01", alt: L("Unidad garden con área externa privativa", "Unidade garden com área externa privativa") },
      { id: "more-gym-01", alt: L("Gimnasio", "Academia") },
      { id: "more-exterior-01", alt: L("Acceso principal", "Acesso principal") },
    ],
    floorplans: [
      { id: "more-floorplan-terreo", alt: L("Planta de la planta baja", "Planta do térreo") },
      { id: "more-floorplan-tipo-2e4", alt: L("Planta tipo, pavimentos 2 y 4", "Planta tipo, pavimentos 2 e 4") },
      { id: "more-floorplan-rooftop", alt: L("Planta del rooftop", "Planta do rooftop") },
      { id: "more-floorplan-studio-nature", alt: L("Planta del Studio Nature, 22,2 m²", "Planta do Studio Nature, 22,2 m²") },
      { id: "more-floorplan-apto-summer", alt: L("Planta del Apto. Summer, 22,2 m²", "Planta do Apto. Summer, 22,2 m²") },
    ],
    map: { query: "Rua Monteiro Lobato, 117, Tamandaré - PE", lat: -8.7270864, lng: -35.094505 },
    sources: [
      {
        label: "Morevie — Morê Nature Spa",
        url: "https://www.morevie.com.br/empreendimento/more-nature-spa",
        kind: L("Sitio oficial de la desarrolladora", "Site oficial da incorporadora"),
      },
      {
        label: "Thayane Moura — Morê Nature Spa",
        url: "https://www.thayanemoura.com.br/morenaturespa",
        kind: L("Página de la corredora", "Página da corretora"),
      },
      LONGONE("41892", "mor-nature-spa"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "maria-farinha-flats-residence",
    code: "VEM_41900",
    name: "María Farinha Flats Residence",
    destination: "maria-farinha",
    place: L("Maria Farinha, Paulista, Pernambuco", "Maria Farinha, Paulista, Pernambuco"),
    category: L("Condominio hotelero de flats y apartamentos", "Condomínio hoteleiro de flats e apartamentos"),
    stage: "construction",
    delivery: L("Noviembre de 2027", "Novembro de 2027"),
    tagline: L(
      "Flats y apartamentos de hasta tres dormitorios en la playa de Maria Farinha.",
      "Flats e apartamentos de até três quartos na praia de Maria Farinha.",
    ),
    description: {
      es: [
        "María Farinha Flats Residence es un condominio hotelero de Multtecnica Engenharia en Maria Farinha, playa del municipio de Paulista, en el litoral norte de Pernambuco.",
        "El conjunto reúne cuatro torres de nueve pavimentos con portería, piscinas, rooftop, gimnasio, sauna, sala de relajación, coworking, beach tennis y pet place.",
        "Las tipologías van desde flats de un dormitorio hasta apartamentos de tres dormitorios con suite.",
      ],
      pt: [
        "O María Farinha Flats Residence é um condomínio hoteleiro da Multtecnica Engenharia em Maria Farinha, praia do município de Paulista, no litoral norte de Pernambuco.",
        "O conjunto reúne quatro torres de nove pavimentos com portaria, piscinas, rooftop, academia, sauna, sala de relax, coworking, beach tennis e pet place.",
        "As tipologias vão de flats de um quarto a apartamentos de três quartos com suíte.",
      ],
    },
    facts: [
      { key: "towers", value: both("4") },
      { key: "floors", value: both("9") },
      { key: "builder", value: both("Multtecnica Engenharia") },
    ],
    typologies: [
      { label: L("1 dormitorio", "1 quarto"), area: L("aprox. 25 m²", "aprox. 25 m²") },
      { label: L("2 dormitorios, 1 suite", "2 quartos, 1 suíte"), area: both("51,32 m²") },
      { label: L("3 dormitorios, 1 suite", "3 quartos, 1 suíte"), area: both("59,81 m²") },
    ],
    typologyNote: L(
      "El área del flat de un dormitorio varía entre fuentes (25,19 m² y 25,54 m²); pendiente de confirmación.",
      "A área do flat de um quarto varia entre as fontes (25,19 m² e 25,54 m²); aguardando confirmação.",
    ),
    amenities: [
      {
        group: null,
        items: {
          es: ["Piscina", "Rooftop", "Gimnasio", "Sauna", "Sala de relajación", "Coworking", "Beach tennis", "Minicancha", "Salón de juegos", "Salón de fiestas", "Ludoteca", "Parque infantil", "Pet place", "Tienda de conveniencia", "Lavandería", "Estacionamiento", "Portería y portón electrónico", "Sistema de seguridad"],
          pt: ["Piscina", "Rooftop", "Academia", "Sauna", "Sala de relax", "Coworking", "Beach tennis", "Mini campo", "Salão de jogos", "Salão de festas", "Brinquedoteca", "Playground", "Pet place", "Loja de conveniência", "Lavanderia", "Estacionamento", "Portaria e portão eletrônico", "Sistema de segurança"],
        },
      },
    ],
    progress: {
      source: "Multtecnica Engenharia",
      date: "2026-10-28",
      stages: [
        {
          label: L("Etapa 1", "1ª etapa"),
          items: [
            { label: L("Cimentación", "Fundação"), value: 100 },
            { label: L("Estructura", "Supraestrutura"), value: 96.75 },
            { label: L("Instalaciones y acabados", "Instalações e acabamento"), value: 31.76 },
          ],
        },
        {
          label: L("Etapa 2", "2ª etapa"),
          items: [
            { label: L("Cimentación", "Fundação"), value: 100 },
            { label: L("Estructura", "Supraestrutura"), value: 64.94 },
            { label: L("Instalaciones y acabados", "Instalações e acabamento"), value: 9.17 },
          ],
        },
        {
          label: L("Etapas 1 y 2", "1ª e 2ª etapas"),
          items: [{ label: L("Infraestructura general", "Infraestrutura geral"), value: 18.96 }],
        },
      ],
    },
    hero: { id: "mariafarinha-leisure-rooftop-02", layout: "full", focus: "50% 50%" },
    card: { id: "mariafarinha-facade-01", focus: "50% 45%" },
    gallery: [
      { id: "mariafarinha-facade-01", alt: L("Las cuatro torres vistas desde el mar", "As quatro torres vistas do mar") },
      { id: "mariafarinha-aerial-01", alt: L("Perspectiva aérea con la piscina central", "Perspectiva aérea com a piscina central") },
      { id: "mariafarinha-interior-varanda-01", alt: L("Balcón gourmet con vista al mar", "Varanda gourmet com vista para o mar") },
      { id: "mariafarinha-pool-01", alt: L("Piscina entre las torres", "Piscina entre as torres") },
      { id: "mariafarinha-facade-02", alt: L("Fachadas de las torres desde la arena", "Fachadas das torres a partir da faixa de areia") },
      { id: "mariafarinha-pool-02", alt: L("Piscina con palmeras y el mar al fondo", "Piscina com palmeiras e o mar ao fundo") },
      { id: "mariafarinha-leisure-rooftop-03", alt: L("Terraza con pérgola y vista a la costa", "Terraço com pergolado e vista para a costa") },
      { id: "mariafarinha-leisure-rooftop-01", alt: L("Salón con techo de madera trenzada", "Salão com forro de madeira trançada") },
      { id: "mariafarinha-pool-03", alt: L("Piscina con isla y sombrillas", "Piscina com ilha e guarda-sóis") },
      { id: "mariafarinha-leisure-deck-01", alt: L("Deck de la piscina con pabellón cubierto", "Deck da piscina com pavilhão coberto") },
      { id: "mariafarinha-interior-flat-01", alt: L("Flat decorado: dormitorio", "Flat decorado: quarto") },
      { id: "mariafarinha-interior-flat-02", alt: L("Flat decorado: ambiente integrado con cocina", "Flat decorado: ambiente integrado com cozinha") },
      { id: "mariafarinha-interior-flat-03", alt: L("Flat decorado: estar", "Flat decorado: estar") },
      { id: "mariafarinha-interior-living-01", alt: L("Sala integrada con cocina americana", "Sala integrada à cozinha americana") },
      { id: "mariafarinha-interior-bedroom-03", alt: L("Dormitorio principal", "Quarto de casal") },
      { id: "mariafarinha-exterior-portaria-01", alt: L("Acceso y portería del condominio", "Acesso e portaria do condomínio") },
      { id: "mariafarinha-leisure-academia-01", alt: L("Gimnasio", "Academia") },
      { id: "mariafarinha-leisure-jogos-01", alt: L("Salón de juegos", "Salão de jogos") },
      { id: "mariafarinha-leisure-brinquedoteca-01", alt: L("Ludoteca", "Brinquedoteca") },
      { id: "mariafarinha-leisure-beachtennis-01", alt: L("Cancha de beach tennis", "Quadra de beach tennis") },
      { id: "mariafarinha-leisure-petplace-01", alt: L("Pet place", "Pet place") },
      { id: "mariafarinha-facade-03", alt: L("Panorámica de las cuatro torres", "Panorâmica das quatro torres") },
    ],
    map: { query: "Av. Rui Barbosa, 26, Maria Farinha, Paulista - PE" },
    sources: [
      {
        label: "Multtecnica Engenharia — Maria Farinha Flat's Residence",
        url: "https://www.multtecnicaengenharia.com.br/maria-farinha/",
        kind: L("Sitio oficial de la constructora", "Site oficial da construtora"),
      },
      {
        label: "Expoimóvel — Maria Farinha Flats Residence",
        url: "https://www.expoimovel.com/emp/maria-farinha-flats-residence-lancamento/3768/pt/BR",
        kind: L("Portal inmobiliario", "Portal imobiliário"),
      },
      LONGONE("41900", "mara-farinha-flats-residence"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "green-sea-essence",
    code: "VEM_41912",
    name: "Green Sea Essence",
    destination: "tamandare",
    place: L("Praia das Campas, Tamandaré, Pernambuco", "Praia das Campas, Tamandaré, Pernambuco"),
    category: L("Studios y apartamentos de uno y dos dormitorios", "Studios e apartamentos de um e dois quartos"),
    stage: "prelaunch",
    delivery: L("Septiembre de 2029", "Setembro de 2029"),
    tagline: L(
      "Studios y apartamentos con ocio en planta baja y rooftop, en Tamandaré.",
      "Studios e apartamentos com lazer no térreo e no rooftop, em Tamandaré.",
    ),
    description: {
      es: [
        "Green Sea Essence es un edificio residencial en Praia das Campas, Tamandaré, en el litoral sur de Pernambuco, con 257 unidades y 8 locales comerciales con acceso independiente.",
        "El ocio se reparte en dos niveles: en la planta baja, piscina con carril y deck, cancha de arena, pet place y espacio infantil; en el rooftop, piscinas para adultos y niños, prainha, hidromasaje, sauna, gimnasio y lounge gourmet con parrilla.",
        "Las áreas comunes se entregan amuebladas y equipadas; las unidades incluyen cerradura electrónica y medidores de agua individuales.",
      ],
      pt: [
        "O Green Sea Essence é um edifício residencial na Praia das Campas, em Tamandaré, litoral sul de Pernambuco, com 257 unidades e 8 lojas com acesso independente.",
        "O lazer se divide em dois níveis: no térreo, piscina com raia e deck, quadra de areia, pet place e espaço kids; no rooftop, piscinas adulto e infantil, prainha, hidromassagem, sauna, academia e lounge gourmet com grill.",
        "As áreas comuns são entregues mobiliadas e equipadas; as unidades têm fechadura eletrônica e hidrômetros individuais.",
      ],
    },
    facts: [{ key: "units", value: L("257 + 8 locales comerciales", "257 + 8 lojas") }],
    typologies: [
      { label: L("Studio", "Studio"), area: both("19,76 a 21,27 m²") },
      { label: L("1 dormitorio", "1 quarto"), area: both("28,44 a 32,09 m²") },
      { label: L("2 dormitorios", "2 quartos"), area: both("39,64 m²") },
    ],
    amenities: [
      {
        group: L("Planta baja", "Térreo"),
        items: {
          es: ["Piscina con carril y deck", "Cancha de arena", "Parque infantil", "Espacio kids", "Pet place y pet wash", "Self market", "Lavandería", "Recepción y hall"],
          pt: ["Piscina com raia e deck", "Quadra de areia", "Playground", "Espaço kids", "Pet place & pet wash", "Self market", "Lavanderia", "Recepção e hall"],
        },
      },
      {
        group: L("Rooftop", "Rooftop"),
        items: {
          es: ["Piscina para adultos", "Piscina infantil", "Prainha", "Hidromasaje", "Área relax con jacuzzi", "Sauna", "Gimnasio", "Salón de juegos", "Espacio kids", "Lounge gourmet y parrilla", "Área de hamacas", "Deck con pérgolas"],
          pt: ["Piscina adulto", "Piscina infantil", "Prainha", "Hidromassagem", "Área relax com jacuzzi", "Sauna", "Academia", "Salão de jogos", "Espaço kids", "Lounge gourmet e grill", "Redário", "Deck com pergolados"],
        },
      },
    ],
    hero: { id: "essence-facade-02", layout: "full", focus: "50% 40%" },
    card: { id: "essence-facade-01", focus: "40% 50%" },
    gallery: [
      { id: "essence-facade-01", alt: L("Fachada con esquina curva", "Fachada com esquina curva") },
      { id: "essence-aerial-01", alt: L("Vista aérea con el rooftop y las piscinas", "Vista aérea com o rooftop e as piscinas") },
      { id: "essence-pool-03", alt: L("Prainha con camastros y el mar al fondo", "Prainha com espreguiçadeiras e o mar ao fundo") },
      { id: "essence-leisure-rooftop-03", alt: L("Lounge bajo pérgola con vista al mar", "Lounge sob pergolado com vista para o mar") },
      { id: "essence-pool-04", alt: L("Piscina de la planta baja con camastros", "Piscina do térreo com espreguiçadeiras") },
      { id: "essence-leisure-jacuzzi-01", alt: L("Hidromasajes en el rooftop", "Hidromassagens no rooftop") },
      { id: "essence-pool-01", alt: L("Piscina con carril, de noche", "Piscina com raia, à noite") },
      { id: "essence-pool-02", alt: L("Deck de la piscina del rooftop", "Deck da piscina do rooftop") },
      { id: "essence-leisure-gourmet-02", alt: L("Terraza gourmet del rooftop", "Terraço gourmet do rooftop") },
      { id: "essence-leisure-gourmet-03", alt: L("Mesas bajo sombrillas con vista al mar", "Mesas sob ombrelones com vista para o mar") },
      { id: "essence-leisure-rooftop-02", alt: L("Área de convivencia del rooftop", "Área de convivência do rooftop") },
      { id: "essence-facade-03", alt: L("Fachada lateral con cocoteros", "Elevação lateral com coqueiros") },
      { id: "essence-aerial-02", alt: L("Vista aérea del rooftop, las piscinas y el parque infantil", "Vista aérea do rooftop, das piscinas e do playground") },
      { id: "essence-facade-04", alt: L("Acceso con el letrero Green Sea Essence", "Acesso com o letreiro Green Sea Essence") },
      { id: "essence-interior-lobby-03", alt: L("Hall con revestimiento de piedra", "Hall com parede de pedra") },
      { id: "essence-interior-lobby-01", alt: L("Recepción", "Recepção") },
      { id: "essence-leisure-gym-01", alt: L("Gimnasio", "Academia") },
      { id: "essence-leisure-sauna-01", alt: L("Sauna", "Sauna") },
      { id: "essence-leisure-court-01", alt: L("Cancha de arena", "Quadra de areia") },
      { id: "essence-leisure-pet-01", alt: L("Pet place", "Pet place") },
    ],
    floorplans: [
      { id: "essence-floorplan-terreo-01", alt: L("Planta de implantación, planta baja", "Planta de implantação, térreo") },
      { id: "essence-floorplan-tipo-01", alt: L("Planta del pavimento tipo", "Planta do pavimento tipo") },
      { id: "essence-floorplan-rooftop-01", alt: L("Planta del rooftop", "Planta do rooftop") },
    ],
    map: { query: "Praia das Campas, Tamandaré - PE" },
    sources: [
      LONGONE("41912", "green-sea-essence"),
      {
        label: "Balbino Júnior Imóveis — Edf. Green Sea Essence",
        url: "https://balbinojunior.com.br/imovel/edf-green-sea-essence-apartamento-praia-de-tamandare",
        kind: L("Página de la inmobiliaria", "Página da imobiliária"),
      },
    ],
    watermarked: true,
  },
];

export const SOURCES_CONSULTED = "2026-11-24";

export const developmentBySlug = (slug: string | undefined) => developments.find((d) => d.slug === slug);

export const mapUrl = (d: Development) =>
  d.map.lat !== undefined && d.map.lng !== undefined
    ? `https://www.google.com/maps/search/?api=1&query=${d.map.lat},${d.map.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.map.query)}`;
