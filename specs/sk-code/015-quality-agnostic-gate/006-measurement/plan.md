---
title: "Implementation Plan: Phase 6: measurement"
description: "Adds seven playbook scenarios, three routing canaries and a measurement record for the quality gate. The report folder waits on the renderer decision in ADR-008."
trigger_phrases:
  - "measurement plan"
  - "quality gate measurement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 6: measurement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON. The measured runner is Node (`quality-gate.cjs`). The hygiene engine is Python 3 |
| **Framework** | None |
| **Storage** | Files only. The measurement record is `evidence/measurement.json` |
| **Testing** | Compiled-route replays, built-in runner measurements over fixtures, and a transcript scan for passing claims |

### Overview
This phase writes the scenarios and canaries that prove the gate on real routing and changed files, then records the measured catch rate, misses, false positives, wall time and intent recall. It depends on phases 001 to 005 landing first (see Dependencies). The report folder waits on the renderer decision in ADR-008.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 001 to 005 are Complete. `rg -l 'Complete' specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md | wc -l` prints `5`.
- [x] Each design 6.5 target has a measurement field in `measurement.json` (see Step 3).
- [x] OQ-1 is answered as ADR-008 option (a), so tasks T023 to T025 ran.

### Definition of Done
- [x] Seven scenarios and three canaries exist, and every AC row in `acceptance-criteria.md` is Met.
- [x] `measurement.json` holds every target value, with misses and false positives named. There were none, so `misses` reads `[]` and both false-positive keys read `0`.
- [x] The report folder holds seven files, rendered from the record with no operator blocker left.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a measurement package. It has no runtime component. It records numbers from the phase 002 runner and from the compiled route front door.

### Key Components
- **Playbook scenarios (CQ-002 to CQ-008)**: Each one names a fixture or a prompt, the expected output and the pass and fail rule.
- **Routing canaries (CB-CR-006 to CB-CR-008)**: Each one names a prompt and the route the design expects.
- **Measurement record (`evidence/measurement.json`)**: The one machine record every number reads from.
- **Report folder**: The existing seven-file set under the quality benchmark reports (ADR-005), rendered from the measurement record by `benchmark/scripts/render-report.cjs`.

### Data Flow
Fixture builder (phase 002) to `quality-gate.cjs --format json` to the measurement record. The record feeds the report's `source.md` and `README.md`. The compiled route front door answers the canary prompts and the four intent prompts. Live runs save their transcripts to `evidence/transcripts/`, and the transcript scan writes its count into the record.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. Reason: Phase 6 fixes no defect and changes no producer. A defect that measurement finds goes to the phase that owns the surface, as a new change (spec.md Scope Boundary).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and task state. Step 1 writes the scenarios, Step 2 writes the canaries, and Step 3 records the measurements and the report.

### Step 1: Write the seven playbook scenarios and index them

Write CQ-002 to CQ-008 under `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/`, one file each, following the CQ-001 layout. Add the seven rows to the root index.

Acceptance: seven files exist with ids CQ-002 to CQ-008, each with a `### Pass / Fail` section, and the root index lists all seven in section 7.
Verify: `rg -l '^id: CQ-00[2-8]$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate | wc -l` prints `7`.

### Step 2: Write the three compiled-routing canaries

Write CB-CR-006 to CB-CR-008 under `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/`, following the shape of `surface-alone-ci-compiled-routing.md`. The canaries use the three prompts design 6.5 lists.

Acceptance: CB-CR-006 to CB-CR-008 each replay as a single route to `sk-code-quality`, and CB-CR-007 also replays at stage two with `CI_WORKFLOW` and the four `sk-code-ci` references.
Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents"` prints `"selectionKind":"single"` and `sk-code-quality`.

### Step 3: Record the measurements and write the report

Build each fixture in a temporary repository with the phase 002 builder. Run the built-in runner with `--format json`. Write each result into `evidence/measurement.json`. Save each live CQ transcript to `evidence/transcripts/`. Write the report folder only after OQ-1 is answered.

Acceptance: `measurement.json` holds the catch figures, the false positives, the timing, the intent figures, the transcript count and the read-only invariant, and the report folder holds seven files.
Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').catch"` prints `{ seeded: 7, matched: 7, misses: [] }`.

#### Measurement record shape

