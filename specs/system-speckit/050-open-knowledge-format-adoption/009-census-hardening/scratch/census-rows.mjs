#!/usr/bin/env node
// Row-level census for sampling: one JSON line per citation with its status.
// Usage: node census-rows.mjs <scanner-module-path> <repo-root> > rows.jsonl
// Walks the same docs in the same order as buildCensus and resolves each citation
// with the module's own exported resolver, so the per-status totals must equal the
// census total line printed by that module.
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const [scannerPath, repoRoot] = process.argv.slice(2);
const scanner = await import(pathToFileURL(scannerPath).href);
const tracked = scanner.listTrackedFiles(repoRoot);
const redirects = scanner.loadRedirects();
const commit = scanner.headCommit(repoRoot);
const lineCounts = new Map();
const totals = {};
// buildCensus fills the read cache with every committed doc it reads, so the
// rows below see exactly the text the census saw.
const readCache = new Map();
const census = scanner.buildCensus(repoRoot, tracked, readCache, { corpus: 'all', redirects });

for (const { doc, family, group, skillRoot } of scanner.corpusDocs(tracked, 'all')) {
  let text = readCache.get(`${commit}:${doc}`);
  if (text === undefined) {
    const shown = spawnSync('git', ['-C', repoRoot, 'show', `${commit}:${doc}`], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 512 * 1024 * 1024,
    });
    text = shown.error || shown.status !== 0 ? null : (shown.stdout ?? '');
  }
  if (text === null) continue;
  for (const citation of scanner.extractCitations(text, doc)) {
    const resolved = scanner.resolveCitation(citation, { tracked, repoRoot, skillRoot, redirects, lineCounts });
    totals[resolved.status] = (totals[resolved.status] ?? 0) + 1;
    process.stdout.write(`${JSON.stringify({
      family, group, doc, line: citation.line, target: citation.target,
      targetLine: citation.targetLine, targetLineEnd: citation.targetLineEnd,
      status: resolved.status, path: resolved.path, sentence: citation.sentence,
    })}\n`);
  }
}
process.stderr.write(`commit=${commit.slice(0, 12)} rows=${JSON.stringify(totals)} census=${JSON.stringify(census.total)}\n`);
