---
title: "Checklist: Compiled-Routing Cutover Hardening"
description: "QA gate for all four tranches (all nine findings) of the deep-review remediation — now fully built and verified."
trigger_phrases:
  - "cutover hardening checklist"
importance_tier: "high"
contextType: "implementation"
---
# Checklist: Compiled-Routing Cutover Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim completion until verified |
| **[P1]** | Required | Must verify or state the deferred boundary |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-090 [P0] The nine-finding deep-review report and every edit site (`010-live-activation/checklist.md`; both inline digest blocks; `flip-serving.cjs`, `activate-hub.cjs`, `resolve.cjs`, `compiled-route.cjs`, `verify-runtime-engine.cjs`; the new `shared/hub-lock.cjs`) were read/located before authoring each fix.
  - **Evidence**: `spec.md` SCOPE table cites all nine finding IDs + sites; `plan.md` FIX ADDENDUM traces every finding to its exact file and verification.
- [x] CHK-091 [P0] All edits stayed inside the two named sibling folders plus the shared module — no unrelated file touched.
  - **Evidence**: `implementation-summary.md` Files table lists exactly eight touched paths across `010-live-activation`, `011-runtime-engine`, and `shared/`: two new shared modules (`frozen-scorer-contract.cjs`, `hub-lock.cjs`), five modified runtime files, and one checklist correction.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-001 [P0] CommonJS syntax is valid across all new modules and every edited runtime file.
  - **Evidence**: `node --check` passes for all 7 touched files — `shared/frozen-scorer-contract.cjs`, `shared/hub-lock.cjs`, `010-live-activation/lib/activate-hub.cjs`, `011-runtime-engine/lib/flip-serving.cjs`, `011-runtime-engine/lib/resolve.cjs`, `011-runtime-engine/lib/compiled-route.cjs`, `011-runtime-engine/harness/verify-runtime-engine.cjs`.
- [x] CHK-002 [P1] The frozen-scorer contract module is read-only and zero-dependency (Node built-ins).
  - **Evidence**: `frozen-scorer-contract.cjs` uses `fs`/`path`/`crypto` only; it reads and hashes the scorer, never writes it.
- [x] CHK-003 [P1] No dead code left behind in the wired writers.
  - **Evidence**: `flip-serving.cjs` dropped its now-unused `crypto`/`sha256`/`fileHash`; `activate-hub.cjs` retains `fileHash` (still used by seed + rollback proof).
- [x] CHK-004 [P1] The new shared lock module is zero-dependency (Node built-ins) and exposes a minimal, intentional surface.
  - **Evidence**: `hub-lock.cjs` uses `fs`/`path`/`crypto` only and exports exactly `{ withHubLock, isStale, pidAlive, LEASE_MS }`.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] The frozen-scorer digests are byte-identical to the prior inline copies.
  - **Evidence**: `PINNED_SCORER_DIGESTS` equals the three prior values exactly; the scorer files are untouched.
- [x] CHK-011 [P0] Both gates still reject drift, with phase-specific messages.
  - **Evidence**: `assertScorerFrozen(repoRoot, phase)` throws `FROZEN SCORER DRIFT …` naming the phase; `flip-serving` passes `'the serving flip'`, `activate-hub` passes `'activation'`.
- [x] CHK-012 [P0] The runtime-engine regression suite stays green and non-destructive, now running entirely in a sandbox.
  - **Evidence**: `verify-runtime-engine.cjs` reports **9/9** (discriminated-union, both-decision coverage, flag-off inertness, serve-time identity match, serve-time identity mismatch, fenced-CAS byte-exact rollback+reflip, shared-lock live-holder refused, shared-lock stale-holder reclaimed, flip-time identity refused) — grown from 6/6; runs against a temp SANDBOX copy via `SPECKIT_ACTIVATION_ROOT_OVERRIDE`; the LIVE `010-live-activation/activation` tree is byte-identical before/after (git-dirty 0).
