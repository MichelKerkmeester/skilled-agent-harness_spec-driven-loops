---
title: "Checklist: cli-external-orchestration hub root and shared boundary (017 phase 005.001)"
description: "Blocking SOL verifier contract for the cli-external-orchestration root/shared boundary: complete ownership census, exact hub contracts, delegated-path protection, and reference closure."
trigger_phrases:
  - "cli-external hub root checklist"
  - "cli external shared boundary verifier"
  - "cli-external phase 001 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub boundary verifier"
    next_safe_action: "Run the root/shared checklist"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
      - ".opencode/skills/cli-external-orchestration/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current shared/ result is absent and must be recorded explicitly."
---
# Checklist: cli-external-orchestration hub root and shared boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. The verifier pins candidate and BASE SHAs, records the root/shared census and map hash, captures commands and exit codes, and fails on an unknown disposition, zero-file scan, or unexpected mutation outside the assigned boundary.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The pinned worktree is clean, the predecessor component handoff is available, and the root inventory is captured before mutation
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, and root/shared map hash are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The diff is limited to hub/shared ownership; all root/component playbook and benchmark paths are untouched
- [ ] CHK-004 [P0] `SKILL.md`, `hub-router.json`, `mode-registry.json`, metadata filenames, routing keys, and resource semantics remain exact
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The direct-root census classifies every observed child once and records `shared/` as absent when absent
- [ ] CHK-006 [P0] Every owned source path resolves to its mapped target and no stale owned source path remains in root references
- [ ] CHK-007 [P1] `hub-router.json` and `mode-registry.json` parse and retain the three CLI modes, tie-break order, and resource targets
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Any execution-time owned candidate has a bijective, collision-free source-target entry and a reversible path change
- [ ] CHK-009 [P1] The handoff names the child phase that owns every delegated playbook, benchmark, or component path
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable policy, routing allowlist, tool contract, JSON key, code identifier, or frontmatter field changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P1] The census, disposition map, protected-contract comparison, and phase 002 handoff are linked from the evidence
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] No implementation-summary scaffold file or scratch directory remains in the authored phase folder, and no out-of-scope file changed
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when every root/shared path has one disposition, protected routing contracts match BASE, delegated trees are untouched, and all owned references resolve. An unexpected shared subtree or ownership conflict blocks the phase before mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation outside the assigned root/shared boundary.
<!-- /ANCHOR:sign-off -->

