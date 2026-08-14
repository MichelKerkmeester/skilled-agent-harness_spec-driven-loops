---
title: "Implementation Summary: Make Alignment Coverage, Seal State and Lane Identity Provable"
description: "Alignment coverage now fails closed, uses one hashed lane identity, and credits only slice-bound per-artifact evidence."
trigger_phrases:
  - "alignment coverage integrity implementation"
  - "alignment evidence-bound coverage"
  - "deep loop 026 implementation summary"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-alignment-coverage-integrity"
    last_updated_at: "2026-08-07T23:01:27Z"
    last_updated_by: "codex"
    recent_action: "Landed as ca64df3f55+ee8c4dd67a+c83c53d44c+1578d8533e on skilled/v4.0.0.0"
    next_safe_action: "None — all findings landed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The three derived actions are accepted as ADR-004, ADR-005, and ADR-006"
      - "The alignment lane uses deep-alignment/scripts/check-convergence.cjs, not the review convergence runtime"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

# Implementation Summary: Make Alignment Coverage, Seal State and Lane Identity Provable

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-alignment-coverage-integrity |
| **Spec Folder Path** | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-alignment-coverage-integrity` |
| **Completed** | 2026-08-07 |
| **Level** | 3 |
| **Status** | Completed |
| **Candidate SHA** | `9229cb8f3e281c9291e6d631237528bc755e6f4b` |
| **Landed Commits** | `ca64df3f55` + `ee8c4dd67a` + `c83c53d44c` + `1578d8533e` on `skilled/v4.0.0.0` |
| **Rollback** | Restore the touched implementation and test files to `5c98e4654e4bcaf2c7002412d6da2b92f1793942`; preserve the `leaf-artifact-writer.ts` 020 module header when restoring. |
<!-- /ANCHOR:metadata -->

### Executive Summary

Alignment coverage is now a claim with an inspectable proof chain. Corpus readers distinguish absent, valid-empty, malformed, and configured-lane-missing states; lane identity is a hash of one shared canonical object containing adapter and scope type; and coverage credit comes only from evidence-bearing artifacts in the dispatched slice. The terminal workflow requires a valid corpus and `sealed === true` before completion.

The change preserves valid scope bytes, excludes failed, stuck, and timed-out iterations, keeps count-only records observational, returns measured live-render receipts, and records the actual alignment convergence backend in the registry.

### T001 Confirm-First Record

The fifteen findings carrying a review `CONFIRMED` mark were re-read at HEAD. The confirmed cases use the required calibration: **the actor is the operator or a stale local file, NOT a remote attacker — cutover-readiness / robustness risk, NOT breach risk.** No edit was based on an unconfirmed or already-fixed finding; moved findings were re-anchored to the current implementation before the fix.

| Finding | Review mark | T001 status | HEAD probe and disposition |
|---------|-------------|-------------|----------------------------|
| F-009-01 | CONFIRMED | ALREADY-FIXED | Current convergence path already rejects absent and malformed discovery; explicit corpus states and zero coverage are now covered at `check-convergence.cjs:115-247`, guarded by `coverage-integrity.test.cjs` absent/malformed cases. |
| F-009-02 | CONFIRMED | ALREADY-FIXED | The current reducer already had corpus-bounded reporting; the remaining self-attestation path moved to evidence-bound credit at `reduce-alignment-state.cjs:454-513`, guarded by the unearned-credit case. |
| F-009-03 | unverified | MOVED | The collision path moved to shared `laneKey` at `alignment-identity.cjs:44-64`; adapter is part of the hashed canonical object. |
| F-009-04 | unverified | MOVED | The caller-controlled receipt path moved to `sk-design-live-render.cjs:541`; the adapter now requires structured measurements. |
| F-009-05 | unverified | MOVED | The live-render artifact identity path moved to shared artifact identity and partition resolution at `partition-corpus.cjs:90-152`. |
| F-009-06 | unverified | MOVED | Interactive selection now retains the adapter at `scoping.cjs:240-252`; `scoping-adapter.test.cjs` is the guard. |
| F-RES-01 | CONFIRMED | ALREADY-FIXED | Workflow consumers already exposed discovery and seal gates; the terminal assertion remains explicit at `deep-alignment-auto.yaml:794-806` and the confirm workflow equivalent. |
| F-RES-02 | CONFIRMED | ALREADY-FIXED | The reducer already had discovery/integrity gating; the terminal predicate is now explicit at `reduce-alignment-state.cjs:731-735` and includes corpus state validity. |
| F-RES-03 | CONFIRMED | ALREADY-FIXED | Successful-iteration filtering was present at `reduce-alignment-state.cjs:429-437`; the failed/stuck/timeout regression is locked by `coverage-integrity.test.cjs:854-883`. |
| F-RES-04 | CONFIRMED | MOVED | Self-attestation moved to the closed writer boundary at `leaf-artifact-writer.ts:201-313`; evidence and slice validation are now required. |
| F-RES-05 | CONFIRMED | MOVED | Non-injective lane construction moved to `alignment-identity.cjs:44-64`; scope type, adapter, and canonical object hashing are tested. |
| F-RES-06 | CONFIRMED | MOVED | The cursor defect moved to credited-identity partitioning at `partition-corpus.cjs:90-152`; count-only progress remains eligible but never complete. |
| F-SOL-01 | CONFIRMED | ALREADY-FIXED | Configured/corpus lane membership validation was present; the four-state readers make the missing-lane result explicit at `check-convergence.cjs:193-245` and `reduce-alignment-state.cjs:238-257`. |
| F-SOL-02 | CONFIRMED | ALREADY-FIXED | Duplicate and orphan lane checks were present; both readers now use the same identity and differential fixtures at `coverage-integrity.test.cjs:326-365` and `543-575`. |
| F-SOL-03 | CONFIRMED | ALREADY-FIXED | Absent discovery already had a fail-closed branch; the named `absent` state and workflow refusal are now asserted at `coverage-integrity.test.cjs:375-395` and `830-852`. |
| F-SOL-04 | CONFIRMED | MOVED | Normalization divergence moved to the shared byte-preserving normalizer at `alignment-identity.cjs:12-51`; ADR-004 records the over-tightening regression decision. |
| F-SOL-05 | CONFIRMED | ALREADY-FIXED | Workflow handling already had explicit discovery branches; both auto and confirm paths now retain the refusal before synthesis. |
| F-SOL-06 | CONFIRMED | ALREADY-FIXED | Valid zero-artifact handling existed; it is now named `present-valid-zero-artifacts` and separated from configured-lane-missing at `check-convergence.cjs:238-245`. |
| F-SOL-07 | CONFIRMED | MOVED | Reducer count-only credit was already non-authoritative; the remaining cursor fallback moved to `partition-corpus.cjs` and is closed by the count-only test. |
| F-026-04 | unverified | MOVED | Registry metadata moved to the actual custom backend at `mode-registry.json:177-179`, with the routing contract documented in `SKILL.md:54-79`. |

<!-- ANCHOR:what-built -->
## What Was Built

### Shared identity and corpus state

`alignment-identity.cjs` is the single normalizer used by the convergence checker, reducer, and partitioner. It preserves valid scope bytes, canonicalizes object-key order, and hashes a versioned object containing authority, adapter, artifact class, and typed scope. Artifact identities are also typed and shared. Both corpus readers expose the four named states and reject invalid or duplicate artifact identities.

### Evidence-bound coverage and terminal sealing

The reducer intersects credited identities with the canonical corpus and accepts credit only when the evidence identity appears in both `artifactsChecked` and the dispatched slice. Evidence must be a finding, a valid SHA-256 content digest, or a measured adapter receipt. Successful iteration records alone contribute coverage and stability. The seal predicate requires the upstream seal marker, a present valid corpus, no integrity fault, and completed discovery.

### Producer and workflow contracts

The leaf writer requires `dispatchedSlice` and per-artifact evidence without restructuring the durable publication boundary. The live-render adapter creates a measured receipt with a measurement digest and refuses a caller-supplied dispatch string without measurements. Auto and confirm workflows carry the slice/evidence contract and refuse unsealed or pre-discovery completion. The partition cursor advances only from credited identity evidence, and interactive scoping retains adapter identity.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed confirm-first red/green cycles: the cited implementation sites were re-read at HEAD, each residual defect received a failing fixture before its patch, and the affected alignment and runtime suites were run per file. The change landed as `ca64df3f55` (leaf-artifact-writer + reducer), `ee8c4dd67a` (alignment-identity.cjs), `c83c53d44c` (deep-alignment scripts and tests), and `1578d8533e` (mode-registry backend registration) on `skilled/v4.0.0.0`.

An independent read-only reviewer returned CONFIRMED PASS after probing the status-less failed-delta exclusion, target-object live receipt, seal/workflow wiring, registry identity, and scoped comment/ID hygiene.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

ADR-001 through ADR-003 are accepted. The three findings whose source register did not supply actions are now accepted as:

- ADR-004: preserve valid scope bytes while sharing the normalizer, fixing the over-tightening regression.
- ADR-005: distinguish a valid empty corpus from a configured-lane-missing integrity mismatch.
- ADR-006: treat bare counts as activity signals, never coverage credit or cursor progress.

The lane identity rekeying consequence is stated once in `decision-record.md` ADR-001: in-flight state keyed by the old identity requires a fresh run rather than an attempted rekey.
<!-- /ANCHOR:decisions -->

### Red-to-Green Evidence

| Defect class | Red-before receipt | Green receipt |
|--------------|--------------------|---------------|
| Lane collision, unearned corpus claim, and unmeasured live check | `coverage-integrity.test.cjs` pre-fix: 33 tests, 30 pass, 3 fail | 38/38 pass; named cases plus the duplicate-comma fixture |
| Count-only cursor advance | `partition-identity-progress.test.cjs` pre-fix asserted `done: true` incorrectly | 1/1 pass; count-only corpus remains fully eligible at lines 79-101 |
| Interactive adapter loss | `scoping-adapter.test.cjs` pre-fix returned the authority adapter | 1/1 pass with selected adapter retained |
| Pre-discovery sealing | `reducer-seal-state.test.cjs` pre-fix accepted the new pre-discovery seal assertion | 1/1 pass; absent corpus cannot seal |
| Leaf self-attestation and live target identity | `leaf-artifact-writer.vitest.ts` pre-fix accepted an empty evidence array and rejected a typed target identity | 24/24 pass; empty-evidence and measured-target cases pass |
| Failed/stuck/timed-out evidence | `coverage-integrity.test.cjs` pre-fix counted a failed delta finding | 38/38 pass; failed, status-less failed, stuck, timeout, and unknown-status cases contribute no evidence |

Already-fixed T001 findings retained their existing guards; no new implementation was built against them without a confirming probe.

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript | Pinned TypeScript 5.9.3, `tsc --noEmit -p tsconfig.json`, rc 0; local dependency directory was absent, so verification used an isolated temporary type-root cache |
| Alignment coverage | `coverage-integrity.test.cjs`, 38/38, rc 0 |
| Partition identity progress | 1/1, rc 0 |
| Reducer fail-closed | 1/1, rc 0 |
| Reducer seal state | 1/1, rc 0 |
| Scoping adapter | 1/1, rc 0 |
| State-machine wiring | 1/1, rc 0 |
| Leaf artifact writer | `leaf-artifact-writer.vitest.ts`, 24/24, rc 0 |
| Runtime convergence helper | `convergence-score-delta.vitest.ts`, 6/6, rc 0 |
| Whole alignment script gate | 56 total, 49 pass, 5 pre-existing failures, 2 skips, rc 1; no new failures |

The five allowed failures are the existing `031` command-contract surfaces: `command-behavior-matrix`, `command-scenario-rollout` (two assertions), `command-topology-pilot`, and `sk-doc-command-adapter`. Their missing DAB fixtures/template and marker mismatch are outside this child. The whole Vitest process was not run because the repository instruction says it hangs on the append lock; affected runtime suites were run per file.

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The worktree contains unrelated pre-existing changes; this packet did not reset or clean them. `git checkout -- database/` could not acquire the linked-worktree index lock (`Operation not permitted`), and no database files were changed by this packet.
<!-- /ANCHOR:limitations -->
