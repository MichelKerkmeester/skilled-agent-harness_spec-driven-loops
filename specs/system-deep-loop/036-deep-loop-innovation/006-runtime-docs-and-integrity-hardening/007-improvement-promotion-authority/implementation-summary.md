---
title: "Implementation Summary: 007-improvement-promotion-authority"
description: "All 13 promotion-authority findings landed additive-dark under 0d1827eef50, f6cdf604a25 and a28a39354b7 with named regression probes, then an independent adversarial pass found and fixed a Medium candidate-rebind TOCTOU gap under c897dcf294; go-live stays gated behind the additive-dark acceptance review (CHK-018)."
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
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded adversarial TOCTOU fix c897dcf294 re-binding candidate to approval at consumption"
    next_safe_action: "Pass the additive-dark acceptance review before promotion enforcement goes live"
    blockers:
      - "Additive-dark acceptance review must pass before promotion goes live (CHK-018)"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-approval-binding.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "All 13 findings landed additive-dark under 0d1827eef50, f6cdf604a25 and a28a39354b7; reconciled ab6aae0a714"
      - "Independent adversarial pass found and fixed a Medium candidate-rebind TOCTOU gap under c897dcf294 (CHK-005 done)"
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
| **Status** | **In Progress — code landed additive-dark + adversarially hardened; go-live gated behind acceptance review.** All 13 findings landed under `0d1827eef50`, `f6cdf604a25` and `a28a39354b7` (reconciled `ab6aae0a714`) with green named probes, and ADR-001 through ADR-004 are terminal. An independent adversarial pass then found and fixed a Medium candidate-rebind TOCTOU gap under `c897dcf294` (CHK-005). Promotion enforcement stays dark until the additive-dark acceptance review (CHK-018) passes; the full improvement-project pre-edit baseline and its whole-project delta also remain open. |
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
| Strict packet validator | Packet-local `Errors: 0` from the reconciled final state, with a single benign `CONTINUITY_FRESHNESS` `dirty_tree` warning that clears once the orchestrator commits this packet. T022's literal exit-0 criterion remains open until that commit, so the item is not marked done. |
| Landed commits | Findings shipped additive-dark under `0d1827eef50` (promotion/rollback/council receipt binding), `f6cdf604a25` (final 3: rollback-hash forgery + council path/symlink) and `a28a39354b7` (completes findings + ADRs); status reconciled `ab6aae0a714`. |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:adversarial -->
## Independent Adversarial Verification and Hardening

An independent adversarial pass — a different actor than the builder — re-audited the promotion authority and was productive: it found and fixed a real security gap before go-live.

**Finding (Medium, TOCTOU).** The approval receipt binds the approved candidate bytes, and `requireApprovalReceipt` checked that hash once. The check was not re-run at the byte-consuming boundaries. The single-phase promote copied the live candidate and the two-phase accept snapshotted it, both trusting the stale check across the intervening gate, git and mirror-sync I/O window. A concurrent writer with candidate-file access but not the signing key could swap bytes into a protected target after approval. The ship path already re-hashed; promote and accept did not, and that asymmetry was the gap.

**Fix.** One shared fail-closed guard, `assertCandidateMatchesApproval`, was added to `promote-candidate.cjs` (defined line 114). It re-derives the consumed bytes' hash and compares it to the approval binding, failing closed on mismatch or a missing binding. It is called when the accepted snapshot is taken (line 377) and immediately before the single-phase copy (line 1011), closing the promote/accept asymmetry against the already-hardened ship path. Landed `c897dcf294`.

**Negative test (red-before / green-after).** `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-approval-binding.vitest.ts` (4 cases) is RED when the guard is neutered and GREEN with it: a matching hash passes, a swapped hash fails closed with `approved_candidate_changed`, a missing binding fails closed, and a null receipt throws. Landed `c897dcf294`.

**Suites.** All six promotion suites pass — the adversarial pass reported 48 tests (up 4 from the prior 44), no regression, via `vitest`. Reproduced green at reconciliation: the promotion-authority suites run with 0 failures and the new binding suite contributes 4 passing cases.