The record holds these fields. Each field is set by one task in `tasks.md`.
- `commit`: the commit SHA the run measured. Evidence is pinned to a SHA, not to a moving range.
- `root`: `.skilled/skills/sk-code/sk-code-quality`, the repository-relative target root (ADR-005).
- `corpus`: the list of fixtures and prompts, with their counts.
- `catch`: `{ seeded, matched, misses }` over fixture F01.
- `false_positives`: `{ f02_findings, f01_unseeded }`.
- `timing`: `{ files, builtin_only, runs_ms, max_ms, target_ms }`, with `target_ms` set to 2000.
- `intent`: `{ prompts, matched, targeted }`, with `prompts` set to 4 and `targeted` set to `false`.
- `pass_claims`: the count from the transcript scan.
- `readonly_invariant`: `true` when every fixture snapshot is unchanged.
- `runs`: one entry per run with its gate value.

#### Judgement calls in this step

- The 50-file timing set is not in design 6.2. It is built at run time in a temporary repository, as fixture F01 is, and it is never committed. The reversal is to add it as F19 in the fixture table.
- Built-in checks means the runner's own checks on a full run. The timing repository holds no `.sk-code/quality.json`, so no configured check runs, and it declares no `generated` row, so the dist checker does not run. `--no-run` is left out because it also stops both built-in checks.
- The four intent prompts are the CQ-001 prompt and the three canary prompts. A match means the compiled route target equals the expected intent in the prompt's scenario or canary.
- "Real changes" in design 7 Phase 6 becomes fixtures in temporary repositories, because the playbook rule says scenarios write nothing (REQ-018).

#### Blocker for Step 3

The report folder could not be rendered under the existing rules until ADR-008 was decided. Resolved 2026-10-26 as ADR-008 option (a), which gives the phase its own renderer, so Step 3 closed with the measurement record and the seven-file folder both written.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. Phase 6 adds no code (REQ-015) | None |
| Integration | Compiled-route replays of CB-CR-006 to CB-CR-008. Built-in runner runs over F01, F02, F05, F06 and the 50-file set | `node .skilled/bin/compiled-route.cjs`, `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` |
| Manual | Operator runs CQ-002 to CQ-008 live and saves each transcript | The quality mode, through the agent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-honest-checker` (narrowed patterns, URL spans, issue rule, docstrings) | Internal, earlier phase | Green (Complete) | F01 recall and F02 zero findings cannot be measured |
| `002-builtin-runner` (`quality-gate.cjs`, sensors, envelope, fixture builder) | Internal, earlier phase | Green (Complete) | No measurement can run |
| `003-config-and-doctor` (configured required check, `SKIPPED_ABSENT`) | Internal, earlier phase | Green (Complete) | CQ-006 and F06 cannot run |
| `004-doctrine` (Iron Law 3, SKILLED-only checklist) | Internal, earlier phase | Green (Complete) | CQ-003 to CQ-005 test the wrong text |
| `005-consumers-and-routing` (verify reader, restraint keywords, F15, canary routes) | Internal, earlier phase | Green (Complete) | CQ-007, CQ-008 and the canaries cannot pass their route checks |
| Compiled route front door (`.skilled/bin/compiled-route.cjs`, `compiled-route-status.cjs`) | Internal, existing | Green | Canary replays cannot run |
| Live D4 runner and renderer (retired, `.skilled/skills/sk-code/benchmark/README.md:14,16`) | External to this packet | Green (ADR-008 option a) | Report folder blocked (OQ-1, ADR-008) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A Phase 6 file breaks the playbook index count, or a canary replays to a route other than its expected one.
- **Procedure**: Revert the Phase 6 commit with `git revert` on that commit. Phase 6 adds no code, so no runtime state changes. A report folder is never overwritten, so a bad run is superseded by a new folder and its predecessor stays on disk.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-honest-checker -> 002-builtin-runner -> 003-config-and-doctor -> 004-doctrine -> 005-consumers-and-routing -> 006-measurement
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-honest-checker | None | 002 |
| 002-builtin-runner | 001 | 003, 006 |
| 003-config-and-doctor | 002 | 004, 006 |
| 004-doctrine | 003 | 005, 006 |
| 005-consumers-and-routing | 004 | 006 |
| 006-measurement | 001 to 005 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (T001 to T003) | Low | About 30 minutes |
| Scenarios and canaries (Steps 1 and 2) | Medium | 3 to 4 hours |
| Measurement record (Step 3, without the report) | Medium | 2 to 3 hours |
| Report folder (T023 to T025) | High | Unknown until OQ-1 is answered |
| **Total** | | **6 to 8 hours of work, plus the OQ-1 wait (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

N/A. Reason: Phase 6 ships no deployable service and changes no data. Rollback is the revert in section 7.
<!-- /ANCHOR:enhanced-rollback -->
