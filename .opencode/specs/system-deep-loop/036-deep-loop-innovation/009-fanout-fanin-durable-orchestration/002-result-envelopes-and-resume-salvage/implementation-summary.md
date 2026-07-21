---
title: "Implementation Summary: Result Envelopes & Resume/Salvage"
description: "Additive-dark result pairing, verified-ledger resume, recovery gating, and provenance-preserving salvage for durable fan-out."
trigger_phrases:
  - "result envelope implementation"
  - "fanout resume salvage evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
    last_updated_at: "2026-07-21T05:09:43Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified additive-dark result, recovery, salvage, and resume contracts"
    next_safe_action: "Preserve legacy fan-out authority until a later cutover packet adopts the shadow projection"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/result-envelopes/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/result-envelopes.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Result Envelopes & Resume/Salvage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-result-envelopes-and-resume-salvage |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete (additive-dark) |
| **Candidate** | Uncommitted leaf delta on base `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Event versions** | Result 1, salvage 1, recovery link 1 |
| **Reducer** | `result-resume-reducer@1` |
| **Registry digest** | `4a91f98466577639d7cd2c188d315dcad7c6a91c640b8d9a2ef34172db8a5844` |
| **Fixture digest** | `f47841798bebfd75d03f9922dcb75275b18f9669b633ac4c1b3d28593bed1ad7` |
| **Authority** | Legacy fan-out authoritative; typed path shadow-only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fan-out now has a typed, authorized shadow record for terminal leaf outcomes and provenance-bearing salvage without changing production scheduling. The new reducer reconstructs progress only from the verified ledger, excludes evidence-complete successful leaves, and blocks ambiguous retry or completion claims.

### Canonical Result Pairing

The logical event `orchestration.leaf_result_recorded` uses the phase-006 compliant wire type `orchestration.leaf.result-recorded`. Its identity derives from `dispatch_receipt_id`, so one receipt attempt owns one result slot. The recorder verifies the sibling dispatch receipt before building a result, returns the original durable append receipt for exact retries, and rejects changed canonical facts before append.

The closed payload records leaf and attempt identity, terminal status, bounded parsed data or a digest reference, required evidence and artifact references, error classification, timing, usage, cost provenance, replay fingerprint, authority epoch, and a canonical result digest. Inline data is capped at 16 KiB. Credential-shaped fields, prompt/raw-output fields, token-shaped values, unrestricted paths, and unknown cost represented as zero are rejected.

### Deterministic Resume and Recovery

`foldResumeProgress` accepts a concrete `AppendOnlyLedger`, expected leaf set, registry version, retry-policy eligibility, and immutable digest resolver. It calls `readVerifiedEvents()`, derives the trusted head from the verified stream, and emits canonical bytes plus a digest. It accepts no checkpoint cache, wall clock, or process-exit input.

A receipt without a result remains `dispatched_in_flight` and `EFFECT_RECONCILIATION_REQUIRED` until a verified phase-007 reconciliation event is linked. The recovery caller must supply an expected correlation key that matches both the source event and target dispatch receipt, preventing one leaf's reconciliation from authorizing another leaf. Only `not_applied` + `execute_once` + `retrying` plus an affirmative retry-policy input becomes eligible. `applied` requires result reconciliation; `in_doubt` and `conflict` stop automatically.

### Append-Only Salvage and Legacy Shadow

Salvage events carry source kind/reference, source and content digests, parser/schema version, recovered scope, completeness, confidence, verdict, byte length, and effective partial/failed status. Source identity does not include content digest, so changed content under the same source slot conflicts instead of overwriting history. Reconstructed content from any source kind must state that it is not byte-identical original evidence.

The compatibility projection mirrors the shipped stdout parser, iteration recovery and failed-marker rules, state-log registry reconstruction, lineage attribution, and pool failure classification. Tests compare the projection directly with exported legacy helpers. The production scripts remain unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/result-envelopes/errors.ts` | Created | Typed fail-closed errors |
| `runtime/lib/result-envelopes/types.ts` | Created | Result, salvage, recovery, resolver, and progress contracts |
| `runtime/lib/result-envelopes/identity.ts` | Created | Stable result, salvage, and recovery identities |
| `runtime/lib/result-envelopes/event-contracts.ts` | Created | Versioned closed schemas and canonical event builders |
| `runtime/lib/result-envelopes/recorder.ts` | Created | Receipt validation and authorized idempotent append paths |
| `runtime/lib/result-envelopes/resume-reducer.ts` | Created | Verified-ledger completion gate and deterministic fold |
| `runtime/lib/result-envelopes/legacy-shadow.ts` | Created | Non-authoritative legacy semantic projection |
| `runtime/lib/result-envelopes/index.ts` | Created | Public additive-dark API |
| `runtime/tests/unit/result-envelopes.vitest.ts` | Created | Adversarial pairing, completion, resume, recovery, salvage, corruption, and parity fixtures |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Reconciled implementation and verification evidence |
| `implementation-summary.md` | Created | Recorded architecture, proofs, verification, and rollout boundary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation composes the real phase-006 event registry, transition authorization gateway, fenced writer, append-only ledger, sibling dispatch receipt, and phase-007 effect-recovery schema in temporary per-test roots. Every new append uses `AuthorizedEvidenceWriter`; every resume decision uses `AppendOnlyLedger.readVerifiedEvents()`.

The first parity run exposed one shipped edge: `classifyLineageFailure` normalizes a `null` exit code to zero through `Number(null)`. The shadow projection was corrected to preserve that behavior. The final suite passes 30/30 tests.

