// ───────────────────────────────────────────────────────────────
// MODULE: ENV_REFERENCE Drift Guard
// ───────────────────────────────────────────────────────────────
// Collects every SPECKIT_* environment token read by the spec-kit
// mcp_server runtime source and asserts each one is either documented in
// ENV_REFERENCE.md or listed on the explicit internal ignore-list. This stops
// a future env addition from silently skipping the operator-facing doc.
//
// Scope mirrors the documentation contract: runtime source only. dist (build
// output), tests, stress harnesses, *.bench.ts micro-benchmarks, *.vitest.ts
// suites, vitest.config.ts, and node_modules are excluded because their env
// reads are harness scaffolding, not shipped configuration.

import { describe, expect, it } from 'vitest';

import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MCP_SERVER_ROOT = resolve(__dirname, '..');
const SYSTEM_SPEC_KIT_ROOT = resolve(MCP_SERVER_ROOT, '..');
const ENV_REFERENCE_PATH = resolve(MCP_SERVER_ROOT, 'ENV_REFERENCE.md');
const FLAG_REGISTRY_PATHS = [
  'lib/config/capability-flags.ts',
  'lib/search/search-flags.ts',
  'lib/search/graph-flags.ts',
] as const;

// Tokens read only inside runtime code that is gated behind a test-mode guard
// (NODE_ENV='test' / SPECKIT_TEST='true') or that exist solely to let suites
// steer internal behavior. They are intentionally NOT operator-facing config,
// so they are excluded from the doc instead of being documented. Each entry
// carries the runtime read site that justifies the exemption.
const INTENTIONALLY_INTERNAL = new Set<string>([
  // Test-mode master switch (only meaningful alongside NODE_ENV='test').
  'SPECKIT_TEST', // hooks/claude/session-stop.ts
  // Test-only bypass of canonical save routing for the failure-injection suite.
  'SPECKIT_TEST_DISABLE_CANONICAL_ROUTING', // handlers/memory-save.ts
  // Autosave-script override honored only in test mode; ignored in production.
  'SPECKIT_GENERATE_CONTEXT_SCRIPT', // hooks/claude/session-stop.ts
]);

// Directory/file segments whose env reads are harness scaffolding, not runtime
// configuration. Aligned with the ENV_REFERENCE documentation scope.
function isExcludedPath(relPath: string): boolean {
  return (
    relPath.startsWith('dist/')
    || relPath.includes('/dist/')
    || relPath.startsWith('tests/')
    || relPath.includes('/tests/')
    || relPath.startsWith('stress_test/')
    || relPath.includes('/stress_test/')
    || relPath.includes('/node_modules/')
    || relPath.endsWith('.bench.ts')
    || relPath.endsWith('.vitest.ts')
    || relPath.endsWith('vitest.config.ts')
  );
}

// Matches process.env.SPECKIT_X, process.env['SPECKIT_X'], env.SPECKIT_X,
// <name>Env.SPECKIT_X, and the bracketed forms of each. Capture group 1 or 2
// carries the token name.
const ENV_READ_RE =
  /(?:process\.env|[A-Za-z_]*[eE]nv)(?:\.(SPECKIT_[A-Z0-9_]+)|\[\s*['"](SPECKIT_[A-Z0-9_]+)['"]\s*\])/g;
const FLAG_STRING_LITERAL_RE = /['"](SPECKIT_[A-Z0-9_]+)['"]/g;

interface DocumentedFlagRow {
  cells: string[];
  defaultState: boolean | null;
  tokens: string[];
}

function collectRuntimeTsFiles(): string[] {
  const entries = readdirSync(MCP_SERVER_ROOT, {
    recursive: true,
    withFileTypes: true,
  });
  const files: string[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.ts')) continue;
    // entry.parentPath is the absolute directory in Node >= 20.12.
    const dir = (entry as unknown as { parentPath?: string; path?: string }).parentPath
      ?? (entry as unknown as { path?: string }).path
      ?? MCP_SERVER_ROOT;
    const absPath = resolve(dir, entry.name);
    const relPath = absPath.slice(MCP_SERVER_ROOT.length + 1);
    if (isExcludedPath(relPath)) continue;
    files.push(absPath);
  }
  return files;
}

function collectRuntimeEnvTokens(): Map<string, string> {
  // token -> first relative path that reads it (for failure diagnostics).
  const tokens = new Map<string, string>();
  for (const absPath of collectRuntimeTsFiles()) {
    const relPath = absPath.slice(MCP_SERVER_ROOT.length + 1);
    const source = readFileSync(absPath, 'utf8');
    ENV_READ_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = ENV_READ_RE.exec(source)) !== null) {
      const token = match[1] ?? match[2];
      if (token && !tokens.has(token)) tokens.set(token, relPath);
    }
  }

  for (const relPath of FLAG_REGISTRY_PATHS) {
    const source = readFileSync(resolve(MCP_SERVER_ROOT, relPath), 'utf8');
    FLAG_STRING_LITERAL_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = FLAG_STRING_LITERAL_RE.exec(source)) !== null) {
      const token = match[1];
      if (token && !tokens.has(token)) tokens.set(token, relPath);
    }
  }
  return tokens;
}

