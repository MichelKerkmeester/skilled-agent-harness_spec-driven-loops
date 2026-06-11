---
title: "Implementation Summary: Skill Advisor Cross-Session Reconnect Hardening"
description: "The skill-advisor launcher now recovers from confirmed-dead lease-holder sockets, cleans stale wedged child pids under the bootstrap lock, and preserves the intended code-index parity lifecycle."
trigger_phrases:
  - "skill advisor launcher implementation"
  - "dead socket respawn summary"
  - "stale lease cleanup summary"
  - "advisor reconnect verification evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect"
    last_updated_at: "2026-06-11T10:07:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Recorded launcher remediation evidence."
    next_safe_action: "Use deferrals for future follow-up."
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/spec.md"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/plan.md"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/tasks.md"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:8b46b0fd8978997547f6e1782f1eaefc3ea4f5b90f80d3e7297ac9521182f86f"
      session_id: "skill-advisor-cross-session-reconnect-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "C2 release-not-kill is deferred because this phase targets code-index parity, not spec-memory re-election."
      - "C5 relaunch-on-child-exit is deferred because the advisor remains an inherit-stdio, non-detached launcher."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | `019-skill-advisor-cross-session-reconnect` |
| Completed | 2026-06-11 |
| Level | 1 |
| Status | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill-advisor launcher now handles the same dead-socket recovery class as the code-index launcher while keeping the advisor's simpler inherited-stdio lifecycle. A lease holder with a socket that exists but fails consecutive deep probes no longer causes a silent secondary-client exit; the launcher reaps the recorded advisor child pid under serialization and starts a replacement that can answer the requesting client.

### Dead-Socket Respawn

`bridgeOrReportLeaseHeld` now inspects the bridge decision and routes `{ action: "respawn" }` into a local `respawnAfterDeadSocket` path. That path honors `SPECKIT_BRIDGE_RESPAWN_DISABLED`, acquires the bootstrap lock, reaps the recorded child pid from the launcher lease, writes a fresh owner lease exclusively, starts the owner heartbeat, and launches the replacement advisor child.

### Stale Launcher Lease Cleanup

The stale launcher lease path now reads the stale lease payload instead of only logging `staleReclaimed:true`. If the recorded child pid is alive and the recorded socket is usable, the launcher attempts to bridge to it. If it is dead or unbridgeable, the child pid is deferred to the bootstrap-lock critical section and reaped before replacement spawn.

### Bootstrap Lock and Model-Server Hardening

Bootstrap lock stale reclaim now uses a 300 second stale threshold and atomic rename claim, so a slow but live cold build is not removed by a competing launcher. Model-server cleanup now sends SIGTERM to the model-server root, reaps descendants, waits for root exit, escalates to SIGKILL if needed, and only then clears the shared model-server pid.

### Replay Classifier

`advisor_validate` moved to the unsafe replay set because it can persist outcome records when outcome events are present. `advisor_recommend` remains replayable; the accepted risk is at most one duplicate shadow delta during backend recycle, which is lower impact than losing Gate-2 routing availability.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Added respawn handling, stale child cleanup, atomic bootstrap stale reclaim, model-server root termination, and replay classifier hardening. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | Modified | Added sandboxed dead-socket respawn and stale wedged child tests; strengthened two-reclaimer single-writer coverage. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/spec.md` | Modified | Replaced scaffold with current feature specification and deferrals. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/plan.md` | Modified | Replaced scaffold with the implementation plan and verification strategy. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/tasks.md` | Modified | Replaced scaffold with completed task evidence. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/implementation-summary.md` | Modified | Replaced scaffold with delivery and verification evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The launcher implementation mirrors the code-index helper shape where it fits the advisor lifecycle and uses the spec-memory reference only for model-server root termination order. Tests copy the launcher and bridge helpers into temp workspaces, set `MK_SKILL_ADVISOR_DB_DIR` and `SPECKIT_IPC_SOCKET_DIR` to temp paths, and use controllable fake processes/sockets so no host daemon, host socket, or host database is touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror code-index respawn helpers instead of spec-memory re-election | The advisor launcher is B-shaped: inherit stdio, non-detached child, rebuild on start, and no detached daemon handoff. Code-index parity is the requested bar. |
| Reap the recorded child pid, not the launcher pid | The launcher lease records `childPid`; that pid is the daemon that can hold resources while the launcher pid is stale or only supervising. |
| Reuse the bootstrap lock for stale-child cleanup | The advisor does not release the bootstrap lock early, so child cleanup and replacement spawn share one serialization point without adding a separate respawn-lock file. |
| Keep `advisor_recommend` replayable | Gate-2 routing should survive recycle; one possible duplicate shadow delta is an accepted low-impact tradeoff. |
| Mark `advisor_validate` unsafe | It can conditionally persist outcome records, so replay could duplicate a mutation. |
| Defer C2 release-not-kill | Releasing a daemon for another launcher belongs to the spec-memory re-election architecture and is intentionally outside this parity phase. |
| Defer C5 relaunch-on-child-exit | The advisor keeps the code-index-style lifecycle where child exit terminates the launcher; relaunch supervision is a future architecture packet. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` in `.opencode/skills/system-skill-advisor/mcp_server` | PASS, exit 0, no TypeScript errors. |
| `npm test -- --run tests/skill-advisor-launcher-orphan-reaping.vitest.ts` in `.opencode/skills/system-skill-advisor/mcp_server` | PASS, 1 file passed, 7 tests passed. |
| `npm test -- --run tests/launcher-session-proxy.vitest.ts` in `.opencode/skills/system-spec-kit/mcp_server` | PASS, 1 file passed, 19 tests passed. |
| `node .opencode/bin/cli-offline-smoke.cjs` | PASS, CLI offline smoke OK with spec-memory `37/37`, code-index `8/8`, skill-advisor `9/9`. |
| Comment hygiene script | PASS after rerunning with `python3`; no output for the changed launcher or test file. Initial `bash` invocation failed because the checker file has Python contents despite its filename. |
| File-scoped comment-hygiene grep | PASS, `comment-hygiene grep: clean` for the changed launcher and test file. |
| Strict packet validation | PASS, exit 0, 0 errors, 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. C2 release-not-kill remains deferred. A session ending still tears down the advisor child instead of releasing a detached daemon to a live secondary owner.
2. C5 relaunch-on-child-exit remains deferred. If the advisor child exits, the launcher exits rather than scheduling a child relaunch loop.
3. The respawn path depends on the bridge helper's deep-probe classification. If the socket is absent rather than present and unresponsive, stale child cleanup falls through the bootstrap-lock path instead of bridge-driven respawn.
<!-- /ANCHOR:limitations -->
