---
title: "Implementation Summary: Compiled-Routing Cutover Hardening"
description: "All nine findings from the deep-review remediation are now built and verified: P1-004 checklist reconciliation, P2-005 frozen-scorer contract centralization, P1-001 crash-safe reconcile, P1-002 sandboxed harness, P1-003 activation confinement, P1-006 harness matrix, P1-007/P1-008 shared hub lock, and P2-009 cache-lifecycle contract. Harness 9/9, node --check clean on 7 files, live activation state untouched. A fresh deep-review is recommended as follow-up."
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
| **Status** | Complete — all nine deep-review findings (7 P1 + 2 P2) are built and verified. `node --check` clean on all 7 touched runtime files; harness `verify-runtime-engine.cjs` 9/9; LIVE activation tree byte-identical before/after (git-dirty 0). A fresh `/deep:review` has NOT yet been run over these fixes (the prior review is what surfaced them) — recommended as follow-up, not yet scheduled |
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

### Files

| Area | File | Change |
|------|------|--------|
| Shared contract | `shared/frozen-scorer-contract.cjs` | Create — single source of the pinned digests + drift check |
| Shared lock | `shared/hub-lock.cjs` | Create — single per-hub lock with owner identity (pid + nonce + timestamp) + 10-min lease and guarded stale reclaim |
| Serving flip | `011-runtime-engine/lib/flip-serving.cjs` | Import the frozen-scorer contract (drop local digest copy + unused `crypto`/`sha256`/`fileHash`); add `reconcileTuple()` on the idempotent no-op path; take the shared hub lock; add `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook |
| Activation driver | `010-live-activation/lib/activate-hub.cjs` | Import the frozen-scorer contract (drop local digest copy); add `confineArgs()` pre-effect gate; take the shared hub lock |
| Runtime resolver | `011-runtime-engine/lib/resolve.cjs` | Add `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook so the harness can sandbox activation reads |
| Compiled-route cache | `011-runtime-engine/lib/compiled-route.cjs` | Document the process-lifetime engine cache as a contract (comment); no behavior change |
| Regression harness | `011-runtime-engine/harness/verify-runtime-engine.cjs` | Rewritten to run entirely against a temp SANDBOX copy of `activation/`; adds both-decision, serve-time identity-mismatch, and shared-lock (live-holder-refused / stale-holder-reclaimed) fixtures; deletes the sandbox on exit |
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

- `node --check` — clean on all 7 touched runtime files: `hub-lock.cjs`, `frozen-scorer-contract.cjs`, `flip-serving.cjs`, `resolve.cjs`, `compiled-route.cjs`, `activate-hub.cjs`, `verify-runtime-engine.cjs`.
- Pinned digests byte-identical to the prior inline copies; `assertScorerFrozen` reports no drift on the live scorer (3 files hashed).
- `harness/verify-runtime-engine.cjs` — **9/9** (discriminated-union, both-decision coverage, flag-off inertness, serve-time identity match, serve-time identity mismatch, fenced-CAS byte-exact rollback+reflip, shared-lock live-holder refused, shared-lock stale-holder reclaimed, flip-time identity refused).
- P1-002 proof: the LIVE `010-live-activation/activation` tree is byte-identical before and after a harness run (git-dirty 0) — the harness ran only in its sandbox.
- P1-003 teeth: `activate-hub --hub "../../evil"` fails with "unsafe hub id" before any effect.
- P1-001 teeth: with sk-code's serving-flip-record deleted in a sandbox, `flip-serving --hub sk-code` prints "ALREADY-COMPILED (reconciled: serving-flip-record)" and rebuilds a record matching the manifest with `reconciled:true`.
- `activate-hub --verify` still works under the new lock+confinement (sandbox): "ACTIVATION BOUND … rollback.byteExact=true", no lingering `.flip.lock`.
- `validate.sh --strict` — Errors: 0 on `010-live-activation`, `011-runtime-engine`, and this packet.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All nine findings are now built, but this is new runtime behavior.** The crash-safety, harness, and trust-boundary code (`reconcileTuple()`, `shared/hub-lock.cjs`, `confineArgs()`, the sandboxed harness, the cache-lifecycle comment) is new logic layered onto the activation/flip write path. It stays gated behind `SPECKIT_COMPILED_ROUTING` (default off) and is reversible via `git revert`; nothing here changes the shipped cutover's default-off, fail-safe posture.
2. **Not yet re-reviewed.** These nine fixes have NOT been through a fresh `/deep:review` — the prior review is what surfaced them in the first place, so it cannot also have validated the fixes. A follow-up `/deep:review` pass over the nine changes is recommended before treating this remediation as independently audited.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/012-cutover-hardening"
    last_updated_at: "2026-07-20T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All nine findings shipped: P1-004 checklist reconcile, P2-005 shared frozen-scorer contract, P1-001 reconcileTuple, P1-002 sandboxed harness, P1-003 confineArgs, P1-006 harness matrix, P1-007/P1-008 shared hub-lock.cjs, P2-009 cache-contract doc; node --check clean on 7 files, harness 9/9, live activation tree untouched (git-dirty 0)"
    next_safe_action: "Schedule a fresh /deep:review pass over the nine fixes (the prior review is what surfaced them, so it hasn't validated these changes); no further build work is queued"
    status: complete
    completion_pct: 100
    current_focus: "Nine-finding deep-review remediation of the compiled-routing cutover; all nine findings built and verified, gated behind SPECKIT_COMPILED_ROUTING (default off); fresh re-review recommended as follow-up"
    blockers: []
-->
