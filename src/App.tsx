import { useEffect, useMemo, useRef, useState } from "react";
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
  | "pencil";

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
  image?: string;
  imageAssetId?: string;
  shape?: "circle" | "square" | "hex";
  size?: "small" | "medium" | "large";
  hidden?: boolean;
};
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
  const [tab, setTab] = useState<Tab>("map");
  const [currentRole, setCurrentRole] = useState<"gm" | "player">("gm");
  const [rightPanel, setRightPanel] = useState<"chat" | "dice" | "sheet" | "music">("chat");
  const [tokens, setTokens] = useState<Token[]>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("nexus-table-tokens") || localStorage.getItem("nexus-tokens") || "",
      ) as Token[];
      return saved.map((token) => ({
        ...token,
        image: token.image?.startsWith("blob:") ? undefined : token.image,
        bars: token.bars?.length ? token.bars : createStatusBars(token.hp || 20),
        shape: token.shape || (token.enemy ? "square" : "circle"),
        size: token.size || "medium",
        owner:
          token.owner ||
          (token.name === "Nyx" || token.name === "Kade" || token.name === "Vex"
            ? token.name
            : undefined),
      }));
    } catch {
      return initialTokens;
    }
  });
  const [dragVisual, setDragVisual] = useState<{ id: number; x: number; y: number } | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
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
  const [playersCanDraw, setPlayersCanDraw] = useState(() => {
    const current = localStorage.getItem("nexus-table-player-drawing");
    return current === null
      ? localStorage.getItem("nexus-player-drawing") === "true"
      : current === "true";
  });
  const [newBarName, setNewBarName] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nexus-table-messages") || "") as Message[];
    } catch {
      return initialMessages;
    }
  });
  const [message, setMessage] = useState("");
  const [modifier, setModifier] = useState(0);
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
  const [audioVolume, setAudioVolume] = useState(65);
  const [audioLoop, setAudioLoop] = useState(true);
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
  const dragRef = useRef<number | null>(null);
  const dragPositionRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartPositionRef = useRef<{ x: number; y: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
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
    try {
      return sessionStorage.getItem("nexus-table-player-name") || "Mestre Orion";
    } catch {
      return "Mestre Orion";
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

  const persistTokens = (next: Token[]) => {
    tokensRef.current = next;
    setTokens(next);
  };
  const publish = <T,>(type: TableEvent["type"], payload: T) => channelRef.current?.publish(type, payload);
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
    initiativeRef.current = initiative;
    localStorage.setItem("nexus-table-initiative", JSON.stringify(initiative));
    if (suppressSharedEffectRef.current.initiative) suppressSharedEffectRef.current.initiative = false;
    else publish("gm.initiative", initiative);
  }, [initiative]);
  useEffect(() => localStorage.setItem("nexus-table-drawings", JSON.stringify(strokes)), [strokes]);
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
    const channel = createTableChannel();
    channelRef.current = channel;
    setSyncAvailable(channel.supported);
    // Eventos recebidos só atualizam esta aba: eles nunca são publicados de novo.
    const unsubscribe = channel.subscribe((event: TableEvent) => {
      if (event.type === "token.upsert") {
        const token = event.payload as Token;
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
      } else if (event.type === "chat.message") {
        const incoming = event.payload as Message;
        addMessage(incoming, false);
        if (incoming.kind === "roll" && incoming.roll) setLastRoll(incoming.roll.total);
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

  const players = useMemo(() => tokens.filter((t) => !t.enemy && !t.hidden), [tokens]);
  const reservedTokens = useMemo(() => tokens.filter((token) => token.hidden), [tokens]);
  const canDraw = currentRole === "gm" || playersCanDraw;

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

  function rollDice() {
    const natural = Math.floor(Math.random() * 10) + 1;
    const critical = natural === 10 ? "success" : natural === 1 ? "failure" : undefined;
    const extraDie = critical ? Math.floor(Math.random() * 10) + 1 : undefined;
    const total = natural + (extraDie ?? 0) * (critical === "failure" ? -1 : 1) + modifier;
    setLastRoll(total);
    const extraText = extraDie === undefined ? "" : ` ${critical === "failure" ? "−" : "+"} ${extraDie}`;
    const modifierText = modifier ? ` ${modifier > 0 ? "+" : "−"} ${Math.abs(modifier)}` : "";
    const status = critical === "success" ? " • SUCESSO CRÍTICO" : critical === "failure" ? " • FALHA CRÍTICA" : "";
    addMessage({
      id: uniqueId(),
      author: playerName.trim() || "Jogador",
      text: `Cyberpunk RED: d10 ${natural}${extraText}${modifierText} = ${total}${status}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      kind: "roll",
      critical,
      roll: { natural, modifier, extraDie, total },
    });
  }

  function moveToken(clientX: number, clientY: number) {
    if (!dragRef.current || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(6, Math.min(94, ((clientY - rect.top) / rect.height) * 100));
    dragPositionRef.current = { x, y };
    setDragVisual({ id: dragRef.current, x, y });
  }

  function finishTokenDrag() {
    const tokenId = dragRef.current;
    const position = dragPositionRef.current;
    const start = dragStartPositionRef.current;
    if (tokenId !== null && position && start && (start.x !== position.x || start.y !== position.y)) {
      const token = tokensRef.current.find((item) => item.id === tokenId);
      if (token) {
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
    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
      pixelX: clientX - rect.left,
      pixelY: clientY - rect.top,
      rect,
    };
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
      distance: Math.round((pixels / 48) * 5),
      length: pixels,
      angle: Math.atan2(deltaY, deltaX),
    });
  }

  function addToken() {
    const count = tokensRef.current.length + 1;
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
    };
    persistTokens([...tokensRef.current, token]);
    publish("token.upsert", token);
  }

  function addReservedToken() {
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
    const next = tokensRef.current.map((token) =>
      token.id === tokenId ? { ...token, ...patch } : token,
    );
    persistTokens(next);
    const changed = next.find((token) => token.id === tokenId);
    if (changed) publish("token.upsert", { ...changed, image: undefined });
  }

  async function loadTokenImage(tokenId: number, file?: File) {
    if (!file) return;
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
    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    };
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
    if (!token) return;
    updateToken(tokenId, {
      bars: token.bars.map((bar) => (bar.id === barId ? { ...bar, ...patch } : bar)),
    });
  }

  function addStatusBar(tokenId: number) {
    const name = newBarName.trim();
    if (!name) return;
    const palette = ["#b873ff", "#19d3ae", "#ff8a4c", "#e8e95b"];
    const token = tokensRef.current.find((item) => item.id === tokenId);
    if (!token) return;
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
    if (token) updateToken(tokenId, { bars: token.bars.filter((bar) => bar.id !== barId) });
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
    sessionStorage.removeItem("nexus-table-sheet");
    await removeLocalAsset(`nexus-character-sheet-${tabStorageId}`).catch(() => undefined);
  }

  function loadAudio(file?: File) {
    if (!file) return;
    releaseObjectUrl(audioUrl);
    const url = createObjectUrl(file);
    setAudioUrl(url);
    setAudioName(file.name);
    setAudioPlaying(false);
  }

  function toggleAudio() {
    if (!audioRef.current || !audioUrl) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
      return;
    }
    audioRef.current
      .play()
      .then(() => setAudioPlaying(true))
      .catch(() => setAudioPlaying(false));
  }

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = audioVolume / 100;
  }, [audioVolume, audioUrl]);

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
              setDrawingActive(false);
              if (nextRole === "player") setTab("map");
            }}
            title="Alternar visualização entre mestre e jogador"
          >
            <Icon name={currentRole === "gm" ? "shield" : "users"} size={15} />
            <span>{currentRole === "gm" ? "Mestre" : "Jogador"}</span>
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

      <div className="workspace">
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
                    Distrito Industrial <span>/ Zona 07</span>
                  </h1>
                  <small className={`map-sync-status ${syncAvailable ? "available" : "unavailable"}`}>
                    {syncAvailable
                      ? "Sincronização entre abas deste navegador"
                      : "BroadcastChannel indisponível — esta aba continua funcionando"}
                  </small>
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
                      setDrawingActive(false);
                      setMeasurement(null);
                      setIsMeasuring(false);
                    }}
                    title="Medir distância no mapa"
                  >
                    <Icon name="ruler" /> Régua
                  </button>
                  <button
                    className={drawingActive ? "active" : ""}
                    disabled={!canDraw}
                    onClick={() => {
                      if (!canDraw) return;
                      setDrawingActive((active) => !active);
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
                  <span className="zoom">
                    − <b>100%</b> +
                  </span>
                </div>
              </div>
              <div
                ref={mapRef}
                className={`battle-map ${rulerActive ? "ruler-active" : ""} ${drawingActive ? "drawing-active" : ""}`}
                onPointerDown={(e) => {
                  if (drawingActive && canDraw) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    startDrawing(e.clientX, e.clientY);
                  } else if (rulerActive && e.target === e.currentTarget) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    startMeasurement(e.clientX, e.clientY);
                  }
                }}
                onPointerMove={(e) => {
                  if (drawingActive && canDraw) continueDrawing(e.clientX, e.clientY);
                  else if (rulerActive) updateMeasurement(e.clientX, e.clientY);
                  else moveToken(e.clientX, e.clientY);
                }}
                onPointerUp={() => {
                  finishTokenDrag();
                  setIsMeasuring(false);
                  setDrawing(false);
                }}
                onPointerLeave={() => {
                  finishTokenDrag();
                  setIsMeasuring(false);
                  setDrawing(false);
                }}
              >
                <svg className="drawing-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
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
                {tokens
                  .filter((token) => !token.hidden)
                  .map((token) => (
                    <button
                      key={token.id}
                      className={`map-token ${token.enemy ? "enemy" : ""} shape-${token.shape || "circle"} size-${token.size || "medium"}`}
                      style={
                        {
                          left: `${dragVisual?.id === token.id ? dragVisual.x : token.x}%`,
                          top: `${dragVisual?.id === token.id ? dragVisual.y : token.y}%`,
                          "--token": token.color,
                        } as React.CSSProperties
                      }
                      onPointerDown={(e) => {
                        if (rulerActive || drawingActive) return;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        dragRef.current = token.id;
                        dragStartPositionRef.current = { x: token.x, y: token.y };
                        dragPositionRef.current = { x: token.x, y: token.y };
                        setDragVisual({ id: token.id, x: token.x, y: token.y });
                        setSelectedTokenId(token.id);
                      }}
                      aria-label={`Mover ${token.name}`}
                    >
                      {(token.imageAssetId && assetUrls[token.imageAssetId]) || token.image ? (
                        <img src={(token.imageAssetId && assetUrls[token.imageAssetId]) || token.image} alt="" />
                      ) : (
                        <span>{token.initials}</span>
                      )}
                      <small>{token.name}</small>
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
                    <strong>{measurement.distance} ft</strong>
                    <span className="measure-end" />
                  </div>
                )}
                {selectedTokenId &&
                  (() => {
                    const selected = tokens.find((token) => token.id === selectedTokenId);
                    if (!selected) return null;
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
                            <small>STATUS DO TOKEN</small>
                            <strong>{selected.name}</strong>
                          </div>
                          <button
                            className="status-close"
                            onClick={() => setSelectedTokenId(null)}
                            aria-label="Fechar painel"
                          >
                            <Icon name="close" size={16} />
                          </button>
                        </header>
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
                                  onClick={() =>
                                    updateBar(selected.id, bar.id, { visible: !bar.visible })
                                  }
                                  title={bar.visible ? "Ocultar no mapa" : "Mostrar no mapa"}
                                >
                                  <Icon name="eye" size={14} />
                                </button>
                                <button
                                  className="remove-bar"
                                  onClick={() => removeStatusBar(selected.id, bar.id)}
                                  title="Apagar barra"
                                >
                                  <Icon name="close" size={14} />
                                </button>
                              </div>
                              <div className="status-control">
                                <input
                                  type="range"
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
                                  type="number"
                                  min="0"
                                  value={bar.value}
                                  onChange={(e) =>
                                    updateBar(selected.id, bar.id, {
                                      value: Math.max(0, Number(e.target.value)),
                                    })
                                  }
                                />
                                <span>/</span>
                                <input
                                  aria-label={`Valor máximo de ${bar.name}`}
                                  type="number"
                                  min="1"
                                  value={bar.max}
                                  onChange={(e) => {
                                    const max = Math.max(1, Number(e.target.value));
                                    updateBar(selected.id, bar.id, {
                                      max,
                                      value: Math.min(bar.value, max),
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="add-status">
                          <input
                            value={newBarName}
                            onChange={(e) => setNewBarName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addStatusBar(selected.id)}
                            placeholder="Nome da nova barra"
                            maxLength={18}
                          />
                          <button
                            onClick={() => addStatusBar(selected.id)}
                            disabled={!newBarName.trim()}
                          >
                            <Icon name="plus" size={15} /> Adicionar
                          </button>
                        </div>
                        {!selected.enemy && (
                          <div className="token-customizer">
                            <div className="customizer-title">
                              <span>PERSONAGEM</span>
                              <small>Somente você pode editar</small>
                            </div>
                            <div className="customizer-row">
                              <label className="token-upload">
                                <Icon name="upload" size={14} />
                                {selected.imageAssetId ? "Trocar imagem" : "Adicionar imagem"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => loadTokenImage(selected.id, e.target.files?.[0])}
                                />
                              </label>
                              {selected.imageAssetId && (
                                <button
                                  className="remove-image"
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
                                  onChange={(e) =>
                                    updateToken(selected.id, {
                                      size: e.target.value as Token["size"],
                                    })
                                  }
                                >
                                  <option value="small">Pequeno</option>
                                  <option value="medium">Médio</option>
                                  <option value="large">Grande</option>
                                </select>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                <div className="map-coordinate">GRID 5FT • X:042 Y:117</div>
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
                  <button>
                    <i className="on" /> Permitir mover tokens
                  </button>
                  <button onClick={() => setPlayersCanDraw((allowed) => !allowed)}>
                    <i className={playersCanDraw ? "on" : ""} />
                    Jogadores podem desenhar
                  </button>
                </div>
                <div className="gm-card encounters">
                  <div className="card-title">
                    <span>
                      <Icon name="map" /> Cenas preparadas
                    </span>
                  </div>
                  <button className="selected">
                    <b>01</b>
                    <span>
                      Distrito Industrial<small>Ativa agora</small>
                    </span>
                  </button>
                  <button>
                    <b>02</b>
                    <span>
                      Sublevel Bar<small>4 tokens</small>
                    </span>
                  </button>
                  <button>
                    <b>03</b>
                    <span>
                      Torre Kessler<small>Não iniciada</small>
                    </span>
                  </button>
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

        <aside className={`side-panel ${sideOpen ? "open" : ""}`}>
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
            <button className="panel-close" onClick={() => setSideOpen(false)}>
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
              <div className={`dice-result ${lastRoll !== null ? "rolled" : ""}`}>
                <Icon name="dice" size={28} />
                <span>{lastRoll ?? "—"}</span>
                <small>RESULTADO</small>
              </div>
              <p className="red-die-label">CYBERPUNK RED • D10</p>
              <label>
                Modificador
                <div className="modifier">
                  <button onClick={() => setModifier((m) => m - 1)}>−</button>
                  <b>
                    {modifier > 0 ? "+" : ""}
                    {modifier}
                  </b>
                  <button onClick={() => setModifier((m) => m + 1)}>+</button>
                </div>
              </label>
              <button className="roll-btn" onClick={rollDice}>
                <Icon name="dice" /> Rolar d10
              </button>
              <small className="dice-hint">Resultados naturais 10 e 1 incluem um d10 adicional e são destacados no chat.</small>
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
                    <button onClick={() => void clearPdf()} aria-label="Remover ficha salva">
                      <Icon name="close" />
                    </button>
                  </div>
                  <iframe src={pdfUrl} title="Ficha de personagem" />
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
              <audio
                ref={audioRef}
                src={audioUrl || undefined}
                loop={audioLoop}
                onEnded={() => setAudioPlaying(false)}
              />
              {audioUrl ? (
                <div className="now-playing">
                  <div className={`music-art ${audioPlaying ? "playing" : ""}`}>
                    <Icon name="music" size={30} />
                    <span />
                  </div>
                  <span className="playing-label">
                    {audioPlaying ? "TOCANDO AGORA" : "PAUSADO"}
                  </span>
                  <strong title={audioName}>{audioName}</strong>
                  <div className="sound-wave" aria-hidden="true">
                    {Array.from({ length: 22 }, (_, index) => (
                      <i key={index} style={{ height: `${8 + ((index * 7) % 22)}px` }} />
                    ))}
                  </div>
                  <button className="play-button" onClick={toggleAudio}>
                    <Icon name={audioPlaying ? "pause" : "play"} size={23} />
                  </button>
                  <label className="volume-control">
                    <span>VOLUME</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                    />
                    <b>{audioVolume}%</b>
                  </label>
                  <button
                    className={`loop-toggle ${audioLoop ? "active" : ""}`}
                    onClick={() => setAudioLoop((loop) => !loop)}
                  >
                    <i />
                    Repetir faixa
                  </button>
                  <div className="track-actions">
                    <label>
                      <Icon name="upload" /> Trocar música
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => loadAudio(e.target.files?.[0])}
                      />
                    </label>
                    <button
                      onClick={() => {
                        audioRef.current?.pause();
                        setAudioPlaying(false);
                        setAudioUrl(null);
                        setAudioName("");
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="music-empty">
                  <div className="music-empty-icon">
                    <Icon name="music" size={37} />
                  </div>
                  <h3>Adicione uma trilha</h3>
                  <p>Escolha uma música ou som ambiente salvo no seu dispositivo.</p>
                  <label className="primary-btn">
                    <Icon name="upload" /> Escolher áudio
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => loadAudio(e.target.files?.[0])}
                    />
                  </label>
                  <small>MP3, WAV, OGG e outros formatos do navegador.</small>
                </div>
              )}
              <div className="local-audio-note">
                <Icon name="lock" size={14} />
                O áudio permanece somente neste navegador.
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
