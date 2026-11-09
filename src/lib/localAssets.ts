export type LocalAssetKind = "sheet-pdf" | "token-image";

export type LocalAsset = {
  id: string;
  kind: LocalAssetKind;
  name: string;
  type: string;
  blob: Blob;
  updatedAt: number;
};

const DATABASE_NAME = "nexus-table-assets";
const STORE_NAME = "assets";
const DATABASE_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("O armazenamento local de arquivos não está disponível neste navegador."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível abrir o armazenamento local."));
  });
}

export async function saveLocalAsset(
  id: string,
  kind: LocalAssetKind,
  file: Blob,
  name: string,
): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({
        id,
        kind,
        name,
        type: file.type || "application/octet-stream",
        blob: file,
        updatedAt: Date.now(),
      } satisfies LocalAsset);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Não foi possível salvar o arquivo."));
      transaction.onabort = () => reject(transaction.error ?? new Error("O salvamento do arquivo foi cancelado."));
    });
  } finally {
    database.close();
  }
}

export async function getLocalAsset(id: string): Promise<LocalAsset | undefined> {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve(request.result as LocalAsset | undefined);
      request.onerror = () => reject(request.error ?? new Error("Não foi possível carregar o arquivo."));
    });
  } finally {
    database.close();
  }
}

export async function removeLocalAsset(id: string): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Não foi possível remover o arquivo."));
    });
  } finally {
    database.close();
  }
}
