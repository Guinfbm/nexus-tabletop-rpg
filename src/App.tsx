import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createTableChannel, type TableChannel, type TableEvent } from "./lib/tableChannel";
import { getLocalAsset, removeLocalAsset, saveLocalAsset } from "./lib/localAssets";

type IconName =
  | "map"
  | "message"
  | "file"
  | "shield"
  | "users"
  | "settings"
  | "dice"
  | "send"
  | "plus"
  | "copy"
  | "lock"
  | "book"
  | "sword"
  | "eye"
  | "upload"
  | "close"
  | "menu"
  | "ruler"
  | "music"
  | "play"
  | "pause"
  | "pencil"
  | "maximize"
  | "minimize"
  | "trash";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />,
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.37.36.7.6 1 .3.3.7.43 1.1.4h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),
    dice: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8" r=".8" fill="currentColor" />
        <circle cx="16" cy="8" r=".8" fill="currentColor" />
        <circle cx="12" cy="12" r=".8" fill="currentColor" />
        <circle cx="8" cy="16" r=".8" fill="currentColor" />
        <circle cx="16" cy="16" r=".8" fill="currentColor" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    copy: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
        <path d="M4 19.5V21h16v-4" />
      </>
    ),
    sword: (
      <>
        <path d="m14.5 4.5 5-2-2 5L8 17l-3 1 1-3Z" />
        <path d="m6 15 3 3M4 20l2-2" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V3M7 8l5-5 5 5" />
        <path d="M20 15v5H4v-5" />
      </>
    ),
    close: <path d="m18 6-12 12M6 6l12 12" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    ruler: (
      <>
        <path d="m4 15 11-11 5 5L9 20H4v-5Z" />
        <path d="m13 6 2 2M10 9l2 2M7 12l2 2" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l11-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7V5Z" />,
    pause: (
      <>
        <path d="M9 5v14M15 5v14" />
      </>
    ),
    pencil: (
      <>
        <path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z" />
        <path d="m13.5 7 3.5 3.5M4 20l3-3" />
      </>
    ),
    maximize: <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />,
    minimize: <path d="M8 3v5H3m13-5v5h5M3 16h5v5m13-5h-5v5" />,
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
        <path d="M10 11v5m4-5v5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

type StatusBar = {
  id: string;
  name: string;
  value: number;
  max: number;
  color: string;
  visible: boolean;
  custom?: boolean;
};

type Token = {
  id: number;
  name: string;
  initials: string;
  x: number;
  y: number;
  color: string;
  hp?: number;
  bars: StatusBar[];
  enemy?: boolean;
  owner?: string;
  ownerId?: string;
  image?: string;
  imageAssetId?: string;
  shape?: "circle" | "square" | "hex";
  size?: "small" | "medium" | "large";
  sizePx?: number;
  showName?: boolean;
  borderStyle?: "none" | "bordered";
  hidden?: boolean;
};
type MapScene = { id: string; name: string; assetId: string };
type DiceTerm = { id: string; count: number; sides: number };
type DicePoolGroup = { term: DiceTerm; rolls: DieRoll[]; total: number };
type DicePoolRoll = {
  groups: DicePoolGroup[];
  modifier: number;
  rawTotal: number;
  total: number;
  criticalSuccess: boolean;
  criticalFailure: boolean;
};
type TableRole = "gm" | "player";
type SavedTableSession = { name: string; role: TableRole };
type AudioControl = {
  action: "play" | "pause" | "stop" | "loop";
  currentTime: number;
  sentAt: number;
  loop?: boolean;
};
type MapQueuePayload = { scenes: MapScene[]; activeMapId: string | null; imageScale?: number };
type AttackEffect = {
  id: string;
  attackerId: number;
  targetId: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  animated: boolean;
};
type AttackFeedback = { id: string; attackerId: number; targetId: number; phase: 0 | 1 };
type SceneElement = {
  id: string;
  name: string;
  kind: "marker" | "cover" | "hazard" | "image";
  x: number;
  y: number;
  color: string;
  size: "small" | "medium" | "large";
  imageAssetId?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageScale?: number;
};
type ScenePlacementKind = Exclude<SceneElement["kind"], "image">;
type Message = {
  id: string | number;
  author: string;
  text: string;
  time: string;
  kind?: "roll";
  critical?: "success" | "failure";
  roll?: { natural: number; modifier: number; extraDie?: number; total: number };
};
type Tab = "map" | "gm";
type DrawPoint = { x: number; y: number };
type DrawStroke = { id: number; points: DrawPoint[]; color: string };
type Measurement = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  distance: number;
  length: number;
  angle: number;
};

function uniqueId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ownerIdentity(name?: string): string | undefined {
  const normalized = name
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
  return normalized || undefined;
}

function tokenOwnerId(token: Token): string | undefined {
  return token.ownerId || ownerIdentity(token.owner);
}

function normalizeTokenOwner(token: Token): Token {
  const owner = token.owner ||
    (token.name === "Nyx" || token.name === "Kade" || token.name === "Vex" ? token.name : token.ownerId);
  return {
    ...token,
    owner,
    ownerId: token.ownerId || ownerIdentity(owner),
    showName: token.showName ?? true,
    borderStyle: token.borderStyle || "none",
  };
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0]?.slice(0, 2) || "?").toUpperCase();
}

type CyberpunkRedRoll = {
  natural: number;
  modifier: number;
  extraDie?: number;
  total: number;
  critical?: "success" | "failure";
};

function rollCyberpunkRed(modifier: number, random = Math.random): CyberpunkRedRoll {
  const rollD10 = () => {
    const sample = random();
    return Number.isFinite(sample) ? Math.max(1, Math.min(10, Math.floor(sample * 10) + 1)) : 1;
  };
  const natural = rollD10();
  const critical = natural === 10 ? "success" : natural === 1 ? "failure" : undefined;
  const extraDie = critical ? rollD10() : undefined;
  const safeModifier = Number.isFinite(modifier) ? Math.trunc(modifier) : 0;
  const total = natural + (extraDie ?? 0) * (critical === "failure" ? -1 : 1) + safeModifier;
  return { natural, modifier: safeModifier, extraDie, total, critical };
}

type DieRoll = CyberpunkRedRoll & { sides: number; rawTotal: number };

function rollDie(sides: number, modifier: number, random = Math.random): DieRoll {
  const safeSides = Math.max(1, Math.min(100, Math.trunc(Number.isFinite(sides) ? sides : 10)));
  const safeModifier = Number.isFinite(modifier)
    ? Math.max(-1_000_000, Math.min(1_000_000, Math.trunc(modifier)))
    : 0;
  if (safeSides === 10) {
    const redRoll = rollCyberpunkRed(safeModifier, random);
    const rawTotal = redRoll.total;
    return {
      ...redRoll,
      total: redRoll.critical === "failure" ? rawTotal : Math.max(0, rawTotal),
      rawTotal,
      sides: safeSides,
    };
  }
  const sample = random();
  const natural = Number.isFinite(sample)
    ? Math.max(1, Math.min(safeSides, Math.floor(sample * safeSides) + 1))
    : 1;
  const rawTotal = natural + safeModifier;
  return {
    natural,
    modifier: safeModifier,
    total: Math.max(0, rawTotal),
    rawTotal,
    sides: safeSides,
  };
}

function formatDistance(feet: number, unit: "ft" | "m"): string {
  const distance = unit === "ft" ? feet : feet * 0.3048;
  const rounded = unit === "ft" ? Number(distance.toFixed(1)) : Number(distance.toFixed(3));
  return `${rounded} ${unit}`;
}

function normalizeDiceTerms(value: unknown, fallbackSides = 10): DiceTerm[] {
  if (Array.isArray(value)) {
    const terms = value
      .filter((term): term is Record<string, unknown> => !!term && typeof term === "object")
      .slice(0, 6)
      .map((term) => ({
        id: typeof term.id === "string" && term.id ? term.id : uniqueId(),
        count: Math.max(1, Math.min(20, Math.trunc(Number(term.count) || 1))),
        sides: Math.max(1, Math.min(100, Math.trunc(Number(term.sides) || 10))),
      }));
    if (terms.length) return terms;
  }
  return [{ id: uniqueId(), count: 1, sides: fallbackSides }];
}

function rollDicePool(terms: DiceTerm[], modifier: number, random = Math.random): DicePoolRoll {
  const safeModifier = Number.isFinite(modifier)
    ? Math.max(-1_000_000, Math.min(1_000_000, Math.trunc(modifier)))
    : 0;
  const groups = normalizeDiceTerms(terms).map((term) => {
    const rolls = Array.from({ length: term.count }, () => rollDie(term.sides, 0, random));
    return { term, rolls, total: rolls.reduce((sum, roll) => sum + roll.total, 0) };
  });
  const criticalFailure = groups.some((group) => group.rolls.some((roll) => roll.critical === "failure"));
  const criticalSuccess = groups.some((group) => group.rolls.some((roll) => roll.critical === "success"));
  const rawTotal = groups.reduce((sum, group) => sum + group.total, 0) + safeModifier;
  return {
    groups,
    modifier: safeModifier,
    rawTotal,
    total: criticalFailure ? rawTotal : Math.max(0, rawTotal),
    criticalSuccess,
    criticalFailure,
  };
}

function formatSignedSum(values: number[]): string {
  const [first = 0, ...rest] = values;
  return `${first}${rest.map((value) => value < 0 ? ` − ${Math.abs(value)}` : ` + ${value}`).join("")}`;
}

function formatDieFace(roll: DieRoll): string {
  if (roll.extraDie === undefined) return String(roll.natural);
  return `${roll.natural}${roll.critical === "failure" ? " − " : " + "}${roll.extraDie}`;
}

function normalizeMapScenes(value: unknown): MapScene[] {
  if (!Array.isArray(value)) return [];
  return value.filter((scene): scene is MapScene =>
    !!scene &&
    typeof scene === "object" &&
    typeof scene.id === "string" &&
    typeof scene.name === "string" &&
    typeof scene.assetId === "string",
  );
}

function readSavedTableSession(): SavedTableSession | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem("nexus-table-session") || "null") as Partial<SavedTableSession> | null;
    if (!saved || typeof saved.name !== "string" || !saved.name.trim()) return null;
    if (saved.role !== "gm" && saved.role !== "player") return null;
    return { name: saved.name.trim(), role: saved.role };
  } catch {
    return null;
  }
}

function saveTableSession(name: string, role: TableRole) {
  try {
    sessionStorage.setItem("nexus-table-session", JSON.stringify({ name, role } satisfies SavedTableSession));
    sessionStorage.setItem("nexus-table-player-name", name);
  } catch {
    // A sessão continua válida na memória mesmo se o navegador bloquear storage.
  }
}

function normalizeMapImageScale(value: unknown): number {
  if (value === null || value === undefined || value === "") return 100;
  const scale = Number(value);
  return Number.isFinite(scale) ? Math.max(40, Math.min(200, scale)) : 100;
}

function sizePixels(size?: Token["size"], sizePx?: number): number {
  if (Number.isFinite(sizePx)) return Math.max(24, Math.min(96, Math.round(sizePx!)));
  return size === "small" ? 32 : size === "large" ? 58 : 42;
}

function createStatusBars(health: number, vigor = 16, shield = 10): StatusBar[] {
  return [
    { id: "health", name: "Vida", value: health, max: health, color: "#ff5d73", visible: true },
    { id: "vigor", name: "Vigor", value: vigor, max: vigor, color: "#f5b84b", visible: true },
    { id: "shield", name: "Escudo", value: shield, max: shield, color: "#4ba3ff", visible: true },
  ];
}

const initialTokens: Token[] = [
  {
    id: 1,
    name: "Nyx",
    initials: "NX",
    x: 24,
    y: 64,
    color: "#17e5d0",
    bars: createStatusBars(28, 18, 12),
    owner: "Nyx",
    shape: "circle",
    size: "medium",
  },
  {
    id: 2,
    name: "Kade",
    initials: "KD",
    x: 40,
    y: 52,
    color: "#a78bfa",
    bars: createStatusBars(34, 14, 20),
    owner: "Kade",
    shape: "circle",
    size: "medium",
  },
  {
    id: 3,
    name: "Vex",
    initials: "VX",
    x: 57,
    y: 67,
    color: "#f472b6",
    bars: createStatusBars(22, 22, 8),
    owner: "Vex",
    shape: "circle",
    size: "medium",
  },
  {
    id: 4,
    name: "Sentinela",
    initials: "S1",
    x: 70,
    y: 34,
    color: "#fb5b64",
    bars: createStatusBars(18, 12, 14),
    enemy: true,
    shape: "square",
    size: "medium",
  },
  {
    id: 5,
    name: "Drone",
    initials: "DR",
    x: 79,
    y: 49,
    color: "#fb5b64",
    bars: createStatusBars(10, 8, 6),
    enemy: true,
    shape: "square",
    size: "small",
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    author: "Mestre Orion",
    text: "A chuva ácida cai sobre os telhados de Neon District.",
    time: "21:04",
  },
  { id: 2, author: "Nyx", text: "Vou escanear a entrada do armazém.", time: "21:05" },
  { id: 3, author: "Sistema", text: "Nyx rolou Percepção: 17", time: "21:05", kind: "roll" },
];

