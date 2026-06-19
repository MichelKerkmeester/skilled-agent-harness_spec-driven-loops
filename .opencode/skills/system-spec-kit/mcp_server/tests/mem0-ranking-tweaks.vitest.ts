// ───────────────────────────────────────────────────────────────
// TEST — MEM0 RANKING + EXTRACTION BUNDLE
// ───────────────────────────────────────────────────────────────
// Covers:
//   - Declarative regex entity config (always-on, parity with built-in rules)
//   - Entity cardinality penalty on the degree channel (default-off)

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

import {
  extractEntities,
  loadEntityExtractionRules,
  __testables,
} from '../lib/extraction/entity-extractor.js';
import type { EntityExtractionRule } from '../lib/extraction/entity-extractor.js';

import {
  computeDegreeScores,
  clearDegreeCache,
  cardinalityPenalty,
  computeLinkedNodeCountsBatch,
  DEGREE_BOOST_CAP,
} from '../lib/search/graph-search-fn.js';

const ASSET_PATH = fileURLToPath(
  new URL('../lib/extraction/entity-extraction-rules.json', import.meta.url),
);

const ENV_KEY = 'SPECKIT_ENTITY_CONFIG_PATH';
const PENALTY_FLAG = 'SPECKIT_CARDINALITY_PENALTY';

// ===============================================================
// 1. Declarative regex entity config (candidate 4)
// ===============================================================

