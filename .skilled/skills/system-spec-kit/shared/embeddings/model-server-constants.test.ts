// Script-style assertions, run directly with tsx like the other colocated tests.
//
// The hf-local client and the process that binds the model-server socket live
// in different packages and cannot import each other, so the socket directory
// and the launcher's owner-lease file name are declared twice. This test is the
// only thing that keeps the two declarations equal: a drift here would make the
// client wait on a socket nobody binds, silently.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_BIN = path.resolve(HERE, '..', '..', '..', '..', 'bin');

function literal(file: string, name: string): string {
  const source = readFileSync(file, 'utf8');
  const match = source.match(new RegExp(`const ${name} = '([^']+)'`));
  if (!match) throw new Error(`${name} not declared in ${file}`);
  return match[1];
}

const client = path.join(HERE, 'providers', 'hf-local.ts');
const supervision = path.join(REPO_BIN, 'lib', 'model-server-supervision.cjs');
const launcher = path.join(REPO_BIN, 'system-skill-advisor-launcher.cjs');

const socketDirClient = literal(client, 'DEFAULT_MODEL_SERVER_SOCKET_DIR');
const socketDirBinder = literal(supervision, 'DEFAULT_MODEL_SERVER_SOCKET_DIR');
if (socketDirClient !== socketDirBinder) {
  throw new Error(`model-server socket dir drifted: client ${socketDirClient} vs binder ${socketDirBinder}`);
}

const leaseClient = literal(client, 'ADVISOR_OWNER_LEASE_FILE_NAME');
const leaseWriter = literal(launcher, 'OWNER_LEASE_FILE_NAME');
if (leaseClient !== leaseWriter) {
  throw new Error(`owner lease file name drifted: client ${leaseClient} vs launcher ${leaseWriter}`);
}

process.stdout.write('model-server constants agree across packages\n');
