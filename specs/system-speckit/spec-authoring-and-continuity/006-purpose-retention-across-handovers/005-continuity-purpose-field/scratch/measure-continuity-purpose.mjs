// Reads one packet's implementation-summary.md through the built continuity
// reader and prints: the record keys, the Goal facet, and what happens to a
// hand-added packet_purpose key on read and on a rewrite.
// Usage: node measure-continuity-purpose.mjs <runtime-dir> <packet-folder>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [runtimeDir, packetFolder] = process.argv.slice(2);
const mod = await import(pathToFileURL(path.join(runtimeDir, 'dist/lib/continuity/thin-continuity-record.js')).href);
const markdown = fs.readFileSync(path.join(packetFolder, 'implementation-summary.md'), 'utf8');

const read = mod.readThinContinuityRecord(markdown);
console.log(`read.ok=${read.ok} bytes=${read.bytes}`);
console.log(`keys=${Object.keys(read.record).join(',')}`);
const facets = mod.buildContinuityFacets(read.record);
console.log(`goal=${JSON.stringify(facets.goal)}`);

const injected = markdown.replace(
  /(\n    next_safe_action: [^\n]*\n)/,
  '$1    packet_purpose: "Purpose: Probe value."\n',
);
const probe = mod.readThinContinuityRecord(injected);
console.log(`probe.ok=${probe.ok} errors=${probe.errors.length} has_packet_purpose=${'packet_purpose' in (probe.record ?? {})}`);
const rewrite = mod.upsertThinContinuityInMarkdown(injected, probe.record);
console.log(`rewrite.ok=${rewrite.ok} kept_in_markdown=${rewrite.markdown.includes('packet_purpose')}`);
