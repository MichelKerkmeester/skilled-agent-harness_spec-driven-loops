---
title: "Tasks: sk-doc manual-testing-playbook snippet template migration"
description: "Task list for the routing-gold snippet migration."
trigger_phrases:
  - "playbook migration tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/027-playbook-snippet-template-migration"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author tasks"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-playbook-snippet-template-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: sk-doc manual-testing-playbook snippet template migration

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = open. `[x]` = done and carries concrete evidence.
- Task IDs: T001-T009.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Verify frontmatter field consumers across the topology validator, package validator, and skill-benchmark loader [evidence: `expected_workflow_mode`/`expected_leaf_resources` 8 consumers each; `category` derived from directory in `load-playbook-scenarios.cjs`; `created`/`expected_token_range_*` 0 consumers]
- [x] T002 [P] Derive the stage mapping and cluster the four shapes [evidence: loader defaults absent `stage` to `routing`; shapes 18 full-old / 8 minimal / 5 minimal-purpose / 1 variant]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Build the reviewable migration script with a blacklist frontmatter transform and per-shape body emitter [evidence: `scratchpad/migrate.mjs`, dry-run clean on one file per shape]
- [x] T004 [P] Apply the migration to all 32 files [evidence: `18 full-old + 5 minimal-purpose + 8 minimal + 1 variant` applied]
- [x] T005 [P] Document the routing-gold fields in the snippet template (REQ-006) [evidence: `expected_workflow_mode`/`expected_leaf_resources` added to the scaffold; version 1.8.0.12; commit `3862efb0ac`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [P] Re-run the topology gate (REQ-001) [evidence: `verdict=PASS valid=32 blocked=0`]
- [x] T007 [P] Re-run the package validator and conformance scan (REQ-002, REQ-003, REQ-004) [evidence: `violations=0`; description/stage/SOURCE FILES/SOURCE METADATA 32/32; dropped keys 0/32; 9-col 0/32]
- [x] T008 [P] Diff-review the 13 minimal files for invented content (REQ-005) [evidence: minimal files carry a prompt-only `### Note`, no commands or evidence]
- [x] T009 [P] Verify root-index bijection (REQ-007) [evidence: 32/32 files referenced by the root index, 0 orphans, root index unchanged]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 32 files carry the scaffold, both gates stay green, no content was invented, the template documents the routing-gold fields, and packet docs validate.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Migration script: `scratchpad/migrate.mjs` (session scratchpad)
- Topology gate: `sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs`
- Package gate: `sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
<!-- /ANCHOR:cross-refs -->
