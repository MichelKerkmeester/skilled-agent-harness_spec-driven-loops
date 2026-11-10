import { PREFIX_REGISTRY, getPrefixFor } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/dist/embeddings/providers/hf-local.js';
import assert from 'node:assert/strict';

const a = getPrefixFor('nomic-ai/nomic-embed-text-v1.5', 'document');
assert.equal(a, 'search_document: ', `(a) Nomic doc expected "search_document: " got "${a}"`);

const b = getPrefixFor('google/embeddinggemma-300m', 'query');
assert.equal(b, 'task: search result | query: ', `(b) Gemma query expected got "${b}"`);

const c = getPrefixFor('made-up/model', 'query');
assert.equal(c, '', `(c) Unknown model expected "" got "${c}"`);

process.env.HF_EMBEDDINGS_PREFIX_DOC = 'X';
const d = getPrefixFor('made-up/model', 'document');
assert.equal(d, 'X', `(d) env override doc expected "X" got "${d}"`);
delete process.env.HF_EMBEDDINGS_PREFIX_DOC;

process.env.HF_EMBEDDINGS_PREFIX_QUERY = '';
const e = getPrefixFor('nomic-ai/nomic-embed-text-v1.5', 'query');
assert.equal(e, '', `(e) empty-string override expected "" got "${e}"`);
delete process.env.HF_EMBEDDINGS_PREFIX_QUERY;

assert.ok(PREFIX_REGISTRY['google/embeddinggemma-300m'], 'registry has embeddinggemma');
assert.equal(Object.keys(PREFIX_REGISTRY).length, 6, 'registry has 6 entries');

console.log('PASS: 6 assertions');
