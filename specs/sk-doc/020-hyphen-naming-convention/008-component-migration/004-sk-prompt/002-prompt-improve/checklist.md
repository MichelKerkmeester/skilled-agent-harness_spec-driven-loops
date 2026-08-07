---
title: "Checklist: prompt-improve asset and reference names (020 phase 004.002)"
description: "Blocking SOL verifier contract for phase 002 of the sk-prompt kebab-case program: six asset/reference renames, active path closure, and scope protection."
trigger_phrases:
  - "prompt-improve asset and reference checklist"
  - "sk-prompt phase 002 verifier"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for prompt-improve assets and references"
    next_safe_action: "Run the checklist against the candidate phase commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/README.md"
      - ".opencode/skills/sk-prompt/prompt-improve/assets/"
      - ".opencode/skills/sk-prompt/prompt-improve/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Playbook, benchmark, and changelog paths are verified outside this phase."
---
# Checklist: prompt-improve asset and reference names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. The verifier pins the candidate SHA and BASE SHA,
records the six-entry path map and map hash, captures commands and exit codes, and fails on a stale active reference,
unknown disposition, zero-file scan, or mutation outside prompt-improve asset/reference ownership.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 handoff is complete and the candidate worktree is clean and pinned to BASE
- [ ] CHK-002 [P2] Candidate SHA, BASE SHA, and six-entry map hash are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to prompt-improve assets, references, and their active path consumers
- [ ] CHK-004 [P0] Resource keys, framework identifiers, JSON/YAML keys, frontmatter fields, and tool-mandated names are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The three `format_guide_*` assets and three named reference files each have one existing kebab-case target
- [ ] CHK-006 [P0] `SKILL.md`, `README.md`, resource maps, and active Markdown links resolve every renamed path with no stale source path
- [ ] CHK-007 [P1] JSON metadata touched by the phase parses and preserves its routing/resource key set
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The map records delegated playbook/benchmark paths and frozen changelog hits without renaming them
- [ ] CHK-009 [P1] The source-to-target map is bijective and the reference sweep covers all active packet-local consumers
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable policy, prompt-routing allowlist, secret, or data value changed beyond path-valued references
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase docs state the six concrete path pairs and the delegated/frozen boundary
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Renames are path-scoped and dependency-closed; no scratch directory or implementation-summary scaffold artifact remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, all six target paths resolve through the active prompt-improve resource
surface, and the diff proves that adjacent playbook, benchmark, and changelog ownership was preserved.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --`
shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
