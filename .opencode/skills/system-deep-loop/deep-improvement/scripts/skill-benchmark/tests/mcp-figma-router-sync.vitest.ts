import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

// Drift guard for mcp-figma's dual router blocks. Its RUNTIME selector scores an
// INTENT_MODEL that carries per-keyword tuple weights ({"keywords": [("kw", N)]}),
// a shape the Lane C router-replay parser cannot read (it expects the standard
// {weight, keywords} INTENT_SIGNALS block), so the skill parsed to zero intents
// and could not be benchmarked. The fix adds a benchmark-facing INTENT_SIGNALS
// block that mirrors INTENT_MODEL; runtime routing is untouched. A mirror only
// helps while it stays faithful, so this guard fails closed if the two blocks
// drift: same intent keys, same keywords per intent (neither side gains or drops
// one), and every intent backed by a RESOURCE_MAP entry.
//
// Run standalone: npx vitest run tests/mcp-figma-router-sync.vitest.ts

const HARNESS = resolve(__dirname, '..');
const REPO_SKILLS = resolve(__dirname, '..', '..', '..', '..', '..');
const MCPFIGMA = join(REPO_SKILLS, 'mcp-tooling', 'mcp-figma');
const { parseRouter } = require(join(HARNESS, 'router-replay.cjs'));

const EXPECTED_INTENTS = [
  'CONNECT_SETUP_DAEMON',
  'CREATE_RENDER',
  'DESIGN_SYSTEM_TOKENS',
  'INSPECT_EXPORT',
  'MCP_CONTEXT',
  'TROUBLESHOOT',
];

// Pull the brace-balanced body that follows `NAME = {` (mirrors the parser's own
// extraction so the test reads the same bytes the benchmark does).
function extractBalanced(text: string, name: string): string {
  const start = text.indexOf(`${name} = {`);
  if (start === -1) throw new Error(`${name} block not found in SKILL.md`);
  const i = text.indexOf('{', start);
  let depth = 0;
  for (let j = i; j < text.length; j += 1) {
    if (text[j] === '{') depth += 1;
    else if (text[j] === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(i + 1, j);
    }
  }
  throw new Error(`${name} block is unbalanced in SKILL.md`);
}

// INTENT_MODEL carries tuple-weighted keywords: "KEY": {"keywords": [("kw", N), ...]}.
// The benchmark parser can't read it, so extract the keyword strings here (lowercased,
// matching how the benchmark normalizes INTENT_SIGNALS keywords) as the source of truth.
function parseIntentModel(body: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const entryRe = /"([A-Z0-9_]+)"\s*:\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(body)) !== null) {
    const key = m[1];
    const inner = m[2];
    const kws: string[] = [];
    const kwRe = /\(\s*"([^"]*)"\s*,\s*\d+(?:\.\d+)?\s*\)/g;
    let k: RegExpExecArray | null;
    while ((k = kwRe.exec(inner)) !== null) kws.push(k[1].toLowerCase());
    out[key] = kws;
  }
  return out;
}

describe('mcp-figma benchmark router mirror stays in sync with the runtime INTENT_MODEL', () => {
  const md = readFileSync(join(MCPFIGMA, 'SKILL.md'), 'utf8');
  const router = parseRouter(md, MCPFIGMA);
  const intentModel = parseIntentModel(extractBalanced(md, 'INTENT_MODEL'));

  const signalKeys = Object.keys(router.intentSignals).sort();
  const modelKeys = Object.keys(intentModel).sort();
  const resourceKeys = new Set(Object.keys(router.resourceMap));

  it('router-replay now parses mcp-figma into the six runtime intents (was zero)', () => {
    expect(router.parseable).toBe(true);
    expect(signalKeys).toEqual(EXPECTED_INTENTS);
  });

  it('INTENT_SIGNALS keys == INTENT_MODEL keys (same set of intents)', () => {
    expect(signalKeys).toEqual(modelKeys);
  });

  it('no keyword drift: INTENT_SIGNALS mirrors every INTENT_MODEL keyword, and adds none', () => {
    for (const key of modelKeys) {
      const modelKws = new Set(intentModel[key]);
      const signalKws = new Set<string>(router.intentSignals[key].keywords);
      const dropped = [...modelKws].filter((k) => !signalKws.has(k)).sort();
      const invented = [...signalKws].filter((k) => !modelKws.has(k)).sort();
      expect(dropped, `${key}: keywords present in INTENT_MODEL but missing from INTENT_SIGNALS`).toEqual([]);
      expect(invented, `${key}: keywords in INTENT_SIGNALS with no INTENT_MODEL source`).toEqual([]);
    }
  });

  it('every INTENT_SIGNALS key has a matching RESOURCE_MAP key', () => {
    const missing = signalKeys.filter((k) => !resourceKeys.has(k));
    expect(missing).toEqual([]);
  });
});
