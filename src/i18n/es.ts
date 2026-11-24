const es = {
  localeName: "Español",
  htmlLang: "es",
  ogLocale: "es_ES",
  paths: { developments: "emprendimientos", credits: "creditos" },
  anchors: { developments: "emprendimientos", destinations: "destinos", invest: "invertir", contact: "contacto" },

  meta: {
    homeTitle: "Longone Inversiones Inmobiliárias — Propiedades frente al mar en Brasil",
    homeDescription:
      "Emprendimientos residenciales en la costa del Nordeste de Brasil: Maragogi, Tamandaré y Maria Farinha. Asesoría en español y portugués para compradores internacionales.",
    developmentDescription: (name: string, place: string) =>
      `${name}, en ${place}. Tipologías, áreas comunes, galería y ubicación. Consulte disponibilidad con un asesor de Longone.`,
    creditsTitle: "Créditos de imágenes y fuentes — Longone",
    creditsDescription: "Origen, autoría y licencias de las imágenes y de la información publicada en este sitio.",
    notFoundTitle: "Página no encontrada — Longone",
  },

  nav: {
    developments: "Emprendimientos",
    destinations: "Destinos",
    invest: "Invertir",
    contact: "Contacto",
    advisor: "Hablar con un asesor",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    skip: "Saltar al contenido",
    language: "Idioma",
    switchTo: "Ver en portugués",
    home: "Inicio de Longone",
    main: "Navegación principal",
  },

  hero: {
    title: ["El arte de vivir", "frente al mar."],
    lead: "Descubra oportunidades inmobiliarias exclusivas en destinos extraordinarios de Brasil.",
    explore: "Explorar emprendimientos",
    advisor: "Hablar con un asesor",
    scroll: "Deslice para recorrer",
    loading: "Preparando la secuencia",
    note: "Secuencia cinematográfica ilustrativa. No representa un emprendimiento específico.",
    chapters: [
      { label: "Interior", line: "Ambientes pensados para la luz y el silencio." },
      { label: "Umbral", line: "Cada espacio se abre hacia el horizonte." },
      { label: "Balcón", line: "El mar, parte de la vida diaria." },
      { label: "Arquitectura", line: "Volúmenes contemporáneos en la costa de Brasil." },
      { label: "Horizonte", line: "Destinos donde el litoral marca el ritmo." },
    ],
    signatureSub: "Más allá de los bienes raíces.",
    progress: "Progreso de la secuencia",
  },

  intro: {
    title: "Más que propiedades. Una nueva forma de invertir y vivir.",
    body: [
      "Longone reúne una selección de emprendimientos en el litoral del Nordeste de Brasil —Alagoas y Pernambuco— y acompaña a cada comprador desde la primera consulta.",
      "Atendemos en español y en portugués, con información verificada de cada proyecto y un interlocutor directo para resolver disponibilidad, tipologías y condiciones con las desarrolladoras.",
    ],
  },

  developments: {
    title: "Emprendimientos",
    lead: "Cinco proyectos en tres destinos de la costa nordestina. Cada ficha reúne la información publicada por sus desarrolladoras y por Longone.",
    view: "Ver emprendimiento",
    ref: "Ref.",
    stage: "Etapa",
    delivery: "Entrega prevista",
    typologies: "Tipologías",
    consult: "Consultar disponibilidad",
  },

  stages: {
    prelaunch: "Prelanzamiento",
    launch: "Lanzamiento",
    construction: "En obra",
  },

  destinations: {
    title: "Destinos",
    lead: "Arrecifes, piscinas naturales y playas de aguas tibias entre Recife y Maceió.",
    credit: "Foto",
    developmentsHere: "Emprendimientos en este destino",
    states: { AL: "Alagoas", PE: "Pernambuco" },
  },

  invest: {
    title: "Vivir la costa. Decidir con información.",
    lead: "Una propiedad frente al mar puede ser hogar, refugio de temporada o parte de un patrimonio. Le ayudamos a evaluar cada opción con datos claros.",
    items: [
      {
        title: "Vida costera",
        text: "Proyectos cercanos al mar, con áreas comunes de resort: piscinas, rooftops, spa y espacios para toda la familia.",
      },
      {
        title: "Propiedad en Brasil",
        text: "Información clara sobre cómo comprar un inmueble en Brasil siendo extranjero, antes de dar cualquier paso.",
      },
      {
        title: "Segunda residencia",
        text: "Studios y apartamentos de uno a tres dormitorios para estadías de vacaciones o temporadas largas.",
      },
      {
        title: "Alquiler de temporada",
        text: "Algunos proyectos fueron concebidos por sus desarrolladoras para el alquiler de corta estancia y cuentan con gestión de hospedaje. Consulte las condiciones de cada uno.",
      },
      {
        title: "Consultas internacionales",
        text: "Atención a distancia en su idioma, con documentación e información de cada proyecto antes de cualquier decisión.",
      },
    ],
    disclaimer:
      "La información de este sitio es referencial y no constituye oferta, promesa de rentabilidad ni garantía de valorización. Disponibilidad, precios y condiciones deben confirmarse con Longone.",
  },

  contact: {
    title: "Su próxima inversión comienza con una conversación.",
    lead: "Cuéntenos qué busca. Un asesor le responderá con disponibilidad e información de los proyectos que le interesan.",
    fields: {
      name: "Nombre completo",
      country: "País de residencia",
      language: "Idioma de preferencia",
      email: "Correo electrónico",
      whatsapp: "WhatsApp",
      development: "Emprendimiento de interés",
      message: "Mensaje",
      consent: "Acepto que Longone use estos datos para responder a mi consulta.",
    },
    hints: {
      whatsapp: "Elija el código de país y escriba su número.",
      optional: "opcional",
    },
    languages: { es: "Español", pt: "Portugués", en: "Inglés" },
    anyDevelopment: "Aún no lo sé / varios",
    ddi: "Código de país",
    otherDdi: "Otro código (escríbalo con +)",
    ddiPlaceholder: "Código",
    phonePlaceholder: "Número",
    otherCountry: "Otro país",
    otherCountryLabel: "Escriba su país",
    countryPlaceholder: "Seleccione un país",
    submit: "Enviar mensaje",
    whatsappNote: "Al enviar, WhatsApp se abrirá con su mensaje listo para Longone.",
    channel: "Atención por WhatsApp",
    office: "Oficina",
    officeMap: "Mapa con la ubicación de la oficina de Longone en Olinda",
    openMaps: "Abrir en Google Maps",
    wa: {
      greeting: "Hola, Longone. Me gustaría recibir información.",
      footer: "Enviado desde el sitio web",
    },
    opened: {
      title: "Su mensaje está listo en WhatsApp.",
      text: "Para completar el contacto, presione enviar en WhatsApp. Si no se abrió, use el botón de abajo.",
      open: "Abrir WhatsApp",
      again: "Escribir otra consulta",
    },
    sending: "Enviando…",
    success: {
      title: "Consulta enviada.",
      text: "Gracias. Un asesor de Longone le responderá por el medio que indicó.",
      again: "Enviar otra consulta",
    },
    error: {
      title: "No pudimos enviar su consulta.",
      text: "El servidor no confirmó la recepción. Revise su conexión e intente de nuevo en unos minutos.",
    },
    notConnected: {
      title: "El envío en línea aún no está activado.",
      text: "Esta propuesta todavía no está conectada al sistema de contactos de Longone, por lo que su consulta no fue enviada. Los canales oficiales se publicarán cuando Longone los confirme.",
      whatsapp: "Escribir por WhatsApp",
      email: "Escribir por correo",
    },
    errors: {
      required: "Complete este campo.",
      email: "Ingrese un correo válido, por ejemplo nombre@dominio.com.",
      whatsapp: "Ingrese solo números, espacios o guiones (6 a 15 dígitos).",
      ddi: "Elija el código de país.",
      intl: "Escriba el número completo empezando por +.",
      consent: "Necesitamos su autorización para responderle.",
      summary: "Revise los campos marcados.",
    },
    channelsPending: "Canales oficiales de atención: pendientes de confirmación por Longone.",
    privacy: "Sus datos se usan solo para responder a esta consulta.",
  },

  dev: {
    back: "Todos los emprendimientos",
    overview: "Presentación",
    facts: {
      location: "Ubicación",
      category: "Concepto",
      stage: "Etapa",
      delivery: "Entrega prevista",
      units: "Unidades",
      towers: "Torres",
      floors: "Pavimentos",
      land: "Terreno",
      built: "Área construida",
      developer: "Desarrolladora",
      builder: "Constructora",
      architect: "Proyecto arquitectónico",
      management: "Gestión de hospedaje",
      code: "Referencia Longone",
    },
    typologies: "Tipologías",
    area: "Área privativa",
    amenities: "Áreas comunes",
    gallery: "Galería",
    floorplans: "Plantas",
    location: "Ubicación",
    openMap: "Ver en el mapa",
    progress: "Avance de obra",
    progressSource: (source: string, date: string) => `Según ${source}, actualizado el ${date}.`,
    sources: "Fuentes de la información",
    consulted: "Consultado el",
    imageNotice:
      "Imágenes ilustrativas publicadas por la desarrolladora o por sus canales de venta. Pertenecen a sus autores y se muestran con fines de presentación; su uso público requiere autorización.",
    watermarkNotice: "Algunas imágenes conservan la marca de agua del sitio de origen.",
    deliveryNote: "Fechas y etapas según la información comercial vigente; sujetas a confirmación con la desarrolladora.",
    related: "Otros emprendimientos",
    ctaTitle: "¿Le interesa este proyecto?",
    ctaText: "Consulte disponibilidad, tipologías y condiciones con un asesor.",
    openImage: (n: number, total: number) => `Ampliar imagen ${n} de ${total}`,
  },

  lightbox: {
    close: "Cerrar",
    prev: "Imagen anterior",
    next: "Imagen siguiente",
    label: "Visor de imágenes",
  },

  footer: {
    tagline: "Propiedades en la costa del Nordeste de Brasil.",
    explore: "Explorar",
    language: "Idioma",
    credits: "Créditos y fuentes",
    proposal:
      "Propuesta conceptual de rediseño para Longone Inversiones Inmobiliárias. Sitio de demostración, no oficial.",
    images:
      "Las imágenes de los emprendimientos pertenecen a sus desarrolladoras y autores. Las fotografías de destinos se publican bajo licencias libres de Wikimedia Commons.",
    rights: "Longone Inversiones Inmobiliárias",
  },

  credits: {
    title: "Créditos y fuentes",
    lead: "Origen de la información y de las imágenes que aparecen en este sitio.",
    developments: "Emprendimientos",
    destinations: "Fotografías de destinos",
    film: "Secuencia cinematográfica",
    filmText: "Video original suministrado para esta propuesta. Representa un ambiente ilustrativo, no un emprendimiento específico.",
    brand: "Marca",
    brandText: "Logotipo original de Longone Inversiones Inmobiliárias, aislado del fondo sin alterar su geometría.",
    license: "Licencia",
    author: "Autor",
    source: "Fuente",
    images: "imágenes",
  },

  notFound: {
    title: "Esta página no existe.",
    text: "Puede que la dirección haya cambiado. Vuelva al inicio o explore los emprendimientos.",
    home: "Ir al inicio",
  },
};

export default es;
export type Dictionary = typeof es;
