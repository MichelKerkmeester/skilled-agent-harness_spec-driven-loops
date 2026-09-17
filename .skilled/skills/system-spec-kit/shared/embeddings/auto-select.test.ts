// Script-style assertions for the embedder auto-select helpers, mirroring the
// colocated *.test.ts convention in shared/parsing. Run directly (tsx/node type
// stripping); throws on the first failing assertion.

import { __autoSelectTestables, providerResolutionFromAutoSelect } from './auto-select.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

const tags = __autoSelectTestables.parseOllamaTags({ models: [{ name: 'nomic-embed-text:latest' }, { name: 'mxbai-embed-large:latest' }] });
assert(tags.has('nomic-embed-text:latest'), 'parseOllamaTags collects model names from a tags payload');
assert(__autoSelectTestables.parseOllamaTags(null).size === 0, 'a missing payload yields no tags');
assert(__autoSelectTestables.parseOllamaTags({ models: 'not-a-list' }).size === 0, 'a malformed payload yields no tags');

const resolution = providerResolutionFromAutoSelect({ provider: 'ollama', name: 'nomic-embed-text-v1.5' } as never);
assert(resolution.name === 'ollama', 'providerResolutionFromAutoSelect names the selected provider');

process.stdout.write('auto-select helpers ok\n');
