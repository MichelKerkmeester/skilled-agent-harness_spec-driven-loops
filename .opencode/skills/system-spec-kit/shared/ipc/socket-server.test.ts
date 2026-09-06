// Script-style assertions for the pure helpers of the IPC socket server,
// mirroring the colocated *.test.ts convention in shared/parsing. Run directly
// (tsx/node type stripping); throws on the first failing assertion.

import { parseMaxClients } from './socket-server.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

assert(parseMaxClients('8') === 8, 'a positive integer is accepted');
const fallback = parseMaxClients(undefined);
assert(Number.isInteger(fallback) && fallback >= 1, 'an unset value falls back to the default cap');
assert(parseMaxClients('0') === fallback, 'zero falls back to the default cap');
assert(parseMaxClients('not-a-number') === fallback, 'a non-numeric value falls back to the default cap');

process.stdout.write('socket server helpers ok\n');
