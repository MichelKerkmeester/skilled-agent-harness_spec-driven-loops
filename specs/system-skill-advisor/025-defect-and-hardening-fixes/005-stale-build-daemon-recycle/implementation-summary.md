---
title: "Implementation Summary"
description: "A rebuilt skill advisor now replaces its running daemon on the next call instead of serving the old code until a manual restart."
trigger_phrases:
  - "stale build daemon recycle summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/026-defect-and-hardening-fixes/005-stale-build-daemon-recycle"
    last_updated_at: "2026-10-05T16:00:00Z"
    last_updated_by: "stale-build-daemon-recycle"
    recent_action: "Added stale-build recycling to the launcher and CLI; proven live"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stale-build-daemon-recycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-stale-build-daemon-recycle |
| **Completed** | 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The first advisor call after a rebuild now reaches the new build.

- **Launcher.** Before bridging to a live owner, the launcher checks whether the daemon was launched before the current server entrypoint was built. If so it reaps and relaunches it through the existing respawn path. A skipped recycle, for example when another launcher is already doing it, falls back to the bridge and writes no diagnostic to the stream it carries.
- **CLI.** The CLI connects to a live daemon directly, so it makes the same check. On a stale daemon it starts a launcher, waits for the lease to show the replacement and then connects. A launcher that exits with the old daemon in place leaves the call using it.
- **Off switch.** `SPECKIT_BRIDGE_RESPAWN_DISABLED=1` stops the launcher recycling, and warm-only calls never start one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-skill-advisor-launcher.cjs` | Modified | Predicate and recycle |
| `skill-advisor-cli.ts` | Modified | Predicate and recycle wait |
| `launcher-stale-build-recycle.vitest.ts` | Created | Predicate tests |
| `daemon-lease-contract.md` | Modified | Stale-build recycle documented |
| `v4.0.0.3.md` | Modified | Release note; the restart upgrade note is gone |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first live run touched the entrypoint and called the CLI, and nothing recycled: the CLI talks to a live daemon's socket and only starts the launcher on a cold start. The same check was then added to the CLI, and both paths were proven against the real daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the built entrypoint's mtime, not source files | The daemon runs what was built; a source edit not yet built changes nothing it serves |
| Count only a launched daemon | A launcher still bootstrapping has a lease without `childPid` and must never be reaped |
| Fall back to the running daemon when a recycle is skipped | An old answer beats a failed call, and the next call retries the recycle |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Predicate tests | 7 of 7 |
| Advisor suite | 135 of 135 files, 1012 passed, 6 skipped |
| Stress suite | 64 of 64 |
| Package typecheck | Passes |
| Live launcher recycle | Daemon 47198 and owner 47184 reaped; replacement 5987 under owner 5825 |
| Live CLI recycle after touching the entrypoint | One call, about 1 second, `ok`; daemon 19868 replaced by 20477; later calls kept 20477 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The cold-start failure seen earlier in the session did not recur in the two cold starts observed here, so its cause is still unknown.
2. A tool already running on the old daemon is interrupted by the recycle and must be retried.
<!-- /ANCHOR:limitations -->

---
