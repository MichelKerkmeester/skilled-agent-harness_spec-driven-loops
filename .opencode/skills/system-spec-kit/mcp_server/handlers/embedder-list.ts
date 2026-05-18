// -------------------------------------------------------------------
// MODULE: Embedder List Handler
// -------------------------------------------------------------------

import { checkDatabaseUpdated } from '../core/index.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import { get_db } from '../lib/search/vector-index-store.js';
import {
  getActiveEmbedder,
  getAdapter,
  listManifests,
} from '../lib/embedders/index.js';
import { parseBoundedEnv } from '../lib/util/env.js';

import type { BackendKind } from '../lib/embedders/index.js';
import type { MCPResponse } from './types.js';

// -------------------------------------------------------------------
// 1. TYPE DEFINITIONS
// -------------------------------------------------------------------

interface EmbedderListEntry {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind;
  readonly active: boolean;
  readonly ready: boolean;
  readonly notes?: string;
}

// -------------------------------------------------------------------
// 2. CONSTANTS
// -------------------------------------------------------------------

const DEFAULT_READY_TIMEOUT_MS = 750;
const MIN_READY_TIMEOUT_MS = 50;
const MAX_READY_TIMEOUT_MS = 10_000;

// -------------------------------------------------------------------
// 3. HELPERS
// -------------------------------------------------------------------

function getReadyTimeoutMs(): number {
  return parseBoundedEnv(
    'EMBEDDER_READY_TIMEOUT_MS',
    DEFAULT_READY_TIMEOUT_MS,
    MIN_READY_TIMEOUT_MS,
    MAX_READY_TIMEOUT_MS,
  );
}

async function withTimeout(promise: Promise<boolean>, timeoutMs: number): Promise<boolean> {
  let timer: NodeJS.Timeout | null = null;
  try {
    return await Promise.race([
      promise,
      new Promise<boolean>((resolve) => {
        timer = setTimeout(() => resolve(false), timeoutMs);
      }),
    ]);
  } catch {
    return false;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function probeReady(name: string, timeoutMs: number): Promise<boolean> {
  try {
    const adapter = getAdapter(name);
    if (!adapter) {
      return false;
    }
    return await withTimeout(adapter.ready(), timeoutMs);
  } catch {
    return false;
  }
}

// -------------------------------------------------------------------
// 4. HANDLER
// -------------------------------------------------------------------

export async function handleEmbedderList(): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:embedder_list');
  const startTime = Date.now();
  await checkDatabaseUpdated();

  const db = get_db();
  const active = getActiveEmbedder(db);
  const timeoutMs = getReadyTimeoutMs();
  const manifests = listManifests();
  const readiness = await Promise.all(
    manifests.map((manifest) => probeReady(manifest.name, timeoutMs)),
  );

  const data: EmbedderListEntry[] = manifests.map((manifest, index) => ({
    name: manifest.name,
    dim: manifest.dim,
    backend: manifest.backend,
    active: manifest.name === active.name,
    ready: readiness[index] ?? false,
    ...(manifest.notes ? { notes: manifest.notes } : {}),
  }));

  return createMCPSuccessResponse({
    tool: 'embedder_list',
    summary: `Listed ${data.length} embedders`,
    data,
    startTime,
  });
}

export const handle_embedder_list = handleEmbedderList;
