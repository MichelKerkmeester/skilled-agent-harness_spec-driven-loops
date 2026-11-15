---
title: "Goal: Live Verification and Sync"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/003-live-verification-and-sync"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Live Verification and Sync

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove in real Pi sessions that `/fast` toggling, the namespaced `setStatus` indicator and child-session handoff work on the installed fork, then leave `.pi/PLUGINS.md` sorted, the sync check passing and a rollback receipt in place.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A widget is optional and is never required evidence. `statusline.sh` is not changed. |
| D2 | A TUI screenshot is only a supplement and never the sole proof of RPC behavior. |
| D3 | The child handoff proof includes a `PI_FAST_MODE_W_SUBAGENT_SUPPORT=0` negative control. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Over RPC, `/fast on` yields config `enabled:true`, `/fast off` yields `enabled:false` and `pi --fast` startup yields `enabled:true`, each exiting 0
- [x] An RPC session on `openai-codex/gpt-5.6-luna` emits the namespaced `setStatus` request for `pi-fast-mode-w-subagent-support` and never calls `setFooter`
- [x] A child `pi` started with `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and no `--fast` resolves `enabled:true`, and with `=0` resolves `enabled:false`
- [x] `.pi/PLUGINS.md` is alpha-sorted, lists the fork and has no `#### pi-gpt-fast-mode` header
- [x] `sync-pi-configs.sh --check` exits 0 and prints `ok: settings.json` and `ok: statusline.sh`
- [x] A rollback receipt exists naming the fork removal, the legacy reinstall and the settings restore
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Install post-state and model | Done (2026-08-17) | `tasks.md` T901, T902 |
| Toggle and flag checks | Done | `tasks.md` T903 |
| `setStatus` indicator | Done | `tasks.md` T904; `implementation-summary.md` Namespaced `setStatus` indicator row |
| Child handoff with negative control | Done | `tasks.md` T905 |
| PLUGINS.md and sync | Done | `tasks.md` T906, T907 |
| Rollback receipt and commit | Done | `tasks.md` T908 (receipt reused from `002-install-transition`) |

### Deviations and findings

| Item | Note |
|------|------|
| No saved request JSON | `spec.md` REQ-002 names the RPC `setStatus` request JSON as the required evidence. T904 records that the request was emitted (exit 0), but this folder's `scratch/` holds no saved transcript |
| Docs revert | `spec.md` REQ-005 also asks the receipt to name a docs revert. The reused receipt (T908) restores settings; no separate `.pi/PLUGINS.md` revert is recorded |
| `.pi/` changes on another branch | The `.pi/settings.json` and `.pi/PLUGINS.md` changes were committed on `skilled/v4.0.0.0`, not the packet branch (`implementation-summary.md` Known Limitations 2) |
<!-- /ANCHOR:log -->
