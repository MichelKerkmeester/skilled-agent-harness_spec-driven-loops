---
title: "Tasks: Canonical Dispatch Receipts"
description: "Tasks for canonical pre-spawn dispatch receipts, durable invocation fingerprints, and resume-time duplicate detection."
trigger_phrases:
  - "canonical dispatch receipts tasks"
  - "pre-spawn receipt tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
    last_updated_at: "2026-07-21T04:08:00Z"
    last_updated_by: "codex"
    recent_action: "Verified runtime and crash-cut matrix"
    next_safe_action: "Adopt the barrier only from a later authorized integration leaf"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Canonical Dispatch Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin phase-005 adapter/fingerprint fixtures and phase-006/004 interface versions [Evidence: `implementation-summary.md` implementation-summary.md Metadata; four executor-kind and 11-input fingerprint fixtures]
- [x] T002 Inventory manifest resolution, pool-worker invocation, and subprocess spawn boundaries [Evidence: `implementation-summary.md` ordered resolution pipeline and single caller-owned spawn callback]
- [x] T003 Define the `lineage_dispatch_resolved` registry entry, field allowlist, identity derivation, and typed errors [Evidence: `event-contract.ts`, `identity.ts`, `errors.ts`]
- [x] T004 Capture legacy command, manifest, pool, retry, budget, checkpoint, and artifact baselines [Evidence: `implementation-summary.md` completed phase-005 packet; zero existing writer/pool/runtime modifications]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the canonical dispatch-receipt schema and post-validation event builder [Evidence: `event-contract.ts`]
- [x] T006 Persist the exact phase-005 `invocationFingerprint` with version/algorithm metadata and normalized-fact checks [Evidence: `fingerprint.ts`; byte-equality and mutation tests]
- [x] T007 Add stable receipt, dispatch, run, leaf/logical-branch, attempt, causality, and idempotency identities [Evidence: `identity.ts`, closed payload, envelope builder]
- [x] T008 Add safe prompt/input/config digests and reject raw prompts, credentials, environment values, and run-master secrets [Evidence: `implementation-summary.md` closed allowlist and secret-canary test]
- [x] T009 Integrate `receipt-crypto.ts` canonicalization and MAC primitives with explicit advisory/durable verifier labeling [Evidence: `integrity.ts`; 11 frozen crypto vectors plus restart tests]
- [x] T010 Require transition authorization and a durable phase-006 append receipt before crossing the pool/spawn boundary [Evidence: `dispatch-barrier.ts`; real authorization/ledger spawn sentinels]
- [x] T011 Implement exact-repeat append reuse and same-identity/different-facts conflict rejection [Evidence: `implementation-summary.md` sequential/concurrent retry and conflict tests]
- [x] T012 Build the verified dispatch-receipt projection and resume state classifier [Evidence: `resume-projection.ts`]
- [x] T013 Emit unresolved handoff data for receipt-without-result cases without implementing successor result/salvage logic [Evidence: `implementation-summary.md` typed `reconcile` and `inspect-and-salvage` handoff]
- [x] T014 Wire additive-dark emission/comparison while preserving legacy authority and behavior [Evidence: `implementation-summary.md` new module only; `legacy-authoritative` barrier results]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify: Every leaf spawn has an earlier durable authorized receipt and ledger append evidence [Evidence: `dispatch-receipts.vitest.ts` four executor-kind spawn sentinels]
- [x] T016 Verify: Receipt facts cover executor kind, model, effort, search policy, executable/adapter versions, safe digests, and exact fingerprint [Evidence: `dispatch-receipts.vitest.ts` schema and evidence fixtures]
- [x] T017 Verify: Capability, authorization, append, and fsync failures invoke neither the pool worker nor spawn stub [Evidence: `dispatch-receipts.vitest.ts` stage, denied-policy, and storage fault matrix]
- [x] T018 Verify: Exact retries return the original sequence/hash receipt; changed facts under one identity fail closed [Evidence: `dispatch-receipts.vitest.ts` sequential/concurrent exact retry and changed-model conflict]
- [x] T019 Verify: Canonicalization/MAC vectors are stable, tampering fails, and process-local evidence is not accepted as restart authority [Evidence: `dispatch-receipts.vitest.ts` frozen receipt-crypto vectors and restart-provider test]
- [x] T020 Verify: Secret-injection fixtures leave no raw credential, prompt, environment, or run-master-secret material in events or logs [Evidence: `dispatch-receipts.vitest.ts` four-canary event/MAC scan; module has no logging calls]
- [x] T021 Verify: Resume rebuilds never-dispatched, already-resolved, result-recorded, unresolved, conflict, and corrupt states from ledger evidence [Evidence: `dispatch-receipts.vitest.ts` verified resume and corrupt-evidence groups]
- [x] T022 Verify: Receipt-only leaves enter recovery/salvage coordination and are neither completed nor blindly respawned [Evidence: `dispatch-receipts.vitest.ts` typed handoff and retry suppression]
- [x] T023 Verify: Crash cuts before append, after append/before spawn, during spawn, and after exit/before result are deterministic and duplicate-safe [Evidence: `dispatch-receipts.vitest.ts` crash-cut fixtures]
- [x] T024 Verify: Legacy phase-005 command, manifest, pool, retry, budget, checkpoint, and persisted-artifact baselines remain unchanged [Evidence: `implementation-summary.md` additive-only scoped status; no existing runtime path changed]
- [x] T025 Run strict spec validation and the targeted runtime build/typecheck/unit suite with non-zero discovery assertions [Evidence: `implementation-summary.md` 26 leaf tests, TypeScript exit 0, strict Errors 0 and Warnings 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
