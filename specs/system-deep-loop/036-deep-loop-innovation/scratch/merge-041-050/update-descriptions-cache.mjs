#!/usr/bin/env node
// Refresh the global folder-description cache after packets are relocated, without
// rebuilding the whole index: only the affected rows are replaced, so unrelated
// entries and any pending working-tree churn stay out of the diff.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadDescriptionCache,
  saveDescriptionCache,
} from '../../../../../.skilled/skills/system-spec-kit/runtime/dist/lib/search/folder-discovery.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..', '..', '..');
const specsRoot = path.join(repoRoot, 'specs');
const cachePath = path.join(specsRoot, 'descriptions.json');
const mapping = JSON.parse(fs.readFileSync(path.join(here, 'mapping.json'), 'utf8'));
const rootRel = 'system-deep-loop/036-deep-loop-innovation';

function readEntry(rel) {
  const raw = JSON.parse(fs.readFileSync(path.join(specsRoot, rel, 'description.json'), 'utf8'));
  if (raw.specFolder !== rel) {
    throw new Error(`description.json folder mismatch for ${rel}: ${raw.specFolder}`);
  }
  return {
    specFolder: raw.specFolder,
    description: raw.description,
    keywords: raw.keywords,
    lastUpdated: raw.lastUpdated,
  };
}

function hasEntry(rel) {
  return fs.existsSync(path.join(specsRoot, rel, 'description.json'));
}

// Collect the folders whose derived metadata was regenerated: the phase parent,
// each receiving parent, each relocated packet, and each numbered descendant of a
// relocated packet. Unrelated rows are left exactly as they were.
const rels = new Set([rootRel]);
function collect(rel) {
  if (!hasEntry(rel)) return;
  rels.add(rel);
  for (const ent of fs.readdirSync(path.join(specsRoot, rel), { withFileTypes: true })) {
    if (ent.isDirectory() && /^\d{3}-/.test(ent.name)) collect(`${rel}/${ent.name}`);
  }
}
for (const packet of mapping.packets) {
  rels.add(path.posix.dirname(packet.new));
  collect(packet.new);
}

const existing = loadDescriptionCache(cachePath);
if (!existing) throw new Error(`no cache at ${cachePath}`);
const oldPrefixes = mapping.packets.map((packet) => packet.old);
const kept = existing.folders.filter(
  (folder) => !oldPrefixes.some((old) => folder.specFolder === old || folder.specFolder.startsWith(`${old}/`)),
);
const removed = existing.folders.length - kept.length;

const byFolder = new Map(kept.map((folder) => [folder.specFolder, folder]));
const changed = [];
for (const rel of [...rels].sort()) {
  const next = readEntry(rel);
  const prev = byFolder.get(rel);
  if (!prev || JSON.stringify(prev) !== JSON.stringify(next)) changed.push(rel);
  byFolder.set(rel, next);
}
const folders = [...byFolder.values()].sort((a, b) => a.specFolder.localeCompare(b.specFolder));
saveDescriptionCache(
  { version: existing.version ?? 1, generated: new Date().toISOString(), folders },
  cachePath,
  { idempotent: true },
);

console.log(`removed rows: ${removed}`);
console.log(`changed/inserted rows: ${changed.length}`);
for (const rel of changed) console.log(`  ${rel}`);
console.log(`total rows: ${folders.length}`);
