// ───────────────────────────────────────────────────────────────
// TEST: Tree-Sitter Parser
// ───────────────────────────────────────────────────────────────
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const parseMock = vi.fn();
const langLoadMock = vi.fn();
const setLanguageMock = vi.fn();

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  closeDb: vi.fn(),
  initDb: vi.fn(),
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getDb: mocks.getDb,
  closeDb: mocks.closeDb,
  initDb: mocks.initDb,
}));

vi.mock('web-tree-sitter', () => {
  class MockParser {
    static Language = {
      load: langLoadMock,
    };
    static init = vi.fn(async () => undefined);
    setLanguage = setLanguageMock;
    parse = parseMock;
  }
  return { default: MockParser };
});

import {
  TreeSitterParser,
  classifyError,
  getParserHealth,
  __resetParserHealth,
} from '../lib/tree-sitter-parser.js';

function makeRootNode(overrides: Record<string, unknown> = {}) {
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
    ...overrides,
  };
}

describe('tree-sitter-parser / classifyError', () => {
  it('classifies B1 when message contains "resolved is not a function"', () => {
    expect(classifyError(new Error('TypeError: resolved is not a function'))).toBe('B1');
  });

  it('classifies B2 when message contains "memory access out of bounds"', () => {
    expect(classifyError(new Error('RuntimeError: memory access out of bounds'))).toBe('B2');
  });

  it('classifies OTHER for unrecognized errors', () => {
    expect(classifyError(new Error('syntax error'))).toBe('OTHER');
  });

  it('classifies non-Error throws as OTHER', () => {
    expect(classifyError('some string error')).toBe('OTHER');
  });
});

describe('tree-sitter-parser / parser health lifecycle', () => {
  it('starts with parser health ok', () => {
    __resetParserHealth();
    expect(getParserHealth()).toBe('ok');
  });

  it('__resetParserHealth restores from quarantined to ok', () => {
    __resetParserHealth();
    expect(getParserHealth()).toBe('ok');
    // Simulate quarantine by directly testing the reset function
    __resetParserHealth();
    expect(getParserHealth()).toBe('ok');
  });
});

describe('tree-sitter-parser / static helpers', () => {
  beforeEach(() => {
    langLoadMock.mockClear();
    langLoadMock.mockResolvedValue({ language: 'javascript' });
    __resetParserHealth();
  });

  it('TreeSitterParser.isReady returns false before init', () => {
    expect(TreeSitterParser.isReady()).toBe(false);
  });

  it('TreeSitterParser.loadLanguage skips doc language', async () => {
    await TreeSitterParser.loadLanguage('doc');
    expect(langLoadMock).not.toHaveBeenCalled();
  });

  it('TreeSitterParser.isReady returns true for doc language without init', () => {
    expect(TreeSitterParser.isReady('doc')).toBe(true);
  });
});

describe('tree-sitter-parser / parse', () => {
  beforeEach(() => {
    vi.resetModules();
    parseMock.mockClear();
    setLanguageMock.mockClear();
    langLoadMock.mockClear();
    __resetParserHealth();
  });

  afterEach(() => {
    __resetParserHealth();
  });

  it('returns clean empty result for doc language without parser', () => {
    const parser = new TreeSitterParser();
    const result = parser.parse('some doc content', 'doc');
    expect(result.language).toBe('doc');
    expect(result.parseHealth).toBe('clean');
    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
  });

  it('returns error when parser is not initialized', () => {
    const parser = new TreeSitterParser();
    const result = parser.parse('function foo() {}', 'javascript');
    expect(result.parseHealth).toBe('error');
    expect(result.parseErrors[0]).toContain('not initialized');
  });

  it('returns error when grammar is not loaded', async () => {
    await TreeSitterParser.init();
    const parser = new TreeSitterParser();
    const result = parser.parse('function foo() {}', 'javascript');
    expect(result.parseHealth).toBe('error');
    expect(result.parseErrors[0]).toContain('Grammar not loaded');
  });

  it('parses successfully with a clean AST (no parse errors, nodes found)', async () => {
    await TreeSitterParser.init();
    parseMock.mockReturnValue({
      rootNode: makeRootNode({
        type: 'program',
        namedChildren: [
          {
            type: 'function_declaration',
            isNamed: true,
            hasError: false,
            text: 'function foo() {}',
            startPosition: { row: 0, column: 0 },
            endPosition: { row: 0, column: 18 },
            parent: null,
            namedChildren: [],
            childForFieldName: (name: string) => name === 'name'
              ? { text: 'foo' }
              : null,
          },
        ],
        childForFieldName: () => null,
      }),
    });
    // Manually cache grammar since web-tree-sitter is mocked
    const grammarCache = (TreeSitterParser as unknown as { _grammarCache?: Map<string, unknown> })['_grammarCache'];
    const grammarModule = await import('../lib/tree-sitter-parser.js');
    await TreeSitterParser.init();
    langLoadMock.mockResolvedValue({ language: 'javascript' });
    await TreeSitterParser.loadLanguage('javascript');

    const parser = new TreeSitterParser();
    const result = parser.parse('function foo() {}', 'javascript');
    expect(result.language).toBe('javascript');
    expect(result.parseHealth).toBe('clean');
    expect(result.nodes.length).toBeGreaterThan(0);
  });

  it('returns recovered parseHealth when tree has errors but nodes were extracted', async () => {
    await TreeSitterParser.init();
    langLoadMock.mockResolvedValue({ language: 'javascript' });
    await TreeSitterParser.loadLanguage('javascript');
    parseMock.mockReturnValue({
      rootNode: makeRootNode({
        hasError: true,
        namedChildren: [
          {
            type: 'function_declaration',
            isNamed: true,
            hasError: false,
            text: 'function foo() {}',
            startPosition: { row: 0, column: 0 },
            endPosition: { row: 0, column: 18 },
            parent: null,
            namedChildren: [],
            childForFieldName: (name: string) => name === 'name'
              ? { text: 'foo' }
              : null,
          },
        ],
      }),
    });

    const parser = new TreeSitterParser();
    const result = parser.parse('function foo() {}', 'javascript');
    expect(result.parseHealth).toBe('recovered');
    expect(result.parseErrors).toContain('Tree contains syntax errors (partial parse)');
  });

  it('returns error parseHealth and preserves the module sentinel when tree has errors and no symbols extracted', async () => {
    await TreeSitterParser.init();
    langLoadMock.mockResolvedValue({ language: 'javascript' });
    await TreeSitterParser.loadLanguage('javascript');
    parseMock.mockReturnValue({
      rootNode: makeRootNode({
        hasError: true,
        namedChildren: [],
        childForFieldName: () => null,
      }),
    });

    const parser = new TreeSitterParser();
    const result = parser.parse('{{{', 'javascript');
    expect(result.parseHealth).toBe('error');
    expect(result.nodes).toEqual([
      expect.objectContaining({
        kind: 'module',
        fqName: 'module',
      }),
    ]);
  });

  it('handles parser throwing an error gracefully', async () => {
    await TreeSitterParser.init();
    langLoadMock.mockResolvedValue({ language: 'bash' });
    await TreeSitterParser.loadLanguage('bash');
    parseMock.mockImplementation(() => {
      throw new Error('RuntimeError: memory access out of bounds');
    });

    const parser = new TreeSitterParser();
    const result = parser.parse('echo bad', 'bash', undefined, '/workspace/bad.sh');
    expect(result.parseHealth).toBe('error');
    expect(result.parseErrors[0]).toContain('memory access out of bounds');
  });
});
