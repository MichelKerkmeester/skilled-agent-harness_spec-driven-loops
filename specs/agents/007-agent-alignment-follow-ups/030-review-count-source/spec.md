---
title: "Feature Specification: Phase 30: review-count-source"
description: "A deep review takes its P0, P1 and P2 counts from three places: the verdict script reads the registry, the report states the agent's own counts after its self-check, and the closeout records whatever counts the agent passed. This phase makes the verdict script's counts the ones the report and the closeout use."
trigger_phrases:
  - "review count source"
  - "phase 30 review count source"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 30: review-count-source

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 33 |
| **Predecessor** | 029-review-verdict-script |
| **Successor** | 031-search-debt-verdict |
| **Handoff Criteria** | The workflow binds the three counts from the verdict script, the closeout refuses counts that differ from the registry on a single-executor run, a test covers the refusal, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the agent alignment follow-ups. It builds one fix from the Fable 5.2 report on the four known limits.

**Scope Boundary**: `deep-review.yaml` synthesis steps, `synthesis-closeout.cjs` and its tests, and the recompiled contract. The ledger schema stays as it is.

**Dependencies**:
- Phase 29's `review-verdict.cjs`, which already prints `active_p0`, `active_p1` and `active_p2`

**Deliverables**:
- One count source for verdict, report and closeout
- A closeout check that refuses mismatched counts on a single-executor run
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`step_derive_verdict` (.skilled/commands/deep/assets/deep-review.yaml) computes the verdict from the registry, but the report and the closeout use `active_p0`, `active_p1` and `active_p2` from `step_build_finding_registry`, which the agent counts by hand and may lower in `step_adversarial_selfcheck`. So a report can print P1=2 next to a CONDITIONAL verdict the script took from P1=4, and the `synthesis_complete` row records the agent's numbers, not the ones the verdict used.

### Purpose
Make the verdict script's counts the only counts the report and the closeout carry, and keep the self-check's outcomes as their own list in the report.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node probe-adj.cjs   # scratch run, gateway append of a claim_adjudication row
adj {"exit":1,"out":"{\"ok\":false,\"phase\":\"runtime\",\"reason\":\"Invalid closed-shape payload for deep_review.claim_adjudication\",\"code\":\"RUNTIME_ERROR\"}"}
adj-schema-only 0
projected [{"passed":true}]

$ python3 - < drift-strict   # inline: explicit P0/P1/P2 triple in each report's Executive Summary vs the registry's active findings, 2026-10-01 onward
reports 52 parsed 34 differ 10 report<=registry 4 report>registry somewhere 6
LOWER  system-deep-loop/z_archive/034-skill-benchmark-codex-executor/review reg (0, 4, 8) rep (0, 2, 4)
LOWER  sk-code/quality-and-review-modes/001-code-modes-research/review reg (0, 5, 14) rep (0, 2, 14)
# both LOWER reports state post-self-check counts: "post-adversarial adjudication", "4 are refuted", "two lineage P1 findings were downgraded"
# five of the six HIGHER rows read a registry with no active findings, so they are not a self-check effect"
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bind `active_p0`, `active_p1` and `active_p2` from the verdict script in both branches of `step_derive_verdict` (.skilled/commands/deep/assets/deep-review.yaml)
- Drop the count outputs from `step_build_finding_registry`; its registry and the self-check stay narrative
- The report's Executive Summary states that its counts are the ones the verdict used, and lists self-check outcomes (confirmed, downgraded, false positive) separately
- `synthesis-closeout.cjs` refuses review counts that differ from the registry's active counts when no lineage logs exist
- Recompile `compiled/deep-review.contract.markdown`

### Out of Scope
- Carrying the self-check's per-finding result into the registry. The gateway refuses `findingId` and `finalSeverity` on a `claim_adjudication` row, so that needs a ledger schema change; it is reported as a follow-up, not built here
- The fan-out root, whose counts the merge binds

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Bind counts from the verdict script; report wording |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modify | Refuse mismatched counts on a single-executor run |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-counts.vitest.ts` | Create | Mismatch refused, match accepted, fan-out skipped |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Recompiled |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The report and the closeout use the verdict script's counts. | `step_derive_verdict` binds `active_p0`, `active_p1` and `active_p2` from the script in both branches, `step_build_finding_registry` no longer outputs them, and the contract recompiles with drift and parity passing |
| REQ-002 | On a single-executor run the closeout refuses counts that differ from the registry. | A test gives the closeout P1=1 against a registry with two active P1 findings and sees a non-zero exit and no staged row; a matching call stages `synthesis_complete` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The report keeps the self-check's outcomes without changing the counts. | The report instructions say the counts are the verdict's and list self-check outcomes in their own lines |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new tests.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An agent reads the self-check as a reason to lower the counts | Medium | The report instruction says the counts and verdict stay the script's |
| Dependency | Contract parity tests in spec-kit | Low | Run them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the self-check's result reach the registry? Recorded as a follow-up; it needs a typed ledger field.
<!-- /ANCHOR:questions -->

---


