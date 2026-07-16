---
title: "Checklist: mcp-tooling changelog verification (032 phase 007)"
description: "Blocking SOL verifier contract for changelog scope, version, and append-only history verification."
trigger_phrases:
  - "mcp-tooling changelog checklist"
  - "mcp tooling version bump verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/007-changelog-verify"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 007 SOL verifier contract"
    next_safe_action: "Verify the four changelog version entries"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-figma/changelog/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-tooling Changelog Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and frozen rename-map hash are recorded before reading the latest entries
- [ ] CHK-002 [P2] The report records current latest versions and the expected next versions for all four changelog streams
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The phase-007 diff is read-only or append-only changelog work; no filesystem rename or component repair is included
- [ ] CHK-004 [P2] Prior changelog entries, keys, frontmatter fields, and non-changelog files are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The latest entries are root v1.0.1.0, Chrome v1.0.9.0, ClickUp v1.0.1.0, and Figma v1.0.1.0
- [ ] CHK-006 [P0] Each entry names the applicable mcp-tooling rename surfaces, reference closure, and preserved exemptions
- [ ] CHK-007 [P0] The entries record the benchmark zero-candidate result and are appended after the current history
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The version matrix covers all four changelog streams and compares each new entry to the actual latest prior version
- [ ] CHK-009 [P1] The migration entry does not rewrite old spec paths or old historical filenames in frozen entries
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable, credential, routing, or allowlist behavior changed during verification
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Changelog text is specific enough to identify the hub, three components, hub playbook, benchmark boundary, and exemption set
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Verification leaves git diff-index --quiet HEAD -- clean apart from an authorized append-only changelog entry
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, all four version entries match the phase map and evidence, prior history is unchanged, and the report records the candidate SHA, BASE SHA, map hash, commands, exit codes, and counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and proves phase 007 performed no rename.
<!-- /ANCHOR:sign-off -->
