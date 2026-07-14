---
title: "Checklist: command asset emitters (017 phase 003 child 004)"
description: "Blocking SOL verifier contract for `/create:*` auto, confirm, and presentation asset emitters and their kebab-case output paths."
trigger_phrases:
  - "create command asset emitter checklist"
  - "create auto confirm naming checklist"
  - "hyphenated command asset output checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL acceptance contract for create command asset emitters"
    next_safe_action: "Run representative auto and confirm routes into temporary targets"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Command Asset Emitters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 004. The verifier records the candidate SHA, BASE SHA,
asset inventory, route mode, command family, commands, exit codes, temporary target listings, displayed paths, and
phase 002 conflict diagnostics. It fails on omitted asset families, zero route coverage, source-file renames, or
unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The complete auto/confirm/presentation asset inventory is recorded, including skill/parent, catalog/playbook, readme, agent, command, changelog, flowchart, and benchmark families.
- [ ] CHK-007 [P2] The report records the pinned BASE SHA and rename-map hash, or explicitly records that no rename map is consumed by this emitter-only child.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are limited to emitted path/filename values, naming diagnostics, displayed paths, and focused asset tests; no source asset file is renamed.
- [ ] CHK-009 [P2] YAML/JSON keys, workflow state fields, code identifiers, frontmatter fields, Python names, and exact tool-mandated filenames remain unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] The asset inventory covers every listed command family and all auto/confirm/presentation variants, with each emitted path rule tied to a concrete evidence row.
- [ ] CHK-002 [P0] Skill and parent-skill routes emit hyphenated skill, packet, resource, and package paths while preserving `SKILL.md`, `README.md`, and declared exemptions.
- [ ] CHK-003 [P0] Catalog/playbook routes emit `feature-catalog` and `manual-testing-playbook` output roots and hyphenated leaves; phase 002 new-only output is typed correctly and both-root fixtures fail closed.
- [ ] CHK-004 [P0] Readme, agent, command, changelog, flowchart, and benchmark routes emit the child 003 path contract, including exact version/tool names and family-specific output files.
- [ ] CHK-005 [P0] Auto and confirm route outputs have nonzero temporary-tree evidence and a recursive scan reports zero non-exempt underscore path segments.
- [ ] CHK-010 [P0] Source asset filenames and YAML/JSON mapping keys are byte-for-byte unchanged except for the explicitly approved emitted-value/message edits.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P1] Route reports include displayed paths and diagnostics as well as on-disk listings, proving presentation contracts do not advertise the old output names.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] Temporary output roots remain the only write targets, and no command asset gains authority to rename existing repository files or bypass phase 002 conflict checks.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P2] Command asset messages and packet references agree with children 001-003 and identify source asset renames as later work rather than claiming them complete.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-014 [P1] No `.opencode/commands/create/assets/create_*.yaml` or `.txt` source filename is renamed, and all temporary route outputs are removed after verification.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child is accepted only when every P0 item passes across the complete asset inventory, catalog/playbook conflicts are
fail-closed, and the diff proves that emitter logic changed without performing the later on-disk asset migration.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
