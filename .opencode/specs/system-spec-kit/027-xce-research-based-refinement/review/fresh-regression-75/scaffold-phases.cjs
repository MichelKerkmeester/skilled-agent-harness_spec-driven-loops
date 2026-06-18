#!/usr/bin/env node
'use strict';
// Scaffold the 6 remediation sub-phases under 005-fresh-regression-remediation from the findings
// registry. Assigns every finding to exactly one phase by file path, emits fix-coverage.json, and
// writes Level-1 docs (spec/plan/tasks/implementation-summary + graph-metadata) per phase.
// SCAFFOLD ONLY — encodes fixes as tasks; applies nothing.
const fs = require('node:fs');
const path = require('node:path');
const REVIEW = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75';
const PARENT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation';
const PKT = 'system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation';
const reg = require(path.join(REVIEW, 'deep-review-findings-registry.json'));
const verds = require(path.join(REVIEW, 'round2', 'code-verdicts.json'));
const vm = {}; verds.forEach((o) => { vm[o.id] = o; });

const PHASES = [
  { key: '001-memory-storage-and-search', title: 'Memory Store/Search/Save Write-Path Remediation', verify: 'vitest regression test per fix; capture baseline→after delta' },
  { key: '002-daemon-launcher-lifecycle', title: 'Daemon Launcher & Lifecycle Remediation', verify: 'vitest in the isolated fake-root harness; no live recycles' },
  { key: '003-code-graph-robustness', title: 'Code-Graph Engine Robustness Remediation', verify: 'vitest per fix against a fixture graph DB' },
  { key: '004-cli-frontdoor-safety', title: 'CLI Front-Door Safety Remediation', verify: 'vitest + shell exit-code assertions across the three CLIs' },
  { key: '005-spec-folder-metadata-reconciliation', title: 'Spec-Folder Control-Metadata Reconciliation', verify: 'validate.sh --strict --recursive; description↔graph parity' },
  { key: '006-doc-truth-completion-and-mirrors', title: 'Doc-Truth, Completion-Claim & Runtime-Mirror Reconciliation', verify: 'validate.sh --strict; cross-runtime body-diff + grep checks' },
];

