---
title: "Implementation Plan: Compiled-Routing Cutover Hardening"
description: "Risk-ordered remediation of the nine deep-review findings; all four tranches (tranche 1's two quick wins through tranche 4's trust boundary + cache lifecycle) are now built and verified."
trigger_phrases:
  - "cutover hardening plan"
importance_tier: "high"
contextType: "implementation"
---
# Implementation Plan: Compiled-Routing Cutover Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Zero-dependency CommonJS (Node built-ins only) across all new/modified modules; Markdown for the doc correction |
| **Fix shape** | Four risk-ordered tranches: a doc correction (P1-004), a pure extract-and-import refactor (P2-005), a sandboxed/expanded regression harness (P1-002, P1-006), a shared per-hub lock with crash-safe reconcile (P1-001, P1-007, P1-008), and an activation trust boundary + documented cache contract (P1-003, P2-009) |
| **Touched sites** | `010-live-activation/checklist.md`; `010-live-activation/lib/activate-hub.cjs`; `011-runtime-engine/lib/flip-serving.cjs`; `011-runtime-engine/lib/resolve.cjs`; `011-runtime-engine/lib/compiled-route.cjs`; `011-runtime-engine/harness/verify-runtime-engine.cjs`; new `shared/frozen-scorer-contract.cjs`; new `shared/hub-lock.cjs` |
| **Frozen inputs** | The three pinned scorer digests — re-exported, never edited |

### Overview

Remediated in strict risk order so the zero-runtime-risk work landed first and the highest-blast work (crash-safety on the serving tuple) followed only once the harness could prove it safe:

1. **Tranche 1 — quick wins (built).** Two changes that touch no live routing decision and preserve every proven behavior: P1-004 (doc reconcile), P2-005 (frozen-scorer contract).
2. **Tranche 2 — harness integrity (built).** Isolated the regression harness against a temp sandbox and completed its matrix: P1-002 (`SPECKIT_ACTIVATION_ROOT_OVERRIDE` sandboxing), P1-006 (both-decision + serve-time identity-mismatch fixtures).
3. **Tranche 3 — tuple crash-safety + single-writer ownership (built).** One coordinated change: P1-001 (`reconcileTuple()` on the idempotent no-op path), P1-007 (`shared/hub-lock.cjs` as the single per-hub lock for both writers), P1-008 (owner-identity + lease + guarded stale reclaim on that lock).
4. **Tranche 4 — activation trust boundary + cache lifecycle (built).** P1-003 (`confineArgs()` pre-effect gate), P2-009 (documented engine-cache contract).

All four tranches now carry cited verification (`node --check`, the 9/9 harness, and targeted teeth tests) — see `## 5. TESTING STRATEGY`.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The nine-finding deep-review report was read; P1-004 and P2-005 are the two findings with no runtime routing risk.
- [x] Both edit sites — `010-live-activation/checklist.md` and the two writers' inline digest blocks — were located before editing.
- [x] The remaining seven findings' fix sites — `flip-serving.cjs`, `activate-hub.cjs`, `resolve.cjs`, `compiled-route.cjs`, `verify-runtime-engine.cjs`, and the new `shared/hub-lock.cjs` — were located and scoped to their exact finding before editing.

### Definition of Done
- [x] The `010` checklist and `spec.md` / both impl-summaries no longer contradict on the release-readiness boundary [REQ-002].
- [x] One read-only module exports the pinned digests plus a phase-parameterized `assertScorerFrozen`; both writers import it and embed no local digest copy [REQ-003].
- [x] `verify-runtime-engine.cjs` stays green (now 9/9, grown from 6/6) and non-destructive; the three pinned digests are byte-identical before and after [REQ-001].
- [x] The regression harness runs entirely against a sandboxed activation root and never mutates live state [REQ-005].
- [x] The harness matrix covers both-decision and serve-time identity-mismatch fixtures [REQ-005].
- [x] Every manifest/fence/record writer takes one shared per-hub lock with owner-identity + lease + guarded stale reclaim [REQ-004].
- [x] The idempotent no-op path reconciles a half-committed tuple from the manifest before returning [REQ-004].
- [x] Activation identifiers are allowlisted and realpath-confined before any side effect [REQ-006].
- [x] The engine-cache lifecycle is documented as a contract [REQ-007].

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Four risk-ordered layers on top of the existing activation/flip/resolve pipeline. P1-004 changes no code, only a claim. P2-005 collapses two duplicate inline digest blocks into one imported module. P1-002/P1-006 make the regression harness a true sandbox and complete its assertion matrix. P1-001/P1-007/P1-008 add one shared per-hub lock plus a crash-safe tuple reconciliation, so no writer can act without ownership and no crash leaves an unrecoverable half-committed state. P1-003 adds a pre-effect trust boundary on activation's own CLI arguments. P2-009 documents (rather than re-engineers) the process-lifetime cache's safety argument.

