import type { Localized } from "../i18n";

export type DestinationSlug = "maragogi" | "tamandare" | "maria-farinha" | "pernambuco-coast";

export interface Destination {
  slug: DestinationSlug;
  name: Localized;
  region: Localized;
  state: "AL" | "PE";
  image: string;
  facts: { text: Localized; source: string }[];
}

/**
 * Facts: Portuguese Wikipedia (consulted 2026-11-24), quoted in research/destinations.json.
 * Photos: Wikimedia Commons, free licences — credits rendered from media.generated.json.
 */
export const destinations: Destination[] = [
  {
    slug: "maragogi",
    name: { es: "Maragogi", pt: "Maragogi" },
    region: { es: "Litoral norte de Alagoas", pt: "Litoral Norte de Alagoas" },
    state: "AL",
    image: "maragogi-03",
    facts: [
      {
        text: {
          es: "Municipio del litoral norte de Alagoas, a unos 130 km de Maceió por carretera.",
          pt: "Município do Litoral Norte de Alagoas, a cerca de 130 km de Maceió pelas rodovias.",
        },
        source: "https://pt.wikipedia.org/wiki/Maragogi",
      },
      {
        text: {
          es: "Con la marea baja se forman las piscinas naturales conocidas como Galés, a unos 6 km de la costa.",
          pt: "Na maré baixa se formam as piscinas naturais conhecidas como Galés, a cerca de 6 km da costa.",
        },
        source: "https://pt.wikipedia.org/wiki/Maragogi",
      },
      {
        text: {
          es: "Forma parte del Área de Protección Ambiental Costa dos Corais.",
          pt: "Integra a Área de Proteção Ambiental Costa dos Corais.",
        },
        source: "https://pt.wikipedia.org/wiki/Maragogi",
      },
    ],
  },
  {
    slug: "tamandare",
    name: { es: "Tamandaré", pt: "Tamandaré" },
    region: { es: "Litoral sur de Pernambuco", pt: "Litoral sul de Pernambuco" },
    state: "PE",
    image: "tamandare-01",
    facts: [
      {
        text: {
          es: "A 109 km al sur de Recife, con 16 km de playas bordeadas de cocoteros.",
          pt: "A 109 km ao sul do Recife, com 16 km de praias com coqueirais.",
        },
        source: "https://pt.wikipedia.org/wiki/Tamandar%C3%A9_(Pernambuco)",
      },
      {
        text: {
          es: "La Praia dos Carneiros, con su capilla de São Benedito, está en el municipio.",
          pt: "A Praia dos Carneiros, com a Capela de São Benedito, fica no município.",
        },
        source: "https://pt.wikipedia.org/wiki/Praia_dos_Carneiros",
      },
      {
        text: {
          es: "El estuario del río Formoso y los arrecifes forman piscinas naturales con la marea baja.",
          pt: "O estuário do rio Formoso e os recifes formam piscinas naturais na maré baixa.",
        },
        source: "https://pt.wikipedia.org/wiki/Praia_dos_Carneiros",
      },
    ],
  },
  {
    slug: "maria-farinha",
    name: { es: "Maria Farinha", pt: "Maria Farinha" },
    region: { es: "Paulista, litoral norte de Pernambuco", pt: "Paulista, litoral norte de Pernambuco" },
    state: "PE",
    image: "maria-farinha-01",
    facts: [
      {
        text: {
          es: "Playa del municipio de Paulista, en la Región Metropolitana de Recife, a 18 km al norte de la capital.",
          pt: "Praia do município de Paulista, na Região Metropolitana do Recife, a 18 km ao norte da capital.",
        },
        source: "https://pt.wikipedia.org/wiki/Paulista_(Pernambuco)",
      },
      {
        text: {
          es: "El pontal de Maria Farinha se encuentra junto a la desembocadura del río Timbó.",
          pt: "O pontal de Maria Farinha fica junto à foz do Rio Timbó.",
        },
        source: "https://pt.wikipedia.org/wiki/Rio_Timb%C3%B3_(Pernambuco)",
      },
    ],
  },
  {
    slug: "pernambuco-coast",
    name: { es: "Costa de Pernambuco", pt: "Litoral de Pernambuco" },
    region: { es: "Porto de Galinhas y Muro Alto, Ipojuca", pt: "Porto de Galinhas e Muro Alto, Ipojuca" },
    state: "PE",
    image: "pernambuco-coast-01",
    facts: [
      {
        text: {
          es: "En Porto de Galinhas, los corales forman piscinas de aguas claras y templadas entre manglares y cocoteros.",
          pt: "Em Porto de Galinhas, os corais formam piscinas de águas claras e mornas, entre mangues e coqueirais.",
        },
        source: "https://pt.wikipedia.org/wiki/Porto_de_Galinhas",
      },
      {
        text: {
          es: "Muro Alto debe su nombre a la barrera de arrecifes que rodea casi toda la playa.",
          pt: "Muro Alto deve o nome ao paredão de recifes que cerca quase toda a praia.",
        },
        source: "https://pt.wikipedia.org/wiki/Praia_de_Muro_Alto",
      },
    ],
  },
];

export const destinationBySlug = (slug: DestinationSlug) => destinations.find((d) => d.slug === slug)!;
