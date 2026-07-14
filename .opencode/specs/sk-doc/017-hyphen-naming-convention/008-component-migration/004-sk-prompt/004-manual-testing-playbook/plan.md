---
title: "Implementation Plan: sk-prompt manual-testing-playbook trees (017 phase 004.004)"
description: "Implementation plan for phase 004 of the sk-prompt kebab-case program: rename both manual-testing-playbook trees, update active links, and prove scenario-ID and category coverage parity."
trigger_phrases:
  - "sk-prompt manual testing playbook implementation plan"
  - "sk-prompt phase 004 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the two-tree playbook rename and coverage plan"
    next_safe_action: "Capture the hub and prompt-improve scenario manifests at BASE"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/manual_testing_playbook/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/"
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The hub has four routing scenarios; prompt-improve has seven categories and 27 scenarios."
      - "Changelog references are frozen and must be dispositioned, not rewritten."
---
# Implementation Plan: sk-prompt manual-testing-playbook trees

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Hub-level and prompt-improve `manual_testing_playbook/` trees |
| **Change class** | Directory/file rename, active Markdown-link closure, scenario coverage verification |
| **Execution** | Isolated worktree pinned to BASE; path map plus scenario manifest |

### Overview
This phase moves two related but independent playbook trees. It maps the roots, hub category, seven prompt-improve
categories, and all scenario files first; then it updates active links and compares scenario IDs and category membership
with the BASE manifest before accepting the result.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 handoff and pinned BASE are available.
- [ ] Hub SP-001–SP-004 and prompt-improve scenario manifests are captured.
- [ ] Frozen changelog and generated-output exclusions are recorded.

### Definition of Done
- [ ] Both playbook roots, categories, and scenario files have complete target paths.
- [ ] Active links resolve and no active source path remains.
- [ ] Scenario IDs, counts, category membership, and semantics match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a two-root path map plus a content-independent scenario manifest. Rename path segments, not scenario identifiers or prose tokens.

### Key Components
- **Hub playbook**: `manual_testing_playbook/` → `manual-testing-playbook/`, `hub_routing/` → `hub-routing/`, and four scenario files: `ambiguous_default`, `generic_prompt_improve`, `named_model_prompt_models`, `second_model_glm`.
- **Prompt-improve categories**: `clear_scoring`, `depth_clear_loop`, `escalation_tiers`, `format_modes`, `framework_selection`, `mode_detection`, and `smart_routing` become hyphenated directories.
- **Active consumers**: both `SKILL.md` files, both READMEs, playbook root indexes, category indexes, and scenario cross-reference tables.

### Data Flow
BASE path/scenario manifests → two-tree rename map → filesystem move → active-link rewrite → scenario-ID/category parity → stale-source and scope audit.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 003 handoff and capture both playbook trees at BASE.
- [ ] Record exact category/file source-target pairs and scenario IDs/counts.
- [ ] Mark frozen changelog, generated output, and delegated benchmark exclusions.

### Phase 2: Implementation
- [ ] Rename the hub playbook root, `hub_routing/`, index, and four scenario files.
- [ ] Rename the prompt-improve playbook root, seven category directories, index, and all scenario files.
- [ ] Update active skill, README, index, and scenario cross-reference paths.

### Phase 3: Verification
- [ ] Resolve all active links from both playbook roots and their consumers.
- [ ] Compare scenario IDs, counts, category membership, and required source references with BASE.
- [ ] Review frozen changelog hits and confirm the diff contains no benchmark or content-semantic change.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare full two-tree path inventory with the source-to-target map |
| REQ-002 | Resolve Markdown links/path-valued references and search active docs for stale source paths |
| REQ-003 | Compare scenario IDs, counts, category membership, and root-index coverage before and after |
| REQ-004 | Inspect the disposition ledger for changelog/generated/exempt names and review unchanged identifiers/data keys |
| REQ-005 | Open both new root indexes and verify every category/scenario path; confirm git-revert closure |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase inherits the 017 path naming and frozen-history rules and depends on `003-prompt-models` for sibling sequencing.
Root skill and README references are part of this phase because they consume playbook paths; benchmark paths remain with
phase 005 and release evidence with phase 006.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is a git revert of the two-tree rename/reference commit(s). If any scenario disappears, link fails, or ID/category
manifest changes, stop before commit and restore the pre-phase tree; no scenario content or generated result is rewritten.
<!-- /ANCHOR:rollback -->
