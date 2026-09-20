#!/usr/bin/env node
'use strict';

/**
 * Deterministic replay driver for the routing-remediation regression fixtures.
 *
 * Enumerates the hub corpus (13 hub_routing scenarios) and the six packet
 * corpora (49 intra-routing-recall scenarios) through the harness loader,
 * reads gold from each scenario's raw frontmatter, replays every prompt
 * through router-replay.cjs routeSkillResources, and writes fixture files in
 * the same row shape as the Phase 0 pre-fix capture.
 *
 * Comparator: intentMatch is exact-set equality between replayed intents and
 * the gold intent, where the rejection labels `none`/`defer` assert the EMPTY
 * intent set (single-valued zero-score semantics); resourceMatch is exact-set
 * equality between assembled resources and expected_resources as authored.
 *
 * usage: node replay-driver.cjs --tag post-ws2 --out <dir>
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..');
const HARNESS = path.join(REPO, '.opencode', 'skills', 'system-deep-loop', 'deep-improvement', 'scripts', 'skill-benchmark');
const { routeSkillResources } = require(path.join(HARNESS, 'router-replay.cjs'));
const { loadPlaybookScenarios } = require(path.join(HARNESS, 'load-playbook-scenarios.cjs'));
const HUB_ROOT = path.join(REPO, '.opencode', 'skills', 'mcp-tooling');
const PACKETS = ['mcp-chrome-devtools', 'mcp-click-up', 'mcp-aside-devtools', 'mcp-figma', 'mcp-refero', 'mcp-mobbin'];
const REJECTION = new Set(['none', 'defer', 'unknown']);

function setEq(a, b) {
  const A = new Set(a); const B = new Set(b);
  return A.size === B.size && [...A].every((x) => B.has(x));
}

function rawGold(skillRoot, featureFile) {
  const text = fs.readFileSync(path.join(skillRoot, 'manual_testing_playbook', featureFile), 'utf8');
  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  const block = fm ? fm[1] : '';
  const intentM = /(?:^|\n)[ \t]*expected_intent:\s*["']?([^\n"']+)/.exec(block);
  const resM = /(?:^|\n)[ \t]*expected_resources:\s*(\[[^\]]*\]|\n(?:[ \t]*(?:-[ \t]*.+|\[\s*\])\n?)+)/.exec(block);
  const resources = [];
  if (resM) {
    for (const m of resM[1].matchAll(/-[ \t]*["'`]?([^\n"'`]+?)["'`]?\s*(?:\n|$)/g)) resources.push(m[1].trim());
  }
  const blindM = /(?:^|\n)[ \t]*blindToRouterKeywords:\s*(true|false)/.exec(block);
  const gold = {
    expected_intent: intentM ? intentM[1].trim() : null,
    expected_resources: resources,
  };
  if (blindM) gold.blindToRouterKeywords = blindM[1] === 'true';
  return gold;
}

function replayCorpus({ skillRoot, skillId }) {
  const { scenarios } = loadPlaybookScenarios({ skillRoot });
  const rows = [];
  const ordered = [...scenarios].sort((a, b) => String(a.scenarioId).localeCompare(String(b.scenarioId)));
  for (const sc of ordered) {
    const gold = rawGold(skillRoot, sc.source.featureFile);
    const replay = routeSkillResources({ skillRoot, taskText: sc.prompt || '' });
    const goldIntents = gold.expected_intent && !REJECTION.has(gold.expected_intent.toLowerCase())
      ? [gold.expected_intent] : [];
    rows.push({
      skill: skillId,
      scenarioId: sc.scenarioId,
      featureFile: sc.source.featureFile,
      prompt: sc.prompt,
      gold,
      replay: {
        intents: replay.intents,
        resources: replay.resources,
        scores: replay.scores,
        surface: replay.surface || null,
        routeTelemetry: replay.routeTelemetry,
      },
      intentMatch: setEq(replay.intents, goldIntents),
      resourceMatch: setEq(replay.resources, gold.expected_resources),
    });
  }
  return rows;
}

function main() {
  const args = require(path.join(HARNESS, '_args.cjs')).parse(process.argv.slice(2));
  const tag = args.tag || 'post-ws2';
  const outDir = path.resolve(args.out || path.resolve(__dirname, '..', 'regression'));
  const capturedAt = new Date().toISOString();
  const comparator = 'intent: exact set vs gold (none/defer/unknown -> empty set); resources: exact set vs expected_resources as authored';

  const hubRows = replayCorpus({ skillRoot: HUB_ROOT, skillId: 'mcp-tooling' });
  const hub = {
    summary: {
      capturedAt,
      tag,
      replayEngine: 'router-replay.cjs routeSkillResources (deterministic, hub-router.json projection)',
      comparator,
      scenarioCount: hubRows.length,
      intentMatches: hubRows.filter((r) => r.intentMatch).length,
      resourceMatches: hubRows.filter((r) => r.resourceMatch).length,
    },
    rows: hubRows,
  };
  fs.writeFileSync(path.join(outDir, `${tag}-replay-hub.json`), JSON.stringify(hub, null, 1) + '\n');

  const packetRows = [];
  const perPacket = {};
  for (const packet of PACKETS) {
    const rows = replayCorpus({ skillRoot: path.join(HUB_ROOT, packet), skillId: packet });
    packetRows.push(...rows);
    perPacket[packet] = {
      scenarios: rows.length,
      intentMatches: rows.filter((r) => r.intentMatch).length,
      resourceMatches: rows.filter((r) => r.resourceMatch).length,
    };
  }
  const packets = {
    summary: {
      capturedAt,
      tag,
      comparator,
      scenarioCount: packetRows.length,
      intentMatches: packetRows.filter((r) => r.intentMatch).length,
      resourceMatches: packetRows.filter((r) => r.resourceMatch).length,
      perPacket,
    },
    rows: packetRows,
  };
  fs.writeFileSync(path.join(outDir, `${tag}-replay-packets.json`), JSON.stringify(packets, null, 1) + '\n');

  process.stdout.write(`hub: ${hub.summary.intentMatches}/${hub.summary.scenarioCount} intent, ${hub.summary.resourceMatches}/${hub.summary.scenarioCount} resource\n`);
  process.stdout.write(`packets: ${packets.summary.intentMatches}/${packets.summary.scenarioCount} intent, ${packets.summary.resourceMatches}/${packets.summary.scenarioCount} resource\n`);
}

main();
