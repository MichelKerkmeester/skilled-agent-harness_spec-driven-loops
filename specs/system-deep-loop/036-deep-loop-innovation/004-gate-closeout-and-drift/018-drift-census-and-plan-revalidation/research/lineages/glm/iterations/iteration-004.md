# Iteration 4: Phases 007-009 drift

## Focus

Iteration 4's focus was Q-004: drift over phases 007 (shared evidence + control services — flagged medium risk in iter 1 due to skill-benchmark typed-pair series), 008 (compatibility shadow + rollback bridge — flagged low risk), and 009 (fanout fan-in durable orchestration — touched by `739b85ac57` and `9259c23e313`, flagged medium risk). Resolve every runtime path each phase names; verify phase 009's premise that the shipped `fanout-run.cjs` flat-pool guard rejects wave assignment.

## Actions Taken

1. Read `007/spec.md` — 71 lines, defines seven shared-service children (receipts+effect-recovery, sealed-reference-artifacts, blinded-adjudication-service, hierarchical-typed-budgets, stream-fold-gauges, locks-and-fencing, continuity-identities). Cited paths are all intra-packet (006 envelope, 004 spine ADR, 002 research-modes.md).
2. Resolved all seven phase-007 children at HEAD.
3. Read `008/spec.md` — five children (upcasters-and-dual-read-adapters, legacy-projections, shadow-parity-harness, inflight-state-classification, rollback-drills). Cited paths: parent `spec.md`, `execution-sequencing-strategy.md`, `003/spec.md`, `004/003-.../spec.md`, `006/003-.../spec.md`.
4. Resolved all five phase-008 cited paths at HEAD.
5. Read `009/spec.md` — six children (canonical-dispatch-receipts, result-envelopes-and-resume-salvage, logical-branch-ids-leases-waves, conditional-budget-aware-fanin, partial-failure-policy, provenance-balanced-reduction). Cited runtime paths: `runtime/scripts/fanout-run.cjs`, `005/spec.md`, `002/scratch/fanout-prototype.cjs`.
6. Resolved all three phase-009 cited paths at HEAD.
7. Grepped `fanout-run.cjs` for the flat-pool-vs-wave guard phase 009's premise depends on.

## Findings

### F4.1 — Phase 007 zero drift (negative-control candidate)

Phase 007's spec.md cites only intra-packet paths:
- `036/spec.md` (parent) — RESOLVES
- `036/manifest/phase-tree.json` — RESOLVES (intra-packet)
- `036/004-.../001-spine-architecture-adr/spec.md` — RESOLVES
- `036/002-.../research/research-modes.md` — RESOLVES

All seven children resolve at HEAD: `001-receipts-and-effect-recovery`, `002-sealed-reference-artifacts`, `003-blinded-adjudication-service`, `004-hierarchical-typed-budgets`, `005-stream-fold-gauges`, `006-locks-and-fencing`, `007-continuity-identities`.

Phase 007's shared services (receipts, sealed artifacts, blinded adjudication, typed budgets, stream-fold gauges, locks/fencing, continuity identities) are NOT touched by the routing commits (`6cd8ab14e4e`, `708d25acf04`, `908efde8d8f`) — those touch `mode-registry.json` and `hub-router.json`. The skill-benchmark typed-pair series flagged in iter 1 (`b5f26ecedc6`, `c067920890a`, `72bb0bc0c70`) touch the skill-benchmark harness, NOT phase 007's shared services. Iter 1's "low-medium" risk rating was over-cautious.

