#!/usr/bin/env node
// Row-level SOURCE_TAGS output for sampling: one JSON line per tag citation with the
// resolver status, the resolved path, and an ignored decision re-derived here from the
// plain path only (no spaced forms), as an independent check on the helper.
// Usage: node tag-rows.mjs <repo-root> <packet-list> > rows.jsonl
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { sourceTagCitations } from '../../../../../.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs';
import { listTrackedFiles, loadRedirects, resolveCitation } from '../../../../../.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs';

const [repoRoot, listFile] = process.argv.slice(2);
const tracked = listTrackedFiles(repoRoot);
const others = spawnSync('git', ['-C', repoRoot, 'ls-files', '--others', '--exclude-standard', '-z'], { encoding: 'utf8', maxBuffer: 1 << 28 });
for (const entry of others.stdout.split('\0')) if (entry) tracked.add(entry);
const redirects = loadRedirects();
const lineCounts = new Map();

const walk = (dir, files) => {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['prompts', 'node_modules'].includes(e.name)) walk(full, files); }
    else if (e.isFile() && e.name.endsWith('.md')) files.push(full);
  }
};

const rows = [];
for (const packet of fs.readFileSync(listFile, 'utf8').split('\n').filter(Boolean)) {
  const files = [];
  for (const d of ['research', 'review']) walk(path.join(repoRoot, packet, d), files);
  files.sort();
  const packetRoot = path.relative(repoRoot, fs.realpathSync(path.join(repoRoot, packet))).split(path.sep).join('/');
  for (const file of files) {
    const doc = path.relative(repoRoot, fs.realpathSync(file)).split(path.sep).join('/');
    for (const c of sourceTagCitations(fs.readFileSync(file, 'utf8'), doc)) {
      const r = resolveCitation(c, { tracked, repoRoot, skillRoot: packetRoot, redirects, lineCounts });
      const plain = [path.posix.join(path.posix.dirname(doc), c.target), c.target, path.posix.join(packetRoot, c.target)]
        .filter((p) => !p.startsWith('../') && !path.posix.isAbsolute(p));
      rows.push({ packet, base: packetRoot, doc, line: c.line, target: c.target, targetLine: c.targetLine,
        targetLineEnd: c.targetLineEnd, lead: c.lead, text: c.text, status: r.status, path: r.path, plain, sentence: c.sentence });
    }
  }
}

// One check-ignore over plain candidates that are not beyond a symlink.
const isLinked = new Map();
const beyondLink = (p) => {
  const parts = p.split('/');
  let prefix = '';
  for (let i = 0; i < parts.length - 1; i += 1) {
    prefix = prefix ? `${prefix}/${parts[i]}` : parts[i];
    if (!isLinked.has(prefix)) isLinked.set(prefix, fs.lstatSync(path.join(repoRoot, prefix), { throwIfNoEntry: false })?.isSymbolicLink() === true);
    if (isLinked.get(prefix)) return true;
  }
  return false;
};
const eligible = new Set(['unresolved', 'refused', 'basename_only', 'ambiguous']);
const ask = [...new Set(rows.filter((r) => eligible.has(r.status) && !path.posix.basename(r.target).startsWith('.env'))
  .flatMap((r) => r.plain).filter((p) => !beyondLink(p)))];
const ig = spawnSync('git', ['-C', repoRoot, 'check-ignore', '-z', '--stdin'], { input: `${ask.join('\0')}\0`, encoding: 'utf8', maxBuffer: 1 << 28 });
if (ig.status !== 0 && ig.status !== 1) { process.stderr.write(ig.stderr); process.exit(2); }
const ignored = new Set(ig.stdout.split('\0').filter(Boolean));
for (const r of rows) {
  r.plainIgnored = eligible.has(r.status) && !path.posix.basename(r.target).startsWith('.env') && r.plain.some((p) => ignored.has(p));
  process.stdout.write(`${JSON.stringify(r)}\n`);
}
