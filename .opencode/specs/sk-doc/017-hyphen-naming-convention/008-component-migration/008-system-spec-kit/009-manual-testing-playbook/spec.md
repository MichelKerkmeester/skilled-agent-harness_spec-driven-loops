---
title: "Feature Specification: Manual testing playbook (017 subtree 008 phase 009)"
description: "The system-spec-kit manual_testing_playbook tree contains 440 underscore-bearing basenames: the root, 18 category directories, and 421 scenario or support files. This phase renames permitted playbook paths to kebab-case and closes every playbook link, index, runner, and path pointer while preserving scenario identity and the program exemption boundary."
trigger_phrases:
  - "system-spec-kit manual testing playbook"
  - "manual_testing_playbook to manual-testing-playbook"
  - "playbook scenario kebab-case"
  - "manual testing phase 009"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/009-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-playbook docs"
    next_safe_action: "Execute the manual-playbook path map after catalog evidence is available"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Manual testing playbook

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 008-feature-catalog; successor 010-config-checkpoints-vectors-constitutional-verify.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/009-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 009 of the 008 system-spec-kit component migration under the 017 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live playbook root is `manual_testing_playbook` and its inventory contains 440 underscore-bearing basenames: the root, 18 candidate category directories, and 421 files. Scenario names such as `causal_chain_tracing_memory_drift_why.md` and category paths such as `bug_fixes_and_data_integrity/` are addressed by indexes, links, and playbook runners, so the path tree and its consumers must move as one closure.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `manual_testing_playbook` to `manual-testing-playbook` and update active root consumers.
- Rename the 18 permitted underscore-bearing category directories, including `plugins_and_hooks`, and the 421 permitted scenario/support files using an explicit semantic map.
- Update playbook indexes, scenario links, runner globs, catalog-to-playbook pointers, README references, and path-valued metadata.
- Preserve scenario IDs, headings, test intent, frontmatter fields, code/data identifiers, Python targets, generated output, frozen history, test magic directories, and tool-mandated names.

### Out of Scope
- The feature-catalog tree, which phase 008 owns; this phase consumes its handoff only where a playbook path is referenced.
- Rewriting scenario prose, changing test procedures, or renaming identifiers that merely contain underscores.
- Python `.py` files, Python import-package directories, lockfiles, generated/checkpoint/vector artifacts, and migration execution during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The playbook candidate set is frozen before any move. | The ledger accounts for 440 candidates: root, 18 directories, and 421 files, with no unknown bucket. |
| REQ-002 | Permitted playbook paths use kebab-case targets. | Every candidate has a collision-free semantic target; compliant names and exemptions retain their disposition. |
| REQ-003 | Playbook consumers resolve the new paths. | Indexes, links, runners, catalog handoffs, READMEs, and path-valued metadata resolve from `manual-testing-playbook`. |
| REQ-004 | Scenario contracts remain stable. | Scenario IDs, headings, steps, expected results, and non-path identifiers are unchanged. |
| REQ-005 | Playbook coverage is preserved. | The post-map scenario/category set has one-to-one parity with the baseline. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 440 permitted playbook candidates have a target or explicit exemption disposition.
- **SC-002**: Active playbook links, indexes, runners, and catalog handoffs resolve with no stale root or category paths.
- **SC-003**: Scenario identity and procedure content remain unchanged apart from path-valued references.
- **SC-004**: Scenario and category parity matches the pre-move inventory.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The playbook is both human-readable documentation and an executable/manual-test navigation surface. A missed category or link can hide coverage, while mechanical underscore replacement can produce ambiguous names or alter scenario identifiers. The phase depends on the phase 008 catalog handoff for cross-tree pointers but owns the playbook path closure.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. Execution must record the final 440-entry map and classify any test-magic, generated, or tool-mandated path before moving it.
<!-- /ANCHOR:questions -->

