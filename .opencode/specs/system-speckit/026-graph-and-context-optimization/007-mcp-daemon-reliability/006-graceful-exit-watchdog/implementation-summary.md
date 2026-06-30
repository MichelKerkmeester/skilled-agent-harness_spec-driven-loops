---
title: "Implementation Summary: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′)"
description: "Implemented. RSS-ceiling watchdog with graceful-exit recovery (default-off), crash-loop-guarded supervision, before-death descendant snapshot for the give-up reap, and an additive childPid lease. Headless-verified (node --check + 12/12 vitest) and twice adversarially reviewed clean."
trigger_phrases:
  - "launcher watchdog summary F1 implemented"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/006-graceful-exit-watchdog"
    last_updated_at: "2026-05-28T23:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented via cli-opencode + REQ-007 reap fix; 12/12 vitest; 2 reviews clean"
    next_safe_action: "Confirm REQ-008 host relaunch to enable self-exit default-on; run SC-001 live"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000614"
      session_id: "007-006-impl-summary"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-graceful-exit-watchdog |
| **Completed** | 2026-05-28 (implemented + headless-verified; RSS self-exit default-off pending REQ-008; SC-001 live deferred) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The launcher now has a memory ceiling and a recovery path: instead of growing until the OS OOM-kills it (with no restart), the daemon recycles itself cleanly before the kernel acts; and it records the daemon child pid in the lease (the precondition for phase 007).

### RSS watchdog + graceful-exit supervision (implemented)

A periodic monitor (`startRssWatchdog`) rolls up the daemon's process-tree RSS via an injectable `ps` ppid-subtree walk (`sampleProcessTreeRssMb`/`resolveProcessTreeRows`) — including the **forked sidecar grandchild**, where the model lives under default `auto`. On a sustained `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` breach the launcher SIGTERMs the child (grace clamped to exceed the daemon's 5s shutdown deadline, floor 7000ms), SIGKILLs on timeout, then **exits cleanly** so the host relaunches a fresh launcher (clean MCP re-initialize) — never a transparent in-place respawn (re-piping stdio cannot restore the MCP `initialize` session). The breach→self-exit ships **default-off**, active only when both the ceiling and `SPECKIT_LAUNCHER_RSS_SELF_EXIT=1` are set (REQ-008 host-relaunch contract unconfirmed). Unexpected child exits route through a crash-loop-guarded supervisor (`superviseChildExit` + `createCrashLoopGuard`) with exponential backoff; on give-up it fails loud and reaps the orphaned sidecar.

### REQ-007 reap-after-reparent fix

Review caught that a give-up reap anchored on the dead daemon childPid is a **no-op** in the bite case: a forked-`detached` sidecar re-parents to pid 1 on hard daemon death, so the dead childPid is absent from `ps`. The fix adds an **always-on monitor** (runs even when the RSS self-exit is off, at a 30s cadence) that records a **before-death descendant snapshot** (`lastKnownDescendantPids`); on give-up `reapProcessTreeGroups` reaps the union of any still-live childPid subtree and the still-alive snapshot pids, gated by `pid>1 && pid!==childPid && pid!==process.pid && signal(pid,0)` (alive-check, bounding pid-reuse).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | `require.main` guard + exported helpers; process-tree RSS sampler (injectable runner, EPERM=unknown); default-off breach→graceful-self-exit; crash-loop supervisor; before-death descendant snapshot + reap-after-reparent; additive `childPid` lease field; pure `buildLeaseObject` |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Create | 12 headless tests: RSS roll-up, EPERM-unknown, backoff vs give-up, grace clamp, default-off gating, orphan-reap-from-snapshot, dead-pid guard, snapshot keep-on-unknown, lease shape, kill-path EPERM |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-opencode` dispatch (`openai/gpt-5.5 --variant high`, main-tree under an RM-8 L1 fence). The orchestrator ran independent verification (`node --check` + the watchdog vitest) and a 6-lens adversarial review, which surfaced one real P1 (the REQ-007 reap no-op on hard daemon death) plus three test-coverage gaps. The orchestrator applied the before-death-snapshot reap fix and the missing tests directly (full context in hand), then ran a second, focused adversarial re-review of the fix — both reviews ended at 0 confirmed defects. The RSS-breach self-exit ships default-off because REQ-008 (host relaunch on clean exit 0) cannot be confirmed headlessly; the `childPid` lease is a net-new additive field (not a port of mk-code-index's owner-lease). The diff also persists `ownerPid` on-disk (previously a derived field) — harmless and additive; no reader keys off it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Graceful self-exit on breach, not transparent respawn | Re-piping stdio bytes cannot restore the MCP `initialize` session; clean exit + host relaunch re-initializes correctly |
| Sample the process TREE, not just the daemon child | Under default `auto` the dominant RSS is in the forked sidecar grandchild |
| `childPid` is a new additive lease field | The cited mk-code-index "precedent" is a separate owner-lease mechanism mk-spec-memory lacks; adding a field to the existing JSON is simpler and reader-safe |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check mk-spec-memory-launcher.cjs` | PASS |
| `vitest run tests/launcher-watchdog.vitest.ts` | PASS (12/12) — RSS roll-up, EPERM-unknown, backoff vs give-up, grace clamp, default-off, orphan-reap-from-snapshot, dead-pid guard, lease shape, kill-path EPERM |
| Require-safety (import does not spawn a daemon) | PASS (`require.main` guard; exports load clean) |
| 6-lens adversarial review (incl. run-as-script regression) | PASS — 1 real P1 (REQ-007 reap no-op) + 3 test gaps found |
| REQ-007 reap fix + 3 test gaps closed; focused re-review | PASS — 0 confirmed defects; no wrong-pid-kill path |
| `validate.sh --strict` on this packet | PASS |
| Host relaunch-on-exit-0 (REQ-008) + SC-001/SC-002 live RSS/crash-loop | DEFERRED — REQ-008 gates self-exit default-on; live observation needs a running daemon |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **RSS-breach self-exit ships default-off** until the host relaunch-on-clean-exit contract (REQ-008) is confirmed (else self-exit reduces availability). Enable with `SPECKIT_LAUNCHER_RSS_SELF_EXIT=1` once confirmed.
2. **SC-001/SC-002 not observed live** — the headless tests use injectable runners + mocked signals; a live daemon is needed to observe a real ceiling-breach recycle and crash-loop behavior (T008).
3. **REQ-001 graceful-self-exit *mechanism* (`recycleViaGracefulSelfExit` + `launcherShutdownInProgress` no-respawn guard) has no unit test** — code reviewed correct (P2) but exercised only on the default-off path; testing it needs heavier module-state injection.
4. **Give-up reap pid-reuse residual** — the before-death snapshot is at most one monitor tick (~30s) old; the `signal(pid,0)` alive-gate bounds but cannot fully eliminate reaping a reused pid. Documented in-code; acceptable in the terminal give-up state.
<!-- /ANCHOR:limitations -->
