// Measures one real Claude transcript through the same reader and lookup the
// history CLI uses, and prints numbers only, never transcript content.
// Usage: node --expose-gc measure-real-transcript.mjs <transcript.jsonl>

import { statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = fileURLToPath(new URL('../../../../../../', import.meta.url));
const { readSession } = await import(pathToFileURL(join(REPO, '.skilled/hooks/shared/session-readers/index.mjs')).href);
const { createHistoryLookup } = await import(pathToFileURL(join(REPO, '.skilled/hooks/session-handover/history/dist/core.js')).href);

const transcriptPath = process.argv[2];
const sessionId = basename(transcriptPath, '.jsonl');
const megabytes = (value) => (value / 1024 / 1024).toFixed(1);
function heap() {
  globalThis.gc();
  return process.memoryUsage().heapUsed;
}

const startHeap = heap();
let started = performance.now();
const result = await readSession({ runtime: 'claude', sessionId, transcriptPath });
if (!result.ok) {
  console.log(JSON.stringify({ ok: false, code: result.code }));
  process.exit(1);
}
const readMs = performance.now() - started;
const afterRead = heap();

started = performance.now();
const lookup = createHistoryLookup(result.items);
const buildMs = performance.now() - started;
const afterLookup = heap();

started = performance.now();
const reply = lookup.search({ query: 'history lookup offer' });
const firstSearchMs = performance.now() - started;
const afterIndex = heap();

started = performance.now();
lookup.search({ query: 'deep review finding' });
const secondSearchMs = performance.now() - started;

console.log(JSON.stringify({
  ok: true,
  fileMegabytes: megabytes(statSync(transcriptPath).size),
  items: result.items.length,
  readerHeapMegabytes: megabytes(afterRead - startHeap),
  lookupHeapMegabytes: megabytes(afterLookup - afterRead),
  searchIndexHeapMegabytes: megabytes(afterIndex - afterLookup),
  readMilliseconds: Math.round(readMs),
  buildMilliseconds: Math.round(buildMs),
  firstSearchMilliseconds: Math.round(firstSearchMs),
  secondSearchMilliseconds: Math.round(secondSearchMs),
  replyBytes: Buffer.byteLength(JSON.stringify(reply), 'utf8'),
  peakResidentMegabytes: megabytes(process.resourceUsage().maxRSS * 1024),
}));