No runtime integration hook or existing script changed. Disabling or deleting the new shadow caller surface leaves all production fan-out behavior exactly as before; committed typed events, when a future caller emits them, remain immutable audit evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Separate logical event name from wire type | The requested underscore name is retained in the payload, while the phase-006 registry requires three lowercase kebab-case wire segments |
| Derive one result identity from the dispatch receipt | Exact retries converge on one slot and changed facts conflict before a new append |
| Require verified phase-007 source evidence and shared expected correlation for recovery links | Callers cannot assert `not_applied` from mutable rows or pair one leaf's reconciliation with another leaf's dispatch |
| Make required digest resolution part of completion | Exit zero, summary presence, and completed rows are not semantic proof |
| Reject unknown cost for automatic success | Unknown remains explicit `null`; the reducer cannot invent a zero-cost completion |
| Keep salvage terminally partial or failed | Recovered fragments retain value without manufacturing success |
| Omit mutable checkpoint input from the reducer | Ledger evidence remains the only resume authority and repeated folds remain byte-identical |
| Implement parity as a standalone projection | The frozen scope forbids modifying shipped scripts and preserves additive-dark rollback |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:proofs -->
## Load-Bearing Proofs

### Evidence-Based Completion

A `succeeded` envelope must contain a valid parsed result or a resolvable parsed-result reference, known measured/estimated cost, and every required evidence/artifact digest. Missing resolution or a present resolution whose digest differs produces `unreadable` and no dispatch eligibility. The reducer has no exit-code, summary-file, or completed-row success input.

### No Rerun of Completed Leaves

The successful fixture commits one dispatch/result pair, resolves both required digests, and folds twice. Both folds produce identical bytes and digests; `leaf-a` remains in `completed_leaf_ids`, `dispatch-a` remains in `scheduling_exclusions`, and only the never-dispatched leaf appears in `eligible_dispatch_ids`.

### Reconcile Before Retry

The recovery matrix links verified `not_applied`, `applied`, `in_doubt`, and `conflict` events. A dedicated cross-leaf fixture pairs leaf B's valid not-applied source with leaf A's dispatch receipt; the recorder rejects it as `RECOVERY_EVIDENCE_INVALID`, and leaf A remains `dispatched_in_flight`, unresolved, and ineligible. Only the exact not-applied/retry-policy-eligible case enters the eligible set. Applied remains blocked pending result reconciliation; in-doubt and conflict classify as conflicted.

### Append-Only Salvage Provenance

An exact salvage repeat returns the first durable receipt. Changing content under the same source/parser/scope identity conflicts while the ledger stays at two events. A recovered fragment paired with a failed result derives `salvaged` with terminal status `failed`; it never enters completed leaves. Parameterized fixtures reject reconstructed content claiming byte identity for captured stdout, future typed fragments, iteration artifacts, registries, and state events.

### Deterministic Fold

The snapshot sorts expected leaves and every scheduling set by code unit, binds the expected-set digest, registry/reducer versions, verified head sequence/hash, and contains no current time. A dispatch receipt with no result or recovery record defaults to `dispatched_in_flight` and `EFFECT_RECONCILIATION_REQUIRED`. Hash-chain corruption returns an unreadable snapshot with an empty eligible set. A separate crash fixture throws from the ledger's after-frame-fsync hook, observes the truncated tail as unreadable, calls `recoverTornTail()`, and obtains byte-identical folds of the committed prefix with the tail quarantined.

### Shadow Parity

Fixtures compare stdout extraction, recovered iteration counts, failed markers, review/research registry reconstruction, attribution fields, and four failure classes against the shipped CommonJS exports. The only discrepancy found during development was corrected before final verification.
<!-- /ANCHOR:proofs -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Result-envelope leaf suite | PASS, exit 0: 1 file and 30 tests |
| Runtime TypeScript typecheck | PASS, exit 0 |
| Module-only strict TypeScript check | PASS, exit 0 |
| OpenCode alignment verifier | PASS, exit 0: 8 files scanned, 0 findings |
| Comment hygiene scan | PASS, no ephemeral requirement/packet labels in runtime code |
| Strict spec validation | PASS, exit 0: Errors 0, Warnings 0 |
| Additive-dark scope | PASS: new module, one test, and this leaf's docs; shipped scripts untouched |

### Exact Commands

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/result-envelopes.vitest.ts
```

Final result: `Test Files 1 passed (1); Tests 30 passed (30)`.

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

Final result: exit 0.

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --fail-on-warn --root .opencode/skills/system-deep-loop/runtime/lib/result-envelopes --root .opencode/skills/system-deep-loop/runtime/tests/unit/result-envelopes.vitest.ts
```

Result: exit 0; 8 files scanned; 0 errors, warnings, or findings.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage --strict
```

Result: exit 0; Errors 0; Warnings 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Production authority is intentionally unchanged.** No shipped runner calls these APIs. A later authorized cutover must wire dark writes and scheduling consumption.
2. **Not-applied does not override retry policy.** The reducer requires both verified recovery evidence and `retryPolicyEligible: true` from the expected leaf contract.
3. **Artifact resolution assumes immutable digest-addressed references.** A resolver that returns mutable path content will fail when its digest differs, but storage immutability remains the provider's responsibility.
4. **The shared worktree contains unrelated packet work.** Scoped status identifies this leaf's delta; whole-worktree cleanliness is not claimed.
5. **Recovery correlation is a caller-supplied binding.** The recorder verifies it against both durable envelopes, but callers remain responsible for choosing the dispatch attempt's expected correlation key.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The original plan described instrumentation at existing fan-out boundaries and parent/successor documentation updates. The user froze a narrower additive-only write set: new runtime modules, one test, and this leaf's docs. The implementation therefore provides a standalone shadow projection and leaves scripts, parent docs, and successor docs untouched.
<!-- /ANCHOR:deviations -->
