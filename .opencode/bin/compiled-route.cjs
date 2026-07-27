#!/usr/bin/env node
'use strict';

// Runtime front door for compiled routing.
//
// A hub whose SKILL.md carries the compiled-routing directive calls this to ask
// whether the compiled router contract is authoritative for a prompt. It stays a
// thin delegate to the single-sourced resolver, promoted to a stable runtime path
// under bin/lib rather than the mutable spec tree, so a spec renumber can never
// sever routing and the compiled contract is never duplicated. Prints the compiled
// decision when the hub is compiled-serving and the flag permits it; otherwise a
// legacy sentinel so the caller falls back to the prose smart-router. Never throws
// into a routing path — any failure resolves to the legacy sentinel.

const path = require('path');

const { resolverPathFor } = require('./lib/compiled-route-layout.cjs');

const RUNTIME_ROOT = path.resolve(__dirname, 'lib', 'compiled-routing');
// Coherent layout verdict: the resolver from whichever generation the runtime
// actually serves, or null when no layout is fully present (fail to the legacy
// sentinel below). Never mixes a current resolver with a legacy engine.
const RESOLVER = resolverPathFor(RUNTIME_ROOT);

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
    if (!RESOLVER) throw new Error('no coherent compiled-routing layout');
    const { resolveRoute } = require(RESOLVER);
    route = resolveRoute(hub, prompt);
  } catch (err) {
    // Emit-only, stderr, debug-gated: never reaches stdout (the routing channel)
    // or the TUI, and never changes the fallback outcome (still legacy sentinel).
    if (process.env.SPECKIT_COMPILED_ROUTING_DEBUG) {
      process.stderr.write(`[compiled-routing] front door fell back to legacy for hub=${hub}: ${err && err.message}\n`);
    }
    route = null;
  }
  process.stdout.write(`${JSON.stringify(route || { servingAuthority: 'legacy', hubId: hub })}\n`);
}

main();
