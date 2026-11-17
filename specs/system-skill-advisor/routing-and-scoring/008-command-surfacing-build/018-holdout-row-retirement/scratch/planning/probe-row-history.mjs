// Run from the repository root: node <this file>
// Traces where the sealed row came from, printing commit hashes, dates, ids,
// gold labels and counts only. The row's prompt is passed to git as a search
// argument and is never printed, and no commit subject is printed either.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Stderr is dropped because the sealed file did not exist before the commit that
// moved the asset tree, and git reports that expected miss on stderr.
const G = (args) => execFileSync('git', ['-c', 'core.fsmonitor=false', ...args], { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] });
const HP = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl';
const FIXTURE = '.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json';
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const row = readFileSync(HP, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).find((r) => r.id === 'suppressed-codex-abstain');

// 1. The fixture case that holds the same prompt, in every version of the fixture.
console.log('fixture case holding the sealed prompt, newest first:');
const versions = [];
for (const line of G(['log', '--follow', '--format=COMMIT %h %ad', '--date=short', '--name-only', '--', FIXTURE]).split('\n')) {
  if (line.startsWith('COMMIT ')) versions.push({ head: line.slice('COMMIT '.length), path: null });
  else if (line.trim() && versions.length > 0 && versions[versions.length - 1].path === null) versions[versions.length - 1].path = line.trim();
}
for (const { head, path } of versions) {
  if (!path) continue;
  const fixture = JSON.parse(G(['show', `${head.split(' ')[0]}:${path}`]));
  const same = fixture.cases.filter((c) => norm(c.prompt) === norm(row.prompt)).map((c) => `${c.id}=${c.expectedTop}`);
  console.log(`  ${head} ${JSON.stringify(same)}`);
}

// 2. When the prompt first entered each kind of file.
for (const spec of [':(glob)**/graph-metadata.json', ':(glob)**/executor-delegation-cases.json', ':(glob)**/holdout-prompts.jsonl']) {
  const lines = G(['log', '--reverse', '--format=%h %ad', '--date=short', `-S${row.prompt}`, '--', spec]).trim().split('\n').filter(Boolean);
  console.log(`${spec}: commits ${lines.length}, first ${lines[0] ?? 'none'}`);
}

// 3. Rows the sealed file has lost or relabelled, by id, across its history.
for (const commit of G(['log', '--format=%h', '--', HP]).trim().split('\n')) {
  let before = [];
  try {
    before = G(['show', `${commit}^:${HP}`]).split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    continue;
  }
  const after = G(['show', `${commit}:${HP}`]).split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const gold = new Map(after.map((r) => [r.id, r.skill_top_1]));
  const removed = before.filter((r) => !gold.has(r.id)).map((r) => r.id);
  const relabelled = before.filter((r) => gold.has(r.id) && gold.get(r.id) !== r.skill_top_1).map((r) => r.id);
  if (removed.length > 0 || relabelled.length > 0) {
    console.log(`${commit} rows ${before.length} to ${after.length}, removed ${JSON.stringify(removed)}, relabelled ${JSON.stringify(relabelled)}`);
  }
}
