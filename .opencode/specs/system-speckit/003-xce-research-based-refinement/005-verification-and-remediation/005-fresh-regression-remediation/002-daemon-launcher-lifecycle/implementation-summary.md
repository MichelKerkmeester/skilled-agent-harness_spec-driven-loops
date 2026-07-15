---
title: "Implementation Summary: Daemon Launcher & Lifecycle Remediation"
description: "Planning-only status for this remediation sub-phase: 15 findings carried as tasks; no fixes applied yet."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/002-daemon-launcher-lifecycle"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase impl record from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Daemon Launcher & Lifecycle Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — all 15 findings fixed; verification green |
| **Date** | 2026-06-16 |
| **Findings carried** | 15 (all FIXED, none refuted) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 15 daemon-launcher/lifecycle findings fixed across 8 source files, each mirroring the cited correct sibling pattern. Grouped:

- **Bootstrap-lock PID-stamp reclaim** (T003 spec-memory, T004 code-index — the Round-2 CONFIRMED P1): stamp `owner.pid` inside the lockdir at mkdir and reclaim the instant `processLiveness(ownerPid)==='dead'`, keeping the 5-min mtime path only as the unstamped-lock fallback. Closes the TTL(300s) > deadline(120s) wedge that blocked dead-socket respawn.
- **Owner-lease atomic CAS reclaim** (T001 spec-memory, T015 skill-advisor + code-index): stale reclaim now `unlink` + `writeOwnerLeaseFileExclusive` (O_EXCL); EEXIST loser returns acquired:false and never sets `ownerLeasePid`, so it cannot delete the winner's lease. Replaces last-writer-wins re-read in all three launchers.
- **Reap safety gates**: T011 (spec-memory refuses to reap a heartbeat-fresh `live-owner` on a socket-probe-only verdict — cap-refusal ≠ death); T010 (skill-advisor verifies the live pid's executable basename matches the lease before SIGKILL — PID-reuse guard); T002 (code-index reaps the reclaimed orphan daemon under the bootstrap lock before spawning a successor).
- **Signal/escalation correctness**: T007 (code-index removes its own signal handler before re-raising so catchable signals mirror as 128+n, not exit 0); T009 (skill-advisor heartbeat self-shutdown escalates SIGTERM→wait→SIGKILL); T006 (spec-memory db-lock-held retry uses the `shouldAbortRelaunchOnFire` ppid/owner-gone guard); T005 (hf-model-server respawn lock reclaim made atomic via rename-claim).
- **IPC + sweeper + fanout**: T012 (socket-server answers liveness probes at the client cap without occupying a durable slot); T008 (orphan sweeper preserves a live re-elected daemon holding >1 daemon-ipc.sock FD); T013 (fanout-run comment corrected — `SPECKIT_*_STATE_DIR` is detection-only) + T014 (replica count>1 isolation test added).

Source files: `mk-spec-memory-launcher.cjs`, `mk-code-index-launcher.cjs`, `mk-skill-advisor-launcher.cjs`, `lib/model-server-supervision.cjs`, `shared/ipc/socket-server.ts`, `scripts/orphan-mcp-sweeper.sh`, `deep-loop-runtime/scripts/fanout-run.cjs` (+ its unit test).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

confirm → fix (mirror sibling) → vitest regression → whole-gate delta. For each finding the cited file:line was opened and confirmed a real defect (none refuted), then fixed by mirroring the named correct sibling. To make launcher internals testable in the isolated fake-root harness (no live recycles), `configureLauncherPathsForTesting` + the relevant `acquireBootstrapLock`/`removeStaleBootstrapLock`/`acquireOwnerLeaseFile`/`reapOwnerBeforeRespawn` helpers were exported from the three launchers; the orphan sweeper got a sourcing guard so its predicate can be unit-tested with a stubbed `lsof`.

New/extended test suites (all temp-dir + stub based; NO live daemon touched):
- `launcher-code-index-lifecycle.vitest.ts` (7), `launcher-spec-memory-lifecycle.vitest.ts` (7), `launcher-code-index-signal-mirror.vitest.ts` (3), `model-server-respawn-lock-atomic.vitest.ts` (6), `orphan-sweeper-ipc-preserve.vitest.ts` (3) — spec-kit.
- `launcher-reap-pid-reuse.vitest.ts` (6) — skill-advisor.
- `fanout-run.vitest.ts` +1 (19 total), `ipc-client-cap-fanout-stress.vitest.ts` +1 (3 total).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- All 15 findings were confirmed real on opening the cited code; none refuted. Fixes mirror the named correct sibling pattern.
- **T013 (fanout-run state-dir)**: chose the recommendation's comment-fix option over remapping `SPECKIT_<KIND>_STATE_DIR` to `CODEX_HOME`/`OPENCODE_HOME`/`CLAUDE_CODE_HOME`. Remapping the CLI home would break credential/auth lookup (the "Not logged in" failure the dispatch-env allowlist explicitly guards). Real replica isolation already comes from the unique `lineage.label` artifact dir, so correcting the misleading comment removes the false guarantee without risking auth breakage.
- **T008 (sweeper)**: the code fix (preserve a daemon holding >1 daemon-ipc.sock FD) restores the "cannot kill a live session" guarantee, so the doc wording in `session-cleanup.sh` / `ENV_REFERENCE.md` (an "at minimum" fallback in the recommendation, and out of this phase's cited-file scope) is now accurate without editing it.
- **T015 helper-hoist**: deferred the optional `.opencode/bin/lib` extraction of the owner-lease acquire/clear helpers — the CAS block is an identical ~8-line patch in 3 files with no behavior gain from hoisting; noted as an optional anti-drift follow-up rather than expanding blast radius here.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Implementation verified via vitest in the isolated fake-root harness — NO live daemon recycled or killed.

Whole-gate delta (affected spec-kit launcher gate, run together):
- Baseline (pre-change subset): code-index/watchdog/reap-hardening/db-lock-exit/orphan-sweep = 45 pass.
- After (full affected gate incl. all new suites + adjacent launcher tests: reap-hardening, clean-close, recycle-lease, idle-timeout, ipc-bridge, daemon-reelection, session-proxy, persistent-log, etc.): **154 pass / 0 fail / 8 skipped (20 files pass, 1 skipped)**.
- skill-advisor deterministic subset (bootstrap, reap-pid-reuse, idle-timeout, rename-invariants): **27 pass**.
- fanout-run: **19 pass** (+1 new replica-isolation case); ipc cap-stress: **3 pass** (+1 new probe-at-cap case, existing refuse case still green).

Pre-existing flaky live-spawn suites (NOT regressions — confirmed by reverting my change): `launcher-lease.vitest.ts` (5 timeout-fail, env/timing) and `skill-advisor-launcher-orphan-reaping.vitest.ts` "serializes two stale lease reclaimers and leaves one writer" (~3/8 fail at BASELINE without my CAS change; spawns two real launchers and races a `waitFor` budget). My owner-lease CAS makes that path single-winner-stricter (correct direction), within the baseline flake band.

Per-file syntax: `node --check` green on all 4 .cjs; `tsc -p tsconfig.json` exit 0 (socket-server.ts); `bash -n` green on the sweeper.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- T002/T006/T007/T009 wiring lives in spawn/exit paths (`launcherMain`, child-exit handler, heartbeat self-shutdown) that cannot be driven in-process without a real daemon; those are verified by isolated mechanism tests (signal-mirror harness) and source-structure assertions, not a full live-spawn integration test (the existing live-spawn suites are flaky here).
- T015 owner-lease helper hoist to `.opencode/bin/lib` deferred (optional anti-drift follow-up; the CAS block is identical across the 3 launchers today).
- T008 `has_live_ipc_socket_connection` relies on `lsof -U` showing >1 FD on `daemon-ipc.sock` for an actively-bridged daemon (verified live on macOS); on a host without `lsof` the predicate returns false (sweep-eligible) — consistent with the existing TCP-listener check's lsof dependency.
- Two pre-existing flaky live-spawn suites remain flaky (documented above) — orthogonal to this phase and present at baseline.
<!-- /ANCHOR:limitations -->