### Key Components
- **`shared/frozen-scorer-contract.cjs` (new)**. A read-only module exporting `PINNED_SCORER_DIGESTS` (the three pinned digests) and a phase-parameterized `assertScorerFrozen(repoRoot, phase)`. Zero-dependency (Node built-ins only); reads and hashes the scorer, never writes it.
- **`shared/hub-lock.cjs` (new)**. A single per-hub lock module exporting `{ withHubLock, isStale, pidAlive, LEASE_MS }`. Records owner identity (pid + random nonce + timestamp) and a `LEASE_MS` (10-minute) lease; refuses acquisition against a live holder, but safely reclaims a stale holder (dead pid OR expired lease). Both `flip-serving.cjs` and `activate-hub.cjs` take this lock via `withHubLock`, so activation and the serving flip can no longer consume one fence epoch independently. Zero-dependency (Node built-ins only).
- **`011-runtime-engine/lib/flip-serving.cjs`**. Imports the shared frozen-scorer contract in place of its own inline digest block (drops its now-unused `crypto`/`sha256`/`fileHash` helpers); calls `assertScorerFrozen(repoRoot, 'the serving flip')`; takes the shared hub lock via `withHubLock`; runs `reconcileTuple(hubDir, manifest, fence)` on the idempotent no-op path to rebuild a crash-left half-committed tuple (missing/stale serving-flip-record or fence) from the authoritative manifest before returning; honors the new `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env var so the harness can sandbox it.
- **`011-runtime-engine/lib/resolve.cjs`**. Honors the new `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook so the harness can resolve routes against a sandboxed activation root instead of the live one.
- **`011-runtime-engine/lib/compiled-route.cjs`**. The process-lifetime engine cache now carries a comment documenting its safety contract: it is safe because the resolver's serve-time identity gate fails a drifted snapshot to legacy, and a process restart picks up a new policy.
- **`010-live-activation/lib/activate-hub.cjs`**. Imports the shared frozen-scorer contract in place of its own inline digest block (keeps `fileHash`, still used by seed + rollback proof); calls `assertScorerFrozen(repoRoot, 'activation')`; runs a `confineArgs(hub, childRoot)` gate before any side effect (hub id must match `^[a-z0-9][a-z0-9-]*$`, the hub dir must resolve inside the activation root, `--child` must resolve inside the repo); takes the shared hub lock via `withHubLock`.
- **`011-runtime-engine/harness/verify-runtime-engine.cjs`**. Rewritten to run entirely against a temp SANDBOX copy of `activation/` via `SPECKIT_ACTIVATION_ROOT_OVERRIDE`; never touches live state and deletes the sandbox on exit; adds both-decision coverage and a serve-time identity-MISMATCH fixture (tampered manifest fails safe to legacy), plus shared-lock live-holder-refused and stale-holder-reclaimed checks.

### Data Flow

Each writer calls `assertScorerFrozen(repoRoot, phase)` from the shared module at its existing gate point; the module re-hashes the three scorer files and throws `FROZEN SCORER DRIFT …` naming the phase on any mismatch, exactly as the prior inline copies did — only the source of the pinned digests and the hashing logic is now shared instead of duplicated.