**Residual findings (accepted deferrals, non-blocking).** Two LOW defense-in-depth items were flagged for follow-up, not for go-live:
1. `deep-ai-council/scripts/lib/persist-artifacts.cjs` `writeFileScoped` (line 511) does not `lstat` the final path component before `writeFileSync`, so a pre-existing symlink at that leaf inside an already-authorized council root would be followed (fixed content). `[Deferred: Low defense-in-depth, follow-up]`
2. `shared/rollback-candidate.cjs` (line 203) binds the receipt to `acceptedState.target` rather than the effective `args.target`; other gates throttle this to a byte-identical no-op, and the sibling `agent-improvement` rollback is the stricter pattern to mirror. `[Deferred: Low defense-in-depth, follow-up]`
<!-- /ANCHOR:adversarial -->

<!-- ANCHOR:files -->
## Files Changed

All runtime changes below landed additive-dark; the following commits are reachable from `HEAD`:

| Commit | Landed change |
|--------|---------------|
| `0d1827eef50` | Bind promotion/rollback/council to authenticated receipts and authorized roots (receipt module `promotion-receipts.cjs`, promote/ship/rollback consumers, evaluator authority, containment, council roots, fail-closed gates) |
| `f6cdf604a25` | Close the final 3 findings — rollback-hash forgery (`F-017-04`) plus council path/symlink escapes (`F-019-01`, `F-019-02`) |
| `a28a39354b7` | Complete the 13-finding runtime scope and accept ADR-001..ADR-003 (`promotion-receipts.cjs` last touched here) |
| `ab6aae0a714` | Reconcile packet status to 13/13 landed |
| `c897dcf294` | Adversarial hardening — re-bind candidate to approval at every consumption boundary (`assertCandidateMatchesApproval` in `promote-candidate.cjs` plus its negative test) |

- Promotion authority: shared receipt module, promote/rollback scripts, direct score/rollback scripts, autonomous YAML, sweep parser, and their packet-scoped tests.
- Council authority: persistence, topic/session orchestration, graph replay, council test configuration, stale CLI expectation, and their tests.
- Runtime compatibility: `runtime/lib/council/council-graph-db.ts`.
- Packet reconciliation: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and this summary.

No package manifest or lockfile changed. The test-mutated `council-graph.sqlite` was restored exactly from `HEAD` and is absent from the final scoped diff.
<!-- /ANCHOR:files -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Go-live gate (additive-dark)**: the runtime landed additive-dark under `0d1827eef50`, `f6cdf604a25`, `a28a39354b7` and `c897dcf294`, so REQ-U05's immutable candidate-SHA evidence now exists and the earlier "uncommitted working-tree candidate" limitation no longer holds. Promotion enforcement stays dark and does not go live until the additive-dark acceptance review (CHK-018) passes. That review is an external sign-off this session cannot produce, so CHK-018 remains open.
2. **Operator advisory — root of trust and delta-less promotion**: the target manifest is the un-authenticated root of trust for evaluator identity (profile, agent, epoch, canonical source); authenticating or protecting the manifest is recommended before go-live. Separately, a benchmark report that carries no delta contract promotes on recommendation plus aggregate plus repeatability without regression evidence — this is by design for baseline-less runs, but the operator should weigh it before the dark-to-live flip.
3. **Residual defense-in-depth deferrals**: two LOW items are accepted as follow-up, not blocking (see Independent Adversarial Verification and Hardening): `persist-artifacts.cjs` `writeFileScoped` does not `lstat` the final path component, and `rollback-candidate.cjs` binds the receipt to `acceptedState.target` rather than the effective `args.target`. `[Deferred: Low defense-in-depth, follow-up]`
4. **Full improvement baseline**: only the packet-selected improvement baseline was captured before edits; the entire 52-file project was not. The adversarial close re-ran and delta'd the affected promotion suites (44 -> 48, +4, no regression) and the council project (109/2 -> 118/0), but the full-project pre-edit baseline (T002) and its whole-project delta remain open at CHK-002/CHK-010/T020.
5. **Strict validation residual**: the reconciled packet validates with `Errors: 0` and a single benign `CONTINUITY_FRESHNESS` `dirty_tree` warning, because the packet is intentionally left uncommitted for the orchestrator to land. That warning clears on commit; until then T022's literal exit-0 criterion stays open and packet-local `Errors: 0` is not represented as exit-0 completion.
6. **Per-finding red proof**: the adversarial TOCTOU finding carries a genuine red-before/green-after negative test (`promote-candidate-approval-binding.vitest.ts`, landed `c897dcf294`). The original 13 findings carry final named green probes, but not every probe was executed against the untouched base revision, so their retroactive red-before observation stays a documented deferral.
<!-- /ANCHOR:limitations -->
