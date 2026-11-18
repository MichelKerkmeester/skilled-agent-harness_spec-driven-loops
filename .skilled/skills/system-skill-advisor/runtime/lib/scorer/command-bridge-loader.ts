// ───────────────────────────────────────────────────────────────────
// MODULE: Command Bridge Loader
// ───────────────────────────────────────────────────────────────────
// Reads the command bridges from the generated JSON at runtime, so a project
// that regenerates the JSON (for example after overlaying its own command
// routes) gets the new bridges without rebuilding the advisor. The rendering
// mirrors renderTypescriptBridge in derive-command-bridges.cjs; a test holds the
// two equal on the shipped JSON. Any read or shape failure returns null and the
// caller keeps the compiled copy.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { CommandBridgeProjection } from './projection.js';

const FILENAME = 'command-bridges.generated.json';

const HERE = dirname(fileURLToPath(import.meta.url));
// scripts/ sits at the runtime root and is not copied into dist, so the path is
// tried from both the source layout and the compiled dist layout.
const CANDIDATE_PATHS: readonly string[] = [
  join(HERE, '..', '..', 'scripts', 'command-bridges', FILENAME),
  join(HERE, '..', '..', '..', '..', 'scripts', 'command-bridges', FILENAME),
];

interface TypescriptRuntime {
  enabled: boolean;
  order?: number;
  id?: string;
  name?: string;
  description?: string;
  keywords?: string[];
  domains?: string[];
  intentSignals?: string[];
  leadPhrases?: string[];
  readOnly?: boolean;
}

interface BridgeEntry {
  id: string;
  skillId: string;
  runtime: { typescript: TypescriptRuntime };
}

function isBridgeEntry(value: unknown): value is BridgeEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<BridgeEntry>;
  return typeof entry.id === 'string'
    && typeof entry.skillId === 'string'
    && typeof entry.runtime?.typescript?.enabled === 'boolean';
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function ordered(entries: BridgeEntry[]): BridgeEntry[] {
  return [...entries].sort((left, right) => {
    const leftRuntime = left.runtime.typescript;
    const rightRuntime = right.runtime.typescript;
    if (leftRuntime.enabled !== rightRuntime.enabled) return leftRuntime.enabled ? -1 : 1;
    if (leftRuntime.enabled && rightRuntime.enabled) {
      return (leftRuntime.order ?? 0) - (rightRuntime.order ?? 0);
    }
    return left.id.localeCompare(right.id);
  });
}

function render(entry: BridgeEntry): CommandBridgeProjection {
  const runtime = entry.runtime.typescript;
  const active = runtime.enabled;
  const leadPhrases = active ? strings(runtime.leadPhrases) : [];
  return {
    inventoryId: entry.id,
    ownerSkill: entry.skillId,
    routingEnabled: active,
    id: active && typeof runtime.id === 'string' ? runtime.id : entry.id,
    kind: 'command',
    family: 'system',
    category: 'command',
    name: active && typeof runtime.name === 'string' ? runtime.name : entry.id,
    description: active && typeof runtime.description === 'string' ? runtime.description : '',
    keywords: active ? strings(runtime.keywords) : [],
    domains: active ? strings(runtime.domains) : [],
    intentSignals: active ? strings(runtime.intentSignals) : [],
    ...(leadPhrases.length > 0 ? { leadPhrases } : {}),
    ...(active && runtime.readOnly === true ? { readOnly: true } : {}),
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  } as CommandBridgeProjection;
}

/** Read and render the bridges JSON, or null when it is missing or malformed. */
export function loadCommandBridges(path?: string): CommandBridgeProjection[] | null {
  const target = path ?? CANDIDATE_PATHS.find((candidate) => existsSync(candidate));
  if (!target) return null;
  try {
    const data: unknown = JSON.parse(readFileSync(target, 'utf8'));
    const entries = (data as { entries?: unknown })?.entries;
    if (!Array.isArray(entries) || entries.length === 0 || !entries.every(isBridgeEntry)) return null;
    return ordered(entries).map(render);
  } catch {
    return null;
  }
}
