---
title: "Implementation Summary: Compiled-Routing Cutover Hardening"
description: "All nine round-1 findings from the deep-review remediation are built and verified: P1-004 checklist reconciliation, P2-005 frozen-scorer contract centralization, P1-001 crash-safe reconcile, P1-002 sandboxed harness, P1-003 activation confinement, P1-006 harness matrix, P1-007/P1-008 shared hub lock, and P2-009 cache-lifecycle contract. Round 2: a follow-up re-review's iteration 1 surfaced three further issues in the round-1 hardening — RR-P1-A (atomic lock winner election), RR-P1-B (write-ahead journal fence recovery), RR-P2-C (honest lock-comment residual) — now closed by a redesign. Round 3: restored the audit-record self-heal Round 2's journal had dropped (idempotent-path rebuild of a deleted serving-flip-record). Harness 11/11, node --check clean, live activation state untouched; the external reducer blocker that halted Round 2's re-review is fixed (system-deep-loop/033) and a 3-iteration confirming re-review cleared the reducer."
trigger_phrases:
  - "cutover hardening implementation summary"
  - "frozen scorer contract module"
importance_tier: "high"
contextType: "implementation"
---
# Implementation Summary: Compiled-Routing Cutover Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete — all nine round-1 deep-review findings (7 P1 + 2 P2) are built and verified. `node --check` clean on all 7 touched runtime files; harness `verify-runtime-engine.cjs` 9/9 at round-1 close; LIVE activation tree byte-identical before/after (git-dirty 0). **Round 2**: a fresh 10-iteration `/deep:review` completed iteration 1 (then halted on an unrelated reducer/strategy-anchor workflow-infra bug — an external blocker, not a packet finding) and surfaced three further issues in the round-1 hardening (RR-P1-A, RR-P1-B, RR-P2-C), now closed by a redesign: harness **10/10**, LIVE activation tree still byte-identical after a harness run (git-dirty 0). The remaining nine re-review iterations have not run — blocked by the external infra bug, recommended as follow-up once resolved |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Strict validation** | `validate.sh --strict` — Errors: 0 on this packet and both touched sibling folders |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 10-iteration `/deep:review` of the P4b compiled-routing cutover returned **CONDITIONAL** with nine findings (0 P0, 7 P1, 2 P2) — the routing correctness itself confirmed sound, the rest robustness/evidence hardening. This packet now closes all nine.

