---
title: "Feature Specification: Phase 17: heal-cli-and-compat-yaml-simplification"
description: "Apply the four recommendations of the overengineering research on phase 16: pin the refusal order with a direct test, drop the lane-mode CLI's --mode and --json flags, and merge the compat action's two failed-step fields."
trigger_phrases:
  - "heal cli and compat yaml simplification"
  - "remove lane modes mode flag"
  - "remove lane modes json flag"
  - "merge step failure fields"
  - "sort refusals order test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: heal-cli-and-compat-yaml-simplification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-research-recommendations |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row Met, and `validate.sh --strict` passes on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the spec-folder tooling packet. It applies the recommendations of the overengineering research recorded in `../016-research-recommendations/research/research.md`.

**Scope Boundary**: The healer's `--lane-modes` command line, the `sortRefusals` order in `upgrade-legacy.mjs`, the compat action's `phase_4_move` failure fields, and the tests and README lines that name them. The lane modes themselves and `upgrade-legacy`'s behavior do not change.

**Dependencies**:
- Phase 16 is shipped to main, so the code under change is fixed.
- The operator confirmed on 2026-10-09 that no script outside this repository passes `--mode` or `--json`.

**Deliverables**:
- A direct order test for `sortRefusals`.
- `heal-spec-docs.cjs --lane-modes` without `--mode` and `--json`.
- One `on_step_failure` field in the compat action.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase 16 build carries three optional surfaces that no requirement asks for. The lane-mode CLI accepts a repeatable `--mode` that no caller passes and a `--json` switch whose only use was one evidence run. The compat action states its failed-step rule twice under two names. The refusal sort that keeps `upgrade-baseline.json` stable has no test that checks its order, only one that checks two runs agree.

### Purpose
Remove the three surfaces with their tests and docs, and pin the refusal order first so the removals cannot change it unnoticed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `upgrade-legacy.vitest.ts` case asserting the exact `refusals` array order.
- Removing the `--mode` parsing and its unknown-mode error from `runLaneModesCli`, keeping the `runLaneModes(options.modes)` seam the tests use.
- Removing the `--json` branch from `runLaneModesCli`, after the corpus two-pass check is shown to work from the plain output.
- Folding `step_failure` into `on_step_failure` in the compat action, so one field carries every clause.

### Out of Scope
- The `--roots` and `--folder` flags. The research did not examine them and AC-019 of phase 15 uses `--roots`.
- Editing phase 15's recorded AC-019 evidence. It records a run made with `--json` before the flag was removed, and it stays as the record of that run.
- Exporting `sortRefusals`. The test reads the order through `upgrade-baseline.json`, so no new export is needed.
- Any change to `upgrade-legacy.mjs`'s production code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Add the refusal-order case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Drop `--mode` (lines 1363-1379 and the `modes` pass at 1390) and `--json` (lines 1362 and 1392-1395), and the usage comment at line 23 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts` | Modify | Drop the `--json` assertions (578-585) and the unknown-mode assertions (587-591), keeping the dry-run case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Drop the flags from line 113 and the usage line at 271 |
| `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` | Modify | Fold line 125 into line 126 |
| `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` | Modify | Read every failed-step phrase from `on_step_failure` (lines 823-833) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A test fails if `sortRefusals` stops ordering refusals by lane-mode order, then document, then reason |
| REQ-002 | `heal-spec-docs.cjs --lane-modes` parses no `--mode` flag, and `runLaneModes(packet, { modes })` still narrows the modes for its callers |
| REQ-003 | `heal-spec-docs.cjs --lane-modes` has no `--json` branch, and the corpus two-pass check of phase 15 can be run from its plain output |
| REQ-004 | The compat action's `phase_4_move` has one failed-step field, `on_step_failure`, carrying every clause the two fields carried |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | No usage line, README line or test still names a removed flag or field |
| REQ-006 | The CLI test suite shows no failure beyond the count before this phase |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The removals shrink `runLaneModesCli` by about 25 lines and the YAML by one line, with no lane-mode behavior changed.
- **SC-002**: A repo-wide search finds `--mode`, `--json` or `step_failure` only where another tool owns them.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An old habit passes `--mode <name> --apply` after the removal | Med | The flag is then ignored and all five modes run. Every mode acts only on proof, so this is the default run, not a wrong one. No guard is added, because no caller exists |
| Risk | The plain output lacks a count the two-pass check needs | Med | Phase 3 runs the check from plain output before the branch is removed, and stops if a count is missing |
| Risk | Something that runs the compat action reads the two fields differently | Low | A search finds only the YAML and its test reading either name |
| Dependency | Phase 16 on main | Low | Shipped and green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No change. The removed code runs only on parsing.

### Security
- **NFR-S01**: No change to what the healer may write. The `--apply` gate and every mode's proof checks stay as they are.

### Reliability
- **NFR-R01**: A second run over a repaired packet still changes nothing, as `all-modes-sequence` asserts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No refusals: `recordFindings` skips the sort, so the order test needs refusals from at least two modes and two documents.
- Emission order equals sorted order: a fixture like that cannot tell a working sort from none. The fixture must make the two differ.

### Error Scenarios
- `--mode` passed after removal: ignored, all modes run, as noted under Risks.
- `--json` passed after removal: ignored, plain output printed.

### State Transitions
- Phase 3 finds a count missing from plain output: phase 3 stops and keeps `--json`, and the row records why.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 6 files, about 60 lines changed |
| Risk | 6/25 | Removes two CLI flags; no outside caller per the operator |
| Research | 2/20 | Done in phase 16's research |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator answered the research's caller question on 2026-10-09.
<!-- /ANCHOR:questions -->

---
