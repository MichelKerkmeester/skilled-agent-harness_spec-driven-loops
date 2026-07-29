---
title: "Tasks: Derived Schema Authority Decision"
description: "Tasks for reconciling the TS Zod SkillDerivedV2 schema against the Python-compiler derived shape and recording the canonical-authority ADR."
trigger_phrases:
  - "derived schema authority tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/001-derived-authority-decision"
    last_updated_at: "2026-07-29T10:44:35Z"
    last_updated_by: "claude-code"
    recent_action: "All decision tasks complete; verified vs source"
    next_safe_action: "Phase 003 builds against the accepted shape"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-derived-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Derived Schema Authority Decision

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Inventory every production writer, reader, and validator of `graph-metadata.json.derived` across TS and Python (`skill-derived-v2.ts`, `lib/derived/sync.ts`, `lib/derived/sanitizer.ts`, `lib/lifecycle/schema-migration.ts`, `handlers/skill-graph/validate.ts`, `lib/scorer/projection.ts`, `scripts/skill_graph_compiler.py`)
- [x] T-02 Snapshot the live on-disk `derived` shape across all 11 `schema_version: 2` roots to confirm the Python-compiler vocabulary is uniform fleet-wide
- [x] T-03 Confirm the production-caller count for `syncDerivedMetadata` and `backfillDerivedV2` by repo-wide grep (not assumption); record the test-only call sites found
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Build the field-by-field reconciliation table (TS schema fields x Python validator fields x on-disk reality) in `plan.md` §3
- [x] T-05 Classify every field as machine-derivable vs authored-preserved, explicitly marking `causal_summary` as authored-preserved
- [x] T-06 Draft ADR-001 (canonical `derived` schema authority) in `decision-record.md`, scoring at least the three alternatives named in the 029 research (TS shape wholesale, Python shape wholesale, a merged/additive shape)
- [x] T-07 Draft ADR-002 (field disposition + `syncDerivedMetadata`/`backfillDerivedV2` repurpose-vs-delete call) in `decision-record.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Cross-check the recommended shape against all 11 live `derived` blocks for zero data loss (every field currently on disk maps to a field in the recommendation)
- [x] T-09 Confirm the decision gives phases 003/007/009 an unambiguous target shape, with no schema question left open for them to re-litigate
- [x] T-10 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`; resolve any errors before any checklist item is marked complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

`decision-record.md` records a recommended canonical `derived` schema with a complete field-disposition table and an explicit `syncDerivedMetadata`/`backfillDerivedV2` call; the recommendation is lossless against all 11 live roots; `validate.sh --strict` passes clean; operator sign-off is the remaining gate before phase 003 starts build.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Decision `decision-record.md` · Research trigger `../../029-skill-json-optimization-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
