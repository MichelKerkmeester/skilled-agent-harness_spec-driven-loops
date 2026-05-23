---
title: "Tasks: 116/003 - Review-Depth Schema and Prompt Contract"
description: "Level 3 task list for the reviewDepthSchemaVersion v2 state and prompt contract phase."
trigger_phrases:
  - "116 review depth schema tasks"
  - "searchLedger contract tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/003-complexity-schema-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed Level 3 phase 003 task list."
    next_safe_action: "Use completed tasks as handoff evidence for phase 004."
    blockers: []
    key_files:
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1160033200000000000000000000000000000000000000000000000000000000"
      session_id: "116-003-tasks"
      parent_session_id: "116-003-review-depth-schema"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 116/003 - Review-Depth Schema and Prompt Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T003 | Context and scope setup |
| M2 | T010-T013 | Schema docs |
| M3 | T020-T022 | Prompt-pack contract |
| M4 | T030-T033 | Level 3 docs and verification |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1]

- [x] T001 Read parent phase spec and Phase 001 research synthesis (`../spec.md`, `../001-research-synthesis/research/research.md`)
- [x] T002 Read Phase 002 fixture summary and validator fixture names (`../002-seeded-fixture-harness/`, `review-depth-validator.vitest.ts`)
- [x] T003 Read current v1 state and prompt contracts (`state_format.md`, `prompt_pack_iteration.md.tmpl`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Milestone M2]

- [x] T010 Add `## Review Depth Schema (v2)` section (`.opencode/skills/deep-review/references/state_format.md`) {deps: T001,T002,T003}
- [x] T011 Document top-level v2 objects: `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger[]` {deps: T010}
- [x] T012 Document ledger required fields, hypothesis/invariant rule, search actions, and disposition-specific linkage matrix {deps: T010}
- [x] T013 Document compatibility table, trivial-scope exemption, and Phase E reducer/report obligations {deps: T010}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Milestone M3]

- [x] T020 Add v2 search-depth output subsection after the existing JSONL schema block (`prompt_pack_iteration.md.tmpl`) {deps: T010}
- [x] T021 Require standard/complex scopes to emit `reviewDepthSchemaVersion: 2` and all v2 top-level objects {deps: T020}
- [x] T022 Preserve template variables and legacy record behavior in the prompt text {deps: T020}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Documentation and Verification [Milestone M4]

- [x] T030 Populate Level 3 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`
- [x] T031 Refresh `description.json` and `graph-metadata.json` with `generate-context.js` {deps: T030}
- [x] T032 Run prompt-pack Vitest and capture output tail {deps: T020,T021,T022}
- [x] T033 Run strict spec validation and capture output tail {deps: T030,T031}
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] v2 contract names match Phase B fixtures
- [x] Prompt-pack validation passes
- [x] Strict Level 3 spec validation passes
- [x] Commit handoff lists all Phase 003 files for `git add`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Phase Map**: `../spec.md`
- **Previous Phase**: `../002-seeded-fixture-harness/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
