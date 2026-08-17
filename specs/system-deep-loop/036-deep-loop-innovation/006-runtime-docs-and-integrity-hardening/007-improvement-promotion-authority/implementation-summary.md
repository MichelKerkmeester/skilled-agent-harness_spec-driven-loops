---
title: "Implementation Summary: 007-improvement-promotion-authority"
description: "All 13 promotion-authority findings are implemented or confirmed with named regression probes; formal packet closeout remains partial pending immutable-SHA evidence, independent verification, and main-checkout strict validation."
trigger_phrases:
  - "improvement promotion authority implementation"
  - "acceptance receipt binding evidence"
  - "deep loop promotion integrity"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/007-improvement-promotion-authority"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the full 13-finding runtime scope; accepted ADR-001 through ADR-003"
    next_safe_action: "Commit, independent verification, main validation"
    blockers:
      - "Sandbox cannot write the shared Git index, so no candidate commit SHA exists"
      - "REQ-U04 requires a different actor"
      - "Worktree strict validation cannot complete its command-tree environment check"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promotion-receipts.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs"
    completion_pct: 88
    open_questions:
      - "Who will perform the independent adversarial pass?"
    answered_questions:
      - "Autonomous mode is advisory-only under the operator's no-dark-to-live-authority-flip constraint"
      - "Evaluator authority comes from the target manifest, never candidate frontmatter"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

# Implementation Summary: 007-improvement-promotion-authority

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-improvement-promotion-authority |
| **Base HEAD** | `149742c46260277ae26df6fe6cfe582a9d02454d` |
| **Level** | 3 |
| **Status** | **In Progress — runtime implementation complete; verification closeout partial.** All 13 findings have green named probes and ADR-001 through ADR-003 are Accepted, but immutable candidate-SHA evidence, an independent actor, and main-checkout strict validation remain open. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Promotion now depends on authenticated, non-replaceable evidence rather than mutable local JSON. `promotion-receipts.cjs` canonicalizes the decided fields, authenticates them with HMAC-SHA256, creates receipt files exclusively (`wx`), fsyncs them, and rejects tampering, replacement, symlinks, missing evaluator epochs, weak/missing keys, and incorrect key IDs. Approval receipts bind candidate bytes, target preimage, score/input hash, benchmark, repeatability, configuration, manifest, approval identity, evaluator profile/name, and epoch. Acceptance receipts additionally bind the acceptance state, candidate snapshot, and pre-accept backup.

Promotion, ship, shared rollback, and direct rollback verify those receipts and exact hashes. The evaluator fallback to candidate frontmatter is gone: the target manifest supplies profile, agent, epoch, and canonical evaluator source, and absence fails closed. Autonomous benchmarking is advisory-only. Every promotion/rollback output boundary is contained. Council roots come from configured authority roots, unsafe topic IDs are rejected, and payload output is confined before directory creation. Numeric and textless-stream gates fail closed.

The council graph adapter now uses Node's built-in `node:sqlite`, eliminating the stale native `better-sqlite3` ABI dependency that failed under Node 25. The stale council CLI test now uses the current curated `swe` model rather than the removed `adaptive` model.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work was grouped by authority boundary: first authenticated receipt issuance and verification, then promotion/ship/rollback consumers, evaluator authority, full path containment, council-root enforcement, and fail-closed parser/numeric gates. Each confirmed gap received a named negative regression probe. Existing behavior outside promotion authority remains unchanged, and autonomous recommendations stay dark until a separate operator-authorized promotion session.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:findings -->
## Thirteen-Finding Evidence Matrix

Affected-test aggregate suite-content SHA-256: `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`.

| Finding | Result | Production probe | Named regression probe |
|---------|--------|------------------|------------------------|
| `F-021-01` | **IMPLEMENTED-NOW** | Advisory-only promotion step in `deep-model-benchmark-auto.yaml`; signed approval required by `promote-candidate.cjs` | `is advisory-only and cannot invoke a canonical promotion command` |
| `F-021-02` | **CONFIRMED-WAS-LANDED** | `remediate-hook.cjs` checks confirmation in `enterRemediateHook` and `main` | `REMEDIATE requires confirmation at both module and CLI boundaries` |
| `F-017-01` | **IMPLEMENTED-NOW** | `requireApprovalReceipt` checks exact candidate/target and score input binding | `rejects a stale approval receipt after the candidate bytes change`; different-candidate and different-target companion tests |
| `F-017-02` | **IMPLEMENTED-NOW** | `assertAllBoundaries` runs before output creation | `rejects an uncontained %s before creating output` (five-boundary matrix) |
| `F-017-03` | **IMPLEMENTED-NOW** | `assertShipPreconditions` authenticates the acceptance receipt and its state/snapshot | `rejects a forged acceptance JSON that has no authenticated receipt` |
| `F-017-04` | **IMPLEMENTED-NOW** | Shared rollback requires authenticated acceptance and the accepted-candidate current hash | `refuses a forged acceptance file with no receipt, even when the OR hash guard would pass` |
| `F-017-05` | **IMPLEMENTED-NOW** | `resolveEvaluatorAuthority` reads only manifest authority and canonical source | `ignores candidate frontmatter when selecting evaluator identity and rubric source`; `fails closed when no evaluator authority manifest is supplied` |
| `F-019-01` | **IMPLEMENTED-NOW** | `authorizedSpecRoots` plus `councilRootFor` reject caller-selected external roots | `refuses a caller-selected packet root outside configured authority before mkdir` |
| `F-019-02` | **IMPLEMENTED-NOW** | `normalizeTopicId` enforces strict lowercase hyphenated IDs in topic and session paths | `rejects unsafe topic id %s before creating any topic directory` |
| `F-019-03` | **IMPLEMENTED-NOW** | `assertMemorySavePayloadOutSafe` confines output inside the authorized council root | `rejects a payload output outside the authorized council root` |
| `F-008-01` | **CONFIRMED-WAS-LANDED** (coverage expanded) | `Number.isFinite` gates for aggregate, score, and delta | absent/non-numeric/infinite aggregate tests plus `rejects an absent or non-finite agent %s value %j` |
| `F-008-02` | **CONFIRMED-WAS-LANDED** (parser hardened) | `dispatchCell` treats missing/non-string assistant output as empty and unscorable | `marks a successful textless JSONL stream unscorable without throwing` |
| `F-008-03` | **IMPLEMENTED-NOW** | Direct rollback verifies authenticated backup/config/manifest/current-target bindings | `rejects a backup whose bytes no longer match the authenticated rollback binding` |
<!-- /ANCHOR:findings -->