Before either writer touches the manifest, fence, or serving-flip-record, it first acquires `shared/hub-lock.cjs`'s per-hub lock (owner identity + lease) via `withHubLock`. On the idempotent no-op path, `flip-serving.cjs` calls `reconcileTuple()` under that lock to rebuild any crash-left half-committed tuple from the manifest. `activate-hub.cjs` runs `confineArgs()` before the lock is even requested, so an unsafe `--hub`/`--child` never reaches a side effect. The regression harness exercises this whole path against a sandboxed activation root (`SPECKIT_ACTIVATION_ROOT_OVERRIDE`), so none of it can mutate live state.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `010-live-activation/checklist.md` (CHK-051, Completion Boundary) | Overstated release-readiness claim | Corrected downward to match `spec.md` + both impl-summaries | No remaining spec/checklist contradiction |
| `011-runtime-engine/lib/flip-serving.cjs` | Inline pinned-digest copy + local `assertScorerFrozen`; no tuple reconcile; no shared lock; no sandbox hook | Imports the shared frozen-scorer contract; drops the local copy + now-unused `crypto`/`sha256`/`fileHash`; adds `reconcileTuple()` on the idempotent no-op path; takes the shared hub lock; honors `SPECKIT_ACTIVATION_ROOT_OVERRIDE` | `node --check`; `verify-runtime-engine.cjs` 9/9; reconcile teeth test |
| `010-live-activation/lib/activate-hub.cjs` | Inline pinned-digest copy + local `assertScorerFrozen`; identifiers unconstrained before effects; no shared lock | Imports the shared frozen-scorer contract; drops the local copy; adds `confineArgs()` pre-effect gate; takes the shared hub lock | `node --check`; confinement teeth test; `--verify` still passes under sandbox |
| `011-runtime-engine/lib/resolve.cjs` | Always resolved against the live activation root | Honors `SPECKIT_ACTIVATION_ROOT_OVERRIDE` | `node --check`; harness sandbox proof (live tree untouched) |
| `011-runtime-engine/lib/compiled-route.cjs` | Process-lifetime cache with no documented refresh contract | Adds a comment documenting the cache as a safe contract (serve-time identity gate covers drift) | `node --check` |
| `011-runtime-engine/harness/verify-runtime-engine.cjs` | Ran against live `activation/`; matrix missing both-decision + identity-mismatch + lock coverage | Rewritten to run in a temp SANDBOX; adds both-decision, serve-time identity-mismatch, shared-lock live/stale fixtures | 9/9; 0 dirty live files after a run |
| `shared/frozen-scorer-contract.cjs` (new) | — | Single source of the pinned digests + drift check | Digests byte-identical to the prior inline copies; drift check still throws |
| `shared/hub-lock.cjs` (new) | — | Single per-hub lock with owner identity + lease + guarded stale reclaim | Shared-lock live-holder-refused + stale-holder-reclaimed harness checks |

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the nine-finding deep-review report and locate both edit sites: `010-live-activation/checklist.md` (P1-004) and the two inline digest blocks in `flip-serving.cjs` / `activate-hub.cjs` (P2-005).
- [x] Located the remaining seven findings' fix sites — `flip-serving.cjs`, `activate-hub.cjs`, `resolve.cjs`, `compiled-route.cjs`, `verify-runtime-engine.cjs`, and the new `shared/hub-lock.cjs` — before authoring tranches 2-4.

### Phase 2: Core Implementation

**P1-004 (doc reconcile).** The `010` checklist overstated advisor-hook machine-enforcement as complete and asserted a "fresh sweep" the committed harness does not run, contradicting the spec and both impl-summaries. Fix: correct the checklist to state machine-enforcement is *in progress* (enrichment committed, flag-off byte-parity proven) and frame the post-flip sweep as the bounded 2-prompt-per-hub sample it was, citing `real-model/<hub>/verdict.json`. Direction of change is downward — the checklist now claims no more than the evidence supports.

**P2-005 (contract centralization).** `flip-serving.cjs` and `activate-hub.cjs` each embedded the same three pinned scorer digests + their own `assertScorerFrozen`. Fix: one read-only `shared/frozen-scorer-contract.cjs` exporting the pinned digests + a phase-parameterized `assertScorerFrozen(repoRoot, phase)`; both writers import it and keep phase-specific failure messages. The pinned digests are preserved byte-for-byte and the scorer files are never touched.

**Why these two first.** Neither changes a routing decision, a manifest write, or the frozen scorer. P1-004 is prose; P2-005 is a pure extract-and-import refactor whose behavior is proven identical by the existing regression suite. Both are reversible and carry no cutover risk.