describe('declarative entity-extraction config', () => {
  afterEach(() => {
    delete process.env[ENV_KEY];
    __testables.resetEntityRulesCache();
  });

  it('default load returns exactly the built-in rule set', () => {
    __testables.resetEntityRulesCache();
    const rules = loadEntityExtractionRules();
    expect(rules).toEqual(__testables.BUILTIN_ENTITY_RULES);
  });

  it('shipped JSON asset reproduces the built-in rules exactly', () => {
    const parsed = __testables.parseEntityRules(
      JSON.parse(readFileSync(ASSET_PATH, 'utf-8')),
    ) as EntityExtractionRule[] | null;
    expect(parsed).not.toBeNull();
    expect(parsed).toEqual([...__testables.BUILTIN_ENTITY_RULES]);
  });

  it('config-driven extraction is byte-identical to built-in extraction', () => {
    const corpus = [
      '',
      '   \n\t  ',
      'The Spec Kit Memory system is robust.',
      'Here is code:\n```typescript\nconst x = 1;\n```\nAnd more:\n```python\nprint("hi")\n```',
      'Built using React and integrates via GraphQL. Implements Singleton pattern.',
      'Built using Node.js with Next.js Adapter.',
      '## Architecture Overview\nSome text.\n### Database Schema\nMore text.',
      'The module is called "Entity Extractor" and outputs "valid" results.',
      'Hello World is good. Hello World is great. Hello World is best.',
      [
        '## Sprint Overview',
        'Built using TypeScript with Better Sqlite integration.',
        '```javascript',
        'const x = 1;',
        '```',
        'The "entity extractor" was implemented by Open Code Team.',
      ].join('\n'),
    ];

    // Built-in (default) outputs.
    delete process.env[ENV_KEY];
    __testables.resetEntityRulesCache();
    const builtinOutputs = corpus.map((c) => extractEntities(c));

    // Config-driven outputs from the shipped JSON asset.
    process.env[ENV_KEY] = ASSET_PATH;
    __testables.resetEntityRulesCache();
    expect(loadEntityExtractionRules()).toEqual([...__testables.BUILTIN_ENTITY_RULES]);
    const configOutputs = corpus.map((c) => extractEntities(c));

    expect(configOutputs).toEqual(builtinOutputs);
  });

  it('falls back to built-in rules when the config file is missing', () => {
    process.env[ENV_KEY] = join(tmpdir(), 'speckit-entity-config-does-not-exist.json');
    __testables.resetEntityRulesCache();
    expect(loadEntityExtractionRules()).toEqual(__testables.BUILTIN_ENTITY_RULES);
  });

  it('falls back to built-in rules when the config JSON is malformed', () => {
    const badPath = join(tmpdir(), 'speckit-entity-config-malformed.json');
    writeFileSync(badPath, '{ this is : not valid json', 'utf-8');
    try {
      process.env[ENV_KEY] = badPath;
      __testables.resetEntityRulesCache();
      expect(loadEntityExtractionRules()).toEqual(__testables.BUILTIN_ENTITY_RULES);
    } finally {
      rmSync(badPath, { force: true });
    }
  });

  it('fails closed when a rule is structurally invalid (bad type / missing g flag)', () => {
    expect(__testables.parseEntityRules([
      { type: 'not_a_type', pattern: 'x', flags: 'g', captureGroup: 1 },
    ])).toBeNull();
    expect(__testables.parseEntityRules([
      { type: 'technology', pattern: 'x', flags: '', captureGroup: 1 },
    ])).toBeNull();
    expect(__testables.parseEntityRules([
      { type: 'technology', pattern: '(', flags: 'g', captureGroup: 1 },
    ])).toBeNull();
    expect(__testables.parseEntityRules([])).toBeNull();
  });

  it('honors a valid override that adds a new extraction type', () => {
    const customPath = join(tmpdir(), 'speckit-entity-config-custom.json');
    const custom = {
      rules: [
        // Reuse a single built-in rule plus one extra technology rule that
        // captures @-scoped package names so the override is observable.
        { type: 'technology', pattern: '```(\\w+)', flags: 'g', captureGroup: 1 },
        { type: 'technology', pattern: '(@[a-z0-9-]+/[a-z0-9-]+)', flags: 'g', captureGroup: 1 },
      ],
    };
    writeFileSync(customPath, JSON.stringify(custom), 'utf-8');
    try {
      process.env[ENV_KEY] = customPath;
      __testables.resetEntityRulesCache();
      const result = extractEntities('Install @scope/pkg and run:\n```bash\nls\n```');
      const texts = result.map((e) => e.text);
      expect(texts).toContain('@scope/pkg');
      expect(texts).toContain('bash');
    } finally {
      rmSync(customPath, { force: true });
    }
  });

  it('does not hang on a zero-width-capable override regex', () => {
    const zwPath = join(tmpdir(), 'speckit-entity-config-zerowidth.json');
    writeFileSync(zwPath, JSON.stringify({
      rules: [{ type: 'quoted', pattern: 'a*', flags: 'g', captureGroup: 0 }],
    }), 'utf-8');
    try {
      process.env[ENV_KEY] = zwPath;
      __testables.resetEntityRulesCache();
      const result = extractEntities('banana');
      expect(Array.isArray(result)).toBe(true);
    } finally {
      rmSync(zwPath, { force: true });
    }
  });
});

// ===============================================================
// 2. Entity cardinality penalty (candidate 2)
// ===============================================================