- **P1-004 — release-readiness reconciliation.** The `010-live-activation` checklist claimed advisor-hook machine-enforcement was *complete* and asserted a "fresh 3-model × 7-hub sweep," contradicting `spec.md` (which says enforcement is *in progress* and treats post-flip verification as T9 + flag-off inertness) and both impl-summaries. Corrected the checklist downward: machine-enforcement reads *in progress* (the enrichment is committed with flag-off byte-parity proven), and the post-flip sweep is framed as the bounded 2-prompt-per-hub sample it was, citing `real-model/<hub>/verdict.json`. The spec and checklist now agree, and every retained claim is traceable.
- **P2-005 — one frozen-scorer contract.** `flip-serving.cjs` and `activate-hub.cjs` each embedded the same three pinned scorer digests and their own `assertScorerFrozen`. Extracted `shared/frozen-scorer-contract.cjs` — a read-only module exporting `PINNED_SCORER_DIGESTS` and a phase-parameterized `assertScorerFrozen(repoRoot, phase)`. Both writers now import it; each keeps a phase-specific failure message (`'the serving flip'` / `'activation'`). The pinned digests are byte-identical to the prior copies and the scorer files are never touched.
- **P1-001 — crash-safe tuple reconciliation.** `flip-serving.cjs` now runs a `reconcileTuple()` on the idempotent no-op path, under the shared hub lock: a crash-left half-committed tuple (missing/stale serving-flip-record or fence) is rebuilt from the authoritative manifest before the no-op returns.
- **P1-002 — sandboxed regression harness.** `011-runtime-engine/harness/verify-runtime-engine.cjs` was rewritten to run entirely against a temp SANDBOX copy of `activation/`, via a new `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook added to `flip-serving.cjs` and `resolve.cjs`. The harness never touches live state and deletes the sandbox on exit.
- **P1-003 — activation confinement.** `activate-hub.cjs` gained a `confineArgs()` gate that runs before any side effect: the hub id must match `^[a-z0-9][a-z0-9-]*$`, the hub dir must resolve inside the activation root, and `--child` must resolve inside the repo.
- **P1-006 — harness matrix completeness.** The harness adds explicit both-decision coverage (asserts a route AND a negative decision are exercised) and a serve-time identity-MISMATCH fixture (a tampered manifest fails safe to legacy).
- **P1-007 — single per-hub lock.** `shared/hub-lock.cjs` (new) is the one lock both `flip-serving.cjs` and `activate-hub.cjs` now take, so activation and flip can no longer consume one fence epoch independently.
- **P1-008 — lock recovery.** `shared/hub-lock.cjs` records owner identity (pid + random nonce + timestamp) and a 10-minute lease; a live holder is refused on collision, but a stale holder (dead pid OR expired lease) is safely reclaimed.
- **P2-009 — engine cache contract.** `compiled-route.cjs`'s process-lifetime engine cache is now a documented contract (comment): safe because the resolver's serve-time identity gate fails a drifted snapshot to legacy, and a restart picks up a new policy.

### Round 2 (re-review remediation)

A fresh 10-iteration `/deep:review` of this round-1 hardening completed iteration 1, then halted on an unrelated reducer/strategy-anchor workflow-infra bug — an external blocker in the review harness itself, not a finding against this packet. Iteration 1 nonetheless surfaced three real issues in the round-1 code, now closed by a redesign:

- **RR-P1-A — atomic lock winner election.** `shared/hub-lock.cjs`'s stale-lock reclaim was a write-then-read, not an atomic election — two stale-lock reclaimers could both enter the critical section. Rebuilt on an atomic `mkdir` lock directory (`mkdir` is an atomic exclusive create — a real winner election); owner identity (pid + nonce + lease) now lives in `owner.json` inside the lock dir; stale reclaim re-checks staleness immediately before clearing the dead dir and re-races the `mkdir`.
- **RR-P1-B — write-ahead journal for the serving flip.** The old `reconcileTuple()` rebuilt a crash-left record but did not advance the fence, so it could certify a crash-interrupted flip at a stale epoch. Replaced with a write-ahead journal: `flip-serving.cjs` writes `.flip-journal.json` (intent + selectedPolicy + before/after fence) BEFORE mutating the tuple and clears it only AFTER every tuple member is written; `recoverFromJournal()` completes an interrupted flip deterministically to the journal's intended (advanced) fence on the next run.
- **RR-P2-C — honest lock documentation.** `hub-lock.cjs`'s header comment overclaimed a PID-reuse/start-stamp check the code did not implement. Corrected to describe the real mechanism (mkdir lock + lease + `kill(pid,0)` liveness probe) and to honestly document the residual: perfectly race-free stale reclaim needs OS advisory locking (flock/fcntl), unavailable in zero-dependency Node; PID reuse within an unexpired lease is bounded by the 10-minute lease, not detected.

### Round 3 (audit-record self-heal restoration)

Round 2's write-ahead journal rebuilds the serving-flip record only during recovery (from a journal); a record deleted *after* a clean flip — with no journal present — was therefore no longer rebuilt (round 1's `reconcileTuple` had done so). Restored as a focused idempotent-path check: when the manifest is already compiled-serving and the serving-flip-record is missing, `flip-serving.cjs` rebuilds it from the live manifest + fence (marked `reconstructed:true`, with `fenceEpoch.before:null` since the original transition is unrecoverable once the record is gone). The record is a non-serving audit artifact — the manifest stays the authority — so this closes an audit gap, not a serving one. Harness now **11/11** (new check `record self-heal: a deleted serving-flip record is rebuilt on the next run`).

### Files

| Area | File | Change |
|------|------|--------|
| Shared contract | `shared/frozen-scorer-contract.cjs` | Create — single source of the pinned digests + drift check |
| Shared lock | `shared/hub-lock.cjs` | Create — single per-hub lock with owner identity (pid + nonce + timestamp) + 10-min lease and guarded stale reclaim. **Round 2**: rewritten on an atomic `mkdir` lock directory + `owner.json` for a real winner election (RR-P1-A); header comment corrected to the honest mechanism + residual (RR-P2-C) |
| Serving flip | `011-runtime-engine/lib/flip-serving.cjs` | Import the frozen-scorer contract (drop local digest copy + unused `crypto`/`sha256`/`fileHash`); add `reconcileTuple()` on the idempotent no-op path; take the shared hub lock; add `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook. **Round 2**: `reconcileTuple()` replaced by a write-ahead journal (`.flip-journal.json`) + `recoverFromJournal()`, so an interrupted flip recovers to the intended advanced fence, not a stale one (RR-P1-B) |
| Activation driver | `010-live-activation/lib/activate-hub.cjs` | Import the frozen-scorer contract (drop local digest copy); add `confineArgs()` pre-effect gate; take the shared hub lock |
| Runtime resolver | `011-runtime-engine/lib/resolve.cjs` | Add `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook so the harness can sandbox activation reads |
| Compiled-route cache | `011-runtime-engine/lib/compiled-route.cjs` | Document the process-lifetime engine cache as a contract (comment); no behavior change |
| Regression harness | `011-runtime-engine/harness/verify-runtime-engine.cjs` | Rewritten to run entirely against a temp SANDBOX copy of `activation/`; adds both-decision, serve-time identity-mismatch, and shared-lock (live-holder-refused / stale-holder-reclaimed) fixtures; deletes the sandbox on exit. **Round 2**: adds a write-ahead-journal recovery fixture; the two shared-lock fixtures re-verified against the rebuilt mkdir-dir lock; harness now **10/10** (grown from 9/9) |
| Evidence | `010-live-activation/checklist.md` | Reconcile CHK-051 + Completion Boundary down to the honest, spec-consistent claim |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All nine fixes were verified inline as they were made, not batch-verified at the end. P1-004: the `010` checklist's CHK-051 and Completion Boundary lines were corrected in place to state advisor-hook machine-enforcement is *in progress* — citing the same T9-plus-flag-off-inertness boundary that `spec.md` and both impl-summaries already stated — and the post-flip sweep was reframed as the bounded 2-prompt-per-hub sample it was, citing `real-model/<hub>/verdict.json`; no new evidence was invented, the claim was brought back in line with what already existed elsewhere. P2-005: the two inline digest blocks in `flip-serving.cjs` and `activate-hub.cjs` were replaced with a single import of the new `shared/frozen-scorer-contract.cjs`, keeping each site's own `assertScorerFrozen` call and phase-specific failure string; `node --check` and the non-destructive `verify-runtime-engine.cjs` regression suite were run after the edit, not just at sign-off.

The remaining seven findings (P1-001, P1-002, P1-003, P1-006, P1-007, P1-008, P2-009) were delivered the same way — each verified in place as it was made: `node --check` after every file edit, the full harness after the sandboxing, fixture, and lock work landed, and a targeted teeth test run against the specific failure mode each finding named (a deleted serving-flip-record for P1-001, an out-of-bounds `--hub` for P1-003, a live-vs-stale lock collision for P1-007/P1-008). See Verification below for the consolidated evidence.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Correct the checklist downward rather than complete the underlying advisor-hook work first | Closes the doc/spec contradiction immediately; the enforcement work itself is unrelated in-progress scope, not blocking this reconciliation |
| Extract one shared module rather than reconciling the two inline copies by hand | Removes the possibility of the two writers drifting independently; a single read-only source of truth for the pinned digests |
| Keep each writer's own phase-specific failure message via a `phase` parameter | Preserves the existing operator-facing error text (`'the serving flip'` / `'activation'`) unchanged, so no downstream tooling that greps for those strings breaks |
| Fix the two zero-risk findings before the crash-safety/harness tranches | Neither changes a routing decision, a manifest write, or the frozen scorer; both are reversible by `git revert` and carry no cutover risk |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Round 1

- `node --check` — clean on all 7 touched runtime files: `hub-lock.cjs`, `frozen-scorer-contract.cjs`, `flip-serving.cjs`, `resolve.cjs`, `compiled-route.cjs`, `activate-hub.cjs`, `verify-runtime-engine.cjs`.
- Pinned digests byte-identical to the prior inline copies; `assertScorerFrozen` reports no drift on the live scorer (3 files hashed).
- `harness/verify-runtime-engine.cjs` — **9/9 at round-1 close** (discriminated-union, both-decision coverage, flag-off inertness, serve-time identity match, serve-time identity mismatch, fenced-CAS byte-exact rollback+reflip, shared-lock live-holder refused, shared-lock stale-holder reclaimed, flip-time identity refused) — now **10/10**, see Round 2 below.
- P1-002 proof: the LIVE `010-live-activation/activation` tree is byte-identical before and after a harness run (git-dirty 0) — the harness ran only in its sandbox.
- P1-003 teeth: `activate-hub --hub "../../evil"` fails with "unsafe hub id" before any effect.
- P1-001 teeth (round-1 mechanism, superseded by the Round 2 write-ahead journal below — `reconcileTuple()` no longer exists in the code): with sk-code's serving-flip-record deleted in a sandbox, `flip-serving --hub sk-code` printed "ALREADY-COMPILED (reconciled: serving-flip-record)" and rebuilt a record matching the manifest with `reconciled:true`.
- `activate-hub --verify` still works under the new lock+confinement (sandbox): "ACTIVATION BOUND … rollback.byteExact=true", no lingering `.flip.lock`.
- `validate.sh --strict` — Errors: 0 on `010-live-activation`, `011-runtime-engine`, and this packet.

### Round 2 (re-review remediation)

- `node --check` — clean on the 4 dependent files: `hub-lock.cjs`, `flip-serving.cjs`, `verify-runtime-engine.cjs` (all three modified), and `activate-hub.cjs` (unmodified, re-verified as a consumer of the redesigned lock).
- `harness/verify-runtime-engine.cjs` — **10/10**: adds a write-ahead-journal recovery check (`write-ahead journal: interrupted flip recovered to the intended advanced fence`) and re-verifies the two shared-lock checks (`shared lock: a live holder is refused (and left intact)`; `shared lock: a stale holder is reclaimed, not dead-locked`) against the rebuilt mkdir-dir lock.
- Live activation tree byte-identical after a harness run (git-dirty 0).
- `activate-hub --verify` still works under the new mkdir lock (sandbox): "ACTIVATION BOUND … rollback.byteExact=true", no lingering `.flip.lock` dir.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All nine round-1 findings are now built, but this was new runtime behavior.** The crash-safety, harness, and trust-boundary code (`shared/hub-lock.cjs`, `confineArgs()`, the sandboxed harness, the cache-lifecycle comment) is new logic layered onto the activation/flip write path. It stays gated behind `SPECKIT_COMPILED_ROUTING` (default off) and is reversible via `git revert`; nothing here changes the shipped cutover's default-off, fail-safe posture.
2. **Round 2 re-review surfaced three issues (all closed); the external blocker is now resolved.** A follow-up `/deep:review` completed iteration 1 and surfaced RR-P1-A, RR-P1-B, RR-P2-C — all closed by the redesign above. The loop then halted on an unrelated reducer/strategy-anchor workflow-infra bug in the review harness (external, not a finding against this packet's code). That bug is now fixed (`system-deep-loop/033`, commit `208f43f641`), and a 3-iteration confirming `/deep:review` cleared the reducer end-to-end (0 reducer crashes, strategy self-healed, report produced). A full multi-iteration re-review is now blocked only by pre-existing 007 child-packet metadata/template validation, not by any reducer or hardening code.
3. **Honest residual on the rebuilt lock (Round 2).** The atomic-`mkdir` winner election closes the write-then-read race, but is not a perfect race-free guarantee: a perfectly race-free stale-lock reclaim needs OS advisory locking (flock/fcntl), which zero-dependency Node does not expose — the redesign narrows the reclaim window (it re-checks staleness immediately before clearing) but does not fully exclude a pathological same-instant double-reclaim. PID reuse within an unexpired lease (10 minutes) is bounded by the lease, not detected. Documented in the `shared/hub-lock.cjs` header comment, not hidden.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/012-cutover-hardening"
    last_updated_at: "2026-07-20T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Round 3: restored the audit-record self-heal Round 2's journal had dropped for the deleted-after-clean-flip case — flip-serving.cjs rebuilds a missing serving-flip-record from the manifest on the idempotent path (reconstructed:true); harness 11/11 (new record-self-heal check), node --check clean, live activation tree untouched (git-dirty 0). The external reducer/strategy-anchor blocker that halted Round 2's re-review is now fixed (system-deep-loop/033, commit 208f43f641); a 3-iteration confirming /deep:review cleared the reducer end-to-end"
    next_safe_action: "None queued — RR-P1-A/RR-P1-B/RR-P2-C and the Round 3 self-heal are built and verified, and the reducer blocker is resolved. A full multi-iteration re-review is optional and blocked now only by pre-existing 007 child-packet metadata/template validation, not by any reducer or hardening code"
    status: complete
    completion_pct: 100
    current_focus: "Nine-finding deep-review remediation of the compiled-routing cutover; all nine findings built and verified, gated behind SPECKIT_COMPILED_ROUTING (default off); fresh re-review recommended as follow-up"
    blockers: []
-->
