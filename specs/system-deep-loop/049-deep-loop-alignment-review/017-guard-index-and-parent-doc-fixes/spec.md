---
title: "Feature Specification: Phase 17: guard-index-and-parent-doc-fixes"
description: "Fix the three defects found while closing phase 16: the sk-code drift guard failing on generated Hermes skill copies, a trigger-index corpus rule that let fan-out lineages outside a research parent into the index, and template leftovers and an over-budget goal in this packet's own parent documents."
trigger_phrases:
  - "drift guard generated copy"
  - "trigger index lineage exclusion"
  - "parent packet template leftovers"
  - "goal durable slice budget"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: guard-index-and-parent-doc-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-iteration-state-record-contract |
| **Successor** | None |
| **Handoff Criteria** | The drift-guard wrapper exits 0, the regenerated trigger index holds no lineage path, and the parent spec and goal validate without warnings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the deep-loop alignment review, added by the operator for defects phase 16's verification surfaced.

**Scope Boundary**: The three defects named in phase 16's close-out, each fixed at its producer. Defects found while fixing them are recorded, not fixed.

**Dependencies**:
- Phase 16's verification run, which surfaced all three.

**Deliverables**:
- The dead-route check skips generated skill copies, and the Hermes plugin carries the house-style shebang.
- The trigger index prunes every fan-out lineage under `specs/`, the policy's table and documentation agree, and the index is regenerated.
- The parent spec carries no template leftover and the parent goal fits its durable-slice budget.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three checks were red or wrong for reasons unrelated to what they guard. The sk-code drift-guard wrapper failed on 929 errors, 928 of them dead-route reports against generated Hermes skill copies that carry only `SKILL.md` by design, which also buried one real finding. The committed trigger index was stale, and regenerating it as it stood would have indexed 199 containment snapshots of real documents, because the corpus pruned fan-out lineages only under a `research` parent while the runner writes them into any artifact directory. And this packet's own parent spec was largely unfilled template, while its goal's durable slice ran 992 characters past its warning budget.

### Purpose
Each check reports on what it exists to guard, and the parent documents say what is true of the packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The alignment verifier's dead-route check, its test, and the Hermes plugin's first line.
- The trigger-index corpus pruning rule, its manifest exclusion text, the parity suite's divergence table, the conventions document's divergence row, and the regenerated index with its three fixture outputs.
- The parent spec's template leftovers and the parent goal's durable slice.

### Out of Scope
- The goal template itself, whose unfilled durable slice already uses 2,644 of the 3,000-character warning budget - a template change affects every packet.
- Containment snapshots that nest other lineages' snapshots - a fan-out runner defect with its own blast radius.
- The wrapper header and the sk-code surface text that still describe a third guard the wrapper records as retired.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | Skip generated skill copies in the dead-route check |
| `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modify | Regression test for a generated copy |
| `.hermes/plugins/repo-guards/__init__.py` | Modify | House-style shebang |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modify | Prune `lineages` under `specs/` whatever the parent |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | Modify | Probes and divergence entry for the widened rule |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Section 9 divergence row |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Current corpus under the corrected rule |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Regenerate | Generator outputs beside the index |
| `specs/system-deep-loop/049-deep-loop-alignment-review/spec.md` | Modify | Template leftovers replaced |
| `specs/system-deep-loop/049-deep-loop-alignment-review/goal.md` | Modify | Durable slice within budget; deviation logged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The drift-guard wrapper exits 0 on this tree without exempting any authored file |
| REQ-002 | No fan-out lineage path under `specs/` enters the trigger index |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The corpus rule, its manifest text, the parity table and the conventions document describe the same policy |
| REQ-004 | The parent spec carries no template placeholder and the parent goal's durable slice is within its warning budget with every decision and criterion intact |
| REQ-005 | Nothing that already passed stops passing |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new test fails before its fix and passes after it.
- **SC-002**: Every suite touched by the three fixes passes after them.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Skipping generated copies hides a real dead route | Medium | The canonical `SKILL.md` each copy names is scanned by the same walk |
| Risk | The widened pruning rule drops real documents | Medium | Every one of the 380 `lineages` directories under the corpus roots was checked and all are fan-out output |
| Risk | Regenerating the index in a shared checkout indexes another session's uncommitted files | Medium | The index is regenerated and its untracked entries checked against this phase's own files |
| Dependency | Another session owns this parent packet's goal | Low | Every decision, the binding and all six criteria are kept; the deviation is logged, and the slice is resent to the operator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The dead-route check adds one regular-expression search per `SKILL.md`; the corpus rule adds one string split per directory.

### Security
- **NFR-S01**: No new input surface.

### Reliability
- **NFR-R01**: The index generator's output stays deterministic for a given tree.

---

## L2: EDGE CASES

### Data Boundaries
- A generated copy whose canonical skill is missing: skipped all the same; the generator prunes stale copies on write.
- A directory named `lineages` outside `specs/`: still walked unless its parent is `research`.

### Error Scenarios
- A future runtime mirror using the same marker convention: its copies are skipped for the same reason.

### State Transitions
- A lineage directory created after regeneration: pruned on the next regeneration without further change.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Three independent fixes across three skills and one packet |
| Risk | 12/25 | Shared gates and a shared retrieval index |
| Research | 14/20 | Each defect needed its producer traced before the fix |
| **Total** | **38/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
