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
const fs = require('fs');

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
  // A caller routing a user's prompt passes --prompt-stdin and sends the prompt on
  // stdin, which keeps it out of argv where any local user can read it.
  const promptFromStdin = args.includes('--prompt-stdin');
  const prompt = promptIdx >= 0 ? args[promptIdx + 1] : '';
  // The surface the caller's session works in. It only reorders surfaces the
  // prompt already matched, and a value that names no surface is ignored.
  const hintIdx = args.indexOf('--surface-hint');
  const surfaceHint = hintIdx >= 0 ? args[hintIdx + 1] : undefined;
  if (!hub) {
    process.stderr.write('usage: compiled-route.cjs --hub <hubId> (--prompt <text> | --prompt-stdin) [--surface-hint <SURFACE>]\n');
    process.exit(2);
  }
  let route = null;
  try {
    if (!RESOLVER) throw new Error('no coherent compiled-routing layout');
    const { resolveRoute } = require(RESOLVER);
    route = resolveRoute(hub, promptFromStdin ? fs.readFileSync(0, 'utf8') : prompt, { surfaceHint });
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
