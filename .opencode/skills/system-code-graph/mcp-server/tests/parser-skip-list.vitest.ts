// ───────────────────────────────────────────────────────────────
// MODULE: Parser Skip List Tests
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SCHEMA_VERSION,
  closeDb,
  getDb,
  initDb,
} from '../lib/code-graph-db.js';
import {
  addToSkipList,
  classifyParserRetryClass,
  getSkipListEntry,
  getSkipListSummary,
  lookupSkipList,
  recordSuccess,
} from '../lib/parser-skip-list.js';

describe('parser skip-list persistence', () => {
  let tempDir = '';

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-'));
    initDb(tempDir);
  });

  afterEach(() => {
    closeDb();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('inserts a fresh runtime row with attempt_count=1', () => {
    addToSkipList('/workspace/bad.sh', 'B1', 'resolved is not a function');

    const entry = lookupSkipList('/workspace/bad.sh');

    expect(entry).toMatchObject({
      filePath: '/workspace/bad.sh',
      errorClass: 'B1',
      retryClass: 'fatal',
      errorMessage: 'resolved is not a function',
      attemptCount: 1,
      source: 'runtime',
    });
  });

  it('increments attempt_count on duplicate adds', () => {
    addToSkipList('/workspace/bad.sh', 'B1', 'first');
    addToSkipList('/workspace/bad.sh', 'B1', 'second');

    const entry = lookupSkipList('/workspace/bad.sh');

    expect(entry?.attemptCount).toBe(2);
    expect(entry?.errorMessage).toBe('second');
  });

  it('returns a fatal entry for lookup hits', () => {
    addToSkipList('/workspace/hit.sh', 'B1', 'resolved is not a function');

    expect(lookupSkipList('/workspace/hit.sh')?.errorClass).toBe('B1');
  });

  it('returns null for lookup misses', () => {
    expect(lookupSkipList('/workspace/miss.sh')).toBeNull();
  });

  it('leaves transient entries eligible until the retry ceiling', () => {
    addToSkipList(
      '/workspace/transient.sh',
      'B2',
      'RuntimeError: memory access out of bounds',
      undefined,
      { retryClass: 'transient', maxRetries: 3 },
    );

    expect(getSkipListEntry('/workspace/transient.sh')).toMatchObject({
      retryClass: 'transient',
      attemptCount: 1,
    });
    expect(lookupSkipList('/workspace/transient.sh', undefined, { maxRetries: 3 })).toBeNull();
  });

  it('promotes transient entries to fatal at the retry ceiling', () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      addToSkipList(
        '/workspace/exhausted.sh',
        'B2',
        `RuntimeError: memory access out of bounds ${attempt}`,
        undefined,
        { retryClass: 'transient', maxRetries: 3 },
      );
    }

    const entry = lookupSkipList('/workspace/exhausted.sh', undefined, { maxRetries: 3 });

    expect(entry).toMatchObject({
      retryClass: 'fatal',
      attemptCount: 3,
    });
    expect(getSkipListEntry('/workspace/exhausted.sh')?.retryClass).toBe('fatal');
  });

  it('clears transient entries after success but leaves fatal entries for manual review', () => {
    addToSkipList(
      '/workspace/self-heal.sh',
      'B2',
      'RuntimeError: memory access out of bounds',
      undefined,
      { retryClass: 'transient', maxRetries: 5 },
    );
    addToSkipList('/workspace/manual.sh', 'B1', 'resolved is not a function');

    recordSuccess('/workspace/self-heal.sh');

    recordSuccess('/workspace/manual.sh');

    expect(getSkipListEntry('/workspace/self-heal.sh')).toBeNull();
    expect(lookupSkipList('/workspace/manual.sh')).not.toBeNull();
  });

  it('classifies retry policy explicitly and fails closed for unknown errors', () => {
    expect(classifyParserRetryClass(new Error('RuntimeError: memory access out of bounds'))).toBe('transient');
    expect(classifyParserRetryClass(new Error('WASM out of memory'))).toBe('transient');
    expect(classifyParserRetryClass(new Error('parse timed out before deadline'))).toBe('transient');
    expect(classifyParserRetryClass(new Error('syntax error'))).toBe('fatal');
    expect(classifyParserRetryClass('unknown failure')).toBe('fatal');
  });

  it('upgrades a legacy v4 database to schema v5 with parser_skip_list', () => {
    closeDb();
    const legacyDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-v4-'));
    try {
      const legacy = new Database(join(legacyDir, 'code-graph.sqlite'));
      legacy.exec(`
        CREATE TABLE schema_version (version INTEGER NOT NULL);
        INSERT INTO schema_version (version) VALUES (4);
      `);
      legacy.close();

      const upgraded = initDb(legacyDir);
      const table = upgraded.prepare(`
        SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'parser_skip_list'
      `).get();
      const retryColumn = upgraded.prepare(`
        SELECT name FROM pragma_table_info('parser_skip_list') WHERE name = 'retry_class'
      `).get();
      const version = upgraded.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number };

      expect(table).toBeTruthy();
      expect(retryColumn).toBeTruthy();
      expect(version.version).toBe(SCHEMA_VERSION);
    } finally {
      closeDb();
      rmSync(legacyDir, { recursive: true, force: true });
      initDb(tempDir);
    }
  });

  it('seeds B1 rows from parse_diagnostics during migration', () => {
    closeDb();
    const legacyDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-seed-'));
    try {
      const legacy = new Database(join(legacyDir, 'code-graph.sqlite'));
      legacy.exec(`
        CREATE TABLE schema_version (version INTEGER NOT NULL);
        INSERT INTO schema_version (version) VALUES (4);
        CREATE TABLE parse_diagnostics (
          file_path TEXT PRIMARY KEY,
          error_message TEXT NOT NULL,
          error_count INTEGER NOT NULL DEFAULT 1,
          last_seen_at TEXT NOT NULL
        );
        INSERT INTO parse_diagnostics (file_path, error_message, error_count, last_seen_at)
        VALUES
          ('/workspace/seeded.sh', 'TypeError: resolved is not a function', 7, '2026-05-06T00:00:00.000Z'),
          ('/workspace/other.ts', 'RuntimeError: memory access out of bounds', 3, '2026-05-06T00:00:00.000Z');
      `);
      legacy.close();

      initDb(legacyDir);

      expect(lookupSkipList('/workspace/seeded.sh')).toMatchObject({
        errorClass: 'B1',
        retryClass: 'fatal',
        attemptCount: 7,
        source: 'seed',
      });
      expect(lookupSkipList('/workspace/other.ts')).toBeNull();
    } finally {
      closeDb();
      rmSync(legacyDir, { recursive: true, force: true });
      initDb(tempDir);
    }
  });

  it('is idempotent under parallel duplicate add calls', async () => {
    await Promise.all([
      Promise.resolve().then(() => addToSkipList('/workspace/race.sh', 'B1', 'first')),
      Promise.resolve().then(() => addToSkipList('/workspace/race.sh', 'B1', 'second')),
    ]);

    expect(lookupSkipList('/workspace/race.sh')?.attemptCount).toBe(2);
  });

  it('fails open when lookup SELECT throws', () => {
    const fakeDb = {
      prepare: vi.fn(() => {
        throw new Error('corrupt table');
      }),
    } as unknown as Database.Database;

    expect(lookupSkipList('/workspace/corrupt.sh', fakeDb)).toBeNull();
  });

  it('summarizes count, most recent timestamp, and five recent paths', () => {
    for (const filePath of ['/a.sh', '/b.sh', '/c.sh', '/d.sh', '/e.sh', '/f.sh']) {
      addToSkipList(filePath, 'B1', 'resolved is not a function');
    }

    const summary = getSkipListSummary();

    expect(summary.count).toBe(6);
    expect(summary.lastSeenAt).not.toBeNull();
    expect(summary.sample).toHaveLength(5);
  });
});

