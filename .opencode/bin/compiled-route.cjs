#!/usr/bin/env node
'use strict';

// Runtime front door for compiled routing.
//
// A hub whose SKILL.md carries the compiled-routing directive calls this to ask
// whether the compiled router contract is authoritative for a prompt. It stays a
// thin delegate to the single-sourced resolver in the activation spec tree, so
// the compiled contract is never duplicated. Prints the compiled decision when
// the hub is compiled-serving and SPECKIT_COMPILED_ROUTING=1; otherwise a legacy
// sentinel so the caller falls back to the prose smart-router. Never throws into
// a routing path — any failure resolves to the legacy sentinel.

const path = require('path');

const RESOLVER = path.resolve(
  __dirname,
  '..',
  'specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program',
  '007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs',
);

function main() {
  const args = process.argv.slice(2);
  const hub = args[args.indexOf('--hub') + 1];
  const promptIdx = args.indexOf('--prompt');
  const prompt = promptIdx >= 0 ? args[promptIdx + 1] : '';
  if (!hub) {
    process.stderr.write('usage: compiled-route.cjs --hub <hubId> --prompt <text>\n');
    process.exit(2);
  }
  let route = null;
  try {
    const { resolveRoute } = require(RESOLVER);
    route = resolveRoute(hub, prompt);
  } catch {
    route = null;
  }
  process.stdout.write(`${JSON.stringify(route || { servingAuthority: 'legacy', hubId: hub })}\n`);
}

main();
