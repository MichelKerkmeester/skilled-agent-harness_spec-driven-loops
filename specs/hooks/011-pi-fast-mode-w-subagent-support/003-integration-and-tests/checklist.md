---
title: "Verification Checklist: Phase 3 integration-and-tests"
description: "Verification evidence for installing pi-fast-mode-w-subagent-support, removing pi-gpt-fast-mode, and proving /fast, indicator, and subagent handoff in a live session."
trigger_phrases:
  - "integration-and-tests checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created phase checklist"
    next_safe_action: "Execute phase plan; record evidence as tasks complete"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 3 integration-and-tests

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-001 [P1] Evidence recorded: live-session logs (toggle, indicator), spawned child env/output, `pi list`, npm ls, sync check output

<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-002 [P1] Pre-state snapshot taken: `pi list`, `npm ls` both scopes, settings packages (rollback target)
- [ ] CHK-003 [P1] Rollback plan documented: reinstall pi-gpt-fast-mode + revert PLUGINS/settings via git

<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] `npm run typecheck` exits 0 in the fork
- [ ] CHK-005 [P1] `git status --short .pi/` shows only intended files (npm dirs git-ignored)

<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P1] `npm test` exits 0 in the fork (upstream + handoff + integration)
- [ ] CHK-007 [P1] `/fast on`/`/fast off` round-trip verified in a live session; invalid arg shows usage
- [ ] CHK-008 [P1] Widget indicator visible with the custom `statusline.sh` footer active (screenshot/log)

<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] `pi list` shows the fork and not pi-gpt-fast-mode
- [ ] CHK-010 [P1] `npm ls` both scopes: fork present, pi-gpt-fast-mode absent
- [ ] CHK-011 [P1] settings packages list sorted after the transition
- [ ] CHK-012 [P1] PLUGINS.md: fork entry at alphabetical position, pi-gpt-fast-mode removed, versions verified against install

<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] No credentials or API keys introduced in settings, PLUGINS.md, or the fork's docs
- [ ] CHK-014 [P1] Spawned-child env check confirms only the boolean flag propagates (no auth material)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P1] PLUGINS.md: fork entry at alphabetical position, pi-gpt-fast-mode removed, versions verified against install
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] `git status --short .pi/` shows only intended files (npm dirs git-ignored)
- [ ] CHK-017 [P1] Settings packages list sorted after the transition
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-018 [P1] `sync-pi-configs.sh --check` exits 0
- [ ] CHK-019 [P1] All parent-map handoff criteria met; evidence (live logs, pi list, npm ls) recorded in this file's completion notes
<!-- /ANCHOR:summary -->
