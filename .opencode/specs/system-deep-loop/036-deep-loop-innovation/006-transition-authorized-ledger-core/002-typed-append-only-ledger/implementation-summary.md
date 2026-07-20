---
title: "Implementation Summary: Typed Append-Only Ledger"
description: "Immutable authorized ledger frames, proof-required append, verified replay, deterministic reduction, torn-tail recovery, and dark legacy isolation."
trigger_phrases:
  - "typed append-only ledger implementation"
  - "authorized ledger verification"
  - "dark ledger core"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the typed append-only ledger leaf under the accepted focused co-landing gate"
    next_safe_action: "Keep the substrate dark until a later integration phase explicitly wires legacy boundaries"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Typed Append-Only Ledger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-typed-append-only-ledger |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Candidate SHA** | `6c579941fa09d140010d9380b84babe8fcd0412a` plus the scoped dirty candidate |
| **Authority posture** | Additive-dark; legacy writers remain authoritative and unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The dark ledger now accepts a domain event only through a proof-required append boundary, persists immutable hash-linked frames, and yields typed data only after full verification. Exact retries are idempotent, conflicting identities fail closed, projections rebuild deterministically, and damaged tail bytes remain preserved as recovery evidence.

### Authorized Ledger Modules

| Module | Purpose |
|--------|---------|
| `authorized-ledger-types.ts` | Shared frame, receipt, proof, authorization, replay, reducer, and storage contracts |
| `authorized-ledger-errors.ts` | Stable typed failure codes and bounded error details |
| `immutable-frame-store.ts` | Owner-only immutable frame storage, locking, chain verification, and torn-tail quarantine |
| `append-only-ledger.ts` | Proof-required append, idempotency, contiguous sequence allocation, verified reads, and durable receipts |
| `deterministic-reducer.ts` | Typed reducer registration and byte-stable disposable projection rebuilds |
| `dark-ledger-adapter.ts` | Frozen legacy-boundary census, result-preserving dark append adapter, and telemetry |
| `transition-policy-registry.ts` | Immutable versioned policy registry used by the co-landed gateway |
| `authorization-decision-event.ts` | Closed authorization-decision event schema and envelope registry |
| `transition-authorization-gateway.ts` | Default-deny evaluation and exact allow-proof production |
| `authorization-replay.ts` | Cross-stream allow linkage, deny absence, policy parity, and unapplied-allow verification |
| `index.ts` | Dependency-closed public surface for the ledger and gateway unit |

### Co-Landing Invariant Proofs

| Invariant | Focused evidence |
|-----------|------------------|
| Direct append without allow is rejected | No public `append` method exists; `appendAuthorized(..., undefined)` returns `AUTHORIZATION_REQUIRED` and leaves the domain head at zero |
| Allow linkage is exact and single-use | One allow unlocks its exact event; retry returns the original receipt; a different event or ledger identity is rejected |
| Deny advances only audit | The deny event advances the authorization-audit head to one while the domain head remains zero |
| Hash-chain integrity | Mutation, deletion, insertion, reorder, fork, unknown type, and altered authorization linkage fail before typed event delivery |
| Idempotency | Exact retry is receipt-identical; same-ID/different-content raises `EVENT_ID_CONFLICT` without advancing the head |
| Deterministic replay | Projection bytes and digests repeat exactly; authorization replay verifies allow linkage, deny absence, policy parity, and distinct audit/domain heads |
| Torn-tail recovery | A torn frame is detected, its exact bytes are quarantined, the last verified head is restored, and append resumes at the same next sequence |
| Dark legacy isolation | The eleven-boundary census is frozen; allow, deny, and injected ledger failure return the exact legacy result object and never promote the dark head to authority |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The ledger and gateway landed as one dark runtime unit under `runtime/lib/authorized-ledger/`. Finalization did not modify those core modules or any legacy writer. The accepted phase gate is the focused `authorized-ledger.vitest.ts` suite with 20 passing cases plus the invariant proofs above; the envelope suite is run beside it to prove the consumer contract remains intact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require `appendAuthorized` and omit a proof-free append API | Structural absence prevents a valid envelope from becoming authorization |
| Treat sequence and previous hash as order authority | Wall-clock timestamps cannot create a unique replay order or detect forks |
| Return the stored receipt for exact retries | Logical idempotency survives caller retry without minting duplicate history |
| Preserve torn bytes in quarantine | Recovery remains auditable and never silently rewrites earlier committed evidence |
| Keep adapters reusable and legacy writers untouched | This leaf proves dark isolation without moving runtime authority or expanding the approved write set |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused authorized-ledger Vitest | PASS: 1 file, 20 tests passed, 0 failed |
| Combined envelope + authorized-ledger Vitest | PASS: recorded by the final co-landing verification command |
| Runtime TypeScript typecheck | PASS: exit 0 |
| Strict packet validation | PASS: Errors 0 |
| Legacy authority check | PASS: core is additive-dark; existing runtime writers are unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full runtime suite has 100 pre-existing baseline failures.** The worktree lacks the `better-sqlite3` native dependency and contains kebab-rename fixture mismatches such as `deep_review_auto.yaml` versus `deep-review-auto.yaml`. These failures exist at BASE, are outside the phase-006 write set, and remain owned by baseline hygiene and the phase-016 gate.
2. **Legacy writers are intentionally not wired here.** The reusable adapter and boundary census prove result isolation, but a later scoped integration phase must add live calls before shadow evidence can accumulate.
3. **The ledger remains dark.** Its events, verified head, and projections do not control runtime outcomes before the authorized cutover phase.
<!-- /ANCHOR:limitations -->
