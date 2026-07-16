---
title: "Implementation Plan: command asset emitters (032 phase 003 child 004)"
description: "Inventory every `/create:*` asset emitter, update only its generated path and filename rules, and verify representative auto/confirm routes against the sibling generator and phase 002 consumer contracts."
trigger_phrases:
  - "create command asset emitter implementation plan"
  - "create auto confirm naming plan"
  - "hyphenated command asset outputs"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the implementation plan for command asset output naming"
    next_safe_action: "Build the command asset inventory and classify source paths, keys, and emitted values"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Command Asset Emitters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/create/assets/` auto, confirm, and presentation contracts |
| **Change class** | Emitter instructions and output-path validation |
| **Execution** | Temporary command targets on the pinned BASE worktree; no source-file rename |

### Overview
Treat each command asset as a producer contract. Inventory the source asset path, mapping keys, emitted path values, and completion text separately; update only the emitted values and assertions, then run representative command routes into disposable targets. The command layer must agree with children 001-003 and phase 002 without changing their ownership.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All current create auto/confirm/presentation assets are enumerated by command family.
- [ ] Every output path, filename pattern, name question, and completion path is classified as source path, schema key, or emitted filesystem value.
- [ ] Child 001-003 output contracts and phase 002's catalog/playbook consumer matrix are available.
- [ ] Temporary command targets and representative route inputs are defined.

### Definition of Done
- [ ] All command asset emitter values and messages agree with kebab-case output contracts.
- [ ] Representative auto/confirm routes produce only compliant temporary output names.
- [ ] Source asset filenames, mapping keys, and out-of-scope repository names are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Auto and confirm YAML own execution steps, target derivation, output assertions, and validation actions.
- Presentation text owns startup questions, displayed paths, and final status summaries; it must describe the same output contract.
- Skill/parent-skill assets follow child 001; catalog/playbook assets follow child 002 plus phase 002; all other command assets follow child 003.
- Source asset filenames and data keys remain stable, so command routing continues to find the same assets during the coexistence period.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate every create asset triple and record source paths, keys, output values, and expected names.
- [ ] Build a command-family matrix covering skill/parent, catalog/playbook, README, agent, command, changelog, flowchart, and benchmark routes.
- [ ] Prepare temporary target roots and phase 002 conflict fixtures.

### Phase 2: Implementation
- [ ] Update skill and parent-skill emitted path rules to match child 001.
- [ ] Update catalog/playbook roots, category/leaf patterns, and compatibility assertions to match child 002 and phase 002.
- [ ] Update remaining command-family output patterns, validation messages, displayed paths, and completion summaries to match child 003.
- [ ] Preserve source asset filenames, mapping keys, field names, and exact-name contracts.

### Phase 3: Verification
- [ ] Run representative auto and confirm routes for every command family into temporary roots.
- [ ] Inspect output trees, status paths, and validation diagnostics for non-exempt underscore names.
- [ ] Run catalog/playbook old-only/new-only/both/missing consumer checks and record all exit codes.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the asset inventory to the command directory and record every auto/confirm/presentation file plus its emitted path rules. |
| REQ-002 | Run skill and parent-skill route fixtures; assert hyphenated skill/packet/resource/package outputs and preserved tool/exempt names. |
| REQ-003 | Run catalog/playbook route fixtures; assert hyphenated roots/leaves and phase 002 typed classification, with both-root failure evidence. |
| REQ-004 | Run representative readme, agent, command, changelog, flowchart, and benchmark routes; compare output listings and displayed paths to child 003's manifest. |
| REQ-005 | Diff source asset filenames and mapping keys before/after; assert only emitted values/messages changed. |
| REQ-006 | Recursively scan every temporary command target and record zero non-exempt underscore path segments with nonzero route coverage. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Children 001-003 define the packet-level output contracts that this command layer projects. Phase 002 is a hard dependency for catalog/playbook route acceptance. Phases 008/013 own source asset and existing-tree renames, so this child must remain green while those source paths retain their current names.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the command asset content changes for this child and delete disposable route targets. Do not rename or restore source asset files, existing command outputs, or phase 002 consumer logic as part of rollback.
<!-- /ANCHOR:rollback -->
