import type { Locale } from "../i18n";

/** Countries offered in the inquiry form: ISO 3166-1 code, international dialing code, names. */
export interface Country {
  iso: string;
  dial: string;
  es: string;
  pt: string;
}

const LIST: Country[] = [
  { iso: "DE", dial: "49", es: "Alemania", pt: "Alemanha" },
  { iso: "AR", dial: "54", es: "Argentina", pt: "Argentina" },
  { iso: "BO", dial: "591", es: "Bolivia", pt: "Bolívia" },
  { iso: "BR", dial: "55", es: "Brasil", pt: "Brasil" },
  { iso: "CA", dial: "1", es: "Canadá", pt: "Canadá" },
  { iso: "CL", dial: "56", es: "Chile", pt: "Chile" },
  { iso: "CO", dial: "57", es: "Colombia", pt: "Colômbia" },
  { iso: "CR", dial: "506", es: "Costa Rica", pt: "Costa Rica" },
  { iso: "EC", dial: "593", es: "Ecuador", pt: "Equador" },
  { iso: "SV", dial: "503", es: "El Salvador", pt: "El Salvador" },
  { iso: "ES", dial: "34", es: "España", pt: "Espanha" },
  { iso: "US", dial: "1", es: "Estados Unidos", pt: "Estados Unidos" },
  { iso: "FR", dial: "33", es: "Francia", pt: "França" },
  { iso: "GT", dial: "502", es: "Guatemala", pt: "Guatemala" },
  { iso: "HN", dial: "504", es: "Honduras", pt: "Honduras" },
  { iso: "IT", dial: "39", es: "Italia", pt: "Itália" },
  { iso: "MX", dial: "52", es: "México", pt: "México" },
  { iso: "NI", dial: "505", es: "Nicaragua", pt: "Nicarágua" },
  { iso: "PA", dial: "507", es: "Panamá", pt: "Panamá" },
  { iso: "PY", dial: "595", es: "Paraguay", pt: "Paraguai" },
  { iso: "PE", dial: "51", es: "Perú", pt: "Peru" },
  { iso: "PT", dial: "351", es: "Portugal", pt: "Portugal" },
  { iso: "PR", dial: "1", es: "Puerto Rico", pt: "Porto Rico" },
  { iso: "GB", dial: "44", es: "Reino Unido", pt: "Reino Unido" },
  { iso: "DO", dial: "1", es: "República Dominicana", pt: "República Dominicana" },
  { iso: "CH", dial: "41", es: "Suiza", pt: "Suíça" },
  { iso: "UY", dial: "598", es: "Uruguay", pt: "Uruguai" },
  { iso: "VE", dial: "58", es: "Venezuela", pt: "Venezuela" },
];

// Deterministic accent-insensitive sort (identical on the server and in every browser).
const key = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const sorted: Record<Locale, Country[]> = {
  es: [...LIST].sort((a, b) => (key(a.es) < key(b.es) ? -1 : 1)),
  pt: [...LIST].sort((a, b) => (key(a.pt) < key(b.pt) ? -1 : 1)),
};

export const countriesFor = (locale: Locale) => sorted[locale];
export const countryByIso = (iso: string) => LIST.find((c) => c.iso === iso);
