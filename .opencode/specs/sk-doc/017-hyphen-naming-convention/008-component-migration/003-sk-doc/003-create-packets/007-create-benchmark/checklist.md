---
title: "Checklist: create-benchmark resource names"
description: "Blocking SOL verifier contract for the create-benchmark resource rename phase."
trigger_phrases:
  - "create-benchmark resource checklist"
  - "benchmark fixture rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-benchmark checklist"
    next_safe_action: "Run the create-benchmark verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-benchmark/assets/", ".opencode/skills/sk-doc/create-benchmark/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-benchmark resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-benchmark phase 007. The report pins BASE, candidate SHA, and rename-map hash, records full resource discovery and cross-link evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Full asset/reference taxonomy, including `assets/shared/`, and the actual exemption rows are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-benchmark paths and path consumers changed.
- [ ] CHK-004 [P0] Shared asset content, Python names, benchmark fields, keys, and IDs are unchanged except for path tokens.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All eight taxonomy directories and sixteen listed non-exempt files, including the two shared asset templates, have one kebab-case target.
- [ ] CHK-006 [P0] Cross-domain template, guide, index, and shared-reference links resolve; old live paths are absent.
- [ ] CHK-007 [P1] Resource discovery counts and shared-asset content match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, globs, generated/path-producing references, and cross-domain examples are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable mode, benchmark allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-benchmark-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, the benchmark taxonomy is reachable, shared-asset content is stable, and payload semantics are unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, cross-link evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
