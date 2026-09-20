#!/usr/bin/env node
// Structural alignment audit of sk-doc's ROUTER.md against the hub registry.
// Checks: INTENT_SIGNALS/RESOURCE_MAP key parity, on-disk leaf resolution,
// FULL_INVENTORY completeness against the real packet leaf set, and mode coverage.
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = process.env.REPO_ROOT || process.cwd();
const HUB = path.join(REPO, '.opencode/skills/sk-doc');
const rr = require(path.join(REPO, '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs'));

const routerText = fs.readFileSync(path.join(HUB, 'ROUTER.md'), 'utf8');
const surface = rr.loadSurfaceRouter(HUB);
const signals = Object.keys(surface.intentSignals).sort();
const mapKeys = Object.keys(surface.resourceMap).sort();

const fail = [];
const info = [];

// 1. key parity
const onlySignals = signals.filter((k) => !mapKeys.includes(k));
const onlyMap = mapKeys.filter((k) => !signals.includes(k));
if (onlySignals.length || onlyMap.length) {
  fail.push(`KEY-PARITY: signals-only=${JSON.stringify(onlySignals)} map-only=${JSON.stringify(onlyMap)}`);
} else {
  info.push(`KEY-PARITY: OK, ${signals.length} keys on both sides`);
}

// 2. every leaf resolves on disk
const roots = [HUB, ...rr.registryPacketRoots(HUB)];
const unresolved = [];
for (const [intent, leaves] of Object.entries(surface.resourceMap)) {
  for (const leaf of leaves) {
    if (!roots.some((r) => fs.existsSync(path.join(r, leaf)))) unresolved.push(`${intent} -> ${leaf}`);
  }
}
if (unresolved.length) fail.push(`LEAF-RESOLVE: ${unresolved.length} unresolved\n  ` + unresolved.join('\n  '));
else info.push(`LEAF-RESOLVE: OK, all ${Object.values(surface.resourceMap).flat().length} entries resolve`);

// 3. duplicate entries inside an intent
for (const [intent, leaves] of Object.entries(surface.resourceMap)) {
  const dupes = leaves.filter((l, i) => leaves.indexOf(l) !== i);
  if (dupes.length) fail.push(`DUPLICATE: ${intent} repeats ${JSON.stringify([...new Set(dupes)])}`);
}

// 4. FULL_INVENTORY completeness: every leaf named by any other intent must be in it,
//    and every leaf-manifest entry (the generated truth) must be in it.
const full = new Set(surface.resourceMap.FULL_INVENTORY || []);
const missingFromFull = [];
for (const [intent, leaves] of Object.entries(surface.resourceMap)) {
  if (intent === 'FULL_INVENTORY') continue;
  for (const leaf of leaves) if (!full.has(leaf)) missingFromFull.push(`${intent} -> ${leaf}`);
}
if (missingFromFull.length) fail.push(`FULL-INVENTORY-SUBSET: ${missingFromFull.length} intent leaves absent from FULL_INVENTORY\n  ` + missingFromFull.join('\n  '));
else info.push('FULL-INVENTORY-SUBSET: OK, every intent leaf is also in FULL_INVENTORY');

const manifest = JSON.parse(fs.readFileSync(path.join(HUB, 'leaf-manifest.json'), 'utf8'));
const aliases = JSON.parse(fs.readFileSync(path.join(HUB, 'leaf-aliases.json'), 'utf8'));
info.push(`leaf-manifest top-level keys: ${Object.keys(manifest).join(', ')}`);
info.push(`leaf-aliases top-level keys: ${Object.keys(aliases).join(', ')}`);

// 5. registered-mode coverage: which modes own no ROUTER.md intent
const registry = JSON.parse(fs.readFileSync(path.join(HUB, 'mode-registry.json'), 'utf8'));
const modes = (registry.modes || registry).map ? (registry.modes || []).map((m) => m.workflowMode) : Object.keys(registry.modes || {});
info.push(`registry modes (${modes.length}): ${modes.join(', ')}`);

const packetsNamed = new Set();
for (const leaves of Object.values(surface.resourceMap)) {
  for (const leaf of leaves) {
    const seg = leaf.split('/')[0];
    if (seg.startsWith('sk-create-')) packetsNamed.add(seg);
  }
}
const packetsNamedNonFull = new Set();
for (const [intent, leaves] of Object.entries(surface.resourceMap)) {
  if (intent === 'FULL_INVENTORY') continue;
  for (const leaf of leaves) {
    const seg = leaf.split('/')[0];
    if (seg.startsWith('sk-create-')) packetsNamedNonFull.add(seg);
  }
}
const regPackets = new Set();
for (const m of (registry.modes || [])) if (m.packet) regPackets.add(m.packet);
const uncovered = [...regPackets].filter((p) => !packetsNamedNonFull.has(p)).sort();
if (uncovered.length) info.push(`MODE-COVERAGE: packets reachable only through FULL_INVENTORY: ${uncovered.join(', ')}`);
else info.push('MODE-COVERAGE: every registered packet is named by at least one non-FULL_INVENTORY intent');

console.log('--- INFO ---');
for (const i of info) console.log(i);
console.log('--- FAIL ---');
if (!fail.length) console.log('(none)');
for (const f of fail) console.log(f);
process.exit(fail.length ? 1 : 0);
