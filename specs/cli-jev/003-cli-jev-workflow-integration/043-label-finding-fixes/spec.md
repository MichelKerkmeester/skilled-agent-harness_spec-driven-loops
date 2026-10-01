---
title: "Feature Specification: Phase 43: label-finding-fixes"
description: "Phase 042's labels exposed three tool defects: 027's gold derivation misses citations, 003's goal-core verifier reads its own clamp as truncation, and 006's lint catches 1 of 75 rule 5 failures. This phase fixes the first two and builds 006's planned model arm."
trigger_phrases:
  - "label finding fixes"
  - "stop rater gold fix"
  - "goal verifier clamp fix"
  - "goal lint model arm"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 43: label-finding-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-01 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 43 of 43 |
| **Predecessor** | 042-label-drafting-and-confirmation |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: the 027 suite passes more than 36 tests, the goal suites pass with 0 failing, the 006 scorer suite passes its stub-`jev` cases, the cross-family review leaves no open P0 or P1, and `validate.sh --strict` passes on this phase and the parent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 43** of the cli-jev workflow integration specification.

**Scope Boundary**: three code changes, each in the file that owns the defect, plus their tests and the docs that describe the changed behavior. The operator chose the scope on 2026-10-01.

**Dependencies**:
- Phase 042's decisions logs, which record the defects (`../042-label-drafting-and-confirmation/scratch/evidence/labels/`).
- 006's `spec.md` REQ-012 and REQ-013, which define the model arm.

**Deliverables**:
- 027: `score-stop-rater.cjs` counts every cited file, and its lineage filter reads `antiConvergence.convergenceMode`.
- 003: `goal-core.cjs` judges the tail of long verifier evidence.
- 006: `score-goal-lint.cjs` gains a Jev arm and a Deem arm.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 042 labeled every fillable gate and found three tool defects. 027's gold derivation reads only a finding's singular `source` string, so it disagreed with the reads on 3 of 5 lineages. 003's heuristic verifier keeps the first 1,200 characters of a transcript, appends `...` and then reads that `...` as truncation, so every long turn comes back unclear. 006's lexical lint caught 1 of 75 rule 5 failures, because most of them depend on meaning.

### Purpose
Each defect is fixed in the file that owns it, with tests that fail on the old behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 027: count files from `source`, `sources` and `evidence`, drop trailing line references, skip tool entries, and read `convergenceMode` under `antiConvergence`.
- 003: judge the last 1,200 characters of a long transcript in goal-core with no added marker.
- 006: the Jev half and the Deem half of the model arm REQ-012 and REQ-013 define, tested against stub binaries.

### Out of Scope
- The OpenCode plugin's copy of the clamp (`.opencode/plugins/opencode-goal.js`). The operator scoped the fix to goal-core.
- 035's lexical screen. It is the baseline Jev was measured against.
- Tuning the 006 lint's regex. Its rule 5 patterns are shared with `check-goal.cjs`.
- A live 006 run. It needs the operator's separate yes.
- New reads for 027's three new sample lineages. The fix changed the sample, and new reads are labeling work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | Modify | `findingSources()` and the `isMovable()` fallback |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | Modify | Five cases for the two rules |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` | Modify | The source and filter rules |
| `.skilled/hooks/goal/lib/goal-core.cjs` | Modify | `verifyGoalHeuristic()` judges the tail |
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modify | Four tail cases |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Modify | One assertion that pinned the defect |
| `.skilled/hooks/goal/README.md` | Modify | The verification paragraph |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | Modify | The Jev and Deem arms |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` | Modify | Stub-backend cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | 027's gold counts a file cited through `source`, `sources` or `evidence` once, ignores a new line range of a file already cited and skips tool entries such as `Glob:...` |
| REQ-002 | goal-core's heuristic verifier never reports its own cut as truncation, and still reports a transcript whose own last characters are `...` |
| REQ-003 | 006's scorer output and exit stay byte-identical without `--jev` or `--deem`, and a stub binary logs no call |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | 027's lineage filter treats `antiConvergence.convergenceMode: "off"` as forced |
| REQ-005 | 006's Jev arm follows 006 REQ-012 and REQ-013: the gate lines, two `noul` questions per labeled row over 3 reruns, and a keep verdict per rule only on an F1 gain of at least 0.2, precision of at least 0.8 and flips of at most 0.10 |
| REQ-006 | 006's Deem arm follows the Deem half of 006 REQ-012 and never starts the server |
| REQ-007 | One DeepSeek V4.1 Flash review covers the 027, 003 and 006 changes. P0 and P1 are fixed and P2 recorded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each changed suite passes from the final state with more tests than its baseline and 0 failing.
- **SC-002**: The goal-core fix answers `met` on none of the 47 rows phase 042 labeled `not_met`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The goal-core verifier runs on every runtime but OpenCode, so a long turn can now pass as met | Med | The labeled set's 47 `not_met` rows stay not met. Blocking language in the tail still answers `not-met` |
| Risk | 027's fixes change its sample, so three new lineages carry no read | Med | Recorded in `goal.md`. The label gate stops any arm until those reads exist |
| Dependency | Luna 6 max and SWE 2 max write the code | Low | The session reruns every suite before a commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: 027's census and 006's default run make zero model calls.
- **NFR-P02**: 006's Jev arm prints its planned calls before the first billed call.

### Security
- **NFR-S01**: No script holds, reads or prints a credential.
- **NFR-S02**: Live run output stays outside the repository.

### Reliability
- **NFR-R01**: A failed backend gate prints one skip line and exits 0.
- **NFR-R02**: Exit 3 from a Jev call after the gate stops the arm with `jev arm stopped: key rejected`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a finding with no source string or array has no source and gives no gold.
- Maximum length: a transcript at or under 1,200 characters is judged whole.
- Invalid format: a non-string entry in `sources` or `evidence` is skipped.

### Error Scenarios
- External service failure: a Jev or Deem gate that fails prints its skip line and leaves the lexical output unchanged.
- Network timeout: a timed-out call is recorded in `calls.jsonl` and counts as unmeasured.
- Concurrent access: not applicable. Each run writes only its own `--out` folder.

### State Transitions
- Partial completion: a stopped arm still writes `report.json` with the stop line.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Nine files across three skills, about 600 lines with tests |
| Risk | 12/25 | goal-core runs on every runtime but OpenCode |
| Research | 4/20 | Each defect and its fix were recorded in phase 042 |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator chose each fix on 2026-10-01.
<!-- /ANCHOR:questions -->

---
