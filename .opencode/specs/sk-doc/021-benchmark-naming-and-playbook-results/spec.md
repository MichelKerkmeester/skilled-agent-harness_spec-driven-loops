---
title: "Feature Specification: One dated benchmark convention and a home for playbook results"
description: "Converge 78 benchmark run folders across four incompatible naming styles onto a single dated grammar, and give manual-testing-playbook runs a curated report folder beside other benchmarks, with the six-file report shape and an auto-appended index."
trigger_phrases:
  - "benchmark naming convention"
  - "playbook results storage"
  - "dated benchmark folder"
  - "benchmark reports folder"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-benchmark-naming-and-playbook-results"
    last_updated_at: "2026-07-27T09:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Opened the packet and bound the convention grammar"
    next_safe_action: "Write the convention into create-benchmark"
    blockers: []
    completion_pct: 0
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: One Dated Benchmark Convention And A Home For Playbook Results

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/021-benchmark-naming-and-playbook-results |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-27 |
| **Owner skill** | sk-doc, which owns benchmark storage shape and date naming |
| **Consumers** | system-deep-loop, which runs the benchmarks and writes the artifacts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two defects, one cause.

Manual-testing-playbook runs save **no artifact at all** on the human path. Forty skills carry a
playbook directory and none carries a results folder. The only automated path that reads a playbook is
the Lane C skill-benchmark harness, and it scores routing rather than recording scenario outcomes.

Separately, 78 benchmark run folders follow four incompatible naming styles: semantic run labels, a
purpose-and-timestamp form invented ad hoc by agents, zero-padded ordinals, and a dated MCP-promotion
form. Only the last carries a date, and it is gated behind requirements a playbook run cannot meet.
Three of the six report filenames the reference layout uses have no writer anywhere in the repo, and
two of them do not exist at all.

The shared cause is that no single grammar was ever declared. `create-benchmark` owns storage shape and
date naming, but defines a different rule per family.

### Purpose

Declare one grammar in the owning skill, unblock the validators that reject it, give playbook runs a
curated report folder with a real writer, and converge the existing tree onto it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The grammar `<YYYY-MM-DD>--<subject>--<variant>/`, declared in `create-benchmark`.
- Relaxing the run-label validators that currently reject the field separator.
- A results-storage contract for manual-testing-playbook runs, plus the writer that emits the six files.
- Scaffolding `benchmark/` and `benchmark/reports/` for newly created skills.
- Auto-appending an index row after each run.
- Renaming all 78 run folders and repairing every inbound path reference repo-wide.
- Backfilling the report files missing from the 62 folders that lack them.

### Out of Scope

- Changing what any benchmark measures. This is storage, naming and documentation only.
- Retiring the Lane C report pair or its renderer boundary.
- Restructuring the experiment workspaces beyond renaming them into the grammar.

### Files to Change

| File | Change |
|------|--------|
| `create-benchmark/SKILL.md` | Declare the grammar in the naming and storage sections |
| `create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md` | Replace the run-label table |
| `create-benchmark/scripts/archive-compiled-routing.cjs` | Relax the label validator, keep the frozen-anchor refusal |
| `create-benchmark/scripts/render-serving-snapshot.cjs` | Accept the new label shape |
| `create-manual-testing-playbook/SKILL.md` | Add the results-storage contract it lacks |
| `create-skill/scripts/init_skill.py` | Scaffold the benchmark index and reports folder |
| `system-deep-loop/.../skill-benchmark/build-report.cjs` | Emit the three missing report files |
| `system-deep-loop/.../skill-benchmark/run-skill-benchmark.cjs` | Derive a default outputs directory |
| `commands/deep/assets/deep-model-benchmark-auto.yaml` | Align its grammar rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One grammar declared in the owning skill | Both naming sections state the same rule with no per-family exception beyond the frozen anchor |
| REQ-002 | Validators accept the grammar | A field-separated label passes, dots and underscores and uppercase still fail |
| REQ-003 | The frozen anchor keeps its name | The refusal that protects it stays in force |
| REQ-004 | Playbook runs produce a durable artifact | A run with no explicit output path lands in the dated reports folder with all six files |
| REQ-005 | No fabricated evidence | Backfilled files derive only from data present in the run record, and say so when a run captured none |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Every run folder follows the grammar | All 78 renamed, the frozen anchor excepted |
| REQ-007 | No broken links after the rename | The markdown link checker reports zero broken links |
| REQ-008 | The index cannot drift again | A row is appended by the same path that writes the report |
| REQ-009 | New skills receive the structure | A newly scaffolded skill has a benchmark index and a reports folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- One grammar governs every benchmark family, with a single documented exception.
- A playbook run produces a curated report folder without the operator choosing a path.
- The link checker that gates continuous integration reports zero broken links after the rename.
- No backfilled file asserts a finding the underlying run record does not contain.
- Existing routing and benchmark suites stay green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Renaming breaks relative links that a continuous-integration job checks | Repair references repo-wide, then run the checker as the gate |
| Backfilling invites invented findings | Derive only from the run record, state plainly when nothing was captured, mark files as derived after the fact |
| A relaxed validator admits a malformed label | Keep rejecting dots, underscores and uppercase, and keep the frozen-anchor refusal |
| A bad name mapping is hard to unwind | Rename one style per commit so a single revert undoes one mapping |

**Dependencies:** the Lane C harness and its renderer, the archiver and snapshot renderer, and the
markdown link checker.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Reversibility:** every rename lands as its own reviewable commit.
- **Honesty:** a derived artifact is distinguishable from run-time output by inspection.
- **No behaviour change:** what a benchmark measures is untouched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Two runs of the same subject and variant on one day need a disambiguating suffix.
- A run whose executor identity is absent falls back to a topic slug rather than an empty field.
- Experiment workspaces carry a shape that predates the grammar, so renaming them does not make their
  contents comparable, and their index says so.
- A run record with no per-scenario failure detail yields a file that states the absence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

1. Whether the two plural benchmark roots should be singularized in this packet or deferred, given they
   carry the largest share of inbound references.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## COMPLEXITY ASSESSMENT

High. The change is conceptually small but touches three sk-doc packets, two validators, two runtime
scripts, one workflow contract, 78 folders, and several hundred inbound references across skills and
spec packets, behind a link-integrity gate that fails on any miss.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:stakeholder-matrix -->
## STAKEHOLDER MATRIX

| Stakeholder | Interest |
|---|---|
| sk-doc | Owns the convention and its templates |
| system-deep-loop | Writes the artifacts the convention governs |
| Operator | Wants playbook results saved beside other benchmarks |
<!-- /ANCHOR:stakeholder-matrix -->

---

<!-- ANCHOR:compliance-checkpoints -->
## COMPLIANCE CHECKPOINTS

- The renderer boundary holds: no rendered report is hand-authored.
- Input corpora are untouched by the rename.
- Every completion claim carries the command that proves it.
<!-- /ANCHOR:compliance-checkpoints -->

---

<!-- ANCHOR:approval-workflow -->
## APPROVAL WORKFLOW

Operator approved the grammar, the retroactive rename, repo-wide link repair including spec packets,
execution-date semantics, and backfill.
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:change-log -->
## CHANGE LOG

| Date | Change |
|---|---|
| 2026-07-27 | Packet opened with the grammar and scope bound |
<!-- /ANCHOR:change-log -->