function assignPhase(file) {
  const f = file || '';
  if (/-cli\.ts/.test(f) || /mk-code-graph-bridge/.test(f)) return '004-cli-frontdoor-safety';
  if (/\.opencode\/bin\//.test(f) || /orphan-mcp-sweeper/.test(f) || /shared\/ipc\/socket-server/.test(f) || /deep-loop-runtime\/(scripts|tests).*fanout-run/.test(f)) return '002-daemon-launcher-lifecycle';
  if (/system-code-graph\/mcp_server\//.test(f)) return '003-code-graph-robustness';
  if (/mcp_server\/(lib\/(storage|search|feedback|causal)|handlers\/(save|pe-gating))/.test(f) || /scripts\/(memory|tests)\/generate-context/.test(f) || /system-skill-advisor\/mcp_server\/lib\//.test(f)) return '001-memory-storage-and-search';
  if (/\.opencode\/specs\/.*(description\.json|graph-metadata\.json|context-index\.md|deep-research-config\.json|p1-backlog\.json|\.config\.json)/.test(f)) return '005-spec-folder-metadata-reconciliation';
  return '006-doc-truth-completion-and-mirrors';
}
function tag(f) {
  const v = vm[f.id];
  if (v) return v.verdict === 'CONFIRMED' ? 'confirmed' : v.verdict === 'DOWNGRADED' ? 'downgraded→P2' : v.verdict === 'REFUTED' ? 'refuted-Round2 → harden-anyway' : 'unverified(parse-fail)';
  return f.severity === 'P1' ? 'asserted — fix as stated' : 'P2';
}
const oneLine = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);

// ---- assign ----
const byPhase = {}; PHASES.forEach((p) => { byPhase[p.key] = []; });
const coverage = {};
for (const f of reg.findings) {
  const ph = assignPhase(f.file);
  byPhase[ph].push(f);
  coverage[f.id] = { phase: ph };
}
// task ids per phase
for (const p of PHASES) {
  byPhase[p.key].sort((a, b) => ({ P0: 0, P1: 1, P2: 2 }[a.severity] - { P0: 0, P1: 1, P2: 2 }[b.severity]));
  byPhase[p.key].forEach((f, i) => { coverage[f.id].taskId = `${p.key.slice(0, 3)}-T${String(i + 1).padStart(3, '0')}`; });
}
// coverage assertion
const ids = Object.keys(coverage);
if (ids.length !== reg.findings.length) throw new Error(`coverage mismatch: ${ids.length} != ${reg.findings.length}`);
fs.writeFileSync(path.join(PARENT, 'fix-coverage.json'), JSON.stringify({ total: ids.length, byPhase: Object.fromEntries(PHASES.map((p) => [p.key, byPhase[p.key].length])), coverage }, null, 2));

// ---- doc templates ----
function mem(doc, keyfile, action) {
  return `_memory:
  continuity:
    packet_pointer: "${PKT}/${doc}"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded ${action} from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "${keyfile}"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []`;
}
function specMd(p, findings) {
  const p1 = findings.filter((f) => f.severity === 'P1').length;
  const reqs = findings.slice(0, 60).map((f, i) => `- **R${i + 1}** (${coverage[f.id].taskId}, ${tag(f)}) — \`${f.file}\`: ${oneLine((f.detail && f.detail.recommendation) || f.title, 200)}`).join('\n');
  return `---
title: "Feature Specification: ${p.title}"
description: "Remediation sub-phase of the 027 fresh+regression deep-review: ${findings.length} findings (${p1} P1) in this subsystem, each carried as a task with its registry recommendation. Scaffold only — no fixes applied."
importance_tier: "important"
contextType: "general"
${mem('spec.md', 'spec.md', 'sub-phase spec')}
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: ${p.title}

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (findings carried as tasks; no fixes applied) |
| **Created** | 2026-06-16 |
| **Branch** | \`system-speckit/027-xce-research-based-refinement\` |
| **Parent Spec** | ../spec.md |
| **Findings** | ${findings.length} (${p1} P1 / ${findings.length - p1} P2) |
| **Handoff Criteria** | Every listed finding fixed-or-refuted-with-reason, each code fix test-gated; ${p.verify}. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Sub-phase of \`005-fresh-regression-remediation\` (phase parent). It owns the subsystem cluster from the fresh+regression deep-review's findings registry. Per operator directive every finding is carried (refuted ones as hardening, asserted ones fix-as-stated). Source: \`../../review/fresh-regression-75/deep-review-findings-registry.json\`.

**Scope Boundary**: only findings assigned to this sub-phase by \`fix-coverage.json\`. No cross-phase edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-review surfaced ${findings.length} findings in this subsystem. Left unaddressed they ${p1 > 0 ? 'risk real defects (data integrity / lifecycle / safety) plus' : 'carry'} robustness and traceability debt. This sub-phase remediates each.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the ${findings.length} findings enumerated in tasks.md (and \`fix-coverage.json\`).
**Out of scope**: findings owned by sibling sub-phases; any change outside the cited files + their tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

${reqs}
${findings.length > 60 ? `\n- _(+${findings.length - 60} more — see tasks.md / fix-coverage.json)_` : ''}
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding resolved (fixed, or refuted-with-reason recorded in the registry).
- ${p.verify}.
- No regression to prior epic-sweep remediations; whole-gate delta reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Asserted findings may be false positives (Round-2 refuted 3/16 code candidates) — confirm against cited code before editing.
- ${p.key.startsWith('002') || p.key.startsWith('001') ? 'Touches live daemon write/lifecycle paths — use the isolated test harness, never live recycles.' : 'Doc/metadata edits must keep validate.sh --strict green.'}
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; raise per-task if a cited finding proves refuted on inspection.
<!-- /ANCHOR:questions -->
`;
}
function planMd(p, findings) {
  return `---
title: "Implementation Plan: ${p.title}"
description: "Approach for remediating this sub-phase's ${findings.length} deep-review findings: confirm-then-fix each cited location, ${p.verify}. Scaffold only."
importance_tier: "important"
contextType: "general"
${mem('plan.md', 'plan.md', 'sub-phase plan')}
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: ${p.title}

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Remediate the ${findings.length} findings in tasks.md. For each: open the cited \`file:line\`, confirm the defect, apply the registry recommendation (or record refuted-with-reason), and verify.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Capture the subsystem test baseline BEFORE edits; re-run the whole gate after each fix; report baseline→after delta.
- ${p.verify}.
- No working-tree change outside the cited files + their tests.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Each fix mirrors an existing correct pattern in a sibling module where one exists (e.g. save-lock liveness in \`generate-context.ts\`, launcher reclaim in \`mk-skill-advisor-launcher.cjs\`, causal-generation bump in \`causal-generation.ts\`) rather than inventing mechanisms.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Confirm**: re-open each cited finding; mark real vs refuted.
- **Fix**: apply recommendations P1-first, then P2; each on its own test-gated commit.
- **Verify**: ${p.verify}; update the registry finding status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

${p.key.match(/^00[1-4]/) ? 'Vitest regression test per code fix (fails on old code, passes on fix); daemon-lifecycle fixes use the isolated fake-root harness.' : 'validate.sh --strict on every touched spec folder; grep/diff checks for doc-truth and cross-runtime parity.'}
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Findings source: \`../../review/fresh-regression-75/deep-review-findings-registry.json\` + \`fix-coverage.json\`.
- ${p.key.match(/^00[1-4]/) ? 'Isolated daemon test harness for lifecycle/write-path fixes.' : 'generate-context.js / validate.sh for metadata + doc regeneration.'}
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is an isolated, test-gated commit — revert the specific commit to roll back. No data migrations; lifecycle changes validated in the harness before any deploy, so production daemons are untouched until separately recycled.
<!-- /ANCHOR:rollback -->
`;
}
function tasksMd(p, findings) {
  const rows = findings.map((f) => {
    const t = coverage[f.id].taskId;
    return `- [ ] ${t} · \`${f.file}\` — ${oneLine((f.detail && f.detail.recommendation) || f.title, 200)} _[${tag(f)}]_`;
  }).join('\n');
  return `---
title: "Tasks: ${p.title}"
description: "One task per deep-review finding in this sub-phase (${findings.length} total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
${mem('tasks.md', 'tasks.md', 'sub-phase tasks')}
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: ${p.title}

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| \`[ ]\` | Pending |
| \`[x]\` | Completed |
| \`[P]\` | Parallelizable |
| \`[B]\` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] ${p.key.slice(0, 3)}-S1 Capture the subsystem test/validation baseline.
- [ ] ${p.key.slice(0, 3)}-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

${rows}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] ${p.key.slice(0, 3)}-V1 ${p.verify}.
- [ ] ${p.key.slice(0, 3)}-V2 Whole-gate delta reported (no regressions).
- [ ] ${p.key.slice(0, 3)}-V3 Update each finding's status in the registry (fixed/refuted).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All ${findings.length} findings resolved (fixed or refuted-with-reason); verification gate green. No fixes applied in this scaffold.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: \`../../review/fresh-regression-75/deep-review-findings-registry.json\`
- Coverage: \`../fix-coverage.json\`
<!-- /ANCHOR:cross-refs -->
`;
}
function implMd(p, findings) {
  return `---
title: "Implementation Summary: ${p.title}"
description: "Planning-only status for this remediation sub-phase: ${findings.length} findings carried as tasks; no fixes applied yet."
importance_tier: "important"
contextType: "general"
${mem('implementation-summary.md', 'implementation-summary.md', 'sub-phase impl record')}
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: ${p.title}

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned — NOT yet implemented (scaffold only) |
| **Date** | 2026-06-16 |
| **Findings carried** | ${findings.length} |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing implemented yet. This sub-phase was scaffolded from \`../../review/fresh-regression-75/deep-review-findings-registry.json\`; its ${findings.length} findings are enumerated as tasks in \`tasks.md\` and indexed in \`../fix-coverage.json\`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

N/A (scaffold). Implementation proceeds per \`plan.md\`: confirm → fix → verify.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Per operator directive, every finding is carried (refuted as hardening, asserted fix-as-stated).
- Fixes mirror existing correct sibling patterns where available.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Review-side verification recorded in the registry + \`round2/code-verdicts.json\`. Implementation verification (${p.verify}) is pending; confirm via \`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict\`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Asserted findings are not individually host-verified; confirm before fixing.
- Refuted findings are carried as hardening per directive though Round-2 judged them non-bugs.
<!-- /ANCHOR:limitations -->
`;
}
function graphMeta(p, findings) {
  return JSON.stringify({
    schema_version: 1,
    packet_id: `${PKT}/${p.key}`,
    spec_folder: `${PKT}/${p.key}`,
    parent_id: PKT,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: [p.title.toLowerCase(), `${p.key} remediation`, 'fresh regression remediation sub-phase'],
      key_topics: p.key.split('-').filter((x) => !/^\d+$/.test(x)),
      importance_tier: 'important', status: 'planned',
      key_files: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'],
      entities: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'].map((d) => ({ name: d, kind: 'doc', path: d, source: 'derived' })),
      causal_summary: `Remediation sub-phase carrying ${findings.length} fresh+regression deep-review findings in the ${p.title} subsystem. Scaffold only; no fixes applied.`,
      created_at: '2026-06-16T00:00:00Z', last_save_at: '2026-06-16T00:00:00Z', save_lineage: 'graph_only',
      last_accessed_at: null, source_docs: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'],
      last_active_child_id: null, last_active_at: null,
    },
  }, null, 2) + '\n';
}

// ---- write ----
for (const p of PHASES) {
  const dir = path.join(PARENT, p.key);
  fs.mkdirSync(dir, { recursive: true });
  const F = byPhase[p.key];
  fs.writeFileSync(path.join(dir, 'spec.md'), specMd(p, F));
  fs.writeFileSync(path.join(dir, 'plan.md'), planMd(p, F));
  fs.writeFileSync(path.join(dir, 'tasks.md'), tasksMd(p, F));
  fs.writeFileSync(path.join(dir, 'implementation-summary.md'), implMd(p, F));
  fs.writeFileSync(path.join(dir, 'graph-metadata.json'), graphMeta(p, F));
}
console.log('phases written:');
PHASES.forEach((p) => console.log(`  ${p.key}: ${byPhase[p.key].length} findings`));
console.log(`coverage total: ${ids.length} (registry ${reg.findings.length})`);
