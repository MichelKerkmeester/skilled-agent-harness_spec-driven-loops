#!/usr/bin/env node
// Fixes a stale continuity.packet_pointer frontmatter field across every
// spec-doc file in a folder that carries one, setting it to the folder's
// real current path (never hand-guessed -- derived the same way the
// disk-consistency-helper itself derives "actualPacketId").
import fs from 'node:fs';
import path from 'node:path';

const folder = process.argv[2];
const specsRoot = process.argv[3]; // absolute path to .opencode/specs

function normalizePacketId(rawValue) {
  if (typeof rawValue !== 'string') return null;
  let normalized = rawValue.trim();
  if (!normalized) return null;
  normalized = normalized.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '').replace(/\/+$/, '');
  const specsMarker = '/.opencode/specs/';
  const plainSpecsMarker = '/specs/';
  if (normalized.includes(specsMarker)) normalized = normalized.split(specsMarker)[1] || normalized;
  else if (normalized.includes(plainSpecsMarker)) normalized = normalized.split(plainSpecsMarker)[1] || normalized;
  return normalized.replace(/^\.opencode\/specs\//, '').replace(/^specs\//, '');
}

const realFolder = fs.realpathSync(folder).replace(/\\/g, '/');
const realSpecsRoot = fs.realpathSync(specsRoot).replace(/\\/g, '/');
if (!realFolder.startsWith(realSpecsRoot + '/')) {
  console.error(`SKIP ${folder}: not under specs root`);
  process.exit(0);
}
const expected = normalizePacketId(realFolder.slice(realSpecsRoot.length + 1));
if (!expected) {
  console.error(`SKIP ${folder}: could not derive expected packet id`);
  process.exit(0);
}

const candidates = [
  'spec.md', 'plan.md', 'tasks.md', 'checklist.md',
  'decision-record.md', 'implementation-summary.md', 'handover.md',
];

let changed = 0;
for (const name of candidates) {
  const filePath = path.join(folder, name);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) continue;
  const pointerLineMatch = frontmatterMatch[1].match(/^([ \t]*packet_pointer:\s*)(?:"([^"\n]+)"|'([^'\n]+)'|([^\n#]+))/m);
  if (!pointerLineMatch) continue;
  const currentValue = pointerLineMatch[2] || pointerLineMatch[3] || pointerLineMatch[4];
  const currentNormalized = normalizePacketId(currentValue);
  if (currentNormalized === expected) continue;

  const prefix = pointerLineMatch[1];
  const oldLine = pointerLineMatch[0];
  const newLine = `${prefix}"${expected}"`;
  const newContent = content.replace(oldLine, newLine);
  fs.writeFileSync(filePath, newContent, 'utf8');
  changed += 1;
}

console.log(`${changed > 0 ? 'FIXED' : 'NOOP'} ${folder} (${changed} file(s), expected=${expected})`);
