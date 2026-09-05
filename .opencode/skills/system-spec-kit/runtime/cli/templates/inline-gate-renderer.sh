#!/usr/bin/env bash
# -------------------------------------------------------------------
# COMPONENT: Inline Gate Renderer Wrapper
# -------------------------------------------------------------------
# Renders Level-gated markdown templates for shell callers.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOADER="$SKILL_ROOT/node_modules/tsx/dist/loader.mjs"
RENDERER="$SCRIPT_DIR/inline-gate-renderer.ts"

if [[ ! -f "$LOADER" ]]; then
  node - "$@" <<'NODE'
const fs = require('fs');
const args = process.argv.slice(2);
let level = '1';
const files = [];
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--level') {
    level = args[index + 1] || level;
    index += 1;
    continue;
  }
  files.push(arg);
}
const filePath = files[files.length - 1];
if (!filePath) {
  console.error('inline-gate-renderer: template path required');
  process.exit(1);
}
const source = fs.readFileSync(filePath, 'utf8');
const escapedLevel = level.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blockPattern = new RegExp(`<!-- IF level:${escapedLevel} -->\\n?([\\s\\S]*?)\\n?<!-- /IF -->`, 'm');
const match = source.match(blockPattern);
if (match) {
  process.stdout.write(match[1].replace(/\n?<!-- IF level:[\s\S]*$/m, ''));
} else {
  process.stdout.write(source.replace(/<!-- IF level:[\s\S]*?<!-- \/IF -->\n?/gm, ''));
}
NODE
  exit $?
fi

exec node --import "$LOADER" "$RENDERER" "$@"
