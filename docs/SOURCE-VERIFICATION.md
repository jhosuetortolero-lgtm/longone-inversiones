# Source verification report

All sources were consulted on **24 November 2026**. The raw evidence, with verbatim quotes, is in:

- `research/<slug>.json`: one file per development
- `research/longone-official.json`: Longone's own listings
- `research/destinations.json`: destination facts and photo licences

The published values live in `src/data/developments.ts` and `src/data/destinations.ts`.

The `research/` folder stays in the author's local copy and is not published in the repository, because it records third-party prices and sales claims that are marked "do not publish".

## Rules applied

1. **Project facts** come first from the construtora or developer's official page. If there is none, they come from Longone's listing, then from realtor or portal pages.
2. **Commercial stage and delivery** come from the developer when it states them. If it does not, Longone's own listing is used, because Longone is the commercial representative.
3. **Values that conflict and cannot be reconciled are not published.** They are listed below for Longone to confirm.
4. **Never published:** prices, payment plans, yields, appreciation or occupancy claims, and "% vendido" badges. Construction percentages are published only when the builder dates them.
5. Every development page shows its sources, the consultation date and a note that delivery dates need confirmation.

## Longone official listings (longoneinversiones.com.br)

| Code | Name on Longone | Stage | Delivery forecast | "Estágios da obra" |
|---|---|---|---|---|
| VEM_41910 | Green Sea Oceanique | Pré-Lançamento | 30/11/2030 | 0 % |
| VEM_41914 | Caminho das ondas | Pré-Lançamento | 30/11/2028 | 0 % |
| VEM_41892 | Morê Nature Spa | Em Construção | 01/09/2029 | 0 % |
| VEM_41900 | María Farinha Flats Residence | Em Construção | 30/11/2027 | 80 % |
| VEM_41912 | Green Sea Essence | Pré-Lançamento | 30/09/2029 | 0 % |

What the site does and does not publish:

- Every listing shows the price as "Sob Consulta".
- No phone number, WhatsApp number or e-mail is published. The WhatsApp links have an empty `phone=` parameter.
- The "Quem Somos" text is generic copy from the CRM template. It has no history, founding date or track record that could be quoted.
- The page title reads "CRECI PF" but gives no registration number.

---

## Green Sea Oceanique (VEM_41910)

**Sources**

- Primary: Júlio Veras Imobiliária pre-sales page, greenseaoceanique.julioverasimobiliaria.imb.br. This is a realtor page; the page never names the developer.
- Longone listing.

**Published**

| Field | Value | Source |
|---|---|---|
| Location | Maragogi, Alagoas | realtor page ("localizado em Maragogi/AL") |
| Concept | Home resort de padrão internacional | realtor page |
| Stage | Pré-lançamento | Longone (realtor says "Pré-Vendas") |
| Delivery | Novembro de 2030 | Longone only |
| Land | aprox. 14 ha | realtor page text |
| Typologies | Studios (Índico ~19–23 m², Atlântico ~18–24 m²); 1 quarto ~33–38 m²; 3 suítes ~88 m² and ~162–165 m² (Atlântico Sul) | realtor page "Tipologias" |
| Amenities | 24 items: Beach Club, Oceanique Mall, piscina com correnteza, praia artificial… | realtor page |

**Conflicts and items not published**

- Land area: an image reads 137.759 m²; the page text says 14 hectares. The two are consistent once rounded, so the text figure is published.
- Towers: the FAQ names only "Índico e Atlântico", but the typology list also has "Torre Atlântico Sul". The tower count is not published; tower names appear only where the typology list uses them.
- 1.515 units, 1.434 parking spaces and 28 shops appear only inside a marketing image. Not published.
- The renders carry an "ALBUQUERQUE" logo, but the page never names the developer. The developer is not published.
- The coordinates come only from the page's Google Maps link. The map link on our site uses the city instead.
- Not published: prices from R$ 272 mil, "Valorização de até 125%", "+95% de ocupação" and "Valorização garantida".
- Images: about 1000 px slides captured from a PDF presentation. Captions are burned into the images, and the developer logos are visible.

