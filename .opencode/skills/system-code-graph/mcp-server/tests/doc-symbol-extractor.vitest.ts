// -------------------------------------------------------------------
// MODULE: Doc Symbol Extractor Tests
// -------------------------------------------------------------------

import { describe, expect, it } from 'vitest';

import {
  extractConfigKeys,
  extractMarkdownHeadings,
} from '../lib/doc-symbol-extractor.js';
import { generateSymbolId } from '../lib/indexer-types.js';
import { parseFile } from '../lib/structural-indexer.js';

describe('doc-symbol-extractor', () => {
  it('extracts markdown headings, setext headings, and nesting edges while skipping fenced code', () => {
    const content = [
      '# Title',
      '',
      '```',
      '# Not a heading',
      '```',
      '',
      '## Child',
      'Sibling',
      '-------',
      '### Grandchild',
    ].join('\n');

    const result = extractMarkdownHeadings(content, { filePath: '/docs/readme.md' });

    expect(result.detectorProvenance).toBe('regex');
    expect(result.nodes.map((node) => [node.kind, node.name, node.startLine, node.endLine])).toEqual([
      ['heading', 'Title', 1, 1],
      ['heading', 'Child', 7, 7],
      ['heading', 'Sibling', 8, 9],
      ['heading', 'Grandchild', 10, 10],
    ]);
    expect(result.edges).toHaveLength(3);
    expect(result.edges.map((edge) => edge.edgeType)).toEqual(['CONTAINS', 'CONTAINS', 'CONTAINS']);
    expect(result.edges[0]).toMatchObject({
      sourceId: result.nodes[0].symbolId,
      targetId: result.nodes[1].symbolId,
    });
    expect(result.edges[1]).toMatchObject({
      sourceId: result.nodes[0].symbolId,
      targetId: result.nodes[2].symbolId,
    });
    expect(result.edges[2]).toMatchObject({
      sourceId: result.nodes[2].symbolId,
      targetId: result.nodes[3].symbolId,
    });
  });

  it('keeps markdown node and edge ids stable across identical rescans', () => {
    const content = '# Title\n## Child\n';
    const first = extractMarkdownHeadings(content, { filePath: '/docs/readme.md' });
    const second = extractMarkdownHeadings(content, { filePath: '/docs/readme.md' });

    expect(first.nodes.map((node) => node.symbolId)).toEqual(second.nodes.map((node) => node.symbolId));
    expect(first.edges).toEqual(second.edges);
    expect(first.nodes[0].symbolId).toBe(generateSymbolId('/docs/readme.md', first.nodes[0].fqName, 'heading'));
  });

  it.each([
    ['json', '{"name":"pkg","scripts":{"test":"vitest"}}'],
    ['jsonc', '{// comment\n"name":"pkg","scripts":{"test":"vitest",},}'],
    ['yaml', 'name: pkg\nscripts:\n  test: vitest\n'],
    ['yml', 'name: pkg\nscripts:\n  test: vitest\n'],
    ['toml', 'name = "pkg"\n[scripts]\ntest = "vitest"\n'],
  ] as const)('extracts nested config keys from %s', (format, content) => {
    const result = extractConfigKeys(content, format, { filePath: `/config/sample.${format}` });

    expect(result.detectorProvenance).toBe('structured');
    expect(result.nodes.map((node) => [node.kind, node.name])).toEqual([
      ['key', 'name'],
      ['key', 'scripts'],
      ['key', 'test'],
    ]);
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0]).toMatchObject({
      sourceId: result.nodes[1].symbolId,
      targetId: result.nodes[2].symbolId,
      edgeType: 'CONTAINS',
    });
  });

  it('degrades malformed json to zero symbols', () => {
    const result = extractConfigKeys('{ "name": ', 'json', { filePath: '/config/bad.json' });

    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
  });

  it('feeds doc symbols through the parseFile doc branch', async () => {
    const result = await parseFile('/workspace/package.json', '{"scripts":{"test":"vitest"}}', 'doc');

    expect(result.parseHealth).toBe('clean');
    expect(result.detectorProvenance).toBe('structured');
    expect(result.nodes.map((node) => node.kind)).toEqual(['key', 'key']);
    expect(result.edges).toHaveLength(1);
    expect(result.contentHash).toMatch(/^[a-f0-9]{12}$/);
  });
});
