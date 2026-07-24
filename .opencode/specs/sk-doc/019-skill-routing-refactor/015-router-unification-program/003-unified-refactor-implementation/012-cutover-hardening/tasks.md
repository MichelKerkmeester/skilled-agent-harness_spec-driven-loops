---
title: "Tasks: Compiled-Routing Cutover Hardening"
description: "Task list for the nine-finding remediation; all nine tasks (T001-T009) are done and verified — harness 9/9, node --check clean on 7 files, live activation state untouched. Round 2 adds T010-T012 for three re-review findings (RR-P1-A/B, RR-P2-C), closed by a lock/journal redesign — harness now 10/10."
trigger_phrases:
  - "cutover hardening tasks"
importance_tier: "high"
contextType: "implementation"
---
# Tasks: Compiled-Routing Cutover Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Tranche 1 — Quick wins (built)**

- [x] T001 Reconcile P1-004 — correct the `010` checklist so advisor-hook machine-enforcement reads *in progress* (not complete) and the post-flip sweep is framed as the bounded 2-prompt-per-hub sample it was, citing `real-model/<hub>/verdict.json` - [evidence: `010-live-activation/checklist.md` CHK-051 + Completion Boundary now match `spec.md` + both impl-summaries; no remaining spec/checklist contradiction]
- [x] T002 Close P2-005 — extract `shared/frozen-scorer-contract.cjs` (pinned digests + phase-parameterized `assertScorerFrozen`); wire `flip-serving.cjs` and `activate-hub.cjs` to it, removing both local digest copies - [evidence: pinned digests byte-identical to prior; `assertScorerFrozen` reports no drift; `verify-runtime-engine.cjs` 6/6 non-destructive; `node --check` clean on all three files]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Tranches 2-4 — Crash-safety, harness, trust boundary, cache lifecycle (built)**