<!-- ANCHOR:council-failures -->
## The Two Council Failures

| Baseline failure | Root cause | Fix | Final probe |
|------------------|------------|-----|-------------|
| Council session CLI rejected model `adaptive` | The test asserted a removed model while the current curated CLI roster uses `swe` | Updated the stale assertion and expected subprocess arguments to `swe`; runtime behavior was not widened | Full council project: 10 files, 118 passed, exit 0 |
| Council graph replay could not load `better-sqlite3` | Native module ABI 127 was incompatible with Node 25 ABI 141 | Replaced the runtime adapter with built-in `node:sqlite` `DatabaseSync`, preserved the query/transaction API, and normalized bigint/number change counts | `council-graph-db and council-graph-query` six-test suite plus full council replay, exit 0 |

Council delta: **before 109 passed / 2 failed / exit 1; after 118 passed / 0 failed / exit 0**.
<!-- /ANCHOR:council-failures -->

<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Status | Implemented decision |
|-----|--------|----------------------|
| ADR-001 | **Accepted** | HMAC-authenticated, exclusive-create approval and acceptance receipts carry every decided authority/evidence field and are verified by promotion, ship, and rollback. |
| ADR-002 | **Accepted** | Manifest-owned evaluator profile/name/epoch/source replaces candidate-derived selection; missing authority has a negative fail-closed test. |
| ADR-003 | **Accepted** | Promotion/rollback boundaries and configured council-root/topic/payload boundaries are contained before writes or `mkdir`. |

The reserved autonomous-mode decision is also terminal: ADR-004 is **Accepted, advisory-only**, based on the operator's explicit no-dark-to-live-authority-flip constraint.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Promotion-authority affected matrix | 8 files, 52 tests passed, exit 0 |
| Sweep acceptance/runtime | 2 files, 25 tests passed, exit 0 |
| Council project | 10 files, 118 tests passed, exit 0 |
| REMEDIATE authorization + state-machine wiring | 2 tests passed, exit 0 |
| TypeScript | `npx --no-install tsc --noEmit --ignoreDeprecations 6.0`, exit 0 |
| Receipt write-cost probe | 100 writes, 485.381 ms total, 4.854 ms mean, exit 0 (current cost only; no before/after claim) |
| Full improvement project | 52 files; 530 passed, 45 failed, exit 1. The failures point at paths outside this packet, but their pre-existence was not proven against a full base run; no no-regression claim is made. |
| Strict packet validator | Packet-local `Errors: 0`, `Warnings: 0`, `RESULT: PASSED`; process exit 2. The output does not identify a packet-local failure, but T022 remains open because its literal exit-0 criterion was not met. |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:files -->
## Files Changed

- Promotion authority: shared receipt module, promote/rollback scripts, direct score/rollback scripts, autonomous YAML, sweep parser, and their packet-scoped tests.
- Council authority: persistence, topic/session orchestration, graph replay, council test configuration, stale CLI expectation, and their tests.
- Runtime compatibility: `runtime/lib/council/council-graph-db.ts`.
- Packet reconciliation: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and this summary.

No package manifest or lockfile changed. The test-mutated `council-graph.sqlite` was restored exactly from `HEAD` and is absent from the final scoped diff.
<!-- /ANCHOR:files -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Immutable candidate SHA**: the sandbox cannot create the shared Git index lock (`Operation not permitted`), so the implementation remains an uncommitted working-tree candidate. REQ-U05 and every checklist checkbox remain open rather than citing the unchanged base SHA falsely.
2. **Independent actor**: this was a single-builder session and sub-agent delegation was not authorized. REQ-U04/T021/CHK-005 remain open.
3. **Full improvement baseline**: only the packet-selected improvement baseline was captured before edits; the entire 52-file project was not. T002/T020 and the whole-project delta claim remain open.
4. **Strict validation environment**: the required worktree run is recorded after reconciliation. Any command-tree/tsx/level-contract environment failure will remain open and must be repeated from main; packet-local `Errors: 0` alone is not represented as exit-0 completion.
5. **Per-finding red proof**: every finding has a final named green probe, but not every probe was executed against the untouched base revision. CHK-003 remains open rather than retroactively claiming a red-before observation.
<!-- /ANCHOR:limitations -->
