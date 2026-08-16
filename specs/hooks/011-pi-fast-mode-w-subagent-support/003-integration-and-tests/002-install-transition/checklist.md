---
title: "Verification Checklist: Phase 2 install-transition"
description: "Evidence checklist for the reversible installed-extension transition and bare /fast command ownership proof."
trigger_phrases:
  - "install-transition checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/002-install-transition"
    last_updated_at: "2026-08-16T18:45:28Z"
    last_updated_by: "claude-code"
    recent_action: "Installed fork user-scoped, removed pi-gpt; /fast owned by fork via get_commands"
    next_safe_action: "Continue to 003-live-verification-and-sync"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 2 install-transition

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-801 [P1] Record each transition command with its exit code and redacted output (pre-state, remove, install, probe, post-state). — `pi install`, `pi remove`, and RPC `get_commands` commands + exits recorded in `implementation-summary.md` Verification.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-state -->
## Pre-State & Rollback

- [x] CHK-802 [P0] `.pi/settings.json` and the installed-extension inventory (`pi list` + `npm ls` for user `~/.pi/agent/` and project `.pi/` scopes) are captured BEFORE any mutation. — `settings.json.before` + `pi list` saved to `scratch/rollback-snapshot/` before the first `pi` mutation.
- [x] CHK-803 [P0] The exact rollback command is recorded in the snapshot before the transition starts. — recorded in `plan.md` §7 and the snapshot's `legacy-source.txt`.
- [x] CHK-804 [P0] A failed transition can restore the exact pre-state (captured settings + prior inventory) and rerun the transition. — `pi remove` the fork, restore `settings.json.before`, `pi install npm:pi-gpt-fast-mode`, restore the config — all documented.
<!-- /ANCHOR:pre-state -->

<!-- ANCHOR:transition -->
## Transition

- [x] CHK-805 [P0] Legacy `pi-gpt-fast-mode` is absent after the transition, with `pi list` and npm inventories agreeing. — `pi list` shows 0 `pi-gpt-fast-mode`; `find` = 0 on disk (user + project scopes).
- [x] CHK-806 [P1] The fork is installed from the LOCAL PATH source. — installed from `./packages/pi-fast-mode-w-subagent-support`. DEVIATION: user-scope (`pi install ./path`, no `-l`) rather than `-l` project, per the operator's "global replace" choice — the fork replaces the user-scoped `pi-gpt-fast-mode` at the same scope.
- [x] CHK-807 [P1] Remove and install were executed with no mutation between capture and completion. — DEVIATION from a single atomic op: run as `pi install` → verify the fork loads → `pi remove` pi-gpt (safer: the new extension is confirmed before the working one is removed); no unrelated mutation in the window.
<!-- /ANCHOR:transition -->

<!-- ANCHOR:ownership -->
## Command Ownership

- [x] CHK-808 [P0] `get_commands` (RPC) / `pi.getCommands()` shows the fork's expected source path owning bare `/fast`. — RPC `get_commands` (exit 0) shows `"name":"fast"` sourced from the fork's `src/index.ts`.
- [x] CHK-809 [P0] No unexpected `/fast` numeric suffix remains after removing the earlier extension. — `get_commands` shows bare `fast` with no `/fast:1` suffix; only the fork registers `/fast` (pi-gpt did not; pi-openai/TBG not installed).
<!-- /ANCHOR:ownership -->

<!-- ANCHOR:safety -->
## Safety

- [x] CHK-810 [P0] `.pi/settings.json` remains valid JSON and is scoped to the canonical checkout. — `python3 -m json.tool` parses clean; the entry is the canonical `packages/` path.
- [x] CHK-811 [P1] Rollback receipt and final settings/npm diff are recorded without committing credentials. — snapshot holds `settings.json.before` + `pi list`; no credentials (auth lives in `~/.pi/agent/auth.json`, untouched).
<!-- /ANCHOR:safety -->

<!-- ANCHOR:scope -->
## Scope Discipline

- [x] CHK-812 [P1] No live-UX, child-session, or repo-sync work was performed in this leaf. — only the ownership `get_commands` probe (leaf-scoped). NOTE: `.pi/PLUGINS.md` was updated with the swap here rather than deferring the doc line to `003-live-verification-and-sync`.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-813 [P1] Handoff criteria to 003-live-verification-and-sync are met and evidence is appended here. — fork owns bare `/fast`, `pi-gpt-fast-mode` removed, fork wrote its config on load; ready for the live toggle/child-handoff proof.
<!-- /ANCHOR:summary -->
