---
title: "Checklist: sk-prompt hub root and shared boundary (017 phase 004.001)"
description: "Blocking SOL verifier contract for phase 001 of the sk-prompt kebab-case program: root/shared inventory, exact hub contracts, and reference closure."
trigger_phrases:
  - "sk-prompt hub root and shared checklist"
  - "sk-prompt phase 001 verifier"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for the root/shared boundary"
    next_safe_action: "Run the checklist against the candidate phase commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/mode-registry.json"
      - ".opencode/skills/sk-prompt/hub-router.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current root inventory has no shared/ directory."
---
# Checklist: sk-prompt hub root and shared boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. The verifier pins the candidate SHA and BASE SHA,
records the root/shared census and map hash, captures commands and exit codes, and fails on an unknown disposition,
zero-file scan, or unexpected mutation outside the assigned root/shared boundary.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The `003-sk-doc` handoff is complete and the candidate worktree is clean and pinned to BASE
- [ ] CHK-002 [P2] The candidate SHA, BASE SHA, and root/shared map hash are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to root/shared ownership; delegated playbook and benchmark paths are untouched
- [ ] CHK-004 [P0] Protected hub filenames and routing contracts remain exact, including `SKILL.md` and `mode-registry.json`
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The root/shared census classifies every observed candidate once and records the absent `shared/` directory when absent
- [ ] CHK-006 [P0] Every owned source path resolves to its mapped target and active root/shared references contain no stale source path
- [ ] CHK-007 [P1] `hub-router.json` and `mode-registry.json` parse and still select the existing `prompt-improve` and `prompt-models` workflow modes
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The rename map is bijective within this boundary and records exemptions, delegated paths, generated output, and tool-mandated names
- [ ] CHK-009 [P1] Symlink targets, file modes, and executable bits are unchanged where the root/shared census finds them
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No code identifier, JSON key, frontmatter field, executable policy, or router allowlist changed as a side effect
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase map, root inventory, and protected-name decision are reflected in the packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The phase lands in path-scoped commits with no scratch directory or implementation-summary scaffold artifact
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, the root/shared map is complete, the protected hub contracts resolve, and
the evidence proves that phases 004 and 005 retain ownership of their delegated trees.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --`
shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
