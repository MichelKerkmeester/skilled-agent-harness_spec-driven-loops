---
title: "Feature Specification: Phase 34: self-check-adjudication-ledger"
description: "The deep-review adversarial self-check can confirm, downgrade or reject a P0 or P1 finding, but the ledger refuses a per-finding result, so its calls never reach the registry and the verdict counts the finding as first raised. This phase lets the self-check record each call so a downgrade or a false positive lowers the counts the verdict reads."
trigger_phrases:
  - "self check adjudication ledger"
  - "phase 34 self check adjudication ledger"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 34: self-check-adjudication-ledger

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
| **Phase** | 34 of 34 |
| **Predecessor** | 033-zero-iteration-report |
| **Successor** | None. Follow-up to phase 30 |
| **Handoff Criteria** | The gateway accepts a claim_adjudication row with findingId and finalSeverity, the reducer applies it including a false positive, the workflow records each self-check call and derives the verdict after it, tests cover each step, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 34** of the agent alignment follow-ups. It builds one fix from the Fable 5.2 report on the four known limits.

**Scope Boundary**: The typed review ledger schema and types for `deep_review.claim_adjudication`, the reducer's adjudication fold, the synthesis steps of `deep-review.yaml`, their tests and the recompiled contract.

**Dependencies**:
- Phase 30, which made the verdict script the one count source

**Deliverables**:
- Optional `findingId` and `finalSeverity` on the claim_adjudication row
- A false-positive fold in the reducer
- A self-check that records its calls before the verdict
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep_review.claim_adjudication` in `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` is a closed shape with eight gate-summary fields. `buildClaimAdjudicationByFinding` in `reduce-state.cjs` already reads `findingId` and `finalSeverity` from such rows and applies the final severity, so the only missing link is the schema. `step_adversarial_selfcheck` (.skilled/commands/deep/assets/deep-review.yaml) runs after `step_derive_verdict` and keeps its calls in the report only.

### Purpose
Let the self-check's per-finding calls reach the registry, and derive the verdict from the registry after them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node probe-adj.cjs   # scratch run: gateway append of a claim_adjudication row with findingId and finalSeverity
adj {"exit":1,"out":"{\"ok\":false,\"phase\":\"runtime\",\"reason\":\"Invalid closed-shape payload for deep_review.claim_adjudication\",\"code\":\"RUNTIME_ERROR\"}"}
adj-schema-only 0
projected [{"passed":true}]
# the reducer already folds finalSeverity by findingId (reduce-state.cjs buildClaimAdjudicationByFinding), but no row can carry it
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` and `-types.ts`: optional `findingId` (identifier) and `finalSeverity` (`none`, `P0`, `P1`, `P2`) on `deep_review.claim_adjudication`; rows without them stay valid
- The state-log projection carries both fields
- `reduce-state.cjs`: `finalSeverity: none` marks the finding a false positive and moves it to resolved findings; a P0 to P2 value replaces the severity as today
- `.skilled/commands/deep/assets/deep-review.yaml`: the self-check appends one claim_adjudication row per adjudicated finding through the gateway and refreshes the reducer; `step_derive_verdict` runs after the self-check; report wording follows

### Out of Scope
- The fan-out root: no root state log exists before closeout, so its self-check stays report-only
- The richer `claim_adjudication_recorded` stem, which has no writer

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Modify | Two optional fields |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modify | Two optional fields |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | False-positive fold |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Modify | Accept and refuse cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/self-check-adjudication.vitest.ts` | Create | Gateway append, projection and registry counts |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Record calls; verdict after the self-check |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Recompiled |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/adversarial-self-check.md` | Modify | Where the calls go |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ledger accepts a per-finding self-check result. | A gateway append of a claim_adjudication row with `findingId` and `finalSeverity` exits 0 and the projected state-log row carries both; a bad severity is refused; a row without them still appends |
| REQ-002 | The registry reflects the self-check. | A test appends a P1 finding and a row downgrading it to P2, re-reduces, and sees P1 0 and P2 1; a row with `finalSeverity: none` moves the finding to resolved and the verdict script counts it out |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The workflow records the calls before the verdict. | `step_adversarial_selfcheck` appends one row per call and refreshes the reducer on a single-executor run, `step_derive_verdict` follows it, and the contract recompiles with drift and parity passing |
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
| Risk | A per-finding row changes the latest gate row a later reader takes | Low | The row repeats the latest gate row's mode, passed, activeP0P1, missingPackets and reason; synthesis runs after the loop's last convergence check |
| Dependency | Ledger stem producer and schema tests | Low | Run them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