function App() {
  const [savedSession] = useState(() => readSavedTableSession());
  const [hasEnteredSession, setHasEnteredSession] = useState(savedSession !== null);
  const [loginName, setLoginName] = useState(() => {
    if (savedSession) return savedSession.name;
    try {
      return sessionStorage.getItem("nexus-table-player-name") || "";
    } catch {
      return "";
    }
  });
  const [loginRole, setLoginRole] = useState<TableRole>(savedSession?.role ?? "gm");
  const [tab, setTab] = useState<Tab>("map");
  const [currentRole, setCurrentRole] = useState<TableRole>(savedSession?.role ?? "gm");
  const [rightPanel, setRightPanel] = useState<"chat" | "dice" | "sheet" | "music">("chat");
  const [sidePanelWidth, setSidePanelWidth] = useState(() => {
    const saved = Number(localStorage.getItem("nexus-table-panel-width"));
    return Number.isFinite(saved) && saved >= 280 && saved <= 560 ? saved : 328;
  });
  const [sidePanelExpanded, setSidePanelExpanded] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapImageScale, setMapImageScale] = useState(() =>
    normalizeMapImageScale(localStorage.getItem("nexus-table-map-image-scale")),
  );
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [panActive, setPanActive] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(1);
  const [mapScenes, setMapScenes] = useState<MapScene[]>(() => {
    try {
      return normalizeMapScenes(JSON.parse(localStorage.getItem("nexus-table-map-queue") || "[]"));
    } catch {
      return [];
    }
  });
  const [activeMapId, setActiveMapId] = useState<string | null>(() =>
    localStorage.getItem("nexus-table-active-map") || null,
  );
  const [mapSceneUrls, setMapSceneUrls] = useState<Record<string, string>>({});
  const [mapSceneError, setMapSceneError] = useState("");
  const [tokens, setTokens] = useState<Token[]>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("nexus-table-tokens") || localStorage.getItem("nexus-tokens") || "",
      ) as Token[];
      return saved.map((savedToken) => {
        const token = normalizeTokenOwner(savedToken);
        return {
          ...token,
          image: token.image?.startsWith("blob:") ? undefined : token.image,
          bars: token.bars?.length ? token.bars : createStatusBars(token.hp || 20),
          shape: token.shape || (token.enemy ? "square" : "circle"),
          size: token.size || "medium",
          sizePx: sizePixels(token.size, token.sizePx),
        };
      });
    } catch {
      return initialTokens.map(normalizeTokenOwner);
    }
  });
  const [dragVisual, setDragVisual] = useState<{ id: number; x: number; y: number } | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [attackEffect, setAttackEffect] = useState<AttackEffect | null>(null);
  const [attackFeedback, setAttackFeedback] = useState<AttackFeedback | null>(null);
  const [attackHint, setAttackHint] = useState("");
  const [attackShooterId, setAttackShooterId] = useState<number | null>(null);
  const attackClickCountRef = useRef(0);
  const [showAllBars, setShowAllBars] = useState(false);
  const [rulerActive, setRulerActive] = useState(false);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [drawingActive, setDrawingActive] = useState(false);
  const [drawColor, setDrawColor] = useState("#18e3d0");
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState<DrawStroke[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("nexus-table-drawings") || localStorage.getItem("nexus-drawings") || "[]",
      );
    } catch {
      return [];
    }
  });
  const [sceneElements, setSceneElements] = useState<SceneElement[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nexus-table-scene-elements") || "[]") as SceneElement[];
    } catch {
      return [];
    }
  });
  const [sceneEditMode, setSceneEditMode] = useState(false);
  const [scenePlacementKind, setScenePlacementKind] = useState<ScenePlacementKind | null>(null);
  const [selectedSceneElementId, setSelectedSceneElementId] = useState<string | null>(null);
  const [sceneDragVisual, setSceneDragVisual] = useState<{ id: string; x: number; y: number } | null>(null);
  const [sceneImageError, setSceneImageError] = useState("");
  const [playersCanDraw, setPlayersCanDraw] = useState(() => {
    const current = localStorage.getItem("nexus-table-player-drawing");
    return current === null
      ? localStorage.getItem("nexus-player-drawing") === "true"
      : current === "true";
  });
  const [playersCanMoveOtherTokens, setPlayersCanMoveOtherTokens] = useState(() =>
    localStorage.getItem("nexus-table-player-token-movement") === "true",
  );
  const [newBarName, setNewBarName] = useState("");
  const [maxDrafts, setMaxDrafts] = useState<Record<string, string>>({});
  const [valueDrafts, setValueDrafts] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nexus-table-messages") || "") as Message[];
    } catch {
      return initialMessages;
    }
  });
  const [message, setMessage] = useState("");
  const [modifier, setModifier] = useState(0);
  const [diceCountDrafts, setDiceCountDrafts] = useState<Record<string, string>>({});
  const [diceTerms, setDiceTerms] = useState<DiceTerm[]>(() => {
    const savedSides = Number(localStorage.getItem("nexus-table-die-sides"));
    let savedTerms: unknown;
    try {
      savedTerms = JSON.parse(localStorage.getItem("nexus-table-dice-terms") || "null");
    } catch {
      savedTerms = null;
    }
    return normalizeDiceTerms(
      savedTerms,
      Number.isInteger(savedSides) && savedSides >= 1 && savedSides <= 100 ? savedSides : 10,
    );
  });
  const [isRolling, setIsRolling] = useState(false);
  const [mapUnit, setMapUnit] = useState<"ft" | "m">(() =>
    localStorage.getItem("nexus-table-map-unit") === "m" ? "m" : "ft",
  );
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(() => {
    const stored = sessionStorage.getItem("nexus-table-audio-volume");
    if (stored === null) return 65;
    const saved = Number(stored);
    return Number.isFinite(saved) ? Math.max(0, Math.min(100, saved)) : 65;
  });
  const [audioLoop, setAudioLoop] = useState(true);
  const [audioNeedsInteraction, setAudioNeedsInteraction] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [notes, setNotes] = useState(
    () =>
      localStorage.getItem("nexus-table-notes") ||
      localStorage.getItem("nexus-notes") ||
      "O contato está no bar Sublevel. Não revelar a identidade de Zero antes do encontro.",
  );
  const [initiative, setInitiative] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nexus-table-initiative") || "") as {
        name: string;
        value: number;
        color: string;
      }[];
    } catch {
      return [
        { name: "Nyx", value: 19, color: "#17e5d0" },
        { name: "Sentinela", value: 16, color: "#fb5b64" },
        { name: "Kade", value: 13, color: "#a78bfa" },
        { name: "Vex", value: 9, color: "#f472b6" },
      ];
    }
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const mapPanDragRef = useRef<{ pointerId: number; x: number; y: number; originX: number; originY: number } | null>(null);
  const dragRef = useRef<number | null>(null);
  const dragPositionRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartPositionRef = useRef<{ x: number; y: number } | null>(null);
  const sceneElementsRef = useRef(sceneElements);
  const mapScenesRef = useRef(mapScenes);
  const mapSceneUrlsRef = useRef<Record<string, string>>({});
  const sceneDragRef = useRef<string | null>(null);
  const sceneDragPositionRef = useRef<{ x: number; y: number } | null>(null);
  const sceneDragStartRef = useRef<{ x: number; y: number } | null>(null);
  const resizingPanelRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrlRef = useRef<string | null>(null);
  const pendingAudioControlRef = useRef<AudioControl | null>(null);
  const attackFeedbackPhaseRef = useRef<0 | 1>(0);
  const channelRef = useRef<TableChannel | null>(null);
  const tokensRef = useRef(tokens);
  const messagesRef = useRef(messages);
  const notesRef = useRef(notes);
  const initiativeRef = useRef(initiative);
  const playersCanDrawRef = useRef(playersCanDraw);
  const seenMessageIdsRef = useRef(new Set<string | number>(messages.map((item) => item.id)));
  const objectUrlsRef = useRef(new Set<string>());
  const legacyImageMigrationRef = useRef(new Set<number>());
  const suppressSharedEffectRef = useRef({ notes: false, initiative: false, drawingPermission: false });
  const [syncAvailable, setSyncAvailable] = useState(typeof BroadcastChannel !== "undefined");
  const [playerName, setPlayerName] = useState(() => {
    if (savedSession) return savedSession.name;
    try {
      return "";
    } catch {
      return "";
    }
  });
  const [tabStorageId] = useState(() => {
    try {
      const existing = sessionStorage.getItem("nexus-table-tab-id");
      if (existing) return existing;
      const created = uniqueId();
      sessionStorage.setItem("nexus-table-tab-id", created);
      return created;
    } catch {
      return uniqueId();
    }
  });

  const createObjectUrl = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    objectUrlsRef.current.add(url);
    return url;
  };
  const releaseObjectUrl = (url: string | null) => {
    if (!url || !objectUrlsRef.current.has(url)) return;
    URL.revokeObjectURL(url);
    objectUrlsRef.current.delete(url);
  };
  const replaceAudioSource = (url: string | null, name = "") => {
    if (audioUrlRef.current !== url) releaseObjectUrl(audioUrlRef.current);
    audioUrlRef.current = url;
    setAudioUrl(url);
    setAudioName(name);
  };

  const persistTokens = (next: Token[]) => {
    tokensRef.current = next;
    setTokens(next);
  };
  const persistSceneElements = (next: SceneElement[]) => {
    sceneElementsRef.current = next;
    setSceneElements(next);
  };
  const publish = <T,>(type: TableEvent["type"], payload: T) => channelRef.current?.publish(type, payload);
  const persistMapQueue = (nextScenes: MapScene[], nextActiveMapId: string | null, broadcast = true) => {
    const sceneIds = new Set(nextScenes.map((scene) => scene.id));
    for (const scene of mapScenesRef.current) {
      if (sceneIds.has(scene.id)) continue;
      void removeLocalAsset(scene.assetId).catch(() => undefined);
      const url = mapSceneUrlsRef.current[scene.id];
      if (url) releaseObjectUrl(url);
    }
    mapSceneUrlsRef.current = Object.fromEntries(
      Object.entries(mapSceneUrlsRef.current).filter(([sceneId]) => sceneIds.has(sceneId)),
    );
    setMapSceneUrls(mapSceneUrlsRef.current);
    mapScenesRef.current = nextScenes;
    setMapScenes(nextScenes);
    const active = nextScenes.some((scene) => scene.id === nextActiveMapId)
      ? nextActiveMapId
      : nextScenes[0]?.id ?? null;
    setActiveMapId(active);
    if (broadcast) publish("map.queue", {
      scenes: nextScenes,
      activeMapId: active,
      imageScale: mapImageScale,
    } satisfies MapQueuePayload);
  };
  const startSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = loginName.trim();
    if (!name) return;
    setPlayerName(name);
    setCurrentRole(loginRole);
    saveTableSession(name, loginRole);
    setHasEnteredSession(true);
  };
  const endSession = () => {
    setLoginName(playerName);
    setLoginRole(currentRole);
    setHasEnteredSession(false);
    try {
      sessionStorage.removeItem("nexus-table-session");
    } catch {
      // A saída da sessão continua funcionando na interface.
    }
  };
  const changeMapImageScale = (value: number) => {
    if (currentRole !== "gm") return;
    const scale = normalizeMapImageScale(value);
    setMapImageScale(scale);
    try {
      localStorage.setItem("nexus-table-map-image-scale", String(scale));
    } catch {
      // A escala continua aplicada nesta aba mesmo se storage estiver indisponível.
    }
    publish("map.queue", {
      scenes: mapScenesRef.current,
      activeMapId,
      imageScale: scale,
    } satisfies MapQueuePayload);
  };
  const addMessage = (nextMessage: Message, broadcast = true) => {
    if (seenMessageIdsRef.current.has(nextMessage.id)) return;
    seenMessageIdsRef.current.add(nextMessage.id);
    if (seenMessageIdsRef.current.size > 1000) {
      const oldest = seenMessageIdsRef.current.values().next().value;
      if (oldest !== undefined) seenMessageIdsRef.current.delete(oldest);
    }
    messagesRef.current = [...messagesRef.current, nextMessage].slice(-300);
    setMessages(messagesRef.current);
    if (broadcast) publish("chat.message", nextMessage);
  };
  const clearChat = () => {
    if (currentRole !== "gm" || !window.confirm("Limpar todas as mensagens do chat desta mesa?")) return;
    messagesRef.current = [];
    setMessages([]);
    seenMessageIdsRef.current.clear();
    localStorage.setItem("nexus-table-messages", "[]");
    publish("chat.clear", { clearedAt: Date.now() });
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        "nexus-table-tokens",
        JSON.stringify(tokens.map(({ image, ...token }) => token)),
      );
    } catch {
      // Falha de armazenamento local não deve impedir o uso da mesa nesta aba.
    }
  }, [tokens]);
  useEffect(() => {
    notesRef.current = notes;
    localStorage.setItem("nexus-table-notes", notes);
    if (suppressSharedEffectRef.current.notes) suppressSharedEffectRef.current.notes = false;
    else publish("gm.notes", notes);
  }, [notes]);
  useEffect(() => {
    messagesRef.current = messages;
    localStorage.setItem("nexus-table-messages", JSON.stringify(messages.slice(-300)));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem("nexus-table-map-queue", JSON.stringify(mapScenes));
  }, [mapScenes]);
  useEffect(() => {
    if (activeMapId) localStorage.setItem("nexus-table-active-map", activeMapId);
    else localStorage.removeItem("nexus-table-active-map");
  }, [activeMapId]);
  useEffect(() => {
    initiativeRef.current = initiative;
    localStorage.setItem("nexus-table-initiative", JSON.stringify(initiative));
    if (suppressSharedEffectRef.current.initiative) suppressSharedEffectRef.current.initiative = false;
    else publish("gm.initiative", initiative);
  }, [initiative]);
  useEffect(() => localStorage.setItem("nexus-table-drawings", JSON.stringify(strokes)), [strokes]);
  useEffect(
    () => localStorage.setItem("nexus-table-scene-elements", JSON.stringify(sceneElements)),
    [sceneElements],
  );
  useEffect(() => {
    let cancelled = false;
    sceneElements.forEach((element) => {
      if (element.kind !== "image" || !element.imageAssetId || assetUrls[element.imageAssetId]) return;
      void getLocalAsset(element.imageAssetId).then((asset) => {
        if (!asset || cancelled) return;
        const url = createObjectUrl(asset.blob);
        setAssetUrls((current) => current[element.imageAssetId!]
          ? current
          : { ...current, [element.imageAssetId!]: url });
      }).catch(() => {
        if (!cancelled) setSceneImageError(`Não foi possível carregar a imagem “${element.name}”.`);
      });
    });
    return () => { cancelled = true; };
  }, [sceneElements, assetUrls]);
  useEffect(() => localStorage.setItem("nexus-table-panel-width", String(sidePanelWidth)), [sidePanelWidth]);
  useEffect(() => {
    localStorage.setItem("nexus-table-dice-terms", JSON.stringify(diceTerms));
    localStorage.setItem("nexus-table-die-sides", String(diceTerms[0]?.sides ?? 10));
  }, [diceTerms]);
  useEffect(() => localStorage.setItem("nexus-table-map-unit", mapUnit), [mapUnit]);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "nexus-table-map-unit" && (event.newValue === "ft" || event.newValue === "m")) {
        setMapUnit((current) => current === event.newValue ? current : event.newValue as "ft" | "m");
      } else if (event.key === "nexus-table-dice-terms" && event.newValue) {
        try {
          const terms = normalizeDiceTerms(JSON.parse(event.newValue));
          setDiceTerms((current) => JSON.stringify(current) === JSON.stringify(terms) ? current : terms);
        } catch {
          // Configurações incompatíveis de outra aba são ignoradas.
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sidePanelExpanded) {
        setSidePanelExpanded(false);
        return;
      }
      if (!event.ctrlKey || tab !== "map" || !mapRef.current?.contains(document.activeElement)) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeMapZoom(0.1);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        changeMapZoom(-0.1);
      }
    };
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey || !mapRef.current?.contains(event.target as Node)) return;
      event.preventDefault();
      changeMapZoom(event.deltaY < 0 ? 0.1 : -0.1);
    };
    const onPointerMove = (event: PointerEvent) => handlePanelResize(event.clientX);
    const onPointerUp = () => finishPanelResize();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [tab, sidePanelExpanded]);
  useEffect(
    () => {
      playersCanDrawRef.current = playersCanDraw;
      localStorage.setItem("nexus-table-player-drawing", String(playersCanDraw));
      if (suppressSharedEffectRef.current.drawingPermission) suppressSharedEffectRef.current.drawingPermission = false;
      else publish("gm.drawing-permission", playersCanDraw);
    },
    [playersCanDraw],
  );
  useEffect(() => {
    localStorage.setItem("nexus-table-player-token-movement", String(playersCanMoveOtherTokens));
    publish("gm.token-movement-permission", playersCanMoveOtherTokens);
  }, [playersCanMoveOtherTokens]);

  useEffect(() => {
    const channel = createTableChannel();
    channelRef.current = channel;
    setSyncAvailable(channel.supported);
    // Eventos recebidos só atualizam esta aba: eles nunca são publicados de novo.
    const unsubscribe = channel.subscribe((event: TableEvent) => {
      if (event.type === "token.upsert") {
        const token = normalizeTokenOwner(event.payload as Token);
        const next = tokensRef.current.some((item) => item.id === token.id)
          ? tokensRef.current.map((item) => (item.id === token.id ? token : item))
          : [...tokensRef.current, token];
        tokensRef.current = next;
        setTokens(next);
        if (token.imageAssetId) {
          void getLocalAsset(token.imageAssetId).then((asset) => {
            if (!asset) return;
            const url = createObjectUrl(asset.blob);
            setAssetUrls((current) => {
              const previous = current[token.imageAssetId!];
              if (previous) releaseObjectUrl(previous);
              return { ...current, [token.imageAssetId!]: url };
            });
          }).catch(() => undefined);
        }
      } else if (event.type === "token.move") {
        const move = event.payload as { id: number; x: number; y: number };
        const next = tokensRef.current.map((token) =>
          token.id === move.id ? { ...token, x: move.x, y: move.y } : token,
        );
        tokensRef.current = next;
        setTokens(next);
      } else if (event.type === "token.delete") {
        const payload = event.payload as { id: number };
        const deleted = tokensRef.current.find((item) => item.id === payload.id);
        if (deleted?.imageAssetId) {
          void removeLocalAsset(deleted.imageAssetId).catch(() => undefined);
          setAssetUrls((current) => {
            const next = { ...current };
            const url = next[deleted.imageAssetId!];
            if (url) releaseObjectUrl(url);
            delete next[deleted.imageAssetId!];
            return next;
          });
        }
        persistTokens(tokensRef.current.filter((item) => item.id !== payload.id));
        setSelectedTokenId((selected) => (selected === payload.id ? null : selected));
      } else if (event.type === "scene.upsert") {
        const element = event.payload as SceneElement;
        const next = sceneElementsRef.current.some((item) => item.id === element.id)
          ? sceneElementsRef.current.map((item) => (item.id === element.id ? element : item))
          : [...sceneElementsRef.current, element];
        persistSceneElements(next);
      } else if (event.type === "scene.delete") {
        const payload = event.payload as { id: string };
        persistSceneElements(sceneElementsRef.current.filter((item) => item.id !== payload.id));
        setSelectedSceneElementId((selected) => (selected === payload.id ? null : selected));
      } else if (event.type === "chat.message") {
        const incoming = event.payload as Message;
        addMessage(incoming, false);
        if (incoming.kind === "roll" && incoming.roll) setLastRoll(incoming.roll.total);
      } else if (event.type === "chat.clear") {
        messagesRef.current = [];
        setMessages([]);
        seenMessageIdsRef.current.clear();
      } else if (event.type === "map.queue") {
        const queue = event.payload as MapQueuePayload;
        if (typeof queue.imageScale === "number") {
          const imageScale = normalizeMapImageScale(queue.imageScale);
          setMapImageScale(imageScale);
          try {
            localStorage.setItem("nexus-table-map-image-scale", String(imageScale));
          } catch {
            // A alteração recebida continua aplicada nesta aba.
          }
        }
        persistMapQueue(normalizeMapScenes(queue.scenes), queue.activeMapId, false);
      } else if (event.type === "map.attack") {
        presentAttack(event.payload as AttackEffect);
      } else if (event.type === "gm.notes") {
        const value = String(event.payload ?? "");
        if (notesRef.current !== value) {
          notesRef.current = value;
          suppressSharedEffectRef.current.notes = true;
          setNotes(value);
        }
      } else if (event.type === "gm.initiative") {
        const value = event.payload as typeof initiative;
        if (JSON.stringify(initiativeRef.current) !== JSON.stringify(value)) {
          initiativeRef.current = value;
          suppressSharedEffectRef.current.initiative = true;
          setInitiative(value);
        }
      } else if (event.type === "gm.drawing-permission") {
        const value = Boolean(event.payload);
        if (playersCanDrawRef.current !== value) {
          playersCanDrawRef.current = value;
          suppressSharedEffectRef.current.drawingPermission = true;
          setPlayersCanDraw(value);
        }
      } else if (event.type === "gm.token-movement-permission") {
        setPlayersCanMoveOtherTokens(Boolean(event.payload));
      } else if (event.type === "audio.track") {
        const track = event.payload as { assetId: string; name: string; blob: Blob; loop?: boolean };
        if (!track?.blob || typeof track.name !== "string") return;
        void saveLocalAsset(track.assetId, "session-audio", track.blob, track.name)
          .then(() => {
            localStorage.setItem("nexus-table-session-audio", JSON.stringify({
              assetId: track.assetId,
              name: track.name,
              loop: track.loop ?? true,
            }));
            replaceAudioSource(createObjectUrl(track.blob), track.name);
            if (typeof track.loop === "boolean") {
              setAudioLoop(track.loop);
              if (audioRef.current) audioRef.current.loop = track.loop;
            }
            setAudioPlaying(false);
            setAudioNeedsInteraction(false);
            setAudioError("");
          })
          .catch(() => setAudioError("Não foi possível receber a música nesta aba."));
      } else if (event.type === "audio.control") {
        applyAudioControl(event.payload as AudioControl);
      } else if (event.type === "audio.clear") {
        pendingAudioControlRef.current = null;
        audioRef.current?.pause();
        replaceAudioSource(null);
        setAudioPlaying(false);
        setAudioNeedsInteraction(false);
        setAudioError("");
        localStorage.removeItem("nexus-table-session-audio");
        localStorage.removeItem("nexus-table-audio-control");
        void removeLocalAsset("nexus-table-session-audio").catch(() => undefined);
      }
    });
    return () => {
      unsubscribe();
      channel.close();
      if (channelRef.current === channel) channelRef.current = null;
    };
    // The channel is intentionally created once per mounted app and closed on cleanup.
  }, []);

  useEffect(() => {
    const legacyImages = tokens.filter((token) => token.image?.startsWith("data:"));
    legacyImages.forEach((token) => {
      if (legacyImageMigrationRef.current.has(token.id)) return;
      legacyImageMigrationRef.current.add(token.id);
      const imageData = token.image;
      if (!imageData) return;
      void fetch(imageData)
        .then((response) => response.blob())
        .then(async (blob) => {
          const assetId = `token-image-${token.id}`;
          await saveLocalAsset(assetId, "token-image", blob, `${token.name}-token`);
          const url = createObjectUrl(blob);
          setAssetUrls((current) => ({ ...current, [assetId]: url }));
          const next = tokensRef.current.map((item) =>
            item.id === token.id ? { ...item, image: url, imageAssetId: assetId } : item,
          );
          persistTokens(next);
        })
        .catch(() => {
          // Imagens antigas inválidas são ignoradas para remover base64 do armazenamento persistente.
          const next = tokensRef.current.map((item) =>
            item.id === token.id ? { ...item, image: undefined } : item,
          );
          persistTokens(next);
        });
    });
  }, [tokens]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    },
    [],
  );

  useEffect(() => {
    let disposed = false;
    const objectUrls: string[] = [];
    const restoreAssets = async () => {
      try {
        for (const token of tokensRef.current) {
          if (!token.imageAssetId) continue;
          const asset = await getLocalAsset(token.imageAssetId);
          if (!asset || disposed) continue;
          const url = createObjectUrl(asset.blob);
          objectUrls.push(url);
          setAssetUrls((current) => ({ ...current, [token.imageAssetId!]: url }));
        }
        const savedSheet = JSON.parse(sessionStorage.getItem("nexus-table-sheet") || "null") as
          | { id: string }
          | null;
        if (savedSheet) {
          const asset = await getLocalAsset(savedSheet.id);
          if (!asset || disposed) return;
          const url = createObjectUrl(asset.blob);
          objectUrls.push(url);
          setPdfName(asset.name);
          setPdfUrl(url);
        }
      } catch (error) {
        if (!disposed) {
          setPdfError(error instanceof Error ? error.message : "Não foi possível abrir o arquivo local.");
        }
      }
    };
    void restoreAssets();
    return () => {
      disposed = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    for (const scene of mapScenes) {
      if (mapSceneUrlsRef.current[scene.id]) continue;
      void getLocalAsset(scene.assetId).then((asset) => {
        if (!asset || cancelled || !mapScenesRef.current.some((item) => item.id === scene.id)) return;
        if (mapSceneUrlsRef.current[scene.id]) return;
        const url = createObjectUrl(asset.blob);
        mapSceneUrlsRef.current = { ...mapSceneUrlsRef.current, [scene.id]: url };
        setMapSceneUrls(mapSceneUrlsRef.current);
      }).catch(() => {
        if (!cancelled) setMapSceneError(`Não foi possível carregar o mapa “${scene.name}”.`);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [mapScenes]);

  const players = useMemo(() => tokens.filter((t) => !t.enemy && !t.hidden), [tokens]);
  const reservedTokens = useMemo(() => tokens.filter((token) => token.hidden), [tokens]);
  const canDraw = currentRole === "gm" || playersCanDraw;
  const activeMap = mapScenes.find((scene) => scene.id === activeMapId);
  const activeMapUrl = activeMap ? mapSceneUrls[activeMap.id] : undefined;
  const diceSummary = diceTerms.map((term) => `${term.count}d${term.sides}`).join(" + ");
  const playerOwnerId = ownerIdentity(playerName);
  const ownerOptions = useMemo(() => {
    const choices = new Map<string, string>();
    for (const token of tokens) {
      const name = token.owner || (!token.enemy && !token.hidden ? token.name : undefined);
      const id = ownerIdentity(name);
      if (id && name) choices.set(id, name);
    }
    const currentName = playerName.trim();
    const currentId = ownerIdentity(currentName);
    if (currentId && currentName) choices.set(currentId, currentName);
    return [...choices.entries()].map(([id, name]) => ({ id, name }));
  }, [tokens, playerName]);

  function canEditToken(token: Token): boolean {
    return currentRole === "gm" || (!!playerOwnerId && tokenOwnerId(token) === playerOwnerId);
  }

  function canMoveToken(token: Token): boolean {
    return currentRole === "gm" || canEditToken(token) || playersCanMoveOtherTokens;
  }

  function sendMessage() {
    if (!message.trim()) return;
    addMessage({
      id: uniqueId(),
      author: playerName.trim() || "Jogador",
      text: message.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });
    setMessage("");
  }

  function publishRoll(result: DicePoolRoll) {
    setLastRoll(result.total);
    const breakdown = result.groups.map(({ term, rolls, total }) =>
      `${term.count}d${term.sides} [${rolls.map(formatDieFace).join(", ")}] = ${total}`,
    ).join(" • ");
    const status = [
      result.criticalSuccess ? "SUCESSO CRÍTICO d10" : "",
      result.criticalFailure ? "FALHA CRÍTICA d10" : "",
    ].filter(Boolean).join(" • ");
    const floorNote = result.total !== result.rawTotal
      ? ` → ${result.total} (mínimo 0 aplicado)`
      : "";
    const firstRoll = result.groups[0]?.rolls[0];
    const critical = result.criticalFailure ? "failure" : result.criticalSuccess ? "success" : undefined;
    addMessage({
      id: uniqueId(),
      author: playerName.trim() || "Jogador",
      text: `${breakdown} | ${formatSignedSum([...result.groups.map((group) => group.total), result.modifier])} = ${result.rawTotal}${floorNote}${status ? ` • ${status}` : ""}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      kind: "roll",
      critical,
      roll: {
        natural: firstRoll?.natural ?? 0,
        modifier: result.modifier,
        extraDie: firstRoll?.extraDie,
        total: result.total,
      },
    });
  }

  function rollDice() {
    if (isRolling) return;
    const result = rollDicePool(diceTerms, modifier);
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduceMotion) {
      publishRoll(result);
      return;
    }
    setLastRoll(null);
    setIsRolling(true);
    window.setTimeout(() => {
      publishRoll(result);
      setIsRolling(false);
    }, 700);
  }

  function mapPoint(clientX: number, clientY: number) {
    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();
    const width = rect.width * mapZoom;
    const height = rect.height * mapZoom;
    const pixelX = (clientX - rect.left - (rect.width - width) / 2 - mapPan.x) / mapZoom;
    const pixelY = (clientY - rect.top - (rect.height - height) / 2 - mapPan.y) / mapZoom;
    return {
      x: Math.max(0, Math.min(100, (pixelX / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (pixelY / rect.height) * 100)),
      pixelX,
      pixelY,
      rect,
    };
  }

  function moveToken(clientX: number, clientY: number) {
    const point = mapPoint(clientX, clientY);
    if (!point) return;
    const x = Math.max(4, Math.min(96, point.x));
    const y = Math.max(6, Math.min(94, point.y));
    if (sceneDragRef.current) {
      sceneDragPositionRef.current = { x, y };
      setSceneDragVisual({ id: sceneDragRef.current, x, y });
      return;
    }
    if (dragRef.current === null) return;
    dragPositionRef.current = { x, y };
    setDragVisual({ id: dragRef.current, x, y });
  }

  function changeMapZoom(delta: number) {
    setMapZoom((current) => Math.max(0.5, Math.min(2, Number((current + delta).toFixed(2)))));
  }

  function updateMapPan(clientX: number, clientY: number) {
    const drag = mapPanDragRef.current;
    if (!drag) return;
    setMapPan({
      x: drag.originX + clientX - drag.x,
      y: drag.originY + clientY - drag.y,
    });
  }

  function finishMapPan() {
    mapPanDragRef.current = null;
    setIsPanning(false);
  }

  function presentAttack(effect: AttackEffect, broadcast = false) {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const displayed = { ...effect, animated: effect.animated && !reduceMotion };
    setAttackEffect(displayed);
    if (displayed.animated) {
      const phase = attackFeedbackPhaseRef.current === 0 ? 1 : 0;
      attackFeedbackPhaseRef.current = phase;
      setAttackFeedback({
        id: effect.id,
        attackerId: effect.attackerId,
        targetId: effect.targetId,
        phase,
      });
      window.setTimeout(() => {
        setAttackFeedback((current) => current?.id === effect.id ? null : current);
      }, 190);
    }
    if (broadcast) publish("map.attack", effect);
    window.setTimeout(() => {
      setAttackEffect((current) => current?.id === displayed.id ? null : current);
    }, displayed.animated ? 230 : 120);
  }

  function fireTokenAttack(attacker: Token, target: Token) {
    presentAttack({
      id: uniqueId(),
      attackerId: attacker.id,
      targetId: target.id,
      startX: attacker.x,
      startY: attacker.y,
      endX: target.x,
      endY: target.y,
      animated: true,
    }, true);
    setAttackHint(`${attacker.name} atacou ${target.name}.`);
    window.setTimeout(() => setAttackHint(""), 900);
  }

  function cancelAttackAim() {
    attackClickCountRef.current = 0;
    setAttackShooterId(null);
  }

  function shootAtToken(attacker: Token, target: Token) {
    if (attackClickCountRef.current >= 5) return;
    fireTokenAttack(attacker, target);
    attackClickCountRef.current += 1;
    if (attackClickCountRef.current >= 5) {
      setAttackShooterId(null);
      setAttackHint("Limite de cinco tiros atingido.");
    } else {
      setAttackHint(`Tiro ${attackClickCountRef.current} de 5. Clique em outro alvo ou cancele a mira.`);
    }
  }

  function updateDiceTerm(termId: string, patch: Partial<Omit<DiceTerm, "id">>) {
    setDiceTerms((current) => normalizeDiceTerms(current.map((term) =>
      term.id === termId ? { ...term, ...patch } : term,
    )));
  }

  function commitDiceCount(termId: string, draft: string) {
    const count = Number(draft);
    if (Number.isSafeInteger(count) && count >= 1) updateDiceTerm(termId, { count: Math.min(20, count) });
    setDiceCountDrafts((drafts) => {
      const next = { ...drafts };
      delete next[termId];
      return next;
    });
  }

  function addDiceTerm() {
    setDiceTerms((current) => current.length >= 6
      ? current
      : normalizeDiceTerms([...current, { id: uniqueId(), count: 1, sides: 6 }]),
    );
  }

  function removeDiceTerm(termId: string) {
    setDiceTerms((current) => current.length <= 1
      ? current
      : normalizeDiceTerms(current.filter((term) => term.id !== termId)),
    );
  }

  async function addMapScenes(files: File[]) {
    if (currentRole !== "gm" || !files.length) return;
    setMapSceneError("");
    const added: MapScene[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setMapSceneError(`“${file.name}” não é uma imagem compatível.`);
        continue;
      }
      if (file.size > 40 * 1024 * 1024) {
        setMapSceneError(`“${file.name}” excede o limite de 40 MB.`);
        continue;
      }
      const id = uniqueId();
      const assetId = `map-scene-${id}`;
      try {
        await saveLocalAsset(assetId, "map-image", file, file.name);
        const url = createObjectUrl(file);
        mapSceneUrlsRef.current = { ...mapSceneUrlsRef.current, [id]: url };
        setMapSceneUrls(mapSceneUrlsRef.current);
        added.push({ id, name: file.name.replace(/\.[^.]+$/, "") || file.name, assetId });
      } catch (error) {
        setMapSceneError(error instanceof Error ? error.message : `Não foi possível adicionar “${file.name}”.`);
      }
    }
    if (added.length) {
      persistMapQueue([...mapScenesRef.current, ...added], added[0].id);
    }
  }

  function activateMapScene(sceneId: string) {
    if (currentRole !== "gm" || !mapScenesRef.current.some((scene) => scene.id === sceneId)) return;
    persistMapQueue(mapScenesRef.current, sceneId);
  }

  function removeMapScene(sceneId: string) {
    if (currentRole !== "gm") return;
    const scene = mapScenesRef.current.find((item) => item.id === sceneId);
    if (!scene || !window.confirm(`Remover “${scene.name}” da fila de mapas?`)) return;
    const nextScenes = mapScenesRef.current.filter((item) => item.id !== sceneId);
    const nextActive = activeMapId === sceneId ? nextScenes[0]?.id ?? null : activeMapId;
    persistMapQueue(nextScenes, nextActive);
  }

  function handlePanelResize(clientX: number) {
    if (!resizingPanelRef.current) return;
    const maximum = Math.max(280, Math.min(560, window.innerWidth - 360));
    setSidePanelWidth(Math.max(280, Math.min(maximum, window.innerWidth - clientX)));
  }

  function beginPanelResize(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    resizingPanelRef.current = true;
    document.body.classList.add("resizing-side-panel");
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function resizePanelByKeyboard(direction: -1 | 1) {
    setSidePanelWidth((width) => Math.max(280, Math.min(560, width + direction * 20)));
  }

  function finishPanelResize() {
    resizingPanelRef.current = false;
    document.body.classList.remove("resizing-side-panel");
  }

  function addSceneElement(kind: ScenePlacementKind, x: number, y: number) {
    const count = sceneElementsRef.current.filter((item) => item.kind === kind).length + 1;
    const defaults = {
      marker: { name: "Marcador", color: "#18e3d0" },
      cover: { name: "Cobertura", color: "#f5b84b" },
      hazard: { name: "Perigo", color: "#ff5d73" },
    } as const;
    const element: SceneElement = {
      id: uniqueId(),
      kind,
      name: `${defaults[kind].name} ${count}`,
      color: defaults[kind].color,
      size: "medium",
      x,
      y,
    };
    persistSceneElements([...sceneElementsRef.current, element]);
    publish("scene.upsert", element);
    setSelectedSceneElementId(element.id);
    setScenePlacementKind(null);
  }

  function updateSceneElement(id: string, patch: Partial<SceneElement>) {
    const next = sceneElementsRef.current.map((element) =>
      element.id === id ? { ...element, ...patch } : element,
    );
    persistSceneElements(next);
    const changed = next.find((element) => element.id === id);
    if (changed) publish("scene.upsert", changed);
  }

  function removeSceneElement(id: string) {
    const removed = sceneElementsRef.current.find((element) => element.id === id);
    const next = sceneElementsRef.current.filter((element) => element.id !== id);
    persistSceneElements(next);
    publish("scene.delete", { id });
    setSelectedSceneElementId((selected) => (selected === id ? null : selected));
    if (removed?.imageAssetId) {
      void removeLocalAsset(removed.imageAssetId).catch(() => undefined);
      releaseObjectUrl(assetUrls[removed.imageAssetId] || null);
      setAssetUrls((current) => {
        const nextAssets = { ...current };
        delete nextAssets[removed.imageAssetId!];
        return nextAssets;
      });
    }
  }

  async function addSceneImage(file?: File) {
    if (!file || currentRole !== "gm") return;
    if (file.type !== "image/png") {
      setSceneImageError("Selecione uma imagem PNG.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setSceneImageError("A imagem PNG deve ter até 20 MB.");
      return;
    }
    let width = 0;
    let height = 0;
    try {
      const bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;
      bitmap.close();
      const id = uniqueId();
      const imageAssetId = `scene-image-${id}`;
      await saveLocalAsset(imageAssetId, "map-image", file, file.name);
      const url = createObjectUrl(file);
      setAssetUrls((current) => ({ ...current, [imageAssetId]: url }));
      const element: SceneElement = {
        id,
        name: file.name.replace(/\.png$/i, "") || "Imagem",
        kind: "image",
        x: 50,
        y: 50,
        color: "#ffffff",
        size: "medium",
        imageAssetId,
        imageWidth: width,
        imageHeight: height,
        imageScale: 100,
      };
      const next = [...sceneElementsRef.current, element];
      persistSceneElements(next);
      publish("scene.upsert", element);
      setSelectedSceneElementId(id);
      setSelectedTokenId(null);
      setSceneImageError("");
    } catch (error) {
      setSceneImageError(error instanceof Error ? error.message : "Não foi possível adicionar a imagem.");
    }
  }

  function finishTokenDrag() {
    if (sceneDragRef.current && sceneDragPositionRef.current && sceneDragStartRef.current) {
      const id = sceneDragRef.current;
      const position = sceneDragPositionRef.current;
      const start = sceneDragStartRef.current;
      if (start.x !== position.x || start.y !== position.y) {
        const next = sceneElementsRef.current.map((item) =>
          item.id === id ? { ...item, ...position } : item,
        );
        persistSceneElements(next);
        const updated = next.find((item) => item.id === id);
        if (updated) publish("scene.upsert", updated);
      }
      setSceneDragVisual(null);
      sceneDragRef.current = null;
      sceneDragPositionRef.current = null;
      sceneDragStartRef.current = null;
      return;
    }
    const tokenId = dragRef.current;
    const position = dragPositionRef.current;
    const start = dragStartPositionRef.current;
    if (tokenId !== null && position && start && (start.x !== position.x || start.y !== position.y)) {
      const token = tokensRef.current.find((item) => item.id === tokenId);
      if (token && canMoveToken(token)) {
        persistTokens(tokensRef.current.map((item) =>
          item.id === tokenId ? { ...item, ...position } : item,
        ));
        publish("token.move", { id: tokenId, ...position });
      }
    }
    setDragVisual(null);
    dragRef.current = null;
    dragPositionRef.current = null;
    dragStartPositionRef.current = null;
  }

  function measurePoint(clientX: number, clientY: number) {
    return mapPoint(clientX, clientY);
  }

  function startMeasurement(clientX: number, clientY: number) {
    const point = measurePoint(clientX, clientY);
    if (!point) return;
    setIsMeasuring(true);
    setMeasurement({
      startX: point.x,
      startY: point.y,
      endX: point.x,
      endY: point.y,
      distance: 0,
      length: 0,
      angle: 0,
    });
  }

  function updateMeasurement(clientX: number, clientY: number) {
    if (!isMeasuring || !measurement) return;
    const point = measurePoint(clientX, clientY);
    if (!point) return;
    const startPixelX = (measurement.startX / 100) * point.rect.width;
    const startPixelY = (measurement.startY / 100) * point.rect.height;
    const deltaX = point.pixelX - startPixelX;
    const deltaY = point.pixelY - startPixelY;
    const pixels = Math.hypot(deltaX, deltaY);
    setMeasurement({
      ...measurement,
      endX: point.x,
      endY: point.y,
      distance: (pixels / 48) * 5,
      length: pixels,
      angle: Math.atan2(deltaY, deltaX),
    });
  }

  function addToken() {
    const count = tokensRef.current.length + 1;
    const owner = currentRole === "player" ? playerName.trim() || "Jogador" : undefined;
    const token: Token = {
      id: Date.now() + Math.random(),
      name: `Token ${count}`,
      initials: `T${count}`,
      x: 46,
      y: 42,
      color: "#f5c451",
      bars: createStatusBars(20),
      shape: "circle",
      size: "medium",
      showName: true,
      borderStyle: "none",
      owner,
      ownerId: ownerIdentity(owner),
    };
    persistTokens([...tokensRef.current, token]);
    publish("token.upsert", token);
  }

  function addReservedToken() {
    if (currentRole !== "gm") return;
    const count = reservedTokens.length + 1;
    const token: Token = {
      id: Date.now() + Math.random(),
      name: `Reserva ${count}`,
      initials: `R${count}`,
      x: 50,
      y: 40,
      color: "#fb5b64",
      bars: createStatusBars(20, 12, 10),
      enemy: true,
      shape: "square",
      size: "medium",
      hidden: true,
    };
    persistTokens([...tokensRef.current, token]);
    publish("token.upsert", token);
  }

  function updateToken(tokenId: number, patch: Partial<Token>) {
    const existingToken = tokensRef.current.find((token) => token.id === tokenId);
    if (!existingToken || !canEditToken(existingToken)) return;
    if (
      currentRole !== "gm" &&
      (Object.prototype.hasOwnProperty.call(patch, "owner") ||
        Object.prototype.hasOwnProperty.call(patch, "ownerId"))
    ) return;
    const next = tokensRef.current.map((token) =>
      token.id === tokenId
        ? {
            ...token,
            ...patch,
            ...(patch.name !== undefined ? { initials: initialsFromName(patch.name) } : {}),
            ...(patch.size !== undefined && patch.sizePx === undefined
              ? { sizePx: sizePixels(patch.size, undefined) }
              : {}),
          }
        : token,
    );
    persistTokens(next);
    const changed = next.find((token) => token.id === tokenId);
    if (changed) publish("token.upsert", { ...changed, image: undefined });
  }

  function removeToken(tokenId: number) {
    const token = tokensRef.current.find((item) => item.id === tokenId);
    if (!token || !canEditToken(token) || !window.confirm(`Excluir o token “${token.name}” do tabuleiro?`)) return;
    persistTokens(tokensRef.current.filter((item) => item.id !== tokenId));
    setSelectedTokenId((selected) => (selected === tokenId ? null : selected));
    if (token.imageAssetId) {
      void removeLocalAsset(token.imageAssetId).catch(() => undefined);
      setAssetUrls((current) => {
        const next = { ...current };
        const url = next[token.imageAssetId!];
        if (url) releaseObjectUrl(url);
        delete next[token.imageAssetId!];
        return next;
      });
    }
    publish("token.delete", { id: tokenId });
  }

  async function loadTokenImage(tokenId: number, file?: File) {
    if (!file) return;
    const token = tokensRef.current.find((item) => item.id === tokenId);
    if (!token || !canEditToken(token)) return;
    if (!file.type.startsWith("image/")) {
      setPdfError("Selecione um arquivo de imagem válido para o token.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPdfError("A imagem do token deve ter no máximo 15 MB.");
      return;
    }
    const assetId = `token-image-${tokenId}`;
    try {
      await saveLocalAsset(assetId, "token-image", file, file.name);
      const url = createObjectUrl(file);
      const previousUrl = assetUrls[assetId];
      if (previousUrl) releaseObjectUrl(previousUrl);
      setAssetUrls((current) => ({ ...current, [assetId]: url }));
      setPdfError("");
      updateToken(tokenId, { imageAssetId: assetId, image: url });
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : "Não foi possível salvar a imagem do token.");
    }
  }

  function drawingPoint(clientX: number, clientY: number) {
    const point = mapPoint(clientX, clientY);
    return point ? { x: point.x, y: point.y } : null;
  }

  function startDrawing(clientX: number, clientY: number) {
    const point = drawingPoint(clientX, clientY);
    if (!point) return;
    setDrawing(true);
    setStrokes((list) => [...list, { id: Date.now(), points: [point], color: drawColor }]);
  }

  function continueDrawing(clientX: number, clientY: number) {
    if (!drawing) return;
    const point = drawingPoint(clientX, clientY);
    if (!point) return;
    setStrokes((list) =>
      list.map((stroke, index) =>
        index === list.length - 1 ? { ...stroke, points: [...stroke.points, point] } : stroke,
      ),
    );
  }

  function updateBar(tokenId: number, barId: string, patch: Partial<StatusBar>) {
    const token = tokensRef.current.find((item) => item.id === tokenId);
    if (!token || !canEditToken(token)) return;
    updateToken(tokenId, {
      bars: token.bars.map((bar) => (bar.id === barId ? { ...bar, ...patch } : bar)),
    });
  }

  function commitBarValue(tokenId: number, barId: string, draft: string) {
    const token = tokensRef.current.find((item) => item.id === tokenId);
    const bar = token?.bars.find((item) => item.id === barId);
    const nextValue = draft.trim() ? Number(draft) : Number.NaN;
    if (bar && Number.isSafeInteger(nextValue) && nextValue >= 0) {
      updateBar(tokenId, barId, { value: Math.min(nextValue, bar.max) });
    }
    const key = `${tokenId}:${barId}`;
    setValueDrafts((drafts) => {
      const next = { ...drafts };
      delete next[key];
      return next;
    });
  }

  function commitBarMax(tokenId: number, barId: string, draft: string) {
    const token = tokensRef.current.find((item) => item.id === tokenId);
    const bar = token?.bars.find((item) => item.id === barId);
    const nextMax = draft.trim() ? Number(draft) : Number.NaN;
    if (bar && Number.isSafeInteger(nextMax) && nextMax > 0) {
      updateBar(tokenId, barId, { max: nextMax, value: Math.min(bar.value, nextMax) });
    }
    const key = `${tokenId}:${barId}`;
    setMaxDrafts((drafts) => {
      const next = { ...drafts };
      delete next[key];
      return next;
    });
  }

  function addStatusBar(tokenId: number) {
    const name = newBarName.trim();
    if (!name) return;
    const palette = ["#b873ff", "#19d3ae", "#ff8a4c", "#e8e95b"];
    const token = tokensRef.current.find((item) => item.id === tokenId);
    if (!token || !canEditToken(token)) return;
    updateToken(tokenId, {
      bars: [
        ...token.bars,
        {
          id: `custom-${Date.now()}`,
          name,
          value: 10,
          max: 10,
          color: palette[token.bars.length % palette.length],
          visible: true,
          custom: true,
        },
      ],
    });
    setNewBarName("");
  }

  function removeStatusBar(tokenId: number, barId: string) {
    const token = tokensRef.current.find((item) => item.id === tokenId);
    if (token && canEditToken(token)) updateToken(tokenId, { bars: token.bars.filter((bar) => bar.id !== barId) });
  }

  async function loadPdf(file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setPdfError("O arquivo precisa estar no formato PDF.");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setPdfError("O PDF deve ter no máximo 30 MB.");
      return;
    }
    const assetId = `nexus-character-sheet-${tabStorageId}`;
    try {
      await saveLocalAsset(assetId, "sheet-pdf", file, file.name);
      const url = createObjectUrl(file);
      releaseObjectUrl(pdfUrl);
      setPdfUrl(url);
      setPdfName(file.name);
      setPdfZoom(1);
      setPdfError("");
      sessionStorage.setItem("nexus-table-sheet", JSON.stringify({ id: assetId, name: file.name }));
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : "Não foi possível salvar a ficha.");
    }
  }

  async function clearPdf() {
    releaseObjectUrl(pdfUrl);
    setPdfUrl(null);
    setPdfName("");
    setPdfZoom(1);
    sessionStorage.removeItem("nexus-table-sheet");
    await removeLocalAsset(`nexus-character-sheet-${tabStorageId}`).catch(() => undefined);
  }

  async function loadAudio(file?: File) {
    if (!file || currentRole !== "gm") return;
    if (!file.type.startsWith("audio/")) {
      setAudioError("Selecione um arquivo de áudio compatível.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setAudioError("A música deve ter até 50 MB para sincronizar entre abas.");
      return;
    }
    const assetId = "nexus-table-session-audio";
    try {
      await saveLocalAsset(assetId, "session-audio", file, file.name);
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      replaceAudioSource(createObjectUrl(file), file.name);
      setAudioPlaying(false);
      setAudioNeedsInteraction(false);
      setAudioError("");
      localStorage.setItem("nexus-table-session-audio", JSON.stringify({ assetId, name: file.name, loop: audioLoop }));
      localStorage.removeItem("nexus-table-audio-control");
      publish("audio.track", { assetId, name: file.name, blob: file, loop: audioLoop });
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : "Não foi possível carregar a música.");
    }
  }

  function clearAudio() {
    if (currentRole !== "gm") return;
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    pendingAudioControlRef.current = null;
    publish("audio.clear", null);
    replaceAudioSource(null);
    setAudioPlaying(false);
    setAudioNeedsInteraction(false);
    setAudioError("");
    localStorage.removeItem("nexus-table-session-audio");
    localStorage.removeItem("nexus-table-audio-control");
    void removeLocalAsset("nexus-table-session-audio").catch(() => undefined);
  }

  function sendAudioControl(action: AudioControl["action"], loop?: boolean) {
    if (currentRole !== "gm" || !audioUrl) return;
    const command: AudioControl = {
      action,
      currentTime: action === "stop" ? 0 : audioRef.current?.currentTime || 0,
      sentAt: Date.now(),
      ...(loop === undefined ? {} : { loop }),
    };
    localStorage.setItem("nexus-table-audio-control", JSON.stringify(command));
    applyAudioControl(command);
    publish("audio.control", command);
  }

  function applyAudioControl(command: AudioControl) {
    if (command.action === "loop") {
      const loop = Boolean(command.loop);
      if (audioRef.current) audioRef.current.loop = loop;
      setAudioLoop(loop);
      return;
    }
    const player = audioRef.current;
    if (!player) return;
    pendingAudioControlRef.current = command;
    if (player.readyState < HTMLMediaElement.HAVE_METADATA) {
      player.load();
      return;
    }
    pendingAudioControlRef.current = null;
    const elapsed = command.action === "play" ? Math.max(0, (Date.now() - command.sentAt) / 1000) : 0;
    try {
      player.currentTime = Math.max(0, command.currentTime + elapsed);
    } catch {
      // O navegador aplicará a posição ao carregar os metadados da faixa.
      pendingAudioControlRef.current = command;
      return;
    }
    if (command.action === "play") {
      player.play()
        .then(() => {
          setAudioPlaying(true);
          setAudioNeedsInteraction(false);
          setAudioError("");
        })
        .catch(() => {
          pendingAudioControlRef.current = command;
          setAudioPlaying(false);
          setAudioNeedsInteraction(true);
        });
    } else {
      player.pause();
      if (command.action === "stop") player.currentTime = 0;
      setAudioPlaying(false);
      setAudioNeedsInteraction(false);
    }
  }

  function toggleAudio() {
    if (currentRole !== "gm" || !audioUrl) return;
    sendAudioControl(audioPlaying ? "pause" : "play");
  }

  function toggleAudioLoop() {
    if (currentRole !== "gm") return;
    const loop = !audioLoop;
    setAudioLoop(loop);
    if (audioRef.current) audioRef.current.loop = loop;
    localStorage.setItem("nexus-table-session-audio", JSON.stringify({
      assetId: "nexus-table-session-audio",
      name: audioName,
      loop,
    }));
    sendAudioControl("loop", loop);
  }

  function activateAudioForListener() {
    const pending = pendingAudioControlRef.current;
    if (pending) applyAudioControl(pending);
    else if (audioRef.current) sendAudioControl("play");
  }

  useEffect(() => {
    sessionStorage.setItem("nexus-table-audio-volume", String(audioVolume));
    if (audioRef.current) audioRef.current.volume = audioVolume / 100;
  }, [audioVolume, audioUrl]);

  useEffect(() => {
    let metadata: { assetId?: string; name?: string; loop?: boolean } | undefined;
    try {
      metadata = JSON.parse(localStorage.getItem("nexus-table-session-audio") || "null") as {
        assetId?: string;
        name?: string;
        loop?: boolean;
      } | undefined;
    } catch {
      metadata = undefined;
    }
    const savedAssetId = metadata?.assetId;
    if (!savedAssetId) return;
    const savedMetadata = { assetId: savedAssetId, name: metadata?.name, loop: metadata?.loop };
    void getLocalAsset(savedMetadata.assetId).then((asset) => {
      if (!asset) return;
      replaceAudioSource(createObjectUrl(asset.blob), savedMetadata.name || asset.name);
      const loop = savedMetadata.loop ?? true;
      setAudioLoop(loop);
      if (audioRef.current) audioRef.current.loop = loop;
    }).catch(() => setAudioError("A música salva não pôde ser carregada."));
  }, []);

  useEffect(() => {
    if (attackShooterId === null) return;
    const cancelOutside = (event: PointerEvent) => {
      if (mapRef.current?.contains(event.target as Node)) return;
      cancelAttackAim();
      setAttackHint("Mira cancelada.");
    };
    const cancelWithRightClick = (event: MouseEvent) => {
      if (event.altKey) return;
      event.preventDefault();
      cancelAttackAim();
      setAttackHint("Mira cancelada.");
    };
    document.addEventListener("pointerdown", cancelOutside);
    document.addEventListener("contextmenu", cancelWithRightClick);
    return () => {
      document.removeEventListener("pointerdown", cancelOutside);
      document.removeEventListener("contextmenu", cancelWithRightClick);
    };
  }, [attackShooterId]);

  if (!hasEnteredSession) {
    return (
      <main className="login-screen">
        <div className="login-backdrop" aria-hidden="true" />
        <header className="login-brand">
          <span className="brand-mark">N</span>
          <span>NEXUS<span>//</span>TABLE</span>
        </header>
        <section className="login-card" aria-labelledby="login-title">
          <span className="eyebrow">ACESSO À MESA LOCAL</span>
          <h1 id="login-title">Entre na sessão</h1>
          <p>Informe seu nome e escolha como vai participar da mesa.</p>
          <form onSubmit={startSession}>
            <label>
              Nome do jogador ou mestre
              <input
                autoFocus
                autoComplete="name"
                maxLength={32}
                required
                value={loginName}
                onChange={(event) => setLoginName(event.target.value)}
                placeholder="Ex.: Mestre Orion"
              />
            </label>
            <label>
              Papel na sessão
              <select value={loginRole} onChange={(event) => setLoginRole(event.target.value as TableRole)}>
                <option value="gm">Mestre</option>
                <option value="player">Jogador</option>
              </select>
            </label>
            <button className="login-submit" type="submit" disabled={!loginName.trim()}>
              Entrar na sessão <Icon name="users" size={16} />
            </button>
          </form>
          <small className="login-storage-note">
            Esta entrada é local e temporária. Nome e papel ficam salvos nesta aba do navegador.
          </small>
        </section>
        <footer className="login-footer"><i /> SESSÃO NEXUS // TABLE · ARMAZENAMENTO LOCAL</footer>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>
            NEXUS<span>//</span>TABLE
          </span>
        </div>
        <div className="session-title">
          <div>
            <span className="status-dot" /> MESA LOCAL
                  <small className={`tab-sync ${syncAvailable ? "available" : "unavailable"}`}>
                    {syncAvailable ? "SINCRONIZADO ENTRE ABAS DESTE NAVEGADOR" : "BroadcastChannel indisponível — usando apenas esta aba"}
                  </small>
          </div>
          <strong>Sombras de Neon</strong>
          <span className="room-code">
            <Icon name="lock" size={12} /> SOMENTE NESTE NAVEGADOR
          </span>
        </div>
        <div className="top-actions">
          <div className="avatars">
            {players.map((p) => (
              <span key={p.id} style={{ "--avatar": p.color } as React.CSSProperties}>
                {p.initials}
              </span>
            ))}
            <b>+2</b>
          </div>
          <button className="outline-btn" onClick={() => setInviteOpen(true)}>
            <Icon name="users" /> <span>Sincronizar abas</span>
          </button>
          <button
            className={`role-switch ${currentRole === "gm" ? "gm" : ""}`}
            onClick={() => {
              const nextRole = currentRole === "gm" ? "player" : "gm";
              setCurrentRole(nextRole);
              setLoginRole(nextRole);
              saveTableSession(playerName, nextRole);
              setDrawingActive(false);
              if (nextRole === "player") {
                setTab("map");
                setSceneEditMode(false);
                setScenePlacementKind(null);
                setSelectedSceneElementId(null);
              }
            }}
            title="Alternar visualização entre mestre e jogador"
          >
            <Icon name={currentRole === "gm" ? "shield" : "users"} size={15} />
            <span>{currentRole === "gm" ? "Mestre" : "Jogador"}</span>
          </button>
          <button className="session-exit" onClick={endSession} title="Sair e trocar de usuário">
            <Icon name="close" size={14} /> <span>Sair</span>
          </button>
          <button className="icon-btn" aria-label="Configurações">
            <Icon name="settings" />
          </button>
          <button
            className="mobile-menu"
            onClick={() => setSideOpen((v) => !v)}
            aria-label="Abrir painel"
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <audio
        className="audio-engine"
        ref={audioRef}
        src={audioUrl || undefined}
        loop={audioLoop}
        onLoadedMetadata={() => {
          const pending = pendingAudioControlRef.current;
          if (pending) {
            applyAudioControl(pending);
            return;
          }
          try {
            const saved = JSON.parse(localStorage.getItem("nexus-table-audio-control") || "null") as AudioControl | null;
            if (saved && ["play", "pause", "stop", "loop"].includes(saved.action)) applyAudioControl(saved);
          } catch {
            // A música continua disponível mesmo se o estado salvo estiver inválido.
          }
        }}
        onPlay={() => {
          setAudioPlaying(true);
          setAudioNeedsInteraction(false);
        }}
        onPause={() => setAudioPlaying(false)}
        onError={() => {
          if (audioUrlRef.current) setAudioError("O navegador não conseguiu reproduzir essa faixa.");
        }}
        onEnded={() => setAudioPlaying(false)}
      />

      <div
        className="workspace"
        style={{ "--side-panel-width": `${sidePanelWidth}px` } as React.CSSProperties}
      >
        <nav className="rail">
          <button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>
            <Icon name="map" />
            <span>Mesa</span>
          </button>
          {currentRole === "gm" && (
            <button className={tab === "gm" ? "active" : ""} onClick={() => setTab("gm")}>
              <Icon name="shield" />
              <span>Mestre</span>
            </button>
          )}
          <div className="rail-space" />
          <button>
            <Icon name="book" />
            <span>Compêndio</span>
          </button>
        </nav>

        <main className="main-stage">
          {tab === "map" && (
            <div className="map-layout">
              <div className="map-toolbar">
                <div>
                  <span className="eyebrow">CENA ATUAL</span>
                  <h1>
                    {activeMap?.name || "Distrito Industrial"} <span>/ Zona 07</span>
                  </h1>
                  <small className={`map-sync-status ${syncAvailable ? "available" : "unavailable"}`}>
                    {syncAvailable
                      ? "Sincronização entre abas deste navegador"
                      : "BroadcastChannel indisponível — esta aba continua funcionando"}
                  </small>
                    <div className="map-display-controls">
                      <label className="map-unit-control">
                        Unidade
                        <select value={mapUnit} onChange={(event) => setMapUnit(event.target.value as "ft" | "m")}>
                          <option value="ft">Pés (ft)</option>
                          <option value="m">Metros (m)</option>
                        </select>
                      </label>
                      {currentRole === "gm" && (
                        <label className="map-image-scale">
                          <span>Escala do mapa <b>{mapImageScale}%</b></span>
                          <input
                            type="range"
                            min="40"
                            max="200"
                            step="1"
                            value={mapImageScale}
                            aria-label="Tamanho proporcional da imagem do mapa"
                            onChange={(event) => changeMapImageScale(Number(event.target.value))}
                          />
                        </label>
                      )}
                    </div>
                </div>
                <div className="map-actions">
                  <button onClick={addToken}>
                    <Icon name="plus" /> Token
                  </button>
                  <button
                    className={showAllBars ? "active" : ""}
                    onClick={() => setShowAllBars((visible) => !visible)}
                    title={
                      showAllBars
                        ? "Mostrar status apenas do token selecionado"
                        : "Mostrar status de todos os tokens"
                    }
                  >
                    <Icon name="eye" /> {showAllBars ? "Ocultar status" : "Ver todos"}
                  </button>
                  <button
                    className={rulerActive ? "active" : ""}
                    onClick={() => {
                      setRulerActive((active) => !active);
                      setPanActive(false);
                      setDrawingActive(false);
                      setMeasurement(null);
                      setIsMeasuring(false);
                    }}
                    title="Medir distância no mapa"
                  >
                    <Icon name="ruler" /> Régua
                  </button>
                  <button
                    className={panActive ? "active" : ""}
                    aria-pressed={panActive}
                    onClick={() => {
                      const next = !panActive;
                      setPanActive(next);
                      finishMapPan();
                      if (next) {
                        setRulerActive(false);
                        setDrawingActive(false);
                        setMeasurement(null);
                        setSceneEditMode(false);
                        setScenePlacementKind(null);
                      }
                    }}
                    title={panActive ? "Desativar movimento do mapa" : "Arrastar para mover a câmera do mapa"}
                  >
                    <Icon name="map" /> Mover mapa
                  </button>
                  <button
                    className={drawingActive ? "active" : ""}
                    disabled={!canDraw}
                    onClick={() => {
                      if (!canDraw) return;
                      setDrawingActive((active) => !active);
                      setPanActive(false);
                      setRulerActive(false);
                      setMeasurement(null);
                    }}
                    title={
                      canDraw
                        ? "Desenhar sobre o mapa"
                        : "O mestre não permitiu desenhos de jogadores"
                    }
                  >
                    <Icon name="pencil" /> Desenhar
                  </button>
                  <button>
                    <Icon name="eye" /> Névoa
                  </button>
                  {currentRole === "gm" && (
                    <button
                      className={sceneEditMode ? "active" : ""}
                      onClick={() => {
                        const next = !sceneEditMode;
                        setSceneEditMode(next);
                        setPanActive(false);
                        setScenePlacementKind(null);
                        setRulerActive(false);
                        setDrawingActive(false);
                        setSelectedSceneElementId(null);
                        if (next) setSelectedTokenId(null);
                      }}
                      title="Editar elementos do cenário"
                    >
                      <Icon name="pencil" /> Cenário
                    </button>
                  )}
                  <span className="zoom">
                    <button onClick={() => changeMapZoom(-0.1)} aria-label="Diminuir zoom do mapa" title="Diminuir zoom">−</button>
                    <b>{Math.round(mapZoom * 100)}%</b>
                    <button onClick={() => changeMapZoom(0.1)} aria-label="Aumentar zoom do mapa" title="Aumentar zoom">+</button>
                  </span>
                </div>
              </div>
              <div
                ref={mapRef}
                className={`battle-map ${rulerActive ? "ruler-active" : ""} ${drawingActive ? "drawing-active" : ""} ${sceneEditMode ? "scene-editing" : ""} ${panActive ? "pan-active" : ""} ${isPanning ? "is-panning" : ""} ${attackShooterId !== null ? "attack-aiming" : ""}`}
                role="region"
                aria-label="Mapa interativo. Ative Mover mapa para arrastar a câmera; use Ctrl e a roda do mouse para zoom."
                tabIndex={0}
                onContextMenu={(event) => {
                  event.preventDefault();
                  if (!event.altKey && attackShooterId !== null) {
                    cancelAttackAim();
                    setAttackHint("Mira cancelada.");
                  }
                }}
                style={{
                  "--map-background": activeMapUrl ? `url("${activeMapUrl}")` : undefined,
                  backgroundSize: `${48 * mapZoom}px ${48 * mapZoom}px, ${48 * mapZoom}px ${48 * mapZoom}px, auto ${mapImageScale * mapZoom}%`,
                  backgroundPosition: `calc(50% + ${mapPan.x}px) calc(50% + ${mapPan.y}px), calc(50% + ${mapPan.x}px) calc(50% + ${mapPan.y}px), calc(50% + ${mapPan.x}px) calc(50% + ${mapPan.y}px)`,
                } as React.CSSProperties}
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  const target = e.target as HTMLElement;
                  if (!target.closest(".map-token") && attackShooterId !== null) {
                    cancelAttackAim();
                    setAttackHint("Mira cancelada.");
                  }
                  if (panActive) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    mapPanDragRef.current = {
                      pointerId: e.pointerId,
                      x: e.clientX,
                      y: e.clientY,
                      originX: mapPan.x,
                      originY: mapPan.y,
                    };
                    setIsPanning(true);
                    return;
                  }
                  if (
                    scenePlacementKind &&
                    sceneEditMode &&
                    !target.closest(".map-token, .scene-element, .scene-tools, .drawing-tools")
                  ) {
                    const point = mapPoint(e.clientX, e.clientY);
                    if (point) addSceneElement(scenePlacementKind, point.x, point.y);
                  } else if (drawingActive && canDraw) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    startDrawing(e.clientX, e.clientY);
                  } else if (
                    rulerActive &&
                    !target.closest(".map-token, .scene-element, .scene-tools, .drawing-tools")
                  ) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    startMeasurement(e.clientX, e.clientY);
                  }
                }}
                onPointerMove={(e) => {
                  if (mapPanDragRef.current) updateMapPan(e.clientX, e.clientY);
                  else if (drawingActive && canDraw) continueDrawing(e.clientX, e.clientY);
                  else if (rulerActive) updateMeasurement(e.clientX, e.clientY);
                  else moveToken(e.clientX, e.clientY);
                }}
                onPointerUp={() => {
                  finishMapPan();
                  finishTokenDrag();
                  setIsMeasuring(false);
                  setDrawing(false);
                }}
                onPointerLeave={() => {
                  finishMapPan();
                  finishTokenDrag();
                  setIsMeasuring(false);
                  setDrawing(false);
                }}
              >
                {sceneEditMode && (
                  <div className="scene-tools" onPointerDown={(e) => e.stopPropagation()}>
                    <strong>EDITAR CENÁRIO</strong>
                    {(["marker", "cover", "hazard"] as const).map((kind) => (
                      <button
                        key={kind}
                        className={scenePlacementKind === kind ? "active" : ""}
                        onClick={() => setScenePlacementKind((current) => current === kind ? null : kind)}
                      >
                        {kind === "marker" ? "＋ Marcador" : kind === "cover" ? "▰ Cobertura" : "⚠ Perigo"}
                      </button>
                    ))}
                    <label className="scene-image-upload">
                      ＋ PNG
                      <input
                        type="file"
                        accept="image/png,.png"
                        onChange={(event) => {
                          void addSceneImage(event.currentTarget.files?.[0]);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {sceneImageError && <small className="scene-image-error" role="alert">{sceneImageError}</small>}
                    <small>{scenePlacementKind ? "Clique em um espaço vazio do mapa para inserir." : "Selecione um elemento para mover ou editar."}</small>
                  </div>
                )}
                <div className="map-zoom-layer" style={{ transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})` }}>
                <svg
                  className="drawing-layer"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {strokes.map((stroke) => (
                    <polyline
                      key={stroke.id}
                      points={stroke.points.map((point) => `${point.x},${point.y}`).join(" ")}
                      fill="none"
                      stroke={stroke.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                {sceneElements.map((element) => (
                  <button
                    key={element.id}
                    type="button"
                    className={`scene-element scene-${element.kind} scene-size-${element.size} ${selectedSceneElementId === element.id ? "selected" : ""}`}
                    style={{
                      left: `${sceneDragVisual?.id === element.id ? sceneDragVisual.x : element.x}%`,
                      top: `${sceneDragVisual?.id === element.id ? sceneDragVisual.y : element.y}%`,
                      "--scene-color": element.color,
                      ...(element.kind === "image" ? {
                        width: `${Math.max(1, element.imageWidth || 1) * (element.imageScale || 100) / 100}px`,
                      } : {}),
                    } as React.CSSProperties}
                    aria-label={`${element.name}, ${element.kind === "image" ? "imagem PNG" : element.kind === "marker" ? "marcador" : element.kind === "cover" ? "cobertura" : "perigo"}`}
                    disabled={!sceneEditMode || currentRole !== "gm"}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      if (!sceneEditMode || currentRole !== "gm") return;
                      event.currentTarget.setPointerCapture(event.pointerId);
                      sceneDragRef.current = element.id;
                      sceneDragStartRef.current = { x: element.x, y: element.y };
                      sceneDragPositionRef.current = { x: element.x, y: element.y };
                      setSceneDragVisual({ id: element.id, x: element.x, y: element.y });
                      setSelectedSceneElementId(element.id);
                      setSelectedTokenId(null);
                    }}
                    onClick={() => {
                      if (sceneEditMode && currentRole === "gm") {
                        setSelectedSceneElementId(element.id);
                        setSelectedTokenId(null);
                      }
                    }}
                  >
                    {element.kind === "image" ? (
                      <img className="scene-image-art" src={element.imageAssetId ? assetUrls[element.imageAssetId] : undefined} alt="" />
                    ) : (
                      <span>{element.kind === "marker" ? "◆" : element.kind === "cover" ? "▰" : "⚠"}</span>
                    )}
                    <small>{element.name}</small>
                  </button>
                ))}
                {tokens
                  .filter((token) => !token.hidden)
                  .map((token) => (
                    <button
                      key={token.id}
                      style={
                        {
                          left: `${dragVisual?.id === token.id ? dragVisual.x : token.x}%`,
                          top: `${dragVisual?.id === token.id ? dragVisual.y : token.y}%`,
                          "--token": token.color,
                           "--token-size": `${sizePixels(token.size, token.sizePx)}px`,
                        } as React.CSSProperties
                      }
                      onPointerDown={(e) => {
                        if (e.button === 2 && e.altKey) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (rulerActive || drawingActive || sceneEditMode || panActive) return;
                          if (currentRole !== "gm" && !canEditToken(token)) {
                            setAttackHint("Você só pode atirar com um token próprio ou atribuído pelo Mestre.");
                            return;
                          }
                          attackClickCountRef.current = 0;
                          setAttackShooterId(token.id);
                          setSelectedTokenId(token.id);
                          setSelectedSceneElementId(null);
                          setAttackHint(`${token.name} pronto. Clique em alvos até cinco vezes; cada clique dispara um tiro.`);
                          return;
                        }
                        if (e.button === 0 && attackShooterId !== null) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (rulerActive || drawingActive || sceneEditMode || panActive) return;
                          const attacker = tokensRef.current.find((item) => item.id === attackShooterId);
                          if (!attacker || (currentRole !== "gm" && !canEditToken(attacker))) {
                            cancelAttackAim();
                            setAttackHint("Atacante indisponível ou sem permissão.");
                            return;
                          }
                          if (attacker.id === token.id) {
                            setAttackHint("Escolha outro token como alvo.");
                            return;
                          }
                          shootAtToken(attacker, token);
                          return;
                        }
                        if (e.button !== 0) return;
                        if (rulerActive || drawingActive || sceneEditMode || panActive) return;
                        if (canMoveToken(token)) {
                          e.currentTarget.setPointerCapture(e.pointerId);
                          dragRef.current = token.id;
                          dragStartPositionRef.current = { x: token.x, y: token.y };
                          dragPositionRef.current = { x: token.x, y: token.y };
                          setDragVisual({ id: token.id, x: token.x, y: token.y });
                        }
                        setSelectedTokenId(token.id);
                        setSelectedSceneElementId(null);
                        setAttackHint(canEditToken(token)
                          ? "Use Alt + botão direito para preparar um tiro."
                          : "Token bloqueado: selecione um token que você controla para atacar.");
                      }}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        if (event.altKey) event.stopPropagation();
                      }}
                      className={`map-token ${token.enemy ? "enemy" : ""} shape-${token.shape || "circle"} size-${token.size || "medium"} border-${token.borderStyle || "none"} ${canMoveToken(token) ? "" : "locked"} ${attackShooterId === token.id ? "attack-shooter" : ""} ${attackFeedback?.attackerId === token.id ? `attack-feedback-shooter-${attackFeedback.phase}` : ""} ${attackFeedback?.targetId === token.id ? `attack-feedback-target-${attackFeedback.phase}` : ""}`}
                      aria-label={`${token.name}, ${canMoveToken(token) ? "arrastável" : `bloqueado; proprietário: ${token.owner || "nenhum"}`}`}
                      title={canMoveToken(token) ? `Mover ${token.name}` : `Bloqueado • Proprietário: ${token.owner || "nenhum"}`}
                    >
                      {(token.imageAssetId && assetUrls[token.imageAssetId]) || token.image ? (
                        <img src={(token.imageAssetId && assetUrls[token.imageAssetId]) || token.image} alt="" />
                      ) : (
                        <span>{token.initials}</span>
                      )}
                      {token.showName !== false && <small>{token.name}</small>}
                      {(showAllBars || selectedTokenId === token.id) && (
                        <div className="token-bars">
                          {token.bars
                            .filter((bar) => bar.visible)
                            .map((bar) => (
                              <span
                                className="token-bar"
                                key={bar.id}
                                title={`${bar.name}: ${bar.value}/${bar.max}`}
                                style={{ "--bar": bar.color } as React.CSSProperties}
                              >
                                <b
                                  style={{
                                    width: `${Math.max(0, Math.min(100, (bar.value / bar.max) * 100))}%`,
                                  }}
                                />
                              </span>
                            ))}
                        </div>
                      )}
                    </button>
                  ))}
                {measurement && (
                  <div
                    className="measurement"
                    style={
                      {
                        "--start-x": `${measurement.startX}%`,
                        "--start-y": `${measurement.startY}%`,
                        "--measure-width": `${measurement.length}px`,
                        "--measure-angle": `${measurement.angle}rad`,
                      } as React.CSSProperties
                    }
                  >
                    <span className="measure-start" />
                    <div className="measure-line" />
                  <strong>{formatDistance(measurement.distance, mapUnit)}</strong>
                    <span className="measure-end" />
                  </div>
                )}
                {attackEffect && (
                  <svg className="attack-effect" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <filter id={`attack-glow-${attackEffect.id}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="0.45" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <path
                      className="attack-beam-glow"
                      d={`M ${attackEffect.startX} ${attackEffect.startY} L ${attackEffect.endX} ${attackEffect.endY}`}
                      pathLength="100"
                    />
                    <path
                      className="attack-beam"
                      d={`M ${attackEffect.startX} ${attackEffect.startY} L ${attackEffect.endX} ${attackEffect.endY}`}
                      pathLength="100"
                      filter={`url(#attack-glow-${attackEffect.id})`}
                    />
                    <circle
                      className="attack-projectile"
                      cx={attackEffect.animated ? attackEffect.startX : attackEffect.endX}
                      cy={attackEffect.animated ? attackEffect.startY : attackEffect.endY}
                      r="0.5"
                    >
                      {attackEffect.animated && (
                        <animateMotion
                          dur="180ms"
                          path={`M ${attackEffect.startX} ${attackEffect.startY} L ${attackEffect.endX} ${attackEffect.endY}`}
                          fill="freeze"
                          rotate="auto"
                        />
                      )}
                    </circle>
                    <circle className="attack-impact" cx={attackEffect.endX} cy={attackEffect.endY} r="0.9" />
                  </svg>
                )}
                </div>
                {drawingActive && (
                  <div className="drawing-tools" onPointerDown={(e) => e.stopPropagation()}>
                    <span>DESENHO</span>
                    {["#18e3d0", "#ff5d73", "#f5b84b", "#ffffff"].map((color) => (
                      <button
                        key={color}
                        className={drawColor === color ? "selected" : ""}
                        style={{ "--draw": color } as React.CSSProperties}
                        onClick={() => setDrawColor(color)}
                        aria-label={`Cor ${color}`}
                      />
                    ))}
                    <button
                      className="draw-action"
                      onClick={() => setStrokes((list) => list.slice(0, -1))}
                      disabled={!strokes.length}
                    >
                      Desfazer
                    </button>
                    <button
                      className="draw-action danger"
                      onClick={() => setStrokes([])}
                      disabled={!strokes.length}
                    >
                      Limpar
                    </button>
                  </div>
                )}
                {selectedTokenId &&
                  (() => {
                    const selected = tokens.find((token) => token.id === selectedTokenId);
                    if (!selected) return null;
                    const selectedCanEdit = canEditToken(selected);
                    const selectedOwnerId = tokenOwnerId(selected);
                    const selectedOwnerName = selected.owner || ownerOptions.find((owner) => owner.id === selectedOwnerId)?.name;
                    return (
                      <div
                        className="token-status-panel"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <header>
                          <span
                            className="selected-avatar"
                            style={{ "--token": selected.color } as React.CSSProperties}
                          >
                            {selected.initials}
                          </span>
                          <div>
                            <small>{selectedCanEdit ? "STATUS DO TOKEN" : "TOKEN BLOQUEADO"}</small>
                            <strong>{selected.name}</strong>
                          </div>
                          <button
                            className={`token-name-quick-toggle ${selected.showName === false ? "off" : ""}`}
                            disabled={!selectedCanEdit}
                            aria-label={selected.showName === false ? "Exibir nome no mapa" : "Ocultar nome no mapa"}
                            aria-pressed={selected.showName !== false}
                            title={selected.showName === false ? "Exibir nome no mapa" : "Ocultar nome no mapa"}
                            onClick={() => updateToken(selected.id, { showName: selected.showName === false })}
                          >
                            <Icon name="eye" size={14} />
                            <span>Nome</span>
                          </button>
                          <button
                            className="status-close"
                            onClick={() => setSelectedTokenId(null)}
                            aria-label="Fechar painel"
                          >
                            <Icon name="close" size={16} />
                          </button>
                        </header>
                        <p className={`token-permission-note ${selectedCanEdit ? "editable" : "locked"}`}>
                          {selectedCanEdit ? "Proprietário" : "Somente visualização · proprietário"}: {selectedOwnerName || "nenhum"}
                        </p>
                        {attackHint && <p className="attack-hint" role="status">{attackHint}</p>}
                        <div className="status-list">
                          {selected.bars.map((bar) => (
                            <div
                              className={`status-item ${bar.visible ? "" : "hidden"}`}
                              key={bar.id}
                            >
                              <div className="status-label">
                                <i style={{ background: bar.color }} />
                                <strong>{bar.name}</strong>
                                <span>
                                  {bar.value} / {bar.max}
                                </span>
                                <button
                                  className="visibility-btn"
                                  disabled={!selectedCanEdit}
                                  onClick={() =>
                                    updateBar(selected.id, bar.id, { visible: !bar.visible })
                                  }
                                  title={bar.visible ? "Ocultar no mapa" : "Mostrar no mapa"}
                                >
                                  <Icon name="eye" size={14} />
                                </button>
                                <button
                                  className="remove-bar"
                                  disabled={!selectedCanEdit}
                                  onClick={() => removeStatusBar(selected.id, bar.id)}
                                  title="Apagar barra"
                                >
                                  <Icon name="close" size={14} />
                                </button>
                              </div>
                              <div className="status-control">
                                <input
                                  type="range"
                                  disabled={!selectedCanEdit}
                                  min="0"
                                  max={bar.max}
                                  value={Math.min(bar.value, bar.max)}
                                  style={{ "--bar": bar.color } as React.CSSProperties}
                                  onChange={(e) =>
                                    updateBar(selected.id, bar.id, {
                                      value: Number(e.target.value),
                                    })
                                  }
                                />
                                <input
                                  aria-label={`Valor atual de ${bar.name}`}
                                  type="text"
                                  disabled={!selectedCanEdit}
                                  inputMode="numeric"
                                  value={valueDrafts[`${selected.id}:${bar.id}`] ?? String(bar.value)}
                                  onFocus={() => setValueDrafts((drafts) => ({
                                    ...drafts,
                                    [`${selected.id}:${bar.id}`]: String(bar.value),
                                  }))}
                                  onChange={(event) => setValueDrafts((drafts) => ({
                                    ...drafts,
                                    [`${selected.id}:${bar.id}`]: event.target.value.replace(/[^0-9]/g, ""),
                                  }))}
                                  onBlur={(event) => commitBarValue(selected.id, bar.id, event.currentTarget.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") event.currentTarget.blur();
                                  }}
                                />
                                <span>/</span>
                                <input
                                  aria-label={`Valor máximo de ${bar.name}`}
                                  type="text"
                                  disabled={!selectedCanEdit}
                                  inputMode="numeric"
                                  value={maxDrafts[`${selected.id}:${bar.id}`] ?? String(bar.max)}
                                  onFocus={() => setMaxDrafts((drafts) => ({
                                    ...drafts,
                                    [`${selected.id}:${bar.id}`]: String(bar.max),
                                  }))}
                                  onChange={(event) => setMaxDrafts((drafts) => ({
                                    ...drafts,
                                    [`${selected.id}:${bar.id}`]: event.target.value.replace(/[^0-9]/g, ""),
                                  }))}
                                  onBlur={(event) => commitBarMax(selected.id, bar.id, event.currentTarget.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") event.currentTarget.blur();
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="add-status">
                          <input
                            disabled={!selectedCanEdit}
                            value={newBarName}
                            onChange={(e) => setNewBarName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addStatusBar(selected.id)}
                            placeholder="Nome da nova barra"
                            maxLength={18}
                          />
                          <button
                            disabled={!selectedCanEdit || !newBarName.trim()}
                            onClick={() => addStatusBar(selected.id)}
                          >
                            <Icon name="plus" size={15} /> Adicionar
                          </button>
                        </div>
                          <div className="token-customizer">
                            <div className="customizer-title">
                              <span>IDENTIDADE DO TOKEN</span>
                              <small>Alterações locais nesta mesa</small>
                            </div>
                            {currentRole === "gm" && (
                              <label className="token-owner-control">
                                Proprietário do token
                                <select
                                  value={selectedOwnerId || ""}
                                  onChange={(event) => {
                                    const owner = ownerOptions.find((choice) => choice.id === event.target.value);
                                    updateToken(selected.id, {
                                      ownerId: owner?.id,
                                      owner: owner?.name,
                                    });
                                  }}
                                >
                                  <option value="">Sem proprietário</option>
                                  {ownerOptions.map((owner) => (
                                    <option key={owner.id} value={owner.id}>{owner.name}</option>
                                  ))}
                                </select>
                              </label>
                            )}
                            <div className="token-identity">
                              <label>
                                Nome
                                <input
                                  value={selected.name}
                                  disabled={!selectedCanEdit}
                                  maxLength={32}
                                  onChange={(event) => updateToken(selected.id, { name: event.target.value })}
                                />
                              </label>
                              <label>
                                Cor
                                <input
                                  type="color"
                                  value={selected.color}
                                  disabled={!selectedCanEdit}
                                  onChange={(event) => updateToken(selected.id, { color: event.target.value })}
                                />
                              </label>
                            </div>
                            <label className="token-border-control">
                              Estilo da borda
                              <select
                                value={selected.borderStyle || "none"}
                                disabled={!selectedCanEdit}
                                onChange={(event) => updateToken(selected.id, {
                                  borderStyle: event.target.value as Token["borderStyle"],
                                })}
                              >
                                <option value="none">Sem borda</option>
                                <option value="bordered">Com borda</option>
                              </select>
                            </label>
                            <label className="token-name-toggle">
                              <input
                                type="checkbox"
                                checked={selected.showName !== false}
                                disabled={!selectedCanEdit}
                                onChange={(event) => updateToken(selected.id, { showName: event.target.checked })}
                              />
                              <span>Exibir nome abaixo do token</span>
                            </label>
                            <label className="token-size-control">
                              <span>Tamanho no mapa <b>{sizePixels(selected.size, selected.sizePx)} px</b></span>
                              <input
                                type="range"
                                disabled={!selectedCanEdit}
                                min="24"
                                max="96"
                                step="1"
                                value={sizePixels(selected.size, selected.sizePx)}
                                aria-label="Tamanho do token no mapa"
                                onChange={(event) => updateToken(selected.id, { sizePx: Number(event.target.value) })}
                              />
                            </label>
                            <div className="customizer-row">
                              <label className={`token-upload ${selectedCanEdit ? "" : "disabled"}`}>
                                <Icon name="upload" size={14} />
                                {selected.imageAssetId ? "Trocar imagem" : "Adicionar imagem"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={!selectedCanEdit}
                                  onChange={(e) => loadTokenImage(selected.id, e.target.files?.[0])}
                                />
                              </label>
                              {selected.imageAssetId && (
                                <button
                                  className="remove-image"
                                  disabled={!selectedCanEdit}
                                  onClick={async () => {
                                    if (selected.imageAssetId) {
                                      await removeLocalAsset(selected.imageAssetId).catch(() => undefined);
                                      releaseObjectUrl(assetUrls[selected.imageAssetId] || null);
                                      setAssetUrls((current) => {
                                        const next = { ...current };
                                        delete next[selected.imageAssetId!];
                                        return next;
                                      });
                                    }
                                    updateToken(selected.id, { image: undefined, imageAssetId: undefined });
                                  }}
                                >
                                  Remover
                                </button>
                              )}
                              {pdfError && <small className="file-error">{pdfError}</small>}
                            </div>
                            <div className="token-options">
                              <label>
                                Formato
                                <span>
                                  {(["circle", "square", "hex"] as const).map((shape) => (
                                    <button
                                      key={shape}
                                      className={selected.shape === shape ? "active" : ""}
                                      disabled={!selectedCanEdit}
                                      onClick={() => updateToken(selected.id, { shape })}
                                      title={
                                        shape === "circle"
                                          ? "Círculo"
                                          : shape === "square"
                                            ? "Quadrado"
                                            : "Hexágono"
                                      }
                                    >
                                      <i className={`shape-preview ${shape}`} />
                                    </button>
                                  ))}
                                </span>
                              </label>
                              <label>
                                Tamanho
                                <select
                                  value={selected.size}
                                  disabled={!selectedCanEdit}
                                  onChange={(e) =>
                                    updateToken(selected.id, {
                                      size: e.target.value as Token["size"],
                                      sizePx: e.target.value === "small" ? 32 : e.target.value === "large" ? 58 : 42,
                                    })
                                  }
                                >
                                  <option value="small">Pequeno</option>
                                  <option value="medium">Médio</option>
                                  <option value="large">Grande</option>
                                </select>
                              </label>
                            </div>
                            <button className="token-delete" disabled={!selectedCanEdit} onClick={() => removeToken(selected.id)}>
                              <Icon name="trash" size={14} /> Excluir token
                            </button>
                          </div>
                      </div>
                    );
                  })()}
                {selectedSceneElementId && sceneEditMode && currentRole === "gm" &&
                  (() => {
                    const selected = sceneElements.find((element) => element.id === selectedSceneElementId);
                    if (!selected) return null;
                    return (
                      <div className="scene-properties-panel" onPointerDown={(event) => event.stopPropagation()}>
                        <header>
                          <strong>ELEMENTO DO CENÁRIO</strong>
                          <button onClick={() => setSelectedSceneElementId(null)} aria-label="Fechar propriedades">
                            <Icon name="close" size={15} />
                          </button>
                        </header>
                        <label>
                          Nome
                          <input
                            value={selected.name}
                            maxLength={32}
                            onChange={(event) => updateSceneElement(selected.id, { name: event.target.value })}
                          />
                        </label>
                        <label>
                          Cor
                          <input
                            type="color"
                            value={selected.color}
                            onChange={(event) => updateSceneElement(selected.id, { color: event.target.value })}
                          />
                        </label>
                        <label>
                          Tamanho
                          <select
                            value={selected.size}
                            onChange={(event) => updateSceneElement(selected.id, { size: event.target.value as SceneElement["size"] })}
                          >
                            <option value="small">Pequeno</option>
                            <option value="medium">Médio</option>
                            <option value="large">Grande</option>
                          </select>
                        </label>
                        {selected.kind === "image" && (
                          <label className="scene-image-scale-control">
                            Tamanho da imagem · original {selected.imageWidth} × {selected.imageHeight} px
                            <input
                              type="range"
                              min="10"
                              max="300"
                              step="1"
                              value={selected.imageScale || 100}
                              aria-label="Escala proporcional da imagem PNG"
                              onChange={(event) => updateSceneElement(selected.id, { imageScale: Number(event.target.value) })}
                            />
                            <output>{selected.imageScale || 100}%</output>
                          </label>
                        )}
                        <button className="scene-delete" onClick={() => removeSceneElement(selected.id)}>
                          <Icon name="trash" size={14} /> Remover elemento
                        </button>
                      </div>
                    );
                  })()}
                <div className="map-coordinate">GRID {formatDistance(5, mapUnit).toUpperCase()} • X:042 Y:117</div>
              </div>
            </div>
          )}

          {tab === "gm" && (
            <section className="gm-view">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">PAINEL PRIVADO</span>
                  <h1>Central do mestre</h1>
                  <p>Organize o combate e mantenha os segredos da cena sob controle.</p>
                </div>
                <button className="primary-btn" onClick={addToken}>
                  <Icon name="plus" /> Criar encontro
                </button>
              </div>
              <div className="gm-grid">
                <div className="gm-card initiative">
                  <div className="card-title">
                    <span>
                      <Icon name="sword" /> Iniciativa
                    </span>
                    <button
                      onClick={() => setInitiative((i) => [...i].sort((a, b) => b.value - a.value))}
                    >
                      Ordenar
                    </button>
                  </div>
                  {initiative.map((item, index) => (
                    <div className={`initiative-row ${index === 0 ? "turn" : ""}`} key={item.name}>
                      <b>{index + 1}</b>
                      <span style={{ background: item.color }}>
                        {item.name.slice(0, 2).toUpperCase()}
                      </span>
                      <strong>{item.name}</strong>
                      <input
                        value={item.value}
                        onChange={(e) =>
                          setInitiative((list) =>
                            list.map((x) =>
                              x.name === item.name ? { ...x, value: Number(e.target.value) } : x,
                            ),
                          )
                        }
                      />
                    </div>
                  ))}
                  <button className="add-line">
                    <Icon name="plus" /> Adicionar participante
                  </button>
                </div>
                <div className="gm-card">
                  <div className="card-title">
                    <span>
                      <Icon name="file" /> Notas secretas
                    </span>
                    <small>SALVO</small>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anote pistas, NPCs e segredos..."
                  />
                </div>
                <div className="gm-card quick">
                  <div className="card-title">
                    <span>
                      <Icon name="eye" /> Controles da cena
                    </span>
                  </div>
                  <button>
                    <i /> Revelar toda a névoa
                  </button>
                  <button>
                    <i /> Ocultar nomes de inimigos
                  </button>
                  <button
                    className={playersCanMoveOtherTokens ? "active" : ""}
                    aria-pressed={playersCanMoveOtherTokens}
                    onClick={() => setPlayersCanMoveOtherTokens((allowed) => !allowed)}
                    title="Controla somente tokens que não pertencem ao jogador"
                  >
                    <i className={playersCanMoveOtherTokens ? "on" : ""} />
                    {playersCanMoveOtherTokens ? "Bloquear movimento de tokens alheios" : "Permitir mover tokens alheios"}
                  </button>
                  <button onClick={() => setPlayersCanDraw((allowed) => !allowed)}>
                    <i className={playersCanDraw ? "on" : ""} />
                    Jogadores podem desenhar
                  </button>
                </div>
                <div className="gm-card encounters">
                  <div className="card-title">
                    <span>
                      <Icon name="map" /> Fila de mapas
                    </span>
                    <label className="map-queue-add">
                      <Icon name="upload" size={13} /> Adicionar
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => {
                          const files = Array.from(event.currentTarget.files || []);
                          void addMapScenes(files);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <p className="map-queue-help">Adicione imagens para preparar cenas e selecione uma para exibir no mapa.</p>
                  {mapSceneError && <small className="map-queue-error" role="alert">{mapSceneError}</small>}
                  <div className="map-queue-list">
                    {mapScenes.length ? mapScenes.map((scene, index) => (
                      <div className={`map-queue-item ${activeMapId === scene.id ? "selected" : ""}`} key={scene.id}>
                        <button
                          className="map-queue-select"
                          onClick={() => activateMapScene(scene.id)}
                          aria-pressed={activeMapId === scene.id}
                          title={`Exibir ${scene.name} na mesa`}
                        >
                          <b>{String(index + 1).padStart(2, "0")}</b>
                          <span>{scene.name}<small>{activeMapId === scene.id ? "Ativo na mesa" : "Selecionar cena"}</small></span>
                        </button>
                        <button
                          className="map-queue-remove"
                          onClick={() => removeMapScene(scene.id)}
                          aria-label={`Remover ${scene.name} da fila`}
                          title="Remover mapa"
                        >
                          <Icon name="trash" size={13} />
                        </button>
                      </div>
                    )) : (
                      <div className="map-queue-empty">Nenhum mapa carregado. A mesa usa o fundo padrão.</div>
                    )}
                  </div>
                </div>
                <div className="gm-card reserve-card">
                  <div className="card-title">
                    <span>
                      <Icon name="eye" /> Tokens reservados
                    </span>
                    <button onClick={addReservedToken}>
                      <Icon name="plus" size={13} /> Preparar
                    </button>
                  </div>
                  <p className="reserve-description">
                    Invisíveis para os jogadores até você revelar.
                  </p>
                  <div className="reserve-list">
                    {reservedTokens.length ? (
                      reservedTokens.map((token) => (
                        <div className="reserve-token" key={token.id}>
                          <span style={{ "--token": token.color } as React.CSSProperties}>
                            {token.initials}
                          </span>
                          <div>
                            <strong>{token.name}</strong>
                            <small>
                              {token.size === "small"
                                ? "Pequeno"
                                : token.size === "large"
                                  ? "Grande"
                                  : "Médio"}{" "}
                              • privado
                            </small>
                          </div>
                          <button
                            onClick={() => {
                              updateToken(token.id, { hidden: false });
                              setTab("map");
                              setSelectedTokenId(token.id);
                            }}
                          >
                            Revelar
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="reserve-empty">Nenhum token preparado.</div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className={`side-panel ${sideOpen ? "open" : ""} ${sidePanelExpanded ? "expanded" : ""}`}>
          <div
            className="side-panel-resize-handle"
            role="separator"
            aria-label="Redimensionar painel lateral"
            aria-orientation="vertical"
            aria-valuemin={280}
            aria-valuemax={560}
            aria-valuenow={sidePanelWidth}
            tabIndex={0}
            onPointerDown={beginPanelResize}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                resizePanelByKeyboard(1);
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                resizePanelByKeyboard(-1);
              }
            }}
          />
          <div className="panel-tabs">
            <button
              className={rightPanel === "chat" ? "active" : ""}
              onClick={() => setRightPanel("chat")}
            >
              <Icon name="message" /> Chat
            </button>
            <button
              className={rightPanel === "dice" ? "active" : ""}
              onClick={() => setRightPanel("dice")}
            >
              <Icon name="dice" /> Dados
            </button>
            <button
              className={rightPanel === "sheet" ? "active" : ""}
              onClick={() => setRightPanel("sheet")}
            >
              <Icon name="file" /> Ficha
            </button>
            <button
              className={rightPanel === "music" ? "active" : ""}
              onClick={() => setRightPanel("music")}
            >
              <Icon name="music" /> Áudio
            </button>
            <button
              className="panel-expand"
              onClick={() => setSidePanelExpanded((expanded) => !expanded)}
              aria-label={sidePanelExpanded ? "Restaurar painel lateral" : "Maximizar painel lateral"}
              aria-expanded={sidePanelExpanded}
              title={sidePanelExpanded ? "Restaurar painel" : "Maximizar painel"}
            >
              <Icon name={sidePanelExpanded ? "minimize" : "maximize"} size={16} />
            </button>
            <button
              className="panel-close"
              onClick={() => {
                setSidePanelExpanded(false);
                setSideOpen(false);
              }}
              aria-label="Fechar painel lateral"
            >
              <Icon name="close" />
            </button>
          </div>
          {rightPanel === "chat" ? (
            <>
              <div className="chat-identity">
                <label htmlFor="table-player-name">NOME NESTA ABA</label>
                <input
                  id="table-player-name"
                  value={playerName}
                  maxLength={32}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setLoginName(e.target.value);
                    saveTableSession(e.target.value, currentRole);
                    try {
                      sessionStorage.setItem("nexus-table-player-name", e.target.value);
                    } catch {
                      // O nome continua valendo nesta aba mesmo sem sessionStorage.
                    }
                  }}
                />
              </div>
              <div className="messages">
                <div className="day-divider">
                  <span>HOJE</span>
                  {currentRole === "gm" && (
                    <button className="chat-clear" onClick={clearChat} title="Limpar histórico do chat">
                      <Icon name="trash" size={12} /> Limpar
                    </button>
                  )}
                </div>
                {messages.map((msg) => (
                  <div className={`message ${msg.kind === "roll" ? "roll" : ""} ${msg.critical ? `critical-${msg.critical}` : ""}`} key={msg.id}>
                    <div className="msg-avatar">
                      {msg.author === "Sistema" ? (
                        <Icon name="dice" size={14} />
                      ) : (
                        msg.author.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <header>
                        <b>{msg.author}</b>
                        <time>{msg.time}</time>
                      </header>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="composer">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Diga alguma coisa..."
                />
                <button onClick={sendMessage} aria-label="Enviar">
                  <Icon name="send" />
                </button>
              </div>
            </>
          ) : rightPanel === "dice" ? (
            <div className="dice-panel">
              <div className={`dice-result ${lastRoll !== null ? "rolled" : ""} ${isRolling ? "rolling" : ""}`} aria-live="polite" aria-busy={isRolling}>
                <Icon name="dice" size={28} />
                <span>{lastRoll ?? "—"}</span>
                <small>{isRolling ? "ROLANDO" : `${diceSummary.toUpperCase()} • RESULTADO`}</small>
              </div>
              <p className="red-die-label">
                {diceTerms.some((term) => term.sides === 10)
                  ? "D10 • REGRA DE CRÍTICO CYBERPUNK RED"
                  : "MONTE SUA ROLAGEM"}
              </p>
              <div className="dice-term-list">
                {diceTerms.map((term) => (
                  <div className="dice-term-row" key={term.id}>
                    <label>
                      Qtd.
                      <input
                        type="text"
                        inputMode="numeric"
                        value={diceCountDrafts[term.id] ?? String(term.count)}
                        disabled={isRolling}
                        aria-label={`Quantidade de dados d${term.sides}`}
                        onFocus={() => setDiceCountDrafts((drafts) => ({ ...drafts, [term.id]: String(term.count) }))}
                        onChange={(event) => setDiceCountDrafts((drafts) => ({
                          ...drafts,
                          [term.id]: event.target.value.replace(/[^0-9]/g, ""),
                        }))}
                        onBlur={(event) => commitDiceCount(term.id, event.currentTarget.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") event.currentTarget.blur();
                        }}
                      />
                    </label>
                    <label>
                      Dado
                      <select
                        value={term.sides}
                        disabled={isRolling}
                        aria-label="Tipo de dado"
                        onChange={(event) => updateDiceTerm(term.id, { sides: Number(event.target.value) })}
                      >
                        {Array.from({ length: 100 }, (_, index) => index + 1).map((sides) => (
                          <option key={sides} value={sides}>d{sides}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="dice-term-remove"
                      disabled={isRolling || diceTerms.length <= 1}
                      aria-label={`Remover grupo ${term.count}d${term.sides}`}
                      title="Remover grupo"
                      onClick={() => removeDiceTerm(term.id)}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="dice-add-term" onClick={addDiceTerm} disabled={isRolling || diceTerms.length >= 6}>
                <Icon name="plus" size={14} /> Adicionar tipo de dado
              </button>
              <label>
                Modificador
                <div className="modifier">
                  <button disabled={isRolling} onClick={() => setModifier((m) => m - 1)}>−</button>
                  <b>
                    {modifier > 0 ? "+" : ""}
                    {modifier}
                  </b>
                  <button disabled={isRolling} onClick={() => setModifier((m) => m + 1)}>+</button>
                </div>
              </label>
              <button className="roll-btn" onClick={rollDice} disabled={isRolling}>
                <Icon name="dice" /> {isRolling ? `Rolando ${diceSummary}…` : `Rolar ${diceSummary}`}
              </button>
              <small className="dice-hint">Até 6 grupos, com 1 a 20 dados por grupo. No d10, naturais 10 e 1 incluem um dado adicional.</small>
            </div>
          ) : rightPanel === "sheet" ? (
            <div className="side-sheet">
              <div className="side-sheet-heading">
                <span className="eyebrow">ACESSO RÁPIDO</span>
                <h2>Ficha de personagem</h2>
                <p>Consulte seu PDF sem sair da mesa.</p>
              </div>
              {pdfUrl ? (
                <div className="side-pdf">
                  <div>
                    <Icon name="file" />
                    <span title={pdfName}>{pdfName}</span>
                    <div className="pdf-zoom-controls" aria-label="Controles de zoom do PDF">
                      <button
                        onClick={() => setPdfZoom((zoom) => Math.max(0.5, Number((zoom - 0.1).toFixed(2))))}
                        aria-label="Diminuir zoom do PDF"
                        title="Diminuir zoom"
                        disabled={pdfZoom <= 0.5}
                      >
                        −
                      </button>
                      <button
                        onClick={() => setPdfZoom(1)}
                        aria-label="Restaurar zoom do PDF para 100%"
                        title="Restaurar zoom"
                      >
                        {Math.round(pdfZoom * 100)}%
                      </button>
                      <button
                        onClick={() => setPdfZoom((zoom) => Math.min(2, Number((zoom + 0.1).toFixed(2))))}
                        aria-label="Aumentar zoom do PDF"
                        title="Aumentar zoom"
                        disabled={pdfZoom >= 2}
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => void clearPdf()} aria-label="Remover ficha salva">
                      <Icon name="close" />
                    </button>
                  </div>
                  <div className="pdf-viewport">
                    <iframe
                      src={pdfUrl}
                      title="Ficha de personagem"
                      style={{ transform: `scale(${pdfZoom})` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="side-pdf-empty">
                  <div className="side-file-art">
                    <Icon name="file" size={34} />
                    <span>PDF</span>
                  </div>
                  <h3>Sua ficha sempre à mão</h3>
                  <p>Carregue a ficha que você já usa para consultar durante a sessão.</p>
                  <label className="primary-btn">
                    <Icon name="upload" /> Selecionar PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => loadPdf(e.target.files?.[0])}
                    />
                  </label>
                  <small>O PDF é guardado neste navegador e não é compartilhado com outras abas.</small>
                </div>
              )}
              {pdfError && <p className="file-error" role="alert">{pdfError}</p>}
            </div>
          ) : (
            <div className="music-panel">
              <div className="music-heading">
                <span className="eyebrow">TRILHA DA SESSÃO</span>
                <h2>Mesa de som</h2>
                <p>Crie a atmosfera da cena sem sair da mesa.</p>
              </div>
              {audioUrl ? (
                <div className="now-playing">
                  <div className={`music-art ${audioPlaying ? "playing" : ""}`}>
                    <Icon name="music" size={30} />
                    <span />
                  </div>
                  <span className="playing-label">
                    {audioPlaying ? "TOCANDO AGORA" : currentRole === "gm" ? "PAUSADO" : "PAUSADO PELO MESTRE"}
                  </span>
                  <strong title={audioName}>{audioName}</strong>
                  <div className="sound-wave" aria-hidden="true">
                    {Array.from({ length: 22 }, (_, index) => (
                      <i key={index} style={{ height: `${8 + ((index * 7) % 22)}px` }} />
                    ))}
                  </div>
                  {currentRole === "gm" ? (
                    <button className="play-button" onClick={toggleAudio} aria-label={audioPlaying ? "Pausar música para a sessão" : "Reproduzir música para a sessão"}>
                      <Icon name={audioPlaying ? "pause" : "play"} size={23} />
                    </button>
                  ) : (
                    <p className="shared-audio-status">O Mestre controla a reprodução para todos.</p>
                  )}
                  {audioNeedsInteraction && (
                    <button className="audio-activate" onClick={activateAudioForListener}>
                      Ativar áudio neste navegador
                    </button>
                  )}
                  <label className="volume-control">
                    <span>VOLUME LOCAL</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                    />
                    <b>{audioVolume}%</b>
                  </label>
                  {currentRole === "gm" && (
                    <>
                      <button
                        className={`loop-toggle ${audioLoop ? "active" : ""}`}
                        onClick={toggleAudioLoop}
                        aria-pressed={audioLoop}
                      >
                        <i />
                        Repetir faixa para todos
                      </button>
                      <div className="track-actions">
                        <label>
                          <Icon name="upload" /> Trocar música
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              void loadAudio(e.target.files?.[0]);
                              e.currentTarget.value = "";
                            }}
                          />
                        </label>
                        <button onClick={clearAudio}>Remover</button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="music-empty">
                  <div className="music-empty-icon">
                    <Icon name="music" size={37} />
                  </div>
                  <h3>{currentRole === "gm" ? "Adicione uma trilha" : "Aguardando o Mestre"}</h3>
                  <p>{currentRole === "gm"
                    ? "Escolha uma música para compartilhar com as abas desta mesa neste navegador."
                    : "A música escolhida pelo Mestre aparecerá aqui para você ouvir."}</p>
                  {currentRole === "gm" && (
                    <>
                      <label className="primary-btn">
                        <Icon name="upload" /> Escolher áudio
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            void loadAudio(e.target.files?.[0]);
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                      <small>MP3, WAV, OGG e outros formatos do navegador. Até 50 MB.</small>
                    </>
                  )}
                </div>
              )}
              {audioError && <p className="file-error audio-error" role="alert">{audioError}</p>}
              <div className="local-audio-note">
                {currentRole === "gm"
                  ? "A faixa e os comandos sincronizam entre abas da mesa abertas neste navegador."
                  : "Ajustar o volume altera somente o áudio ouvido por você."}
              </div>
            </div>
          )}
        </aside>
      </div>

      <button className="floating-chat" onClick={() => setSideOpen(true)} aria-label="Abrir chat">
        <Icon name="message" />
      </button>

      {inviteOpen && (
        <div className="modal-backdrop" onMouseDown={() => setInviteOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setInviteOpen(false)}>
              <Icon name="close" />
            </button>
            <div className="modal-icon">
              <Icon name="users" size={26} />
            </div>
            <span className="eyebrow">MULTIPLAYER LOCAL</span>
            <h2>Abra outra aba</h2>
            <p>As ações são sincronizadas em abas abertas com este mesmo endereço e navegador. Isso não conecta outros computadores nem navegadores.</p>
            <label>O QUE É COMPARTILHADO</label>
            <div className="code-field local-sync-list">
              <b>Movimentos concluídos, chat, rolagens e ferramentas do mestre</b>
            </div>
            <div className="privacy-note">
              <Icon name="lock" />
              <span>
                <b>Dados locais</b>Fichas e imagens ficam neste navegador; não existe convite online neste MVP.
              </span>
            </div>
            <button className="primary-btn full" onClick={() => setInviteOpen(false)}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
