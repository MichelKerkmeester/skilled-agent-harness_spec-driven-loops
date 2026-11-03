---
title: "Implementation Summary: Phase 1: cli-pi"
description: "Two Pi conversation scenarios cover compaction continuity and goal persistence across a restart."
trigger_phrases:
  - "cli pi conversation scenarios"
  - "pi session compaction continuity"
  - "pi goal hook persistence"
  - "pi live-run verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/004-conversation-adoption-build/001-cli-pi"
    last_updated_at: "2026-11-03T07:08:32Z"
    last_updated_by: "codex"
    recent_action: "Closed the Pi phase from live-run evidence"
    next_safe_action: "Review the completed phase packet"
    blockers: []
    key_files:
      - "specs/sk-doc/065-conversation-playbook-scenarios/004-conversation-adoption-build/001-cli-pi/spec.md"
      - "specs/sk-doc/065-conversation-playbook-scenarios/004-conversation-adoption-build/001-cli-pi/tasks.md"
      - "specs/sk-doc/065-conversation-playbook-scenarios/004-conversation-adoption-build/001-cli-pi/scratch/live-runs/closeout-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: null
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-cli-pi |
| **Completed** | 2026-11-03 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Added two Pi conversation scenarios for compaction continuity and goal persistence across a restart. Their checks verify later turns from recorded Pi state.

### Pi Conversation Scenarios

The session-lifecycle scenario seeds a marker, compacts the session and checks that the marker remains. The goal-hook scenario binds a goal, checks a later task and confirms that the goal survives a restart.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges-conversation.md` | Created | Checks marker recall after compaction |
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook-conversation.md` | Created | Checks goal persistence across turns and restart |
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Modified | Indexes both conversation scenarios |
| `spec.md` | Modified | Records the completed phase status |
| `tasks.md` | Modified | Records task and run evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran both scenarios in a detached worktree. It copied gitignored build outputs from the main checkout because the worktree held committed files only. It installed and rebuilt nothing. Both scenarios passed on round 2.

### Fix Rounds

| Scenario | Round | Result |
|----------|-------|--------|
| Session lifecycle | 1 | Compaction failed with `Nothing to compact (session too small)` at Pi's `keepRecentTokens=20000`. |
| Session lifecycle | 2 | Setup set `compaction.keepRecentTokens` to 200. All turns passed. |
| Goal hook | 1 | The goal anchor had scrolled out of `screen.txt` while goal state passed. |
| Goal hook | 2 | The check read `history.txt`. All turns passed. |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep both fixes in their scenario files | The failures came from the compaction fixture and the screen-history check. No skill code changed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Session-lifecycle live run on Pi | PASS: 3/3 turns, `repo.changed=false`, `cleanup.ok=true`; finished 2026-11-03T06:52:36.026Z |
| Goal-hook live run on Pi | PASS: 4/4 turns, `repo.changed=false`, `cleanup.ok=true`; finished 2026-11-03T06:50:42.796Z |
| Playbook package validator | PASS: 0 violations; 1 `HAND_TYPED_CENSUS` warning, derived count 37 scenarios across 11 categories |
| Strict phase validator | Initial run found invalid actor slug and missing summary status. After correction: `RESULT: PASSED`, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Related Pi finding.** The evidence records a dispatch-preflight tokenizer issue with the `2>&1` redirect recommended in `cli-codex/SKILL.md`. It belongs to another phase and remains unchanged here.
<!-- /ANCHOR:limitations -->

---


