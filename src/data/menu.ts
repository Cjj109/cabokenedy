// Menu data - hardcoded from current menu (Phase 1)
// Phase 2: Replace with Google Sheets integration

export interface MenuItem {
  name: string;
  description?: string;
  priceUSD: number;
  variants?: { label: string; priceUSD: number }[];
  popular?: boolean;
  badge?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

// Tasa BCV manual fallback (actualizar en Google Sheets en Fase 2)
export const TASA_BCV = 375.08;

// Promo Estrella Fugaz (Flash) - Solo Lunes a Jueves
export const promoFlash = {
  id: "flash",
  name: "Estrella Fugaz",
  originalName: "Promo Flash",
  description: "Pollo Asado + 7 Hallaquitas + Refresco 1.5 LTS",
  priceUSD: 12.99,
  availability: "Lunes a Jueves",
  channels: "Pick up y Delivery",
  icon: "☄️",
  image: "/promos/flash.webp",
};

// Promos destacadas del PDF
export const promos = [
  {
    id: "resuelve",
    name: "Resuelve de Pollo",
    description: "Pollo Asado + 5 Hallaquitas + Ensalada + Refresco 1.5 LTS",
    priceUSD: 15,
    icon: "🍗",
    badge: "Promo",
    image: "/promos/resuelve.png",
  },
  {
    id: "asado",
    name: "Combo Pollo Asado",
    description: "Pollo Asado + Ens. Rallada o Mixta + Yuca Sancochada + Refresco 1.5 LTS",
    priceUSD: 16,
    icon: "🔥",
    badge: "Asado",
    image: "/promos/asado.png",
  },
  {
    id: "broaster",
    name: "Combo Pollo Broaster",
    description: "8 piezas de pollo frito + Ensalada Rallada + 8 Arepitas + Refresco 1.5 LTS",
    priceUSD: 18,
    icon: "🍗",
    badge: "Broaster",
    image: "/promos/broaster.png",
  },
  {
    id: "familiar",
    name: "Combo Familiar",
    description: "2 Pollos Asados + Contorno (ensalada/hallaquitas) + Contorno (papas/yuca/tostones) + Refresco 1.5 LTS",
    priceUSD: 25,
    icon: "👨‍👩‍👧‍👦",
    badge: "Familiar",
    image: "/promos/familiar.webp",
  },
  {
    id: "hamburguesa-familiar",
    name: "Promo Familiar Hamburguesa",
    description: "4 Hamburguesas de Carne + Ración de Papas Fritas + Refresco 1 LTS",
    priceUSD: 23,
    icon: "🍔",
    badge: "Familiar",
    image: "/promos/hamburguesa-familiar.webp",
  },
  {
    id: "2hamburguesas",
    name: "2 Hamburguesas de Carne",
    description: "2 Hamburguesas de Carne + Refresco 1 LTS",
    priceUSD: 10,
    icon: "🍔",
    badge: "Oferta",
    image: "/promos/2hamburguesas.webp",
  },
];

export const featuredCombos = [
  {
    id: "combo2",
    name: "Combo 2",
    pieces: "2 piezas",
    description: "2 piezas de pollo + 3 arepitas + ensalada rallada pequeña + refresco de botella",
    priceUSD: 10,
    badge: "Popular",
    icon: "🍗",
  },
  {
    id: "combo4",
    name: "Combo 4",
    pieces: "4 piezas",
    description: "4 piezas de pollo + 6 arepitas + ensalada rallada + refresco 1.5 LTS",
    priceUSD: 14,
    badge: "Familiar",
    icon: "🍗🍗",
  },
  {
    id: "combo6",
    name: "Combo 6",
    pieces: "8 piezas",
    description: "8 piezas de pollo + 8 arepitas + ensalada rallada + refresco 1.5 LTS",
    priceUSD: 18,
    badge: "Para compartir",
    icon: "🍗🍗🍗",
  },
];

export const menuCategories: MenuCategory[] = [
  {
    id: "combos",
    title: "Combos de Pollo Broaster",
    icon: "🍗",
    items: [
      {
        name: "Combo 1",
        description: "1 pieza de pollo + 2 arepitas + ensalada rallada pequeña + refresco de botella",
        priceUSD: 8,
      },
      {
        name: "Combo 2",
        description: "2 piezas de pollo + 3 arepitas + ensalada rallada pequeña + refresco de botella",
        priceUSD: 10,
        popular: true,
      },
      {
        name: "Combo 3",
        description: "3 piezas de pollo + 4 arepitas + ensalada rallada pequeña + refresco de botella",
        priceUSD: 12,
      },
      {
        name: "Combo 4",
        description: "4 piezas de pollo + 6 arepitas + ensalada rallada + refresco 1.5 LTS",
        priceUSD: 14,
        popular: true,
      },
      {
        name: "Combo 5",
        description: "5 piezas de pollo + 6 arepitas + ensalada rallada pequeña + refresco 1.5 LTS",
        priceUSD: 15,
      },
      {
        name: "Combo 6",
        description: "8 piezas de pollo + 8 arepitas + ensalada rallada + refresco 1.5 LTS",
        priceUSD: 18,
        popular: true,
      },
    ],
  },
  {
    id: "pollo",
    title: "Pollo Solo",
    icon: "🍗",
    items: [
      { name: "1 pieza de pollo", priceUSD: 3 },
      { name: "5 piezas de pollo", priceUSD: 10 },
      { name: "6 piezas de pollo", priceUSD: 12 },
      { name: "8 piezas de pollo", priceUSD: 14 },
      { name: "10 piezas de pollo", priceUSD: 17 },
    ],
  },
  {
    id: "hamburguesas",
    title: "Hamburguesas",
    icon: "🍔",
    items: [
      {
        name: "Hamburguesa Triple Acción",
        description: "Carne, pollo y chorizo",
        priceUSD: 10,
        variants: [
          { label: "Sola", priceUSD: 10 },
          { label: "Combo (papas + ensalada)", priceUSD: 12 },
        ],
      },
      {
        name: "Hamburguesa de Pollo",
        description: "Crispy o Grill",
        priceUSD: 7,
        variants: [
          { label: "Sola", priceUSD: 7 },
          { label: "Combo (papas + ensalada)", priceUSD: 10 },
        ],
      },
      {
        name: "Hamburguesa de Carne",
        priceUSD: 6,
        variants: [
          { label: "Sola", priceUSD: 6 },
          { label: "Combo (papas + ensalada)", priceUSD: 9 },
        ],
      },
    ],
  },
  {
    id: "pasapalos",
    title: "Milanesas y Pasapalos",
    icon: "🍟",
    items: [
      { name: "Milanesa de pollo", description: "Con papas fritas y ensalada", priceUSD: 11 },
      { name: "1/2 Milanesa de pollo", description: "Con papas fritas y ensalada", priceUSD: 8 },
      { name: "Pizza Margarita Individual", priceUSD: 6 },
      { name: "Tequeños (5 unidades)", priceUSD: 5 },
      { name: "Chicken Fingers / Nuggets", priceUSD: 8 },
      { name: "Alitas de Pollo", priceUSD: 8 },
      { name: "Sopa Cruzado de Res con Pollo", priceUSD: 9 },
    ],
  },
  {
    id: "raciones",
    title: "Raciones y Contornos",
    icon: "🍟",
    items: [
      { name: "Papas Fritas", description: "333 grs.", priceUSD: 5, popular: true },
      { name: "Yuca Sancochada", description: "1/2 kg", priceUSD: 5 },
      { name: "Yuca Frita", description: "15 unidades", priceUSD: 5 },
      { name: "Hallaquitas (por unidad)", priceUSD: 0.50 },
      { name: "Ración de Chorizo", description: "5 unidades", priceUSD: 12 },
      { name: "Ración de Morcilla", description: "5 unidades", priceUSD: 12 },
      {
        name: "Chorizo o Morcilla",
        description: "Por unidad",
        priceUSD: 3,
      },
      { name: "Pan con Ajo", priceUSD: 4 },
      { name: "Arepitas", description: "5 unidades", priceUSD: 3 },
      { name: "Tostones", priceUSD: 5 },
      {
        name: "Tostones Playeros",
        priceUSD: 7,
        variants: [
          { label: "Pequeño", priceUSD: 7 },
          { label: "Grande", priceUSD: 9 },
        ],
      },
    ],
  },
  {
    id: "ensaladas",
    title: "Ensaladas",
    icon: "🥗",
    items: [
      {
        name: "Ensalada de repollo con zanahoria",
        priceUSD: 3,
        variants: [
          { label: "Pequeña", priceUSD: 3 },
          { label: "Grande", priceUSD: 5 },
        ],
      },
      { name: "Ensalada tipo César", description: "Tipo César (tocineta sustituida por chorizo)", priceUSD: 7 },
      { name: "Ensalada tipo César con pollo", description: "Tipo César (tocineta sustituida por chorizo)", priceUSD: 13 },
      { name: "Ensalada tipo César con camarones", description: "Tipo César (tocineta sustituida por chorizo)", priceUSD: 16 },
      { name: "Ensalada Mixta", priceUSD: 6 },
      { name: "Ensalada Mixta con palmito", priceUSD: 13 },
      { name: "Ensalada Mixta de aguacate", priceUSD: 9 },
      { name: "Ensalada Mixta aguacate y palmito", priceUSD: 16 },
      { name: "Ración de Aguacate", priceUSD: 7 },
      { name: "Ración de Palmito", priceUSD: 8 },
      { name: "Ración de Aguacate y palmito", priceUSD: 13 },
    ],
  },
  {
    id: "carnes",
    title: "Carnes y Parrillas",
    icon: "🥩",
    items: [
      { name: "Churrasco de Solomo", description: "850 grs. al grill o a la brasa con 2 contornos", priceUSD: 25 },
      {
        name: "Bistec de Solomo",
        description: "400 grs. al grill o a la brasa con 2 contornos",
        priceUSD: 15,
        variants: [
          { label: "Tradicional", priceUSD: 15 },
          { label: "A Caballo", priceUSD: 20 },
        ],
      },
      {
        name: "Parrilla Mar y Tierra",
        priceUSD: 35,
        variants: [
          { label: "Pequeña (2 pers.)", priceUSD: 35 },
          { label: "Mediana (4 pers.)", priceUSD: 55 },
          { label: "Grande (5 pers.)", priceUSD: 75 },
        ],
      },
      {
        name: "Parrilla Especial",
        priceUSD: 20,
        variants: [
          { label: "Pequeña (1 pers.)", priceUSD: 20 },
          { label: "Mediana (2 pers.)", priceUSD: 30 },
          { label: "Grande (3 pers.)", priceUSD: 40 },
        ],
      },
      { name: "Parrilla Especial con Pollo", description: "Grande (4 personas)", priceUSD: 45 },
    ],
  },
  {
    id: "mariscos",
    title: "Pescados y Mariscos",
    icon: "🐟",
    items: [
      { name: "Rueda de Carite", description: "Con 2 contornos a elegir", priceUSD: 15 },
      { name: "Calamares Rebozados", description: "Con vegetales mixtos y papas fritas", priceUSD: 22 },
      { name: "Camarones Rebozados", description: "Con vegetales mixtos y papas fritas", priceUSD: 20 },
      { name: "Camarones al Ajillo", description: "Bañado con mantequilla de ajo", priceUSD: 24 },
      { name: "Grillada de Mariscos", description: "Mezcla de calamares con camarones y carite, papas fritas y vegetales", priceUSD: 45 },
    ],
  },
];

export function formatBs(usd: number): string {
  const bs = usd * TASA_BCV;
  return `Bs. ${bs.toFixed(0)}`;
}

export function getWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/584142920785?text=${encoded}`;
}

// Datos que el restaurante necesita para facturación y delivery
const customerDataTemplate = `

*Mis datos:*
• Cédula:
• Nombre y Apellido:
• Teléfono:
• Correo electrónico:
• Zona donde vivo:
• Ubicación Google Maps: `;

export function getComboWhatsAppMessage(comboName: string): string {
  return `¡Hola! 🍗 Me interesa pedir el *${comboName}* de Cabo Kenedy.${customerDataTemplate}`;
}

export function getPromoWhatsAppMessage(promoName: string): string {
  return `¡Hola! 🔥 Me interesa la *${promoName}* de Cabo Kenedy.${customerDataTemplate}`;
}

export function getFlashPromoWhatsAppMessage(): string {
  return `¡Hola! ☄️ Quiero pedir la *Promo Estrella Fugaz* (Pollo Asado + 7 Hallaquitas + Refresco) de Cabo Kenedy.${customerDataTemplate}`;
}

export function getGeneralWhatsAppMessage(): string {
  return `¡Hola! 🍗 Quiero hacer un pedido en Cabo Kenedy.${customerDataTemplate}`;
}
