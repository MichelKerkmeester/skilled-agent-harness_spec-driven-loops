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
const ENV_REFERENCE_PATH = resolve(MCP_SERVER_ROOT, 'ENV_REFERENCE.md');

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
  return tokens;
}

function collectDocumentedTokens(): Set<string> {
  const doc = readFileSync(ENV_REFERENCE_PATH, 'utf8');
  const documented = new Set<string>();
  const docRe = /SPECKIT_[A-Z0-9_]+/g;
  let match: RegExpExecArray | null;
  while ((match = docRe.exec(doc)) !== null) {
    documented.add(match[0]);
  }
  return documented;
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

  it('keeps the internal ignore-list honest (every ignored token is still a runtime read and still undocumented)', () => {
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
