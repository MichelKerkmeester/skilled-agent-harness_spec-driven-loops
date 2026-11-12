#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Command meaning threshold sweep
// ───────────────────────────────────────────────────────────────────
// Scores the tuning rows and the rows that must stay silent with the real
// embedder, records each command row's cosine, and replays the pass and rank
// rules for a grid of bar and margin values. The split filter runs on the
// parsed row before any prompt is read, so an unseen row never reaches the
// scorer or this script's output.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ADV = resolve(HERE, '../../../../../../.skilled/skills/system-skill-advisor/runtime');
const DIST = resolve(ADV, 'dist/runtime');
const CORPUS = resolve(ADV, 'scripts/routing-accuracy/command-prompts.jsonl');
const BRIDGES = resolve(ADV, 'scripts/routing-accuracy/../command-bridges/command-bridges.generated.json');

const { scoreAdvisorPrompt } = await import(pathToFileURL(resolve(DIST, 'lib/scorer/fusion.js')).href);
const { withSemanticShadowPromptEmbedding } = await import(pathToFileURL(resolve(DIST, 'lib/scorer/lanes/semantic-shadow.js')).href);
const { findAdvisorWorkspaceRoot } = await import(pathToFileURL(resolve(DIST, 'lib/utils/workspace-root.js')).href);

const workspaceRoot = findAdvisorWorkspaceRoot(HERE);
const idToCommand = new Map();
for (const entry of JSON.parse(readFileSync(BRIDGES, 'utf8')).entries) {
  if (entry.runtime?.typescript?.enabled) idToCommand.set(entry.runtime.typescript.id, entry.command);
}

function wantsSilence(row) {
  return row.row_type === 'must-not-start'
    || row.row_type === 'near-miss'
    || (row.row_type === 'slash-variant' && (row.expected_command ?? null) === null);
}

const rows = [];
for (const line of readFileSync(CORPUS, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const row = JSON.parse(line);
  const keep = row.split === 'tune' || wantsSilence(row);
  if (!keep) continue;
  rows.push(row);
}

function cosineOf(recommendation) {
  const lane = recommendation.laneContributions?.find((entry) => entry.lane === 'semantic_shadow');
  if (!lane || !lane.evidence?.some((text) => text.startsWith('cosine:'))) return null;
  return lane.rawScore;
}

const observed = [];
for (const row of rows) {
  const result = await withSemanticShadowPromptEmbedding(row.prompt, () => scoreAdvisorPrompt(row.prompt, {
    workspaceRoot,
    includeAllCandidates: true,
  }));
  const all = result.recommendations ?? [];
  const commands = all
    .filter((entry) => entry.kind === 'command')
    .map((entry) => ({ id: entry.skill, cosine: cosineOf(entry) ?? 0, passes: entry.passes_threshold === true }))
    .sort((left, right) => right.cosine - left.cosine);
  const topSkill = all.find((entry) => entry.kind !== 'command' && entry.passes_threshold === true);
  observed.push({
    id: row.id,
    silent: wantsSilence(row),
    expected: row.expected_command ?? null,
    best: commands[0] ?? null,
    second: commands[1]?.cosine ?? 0,
    alreadyPassing: commands.filter((entry) => entry.passes).map((entry) => idToCommand.get(entry.id)),
    topSkillCosine: topSkill ? (cosineOf(topSkill) ?? 0) : null,
    top1: all[0] ? (idToCommand.get(all[0].skill) ?? null) : null,
  });
}

const withCosine = observed.filter((entry) => entry.best && entry.best.cosine > 0).length;
console.log(`rows scored: ${observed.length} (tune ${observed.filter((entry) => !entry.silent).length}, must stay silent ${observed.filter((entry) => entry.silent).length}), rows with a real command cosine: ${withCosine}`);

const grid = [];
for (let bar = 0.5; bar <= 0.9001; bar += 0.02) {
  for (const margin of [0, 0.02, 0.05, 0.1]) {
    let reach = 0;
    let wrongFirst = 0;
    let falseOffers = 0;
    for (const entry of observed) {
      const best = entry.best;
      const passes = best !== null && best.cosine >= bar && best.cosine - entry.second >= margin;
      const first = passes && (entry.topSkillCosine === null || best.cosine - entry.topSkillCosine >= margin);
      const command = best ? idToCommand.get(best.id) : null;
      if (entry.silent) {
        if (passes || entry.alreadyPassing.length > 0) falseOffers += 1;
        continue;
      }
      if (entry.top1 === entry.expected || (first && command === entry.expected)) reach += 1;
      else if (first) wrongFirst += 1;
    }
    grid.push({ bar: Number(bar.toFixed(2)), margin, reach, wrongFirst, falseOffers });
  }
}
for (const cell of grid) console.log(JSON.stringify(cell));
const clean = grid.filter((cell) => cell.falseOffers === 0);
const bestReach = Math.max(...clean.map((cell) => cell.reach));
const pick = clean
  .filter((cell) => cell.reach === bestReach)
  .sort((left, right) => left.wrongFirst - right.wrongFirst || right.bar - left.bar || right.margin - left.margin)[0];
console.log(`pick: highest bar with 0 false offers at the best own reach: ${JSON.stringify(pick)}`);
