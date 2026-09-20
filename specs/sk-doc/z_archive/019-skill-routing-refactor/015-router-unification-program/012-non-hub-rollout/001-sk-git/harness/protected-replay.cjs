'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { REPO_ROOT } = require('./support.cjs');

const benchmarkRoot = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const { routeSkillResources } = require(path.join(benchmarkRoot, 'router-replay.cjs'));
const { evaluateRouteGold } = require(path.join(benchmarkRoot, 'score-skill-benchmark.cjs'));

const request = JSON.parse(fs.readFileSync(0, 'utf8'));
let results;
if (request.action === 'route-batch') {
  results = request.items.map((item) => routeSkillResources(item));
} else if (request.action === 'score-batch') {
  results = request.items.map((item) => evaluateRouteGold(item));
} else {
  throw new Error(`unsupported protected replay action: ${request.action}`);
}
process.stdout.write(`${JSON.stringify(results)}\n`);
