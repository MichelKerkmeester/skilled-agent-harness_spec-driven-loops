import { afterEach, describe, expect, it } from 'vitest';

import { formatSearchResults, type MemoryResultEnvelope } from '../formatters/search-results';
import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';

interface SearchData {
  results: MemoryResultEnvelope[];
}

function parseEnvelope(response: MCPResponse): MCPEnvelope<SearchData> {
  const first = response.content[0];
  expect(first?.type).toBe('text');
  if (first?.type !== 'text') {
    throw new Error('Expected text content');
  }
  return JSON.parse(first.text) as MCPEnvelope<SearchData>;
}

function recalledBody(content: string): string {
  const lines = content.split('\n');
  return lines.slice(1, -1).join('\n');
}

function decodeRecalledBody(content: string): string {
  return recalledBody(content)
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

describe('contextual tree header mode wiring', () => {
  const header = '[Parent > Child — Description]';
  const body = 'Body content from recalled memory.';

  afterEach(() => {
    delete process.env.SPECKIT_CONTEXT_HEADERS;
  });

  it('prepends the contextual header to recalled content when enabled', async () => {
    process.env.SPECKIT_CONTEXT_HEADERS = 'true';

    const response = await formatSearchResults([
      {
        id: 1,
        spec_folder: 'memory/context',
        file_path: 'memory.md',
        title: 'Contextual Memory',
        precomputedContent: body,
        contextualTreeHeader: header,
      },
    ], 'semantic', true);

    const envelope = parseEnvelope(response);
    const content = envelope.data.results[0]?.content;

    expect(content).toBeTypeOf('string');
    expect(recalledBody(content as string).startsWith('[Parent &gt; Child — Description]\n')).toBe(true);
    expect(decodeRecalledBody(content as string)).toBe(`${header}\n${body}`);
  });

  it('omits the contextual header from recalled content when disabled', async () => {
    process.env.SPECKIT_CONTEXT_HEADERS = 'false';

    const response = await formatSearchResults([
      {
        id: 1,
        spec_folder: 'memory/context',
        file_path: 'memory.md',
        title: 'Contextual Memory',
        precomputedContent: body,
        contextualTreeHeader: header,
      },
    ], 'semantic', true);

    const envelope = parseEnvelope(response);
    const content = envelope.data.results[0]?.content;

    expect(content).toBeTypeOf('string');
    expect(decodeRecalledBody(content as string)).toBe(body);
  });
});
