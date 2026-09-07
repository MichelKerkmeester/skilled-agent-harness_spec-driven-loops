// Script-style assertions for the pure helpers of the IPC socket server,
// mirroring the colocated *.test.ts convention in shared/parsing. Run directly
// (tsx/node type stripping); throws on the first failing assertion.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseMaxClients, SOCKET_FILE_NAME } from './socket-server.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

assert(parseMaxClients('8') === 8, 'a positive integer is accepted');
const fallback = parseMaxClients(undefined);
assert(Number.isInteger(fallback) && fallback >= 1, 'an unset value falls back to the default cap');
assert(parseMaxClients('0') === fallback, 'zero falls back to the default cap');
assert(parseMaxClients('not-a-number') === fallback, 'a non-numeric value falls back to the default cap');

// The launcher and the CLI front door spell the socket file name as a literal
// because they run before the package is built; hold them to the server's name.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
for (const relative of ['.opencode/bin/skill-advisor.cjs', '.opencode/bin/system-skill-advisor-launcher.cjs']) {
  const source = fs.readFileSync(path.join(repoRoot, relative), 'utf8');
  assert(source.includes(`'${SOCKET_FILE_NAME}'`), `${relative} names the daemon socket file as ${SOCKET_FILE_NAME}`);
}

process.stdout.write('socket server helpers ok\n');
