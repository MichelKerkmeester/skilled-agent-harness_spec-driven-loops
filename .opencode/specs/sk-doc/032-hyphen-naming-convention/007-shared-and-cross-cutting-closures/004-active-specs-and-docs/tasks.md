---
title: "Tasks: active specs and documents (032 phase 007 child 004)"
description: "Tasks for the active spec/document closure: classify authored versus generated/frozen paths, preserve phase-folder structure, update links and path values, strict-validate touched packets, and publish handoffs."
trigger_phrases:
  - "active spec document closure tasks"
  - "spec document naming tasks"
  - "phase 007 child 004 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored active spec/document closure tasks"
    next_safe_action: "Execute T001 after active-packet and map receipts are pinned"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/"
      - ".opencode/specs/system-code-graph/"
      - ".opencode/specs/system-deep-loop/"
      - ".opencode/specs/system-speckit/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Three-digit hyphenated phase folders are preserved as structurally compliant"
      - "Generated/frozen/review state requires an explicit non-rename disposition"
---
# Tasks: Active Specs and Documents

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE, phase 005 tooling, phase 006 map hash, and validator receipt
- [ ] T002 Census active `.opencode/specs/**` folders and authored documents with non-zero evidence
- [ ] T003 [P] Classify archives, changelogs, completed history, generated state, scratch, Python, tool-owned names, and compliant phase folders
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Assign semantic targets to in-scope active spec/document names
- [ ] T005 Update markdown links, relative references, continuity packet pointers, and path-valued frontmatter
- [ ] T006 Preserve frontmatter fields, JSON/YAML/TOML keys, code identifiers, generated state, and structural phase-folder forms
- [ ] T007 Hand symlink/shared-script edges to children 002/003 and record packet-level closure ownership
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every active candidate has one classification and no compliant phase folder is renamed
- [ ] T009 Verify: all changed links and path-valued continuity/frontmatter references resolve to targets
- [ ] T010 Verify: every touched packet passes `validate.sh --strict` with its required document set intact
- [ ] T011 Verify: generated, frozen, Python, tool-mandated, and completed-history surfaces retain their dispositions
- [ ] T012 Verify: packet receipts and cross-closure dependencies are complete for phase 008 consumers
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in `spec.md` met with evidence
- [ ] The SOL checklist is green for this child
- [ ] No active packet is handed off without a strict-validation receipt
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent closure map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
