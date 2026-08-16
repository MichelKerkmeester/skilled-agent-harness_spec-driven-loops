---
title: "Verification Checklist: Phase 1 fork-and-package"
description: "Verification evidence for the identity-only fork of pi-openai-fast-mode into pi-fast-mode-w-subagent-support."
trigger_phrases:
  - "fork-and-package checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package"
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
# Verification Checklist: Phase 1 fork-and-package

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-001 [P1] Evidence recorded: commands run, exit codes, and grep output captured in completion notes

<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-002 [P1] Fork layout decided (repo root vs `packages/` subdir) before copying source
- [ ] CHK-003 [P1] Rollback plan recorded: fork directory is deletable; upstream snapshot stays in `context/`

<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] `npm run typecheck` exits 0 in the fork
- [ ] CHK-005 [P1] No new dependencies beyond upstream devDependencies (package.json + lockfile diff reviewed)

<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P1] `npm test` (unmodified upstream vitest suite) exits 0

<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P1] `rg -n "pi-openai-fast-mode" src/` returns no hits
- [ ] CHK-008 [P1] `rg -n "pi-openai-fast-mode" tests/` returns no hits (or deliberate, flagged test updates)
- [ ] CHK-009 [P1] `rg -n "pi-openai-fast-mode" README.md` returns only the provenance note + repository URL
- [ ] CHK-010 [P1] `npm pack --dry-run` shows tarball name `pi-fast-mode-w-subagent-support-*` with expected files

<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P1] No credentials, keys, or auth material added anywhere in the fork
- [ ] CHK-012 [P1] LICENSE retains upstream MIT attribution (third-party notice preserved)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] README cites upstream repo and commit `9b28456` (v0.3.0)
- [ ] CHK-014 [P1] `pi` extension entry still points at `./src/index.ts` (package.json)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] Fork layout matches the phase decision; upstream snapshot remains in `context/pi-openai-fast-mode/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-016 [P1] Phase handoff criteria (parent spec map) met: typecheck 0, upstream tests 0, rename greps clean
- [ ] CHK-017 [P1] All evidence (commands, exits, greps) appended to this checklist's completion notes
<!-- /ANCHOR:summary -->
