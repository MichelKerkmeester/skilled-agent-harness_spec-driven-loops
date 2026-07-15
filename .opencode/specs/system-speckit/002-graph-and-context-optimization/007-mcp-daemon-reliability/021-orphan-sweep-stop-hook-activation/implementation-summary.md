---
title: "Implementation Summary: Orphan-sweep Stop-hook activation"
description: "The Stop hook can now fall back to the orphan-only sweeper when no session pid is available, so leaked MCP daemons stop accumulating — flag-gated, default-off, and incapable of touching a live session."
trigger_phrases:
  - "orphan sweep stop hook done"
  - "session-cleanup fallback summary"
  - "orphaned mcp accumulation fix"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation"
    last_updated_at: "2026-06-07T17:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped the flag-gated orphan-sweep fallback (4 gating tests pass)"
    next_safe_action: "Phase 022 RC-2 ownership re-election (flag-gated)"
    blockers: []
    key_files:
      - ".opencode/scripts/session-cleanup.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-021-orphan-sweep-stop-hook-activation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-orphan-sweep-stop-hook-activation |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Leaked MCP daemons can finally be cleaned up on session end. The Stop hook runs `session-cleanup.sh`, but that script only reaps a session's processes when `CLAUDE_SESSION_PID` is set — and the harness never sets it, so it logged `skip reason=no-session-pid` and did nothing while orphaned daemons piled up. It deliberately would not guess the pid from its PPID, because on a shared terminal that mis-targets and kills live sibling sessions (the v3.5.0.2 incident). So the safe answer is not to guess at all.

### A flag-gated fallback to the orphan-only sweeper

When there is no session pid, `session-cleanup.sh` can now delegate to the existing `orphan-mcp-sweeper.sh`, which is pid-independent: it reaps only processes that are our MCP launchers/daemons by name, sit outside every live session tree (reparented / ownerless), and are past an age threshold. Because it only touches ownerless processes, it can never kill a live session — the exact failure the script guards against. The fallback is gated by `SPECKIT_STOP_HOOK_ORPHAN_SWEEP`: unset or unknown keeps the historical no-op, `dry-run` invokes the sweeper with `--dry-run` (log only), and `1`/`on`/`live` reaps for real. A sweeper failure is swallowed so it can never break the hook. This ships default-off: process-killing stays opt-in until an operator validates it with a dry-run (playbook 419 already covers that).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/scripts/session-cleanup.sh` | Modified | `run_orphan_sweep_fallback` (off/dry-run/live) in the no-session-pid branch; `SCRIPT_DIR` + `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` + a test-only `SPECKIT_ORPHAN_SWEEPER_BIN` override |
| `mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts` | Created | Gating tests: off (no-op), dry-run, live, unknown -> off, via a stub sweeper |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The session-scoped kill path is untouched; the fallback lives entirely in the previously-dead no-session-pid branch, so the default behavior is byte-identical. The gating is unit-tested by shelling out to the script with a stub sweeper and asserting both the emitted action log and exactly how the sweeper was invoked (`--dry-run` vs live vs not-at-all). Verified with `bash -n`, a functional smoke run across all three modes, and the vitest gating suite (4/4). Rollback is unsetting the flag (instant) or reverting the script. Because the reap only activates on opt-in and only targets ownerless processes, this is safe to ship dormant; enabling it for real is an operator decision after a dry-run review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegate to the orphan-only sweeper, never guess the pid | Guessing from PPID mis-targets live sibling sessions (the v3.5.0.2 incident); orphan-only reaping cannot |
| Default off, with a dry-run ramp | It is a process-killing change I cannot runtime-validate this session; opt-in keeps it safe |
| Reuse the existing Stop-hook wiring | session-cleanup.sh is already invoked; no operator settings edit needed |
| Make the sweeper path overridable | Lets the gating logic be unit-tested without scanning real processes |
| Swallow sweeper failures (`|| true`) | A cleanup helper must never break the session-stop hook |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` session-cleanup.sh | PASS |
| functional smoke (off / dry-run / live) | PASS |
| `launcher-stop-hook-orphan-sweep.vitest.ts` | PASS (4/4) |
| default no-op preserved (flag unset) | PASS |
| comment-hygiene (durable WHY, no ids/paths) | PASS |
| `validate.sh --strict` (this packet) | PASS |
| live reap observed on a real session | DEFERRED (opt-in; operator enables after a dry-run review) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Default off.** Orphans are only swept when an operator sets `SPECKIT_STOP_HOOK_ORPHAN_SWEEP`. The default stays a no-op, so the accumulation only stops once enabled.
2. **Runtime-unverified reap.** The gating is fully tested, but an actual live reap on session end is owed to an operator dry-run-then-enable pass; it cannot be safely exercised in-session.
3. **Session-scoped cleanup still needs the pid.** The precise, session-scoped kill remains gated on `CLAUDE_SESSION_PID`; this packet only adds the pid-independent orphan fallback, it does not make the harness provide a session pid.
<!-- /ANCHOR:limitations -->