- [x] T003 [REQ-005] Isolate the regression harness activation root (env override) so it never mutates live state (P1-002) - [evidence: new `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook added to `flip-serving.cjs` + `resolve.cjs`; `verify-runtime-engine.cjs` rewritten to run entirely against a temp SANDBOX copy of `activation/` and delete it on exit; LIVE `010-live-activation/activation` tree byte-identical before/after a harness run (git-dirty 0)]
- [x] T004 [REQ-005] Add both-decision and per-gate flip-time/serve-time identity-mismatch fixtures to the harness (P1-006) - [evidence: harness now asserts explicit both-decision coverage (a route AND a negative decision are both exercised) and a serve-time identity-MISMATCH fixture (tampered manifest fails safe to legacy); part of the 9/9 harness pass]
- [x] T005 [REQ-004] Reconcile the manifest/fence/record tuple on the idempotent path before no-op success (P1-001) - [evidence: `reconcileTuple()` in `flip-serving.cjs` runs under the shared hub lock on the idempotent no-op path, rebuilding a missing/stale serving-flip-record or fence from the authoritative manifest; teeth test — with sk-code's serving-flip-record deleted in a sandbox, `flip-serving --hub sk-code` prints "ALREADY-COMPILED (reconciled: serving-flip-record)" and rebuilds a record matching the manifest with `reconciled:true`]
- [x] T006 [REQ-004] Require one lock/ownership protocol for every manifest/fence writer, incl. `activate-hub` (P1-007) - [evidence: `shared/hub-lock.cjs` (new) is the single per-hub lock; both `flip-serving.cjs` and `activate-hub.cjs` now take it, so activation and flip can't consume one fence epoch]
- [x] T007 [REQ-004] Add owner-start-identity + staleness probe + guarded reclaim to the per-hub lock, or amend the recovery contract (P1-008) - [evidence: `shared/hub-lock.cjs` records owner identity (pid + random nonce + timestamp) and a 10-minute lease; a live holder is refused on collision, a stale holder (dead pid OR expired lease) is safely reclaimed; harness: shared-lock live-holder refused + shared-lock stale-holder reclaimed (part of 9/9)]
- [x] T008 [REQ-006] Allowlist + realpath-confine the activation `--hub`/`--child` identifiers before any side effect (P1-003) - [evidence: `confineArgs()` gate in `activate-hub.cjs` runs before any side effect — hub id must match `^[a-z0-9][a-z0-9-]*$`, the hub dir must resolve inside the activation root, `--child` must resolve inside the repo; teeth test — `activate-hub --hub "../../evil"` fails with "unsafe hub id" before any effect]
- [x] T009 [REQ-007] Document process-replacement as the engine-cache contract or add identity-keyed invalidation (P2-009) - [evidence: `compiled-route.cjs` — the process-lifetime engine cache is now a documented contract (comment); safe because the resolver's serve-time identity gate fails a drifted snapshot to legacy, and a restart picks up a new policy]

**Round 2 — re-review remediation (built)**

A fresh 10-iteration `/deep:review` of the tranches above completed iteration 1, then halted on an unrelated reducer/strategy-anchor workflow-infra bug (external blocker, not a packet finding). Iteration 1 surfaced three real issues, closed by a redesign:

- [x] T010 Rebuild the per-hub lock's stale reclaim as an atomic winner election, and correct its comment (RR-P1-A, RR-P2-C) - [evidence: `shared/hub-lock.cjs` rebuilt on an atomic `mkdir` lock directory (mkdir is an atomic exclusive create); owner identity (pid + nonce + lease) lives in `owner.json` inside the lock dir; stale reclaim re-checks staleness immediately before clearing the dead dir and re-races the mkdir; header comment corrected to describe the real mechanism (mkdir lock + lease + `kill(pid,0)`) and honestly documents the residual (OS-flock needed for perfect reclaim; PID reuse within an unexpired lease is lease-bounded, not detected); `node --check` clean]
- [x] T011 Replace `reconcileTuple` with a write-ahead journal so a crash-interrupted flip recovers to the intended advanced fence, not a stale one (RR-P1-B) - [evidence: `flip-serving.cjs` writes `.flip-journal.json` (intent + selectedPolicy + before/after fence) BEFORE mutating the tuple and clears it only AFTER all writes; `recoverFromJournal()` completes an interrupted flip deterministically to the journal's intended fence on the next run; `node --check` clean]
- [x] T012 Update the harness for the mkdir-dir lock and add write-ahead-journal recovery coverage (RR-P1-A, RR-P1-B) - [evidence: `verify-runtime-engine.cjs` now **10/10** — adds `write-ahead journal: interrupted flip recovered to the intended advanced fence`; the two shared-lock checks (`a live holder is refused`, `a stale holder is reclaimed`) re-verified against the rebuilt mkdir-dir lock; LIVE `010-live-activation/activation` tree byte-identical after the run (git-dirty 0); `activate-hub --verify` still works under the new lock (sandbox): "ACTIVATION BOUND … rollback.byteExact=true", no lingering `.flip.lock` dir]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verification for all nine findings is evidence-based, not task-based — see `checklist.md` Code Quality and Testing sections for the full `node --check` (7 files) / digest-identity / harness (9/9) / teeth-test verification cited on T001-T009. No additional phase-3 tasks beyond that evidence.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All twelve tasks (T001-T012) complete with evidence — T001-T009 round 1, T010-T012 round 2
- [x] No regression — `verify-runtime-engine.cjs` **10/10** (grew from 6/6 -> 9/9 in round 1, then 9/9 -> 10/10 in round 2 with the write-ahead-journal recovery fixture and the mkdir-dir lock fixtures), digests unchanged, LIVE activation tree byte-identical before/after (git-dirty 0)
- [x] `node --check` clean on all 7 touched runtime files (round 1 + round 2 combined)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Shared contract**: `shared/frozen-scorer-contract.cjs`
- **Shared lock**: `shared/hub-lock.cjs`
- **Serving flip**: `011-runtime-engine/lib/flip-serving.cjs`
- **Activation driver**: `010-live-activation/lib/activate-hub.cjs`
- **Regression harness**: `011-runtime-engine/harness/verify-runtime-engine.cjs`

<!-- /ANCHOR:cross-refs -->
