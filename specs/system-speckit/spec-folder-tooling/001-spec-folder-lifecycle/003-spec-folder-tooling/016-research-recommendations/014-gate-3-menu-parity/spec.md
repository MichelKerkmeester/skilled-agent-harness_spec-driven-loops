---
title: "Feature Specification: Gate 3 menu parity"
description: "Gate 3 choice C drops 'in the same track' in short presentation menus. Every Gate 3 menu will render from the same GATE_3_CHOICE_* constants and restore the phrase everywhere."
trigger_phrases:
  - "gate 3 menu parity"
  - "gate 3 choice wording consistency"
  - "render every Gate 3 menu from constants"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Gate 3 menu parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 16 |
| **Predecessor** | 013-anchor-contract-alignment |
| **Successor** | 015-lane-rules-as-heal-modes |
| **Handoff Criteria** | Every Gate 3 menu carries "in the same track", all menus render from `GATE_3_CHOICE_*` constants, and a parity test confirms compiled contracts match presentation assets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the spec folder tooling parent. The research found that option C of Gate 3, which names "a related spec folder or phase child or series parent for a different change to the same artifact as an existing packet", loses the phrase "in the same track" in 9 presentation files and 3 compiled contract files (12 total). The constants in `spec-gate-core.mjs` hold the right wording but these files diverged from them.

**Scope Boundary**: Gate 3 constants, presentation text files, compiled contracts that embed the menus, hook tests.

**Dependencies**:
- No dependencies on other phases.
- Gate 3 operators will see clearer guidance on the track boundary.

**Deliverables**:
- `GATE_3_CHOICE_RELATED` constant unchanged (already has the phrase).
- All 12 files (9 presentation + 3 compiled contracts) restored to include "in the same track".
- The 9 presentation files edited directly; the 3 deep contracts regenerated from their sources via `compile-command-contracts.cjs`.
- A parity test that confirms no file diverges from the constants.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`GATE_3_CHOICE_RELATED` in `spec-gate-core.mjs:151` reads "Use a related folder, phase child, or a series parent for a different change to the same artifact as an existing packet in the same track". But 9 presentation text files and 3 compiled contracts carry the same option without "in the same track" (12 files total). Operators see inconsistent guidance on where related work can live.

### Purpose
Ensure every Gate 3 menu, whether in a presentation file, compiled contract or test harness, renders from the same constants and shows the same wording everywhere.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Edit 9 presentation files directly to restore the phrase "in the same track" in option C.
- Regenerate 3 compiled deep contracts from their presentation sources via `compile-command-contracts.cjs`.
- Write and run a parity test that confirms every file's Gate 3 menu matches the constant wording.
- Do not modify hook tests (the byte-identity baseline pin makes changes there inadvisable).

### Out of Scope
- Changing the wording of the constants themselves.
- Reordering the options A, B, C, D.
- Changing the structure of the Gate 3 question or its bearer.
- Hand-editing compiled contracts (they are generated artifacts).
- Modifying hook test assertions (byte-identity baseline must be preserved).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/create/assets/create-feature-catalog-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/create/assets/create-skill-parent-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/create/assets/create-skill-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/deep/assets/deep-ai-council-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/commands/speckit/assets/speckit-plan-presentation.txt` | Modify | Restore "in the same track" to option C |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Read | Understand contract generation pipeline |
| New test file | Create | Parity test across all 9 presentations and 3 contracts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Primary (P0)

| ID | Requirement | Verification |
|-----|------|--------------|
| R1 | All 9 named presentation files include "in the same track" in option C | Grep each of the 9 files and confirm all contain the phrase |
| R2 | All 3 named compiled deep contracts include "in the same track" after regeneration | Regenerate contracts and grep each for the phrase |
| R3 | A parity test confirms no file diverges from the constant | Test scans all 12 files, matches against the constant, exits 0 |

### Secondary (P1)

| ID | Requirement | Verification |
|-----|------|--------------|
| P1 | The constants remain as the single source of truth | `GATE_3_CHOICE_RELATED` at spec-gate-core.mjs:151 unchanged |
| P2 | Hook tests keep their byte-identity baseline (no edit to test assertions) | Baseline hash in spec-gate-core.test.mjs:324 unchanged |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 9 named presentation files include "in the same track" in option C.
- All 3 deep contracts are regenerated from their sources and include the phrase.
- A parity test runs on all 12 files and confirms they match the constant.
- Hook test baseline hash (spec-gate-core.test.mjs:324) remains unchanged.
- The change is backward compatible and does not alter operator-visible behavior outside the updated menu text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Presentation file edits introduce syntax errors | Low | High | Edit one file, verify manually, then apply pattern to rest |
| Compiled contracts fail to regenerate due to stale source digests | Low | Med | Run `compile-command-contracts.cjs` with fresh sources, check output with drift-check |
| Parity test has false positives due to formatting | Low | Low | Define exact expected option-C string before writing test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open. Both questions were answered during the build:

- The contract regeneration ran locally before commit, and its output was checked line by line.
- Three more files carry an option C menu without the phrase: `speckit-implement.yaml:52`, `worked-examples.md:60` and `trigger-config.md:134`. They are recorded as follow-ups in implementation-summary.md, outside this phase's frozen scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: `../../014-spec-auto-healing-research/research/research.md`, section 11 row SH-14
- **Source of truth**: `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` lines 149-175
- **Parent Spec**: `../spec.md`
