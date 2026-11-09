export type TableEventType =
  | "token.upsert"
  | "token.move"
  | "chat.message"
  | "gm.notes"
  | "gm.initiative"
  | "gm.drawing-permission";

export type TableEvent<T = unknown> = {
  version: 1;
  id: string;
  source: string;
  sentAt: number;
  type: TableEventType;
  payload: T;
};

export type TableChannel = {
  sourceId: string;
  supported: boolean;
  publish: <T>(type: TableEventType, payload: T) => void;
  subscribe: (listener: (event: TableEvent) => void) => () => void;
  close: () => void;
};

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Opens one BroadcastChannel for this tab. Every event carries a source and a
 * unique ID so the receiver can ignore its own messages and reject duplicates.
 * Received events are applied by the UI without being published again, which
 * prevents tabs from echoing an event back and forth.
 */
export function createTableChannel(name = "nexus-table-mvp-v1"): TableChannel {
  const sourceId = createId();
  if (typeof BroadcastChannel === "undefined") {
    return {
      sourceId,
      supported: false,
      publish: () => undefined,
      subscribe: () => () => undefined,
      close: () => undefined,
    };
  }

  let channel: BroadcastChannel;
  try {
    channel = new BroadcastChannel(name);
  } catch {
    return {
      sourceId,
      supported: false,
      publish: () => undefined,
      subscribe: () => () => undefined,
      close: () => undefined,
    };
  }
  const listeners = new Set<(event: TableEvent) => void>();
  const seen = new Set<string>();

  channel.onmessage = (message: MessageEvent<unknown>) => {
    const event = message.data as Partial<TableEvent> | null;
    if (
      !event ||
      event.version !== 1 ||
      typeof event.id !== "string" ||
      typeof event.source !== "string" ||
      typeof event.type !== "string" ||
      event.source === sourceId ||
      seen.has(event.id)
    ) {
      return;
    }

    seen.add(event.id);
    if (seen.size > 500) seen.clear();
    listeners.forEach((listener) => listener(event as TableEvent));
  };

  return {
    sourceId,
    supported: true,
    publish<T>(type: TableEventType, payload: T) {
      const event: TableEvent<T> = {
        version: 1,
        id: createId(),
        source: sourceId,
        sentAt: Date.now(),
        type,
        payload,
      };
      channel.postMessage(event);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    close() {
      listeners.clear();
      channel.close();
    },
  };
}