- [x] CHK-013 [P0] Sandbox isolation — the regression harness never mutates live activation state (P1-002).
  - **Evidence**: `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook added to `flip-serving.cjs` + `resolve.cjs`; the harness points the whole pipeline at a temp SANDBOX copy of `activation/` and deletes it on exit; the LIVE tree is byte-identical before/after (git-dirty 0).
- [x] CHK-014 [P0] Both-decision coverage — the harness exercises a route AND a negative decision, not just the route path (P1-006).
  - **Evidence**: harness check `both-decision coverage: a route AND a negative are exercised`; part of the 9/9 pass.
- [x] CHK-015 [P0] Serve-time identity mismatch — a tampered manifest fails safe to legacy (P1-006).
  - **Evidence**: harness check `serve-time identity (mismatch): tampered manifest fails safe to legacy`; part of the 9/9 pass.
- [x] CHK-016 [P0] Shared-lock recovery — a live holder is refused, a stale holder is safely reclaimed (P1-007, P1-008).
  - **Evidence**: harness checks `shared lock: a live holder is refused (and left intact)` and `shared lock: a stale holder is reclaimed, not dead-locked`; `hub-lock.cjs` records owner pid + random nonce + timestamp and a 10-minute lease.
- [x] CHK-017 [P0] Reconcile — the idempotent no-op path rebuilds a half-committed tuple from the manifest before returning (P1-001).
  - **Evidence**: `reconcileTuple()` runs under the shared hub lock in `flip-serving.cjs`; teeth test — with sk-code's serving-flip-record deleted in a sandbox, `flip-serving --hub sk-code` prints "ALREADY-COMPILED (reconciled: serving-flip-record)" and rebuilds a record matching the manifest with `reconciled:true`.
- [x] CHK-018 [P0] Confinement — activation identifiers are validated before any side effect (P1-003).
  - **Evidence**: `confineArgs()` in `activate-hub.cjs` runs before any side effect; teeth test — `activate-hub --hub "../../evil"` fails with "unsafe hub id" before any effect; `activate-hub --verify` still works under the new lock+confinement (sandbox): "ACTIVATION BOUND … rollback.byteExact=true", no lingering `.flip.lock`.
- [x] CHK-019 [P1] Engine cache lifecycle is documented as a contract, not silently left open (P2-009).
  - **Evidence**: `compiled-route.cjs` comment documents the process-lifetime cache as safe because the resolver's serve-time identity gate fails a drifted snapshot to legacy; no behavior change.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-092 [P0] Each of the nine closed findings maps to a concrete fix with cited evidence, not just a task checkbox.
  - **Evidence**: P1-004 → `CHK-020`/`CHK-021` (checklist/spec reconciliation); P2-005 → `CHK-010`/`CHK-011` (digest identity + drift check); P1-002 → `CHK-013`; P1-006 → `CHK-014`/`CHK-015`; P1-001 → `CHK-017`; P1-007/P1-008 → `CHK-016`; P1-003 → `CHK-018`; P2-009 → `CHK-019`.
- [x] CHK-093 [P1] The seven findings that were previously planned are now built with cited evidence, not just enumerated as acceptance seeds.
  - **Evidence**: `spec.md` REQ-004..007 marked Satisfied with acceptance evidence; `tasks.md` T003-T009 all `[x]` with evidence tags; harness `verify-runtime-engine.cjs` 9/9.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-094 [P0] No live activation manifest, serving-flip-record, fence, or frozen-scorer *data* file was hand-edited — only the *code* that operates on them changed, and the served routing decision stays gated behind `SPECKIT_COMPILED_ROUTING` (default off) with fail-safe-to-legacy on any identity mismatch.
  - **Evidence**: `implementation-summary.md` Files table lists exactly the touched *code* files (two new shared modules, five modified runtime files, one checklist correction) — no manifest/record/fence data artifact was committed as an edit; the three pinned scorer digests are unchanged (CHK-010); P1-002 proof shows the LIVE `010-live-activation/activation` tree byte-identical before/after a harness run (git-dirty 0).
- [x] CHK-095 [P1] No network, package install, credential, or dynamic-code surface was introduced.
  - **Evidence**: All 7 touched files are zero-dependency CommonJS (`fs`/`path`/`crypto`/`os`/`child_process` built-ins only, plus internal `require`s between these files), per CHK-001/CHK-002/CHK-004.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-020 [P0] The `010` spec and checklist no longer contradict on the release-readiness boundary.
  - **Evidence**: The checklist now states advisor-hook machine-enforcement is *in progress* (enrichment committed, flag-off byte-parity proven) and frames the post-flip sweep as a bounded 2-prompt-per-hub sample citing `real-model/<hub>/verdict.json`, matching `spec.md` SC-005 and both impl-summaries.
- [x] CHK-021 [P1] All nine findings are documented with built-and-verified evidence, not left as acceptance seeds.
  - **Evidence**: `tasks.md` T003-T009 all `[x]` with evidence tags; `spec.md` REQ-004..007 marked Satisfied; `implementation-summary.md` Known Limitations records this is new runtime behavior, gated behind `SPECKIT_COMPILED_ROUTING` (default off) and reversible, and flags that a fresh `/deep:review` has not yet run over these fixes.
- [x] CHK-022 [P0] Strict Level-2 packet validation passes on the three touched folders.
  - **Evidence**: `validate.sh --strict` reports `Errors: 0` on `010-live-activation`, `011-runtime-engine`, and this packet.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-096 [P0] Shared modules live at the shared root, not duplicated per-hub.
  - **Evidence**: `shared/frozen-scorer-contract.cjs` and `shared/hub-lock.cjs` both sit at `007-unified-refactor-implementation/shared/`, a sibling of `010-live-activation` and `011-runtime-engine`, imported by both writers rather than copy-pasted.
- [x] CHK-097 [P1] No stray temp or scratch files were left behind.
  - **Evidence**: This remediation touched exactly the eight files listed in `implementation-summary.md`; the harness's SANDBOX copy is deleted on exit and the LIVE activation tree is byte-identical before/after (git-dirty 0); no scratch artifacts were left.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 8 | 8/8 |

**Verification Date**: 2026-07-20
**Completion Boundary**: All four tranches (nine findings) are complete and verified — `node --check` clean on 7 touched runtime files, harness `verify-runtime-engine.cjs` 9/9, LIVE activation tree byte-identical before/after (git-dirty 0). This is new runtime behavior, gated behind `SPECKIT_COMPILED_ROUTING` (default off) and reversible via `git revert`. A fresh `/deep:review` has NOT yet run over these nine fixes (the prior review is what surfaced them) — recommended as follow-up.

<!-- /ANCHOR:summary -->
