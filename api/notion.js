import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Target,
  FileText,
  FolderOpen,
  Receipt,
  Users,
  Search,
  Bell,
  ChevronRight,
  ArrowUpRight,
  Download,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Building2,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =========================================================================
   DONNÉES AFZ — extraction directe du workspace Notion PDJ Conseil
   (page "2026" → bases Société, Projets, Jalons, Dossiers, Factures,
   Contacts). Aucune donnée inventée, aucune interpolation. Les identifiants
   Notion sont conservés pour faciliter la traçabilité.
   Dernière extraction : 2026-04-20
   ========================================================================= */

const SOCIETE = {
  nom: "AFZ (Association Française de Zootechnie)",
  statut: "Client",
  lieu: "Place de l'Agronomie, 91120 Palaiseau, France",
};

const CONTACTS = [
  {
    id: "347dfc12-15cc-800e-bc6d-efbb2b96f287",
    prenom: "Valérie",
    nom: "Heuzé",
    email: "valerie.heuze@zootechnie.fr",
    telephone: "",
  },
];

const PROJETS = [
  {
    id: "347dfc12-15cc-81d2-ab68-cb5949885a86",
    nom: "BDAA — Banque de données de l'alimentation animale",
    strategie: "N.A",
    gouvernance: "Interne",
    demarrage: "2018",
    cloture: "2027",
    trl: 7,
    trl_cible: 9,
    objectif:
      "Animer et enrichir la Banque de données française de caractérisation des matières premières pour l'alimentation animale (Feedbase, FeedTables, Feedipedia, io-7, équations INRA), projet socle pérenne déclaré au CIR chaque année depuis 2021.",
    verrous:
      "Maintenir la cohérence scientifique d'une base pluri-décennale malgré l'hétérogénéité des méthodes d'analyse historiques et développer des équations de prédiction fiables sur données incomplètes.",
  },
  {
    id: "347dfc12-15cc-8196-8f3d-c5039e510a61",
    nom: "BDAA-IA — IA pour la nutrition animale",
    strategie: "N.A",
    gouvernance: "Interne",
    demarrage: "2025",
    cloture: "2027",
    trl: 3,
    trl_cible: 7,
    objectif:
      "Transformer la BDAA, Feedipedia et FeedBase en écosystème intelligent combinant ML/DL pour la prédiction nutritionnelle, API+RAG+LLM pour l'interrogation en langage naturel, et optimisation multi-objectifs agroécologiques.",
    verrous:
      "Prédire fiablement des valeurs nutritionnelles complexes (UFL, UFV, PDI) à partir de données historiques hétérogènes et incomplètes sur des ressources alternatives peu documentées.",
  },
  {
    id: "347dfc12-15cc-8145-b826-e2e6924fbb70",
    nom: "COPR'OR-FERM — Autonomie protéique & économie circulaire",
    strategie: "N.A",
    gouvernance: "Codev",
    demarrage: "2025",
    cloture: "2027",
    trl: 3,
    trl_cible: 6,
    objectif:
      "Caractériser des ressources alternatives (coproduits humides territoriaux, tourteaux fermentés sur soja et colza) pour renforcer l'autonomie protéique des élevages, filière porcine notamment.",
    verrous:
      "Qualifier des matrices variables et instables (humidité, fermentation) en maîtrisant leurs risques microbiologiques, leurs effets physiologiques et leur impact ACV.",
  },
  {
    id: "347dfc12-15cc-81be-8f35-d8b868dd7ce5",
    nom: "Sources de protéines UE — Étude DG Agri",
    strategie: "N.A",
    gouvernance: "Codev",
    demarrage: "2023",
    cloture: "2023",
    trl: 4,
    trl_cible: 7,
    objectif:
      "Identifier pour la DG Agri les stratégies d'alimentation permettant de diversifier les sources de protéines dans les systèmes de production animale européens, via 10 études de cas modélisées.",
    verrous:
      "Modéliser des scénarios de diversification cohérents sur des systèmes d'élevage européens hétérogènes et valider les facteurs d'influence sur l'autonomie protéique.",
  },
  {
    id: "347dfc12-15cc-8180-a91e-fb165ac8bb9f",
    nom: "Optim'Al v2 — R&D (calculateur de rations VL)",
    strategie: "N.A",
    gouvernance: "Presta",
    demarrage: "2021",
    cloture: "2022",
    trl: 5,
    trl_cible: 8,
    objectif:
      "Développer un calculateur de rations pour vaches laitières selon le système INRA 2018, optimisant simultanément les critères économie et autonomie protéique.",
    verrous:
      "Dépasser la programmation linéaire classique pour intégrer des valeurs de sortie non linéaires dépendantes des paramètres d'entrée.",
  },
  {
    id: "347dfc12-15cc-81f7-b455-cc4fb8e519b1",
    nom: "Optim'Al v2 — Application web (innovation)",
    strategie: "N.A",
    gouvernance: "Presta",
    demarrage: "2022",
    cloture: "2023",
    trl: 7,
    trl_cible: 9,
    objectif:
      "Porter le POC Excel Optim'Al v2 en application web opérationnelle pour éleveurs et nutritionnistes, développement confié à Adventiel.",
    verrous:
      "Transposer la logique d'optimisation INRA 2018 dans une architecture web multi-utilisateur sécurisée et ergonomique.",
  },
  {
    id: "347dfc12-15cc-81f7-95cc-ca74d3e9d0ba",
    nom: "Oriflaam / ALIM 3000 — Base Access pour CEREOPA",
    strategie: "N.A",
    gouvernance: "Codev",
    demarrage: "2024",
    cloture: "2026",
    trl: 7,
    trl_cible: 9,
    objectif:
      "Développer une base Access (ALIM 3000) reliant les données de l'observatoire Oriflaam aux outils de calcul du CEREOPA (Excel d'hypothèses + optimisation Xpress).",
    verrous:
      "Automatiser les échanges entre formats hétérogènes (Excel de référence, TXT Xpress, CSV) tout en préservant le workflow existant du CEREOPA.",
  },
];

