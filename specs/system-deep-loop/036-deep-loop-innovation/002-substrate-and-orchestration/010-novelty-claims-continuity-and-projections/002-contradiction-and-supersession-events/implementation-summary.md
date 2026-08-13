---
title: "Implementation Summary: Contradiction & Supersession Events"
description: "Typed additive-dark claim relationship events, deterministic status projection, and fail-closed replay evidence."
trigger_phrases:
  - "contradiction supersession implementation"
  - "claim relationship implementation summary"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
    last_updated_at: "2026-07-21T08:31:20Z"
    last_updated_by: "codex"
    recent_action: "Implemented typed relationship events, status fold, audit, replay, and adversarial fixtures"
    next_safe_action: "Consume the exported typed projection from sibling claim-continuity work"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/contradiction-supersession.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-contradiction-and-supersession-events |
| **Completed** | 2026-07-21 |
| **Status** | Complete |
| **Level** | 2 |
| **Delivery posture** | Additive-dark; legacy contradiction counting remains authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Claim relationships can now be recorded as evidence-backed, versioned events without granting detector output any
authority. The new isolated service admits canonical contradiction or directional supersession events only after
domain simulation and durable transition authorization, then rebuilds typed claim status from verified ledger order.

### Relationship history and status

Contradictions derive one order-independent relationship identity from the canonical claim pair and scope.
Supersessions preserve predecessor-to-successor direction, reject cycles and competing active successors, and expose
the terminal successor for every replaced claim. Withdrawals counter one prior assertion while both events and both
evidence sets remain available to replay and audit.

### Replay and audit

The reducer binds its complete-history projection to the immutable reference snapshot and phase-006 replay
fingerprint. Invalid graph history, unresolved references, stream-order mismatch, stored corruption, or fingerprint
mismatch returns no trusted projection. The audit report joins each status conclusion to event identity, ledger
sequence, exact evidence, authorization reference, append receipt, detector/reducer versions, and replay fingerprint.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/contradiction-supersession/*.ts` | Created | Event registry, candidate normalization, domain validation, authorized append service, projection, audit, and replay |
| `runtime/tests/unit/contradiction-supersession.vitest.ts` | Created | Adversarial assertion, withdrawal, retry, conflict, precedence, graph, replay, and corruption fixtures |
| `002-contradiction-and-supersession-events/*.md` | Modified/Created | Execution evidence, checklist reconciliation, and implementation handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation imports the frozen phase-006 envelope, gateway, append-only ledger, reader, and replay-fingerprint
APIs without changing them. It creates a separate shadow ledger and typed projection; no legacy writer, counter,
consumer, or sibling implementation was modified. Invalid relations are simulated against verified history before the
gateway is called, while exact event retries recover the original durable proof and receipt from the audit ledger.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Derive relationship IDs from canonical endpoints and scope | Observation order cannot double-count a contradiction, while reversing supersession produces a different identity |
| Keep detector candidates inert values | Candidate evidence can be inspected without entering status truth before authorization and append |
| Store assertion and withdrawal evidence separately in history | Correction stays append-only and audit can distinguish why a relation was asserted from why it was withdrawn |
| Require full-history replay for trusted status | A partial range cannot safely infer an earlier assertion, withdrawal, or supersession chain |
| Compare projection bytes across compiled processes | Registry implementation digests intentionally differ when a build transforms validator functions, while the pure fold remains byte-identical |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Leaf Vitest command | PASS: 1 file, 16 tests |
| Runtime TypeScript compile | PASS: repository-pinned TypeScript 5.9.3, exit 0 |
| Same-artifact repeated replay | PASS: byte-identical fingerprint descriptor |
| Cross-process replay | PASS: byte-identical canonical projection |
| Strict packet validation | PASS: errors 0, warnings 0, exit 0 |
| Path-scoped diff check | PASS: only the new module, leaf test, and this leaf's documentation |

### Verifier identities

| Identity | Value |
|----------|-------|
| Working-tree parent HEAD | `012652b479dee08455de574574c5e7a8971a8b0b` |
| Merge-base SHA | `9c5c7c5bde4dbb468fdb11df3c5afdbaa87443e3` |
| Candidate SHA | `UNCOMMITTED` (no commit requested) |
| Event-registry digest | `e778bcdd5d8af3d70a5636010fcff277aa0eb3a7d050a64ab98f2c6ff7f493ed` |
| Reference-fixture digest | `c6f04a7d2bd6e979b991e6f4f8c5d5bee8cf5ddf146dd1dff9760ba7d52c5395` |
| Reducer version | `claim-relationships@1` |
| Covering replay fingerprint | `b32382cbe7fd716410b6dba4b66279767adc83b6a55ce435cba6f1152c731bbf` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow authority only.** The typed projection is additive-dark and does not replace the legacy contradiction count.
2. **Sibling integration remains separate.** Claim-continuity and transactional-projection consumers receive the exported contract in their own leaves; this change does not modify them.
3. **Fingerprint identity is build-sensitive.** The phase-006 registry digest commits validator implementation text, so differently transformed builds must not claim the same full fingerprint. Projection bytes remain deterministic.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Downstream projection adapter | Exported typed projection contract only | Modifying sibling consumers is outside this leaf's additive scope |
| Candidate and base commit SHAs | Working-tree evidence plus parent and merge-base SHAs | The request did not authorize a commit |
<!-- /ANCHOR:deviations -->