## Caminho das Ondas (VEM_41914)

**Sources**

- Primary: Queiroz Almeida Construtora e Incorporadora, the official builder page.
- Longone listing.

**Published**

| Field | Value | Source |
|---|---|---|
| Location | Maragogi, Alagoas | construtora |
| Concept | Studios de alto padrão | construtora (Padrão "Alto"; "Apartamentos modelo Studio") |
| Stage | Em obra | construtora ("Em Obra") |
| Delivery | Novembro de 2028 | construtora and Longone agree |
| Units / towers / floors | 36 units, 1 tower, 5 floors | construtora technical sheet |
| Typology | Studio, 22–24 m² | construtora |
| Short-stay | "Estrutura … desenhada para locação por temporada (short stay)" | construtora |

**Conflicts and items not published**

- Stage: Longone says **Pré-Lançamento**, the construtora says **Em Obra**. The construtora value is published. **Confirm with Longone.**
- The technical sheet says "Quartos 0 - 1" and "ou Apartamente", but the units section lists only studios. Only the studio is published.
- Not on the page: address, architect, land area, prices.

## Morê Nature Spa (VEM_41892)

**Sources**

- Developer: Morevie, official page and the JSON data behind it.
- Realtor: Thayane Moura.
- Longone listing.

**Published**

| Field | Value | Source |
|---|---|---|
| Location | Tamandaré, Pernambuco; Rua Monteiro Lobato, 117 (map link) | Morevie |
| Distance to sea | about 500 m | realtor |
| Stage | Lançamento | Morevie ("Lançamentos") and realtor |
| Delivery | "36 meses a partir do lançamento" | Morevie |
| Units / tower / floors | 240 units, 1 tower, ground floor + 5 floors + rooftop | realtor and Morevie |
| Land / built area | 2.400 m² / 8.209,39 m² | Morevie |
| Architect | Heitor Carvalho Studio | Morevie |
| Hosting management | AFT (Alugue Flat Temporada) | realtor and Morevie |
| Typologies | Studios 22,25–25,67 m²; Garden 22,25 m²; Apartamento Ocean 40,94 m² | realtor; consistent with Longone's "22 a 40 m²" |

**Conflicts and items not published**

- Stage: Longone says **Em Construção**, the developer says **Lançamentos**. The developer value is published. **Confirm with Longone.**
- Delivery: Longone gives 01/09/2029. The developer gives only "36 months from launch" and no launch date. Longone's date is not published. **Confirm.**
- Unit area: the developer gives 22,2 m² only; the realtor gives the full range. The realtor range is published and flagged here.
- "Summer" is a studio concept on the realtor page but an apartment on the developer's floor plan.
- Vila name: "Vila Armindo" or "Vila Padre Arlindo". Not published.
- The developer's text mentions "Praia dos Carneiros", while its address data says Praia de Tamandaré. The beach is not published.
- Builder: "Vertical Engenharia" or "Construtora Vertical". Not published.
- Not published: R$ 266.000, instalments, "70% vendido!" and the return claims.

## María Farinha Flats Residence (VEM_41900)

**Sources**

- Builder: Multtecnica Engenharia, official page (WordPress, modified 2026-10-28).
- Portal: expoimovel.com.
- Longone listing.

The display name follows Longone's catalogue ("María"). The place name stays "Maria Farinha".

**Published**

| Field | Value | Source |
|---|---|---|
| Location | Av. Rui Barbosa, 26, Maria Farinha, Paulista, PE (map link) | expoimovel |
| Concept | Condomínio hoteleiro of flats and apartments | builder |
| Stage | Em construção | builder and Longone |
| Delivery | Novembro de 2027 | Longone |
| Towers / floors | 4 towers / 9 floors | builder / expoimovel |
| Typologies | 1 quarto aprox. 25 m²; 2 quartos (1 suíte) 51,32 m²; 3 quartos (1 suíte) 59,81 m² | expoimovel; builder |
| Construction progress | Stage 1: foundation 100 %, structure 96,75 %, finishes 31,76 %. Stage 2: 100 % / 64,94 % / 9,17 %. Infrastructure 18,96 % | builder, page modified 28/10/2026 |