describe('tree-sitter parser skip-list wrapper', () => {
  const originalSkipListEnv = process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED;
  const originalMaxRetriesEnv = process.env.SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES;
  let tempDirs: string[] = [];
  let closeDynamicDb: (() => void) | null = null;

  afterEach(() => {
    closeDynamicDb?.();
    closeDynamicDb = null;
    if (originalSkipListEnv === undefined) {
      delete process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED;
    } else {
      process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = originalSkipListEnv;
    }
    if (originalMaxRetriesEnv === undefined) {
      delete process.env.SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES;
    } else {
      process.env.SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES = originalMaxRetriesEnv;
    }
    vi.resetModules();
    for (const tempDir of tempDirs) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    tempDirs = [];
  });

  function mockWebTreeSitter(parseMock: ReturnType<typeof vi.fn>): void {
    vi.doMock('web-tree-sitter', () => {
      class MockParser {
        static Language = {
          load: vi.fn(async () => ({ language: 'bash' })),
        };

        static init = vi.fn(async () => undefined);

        setLanguage = vi.fn();

        parse = parseMock;
      }

      return { default: MockParser };
    });
  }

  function makeCleanRootNode() {
    return {
      type: 'program',
      isNamed: true,
      hasError: false,
      text: '',
      startPosition: { row: 0, column: 0 },
      endPosition: { row: 0, column: 0 },
      parent: null,
      namedChildren: [],
      childForFieldName: () => null,
    };
  }

  it('bypasses the skip-list when SPECKIT_PARSER_SKIP_LIST_ENABLED=false', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'false';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-env-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn(() => {
      throw new Error('resolved is not a function');
    });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);
    const dynamicSkipList = await import('../lib/parser-skip-list.js');
    dynamicSkipList.addToSkipList('/workspace/bad.sh', 'B1', 'resolved is not a function');

    const { TreeSitterParser } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const result = new TreeSitterParser().parse('echo hi', 'bash', undefined, '/workspace/bad.sh');

    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(result.parseErrors[0]).toBe('resolved is not a function');
    expect(result.parseErrors[0]).not.toContain('skip-list');
  });

  it('classifies B1, B2, and OTHER parser errors', async () => {
    const { classifyError } = await import('../lib/tree-sitter-parser.js');

    expect(classifyError(new Error('TypeError: resolved is not a function'))).toBe('B1');
    expect(classifyError(new Error('RuntimeError: memory access out of bounds'))).toBe('B2');
    expect(classifyError(new Error('syntax error'))).toBe('OTHER');
  });

  it('re-attempts transient failures on later parses and clears them after success', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'true';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-self-heal-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn()
      .mockImplementationOnce(() => {
        throw new Error('RuntimeError: memory access out of bounds');
      })
      .mockReturnValue({ rootNode: makeCleanRootNode() });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);
    const dynamicSkipList = await import('../lib/parser-skip-list.js');

    const { TreeSitterParser, __resetParserHealth } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const parser = new TreeSitterParser();

    const first = parser.parse('echo bad', 'bash', undefined, '/workspace/self-heal.sh');
    expect(first.parseHealth).toBe('error');
    expect(dynamicSkipList.getSkipListEntry('/workspace/self-heal.sh')).toMatchObject({
      retryClass: 'transient',
      attemptCount: 1,
    });

    __resetParserHealth();
    const second = parser.parse('echo good', 'bash', undefined, '/workspace/self-heal.sh');

    expect(parseMock).toHaveBeenCalledTimes(2);
    expect(second.parseHealth).not.toBe('error');
    expect(dynamicSkipList.getSkipListEntry('/workspace/self-heal.sh')).toBeNull();
  });

  it('promotes exhausted transient failures to fatal and then skips without re-parsing', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'true';
    process.env.SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES = '2';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-exhausted-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn(() => {
      throw new Error('RuntimeError: memory access out of bounds');
    });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);
    const dynamicSkipList = await import('../lib/parser-skip-list.js');

    const { TreeSitterParser, __resetParserHealth } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const parser = new TreeSitterParser();

    parser.parse('echo bad', 'bash', undefined, '/workspace/exhausted.sh');
    __resetParserHealth();
    parser.parse('echo bad again', 'bash', undefined, '/workspace/exhausted.sh');
    __resetParserHealth();
    const skipped = parser.parse('echo skipped', 'bash', undefined, '/workspace/exhausted.sh');

    expect(parseMock).toHaveBeenCalledTimes(2);
    expect(dynamicSkipList.getSkipListEntry('/workspace/exhausted.sh')).toMatchObject({
      retryClass: 'fatal',
      attemptCount: 2,
    });
    expect(skipped.parseErrors[0]).toContain('Parser skipped by skip-list');
  });

  it('skips fatal failures from the first occurrence', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'true';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-fatal-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn(() => {
      throw new Error('syntax error');
    });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);
    const dynamicSkipList = await import('../lib/parser-skip-list.js');

    const { TreeSitterParser } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const parser = new TreeSitterParser();

    parser.parse('echo bad', 'bash', undefined, '/workspace/fatal.sh');
    const skipped = parser.parse('echo skipped', 'bash', undefined, '/workspace/fatal.sh');

    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(dynamicSkipList.getSkipListEntry('/workspace/fatal.sh')).toMatchObject({
      errorClass: 'OTHER',
      retryClass: 'fatal',
    });
    expect(skipped.parseErrors[0]).toContain('Parser skipped by skip-list');
  });

  it('returns an error result for one poison file and still parses the next file', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'true';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-isolation-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn()
      .mockImplementationOnce(() => {
        throw new Error('syntax error');
      })
      .mockReturnValue({ rootNode: makeCleanRootNode() });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);

    const { TreeSitterParser } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const parser = new TreeSitterParser();

    const poison = parser.parse('echo bad', 'bash', undefined, '/workspace/poison.sh');
    const healthy = parser.parse('echo good', 'bash', undefined, '/workspace/healthy.sh');

    expect(poison.parseHealth).toBe('error');
    expect(healthy.parseHealth).not.toBe('error');
    expect(parseMock).toHaveBeenCalledTimes(2);
  });

  it('quarantines after B2 and returns a sentinel on subsequent fresh paths', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'true';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-quarantine-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn(() => {
      throw new Error('RuntimeError: memory access out of bounds');
    });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);

    const { TreeSitterParser, getParserHealth } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const parser = new TreeSitterParser();

    const first = parser.parse('echo hi', 'bash', undefined, '/workspace/first.sh');
    const second = parser.parse('echo again', 'bash', undefined, '/workspace/second.sh');

    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(first.parseErrors[0]).toContain('memory access out of bounds');
    expect(getParserHealth()).toBe('quarantined');
    expect(second.parseErrors[0]).toContain('quarantined');
  });

  it('clears quarantine via __resetParserHealth and lets the parse path re-engage', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'true';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-reset-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn(() => {
      throw new Error('RuntimeError: memory access out of bounds');
    });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);

    const { TreeSitterParser, getParserHealth, __resetParserHealth } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const parser = new TreeSitterParser();

    parser.parse('echo bad', 'bash', undefined, '/workspace/quarantine.sh');
    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(getParserHealth()).toBe('quarantined');

    const stillQuarantined = parser.parse('echo also-bad', 'bash', undefined, '/workspace/another.sh');
    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(stillQuarantined.parseErrors[0]).toContain('quarantined');

    __resetParserHealth();
    expect(getParserHealth()).toBe('ok');

    parser.parse('echo good', 'bash', undefined, '/workspace/post-reset.sh');
    expect(parseMock).toHaveBeenCalledTimes(2);
    expect(getParserHealth()).toBe('quarantined');
  });

  // resetParserHealth() is the production recovery. Unlike the
  // test-only __resetParserHealth (flag flip), it ALSO drops the parser instance
  // and grammar cache so the next getParser() rebuilds a fresh web-tree-sitter
  // instance on a clean heap.
  it('resetParserHealth clears quarantine and drops instance + grammar cache for a fresh re-init', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED = 'true';
    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-fullreset-'));
    tempDirs.push(tempDir);
    const parseMock = vi.fn(() => {
      throw new Error('RuntimeError: memory access out of bounds');
    });
    mockWebTreeSitter(parseMock);
    const dynamicDb = await import('../lib/code-graph-db.js');
    closeDynamicDb = dynamicDb.closeDb;
    dynamicDb.initDb(tempDir);

    const { TreeSitterParser, getParserHealth, resetParserHealth } = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    const parser = new TreeSitterParser();

    // Trigger a B2 quarantine; instance + grammar are still loaded.
    parser.parse('echo bad', 'bash', undefined, '/workspace/quarantine.sh');
    expect(getParserHealth()).toBe('quarantined');
    expect(TreeSitterParser.isReady('bash')).toBe(true);

    // Full reset: quarantine cleared AND the parser is no longer ready
    // (instance + grammar cache dropped) so the next getParser() re-inits fresh.
    resetParserHealth();
    expect(getParserHealth()).toBe('ok');
    expect(TreeSitterParser.isReady('bash')).toBe(false);

    // Re-init (what getParser() does for a not-ready parser), then parse re-engages.
    await TreeSitterParser.init();
    await TreeSitterParser.loadLanguage('bash');
    parser.parse('echo good', 'bash', undefined, '/workspace/post-fullreset.sh');
    expect(parseMock).toHaveBeenCalledTimes(2);
  });
});
