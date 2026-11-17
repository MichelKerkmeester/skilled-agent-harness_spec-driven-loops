#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');

const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const configPath = path.join(base, 'deep-review-config.json');
const raw = fs.readFileSync(configPath);
const config = JSON.parse(raw);
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

const registry = {
  sessionId: config.sessionId,
  generation: config.generation,
  lineageMode: config.lineageMode,
  openFindings: [],
  resolvedFindings: [],
  repeatedFindings: [],
  dimensionCoverage: { correctness: false, security: false, traceability: false, maintainability: false },
  findingsBySeverity: { P0: 0, P1: 0, P2: 0 },
  openFindingsCount: 0,
  resolvedFindingsCount: 0,
  convergenceScore: 0.0,
};
fs.writeFileSync(path.join(base, 'deep-review-findings-registry.json'), JSON.stringify(registry, null, 2) + '\n');

const targetTypes = { files: 'file', file: 'file', directory: 'directory', 'spec-folder': 'directory', track: 'directory', repository: 'repository' };
const lineageModes = { new: 'fresh', fresh: 'fresh', restart: 'restart', resume: 'resume' };
const event = {
  stem: 'deep_review.run_initialized',
  scope: { runId: config.sessionId, sessionId: config.sessionId, generation: Number(config.generation) || 1 },
  data: {
    target: {
      targetId: 'review-target',
      targetType: targetTypes[config.reviewTargetType] || 'artifact',
      artifactRef: 'deep-review-config.json#reviewTarget',
      sourceDigest: sha(String(config.reviewTarget)),
      contentDigest: sha(raw),
    },
    lineageMode: lineageModes[config.lineageMode] || 'fresh',
    maxIterations: Number(config.maxIterations),
    convergencePolicyVersion: 'convergence-policy@' + ((config.antiConvergence && config.antiConvergence.convergenceMode) || 'default'),
    reviewModeContractDigest: sha(fs.readFileSync('.skilled/commands/deep/assets/deep-review.yaml')),
    initialReleaseReadinessState: 'not-assessed',
    topic: config.topic,
  },
};
fs.writeFileSync(path.join(base, 'run-open.event.json'), JSON.stringify(event) + '\n');
console.log('wrote registry + run-open event');
