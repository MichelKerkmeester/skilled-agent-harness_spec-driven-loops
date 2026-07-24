#!/usr/bin/env node
'use strict';

// Negative fixtures for the non-hub single-skill-router ineligibility policy.
//
// The seven-hub compiled-routing activation path is eligible only for an id that
// is BOTH (a) a key in the compiled-route engine map (HUB_CHILD) and (b) backed
// by a rollout child carrying activation/acceptance.json (the accepted compiled
// generation the fenced CAS binds against). The non-hub single-skill routers use
// a different archetype — a fenced-manifest / run-drill shadow with NO
// acceptance.json — and are ineligible by design.
//
// This proves each of the five named candidates stays ineligible, and — as a
// control — that the real seven hubs stay eligible, so the check is not
// trivially always-false. See references/non-hub-router-eligibility-policy.md.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const IMPL_ROOT = path.resolve(__dirname, '..', '..', '..');
const { HUB_CHILD } = require(path.join(IMPL_ROOT, '011-runtime-engine', 'lib', 'compiled-route.cjs'));
const FLIP_SERVING = path.join(IMPL_ROOT, '011-runtime-engine', 'lib', 'flip-serving.cjs');

// The eligibility discriminator the drivers enforce implicitly.
function isCompiledRoutingEligible(id) {
  if (!(id in HUB_CHILD)) return { eligible: false, reason: 'not a compiled-routing hub (absent from HUB_CHILD)' };
  const acc = path.join(IMPL_ROOT, HUB_CHILD[id], 'activation', 'acceptance.json');
  if (!fs.existsSync(acc)) return { eligible: false, reason: 'no activation/acceptance.json (non-hub archetype)' };
  return { eligible: true, reason: 'hub archetype: in HUB_CHILD + acceptance.json present' };
}

// The five non-hub candidates. Four are real, built shadow-only children under
// 009-non-hub-rollout/; mcp-code-mode is a fifth candidate with NO rollout child
// and NO activation manifest (unonboarded — must NOT be invented as 005-…).
const NON_HUBS = [
  { id: 'sk-git', child: '009-non-hub-rollout/001-sk-git', real: true },
  { id: 'system-code-graph', child: '009-non-hub-rollout/002-system-code-graph', real: true },
  { id: 'system-skill-advisor', child: '009-non-hub-rollout/003-system-skill-advisor', real: true },
  { id: 'system-spec-kit', child: '009-non-hub-rollout/004-system-spec-kit', real: true },
  { id: 'mcp-code-mode', child: null, real: false },
];

let pass = 0;
let fail = 0;
function check(label, cond, detail) {
  if (cond) { pass += 1; process.stdout.write(`  PASS  ${label}${detail ? ` — ${detail}` : ''}\n`); }
  else { fail += 1; process.stdout.write(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}\n`); }
}

process.stdout.write('\n[REQ-005] Non-hub single-skill routers are ineligible by design\n');

for (const c of NON_HUBS) {
  const elig = isCompiledRoutingEligible(c.id);
  check(`${c.id}: NOT compiled-routing-eligible`, elig.eligible === false, elig.reason);
  check(`${c.id}: absent from HUB_CHILD engine map`, !(c.id in HUB_CHILD));

  // flip-serving.cjs must refuse the id at the usage gate (not in HUB_CHILD).
  let rejected = false;
  try {
    execFileSync('node', [FLIP_SERVING, '--hub', c.id], { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch { rejected = true; }
  check(`${c.id}: flip-serving.cjs refuses it (usage gate)`, rejected);

  if (c.real) {
    const childActivation = path.join(IMPL_ROOT, c.child, 'activation');
    check(`${c.id}: rollout child has NO acceptance.json (non-hub archetype)`,
      !fs.existsSync(path.join(childActivation, 'acceptance.json')));
    const manifestPath = path.join(childActivation, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      check(`${c.id}: manifest stays legacy + shadow-only`,
        m.servingAuthority === 'legacy' && m.shadowOnly === true,
        `serving=${m.servingAuthority} shadowOnly=${m.shadowOnly}`);
    } else {
      check(`${c.id}: manifest present`, false, 'missing manifest.json');
    }
  } else {
    // mcp-code-mode: zero rollout/activation presence; must not be invented.
    check(`${c.id}: has NO 009 rollout child`,
      !fs.existsSync(path.join(IMPL_ROOT, '009-non-hub-rollout', '005-mcp-code-mode')));
    check(`${c.id}: no 005-mcp-code-mode folder anywhere in the impl tree`,
      !dirExistsNamed(IMPL_ROOT, '005-mcp-code-mode'));
  }
}

// Positive control: the seven real hubs stay ELIGIBLE, so the check is not
// trivially rejecting everything.
process.stdout.write('\n[control] the seven real hubs stay compiled-routing-eligible\n');
for (const hub of Object.keys(HUB_CHILD)) {
  check(`${hub}: eligible (in HUB_CHILD + acceptance.json)`, isCompiledRoutingEligible(hub).eligible === true);
}

function dirExistsNamed(root, name) {
  // Shallow scan of the impl tree's phase dirs for a folder of this exact name.
  const stack = [root];
  let steps = 0;
  while (stack.length && steps < 5000) {
    steps += 1;
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name === name) return true;
      if (e.name === 'node_modules' || e.name === '.git') continue;
      stack.push(path.join(dir, e.name));
    }
  }
  return false;
}

process.stdout.write(`\nNON-HUB FIXTURES RESULT: ${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
