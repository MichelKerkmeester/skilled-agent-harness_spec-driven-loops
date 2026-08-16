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
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created install transition checklist"
    next_safe_action: "Capture pre-state and rollback before mutating settings"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 2 install-transition

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-801 [P1] Record each transition command with its exit code and redacted output (pre-state, remove, install, probe, post-state).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-state -->
## Pre-State & Rollback

- [ ] CHK-802 [P0] `.pi/settings.json` and the installed-extension inventory (`pi list` + `npm ls` for user `~/.pi/agent/` and project `.pi/` scopes) are captured BEFORE any mutation.
- [ ] CHK-803 [P0] The exact rollback command is recorded in the snapshot before the transition starts.
- [ ] CHK-804 [P0] A failed transition can restore the exact pre-state (captured settings + prior inventory) and rerun the transition.
<!-- /ANCHOR:pre-state -->

<!-- ANCHOR:transition -->
## Transition

- [ ] CHK-805 [P0] Legacy `pi-gpt-fast-mode` is absent after the transition, with `pi list` and npm inventories agreeing.
- [ ] CHK-806 [P1] The fork is installed from the LOCAL PATH source (`pi install -l <local-package-path>`), not a pinned git ref or published npm package.
- [ ] CHK-807 [P1] Remove and install were executed as ONE bounded operation with no mutation between capture and completion.
<!-- /ANCHOR:transition -->

<!-- ANCHOR:ownership -->
## Command Ownership

- [ ] CHK-808 [P0] `get_commands` (RPC) / `pi.getCommands()` shows the fork's expected source path owning bare `/fast`.
- [ ] CHK-809 [P0] No unexpected `/fast` numeric suffix (`/fast:1`, `/fast:2`) remains after removing the earlier extension; suffix renumbering is confirmed by a live probe.
<!-- /ANCHOR:ownership -->

<!-- ANCHOR:safety -->
## Safety

- [ ] CHK-810 [P0] `.pi/settings.json` remains valid JSON and is scoped to the canonical checkout.
- [ ] CHK-811 [P1] Rollback receipt and final settings/npm diff are recorded without committing credentials.
<!-- /ANCHOR:safety -->

<!-- ANCHOR:scope -->
## Scope Discipline

- [ ] CHK-812 [P1] No live-UX, child-session, or repo-sync work was performed in this leaf.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-813 [P1] Handoff criteria to 003-live-verification-and-sync are met and evidence is appended here.
<!-- /ANCHOR:summary -->