const PROJET_NOM_BY_ID = Object.fromEntries(PROJETS.map((p) => [p.id, p.nom]));

const JALONS = [
  {
    id: "347dfc12-15cc-817f-b97f-fd43a08e664c",
    nom: "AFZ - BDAA - CIR 2021",
    annee: "2021",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 116975,
    depenses_valorisables: 111019,
    montant_ci: 33306,
    projet_id: "347dfc12-15cc-81d2-ab68-cb5949885a86",
  },
  {
    id: "347dfc12-15cc-8170-ba44-db14efef087b",
    nom: "AFZ - Optim'Al v2 R&D - CIR 2021",
    annee: "2021",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 53644,
    depenses_valorisables: 17921,
    montant_ci: 5376,
    projet_id: "347dfc12-15cc-8180-a91e-fb165ac8bb9f",
  },
  {
    id: "347dfc12-15cc-810e-811e-eb552612e87a",
    nom: "AFZ - BDAA - CIR 2022",
    annee: "2022",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 138385,
    depenses_valorisables: 134198,
    montant_ci: 40260,
    projet_id: "347dfc12-15cc-81d2-ab68-cb5949885a86",
  },
  {
    id: "347dfc12-15cc-8105-884a-dae80a6c25df",
    nom: "AFZ - Optim'Al v2 R&D - CIR 2022",
    annee: "2022",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 49960,
    depenses_valorisables: 48449,
    montant_ci: 14535,
    projet_id: "347dfc12-15cc-8180-a91e-fb165ac8bb9f",
  },
  {
    id: "347dfc12-15cc-819c-859d-ccc93b1c1bd8",
    nom: "AFZ - Optim'Al v2 App web - CII 2022",
    annee: "2022",
    type_ci: "CII",
    avancement: 1,
    depenses_engagees: 70574,
    depenses_valorisables: 69190,
    montant_ci: 13838,
    projet_id: "347dfc12-15cc-81f7-b455-cc4fb8e519b1",
  },
  {
    id: "347dfc12-15cc-81af-99ac-fab098e2a586",
    nom: "AFZ - BDAA - CIR 2023",
    annee: "2023",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 106435,
    depenses_valorisables: 68976,
    montant_ci: 20693,
    projet_id: "347dfc12-15cc-81d2-ab68-cb5949885a86",
  },
  {
    id: "347dfc12-15cc-8143-b9e1-f4b934b2586e",
    nom: "AFZ - DG Agri - CIR 2023",
    annee: "2023",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 64146,
    depenses_valorisables: 41591,
    montant_ci: 12477,
    projet_id: "347dfc12-15cc-81be-8f35-d8b868dd7ce5",
  },
  {
    id: "347dfc12-15cc-81ee-a103-dfca5ebe5160",
    nom: "AFZ - Optim'Al v2 App web - CII 2023",
    annee: "2023",
    type_ci: "CII",
    avancement: 1,
    depenses_engagees: 30090,
    depenses_valorisables: 29385,
    montant_ci: 8816,
    projet_id: "347dfc12-15cc-81f7-b455-cc4fb8e519b1",
  },
  {
    id: "347dfc12-15cc-815d-a19f-f41370d89191",
    nom: "AFZ - BDAA - CIR 2024",
    annee: "2024",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 105145,
    depenses_valorisables: 82964,
    montant_ci: 24889,
    projet_id: "347dfc12-15cc-81d2-ab68-cb5949885a86",
  },
  {
    id: "347dfc12-15cc-81e8-ba0f-f300aa9e83ab",
    nom: "AFZ - Oriflaam / ALIM 3000 - CIR 2024",
    annee: "2024",
    type_ci: "CIR",
    avancement: 1,
    depenses_engagees: 43653,
    depenses_valorisables: 35526,
    montant_ci: 10658,
    projet_id: "347dfc12-15cc-81f7-95cc-ca74d3e9d0ba",
  },
  {
    id: "347dfc12-15cc-8144-97cf-c1bf594bc733",
    nom: "AFZ - BDAA-IA - CIR 2025",
    annee: "2025",
    type_ci: "CIR",
    avancement: 0.9,
    depenses_engagees: 124000,
    depenses_valorisables: 119500,
    montant_ci: 35850,
    projet_id: "347dfc12-15cc-8196-8f3d-c5039e510a61",
  },
  {
    id: "347dfc12-15cc-818b-b2e0-d85412108739",
    nom: "AFZ - COPR'OR-FERM - CIR 2025",
    annee: "2025",
    type_ci: "CIR",
    avancement: 0.9,
    depenses_engagees: 82000,
    depenses_valorisables: 79700,
    montant_ci: 23900,
    projet_id: "347dfc12-15cc-8145-b826-e2e6924fbb70",
  },
];

