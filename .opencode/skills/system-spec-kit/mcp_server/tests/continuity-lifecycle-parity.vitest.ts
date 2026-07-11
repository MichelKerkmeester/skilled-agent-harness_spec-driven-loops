// ───────────────────────────────────────────────────────────────
// TEST: Continuity Lifecycle Parity (contract doc <-> plugin status)
// ───────────────────────────────────────────────────────────────
// Asserts the OpenCode plugin's continuity capability fields, as
// reported by mk_spec_memory_status, match the values documented in
// the cross-runtime continuity lifecycle contract. This keeps the
// documented recover/persist guarantees and the emitted capability
// strings from drifting apart. Hermetic: the plugin is imported with
// its @opencode-ai dependency and bridge path stubbed, and is
// instantiated disabled so no daemon/subprocess is spawned.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PLUGIN_PATH = fileURLToPath(
  new URL('../../../../plugins/mk-spec-memory.js', import.meta.url),
);
const CONTRACT_PATH = fileURLToPath(
  new URL('../plugin_bridges/continuity-lifecycle-contract.md', import.meta.url),
);

const CAPABILITY_KEYS = [
  'continuity_recovery',
  'continuity_compaction',
  'continuity_autosave',
] as const;

// Canonical intersection this contract commits to. Locked here so the
// doc and the plugin cannot silently drift together to a wrong value.
const CANONICAL: Record<string, string> = {
  continuity_recovery: 'per_transform_warm',
  continuity_compaction: 'unsupported_runtime_event',
  continuity_autosave: 'unsupported_runtime_event',
};

// Import the plugin without its @opencode-ai/plugin dependency and
// without a resolvable bridge path (the bridge path is derived from a
// hierarchical import.meta.url, which a data: URL cannot supply).
async function importPluginHermetic(): Promise<{ default: (ctx: unknown, opts: unknown) => Promise<Record<string, any>> }> {
  const source = readFileSync(PLUGIN_PATH, 'utf8')
    .replace(
      "import { tool } from '@opencode-ai/plugin/tool';",
      'const tool = (definition) => definition;',
    )
    .replace(
      /const BRIDGE_PATH = .*?;\nconst SOURCE_PATHS = \[[\s\S]*?\n\];/,
      "const BRIDGE_PATH = '/test/mk-spec-memory-bridge.mjs';\nconst SOURCE_PATHS = [BRIDGE_PATH];",
    );
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

// Status output is a newline list of `key=value` lines.
function parseStatusFields(status: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of status.split('\n')) {
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    fields[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return fields;
}

// The contract documents the same fields as literal `key=value` lines
// inside a fenced block; table rows use backticks and are ignored.
function parseDocumentedCapabilities(doc: string): Record<string, string> {
  const documented: Record<string, string> = {};
  for (const rawLine of doc.split('\n')) {
    const line = rawLine.trim();
    const match = /^(continuity_[a-z]+)=(\S+)$/.exec(line);
    if (match) documented[match[1]] = match[2];
  }
  return documented;
}

async function readPluginCapabilities(): Promise<Record<string, string>> {
  const pluginModule = await importPluginHermetic();
  // enabled:false keeps execute() from spawning the warm bridge while
  // still emitting the hard-coded continuity capability lines.
  const hooks = await pluginModule.default({ directory: process.cwd() }, { enabled: false });
  const status: string = await hooks.tool.mk_spec_memory_status.execute();
  return parseStatusFields(status);
}

describe('continuity lifecycle parity', () => {
  const documented = parseDocumentedCapabilities(readFileSync(CONTRACT_PATH, 'utf8'));

  it('the contract documents every continuity capability field', () => {
    for (const key of CAPABILITY_KEYS) {
      expect(documented[key], `contract must document ${key}`).toBeDefined();
    }
  });

  it('the contract documents the canonical intersection values', () => {
    for (const key of CAPABILITY_KEYS) {
      expect(documented[key]).toBe(CANONICAL[key]);
    }
  });

  it('the plugin status reports the documented capability values', async () => {
    const emitted = await readPluginCapabilities();
    for (const key of CAPABILITY_KEYS) {
      expect(emitted[key], `plugin must emit ${key}`).toBeDefined();
      expect(emitted[key]).toBe(documented[key]);
    }
  });

  it('the plugin status reports the canonical intersection values', async () => {
    const emitted = await readPluginCapabilities();
    for (const key of CAPABILITY_KEYS) {
      expect(emitted[key]).toBe(CANONICAL[key]);
    }
  });
});
