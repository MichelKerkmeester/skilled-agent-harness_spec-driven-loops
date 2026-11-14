---
title: "Implementation Summary: Claude Code session handover on by default and v4.0.2.1 release notes"
description: "Claude Code now hands over by default while every other runtime still waits for its switch, and the v4.0.2.1 release notes and root README describe every handover change since v4.0.2.0."
trigger_phrases:
  - "claude default on release notes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/040-claude-default-on-release-notes"
    last_updated_at: "2026-11-14T20:01:19Z"
    last_updated_by: "generate-context"
    recent_action: "Claude default on, release notes and README rewritten, gate green"
    next_safe_action: "Wait for the operator to approve merge and push"
    packet_purpose: "Purpose: A Claude Code session hands over by default while every other runtime stays off until its switch is set, and the v4.0.2.1 release notes and root README describe every handover change in the existing changelog style."
    blockers: []
    key_files:
      - ".skilled/hooks/shared/hook-flags.cjs"
      - ".skilled/hooks/shared/hook-flags.sh"
      - ".skilled/hooks/shared/hook-flags.test.cjs"
      - ".skilled/changelog/skilled/v4.0.2.1.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:d274b08c357a4d72de05f1b42bac678fb5351e8456aa03dfe2748a110a5d5b71"
      session_id: "scaffold-040-claude-default-on-release-notes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b726ec67-1d85-4833-b219-c038e184d696"
      workspace: "/Users/michelkerkmeester/worktrees/public/390-claude-default-on-release-notes"
      savedAt: "2026-11-14T20:01:19Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-claude-default-on-release-notes |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project that installs Skilled and runs Claude Code now gets in-session handover without setting anything. Codex, Pi, OpenCode, Cursor and Devin still stay off until their owner turns them on.

### Claude Code session handover on by default and v4.0.2.1 release notes

The shared resolver gained one last rung for the default-off concern. When neither the runtime's own switch nor the global switch holds a value, a runtime listed in `DEFAULT_ON_RUNTIMES` is on, and that list holds `claude` alone. A set value still decides, so `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` or a global `0` turns Claude off, and the kill and master switches win over everything. The shell reader got the same rung.

The Session Handover section of the v4.0.2.1 release notes now covers the Claude default and the packet 038 and 039 changes it had skipped: the packet goal fallback and its bounds, live work lines in the note, the name, mode and flag carry, the dialog guard and the Stop notices, the wrapper change notice and the OpenCode sub-agent wait. The root README's In-Session Handover section says what a Claude user gets with and without the wrapper and what a hop carries.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/shared/hook-flags.cjs` | Modified | `DEFAULT_ON_RUNTIMES` and its rung in `hookFlagDecision` |
| `.skilled/hooks/shared/hook-flags.sh` | Modified | The same rung in `hook_enabled` |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modified | A Claude default test and four parity rows |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | The nudge fires with no switch and stops with the Claude switch at `0` |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Off-by-default refusals move to Codex, and a Claude prepare arms with no switch |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modified | The handover section, glance, checks and upgrade rows |
| `README.md` | Modified | In-Session Handover and four default statements |
| Hook, command and spec-kit docs listed in `spec.md` | Modified | The default statements |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baselines ran first: relaunch and plugin 1,555, resolver 28 and Pi 62. The resolver tests were written next and failed, 2 of 29. The `.cjs` and `.sh` rung made them pass, and the relaunch suite then showed four tests that encoded the old Claude-off default. Those were rewritten to prove the off default on Codex, and two new Claude tests were checked against the old resolver, where both failed. The docs, README and release notes followed, and the whole gate ran again from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A set global value decides for Claude too | An operator who writes `SYSTEM_SESSION_RELAUNCH_ENABLED=0` means off, and a Claude exception would surprise them |
| A blank value counts as unset | The runtime switch already treats blank that way, so both switches read alike |
| A caller that names no runtime stays off | Only the Claude hooks pass `runtime: 'claude'`, so nothing else turns on by accident |
| Merge same-effect items in the release notes | The entry sat at the template's 280-line ceiling, and the template allows merging items with the same effect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Measured Behavior command | `claude` enabled with reason `default`, the other five disabled, shell `claude on` and `codex off` |
| `node --test` relaunch and plugin suites | 1,556 passed, 0 failed |
| `node --test .skilled/hooks/shared/hook-flags.test.cjs` | 29 passed, 0 failed |
| Goal hook suites | 200 passed, 0 failed |
| Pi vitest suite | 62 passed |
| `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` | PASS, PASS |
| `check_changelog_shape.py`, `hvr_scan.py`, `validate_document.py` on the entry | PASS, 0 hard blockers, VALID |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The release tag and the GitHub release still hold the old text.** Tag `v4.0.2.1` points at an earlier commit and its release body predates this edit. Bringing them in step is outward-facing and waits for the operator.
2. **The repository's dotenv template keeps one stale comment.** It still says the loop ships off. The operator's rule forbids reading or writing a dotenv file, so it is reported rather than edited.
<!-- /ANCHOR:limitations -->

---
