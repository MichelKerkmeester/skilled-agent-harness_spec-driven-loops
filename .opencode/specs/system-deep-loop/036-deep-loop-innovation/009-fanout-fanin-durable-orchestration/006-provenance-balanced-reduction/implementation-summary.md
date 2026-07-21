---
title: "Implementation Summary: Provenance-Balanced Reduction"
description: "Delivered a deterministic source-balanced reducer that preserves every contributor, fails contested merges closed, and emits replayable additive-dark evidence."
trigger_phrases:
  - "provenance-balanced reduction implementation"
  - "source-balanced fan-in implementation"
  - "durable reduction receipt"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
    last_updated_at: "2026-07-21T08:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the additive-dark provenance-balanced reducer and evidence suite"
    next_safe_action: "Keep legacy fan-in authoritative until a later activation gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/provenance-reduction/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/provenance-reduction.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "provenance-reduction-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-provenance-balanced-reduction |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete, additive-dark |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Durable fan-in can now reduce the conditional gate's exact successful envelope set without letting completion order,
duplicate volume, or cloned branches decide the result. One canonical artifact retains every contributor, records every
excluded input, and carries a receipt that identifies whether the evidence represents the full fleet or only survivors.

### Canonical identity and complete provenance

Versioned repository and claim rules normalize exact identity without consulting time, filesystem order, mutable
display fields, or hidden producer identity. Orchestration-owned source registrations bind model-family provenance to
successful result envelopes, so leaf content cannot relabel itself into another bucket. Compatible duplicates retain
ordered contributor records with source-local payload digest, rank, lineage, evidence locators, and one effective
support increment per model-family bucket. Contradictory payloads become typed conflict sets.

### Provenance-balanced scheduling

The scheduler canonicalizes reviewable rational weights, gives every eligible bucket one slot before weighted extras,
round-robins stable logical branches inside a bucket, and applies a per-source occupancy cap. Duplicate floods and
same-family clones retain raw contributor evidence but do not create effective sources. Quota exhaustion and global
capacity each produce a typed disposition instead of deleting minority work.

### Blinded adjudication and replay

Semantic contests cross a merit-only port containing candidate content, digests, and pinned policy evidence. Stable,
counterfactual-backed verdicts may merge; unstable, inconclusive, missing, replay-mismatched, or identity-leaking
evidence leaves candidates separate. Deterministic ledger events record source registration, accepted candidates,
dedup groups, conflicts, verdicts, schedules, dispositions, fleet scope, policy binding, and final order. The replay
projection reconstructs those decisions and verifies every artifact digest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/provenance-reduction/` | Created | Identity rules, typed contracts, balanced reduction, ledger evidence, replay, and shadow receipts |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/provenance-reduction.vitest.ts` | Created | Permutation, duplicate-flood, clone, conflict, malformed, adjudication, minority, partial-fleet, and replay fixtures |
| This leaf's canonical docs | Updated | Completion state, traceability, verifier evidence, and delivery record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reducer is a new runtime module with no imports from legacy fan-in and no edits to legacy authority paths. Its
receipt fixes authority as `legacyFanIn: authoritative` and `provenanceReducer: shadow-only`; optional legacy output
produces byte-parity or difference evidence without authorizing the new artifact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bind model-family metadata through a source registration | Leaf payloads cannot manufacture a bucket assignment or steal another source's quota |
| Count distinct model-family buckets once per claim | Cloned branches remain visible contributors without masquerading as independent support |
| Allocate one slot per eligible bucket before weighted extras | A prolific source cannot consume a minority bucket's first policy share |
| Preserve conflicts and failed adjudications as separate candidates | Missing or unstable evidence is not authority to erase a claim |
| Canonicalize policy weights and all unordered evidence | Equivalent configuration and runtime permutations produce identical bytes and receipt digests |
| Keep the reducer shadow-only | Evidence can accumulate without changing the current fan-in contract or requiring rollback migration |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused provenance-reduction suite | PASS, 9 tests |
| TypeScript no-emit check with package-pinned compiler | PASS, exit 0 |
| Comment hygiene and diff whitespace | PASS |
| OpenCode alignment verification | PASS, 5 files scanned with zero findings |
| Strict packet validation | PASS, exit 0 (Errors 0, Warnings 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark authority only.** The module emits shadow output and comparison receipts but cannot activate itself. Legacy
   fan-in remains authoritative until a later compatibility gate changes the consumer.
2. **Adjudication execution remains service-owned.** This leaf defines and tests the identity-free port and stable
   verdict acceptance. Judge selection, counterfactual execution, and self-source exclusion remain in the consumed
   blinded-adjudication service.
3. **Source registrations require an authorized caller.** The reducer checks one-to-one envelope binding and blocks
   candidate relabeling, but authentication of the orchestration-owned registration belongs to the authorized ledger
   boundary that supplies the reduction request.
<!-- /ANCHOR:limitations -->