function collectFeatureRuntimeTokens(): Set<string> {
  const tokens = new Set(collectRuntimeEnvTokens().keys());
  for (const absPath of collectRuntimeTsFiles()) {
    const source = readFileSync(absPath, 'utf8');
    for (const match of source.matchAll(FLAG_STRING_LITERAL_RE)) {
      if (match[1]) tokens.add(match[1]);
    }
  }
  const scriptsRoot = resolve(SYSTEM_SPEC_KIT_ROOT, 'scripts');
  const entries = readdirSync(scriptsRoot, { recursive: true, withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !/\.(?:ts|js|mjs|cjs|sh)$/.test(entry.name)) continue;
    const dir = (entry as unknown as { parentPath?: string; path?: string }).parentPath
      ?? (entry as unknown as { path?: string }).path
      ?? scriptsRoot;
    const absPath = resolve(dir, entry.name);
    const relPath = absPath.slice(SYSTEM_SPEC_KIT_ROOT.length + 1);
    if (relPath.includes('/tests/') || relPath.includes('/dist/') || relPath.includes('/node_modules/')) {
      continue;
    }
    const source = readFileSync(absPath, 'utf8');
    for (const match of source.matchAll(
      /(?:process\.env\.(SPECKIT_[A-Z0-9_]+)|process\.env\[\s*['"](SPECKIT_[A-Z0-9_]+)['"]\s*\]|\$\{(SPECKIT_[A-Z0-9_]+)(?=[:}])|\$(SPECKIT_[A-Z0-9_]+)\b|['"](SPECKIT_[A-Z0-9_]+)['"])/g,
    )) {
      const token = match.slice(1).find((candidate): candidate is string => Boolean(candidate));
      if (token) tokens.add(token);
    }
  }

  return tokens;
}

function parseDefaultState(cell: string): boolean | null {
  const normalized = cell.replace(/`/g, '').trim().toLowerCase();
  if (/^(on|true)(?:\b|\s|\()/.test(normalized)) return true;
  if (/^(off|false)(?:\b|\s|\()/.test(normalized)) return false;
  return null;
}

function collectDocumentedFlagRows(): DocumentedFlagRow[] {
  const rows: DocumentedFlagRow[] = [];
  for (const line of readFileSync(ENV_REFERENCE_PATH, 'utf8').split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 2 || cells.every((cell) => /^:?-+:?$/.test(cell))) continue;
    const tokens = cells.flatMap((cell) => cell.match(/`(SPECKIT_[A-Z0-9_]+)`/g) ?? [])
      .map((token) => token.slice(1, -1));
    if (tokens.length === 0) continue;
    rows.push({ cells, defaultState: parseDefaultState(cells[1] ?? ''), tokens });
  }
  return rows;
}

function collectDocumentedTokens(): Set<string> {
  return new Set(collectDocumentedFlagRows().flatMap((row) => row.tokens));
}

function collectFeatureTableTokens(): Set<string> {
  const doc = readFileSync(ENV_REFERENCE_PATH, 'utf8');
  const table = doc.match(
    /### Feature Flags Reference Table[\s\S]*?\n(Total unique variables documented:)/,
  )?.[0] ?? '';
  const tokens = table.match(/`(SPECKIT_[A-Z0-9_]+)`/g) ?? [];
  return new Set(tokens.map((token) => token.slice(1, -1)));
}

function collectRuntimeDefaultPolarities(): Map<string, boolean> {
  const polarities = new Map<string, boolean>();
  const constants = new Map<string, string>();

  for (const relPath of FLAG_REGISTRY_PATHS) {
    const source = readFileSync(resolve(MCP_SERVER_ROOT, relPath), 'utf8');
    for (const match of source.matchAll(
      /\bconst\s+([A-Z][A-Z0-9_]*)\s*=\s*['"](SPECKIT_[A-Z0-9_]+)['"]/g,
    )) {
      constants.set(match[1], match[2]);
    }

    for (const match of source.matchAll(
      /\b(isFeatureEnabled|isOptInEnabled|isStrictOptInEnabled|parseFlagTristate)\(\s*(?:['"](SPECKIT_[A-Z0-9_]+)['"]|([A-Z][A-Z0-9_]*))(?:\s*,\s*(true|false))?/g,
    )) {
      const helper = match[1];
      const token = match[2] ?? constants.get(match[3]);
      if (!token) continue;
      if (helper === 'isFeatureEnabled') polarities.set(token, true);
      if (helper === 'isOptInEnabled' || helper === 'isStrictOptInEnabled') {
        polarities.set(token, false);
      }
      if (helper === 'parseFlagTristate' && match[4]) {
        polarities.set(token, match[4] === 'true');
      }
    }

    for (const match of source.matchAll(
      /process\.env\.(SPECKIT_[A-Z0-9_]+)[\s\S]{0,100}?!==\s*['"]true['"]/g,
    )) {
      polarities.set(match[1], false);
    }
  }

  return polarities;
}

describe('ENV_REFERENCE.md drift guard', () => {
  it('finds runtime SPECKIT_* env reads to validate', () => {
    const tokens = collectRuntimeEnvTokens();
    // Sanity floor: the runtime reads dozens of SPECKIT_* vars. A near-zero
    // count would mean the collector regex or file walk silently broke, which
    // would make the drift assertion vacuously pass.
    expect(tokens.size).toBeGreaterThan(50);
  });

  it('documents every runtime SPECKIT_* env var (or lists it as intentionally internal)', () => {
    const runtimeTokens = collectRuntimeEnvTokens();
    const documented = collectDocumentedTokens();

    const undocumented: string[] = [];
    for (const [token, readSite] of runtimeTokens) {
      if (documented.has(token)) continue;
      if (INTENTIONALLY_INTERNAL.has(token)) continue;
      undocumented.push(`${token} (read at ${readSite})`);
    }

    expect(
      undocumented,
      'Undocumented SPECKIT_* env vars found in runtime source. Add a row to '
        + 'ENV_REFERENCE.md, or add the token to INTENTIONALLY_INTERNAL with its '
        + `read site if it is test-mode-gated:\n  ${undocumented.join('\n  ')}`,
    ).toEqual([]);
  });

  it('keeps the canonical feature table bidirectionally aligned with runtime registrations', () => {
    const runtimeTokens = collectFeatureRuntimeTokens();
    const featureTokens = collectFeatureTableTokens();
    const stale = [...featureTokens]
      .filter((token) => !runtimeTokens.has(token))
      .sort();

    expect(
      stale,
      `Feature-table flags without a runtime read or registration:\n  ${stale.join('\n  ')}`,
    ).toEqual([]);
  });

  it('matches documented ON/OFF states to canonical parser polarity where statically declared', () => {
    const runtimePolarities = collectRuntimeDefaultPolarities();
    const rows = collectDocumentedFlagRows();
    const mismatches: string[] = [];

    for (const row of rows) {
      if (row.defaultState === null) continue;
      for (const token of row.tokens) {
        const runtimeDefault = runtimePolarities.get(token);
        if (runtimeDefault === undefined || runtimeDefault === row.defaultState) continue;
        mismatches.push(
          `${token}: runtime=${runtimeDefault ? 'ON' : 'OFF'}, documented=${row.defaultState ? 'ON' : 'OFF'}`,
        );
      }
    }

    expect(mismatches).toEqual([]);
  });

  it('keeps the relevance-aware gap row internally consistent with its default-on parser', () => {
    const row = collectDocumentedFlagRows().find(
      (candidate) => candidate.tokens.includes('SPECKIT_RELEVANCE_AWARE_GAP'),
    );
    expect(row?.defaultState).toBe(true);
    expect(row?.cells.join(' ').toLowerCase()).not.toContain('default off');
    expect(row?.cells.join(' ').toLowerCase()).not.toContain('set true to enable');
  });

  it('documents the packed BM25 auto fallback and omits the retired novelty flag', () => {
    const envReference = readFileSync(ENV_REFERENCE_PATH, 'utf8');
    const bm25Row = envReference.split('\n').find((line) => line.includes('`SPECKIT_BM25_ENGINE`'));
    const telemetryReference = readFileSync(
      resolve(MCP_SERVER_ROOT, 'lib/telemetry/README.md'),
      'utf8',
    );

    expect(bm25Row).toContain('falls back to the packed in-memory index');
    expect(bm25Row).not.toContain('otherwise falls back to legacy in-memory BM25');
    expect(telemetryReference).not.toContain('SPECKIT_NOVELTY_BOOST');
  });

  it('keeps the internal ignore-list honest (every ignored token is still a runtime read and has no doc row)', () => {
    const runtimeTokens = collectRuntimeEnvTokens();
    const documented = collectDocumentedTokens();

    const stale: string[] = [];
    for (const token of INTENTIONALLY_INTERNAL) {
      if (!runtimeTokens.has(token)) {
        stale.push(`${token} (no longer read by runtime source — remove from ignore-list)`);
      } else if (documented.has(token)) {
        stale.push(`${token} (now documented — remove from ignore-list)`);
      }
    }

    expect(stale, `Stale INTENTIONALLY_INTERNAL entries:\n  ${stale.join('\n  ')}`).toEqual([]);
  });
});
