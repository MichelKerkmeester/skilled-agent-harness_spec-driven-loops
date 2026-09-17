import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_TEXT_LENGTH, semanticChunk } from './chunking.js';

test('short text passes through unchanged', () => {
  assert.equal(semanticChunk('# Title\n\nShort body.\n'), '# Title\n\nShort body.\n');
});

test('long text is cut to the limit and keeps its opening', () => {
  const body = '# Title\n\n' + 'A sentence that repeats. '.repeat(1000);
  const out = semanticChunk(body);
  assert.ok(out.length <= MAX_TEXT_LENGTH, `expected at most ${MAX_TEXT_LENGTH} characters, got ${out.length}`);
  assert.ok(out.startsWith('# Title'), 'the overview survives');
});