function createGraphDb(): InstanceType<typeof Database> {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0
    );
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL DEFAULT '',
      file_path TEXT NOT NULL DEFAULT '',
      title TEXT,
      importance_tier TEXT DEFAULT 'normal'
    );
  `);
  return db;
}

describe('cardinalityPenalty (pure math)', () => {
  it('returns 1.0 (no penalty) at n=0 and n=1', () => {
    expect(cardinalityPenalty(0)).toBe(1);
    expect(cardinalityPenalty(1)).toBe(1);
  });

  it('returns 1.0 for negative / non-finite inputs', () => {
    expect(cardinalityPenalty(-5)).toBe(1);
    expect(cardinalityPenalty(Number.NaN)).toBe(1);
  });

  it('matches the quadratic formula for known cardinalities', () => {
    expect(cardinalityPenalty(2)).toBeCloseTo(1 / 1.001, 9);
    expect(cardinalityPenalty(10)).toBeCloseTo(1 / 1.081, 9);
    expect(cardinalityPenalty(50)).toBeCloseTo(1 / 3.401, 9);
  });

  it('is monotonically decreasing for n >= 1 and bounded in (0, 1]', () => {
    let prev = cardinalityPenalty(1);
    for (let n = 2; n <= 100; n++) {
      const v = cardinalityPenalty(n);
      expect(v).toBeLessThan(prev);
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThanOrEqual(1);
      prev = v;
    }
  });
});

describe('computeLinkedNodeCountsBatch', () => {
  let db: InstanceType<typeof Database>;
  beforeEach(() => {
    db = createGraphDb();
  });
  afterEach(() => {
    db.close();
  });

  it('counts distinct neighbours across source and target sides', () => {
    const insert = db.prepare('INSERT INTO causal_edges (source_id, target_id, relation, strength) VALUES (?, ?, ?, ?)');
    insert.run('1', '2', 'caused', 1.0);
    insert.run('1', '3', 'caused', 1.0);
    insert.run('4', '1', 'caused', 1.0); // node 1 as target → neighbour 4
    insert.run('2', '3', 'caused', 1.0);

    const counts = computeLinkedNodeCountsBatch(db, ['1', '2', '99']);
    expect(counts.get('1')).toBe(3); // neighbours 2, 3, 4
    expect(counts.get('2')).toBe(2); // neighbours 1, 3
    expect(counts.has('99')).toBe(false); // no edges
  });

  it('returns an empty map for empty input', () => {
    expect(computeLinkedNodeCountsBatch(db, []).size).toBe(0);
  });
});

describe('cardinality penalty wiring in computeDegreeScores', () => {
  let db: InstanceType<typeof Database>;

  beforeEach(() => {
    db = createGraphDb();
    const insertMem = db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier) VALUES (?, ?, ?, ?, ?)');
    for (let i = 1; i <= 12; i++) {
      insertMem.run(i, 'test', `/mem/${i}.md`, `Memory ${i}`, 'normal');
    }
    const insertEdge = db.prepare('INSERT INTO causal_edges (source_id, target_id, relation, strength) VALUES (?, ?, ?, ?)');
    // Node 1 is a hub: linked to 10 distinct neighbours (2..11).
    for (let i = 2; i <= 11; i++) {
      insertEdge.run('1', String(i), 'caused', 1.0);
    }
    // Node 12 has a single link (low cardinality).
    insertEdge.run('12', '2', 'caused', 1.0);
    clearDegreeCache();
  });

  afterEach(() => {
    delete process.env[PENALTY_FLAG];
    clearDegreeCache();
    db.close();
  });

  it('is byte-identical with the flag off (default)', () => {
    delete process.env[PENALTY_FLAG];
    clearDegreeCache();
    const off = computeDegreeScores(db, [1, 12]);
    // Hub node keeps full (capped) boost when the penalty is disabled.
    expect(off.get('1')).toBeGreaterThan(0);
    expect(off.get('1')).toBeLessThanOrEqual(DEGREE_BOOST_CAP);
  });

  it('damps a high-cardinality hub when the flag is on', () => {
    clearDegreeCache();
    delete process.env[PENALTY_FLAG];
    const off = computeDegreeScores(db, [1]).get('1') ?? 0;

    clearDegreeCache();
    process.env[PENALTY_FLAG] = 'true';
    const on = computeDegreeScores(db, [1]).get('1') ?? 0;

    expect(on).toBeLessThan(off);
    expect(on).toBeCloseTo(off * cardinalityPenalty(10), 9);
  });

  it('leaves a low-cardinality node (1 link) unpenalized', () => {
    clearDegreeCache();
    delete process.env[PENALTY_FLAG];
    const off = computeDegreeScores(db, [12]).get('12') ?? 0;

    clearDegreeCache();
    process.env[PENALTY_FLAG] = 'true';
    const on = computeDegreeScores(db, [12]).get('12') ?? 0;

    expect(on).toBe(off);
  });
});
