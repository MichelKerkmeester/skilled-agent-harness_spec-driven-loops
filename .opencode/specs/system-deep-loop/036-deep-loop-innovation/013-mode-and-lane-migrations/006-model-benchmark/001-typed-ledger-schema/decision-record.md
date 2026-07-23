---
title: "Decision Record: Model Benchmark Scoring Prerequisite Boundary"
description: "Accepts structural normalized-score prerequisite validation at the schema layer and assigns durable append confirmation to the phase-014 reducer and cutover fold."
trigger_phrases:
  - "model benchmark scoring prerequisite"
  - "normalized evaluation append confirmation"
  - "phase 014 model benchmark promotion"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T10:44:22Z"
    last_updated_by: "codex"
    recent_action: "Recorded the scoring boundary and deferred provenance completion"
    next_safe_action: "Confirm normalized scoring append history during phase-014 cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-ledger-schema.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The schema matches a caller-supplied normalized-event preflight structurally and by digest"
      - "The phase-014 reducer must confirm that prerequisite is present in verified ledger history"
---
# Decision Record: Model Benchmark Scoring Prerequisite Boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Durable Scoring-Prerequisite Proof Outside the Schema Leaf

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | Model Benchmark typed-ledger schema owners |

---

<!-- ANCHOR:adr-001-context -->
### Context

`requireTypedScoringPrerequisite` checks a caller-supplied `EventWritePreflight` before preparing
`deep_improvement_common.promotion_proposed`. It verifies the registry digest, normalized event type and stem, event
ID, and payload digest. Those checks reject raw-result substitutions and mismatched normalized-score references.

The preflight does not prove that `deep_improvement_common.evaluation_normalized` was durably appended. A caller can
prepare a valid normalized event, never append it, and then supply that preflight to a matching promotion proposal.
Confirming append existence and order requires verified ledger history, which this pure schema leaf does not fold.

### Constraints

- The leaf remains additive-dark and does not read or reduce prior ledger events.
- The structural and digest checks remain fail-closed for malformed or substituted prerequisites.
- The schema must not invent an in-memory append registry or treat preparation as durable storage.
- Authority cutover must reject promotion when the referenced normalized event is absent from verified history.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep structural and digest matching in the schema, and assign durable prerequisite confirmation to the
phase-014 reducer and cutover fold.

The reducer must confirm that the referenced `evaluation_normalized` event was appended before the promotion proposal
and that its event ID and payload digest match the proposal fields. Missing, reordered, or mismatched prerequisites
must block promotion and authority cutover. This leaf will not add a fake append check without ledger history.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Match here; confirm append during phase-014 folding** | Keeps schema validation deterministic and gives the reducer the required history | A never-appended but valid preflight can pass schema preparation | 9/10 |
| Query the ledger from `requireTypedScoringPrerequisite` | Rejects missing history during preparation | Couples a pure validator to mutable storage and duplicates reducer responsibility | 2/10 |
| Track prepared or appended IDs in a leaf-local set | Small local change | Not durable, replay-safe, or authoritative across processes | 1/10 |

**Why this one**: Only the verified ledger fold can distinguish a structurally valid preflight from an event that was
actually appended before promotion.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Schema validation stays deterministic and independent of mutable ledger state.
- Raw-result substitutions and normalized-event identity or digest mismatches still fail before preparation.
- Cutover receives one explicit fail-closed obligation for prerequisite existence and ordering.

**What it costs**:
- Schema success alone does not prove the normalized scoring event is durable.
- The phase-014 reducer must retain enough verified history to resolve the prerequisite before promotion.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A never-appended normalized preflight reaches the cutover fold | H | Reject when verified history lacks the referenced event ID and digest |
| A valid normalized event appears after its promotion proposal | H | Require the prerequisite at an earlier ledger sequence |
| A consumer treats preparation as proof of append | H | Preserve additive-dark posture and expose the reducer obligation in cutover evidence |
<!-- /ANCHOR:adr-001-consequences -->

**Deferred minor completeness item**: `LegacyUpcastCandidate` lacks explicit `sourceEventVersion` and `sourceSchemaVersion` fields; address both in a class-wide upcast-provenance pass so every lane adopts one provenance shape.

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Append existence cannot be derived from a preflight object |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares reducer folding with storage lookup and local tracking |
| 3 | **Sufficient?** | PASS | Structural validation plus verified-history folding covers both layers |
| 4 | **Fits Goal?** | PASS | The schema remains pure while cutover owns historical authority |
| 5 | **Open Horizons?** | PASS | The fold can support replay and migration without widening shared payloads |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The schema continues to match the normalized preflight by registry, type, stem, event ID, and payload digest.
- This leaf records that preparation is not proof of durable append.
- The phase-014 reducer must confirm the referenced normalized event exists earlier in verified ledger history before
  promotion or authority cutover.

**How to roll back**: Remove this additive decision record together with the dark schema path if the lane migration is
retired. No authoritative writer or stored ledger state changes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