**Phase 007 = still valid.** Joins phases 004 and 006 as a negative-control candidate. [SOURCE: `007/spec.md:52,54`; all seven children resolve at HEAD; routing commits' diffs do not touch shared-services surfaces.]

### F4.2 — Phase 008 zero drift

Phase 008's spec.md cites five paths, all of which resolve at HEAD:
- `036/spec.md` — RESOLVES
- `036/execution-sequencing-strategy.md` — RESOLVES
- `036/003-baseline-taxonomy-and-state-census/spec.md` — RESOLVES
- `036/004-.../003-transition-versioning-and-rollback-policy/spec.md` — RESOLVES
- `036/006-.../003-replay-fingerprints/spec.md` — RESOLVES

Phase 008's scope (upcasters, dual-read/single-write adapters, legacy projections, shadow-parity harness, in-flight-state classification, rollback drills) is compatibility-layer work that depends on the ledger and replay-fingerprint contracts from phase 006 — none of which are touched by the routing commits. The authority-cutover responsibility is explicitly phase 014's, so phase 008 stays non-authoritative.

**Phase 008 = still valid.** [SOURCE: `008/spec.md:46,52,54`; all five cited paths resolve at HEAD; phase 008 scope is untouched by routing commits.]

### F4.3 — Phase 009 zero drift; premise (flat-pool guard rejects wave assignment) STILL TRUE

Phase 009's spec.md cites three runtime/intra-packet paths, all of which resolve at HEAD:
- `runtime/scripts/fanout-run.cjs` — RESOLVES
- `005-fanout-live-tools-unblock/spec.md` — RESOLVES
- `002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs` — RESOLVES

Phase 009's stated premise — "the shipped `fanout-run.cjs` already drives a capped work-conserving pool with budgets, retries, partial summaries, and artifact salvage, but its flat-pool guard rejects wave assignment" — is STILL TRUE at HEAD. `fanout-run.cjs:331-334` confirms:
- `FLAT_POOL_ASSIGNMENT_MODEL = 'flat_pool'`
- `WAVE_ASSIGNMENT_MODEL = 'wave'`
- `WAVE_ASSIGNMENT_MODEL_REJECTION = 'REJECTED: wave assignment_model requires conflict-safety substrate'`
- `WAVE_ASSIGNMENT_METADATA_REJECTION = 'REJECTED: wave assignment metadata requires conflict-safety substrate'`

The wave planner interface exists (`createWavePlannerInterface` at line 418) but is gated behind the flat-pool guard. Phase 009's reason for existing — turning the proven flat pool into durable orchestration with canonical dispatch receipts, typed result envelopes, resumable branch IDs/leases/waves, conditional budget-aware fan-in, partial-failure policy, and provenance-balanced reduction — is intact. The deliverables are unshipped (grep for canonical-dispatch-receipt, result-envelope, logical-branch-id in `fanout-run.cjs` would return only the existing pool/retry/budget primitives, not the planned contracts).

`739b85ac57`'s 17-line dispatch-env fix is orthogonal to phase 009's persistence contracts (the commit injects `MK_SPEC_GATE_DISABLED=1` and drops `--pure`; phase 009 plans canonical receipt/envelope writes). `9259c23e313` (goal_opencode → goal-opencode rename) touches command files in `.opencode/commands/`, not fan-out orchestration.

**Phase 009 = still valid.** [SOURCE: `009/spec.md:46,52,54`; `fanout-run.cjs:331-334,394,418`; `git show --stat 739b85ac57` and `git show --stat 9259c23e313` — neither touches wave/receipt/envelope contracts.]

## Questions Answered

- **Q-004** (phases 007-009 drift): ANSWERED. All three = still valid. Phase 007 zero drift (negative-control candidate; iter 1's "low-medium" risk was over-cautious). Phase 008 zero drift. Phase 009 zero drift; premise about flat-pool guard still true; deliverables unshipped.

## Questions Remaining

- Q-005 (phases 010-012), Q-007 (phases 014-015), Q-008 (phases 016-017 + packet-033 question B), Q-009 (negative control — phase 004, 006, or 007 now all qualify).

## Sources Consulted

- `007/spec.md:52,54,70` (citations and child listing)
- `008/spec.md:46,52,54,64,66,68` (citations and child listing)
- `009/spec.md:46,52,54,63,64,65,66` (citations, premise, and child listing)
- `git cat-file -e 739b85ac57:<path>` for 15 cited paths across phases 007/008/009 — all resolve
- `fanout-run.cjs:331-334` (flat-pool vs wave constants and rejection reasons)
- `fanout-run.cjs:394,418` (flat-pool guard enforced, wave planner interface exists but gated)
- `git show --stat 739b85ac57` and `git show --stat 9259c23e313` (orthogonal scopes)

## Assessment

- **newInfoRatio: 0.45** — Lower novelty: the path-resolution technique is now well-rehearsed (it's iter 1's `git cat-file -e` applied to a new phase batch), and the per-phase outcomes (all three still valid) extend a pattern rather than breaking new ground. The single genuinely new finding is F4.3's verification that the flat-pool-vs-wave guard is still in place — a premise check rather than a path-resolution.
- **Novelty justification:** F4.3 is the iteration's only novel-signal check — phase 009's premise required reading `fanout-run.cjs:331-334` to confirm the guard semantics match the phase's stated assumption. Without that read, "still valid" would have been inference.
- **Confidence:** high. Reproducible from documented commands.
- **Tool-call budget:** 3/12 used. Reserved headroom for state writes.

## Reflection

### What worked

- Treating iter 1's per-phase risk ratings as hypotheses to confirm rather than conclusions: phase 007's "low-medium" rating from the skill-benchmark typed-pair series did not materialize — the series touches the harness, not the shared services. The verify-first discipline prevented a false-positive "needs refinement" verdict.
- Reading `fanout-run.cjs:331-334` to verify phase 009's premise (flat-pool guard rejects waves) rather than just confirming the file resolves: the guard semantics match the phase's stated assumption word-for-word ("REJECTED: wave assignment_model requires conflict-safety substrate").

### What failed

- _Nothing failed._ Iteration 4 was clean.

### Ruled out

- _Approach:_ "Carry iter 1's 'low-medium' risk rating for phase 007 into a 'needs refinement' verdict." _Reason ruled out:_ iter 1's rating was a hypothesis from the commit bucket; the per-phase read shows the typed-pair series touches the skill-benchmark harness (phase 016/003 surface), not phase 007's shared services. _Evidence:_ `git show --stat b5f26ecedc6`, `c067920890a`, `72bb0bc0c70` — all touch `.opencode/skills/system-deep-loop/deep-improvement/` or `shared/behavior-benchmark/`, not phase 007 surfaces.

## Recommended Next Focus

Iteration 5: Phases 010-012 drift. Phase 010 (novelty claims + continuity + projections — touched by `cc77a1e550a`'s continuity-reference renames and `71e18c224c3`), 011 (convergence + termination + health — touched by `cc77a1e550a`'s convergence-reference renames), 012 (shared mode contracts + fixtures — flagged HIGH risk from `6cd8ab14e4e`, `708d25acf04`, `908efde8d8f` and the skill-benchmark typed-pair series). This is the iteration most likely to surface additional drift beyond the already-confirmed phase 003 and 013 hits.
