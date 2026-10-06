---
title: "Feature Specification: Review gateway accepts the canonical iteration record"
description: "The deep-review agent, its iteration prompt and its workflow all tell a worker to record one type:\"iteration\" record through append-mode-event.cjs, and in review mode the gateway refuses that record as an unrecognized format. Every review iteration therefore fails its state step, whatever the executor."
trigger_phrases:
  - "review gateway iteration record"
  - "unrecognized event format review"
  - "deep_review.iteration_recorded"
  - "append-mode-event review iteration"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Review gateway accepts the canonical iteration record

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/078-review-gateway-iteration-record` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/agents/deep-review.md` (Step 9), `deep-review/assets/prompt-pack-iteration.md.tmpl` and `deep-review-auto.yaml` all tell the iteration worker to hand `append-mode-event.cjs --mode review` one canonical `{"type":"iteration", ...}` record. The gateway accepts only a `stem` or an `event_type` envelope, plus a legacy upcaster that runs for deep-research alone, so in review mode it exits 1 with "Unrecognized event format: expected object with stem or event_type". Found on 2026-10-02 while running a five-iteration review of the git hooks: no iteration could record its state through the gateway, and the orchestrator had to copy each record into the state log by hand.

A second defect sat behind the first. Two checks in the shared authorized ledger compared canonical event bytes by serializing each byte array as canonical JSON, which allows 10,000 nodes and counts one per byte. Any event over about 10 KB was refused with "JSON value exceeds structural limits", in every mode, and every real iteration record from that review was 11 to 23 KB.

### Purpose
In review mode the gateway records the canonical iteration record the contract already describes, and the refreshed state log carries it as the same `type:"iteration"` row the reducer and the verifier read.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new review ledger stem, `deep_review.iteration_recorded`, whose data is the whole record under one `record` key, wired wherever `deep_review.iteration_error` is.
- The review state projection unwraps that stem into the record itself.
- `append-mode-event.cjs` wraps a bare `type:"iteration"` object under that stem in review mode.
- Tests for the schema, the projection, the producer census and the gateway end to end.
- One sentence in the gateway's feature-catalog entry, and the two folder READMEs that list the changed exports and scripts.
- Compare canonical event bytes directly in the transition-authorization gateway and the append-only ledger, through one shared helper.

### Out of Scope
- The agent definition, the prompt template and the workflow YAML: they already describe the record this change makes the gateway accept.
- Other legacy review row shapes (for example a bare `type:"config"` row): the existing test that pins their refusal stays.
- The `if_cli_opencode` dispatch guards that refuse a dirty primary checkout: those are deliberate safety checks, not defects.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modify | Stem, data type, census, wire type, scope |
| `runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Modify | Data and scope rules |
| `runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Modify | Routing and switch cases |
| `runtime/lib/legacy-projections/deep-review-state-contract.ts` | Modify | Unwrap the record |
| `runtime/scripts/append-mode-event.cjs` | Modify | Wrap a review iteration record |
| `runtime/lib/event-envelope/canonical-json.ts`, `index.ts` | Modify | `canonicalBytesEqual` helper |
| `runtime/lib/authorized-ledger/transition-authorization-gateway.ts`, `append-only-ledger.ts` | Modify | Compare bytes directly |
| `runtime/tests/unit/*.vitest.ts` | Modify | Schema, census, projection and gateway tests |
| `runtime/feature-catalog/script-entry-points/append-mode-event-script.md` | Modify | Document the accepted shape |
| `runtime/lib/event-envelope/README.md`, `runtime/scripts/README.md` | Modify | Name `canonicalBytesEqual` and the gateway script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `append-mode-event.cjs --mode review` given a canonical `type:"iteration"` record exits 0, and the refreshed `deep-review-state.jsonl` holds a row equal to that record. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The new stem is registered in every review stem table, passes the schema, routes in the reducer, and is counted as spoken by the producer census. |
| REQ-003 | A review legacy row that is not an iteration record is still refused with the same message. |
| REQ-004 | The deep-loop runtime typecheck and test suite show no new failures. |
| REQ-005 | An event whose canonical bytes exceed 10,000 bytes records through the gateway in any mode. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A real iteration record from the 2026-10-02 git hook review records through the gateway and reappears unchanged in the state log.
- **SC-002**: The new gateway test fails on main and passes after this change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A `json` data rule admits records the reducer cannot use | Med | The verifier and reducer still check the projected row; the schema only stops forbidden mutable fields |
| Risk | A record carrying a forbidden field (`text`, `body`, `code`, ...) is refused | Low | The five real records from the hook review carry none; the refusal names the reason |
| Dependency | Ledger stem census checker | The census test fails until the gateway emits the stem | Land the stem and the gateway wrap together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No extra process or file read per append.

### Security
- **NFR-S01**: The record passes the same forbidden-mutable-field check every other review stem does.

### Reliability
- **NFR-R01**: Existing review stems, their fixtures and the sealed-artifact indices are unchanged; the new stem is appended last.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A record without `sessionId` is scoped to `run-cli`, as the research upcaster does.
- A record without `timestamp` takes the ledger event's time in the projected row.

### Error Scenarios
- A record carrying a forbidden mutable field is refused with the schema's reason and nothing is written.

### State Transitions
- A record with `status: "error"` from a worker is recorded the same way; the workflow's own error rows keep using `deep_review.iteration_error`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Seven runtime files, four tests |
| Risk | 12/25 | Ledger schema registry |
| Research | 8/20 | Gateway, projection and census traced |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Related work: `specs/system-deep-loop/036-deep-loop-innovation` built the ledger and gateway this extends.
<!-- /ANCHOR:questions -->

---
