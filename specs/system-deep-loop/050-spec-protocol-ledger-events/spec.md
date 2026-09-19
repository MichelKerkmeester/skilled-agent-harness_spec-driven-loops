---
title: "Feature Specification: Give the deep-research ledger its own spec-protocol events"
description: "The research workflows must audit every write they make into a spec, but the ledger refuses all seven spec-protocol rows by design, so no write-back is ever recorded. Give those rows dedicated research event stems so the gateway accepts them."
trigger_phrases:
  - "spec protocol ledger events"
  - "spec mutation audit event"
  - "legacy record has no lossless mode event"
  - "deep research spec write-back audit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give the deep-research ledger its own spec-protocol events

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-19 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-check protocol (`system-deep-loop/deep-research/references/protocol/spec-check-protocol.md` §6) requires every spec write a research run makes to reach the state log as a typed audit row, and the research workflows ask for seven such rows. The append gateway refuses all seven: `legacy-compatibility.ts` pins them because no research event stem describes a spec-folder mutation, and the workflow contract forbids writing the log directly. So a research run that seeds, extends or writes findings into `spec.md` leaves no record of it. The operator chose on 2026-09-19 to give the ledger its own events rather than drop the requirement.

### Purpose
Every spec-protocol row the research workflows emit is accepted by the gateway, stored as a typed ledger event, and projected back into the state log.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Seven research stems, one per legacy row, named after it: `deep_research.spec_check_result`, `spec_seed_created`, `spec_preinit_context_added`, `spec_preinit_context_deduped`, `spec_mutation`, `spec_mutation_conflict` and `spec_synthesis_deferred`.
- Their wire types, payload field rules, scopes and producer status, in `deep-research-ledger-types.ts` and `deep-research-ledger-schema.ts`. The status is `reserved`: the workflows keep writing legacy rows that the gateway upcasts, and the stem-producer census counts only a staged `stem` key as an emitter, the rule `run_resumed` already follows.
- A lossless upcast for each legacy row in `legacy-compatibility.ts`, removing the seven from the pinned sets.
- Reducer cases that leave research state unchanged, and a legacy projection that writes each event back as its legacy row.
- Tests: schema guards, legacy round trip, the append-gateway CLI accepting each row, and the protocol append-site checker.

### Out of Scope
- The other pinned rows, such as `migration` and `min_iterations_guard_pass` - a different decision.
- The deep-review lane - its workflows emit no spec-protocol rows.
- Changing the workflow YAML - the rows keep their legacy shape and are upcast.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Stems, wire types, payload and scope types, producers |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modify | Field rules and scopes |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | Upcast instead of pin |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Modify | No-op cases |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modify | Project back to legacy rows |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/*` | Modify | Schema, upcast, CLI and append-site tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `append-mode-event.cjs --mode research` accepts each of the seven legacy rows and exits 0. |
| REQ-002 | Each accepted row projects back into the state log with the same fields, values and key order as the row as written. The timestamp is the append time, as the gateway already stamps every upcast legacy row. |
| REQ-003 | Existing ledgers replay unchanged: no existing event's fingerprint or reduced state moves. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The stem-producer checker, the protocol append-site checker and the whole deep-loop suite pass. |
| REQ-005 | The spec-check protocol reference names the new stems. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The command that failed in `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/015-compiled-serving-admission-research` succeeds on the same row.
- **SC-002**: A research run's write-back is visible in its state log.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A ledger written with the new stems cannot be read by an older runtime | High | Additive stems only; the rollback note in `plan.md` says a revert must not meet a ledger that already holds them |
| Risk | A new stem shifts replay fingerprints of existing runs | High | REQ-003 replays the committed fixtures before and after |
| Dependency | `b8da689d67`, which added the run-now stems the same way | Low | The template for every file this touches |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable change to append latency.

### Security
- **NFR-S01**: Payload fields keep the schema's prose and token limits.

### Reliability
- **NFR-R01**: A malformed spec-protocol row is refused with a named reason, never written loosely.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A row with an unknown `folder_state` or `conflictKind`: refused by the field rules.

### Error Scenarios
- The deep-research lock is held elsewhere: the gateway's existing refusal applies unchanged.

### State Transitions
- A run started before the change and resumed after it: old rows stay as written, new rows are typed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five runtime files and their tests |
| Risk | 16/25 | A durable ledger format |
| Research | 6/20 | A precedent commit exists |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
