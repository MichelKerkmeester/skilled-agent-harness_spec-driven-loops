---
title: "Tasks: deep-alignment filesystem names (032 phase 007/007)"
description: "Execution tasks for renaming deep-alignment resources and repairing path-valued adapter, catalog, playbook, state, and verification references while preserving embedded identifiers and keys."
trigger_phrases:
  - "deep-alignment tasks"
  - "alignment kebab-case naming tasks"
  - "alignment adapter path repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep alignment tasks"
    next_safe_action: "Execute the deep alignment rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-alignment filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the alignment map, BASE path/key manifest, authority/resource inventory, and read-only baseline.
- [ ] T002 [P] Inventory the 15 underscore-bearing directory families and 68 files across assets, catalogs, playbooks, references, and benchmarks.
- [ ] T003 Trace embedded path strings, dynamic adapter paths, identifier/key surfaces, and tool-name exclusions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify every alignment string as filesystem path, identifier, data key, generated output, or exemption.
- [ ] T005 Rename alignment asset, catalog/playbook, behavior-benchmark, and reference paths through the semantic map.
- [ ] T006 Update path-valued resource maps, adapter links, indexes, Markdown links, and tests.
- [ ] T007 Preserve authority/lane keys, embedded identifiers, JSON/YAML keys, frontmatter, read-only permissions, and tool names.
- [ ] T008 Record path/key comparison, authority coverage, and read-only evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Resolve every old/new alignment resource and adapter path for all four authorities.
- [ ] T010 Compare catalog/playbook coverage, state transitions, route/verdict outputs, and key inventories with BASE.
- [ ] T011 Run read-only, adapter, state, and alignment verification checks with non-zero discovery.
- [ ] T012 Confirm no sibling surface or protected identifier/key/tool contract changed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
<!-- /ANCHOR:cross-refs -->
