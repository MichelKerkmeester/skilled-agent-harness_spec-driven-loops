---
title: "Tasks: create-benchmark resource names"
description: "Concrete execution and verification tasks for the create-benchmark resource naming phase."
trigger_phrases:
  - "create-benchmark resource tasks"
  - "benchmark fixture rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-benchmark tasks"
    next_safe_action: "Execute the benchmark resource inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-benchmark/assets/", ".opencode/skills/sk-doc/create-benchmark/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-benchmark resource names

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

- [ ] T001 Inventory benchmark asset/reference directories, files, and path consumers.
- [ ] T002 Freeze the complete taxonomy/file rename map.
- [ ] T003 Mark tool-mandated names, Python names, fields, keys, and IDs exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename behavior/model/skill taxonomy directories, listed fixture/profile/template files, and the two shared asset templates.
- [ ] T005 Rename guide domains, guide files, case studies, and worked example.
- [ ] T006 Update cross-domain links and path-producing references without changing payloads.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: every manifest target exists and no old in-scope path remains.
- [ ] T008 Verify: every benchmark resource domain and cross-link resolves.
- [ ] T009 Verify: shared asset content, payload fields, IDs, and Python exemptions are handled without semantic drift.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] All requirements in `spec.md` have evidence in the candidate report.
- [ ] The phase checklist is satisfied by the central verifier.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
