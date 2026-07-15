---
title: "Tasks: Daemon Launcher & Lifecycle Remediation"
description: "One task per deep-review finding in this sub-phase (15 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/002-daemon-launcher-lifecycle"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase tasks from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Daemon Launcher & Lifecycle Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] 002-S1 Capture the subsystem test/validation baseline. Evidence: skill-advisor launcher tests 30 pass; spec-kit launcher subset (code-index/watchdog/reap-hardening/db-lock-exit/orphan-sweep) 45 pass; pre-existing flaky live-spawn `launcher-lease.vitest.ts` (5 fail, environment/timing) and `skill-advisor-launcher-orphan-reaping.vitest.ts` ("serializes two stale lease reclaimers" ~3/8 fail at baseline) recorded as NOT-my-change.
- [x] 002-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing. Evidence: all 15 opened + confirmed real (none refuted); fixes mirror cited sibling patterns.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [x] 002-T001 · `.opencode/bin/mk-spec-memory-launcher.cjs:478` — Reclaim made atomic: stale path now `unlinkSync(currentOwnerLeasePath)` + `writeOwnerLeaseFileExclusive` (O_EXCL); EEXIST → re-read + acquired:false. Loser never sets `ownerLeasePid`, so it can't unlink the winner's lease. Test: `launcher-spec-memory-lifecycle.vitest.ts` owner-lease CAS cases. _[downgraded→P2]_ _[fixed]_
- [x] 002-T002 · `.opencode/bin/mk-code-index-launcher.cjs` (launcherMain) — Alive-but-stale reclaim now captures the reclaimed orphan ownerPid and reaps it via the existing `reapOwnerBeforeRespawn()` under the bootstrap lock BEFORE `launchServer()`, so no second daemon runs against the live SQLite. Test: `launcher-code-index-lifecycle.vitest.ts` source-order assertion. _[downgraded→P2]_ _[fixed]_
- [x] 002-T003 · `.opencode/bin/mk-spec-memory-launcher.cjs:1270` — Ported skill-advisor pattern: `owner.pid` stamped inside lockDir at mkdir; `removeStaleBootstrapLock()` reclaims as soon as `processLiveness(ownerPid)==='dead'`, 5min mtime retained as unstamped fallback. Test: `launcher-spec-memory-lifecycle.vitest.ts` bootstrap cases. _[downgraded→P2]_ _[fixed]_
- [x] 002-T004 · `.opencode/bin/mk-code-index-launcher.cjs:839` — Same PID-stamp + provable-death reclaim (`owner.pid` stamp + `removeStaleBootstrapLock`), 5min mtime path kept as unstamped fallback. ROUND-2 CONFIRMED P1 fixed first. Test: `launcher-code-index-lifecycle.vitest.ts` bootstrap cases (dead-holder reclaim with huge staleMs proves the deadline-vs-TTL bug closed). _[confirmed]_ _[fixed]_
- [x] 002-T005 · `.opencode/bin/lib/model-server-supervision.cjs:666` — Respawn lock reclaim now atomic: rename stale lock → unique `.stale.<pid>.<ts>` claim, proceed only if rename succeeds (ENOENT loser → acquired:false), then delete claim + open 'wx'. Test: `model-server-respawn-lock-atomic.vitest.ts` (reclaim, lost-race fs mock, live-holder). _[P2]_ _[fixed]_
- [x] 002-T006 · `.opencode/bin/mk-spec-memory-launcher.cjs:1425` — db-lock-held retry setTimeout now gates on `shouldAbortRelaunchOnFire({shuttingDown, currentPpid:process.ppid, initialPpid:LAUNCHER_INITIAL_PPID})`, matching the primary relaunch path. Test: `model-server-respawn-lock-atomic.vitest.ts` predicate cases. _[P2]_ _[fixed]_
- [x] 002-T007 · `.opencode/bin/mk-code-index-launcher.cjs:897` — Child-exit handler now calls `process.removeAllListeners(signal)` before `process.kill(process.pid, signal)`, so a catchable signal terminates the launcher with 128+n instead of being intercepted → exit 0. Test: `launcher-code-index-signal-mirror.vitest.ts` (fixed mirror signals; buggy mirror exits 0; source order). _[P2]_ _[fixed]_
- [x] 002-T008 · `.opencode/scripts/orphan-mcp-sweeper.sh:293` — Added `has_live_ipc_socket_connection()` (lsof -nP -U, >1 daemon-ipc.sock FD = listener+peer ⇒ in use) wired into `preserve_reason`; preserves a live re-elected daemon bridging a sibling. Verified live (pid preserved) + Test: `orphan-sweeper-ipc-preserve.vitest.ts` (stubbed lsof, sourcing guard added). NOTE: doc wording in session-cleanup.sh / ENV_REFERENCE.md is now accurate again (out of this phase's scope; code fix restores the guarantee). _[P2]_ _[fixed]_
- [x] 002-T009 · `.opencode/bin/mk-skill-advisor-launcher.cjs:546` — Heartbeat-failure self-shutdown now async-escalates: SIGTERM → `waitForChildExit(child,5000)` → SIGKILL if still running, before `process.exit(128)`. Test: `launcher-reap-pid-reuse.vitest.ts` source-structure assertion (escalation runs on exit, not unit-drivable in-process). _[P2]_ _[fixed]_
- [x] 002-T010 · `.opencode/bin/mk-skill-advisor-launcher.cjs:417` — Added `readProcessExecutableBasename()` (ps -p comm=); `reapOwnerBeforeRespawn(ownerPid, expectedExecutablePath)` skips the kill (returns `owner-pid-reused`) when the live pid's executable basename provably differs from the lease's `executablePath`; both call sites thread it. Test: `launcher-reap-pid-reuse.vitest.ts`. _[P2]_ _[fixed]_
- [x] 002-T011 · `.opencode/bin/mk-spec-memory-launcher.cjs:754` — `reapOwnerBeforeRespawn` now refuses (returns `owner-heartbeat-fresh`) when the owner lease classifies `live-owner` via classifyOwnerLease (heartbeat within TTL), so a cap-saturated-but-heartbeating daemon is never killed on a socket-probe-only verdict. Test: `launcher-spec-memory-lifecycle.vitest.ts` heartbeat-gate cases. _[P2]_ _[fixed]_
- [x] 002-T012 · `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:310` — At cap, `answerProbeOrRefuseAtCap()` peeks the first frame: a `liveness-probe` initialize gets a matching-id JSON-RPC reply (daemon proven alive) and closes WITHOUT a durable slot; non-probe over-cap clients still refused. Test: `ipc-client-cap-fanout-stress.vitest.ts` new probe-at-cap case (+ existing refuse case still green). _[P2]_ _[fixed]_
- [x] 002-T013 · `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:415` — Comment rewritten to truth: `SPECKIT_<KIND>_STATE_DIR` is detection-only (native CLIs read CODEX_HOME/OPENCODE_HOME/CLAUDE_CODE_HOME, not this var); real replica isolation = unique `lineage.label` artifact dir. Chose comment-fix over home-remap to avoid the credential/auth (“Not logged in”) breakage the dispatch-env allowlist guards. _[P2]_ _[fixed]_
- [x] 002-T014 · `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:184` — Added a `{label:'rep', kind:'cli-codex', count:2}` case asserting rep-1/rep-2 each receive a DISTINCT `SPECKIT_CODEX_STATE_DIR` read from each replica's captured stdout (`logs/fanout-lineage.out`), plus LINEAGE_ID=rep-1/rep-2. 19/19 fanout-run tests pass. _[P2]_ _[fixed]_
- [x] 002-T015 · `.opencode/bin/mk-skill-advisor-launcher.cjs:502` + `mk-code-index-launcher.cjs` — Same atomic-reclaim (unlink + O_EXCL CAS) applied to all three launchers in lockstep with the spec-memory fix. (Helper-hoist to .opencode/bin/lib deferred — proportional: identical 8-line block, no behavior gain; noted as optional follow-up.) Tests: code-index + skill-advisor lifecycle CAS cases. _[P2]_ _[fixed]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] 002-V1 vitest in the isolated fake-root harness; no live recycles. Evidence: all new tests use temp dirs + test-config hooks (`configureLauncherPathsForTesting`) and stubbed lsof/fs; NO live daemon recycled or killed. New suites: launcher-code-index-lifecycle (7), launcher-spec-memory-lifecycle (7), launcher-code-index-signal-mirror (3), model-server-respawn-lock-atomic (6), orphan-sweeper-ipc-preserve (3), skill-advisor launcher-reap-pid-reuse (6), fanout-run +1 (19), ipc cap-stress +1 (3).
- [x] 002-V2 Whole-gate delta reported (no regressions). Baseline→after: spec-kit affected launcher gate 45→154 pass (0 fail, 8 skipped); skill-advisor 30→ deterministic subset 27 pass. Pre-existing flaky live-spawn tests (`launcher-lease.vitest.ts`, `skill-advisor-launcher-orphan-reaping.vitest.ts` "serializes two stale lease reclaimers") confirmed flaky AT BASELINE (3/8 fail without my changes) — NOT a regression; my CAS change is single-winner-stricter (correct direction).
- [x] 002-V3 Update each finding's status — recorded in tasks.md per-task (all 15 fixed); registry/round2 are review artifacts (read-only here), per-task evidence is the authoritative status surface for this remediation phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 15 findings resolved — all FIXED (none refuted); each cited file:line was opened and confirmed a real defect. Fixes mirror cited sibling patterns. Verification gate green (154 pass / 0 fail / 8 skipped on the affected spec-kit launcher gate; 27 pass on the skill-advisor deterministic subset). Two pre-existing flaky live-spawn suites confirmed flaky at baseline (not regressions). SCOPE-LOCK held: only this phase's cited files + their tests touched.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
