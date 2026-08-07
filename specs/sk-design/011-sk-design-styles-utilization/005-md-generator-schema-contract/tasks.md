---
title: "Tasks: design-md-generator v3 schema contract"
description: "Task queue for building the versioned v3 schema authority for design-md-generator: manifest, consumer migration, hard-vs-advisory validation split, de-literalized corpus baseline, and drift/counterfactual tests. Planned scaffold; implementation not started, all tasks pending."
trigger_phrases:
  - "md generator schema tasks"
  - "v3 schema contract tasks"
  - "schema drift sentinel tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the v3 schema-contract L3 scaffold docs"
    next_safe_action: "Implement the v3 schema manifest as the single section authority"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-schema-011-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: design-md-generator v3 schema contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author the versioned v3 schema manifest module (new backend `schema-v3.*`)
- [x] T002 Encode section requiredness, conditional capabilities, and extension slots in the manifest (`schema-v3.*`)
- [x] T003 Encode Quick Start groups, semantic roles, formatter emission, and prompt instructions in the manifest (`schema-v3.*`)
- [x] T004 Define the closed HARD category set (target/schema/provenance) and advisory strata (shape/vocabulary/density/rarity) (`schema-v3.*`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Migrate `formatters-v3.ts::emitQuickStart` to capability-driven emission from the manifest (`formatters-v3.ts`)
- [x] T006 Migrate the write-prompt instructions to read from the manifest (`build-write-prompt.ts`)
- [x] T007 [P] Implement the semantic typography-role normalizer: stable core + namespaced extensions preserving source labels (new normalizer) [evidence: `npm test` 149/149; `tsc --noEmit` 0 errors]
- [x] T008 Split `validate.ts::validateDesignMd` into hard failures vs stratified advisory warnings (`validate.ts`)
- [x] T009 Keep target/schema/provenance HARD in `checkSectionCompleteness`; move corpus shape/vocabulary/density/rarity to warnings (`validate.ts`)
- [x] T010 Surface stratified advisory warnings distinctly from hard failures (`report-gen.ts`)
- [x] T011 Build the compact corpus baseline from the 1,290 bundles via the phase-004 retrieval substrate (new baseline artifact) [evidence: `npm test` 149/149; `tsc --noEmit` 0 errors]
- [x] T012 Build the de-literalized fixture generator that strips source-specific literals and assets (new generator) [evidence: `npm test` 149/149; `tsc --noEmit` 0 errors]
- [x] T013 [P] Wire the corpus baseline into the advisory strata only, never target values (`validate.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Assert generated fixtures carry no source literals/assets (leak assertion) (`*.test.ts`)
- [x] T015 Implement the schema-drift sentinel that fails when a consumer diverges from the manifest (`*.test.ts`)
- [x] T016 Add counterfactual schema/emitter tests: mutate the schema, assert formatter emission follows (`*.test.ts`)
- [x] T017 [P] Add counterfactual validation tests: mutate the schema, assert validation follows (`*.test.ts`)
- [x] T018 Add advisory-never-rejects test: corpus-divergent target-valid doc passes with warnings (`*.test.ts`)
- [x] T019 Update spec.md with implementation notes and final Files-to-Change (`spec.md`)
- [x] T020 Finalize decision-record.md ADR statuses (`decision-record.md`)
- [x] T021 Complete implementation-summary.md with real emitted evidence (`implementation-summary.md`)
- [x] T022 Mark all checklist.md items with evidence (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] One versioned v3 manifest is the sole authority; formatter/prompt/validator read from it
- [x] Hard-vs-advisory validation split live and surfaced by `report-gen.ts`
- [x] Corpus baseline + de-literalized fixtures generated, carrying no source literals
- [x] Schema-drift sentinel + counterfactual Vitest tests passing
- [x] All ADRs have status: Accepted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