const DOSSIERS = [
  {
    id: "347dfc12-15cc-81d6-a6be-e7ad1ca7effc",
    nom: "AFZ - CIR - 2021",
    annee: "2021",
    type: "CIR",
    projet_ids: ["347dfc12-15cc-8170-ba44-db14efef087b", "347dfc12-15cc-817f-b97f-fd43a08e664c"],
  },
  {
    id: "347dfc12-15cc-812a-93f8-c78af0402efe",
    nom: "AFZ - CIR - 2022",
    annee: "2022",
    type: "CIR",
    projet_ids: ["347dfc12-15cc-810e-811e-eb552612e87a", "347dfc12-15cc-819c-859d-ccc93b1c1bd8"],
  },
  {
    id: "347dfc12-15cc-819c-b0ff-eb489afb2711",
    nom: "AFZ - CIR - 2023",
    annee: "2023",
    type: "CIR",
    projet_ids: ["347dfc12-15cc-8143-b9e1-f4b934b2586e", "347dfc12-15cc-81af-99ac-fab098e2a586"],
  },
  {
    id: "347dfc12-15cc-81eb-94c9-d557f186d994",
    nom: "AFZ - CIR - 2024",
    annee: "2024",
    type: "CIR",
    projet_ids: ["347dfc12-15cc-815d-a19f-f41370d89191", "347dfc12-15cc-81e8-ba0f-f300aa9e83ab"],
  },
  {
    id: "347dfc12-15cc-81e0-abc5-d649600d39df",
    nom: "AFZ - CIR - 2025",
    annee: "2025",
    type: "CIR",
    projet_ids: ["347dfc12-15cc-818b-b2e0-d85412108739", "347dfc12-15cc-8144-97cf-c1bf594bc733"],
  },
];

const FACTURES = [
  {
    id: "347dfc12-15cc-81af-ac36-e6e9c00ec617",
    nom: "AFZ - Solde - CIR - 2021",
    type: "Solde",
    montant: 13336,
    date: "2024-07-17",
    etat: "Payée",
    exercice: "2024",
  },
];

/* =========================================================================
   UTILS & TOKENS
   ========================================================================= */

const fmtEUR = (n) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(n);

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d)
    ? iso
    : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const getInitials = (nom) => {
  if (!nom) return "·";
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

const stringToColor = (s) => {
  if (!s) return "#7A6A4F";
  const palette = ["#3D5040", "#B8883E", "#2C5160", "#7A6A4F", "#8A6617", "#A64B3E", "#5A6B4F"];
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
};

const ETAT_STYLE = {
  "En cours": "bg-[#E8EEF0] text-[#2C5160] border-[#C7D6DB]",
  Terminé: "bg-[#DCE6DD] text-[#3D5040] border-[#BCD0BF]",
  Clôturé: "bg-[#DCE6DD] text-[#3D5040] border-[#BCD0BF]",
  Actif: "bg-[#E8EEF0] text-[#2C5160] border-[#C7D6DB]",
  Payée: "bg-[#DCE6DD] text-[#3D5040] border-[#BCD0BF]",
  Envoyée: "bg-[#E8EEF0] text-[#2C5160] border-[#C7D6DB]",
  "A facturer": "bg-[#F5EAC8] text-[#8A6617] border-[#E8D79B]",
  "En retard": "bg-[#ECD7D2] text-[#8B3A2F] border-[#D8B8B0]",
};

const STRATEGIE_STYLE = {
  CIR: "bg-[#2C5160] text-[#FDFAF3]",
  CII: "bg-[#7A6A4F] text-[#FDFAF3]",
  JEI: "bg-[#3D5040] text-[#FDFAF3]",
  "N.A": "bg-[#6B6557] text-[#FDFAF3]",
};

const GOUVERNANCE_STYLE = {
  Interne: "text-[#3D5040]",
  Codev: "text-[#B8883E]",
  Presta: "text-[#7A6A4F]",
};

/* =========================================================================
   ATOMS
   ========================================================================= */

const Pill = ({ etat, children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium border rounded-full tracking-wide ${
      ETAT_STYLE[etat] || "bg-[#F4EFE6] text-[#5A5F5C] border-[#E2DCCF]"
    } ${className}`}
  >
    {children || etat}
  </span>
);

const Avatar = ({ initiales, color, size = 28 }) => (
  <div
    className="rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
    style={{ width: size, height: size, background: color }}
  >
    {initiales}
  </div>
);

const SectionTitle = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between mb-6 pb-4 border-b border-[#E2DCCF]">
    <div>
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#7A6A4F] font-medium mb-1.5">
          {eyebrow}
        </div>
      )}
      <h1 className="font-serif text-[34px] leading-none text-[#1A1D1B] tracking-tight">{title}</h1>
    </div>
    {action}
  </div>
);

const TRLLadder = ({ current, target }) => (
  <div className="flex items-center gap-[3px]">
    {Array.from({ length: 9 }, (_, i) => {
      const step = i + 1;
      const isCurrent = step === current;
      const isPast = current != null && step < current;
      const isTarget = step === target;
      return (
        <div
          key={step}
          className="w-5 h-5 flex items-center justify-center rounded-[3px] text-[9px] font-semibold transition-all"
          style={{
            background: isCurrent
              ? "#3D5040"
              : isPast
              ? "#B8C5BA"
              : isTarget
              ? "transparent"
              : "#ECE5D6",
            color: isCurrent ? "#FDFAF3" : isPast ? "#3D5040" : "#8A8577",
            border: isTarget && !isCurrent ? "1.5px dashed #B8883E" : "none",
          }}
        >
          {step}
        </div>
      );
    })}
  </div>
);

const Ring = ({ value, size = 56, stroke = 5, color = "#3D5040" }) => {
  const v = Math.max(0, Math.min(1, value || 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#ECE5D6" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - v * c}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[#1A1D1B] font-mono">
        {Math.round(v * 100)}
      </div>
    </div>
  );
};

/* =========================================================================
   NAV
   ========================================================================= */

const NAV = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "projets", label: "Projets R&D", icon: FolderKanban, count: PROJETS.length },
  { id: "jalons", label: "Jalons & Financier", icon: Target, count: JALONS.length },
  { id: "dossiers", label: "Dossiers", icon: FolderOpen, count: DOSSIERS.length },
  { id: "factures", label: "Factures", icon: Receipt, count: FACTURES.length },
  { id: "contacts", label: "Contacts", icon: Users, count: CONTACTS.length },
];

const Sidebar = ({ active, onNav }) => (
  <aside className="w-[260px] border-r border-[#E2DCCF] bg-[#F4EFE6] flex flex-col h-screen sticky top-0">
    <div className="p-6 border-b border-[#E2DCCF]">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-md bg-[#1A1D1B] flex items-center justify-center">
          <div className="w-3 h-3 rounded-[2px] bg-[#B8883E]" />
        </div>
        <div>
          <div className="font-serif text-[15px] leading-none text-[#1A1D1B] tracking-tight">
            PDJ Conseil
          </div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F] mt-1">
            Portail client
          </div>
        </div>
      </div>
      <div className="rounded-md bg-[#FDFAF3] border border-[#E2DCCF] p-3">
        <div className="text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F] mb-1">
          Société
        </div>
        <div className="font-serif text-[14px] text-[#1A1D1B] leading-tight mb-1">
          AFZ
        </div>
        <div className="text-[10px] text-[#5A5F5C] leading-tight">
          Association Française<br />de Zootechnie
        </div>
      </div>
    </div>

    <nav className="flex-1 p-3 space-y-0.5">
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-all ${
              isActive ? "bg-[#1A1D1B] text-[#FDFAF3]" : "text-[#3B3F3D] hover:bg-[#ECE5D6]"
            }`}
          >
            <Icon size={15} strokeWidth={1.75} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count != null && (
              <span className="text-[10px] font-mono text-[#9B9485]">{item.count}</span>
            )}
          </button>
        );
      })}
    </nav>

    <div className="p-3 border-t border-[#E2DCCF]">
      <div className="rounded-md p-3 bg-gradient-to-br from-[#3D5040] to-[#2B3A2D] text-[#FDFAF3]">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={13} />
          <span className="text-[10px] uppercase tracking-[0.14em] font-medium opacity-80">
            Assistance
          </span>
        </div>
        <div className="font-serif text-[14px] leading-tight mb-2">
          Besoin d'aide sur un dossier ?
        </div>
        <button className="text-[11px] text-[#F5EAC8] hover:text-white flex items-center gap-1 transition-colors">
          Contacter mon équipe <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  </aside>
);

