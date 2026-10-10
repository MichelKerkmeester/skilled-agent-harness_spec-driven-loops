#!/usr/bin/env node
// Builds the deep_review.run_initialized ledger event for this lineage and writes it
// to events/run-initialized.event.json so the append gateway can consume it.
'use strict';
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');

const lineageDir = path.resolve(process.argv[2]);
const repoRoot = path.resolve(process.argv[3]);
const configPath = path.join(lineageDir, 'deep-review-config.json');
const workflowPath = path.join(repoRoot, '.skilled/commands/deep/assets/deep-review-auto.yaml');

const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const raw = fs.readFileSync(configPath);
const config = JSON.parse(raw.toString('utf8'));
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
    reviewModeContractDigest: sha(fs.readFileSync(workflowPath)),
    initialReleaseReadinessState: 'not-assessed',
  },
};

const outPath = path.join(lineageDir, 'events', 'run-initialized.event.json');
fs.writeFileSync(outPath, JSON.stringify(event), 'utf8');
console.log('wrote ' + outPath);