**Conflicts and items not published**

- Delivery: expoimovel's price table says 31/01/2027, but that table is marked "Desativada ou Desatualizada". Longone says 30/11/2027. Longone's date is published. **Confirm.**
- Longone shows "80% Concluídos" without a date. The builder's dated, per-stage figures are published instead.
- Area of the 1-bedroom unit: 25,19 m² (portal) or 25,54 m² (builder). It is published as "aprox. 25 m²" with a visible note.
- Not published: prices of R$ 202.000 or R$ 212 mil.
- Images: the portal renders are 1024 px, with a legal strip and a light "Mult tecnica" watermark. The builder renders are 1920 px or larger.

## Green Sea Essence (VEM_41912)

**Sources**

- Longone listing.
- Realtor: Balbino Júnior Imóveis. No developer or construtora is named in any source.

**Published**

| Field | Value | Source |
|---|---|---|
| Location | Praia das Campas, Tamandaré, PE | realtor address; Longone gives "Rua Luiz Gonzaga da Silva" |
| Stage | Pré-lançamento | Longone |
| Delivery | Setembro de 2029 | Longone; the realtor says "2029" |
| Units | 257 + 8 shops | realtor |
| Typologies | Studio 19,76–21,27 m²; 1 quarto 28,44–32,09 m²; 2 quartos 39,64 m² | realtor |
| Amenities | 8 on the ground floor + 12 on the rooftop | realtor |

**Conflicts and items not published**

- Stage: Longone says **Pré-Lançamento**, the realtor says **Lançamento**. Longone's value is published. **Confirm.**
- Parking: "1 Garagem" in the listing fields, but "74 vagas rotativas" for 257 units in the description. Not published.
- 2-bedroom unit: "1 suíte + lavabo" in the fields, but only "Banheiro social" in the description. The suite is not published.
- Floors: the hidden data (5 floors × 20) does not match 257 units, so floors are not published.
- Title says "Praia de Tamandaré", address says "Praia das Campas". The address is published.
- Not published: R$ 311.000,00 (the source does not say which unit it is for).
- **All 30 images carry the "BALBINO JUNIOR" watermark.** Replacing them with the developer's own files is a priority.

---

## Destinations

All facts come from Portuguese Wikipedia, with verbatim quotes in `research/destinations.json`. Photos are Wikimedia Commons files under:

- Public Domain Mark
- CC BY 2.0 or 3.0
- CC BY-SA 3.0 or 4.0

Author, licence and link are shown next to each photo and on the credits page (`/es/creditos`, `/pt/creditos`).

- The Maragogi photo `maragogi-01` (public domain, Flickr) asks for the credit "Marco Ankosqui/MTur". The credits page shows that exact line.
- `pernambuco-coast-01` has a small "VISA" logo on a sail. It was not retouched, because altering third-party work is avoided.

## Pending confirmation by Longone (summary)

1. Commercial stage of Caminho das Ondas, Morê Nature Spa and Green Sea Essence. Longone and the developers disagree.
2. Delivery dates that rest on a single source:
   - Oceanique, 11/2030
   - Morê Nature Spa, 09/2029 (not published)
   - María Farinha, 11/2027
   - Essence, month 09/2029
3. Official contact channels. The form now sends to WhatsApp +55 81 99684-6263 (supplied by the project owner on 2026-11-24); e-mail and CRM endpoint are still missing.
4. CRECI registration number, if it is to be shown. (Office address — Rua Dom Expedito Lopes, 19, Monte, Olinda – PE, 53240-200 — was supplied by the project owner on 2026-11-24 and is now published.)
5. Developer names for Green Sea Oceanique and Green Sea Essence.
6. Authorization to use the project images, or the original files supplied by the developers.
7. Approval of the brand copy, so that it matches how Longone actually works. The service descriptions in "Más que propiedades…" and "Invertir" are proposal copy, not verified facts.