const TopBar = () => (
  <div className="h-14 border-b border-[#E2DCCF] bg-[#F4EFE6] px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur">
    <div className="flex items-center gap-2 text-[12px] text-[#5A5F5C]">
      <span>Portail</span>
      <ChevronRight size={12} />
      <span>AFZ</span>
      <ChevronRight size={12} />
      <span className="text-[#1A1D1B] font-medium">Exercice 2026</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A6A4F]" />
        <input
          placeholder="Rechercher…"
          className="h-8 pl-8 pr-3 w-56 text-[12px] bg-[#FDFAF3] border border-[#E2DCCF] rounded-md outline-none focus:border-[#1A1D1B] text-[#1A1D1B] placeholder:text-[#9B9485]"
        />
      </div>
      <button className="relative w-8 h-8 rounded-md hover:bg-[#ECE5D6] flex items-center justify-center">
        <Bell size={15} className="text-[#3B3F3D]" />
      </button>
      <div className="w-px h-5 bg-[#E2DCCF]" />
      <div className="flex items-center gap-2.5">
        <Avatar initiales="VH" color={stringToColor("Valérie Heuzé")} size={26} />
        <div className="text-[12px] text-[#1A1D1B] leading-tight">
          <div className="font-medium">Valérie Heuzé</div>
          <div className="text-[10px] text-[#7A6A4F]">AFZ</div>
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================================
   VIEWS
   ========================================================================= */

