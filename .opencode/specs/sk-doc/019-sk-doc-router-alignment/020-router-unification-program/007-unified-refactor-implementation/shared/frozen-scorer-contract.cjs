#!/usr/bin/env node
'use strict';

// One authoritative frozen-scorer digest contract for the compiled-routing program.
//
// The three benchmark-scorer files are frozen; their SHA-256 digests are pinned
// HERE so every activation and serving gate rejects a drifted scorer from a single
// source, rather than each lifecycle writer embedding its own copy that could
// rotate out of sync. This module only reads and hashes the scorer — it never
// edits it.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PINNED_SCORER_DIGESTS = Object.freeze({
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
});

function scorerDir(repoRoot) {
  return path.join(repoRoot, '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark');
}

// Re-hash the three frozen files under repoRoot and throw on any drift. `phase`
// names the caller so each gate keeps a phase-specific failure message. Returns
// the observed digests (used in the activation audit record).
function assertScorerFrozen(repoRoot, phase) {
  const dir = scorerDir(repoRoot);
  const observed = {};
  for (const [name, pinned] of Object.entries(PINNED_SCORER_DIGESTS)) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, name))).digest('hex');
    observed[name] = actual;
    if (actual !== pinned) {
      throw new Error(
        `FROZEN SCORER DRIFT: ${name}\n  pinned:   ${pinned}\n  observed: ${actual}\n` +
          `The shared benchmark scorer must never change during ${phase || 'this phase'}.`,
      );
    }
  }
  return observed;
}

module.exports = { PINNED_SCORER_DIGESTS, scorerDir, assertScorerFrozen };