**P1-002 (harness sandboxing).** The regression harness ran its reset→reflip cycle against the live `010-live-activation/activation` tree, so a concurrent activation change could be erased by its unconditional whole-tree restore. Fix: a new `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook (read by `flip-serving.cjs` and `resolve.cjs`) lets the harness point the whole pipeline at a temp SANDBOX copy instead; the harness copies `activation/` into the sandbox, runs its full matrix there, and deletes the sandbox on exit. The live tree is never touched.

**P1-006 (harness matrix completeness).** The harness omitted both-decision coverage and an isolated serve-time identity-mismatch fixture. Fix: added an explicit assertion that a route AND a negative decision are both exercised, plus a fixture that tampers with the manifest and confirms the resolver fails safe to legacy.

**P1-001 (tuple crash-safety).** A crash between the manifest/fence/record renames could leave a half-committed tuple that the idempotent no-op path silently accepted. Fix: `flip-serving.cjs` now runs `reconcileTuple(hubDir, manifest, fence)` on that no-op path, under the shared hub lock, rebuilding any missing/stale serving-flip-record or fence from the authoritative manifest before returning.

**P1-007 (single-writer lock).** `activate-hub.cjs` could write the manifest/fence without taking the same lock `flip-serving.cjs` used, so the two writers could consume one fence epoch between them. Fix: `shared/hub-lock.cjs` (new) is the one lock both now take via `withHubLock`.

**P1-008 (lock recovery).** The lock had no owner identity or staleness recovery, so a crash-left lock could strand every future writer. Fix: `shared/hub-lock.cjs` records owner pid + random nonce + timestamp and a `LEASE_MS` (10-minute) lease; a live holder is refused on collision, a stale holder (dead pid OR expired lease) is safely reclaimed.

**P1-003 (activation confinement).** `activate-hub.cjs` used its `--hub`/`--child` arguments before validating them, so a traversal-style hub id or an out-of-repo `--child` could reach a side effect. Fix: a `confineArgs(hub, childRoot)` gate now runs before any side effect — hub id regex (`^[a-z0-9][a-z0-9-]*$`), activation-root realpath containment, repo realpath containment for `--child`.

**P2-009 (cache lifecycle).** The process-lifetime engine cache in `compiled-route.cjs` had no documented refresh contract. Fix: documented (via comment) that the cache is safe as-is, because the resolver's serve-time identity gate already fails a drifted snapshot to legacy, and a process restart naturally picks up a new policy — no change to the caching behavior itself.

**Why these seven, in this order.** Tranche 2 (harness) had to land before tranche 3 (crash-safety) could be verified safely, since the crash-safety and lock changes are exactly what the harness's new fixtures needed to exercise. Tranche 4 (P1-003, P2-009) is independent of both and closes the remaining trust-boundary and documentation gaps.

### Phase 3: Verification
- [x] See `## 5. TESTING STRATEGY` below for the full verification run, now covering all nine findings (`node --check` on 7 files, digest byte-identity, `verify-runtime-engine.cjs` 9/9, targeted teeth tests, `validate.sh --strict`).

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `node --check` on all 7 touched runtime files (`hub-lock.cjs`, `frozen-scorer-contract.cjs`, `flip-serving.cjs`, `resolve.cjs`, `compiled-route.cjs`, `activate-hub.cjs`, `verify-runtime-engine.cjs`).
- The shared frozen-scorer module's pinned digests are byte-identical to the prior inline copies, and `assertScorerFrozen` reports no drift on the live scorer.
- `harness/verify-runtime-engine.cjs` — **9/9**: discriminated-union, both-decision coverage, flag-off inertness, serve-time identity match, serve-time identity mismatch, fenced-CAS byte-exact rollback+reflip, shared-lock live-holder refused, shared-lock stale-holder reclaimed, flip-time identity refused. Runs entirely against a temp SANDBOX; the LIVE `010-live-activation/activation` tree is byte-identical before/after (git-dirty 0).
- Targeted teeth tests: `activate-hub --hub "../../evil"` fails with "unsafe hub id" before any effect; with sk-code's serving-flip-record deleted in a sandbox, `flip-serving --hub sk-code` prints "ALREADY-COMPILED (reconciled: serving-flip-record)" and rebuilds with `reconciled:true`; `activate-hub --verify` still works under the new lock+confinement (sandbox) — "ACTIVATION BOUND … rollback.byteExact=true", no lingering `.flip.lock`.
- `validate.sh --strict` on `010-live-activation`, `011-runtime-engine`, and this packet.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `010-live-activation/checklist.md` CHK-051 + Completion Boundary (P1-004's edit target) | Internal | Green | No sibling doc to reconcile against |
| The two inline frozen-scorer digest copies in `flip-serving.cjs` / `activate-hub.cjs` (P2-005's extraction source) | Internal | Green | No prior implementation to extract from |
| `harness/verify-runtime-engine.cjs` (regression gate) | Internal | Green (9/9) | No non-destructive proof that the extraction and later fixes changed nothing they shouldn't |
| `shared/hub-lock.cjs` (P1-007/P1-008's new shared lock) | Internal | Green | Both writers would need independent, drift-prone lock logic |
| `011-runtime-engine/lib/resolve.cjs` + `flip-serving.cjs`'s `SPECKIT_ACTIVATION_ROOT_OVERRIDE` hook (P1-002's sandboxing) | Internal | Green | Harness could not prove live-state isolation |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the nine fixes needs to be undone. Lowest risk: P1-004 (doc-only) and P2-005 (pure extract-and-import) — neither touches live routing, a manifest, or the frozen scorer. Higher blast (but still gated and reversible): the lock, reconcile, confinement, and sandbox-hook changes, since they add new logic to the activation/flip write path itself.
- **Procedure**: Each tranche is independently `git revert`-able. Tranches 1-2 (doc, contract extraction, harness sandboxing/matrix) touch no manifest, fence, or record state. Tranches 3-4 (lock, reconcile, confinement) add new code paths to `flip-serving.cjs` and `activate-hub.cjs`, but the served routing decision stays gated behind `SPECKIT_COMPILED_ROUTING` (default off) and fails safe to legacy on any identity mismatch, so a revert has no live-serving impact to unwind.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

P1-004 (doc-only) and P2-005 (code refactor) are independent of each other and of every later tranche. Tranche 3's lock (P1-007/P1-008, `shared/hub-lock.cjs`) is a prerequisite both P1-001's `reconcileTuple()` (runs under that lock in `flip-serving.cjs`) and P1-003's `confineArgs()` path (runs in the same lock-holding `activate-hub.cjs`) build on. Tranche 2's sandboxing (P1-002) had to land before the harness could safely exercise tranche 3's lock/reconcile fixtures without risking live state.

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Complexity | Estimated Effort |
|------|------------|-------------------|
| P1-004 (doc reconcile) | Low | Prose-only, no code |
| P2-005 (contract centralization) | Low | Pure extract-and-import refactor over existing, already-proven logic |
| P1-002/P1-006 (harness sandbox + matrix) | Medium | Rewrote the harness's activation-root resolution and added four new fixture types |
| P1-001/P1-007/P1-008 (crash-safety + shared lock) | Medium-High | One coordinated lock + reconcile protocol shared by two writers |
| P1-003 (activation confinement) | Low-Medium | One pre-effect validation gate |
| P2-009 (cache lifecycle) | Low | Documentation-only; no behavior change |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change checklist
- [x] Both tranche-1 fixes verified against existing evidence before editing — no new claims invented.
- [x] The shared module re-hashes the same three pinned digests as the prior inline copies.
- [x] The harness's sandboxing hook (`SPECKIT_ACTIVATION_ROOT_OVERRIDE`) was verified to leave the live activation tree untouched before trusting its results for the lock/reconcile fixtures.
- [x] Each teeth test (confinement, reconcile, lock collision) was run against the specific failure mode its finding named, not just the aggregate 9/9.

### Rollback procedure
1. `git revert` the relevant commit(s) — each tranche is independently revertible.
2. Tranches 1-2 touch no manifest, activation, or scorer file. Tranches 3-4 add new lock/reconcile/confinement logic to the activation/flip write path, but the served routing decision stays gated behind `SPECKIT_COMPILED_ROUTING` (default off), so a revert unwinds new code, not live serving behavior.

### Data reversal
- **Has runtime effect?** Partially. P1-004 is doc-only; P2-005 changes only which module a writer imports from. P1-001/P1-002/P1-003/P1-006/P1-007/P1-008/P2-009 change the activation/flip CLIs' own behavior (that is their job) — locking, reconciling, confining, sandboxing the harness, and documenting the cache — but the served routing decision itself stays gated behind `SPECKIT_COMPILED_ROUTING` (default off) and fails safe to legacy on any identity mismatch.
- **Reversal procedure**: `git revert`, per above.

<!-- /ANCHOR:enhanced-rollback -->
