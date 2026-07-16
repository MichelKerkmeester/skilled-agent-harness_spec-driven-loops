---
title: "Checklist: prompt-models asset and reference names (032 phase 004.003)"
description: "Blocking SOL verifier contract for phase 003 of the sk-prompt kebab-case program: eight asset/reference renames, active path closure, JSON contract preservation, and benchmark-output protection."
trigger_phrases:
  - "prompt-models asset and reference checklist"
  - "sk-prompt phase 003 verifier"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for prompt-models assets and references"
    next_safe_action: "Run the checklist against the candidate phase commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/README.md"
      - ".opencode/skills/sk-prompt/prompt-models/assets/"
      - ".opencode/skills/sk-prompt/prompt-models/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Benchmark output and changelog history are verified outside this phase."
---
# Checklist: prompt-models asset and reference names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. The verifier pins the candidate SHA and BASE SHA,
records the eight-entry path map and JSON contract snapshot, captures commands and exit codes, and fails on stale active
references, changed data keys, unknown dispositions, or mutation outside prompt-models asset/reference ownership.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 002 handoff is complete and the candidate worktree is clean and pinned to BASE
- [ ] CHK-002 [P2] Candidate SHA, BASE SHA, map hash, and JSON key/model snapshot are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to prompt-models assets, references, and active path consumers
- [ ] CHK-004 [P0] JSON keys, model IDs, identifiers, frontmatter fields, `_index.md`, and tool-mandated names are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Four asset/data files and four reference files each have one existing kebab-case target
- [ ] CHK-006 [P0] Skill, README, model-profile, and reference links resolve with no stale active source path
- [ ] CHK-007 [P0] Renamed JSON files parse and their sorted key paths and model IDs match the BASE snapshot
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Benchmark output and changelog hits are dispositioned without being renamed by this phase
- [ ] CHK-009 [P1] The source-to-target map is bijective and covers every active packet-local consumer
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No secret, dispatch policy, permission list, or executable behavior changed beyond path-valued references
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase docs record the eight concrete path pairs and the data-key/exemption boundary
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Renames are path-scoped and dependency-closed; no scratch directory or implementation-summary scaffold artifact remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, the eight target paths and active references resolve, JSON contracts match
BASE, and the evidence proves that generated benchmark and frozen changelog paths remain outside this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --`
shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
