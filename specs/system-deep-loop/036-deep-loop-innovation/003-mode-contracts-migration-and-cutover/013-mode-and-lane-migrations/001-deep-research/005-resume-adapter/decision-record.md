---
title: "Decision Record: Deep Research Resume Effect Evidence"
description: "Records cryptographic confirmation binding, authorized recovery correlation, and intentional effect-compensation unreachability without widening the exported resume contract."
trigger_phrases:
  - "deep research effect confirmation binding"
  - "resume adapter forged confirmation"
  - "deep research effect compensation reachability"
importance_tier: "critical"
contextType: "decision"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-22T08:22:35Z"
    last_updated_by: "codex"
    recent_action: "Bound effect confirmations to canonical intent evidence"
    next_safe_action: "Sibling 006-shadow-parity can consume the unchanged exported decision shape"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Effect confirmations are trusted only through the frozen seven-fact binding helper"
      - "Recovery and reconciliation links use canonical intent evidence plus authorized ledger event identities"
      - "Effect-side compensate remains intentionally unreachable because the substrate exposes no compensation executor"
---
# Decision Record: Deep Research Resume Effect Evidence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bind Trusted Effect Outcomes to the Canonical Intent Event

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research resume-adapter maintainers |

---

<!-- ANCHOR:adr-001-context -->
### 1. Context

The resume adapter classified a confirmation as an applied external outcome when its `effect_id` matched an intent. The
effect schema derives several identifiers, but it does not prove that the confirmation commits to the exact stored intent
event, adapter descriptor, or expected postcondition. A confirmation with the right effect and idempotency identities but
forged intent and postcondition digests therefore reached `reconcile`.

### 2. Constraints

- The receipt and effect-recovery substrate is frozen.
- The exported resume request, decision, continuity, and result type names and shapes must remain unchanged.
- The fix must remain additive-dark and preserve every existing reconciliation, conflict, and replay-safe branch.
- Trusted applied evidence must come from canonical stored event bytes or gateway-authorized ledger identities.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### 3. Decision

**We chose**: Drive the frozen `effectConfirmationBindsIntent` helper with the verified intent event ID and the canonical
stored-event digest.

**How it works**: Effect history retains `verified.event.stored.digest` beside each intent event ID. Confirmation lookup
calls the substrate helper, which verifies the derived confirmation identity, effect identity, exact intent event ID and
digest, idempotency key, adapter descriptor digest, and expected postcondition digest. A non-binding confirmation is not
trusted and the existing fail-closed capability logic decides the outcome.

Recovery correlation also requires the exact intent event ID and stored digest. Reconciliation correlation requires both
the authorized recovery ID and intent event ID. Conflict correlation remains keyed by the authorized existing-intent event
ID within the already filtered run. The substrate exports no separate recovery, reconciliation, or conflict binding helper.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### 4. Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use the frozen binding helper and canonical stored digest** | Reuses the substrate's complete seven-fact proof and preserves all public contracts | Requires carrying one private digest field in effect history | 10/10 |
| Compare selected confirmation fields locally | Small local edit | Risks drifting from the substrate or omitting another committed fact | 3/10 |
| Continue matching only `effect_id` | No code change | Certifies forged applied outcomes | 0/10 |

**Why this one**: The substrate helper is the frozen authority for confirmation-to-intent binding. Reimplementing part of
that contract would recreate the defect class.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### 5. Consequences

**What improves**:

- A forged confirmation no longer upgrades an unresolved irreversible effect to `reconcile`.
- Genuine confirmations and authorized reconciliation verdicts keep their existing dispositions.
- Successor consumers receive the same exported decision shape.

**What it costs**:

- Effect history retains the canonical intent digest in a private record. This is bounded to verified ledger events and
  does not widen serialized or exported types.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future refactor restores bare identity matching | H | Keep the forged negative, genuine positive, and mutation-falsifier tests in the full-pipeline suite |
| A recovery event cites the right intent ID with the wrong digest | H | Require both event ID and canonical stored digest before its reconciliation chain is considered |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### 6. Implementation and Rollback

The adapter imports the existing helper, retains the intent's stored digest, and tightens private effect-evidence
correlation. Seven new full-pipeline cases cover forged and genuine confirmations, all reconciliation verdict families,
replay-safe reexecution, and immutable conflicts. Temporarily restoring the bare match makes the forged test fail with
`reconcile` instead of `blocked`.

**How to roll back**: Revert the private correlation changes, the seven tests, and this record together. No migration,
generated schema change, or downstream type update is required.
<!-- /ANCHOR:adr-001-impl -->

---

<!-- ANCHOR:adr-001-effect-compensate -->
### 7. Intentional Effect-Side `compensate` Unreachability

Effect-side `compensate` remains structurally unreachable by design. The exported effect-disposition union retains the
member for cross-mode algebra compatibility, but the frozen effect adapter descriptor exposes only replay safety and
reconciliation capability. It provides no compensation executor, compensation intent, or verified compensation result.
Emitting `compensate` would therefore claim an action the runtime cannot execute or prove.

The safe behavior is unchanged: an unresolved irreversible, non-reconcilable effect is `blocked`. This differs from branch
compensation, which is reachable because a restarted or dependency-reopened branch can carry a projected live reservation
reference and must stay outside the execution pool until that reservation is addressed. No effect-compensation reachability
is forced until the shared substrate defines an executable and verifiable compensation contract.
<!-- /ANCHOR:adr-001-effect-compensate -->
<!-- /ANCHOR:adr-001 -->
