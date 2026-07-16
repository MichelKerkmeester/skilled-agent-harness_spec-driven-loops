---
title: "Feature Specification: sk-prompt manual-testing-playbook trees (032 phase 004.004)"
description: "The sk-prompt hub and prompt-improve packet contain manual-testing-playbook roots, category directories, scenario files, and index references with underscore-separated names. This phase renames both playbook trees to kebab-case, updates active links, and proves scenario IDs and coverage remain unchanged while frozen changelog history stays untouched."
trigger_phrases:
  - "sk-prompt manual testing playbook kebab-case"
  - "manual-testing-playbook scenario rename"
  - "sk-prompt phase 004 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the manual-testing-playbook L2 packet from both live playbook trees"
    next_safe_action: "Execute the playbook path map after the prompt-models handoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/clear_scoring/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/depth_clear_loop/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/escalation_tiers/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/format_modes/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/framework_selection/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/mode_detection/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/smart_routing/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The hub playbook contains four SP routing scenarios under hub_routing/."
      - "The prompt-improve playbook contains seven category directories and 27 scenario documents."
      - "Scenario IDs and content semantics are preserved; only filesystem path segments and path-valued references change."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-prompt manual-testing-playbook trees

> Phase adjacency under the sk-prompt component parent (grouping order, not a runtime dependency): predecessor `003-prompt-models`; successor `005-benchmark`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-prompt |
| **Origin** | Phase 004 of the sk-prompt component subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The hub playbook uses `manual_testing_playbook/`, `hub_routing/`, and scenario names such as `named_model_prompt_models.md`.
The prompt-improve playbook repeats the root and adds categories such as `clear_scoring/`, `depth_clear_loop/`, and
`smart_routing/`, with underscore-separated scenario files throughout. These paths are linked from skill docs and from
the playbook's own indexes, so a safe rename must preserve scenario coverage and update every active path consumer.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the hub tree `.opencode/skills/sk-prompt/manual_testing_playbook/` to `manual-testing-playbook/`, including `hub_routing/`, its root index, and four SP scenario files.
- Rename the prompt-improve tree `prompt-improve/manual_testing_playbook/` to `manual-testing-playbook/`, including `clear_scoring`, `depth_clear_loop`, `escalation_tiers`, `format_modes`, `framework_selection`, `mode_detection`, and `smart_routing` plus all scenario filenames.
- Update active links in both skill files, both READMEs, both playbook indexes, scenario cross-reference tables, and other non-frozen consumers.
- Compare scenario IDs and category coverage before and after the path changes.

### Out of Scope
- Prompt-improve assets/references owned by phase 002 and prompt-models assets/references owned by phase 003.
- Benchmark and benchmark-output paths owned by phase 005.
- Changelog/frozen-history prose, generated output, code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python names, and tool-mandated filenames.
- Changing scenario behavior, titles, IDs, categories, or acceptance semantics.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt/manual_testing_playbook/` | Rename | `manual-testing-playbook/`; preserve hub index and SP-001–SP-004 scenarios |
| `sk-prompt/manual_testing_playbook/hub_routing/` | Rename | `hub-routing/`; rename `ambiguous_default`, `generic_prompt_improve`, `named_model_prompt_models`, and `second_model_glm` |
| `sk-prompt/prompt-improve/manual_testing_playbook/` | Rename | `manual-testing-playbook/`; preserve the 27-scenario packet contract |
| `prompt-improve/manual_testing_playbook/{clear_scoring,depth_clear_loop,escalation_tiers,format_modes,framework_selection,mode_detection,smart_routing}/` | Rename | Kebab-case category directories and scenario filenames |
| `sk-prompt/SKILL.md`, both READMEs, and active playbook documents | Reference update | Repoint path values and Markdown links; keep IDs and prose semantics |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Both playbook trees have complete kebab-case path maps | The map covers both roots, hub `hub_routing/`, seven prompt-improve categories, and every underscore-separated scenario filename |
| REQ-002 [P0] | Active playbook references resolve after the rename | Skill docs, READMEs, indexes, scenario cross-references, and path-valued tables contain no stale active source path |
| REQ-003 [P0] | Scenario coverage and IDs are preserved | Hub SP-001–SP-004 and the prompt-improve 27-scenario set remain discoverable with unchanged IDs and category membership |
| REQ-004 [P1] | The program boundary is respected | Changelog/frozen hits are dispositioned, generated output is excluded, and no identifier, data key, frontmatter field, Python/package, or tool name changes |
| REQ-005 [P1] | The two trees remain independently navigable | Each playbook root index resolves its category and scenario links from its new location, and a git revert restores the old graph |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both playbook trees and all in-scope category/scenario names use kebab-case with zero active broken links.
- **SC-002**: Manual-test scenario IDs, counts, category membership, and acceptance semantics match the pre-phase inventory.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is losing coverage when category directories and scenario links move together. The phase depends on the
prompt-models handoff and the program's frozen-history exemption; a before/after scenario manifest, active-link sweep,
and separate disposition of changelog references prevent silent scenario loss or historical rewrites.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the execution report must record the exact pre/post scenario counts rather than relying on directory counts alone.
<!-- /ANCHOR:questions -->