const Dashboard = ({ goTo }) => {
  const ciCumulePondere = useMemo(
    () => JALONS.reduce((s, j) => s + (j.montant_ci || 0) * (j.avancement || 0), 0),
    []
  );
  const ci2025Projection = JALONS.filter((j) => j.annee === "2025").reduce(
    (s, j) => s + (j.montant_ci || 0),
    0
  );
  const depensesValoTotales = JALONS.reduce(
    (s, j) => s + (j.depenses_valorisables || 0),
    0
  );
  const depensesEngageesTotales = JALONS.reduce(
    (s, j) => s + (j.depenses_engagees || 0),
    0
  );

  const chartData = useMemo(() => {
    const byYear = {};
    JALONS.forEach((j) => {
      if (!byYear[j.annee]) byYear[j.annee] = { annee: j.annee, CI: 0 };
      byYear[j.annee].CI += (j.montant_ci || 0) * (j.avancement || 0);
    });
    return Object.values(byYear).sort((a, b) => a.annee.localeCompare(b.annee));
  }, []);

  const projetsActifs = PROJETS.filter((p) => {
    const cloture = parseInt(p.cloture, 10);
    return isNaN(cloture) || cloture >= 2025;
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-lg bg-[#1A1D1B] text-[#FDFAF3] p-10">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FDFAF3 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl bg-[#B8883E]" />
        <div className="relative grid grid-cols-3 gap-10">
          <div className="col-span-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#B8883E] font-medium mb-3">
              Bilan consolidé · 5 exercices (2021 → 2025)
            </div>
            <h1 className="font-serif text-[48px] leading-[1.05] tracking-tight mb-4">
              Votre crédit d'impôt<br />
              <span className="italic text-[#E8D79B]">pérennisé depuis 2021.</span>
            </h1>
            <p className="text-[14px] text-[#C9C4B8] max-w-md leading-relaxed">
              {PROJETS.length} projets R&D dont {projetsActifs.length} actifs, 7 dossiers CIR annuels
              et 1 CII, un socle technologique solide animé depuis 1989.
            </p>
          </div>
          <div className="flex flex-col justify-end space-y-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#9B9485] mb-1">
                CI cumulé (pondéré avancement)
              </div>
              <div className="font-serif text-[42px] leading-none tracking-tight">
                {fmtEUR(ciCumulePondere)}
              </div>
            </div>
            <div className="pt-4 border-t border-[#3B3F3D]">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#9B9485] mb-1">
                Projection 2025 (100 %)
              </div>
              <div className="font-serif text-[24px] leading-none tracking-tight text-[#E8D79B]">
                {fmtEUR(ci2025Projection)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            eyebrow: "Projets R&D",
            value: PROJETS.length,
            context: `${projetsActifs.length} actifs · ${PROJETS.length - projetsActifs.length} clôturés`,
          },
          {
            eyebrow: "Jalons consolidés",
            value: JALONS.length,
            context: "11 CIR · 2 CII",
          },
          {
            eyebrow: "Dépenses valorisables",
            value: fmtEUR(depensesValoTotales),
            context: `sur ${fmtEUR(depensesEngageesTotales)} engagés`,
          },
          {
            eyebrow: "Dossiers CIR",
            value: DOSSIERS.length,
            context: "2021 → 2025",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]"
          >
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-2">
              {kpi.eyebrow}
            </div>
            <div className="font-serif text-[28px] leading-none tracking-tight text-[#1A1D1B] mb-2">
              {kpi.value}
            </div>
            <div className="text-[11px] text-[#5A5F5C]">{kpi.context}</div>
          </div>
        ))}
      </div>

      {/* Chart + Prochains projets */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-6 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-1">
                Évolution du crédit d'impôt
              </div>
              <div className="font-serif text-[20px] text-[#1A1D1B] tracking-tight">
                CI consolidé par exercice
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#3D5040]">
              <TrendingUp size={13} />
              <span className="font-medium">{chartData.length} exercices</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8883E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#B8883E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ECE5D6" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="annee" stroke="#9B9485" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis
                stroke="#9B9485"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A1D1B",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#FDFAF3",
                }}
                labelStyle={{ color: "#B8883E", fontSize: 10, textTransform: "uppercase" }}
                formatter={(v) => [fmtEUR(v), "CI"]}
              />
              <Area type="monotone" dataKey="CI" stroke="#B8883E" strokeWidth={2} fill="url(#ciGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-1">
                En cours
              </div>
              <div className="font-serif text-[16px] text-[#1A1D1B]">Projets 2025</div>
            </div>
            <button
              onClick={() => goTo("projets")}
              className="text-[11px] text-[#3D5040] hover:underline flex items-center gap-0.5"
            >
              Tous <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-3">
            {PROJETS.filter((p) => p.demarrage === "2025").map((p) => (
              <button
                key={p.id}
                onClick={() => goTo("projets")}
                className="w-full text-left p-3 -mx-1 rounded hover:bg-[#F4EFE6] transition-colors group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full mt-2 bg-[#B8883E] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[#1A1D1B] leading-snug group-hover:text-[#3D5040]">
                      {p.nom}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="font-mono text-[#7A6A4F]">TRL {p.trl}→{p.trl_cible}</span>
                      <span className="text-[#9B9485]">·</span>
                      <span className={GOUVERNANCE_STYLE[p.gouvernance]}>{p.gouvernance}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portefeuille projets */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-1">
              Portefeuille de projets
            </div>
            <div className="font-serif text-[20px] text-[#1A1D1B] tracking-tight">
              Maturité technologique
            </div>
          </div>
          <button
            onClick={() => goTo("projets")}
            className="text-[11px] text-[#3D5040] hover:underline flex items-center gap-0.5"
          >
            Détail projets <ChevronRight size={11} />
          </button>
        </div>
        <div className="space-y-2">
          {PROJETS.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_auto_auto] gap-6 items-center p-4 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3] hover:border-[#1A1D1B] transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide ${
                      STRATEGIE_STYLE[p.strategie] || "bg-[#6B6557] text-[#FDFAF3]"
                    }`}
                  >
                    {p.strategie}
                  </span>
                  <span className={`text-[10px] ${GOUVERNANCE_STYLE[p.gouvernance]}`}>
                    {p.gouvernance}
                  </span>
                  <span className="text-[10px] text-[#7A6A4F]">
                    · {p.demarrage} → {p.cloture}
                  </span>
                </div>
                <div className="font-serif text-[15px] text-[#1A1D1B] leading-tight">
                  {p.nom}
                </div>
              </div>
              <TRLLadder current={p.trl} target={p.trl_cible} />
              <div className="text-right w-16">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F]">
                  TRL
                </div>
                <div className="font-mono text-[15px] text-[#1A1D1B]">
                  {p.trl}
                  <span className="text-[#9B9485]">/{p.trl_cible}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjetsView = () => {
  const projetsActifs = PROJETS.filter((p) => {
    const cloture = parseInt(p.cloture, 10);
    return isNaN(cloture) || cloture >= 2025;
  });

  const getEtat = (p) => {
    const cloture = parseInt(p.cloture, 10);
    if (isNaN(cloture)) return "En cours";
    return cloture < 2025 ? "Clôturé" : "Actif";
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow={`${PROJETS.length} projets · ${projetsActifs.length} actifs · ${PROJETS.length - projetsActifs.length} clôturés`}
        title="Vos projets R&D"
      />
      <div className="space-y-4">
        {PROJETS.map((p) => {
          const etat = getEtat(p);
          const jalonsProjet = JALONS.filter((j) => j.projet_id === p.id);
          const ciProjetTotal = jalonsProjet.reduce(
            (s, j) => s + (j.montant_ci || 0) * (j.avancement || 0),
            0
          );
          return (
            <div
              key={p.id}
              className="group rounded-lg border border-[#E2DCCF] bg-[#FDFAF3] overflow-hidden hover:border-[#1A1D1B] transition-colors"
            >
              <div className="grid grid-cols-[1fr_360px] gap-0">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold tracking-wider ${
                        STRATEGIE_STYLE[p.strategie] || "bg-[#6B6557] text-[#FDFAF3]"
                      }`}
                    >
                      {p.strategie}
                    </span>
                    <span className="text-[11px] text-[#7A6A4F]">·</span>
                    <span className={`text-[11px] ${GOUVERNANCE_STYLE[p.gouvernance]}`}>
                      Gouvernance {p.gouvernance}
                    </span>
                    <span className="text-[11px] text-[#7A6A4F]">·</span>
                    <span className="text-[11px] text-[#5A5F5C]">
                      {p.demarrage} → {p.cloture}
                    </span>
                    <Pill etat={etat} />
                  </div>
                  <h2 className="font-serif text-[22px] text-[#1A1D1B] leading-tight tracking-tight mb-4">
                    {p.nom}
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-1">
                        Objectif
                      </div>
                      <p className="text-[13px] text-[#3B3F3D] leading-relaxed">{p.objectif}</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-1">
                        Verrous scientifiques
                      </div>
                      <p className="text-[13px] text-[#3B3F3D] leading-relaxed italic">
                        {p.verrous}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F4EFE6] p-6 flex flex-col justify-between border-l border-[#E2DCCF]">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-3">
                      Maturité technologique
                    </div>
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <div className="font-serif text-[38px] text-[#1A1D1B] leading-none tracking-tight">
                          {p.trl}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F] mt-1">
                          TRL actuel
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[24px] text-[#B8883E] leading-none font-serif italic">
                          → {p.trl_cible}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F] mt-1">
                          Cible
                        </div>
                      </div>
                    </div>
                    <TRLLadder current={p.trl} target={p.trl_cible} />
                    {jalonsProjet.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-[#E2DCCF]">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F] mb-1">
                          CI consolidé sur ce projet
                        </div>
                        <div className="font-serif text-[20px] text-[#1A1D1B]">
                          {fmtEUR(ciProjetTotal)}
                        </div>
                        <div className="text-[11px] text-[#5A5F5C] mt-0.5">
                          {jalonsProjet.length} jalon{jalonsProjet.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const JalonsView = () => {
  const byAnnee = useMemo(() => {
    const g = {};
    JALONS.forEach((j) => {
      if (!g[j.annee]) g[j.annee] = { annee: j.annee, de: 0, dv: 0, ci: 0 };
      g[j.annee].de += j.depenses_engagees || 0;
      g[j.annee].dv += j.depenses_valorisables || 0;
      g[j.annee].ci += (j.montant_ci || 0) * (j.avancement || 0);
    });
    return Object.values(g).sort((a, b) => a.annee.localeCompare(b.annee));
  }, []);

  const byType = useMemo(() => {
    const g = {};
    JALONS.forEach((j) => {
      if (!g[j.type_ci]) g[j.type_ci] = { name: j.type_ci, value: 0 };
      g[j.type_ci].value += (j.montant_ci || 0) * (j.avancement || 0);
    });
    return Object.values(g);
  }, []);

  const COLORS = { CIR: "#2C5160", CII: "#B8883E", JEI: "#3D5040" };

  const sortedJalons = [...JALONS].sort((a, b) => {
    if (a.annee !== b.annee) return a.annee.localeCompare(b.annee);
    return a.nom.localeCompare(b.nom);
  });

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Suivi financier · Crédit d'impôt" title="Jalons annuels" />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-6 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-1">
                Consolidation annuelle
              </div>
              <div className="font-serif text-[20px] text-[#1A1D1B] tracking-tight">
                Dépenses & CI par exercice
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byAnnee} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#ECE5D6" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="annee" stroke="#9B9485" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis
                stroke="#9B9485"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A1D1B",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#FDFAF3",
                }}
                formatter={(v) => fmtEUR(v)}
              />
              <Bar dataKey="de" fill="#C9C4B8" name="Engagées" radius={[2, 2, 0, 0]} />
              <Bar dataKey="dv" fill="#7A6A4F" name="Valorisables" radius={[2, 2, 0, 0]} />
              <Bar dataKey="ci" fill="#B8883E" name="CI" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-[11px]">
            {[
              { c: "#C9C4B8", l: "Engagées" },
              { c: "#7A6A4F", l: "Valorisables" },
              { c: "#B8883E", l: "CI" },
            ].map((e) => (
              <div key={e.l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: e.c }} />
                <span className="text-[#5A5F5C]">{e.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-1">
            Répartition totale
          </div>
          <div className="font-serif text-[16px] text-[#1A1D1B] mb-4">CI par dispositif</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={byType} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {byType.map((e, i) => (
                  <Cell key={i} fill={COLORS[e.name] || "#6B6557"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1A1D1B",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#FDFAF3",
                }}
                formatter={(v) => fmtEUR(v)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {byType.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ background: COLORS[e.name] || "#6B6557" }}
                  />
                  <span className="text-[#3B3F3D]">{e.name}</span>
                </div>
                <span className="font-mono text-[#1A1D1B]">{fmtEUR(e.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#E2DCCF] bg-[#FDFAF3] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2DCCF]">
          <div className="font-serif text-[18px] text-[#1A1D1B]">Détail des jalons</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2DCCF] bg-[#F9F5EC]">
                {[
                  "Année",
                  "Projet",
                  "Type",
                  "Avancement",
                  "Engagées",
                  "Valorisables",
                  "Montant CI",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F] font-semibold px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedJalons.map((j) => (
                <tr
                  key={j.id}
                  className="border-b border-[#ECE5D6] last:border-0 hover:bg-[#F9F5EC]"
                >
                  <td className="px-5 py-3.5 text-[13px] text-[#1A1D1B] font-mono">{j.annee}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-[13px] text-[#1A1D1B] leading-tight">
                      {PROJET_NOM_BY_ID[j.projet_id] || j.nom}
                    </div>
                    <div className="text-[10px] text-[#9B9485] mt-0.5">{j.nom}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wider ${
                        STRATEGIE_STYLE[j.type_ci] || "bg-[#6B6557] text-[#FDFAF3]"
                      }`}
                    >
                      {j.type_ci}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Ring value={j.avancement || 0} size={36} stroke={3.5} color="#3D5040" />
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#3B3F3D] font-mono">
                    {fmtEUR(j.depenses_engagees)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#3B3F3D] font-mono">
                    {fmtEUR(j.depenses_valorisables)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1A1D1B] font-mono font-semibold">
                    {fmtEUR(j.montant_ci)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#1A1D1B] text-[#FDFAF3]">
                <td
                  className="px-5 py-3 text-[11px] uppercase tracking-[0.14em]"
                  colSpan={4}
                >
                  Total général
                </td>
                <td className="px-5 py-3 text-[13px] font-mono">
                  {fmtEUR(JALONS.reduce((s, j) => s + (j.depenses_engagees || 0), 0))}
                </td>
                <td className="px-5 py-3 text-[13px] font-mono">
                  {fmtEUR(JALONS.reduce((s, j) => s + (j.depenses_valorisables || 0), 0))}
                </td>
                <td className="px-5 py-3 text-[13px] font-mono font-semibold text-[#E8D79B]">
                  {fmtEUR(JALONS.reduce((s, j) => s + (j.montant_ci || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

const DossiersView = () => {
  const sortedDossiers = [...DOSSIERS].sort((a, b) => b.annee.localeCompare(a.annee));
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow={`${DOSSIERS.length} dossiers · exercices 2021 à 2025`}
        title="Dossiers CIR"
      />
      <div className="space-y-3">
        {sortedDossiers.map((d) => {
          const jalonsLies = JALONS.filter((j) =>
            d.projet_ids.some((pid) => pid === j.id)
          );
          const ciDossier = jalonsLies.reduce(
            (s, j) => s + (j.montant_ci || 0) * (j.avancement || 0),
            0
          );
          return (
            <div
              key={d.id}
              className="grid grid-cols-[80px_1fr_auto_auto] gap-6 items-center p-5 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3] hover:border-[#1A1D1B] transition-colors"
            >
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#B8883E] font-semibold">
                  Exercice
                </div>
                <div className="font-serif text-[32px] text-[#1A1D1B] leading-none tracking-tight mt-1">
                  {d.annee}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wider ${
                      STRATEGIE_STYLE[d.type]
                    }`}
                  >
                    {d.type}
                  </span>
                </div>
                <div className="font-serif text-[17px] text-[#1A1D1B] leading-tight">
                  {d.nom}
                </div>
                <div className="text-[11px] text-[#7A6A4F] mt-1">
                  {jalonsLies.length} jalon{jalonsLies.length > 1 ? "s" : ""} lié{jalonsLies.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F]">
                  CI consolidé
                </div>
                <div className="font-serif text-[22px] text-[#1A1D1B] leading-none mt-1">
                  {fmtEUR(ciDossier)}
                </div>
              </div>
              <button className="h-9 px-4 rounded-md border border-[#E2DCCF] text-[12px] text-[#1A1D1B] hover:border-[#1A1D1B] flex items-center gap-1.5">
                <Download size={12} /> Dossier
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FacturesView = () => {
  const total = FACTURES.reduce((s, f) => s + (f.montant || 0), 0);
  const payees = FACTURES.filter((f) => f.etat === "Payée").reduce(
    (s, f) => s + (f.montant || 0),
    0
  );
  const dues = FACTURES.filter((f) => f.etat === "Envoyée" || f.etat === "En retard").reduce(
    (s, f) => s + (f.montant || 0),
    0
  );
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Facturation" title="Factures" />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total facturé", value: fmtEUR(total) },
          { label: "Réglé", value: fmtEUR(payees), color: "#3D5040" },
          { label: "À régler", value: fmtEUR(dues), color: dues > 0 ? "#A64B3E" : "#9B9485" },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]">
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-2">
              {k.label}
            </div>
            <div
              className="font-serif text-[28px] leading-none tracking-tight"
              style={{ color: k.color || "#1A1D1B" }}
            >
              {k.value}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[#E2DCCF] bg-[#FDFAF3] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2DCCF] bg-[#F9F5EC]">
              {["Intitulé", "Type", "Date", "Exercice", "Montant", "État", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] uppercase tracking-[0.14em] text-[#7A6A4F] font-semibold px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FACTURES.map((f) => (
              <tr
                key={f.id}
                className="border-b border-[#ECE5D6] last:border-0 hover:bg-[#F9F5EC]"
              >
                <td className="px-5 py-3.5 text-[13px] text-[#1A1D1B]">{f.nom}</td>
                <td className="px-5 py-3.5 text-[12px] text-[#5A5F5C]">{f.type}</td>
                <td className="px-5 py-3.5 text-[12px] text-[#5A5F5C]">{fmtDate(f.date)}</td>
                <td className="px-5 py-3.5 text-[12px] text-[#5A5F5C] font-mono">{f.exercice}</td>
                <td className="px-5 py-3.5 text-[13px] text-[#1A1D1B] font-mono font-semibold">
                  {fmtEUR(f.montant)}
                </td>
                <td className="px-5 py-3.5">
                  <Pill etat={f.etat} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="h-7 px-2.5 rounded border border-[#E2DCCF] text-[11px] text-[#3B3F3D] hover:border-[#1A1D1B] hover:text-[#1A1D1B] inline-flex items-center gap-1">
                    <Download size={11} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContactsView = () => (
  <div className="space-y-6">
    <SectionTitle
      eyebrow={`${CONTACTS.length} contact${CONTACTS.length > 1 ? "s" : ""} AFZ`}
      title="Contacts"
    />
    <div className="grid grid-cols-2 gap-5">
      {CONTACTS.map((c) => {
        const nomComplet = `${c.prenom} ${c.nom}`.trim();
        return (
          <div
            key={c.id}
            className="p-6 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]"
          >
            <div className="flex items-start gap-4">
              <Avatar initiales={getInitials(nomComplet)} color={stringToColor(nomComplet)} size={56} />
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[20px] text-[#1A1D1B] leading-tight mb-0.5">
                  {nomComplet}
                </div>
                <div className="text-[11px] text-[#7A6A4F] mb-4">
                  <Building2 size={10} className="inline mr-1 -mt-0.5" />
                  AFZ — Association Française de Zootechnie
                </div>
                <div className="space-y-1.5 text-[12px] text-[#3B3F3D]">
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={11} className="text-[#7A6A4F]" />
                      <a
                        href={`mailto:${c.email}`}
                        className="hover:text-[#1A1D1B] hover:underline"
                      >
                        {c.email}
                      </a>
                    </div>
                  )}
                  {c.telephone && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#7A6A4F]">☏</span>
                      {c.telephone}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#ECE5D6]">
                  <button className="h-8 px-3 rounded-md bg-[#1A1D1B] text-[#FDFAF3] text-[11px] flex items-center gap-1.5 hover:bg-[#3B3F3D]">
                    <MessageSquare size={11} /> Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div className="p-6 rounded-lg border border-[#E2DCCF] bg-[#FDFAF3]">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A6A4F] font-medium mb-2">
        Adresse AFZ
      </div>
      <div className="flex items-center gap-3 text-[13px] text-[#1A1D1B]">
        <MapPin size={14} className="text-[#B8883E]" />
        <span>{SOCIETE.lieu}</span>
      </div>
    </div>

    <div className="p-6 rounded-lg bg-[#1A1D1B] text-[#FDFAF3] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl bg-[#B8883E]" />
      <div className="relative grid grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#B8883E] font-medium mb-2">
            Une question sur un dossier ?
          </div>
          <div className="font-serif text-[22px] leading-tight tracking-tight mb-3">
            Votre équipe PDJ vous répond<br />sous 24 heures ouvrées.
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="text-[11px] text-[#9B9485] uppercase tracking-[0.14em]">Contact PDJ</div>
          <div className="font-serif text-[18px]">contact@pdj-conseil.fr</div>
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================================
   ROOT
   ========================================================================= */

export default function App() {
  const [active, setActive] = useState("dashboard");
  const fontCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Geist:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap');
    .portal-root { font-family: 'Geist', system-ui, sans-serif; }
    .portal-root .font-serif { font-family: 'Fraunces', Georgia, serif; font-variation-settings: 'opsz' 60; }
    .portal-root .font-mono { font-family: 'JetBrains Mono', monospace; }
    .portal-root ::selection { background: #1A1D1B; color: #B8883E; }
  `;
  return (
    <>
      <style>{fontCSS}</style>
      <div className="portal-root flex min-h-screen bg-[#F4EFE6] text-[#1A1D1B] antialiased">
        <Sidebar active={active} onNav={setActive} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 px-8 py-8 overflow-auto">
            {active === "dashboard" && <Dashboard goTo={setActive} />}
            {active === "projets" && <ProjetsView />}
            {active === "jalons" && <JalonsView />}
            {active === "dossiers" && <DossiersView />}
            {active === "factures" && <FacturesView />}
            {active === "contacts" && <ContactsView />}
          </main>
        </div>
      </div>
    </>
  );
}
