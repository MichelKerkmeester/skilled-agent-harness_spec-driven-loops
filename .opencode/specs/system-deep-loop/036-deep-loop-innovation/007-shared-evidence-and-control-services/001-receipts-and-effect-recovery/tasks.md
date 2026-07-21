---
title: "Tasks: Receipts & Effect Recovery"
description: "Tasks for certified boundary receipts, stable effect idempotency, confirmation, and crash-resume reconciliation."
trigger_phrases:
  - "receipts and effect recovery tasks"
  - "effect recovery gateway tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
    last_updated_at: "2026-07-21T00:42:48Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the dark receipt and effect-recovery service"
    next_safe_action: "Consume the service only from a later authority-migration phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/receipts-and-effect-recovery.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Receipts & Effect Recovery

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

- [x] T001 Pin the candidate SHA plus phase-006 envelope, ledger, fingerprint, authorization-policy, and registry digests [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T002 Inventory every phase/mode boundary and shipped runtime effect/recovery surface; classify authoritative, dark, and fixture-only paths [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T003 Freeze receipt facts, event schemas, certification profiles, stable error codes, idempotency-key grammar, and recovery verdicts in contract fixtures [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T004 Build hermetic subprocess, filesystem, and API targets with deterministic crash and response-loss injection [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the registered phase/mode boundary map and canonical receipt-facts builder [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T006 Implement certification-provider registration, durable cross-resume verification, and explicit advisory treatment for shipped process-local HMAC receipts [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T007 Implement post-result receipt issuance, exact-repeat deduplication, same-key/different-facts conflict detection, and typed ledger append [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T008 Implement canonical effect intent and confirmation records with secret-safe metadata and stable deterministic idempotency keys [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T009 Implement the gateway order: authorization, durable intent, adapter execution, outcome verification, durable confirmation, response [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T010 [P] Implement the subprocess adapter with logical invocation identity, captured status/artifact evidence, and non-PID reconciliation [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T011 [P] Implement the file adapter with expected prior state, content digest, stable staging path, fsync, and atomic publication [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T012 [P] Implement the API adapter with provider idempotency propagation, status/read-after-write reconciliation, and non-replayable capability refusal [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T013 Implement verified unresolved-intent scanning plus `not_applied`, `applied`, `in_doubt`, and `conflict` recovery records [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T014 Implement recovery claim/fence integration, bounded retry, confirmation synthesis, and operator-resolution handling [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T015 Add dark compatibility seams for existing dispatch receipts, persisted waits, fan-out salvage, atomic state writes, and JSONL recovery [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Verify every registered boundary emits one receipt after its exact durable result and resulting ledger head [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T017 Verify restart-valid certification, tamper detection, unknown-scheme refusal, exact-repeat dedupe, and conflicting-facts rejection [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T018 Verify no adapter invocation occurs before a valid authorization and durable intent, and no success returns before durable confirmation [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T019 Run crash injection before intent, after intent, during effect, after target application, after confirmation, and during recovery retry [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T020 Race same-key retries and conflicting requests; prove one mutation or a typed conflict for every replay-safe adapter [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T021 Exercise all recovery verdicts for subprocess, file, and API adapters; prove `in_doubt` never auto-replays [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T022 Verify ledger records exclude credentials/raw secret payloads and carry bounded reason, evidence, retry, and claimant metadata [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T023 Run phase-006/004 composition, deterministic replay, shipped runtime regression, and strict spec validation gates [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] T024 Verify legacy outputs, production external-effect selection, and runtime authority remain unchanged before phase 014 [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] All requirements in spec.md met with evidence [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
- [x] Phase gate green (validate/build/test as applicable) [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding candidate artifact and verification result]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:evidence -->
## Completion Evidence

- T001-T004: the candidate SHA, substrate source hashes, registry/manifests, frozen fixtures, and runtime inventory are recorded in `implementation-summary.md`.
- T005-T015: the new `runtime/lib/receipts-and-effect-recovery/` service contains the boundary, certification, authorized-writer, gateway, adapter, recovery, replay, and legacy-observation modules.
- T016-T022: the focused Vitest contract discovers 12 boundaries and passes 46 ordering, certification, crash, concurrency, security, adapter, recovery, and replay tests.
- T023: focused composition and replay pass; project TypeScript and strict spec validation exit 0. The related shipped slice passes 143/144 tests, with the operator-excluded missing-`better-sqlite3` baseline recorded in the implementation summary.
- T024: path-scoped status/diffs show no change to the phase-006 substrate, existing writers, legacy recovery modules, or production effect selection.
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
