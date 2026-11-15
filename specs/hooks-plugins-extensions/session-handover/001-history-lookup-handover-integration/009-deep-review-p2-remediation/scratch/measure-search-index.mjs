// Measures the heap and resident memory the history navigator's search index
// costs on a synthetic store of a given text size.
// Usage: node --expose-gc measure-search-index.mjs <megabytes>

import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ENGINE_DIST = fileURLToPath(new URL('../../../../../../.skilled/hooks/session-handover/history/dist/', import.meta.url));
const { projectHistoryEntries } = await import(pathToFileURL(join(ENGINE_DIST, 'history.js')).href);
const { HistoryNavigator } = await import(pathToFileURL(join(ENGINE_DIST, 'navigator.js')).href);

const targetBytes = Number(process.argv[2] ?? 10) * 1024 * 1024;
const TIMESTAMP = '2026-11-15T12:00:00.000Z';

// A fixed seed keeps runs comparable. The vocabulary mixes words, paths and
// identifiers so the term and part maps grow as they would on a real session.
let seed = 42;
function random() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
const vocabulary = Array.from({ length: 20000 }, (_, index) => {
  const kind = index % 4;
  if (kind === 0) return `word${index}`;
  if (kind === 1) return `src/module${index}/file${index}.ts`;
  if (kind === 2) return `camelCaseIdentifier${index}`;
  return `snake_case_name_${index}`;
});
function text(bytes) {
  const words = [];
  let size = 0;
  while (size < bytes) {
    const word = vocabulary[Math.floor(random() * vocabulary.length)];
    words.push(word);
    size += word.length + 1;
  }
  return words.join(' ');
}

const entries = [];
let bytes = 0;
let turn = 0;
while (bytes < targetBytes) {
  const user = text(200);
  const answer = text(800);
  const result = text(4000);
  entries.push(
    { id: `u${turn}`, role: 'user', sequence: entries.length, timestamp: TIMESTAMP, content: [{ type: 'text', text: user }] },
    {
      id: `a${turn}`,
      role: 'assistant',
      sequence: entries.length + 1,
      timestamp: TIMESTAMP,
      content: [
        { type: 'text', text: answer },
        { type: 'toolCall', id: `c${turn}`, name: 'read_file', arguments: { path: `src/module${turn}/file.ts` } },
      ],
    },
    {
      id: `r${turn}`,
      role: 'toolResult',
      sequence: entries.length + 2,
      timestamp: TIMESTAMP,
      toolCallId: `c${turn}`,
      isError: false,
      content: [{ type: 'text', text: result }],
    },
  );
  bytes += user.length + answer.length + result.length;
  turn += 1;
}

const megabytes = (value) => (value / 1024 / 1024).toFixed(1);
function heap() {
  globalThis.gc();
  return process.memoryUsage().heapUsed;
}

const items = projectHistoryEntries(entries);
const beforeNavigator = heap();
const navigator = new HistoryNavigator(items);
const afterNavigator = heap();
const started = performance.now();
const hits = navigator.search({ query: 'camelCaseIdentifier102 module7' });
const firstSearchMs = performance.now() - started;
const afterIndex = heap();

console.log(JSON.stringify({
  textMegabytes: megabytes(bytes),
  entries: entries.length,
  items: items.length,
  navigatorHeapMegabytes: megabytes(afterNavigator - beforeNavigator),
  searchIndexHeapMegabytes: megabytes(afterIndex - afterNavigator),
  indexToTextRatio: ((afterIndex - afterNavigator) / bytes).toFixed(2),
  firstSearchMilliseconds: Math.round(firstSearchMs),
  hits: hits.length,
  peakResidentMegabytes: megabytes(process.resourceUsage().maxRSS * 1024),
}));
