---
title: "Checklist: root and OpenCode infrastructure strays (020 phase 007 child 001)"
description: "Blocking SOL verifier contract for the root and OpenCode infrastructure closure: census classification, semantic targets, reference resolution, exemption protection, and downstream handoff."
trigger_phrases:
  - "root infrastructure closure checklist"
  - "OpenCode infrastructure naming checklist"
  - "phase 007 child 001 verifier"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the root-infrastructure SOL verifier contract"
    next_safe_action: "Run the checklist against the candidate closure commit"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - ".opencode/install_guides/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Checklist items remain pending until the migration executor supplies candidate-SHA evidence"
---
# Checklist: Root and OpenCode Infrastructure Strays

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 001. The verifier runs it against a candidate closure commit, pins the candidate SHA, BASE SHA, and phase 006 map hash, records every command with its exit code and scan count, and fails on a zero-file scan, an unclassified candidate, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate worktree, and phase 006 map hash are pinned in the verifier report
- [ ] CHK-002 [P0] The root and `.opencode` infrastructure census covers command assets, install-guide scripts, and root-level candidates
- [ ] CHK-003 [P1] Phase 005 rename/reference tooling is available and the scoped execution tree is clean before the first closure batch
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Every observed candidate has exactly one classification and every rename has one explicit semantic target
- [ ] CHK-005 [P1] The changed path set contains no code identifier, JSON/YAML/TOML key, frontmatter field, or out-of-scope component file
- [ ] CHK-006 [P1] Cross-skill symlink and shared-script edges are recorded for sibling children rather than partially updated here
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Exact, case-folded, and NFC-normalized collision checks pass for every proposed target
- [ ] CHK-008 [P0] Command assets, installer paths, shell sources, registries, and path-valued docs resolve to the target paths with zero stale references
- [ ] CHK-009 [P0] A synthetic in-scope root/infrastructure snake_case candidate is rejected while a hyphenated target is accepted
- [ ] CHK-010 [P0] `.utcp_config.json`, `.mcp.json`, Python files/package directories, generated/lockfile output, tool-mandated names, and frozen surfaces remain unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P1] The closure manifest records source, target or exemption, consumer set, evidence, and downstream dependency for every candidate
- [ ] CHK-012 [P1] The manifest is consumable by phase 008 component children through explicit closure dependencies
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P2] No command allowlist, installer behavior, sandbox setting, or exact-name contract changed outside the intended path closure
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P2] The candidate ledger, boundary ledger, and closure evidence are linked from the phase handoff
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The closure lands in dependency-closed, path-scoped commits and the verifier observes no partial cross-boundary update
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child passes only when every P0 item is green, the closure manifest has no unknown entries, all references resolve, all exemptions are preserved, and the candidate report proves the expected tracked-file state against BASE.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the downstream handoff is complete, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
