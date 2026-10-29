---
title: "Implementation Summary"
description: "The orphan sweeper now reaps parentless processes left running from temp and scratch folders, no longer reaps its own calling session's MCP helpers on macOS, spares the shared skill-advisor daemon, and runs live every 10 minutes from an installed LaunchAgent."
trigger_phrases:
  - "orphan sweep temp processes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/056-orphan-sweep-temp-processes"
    last_updated_at: "2026-10-29T08:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped sweeper fixes, installed live agent"
    next_safe_action: "Read ~/.local/share/orphan-sweeper.log after a few days of sweeps"
    blockers: []
    key_files:
      - ".skilled/scripts/orphan-mcp-sweeper.sh"
      - ".skilled/skills/system-spec-kit/runtime/tests/orphan-sweeper-temp-path.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d1e4fb9c-409c-43cd-8361-2e274fea5d2c"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Advisor daemon on a live sweep: preserve the launcher and its launcher-parented server (operator choice)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 056-orphan-sweep-temp-processes |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Leftover benchmark browsers, test fixtures and stuck repros no longer pile up for weeks: every 10 minutes the sweeper kills any process whose parent has exited and that has run for 6 hours or more from your temp folder, the Claude scratchpad or a worktree `.scratch-*` folder. The same change fixed two ways a live sweep would have hurt you: it would have reaped the calling session's own MCP helpers, and it would have kept cold-restarting the skill-advisor daemon your prompt hooks use.

### Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent

The new `temp-path-orphan` class needs every part of the shape at once: parent is pid 1, age at or over `ORPHAN_TEMP_PROCESS_AGE_HOURS` (default 6), owned by you, not a zombie, and a command line inside one of those folders. Apps macOS runs from a temp location (`AppTranslocation`) never match. The shape is checked again right before each signal, and a port the leftover holds does not save it, since the http.server left by a benchmark was one.

On macOS, `pgrep` leaves out its own ancestors unless given `-a`, so a sweep started inside a session never saw that session. The session tree now passes `-a` on Darwin only, because Linux reads that flag as an output-format option.

The advisor launcher exits by itself after 30 idle minutes, and hooks hold no connection to it between prompts, so the old rule saw an orphan. The launcher is now preserved, and its server is preserved while that launcher is its parent. A server whose launcher died stays sweepable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/orphan-mcp-sweeper.sh` | Modified | Temp-path orphan class and recheck, macOS ancestor flag, advisor preserve rule |
| `.skilled/skills/system-spec-kit/runtime/tests/orphan-sweeper-temp-path.vitest.ts` | Created | Seven cases: class matrix, listener rule, pgrep flag per platform, advisor parentage |
| `.skilled/scripts/README.md` | Modified | Sweeper row names the new class |
| `~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist` | Created (outside repo) | Live copy of the template, without `--dry-run` and `--verbose` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The temp-path class was written in this session. The pgrep fix, the advisor preserve rule and two of the three test blocks were implemented by DeepSeek V4.1 Flash at `--thinking max` through Pi on the `llmgateway` route, one change per brief, with every diff checked against the brief before the next dispatch. Each step was followed by `bash -n`, shellcheck, the three sweeper suites and a dry run on the live process list. The LaunchAgent was installed only after the final dry run proposed no kills, then started once with `launchctl kickstart`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Match temp and scratch paths, not binary names | Chrome, Python, node and tail all leaked; what they shared was a parentless process running from throwaway space |
| 6-hour age floor | Long test and benchmark runs finish well inside it, and a leftover still dies within a working day |
| Preserve the advisor rather than add a connection heuristic | The launcher already owns its lifetime through its idle timeout; a sweep between prompts cannot tell idle from abandoned |
| Repo template keeps `--dry-run` | The template README says only the installed copy drops it after review |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `/bin/bash -n` (bash 3.2.57) and `shellcheck -S warning` | PASS, exit 0 |
| `npx vitest run orphan-sweeper launcher-stop-hook-orphan-sweep` | PASS, 3 files, 18 tests |
| Dry run from inside this session, before the fixes | FAIL as expected: proposed TERM for this session's pids 86738 and 87191 and the advisor pair 80911 and 80912 |
| Same dry run after the fixes | PASS: `reason=live-session-tree` for 86738 and 87191, `advisor-self-idle-timeout` and `advisor-launcher-child` for 80911 and 80912, `kills=0` |
| `launchctl kickstart` of the installed agent | PASS: log shows `dry_run=false`, `candidates=12 kills=0 exit_code=0`; `LastExitStatus = 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live kill of a temp-path orphan was observed.** The orphans that motivated this were killed by hand before the class existed, and the 6-hour floor rules out making a fresh one inside one session; the unit matrix covers the verdict. The first real kill will show up as `class=temp-path-orphan` in `~/.local/share/orphan-sweeper.log`.
2. **Going live also enabled the older MCP-daemon kills.** They proposed nothing on this machine today. To stop the agent: `launchctl bootout gui/$(id -u)/com.michelkerkmeester.orphan-sweep`, then delete the plist.
<!-- /ANCHOR:limitations -->

---
