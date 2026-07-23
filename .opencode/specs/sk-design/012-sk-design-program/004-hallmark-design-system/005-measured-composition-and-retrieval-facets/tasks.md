---
title: "Tasks: Measured Composition and Retrieval Facets"
description: "Track additive composition schema, deterministic indexing, retrieval facets, and compatibility verification."
trigger_phrases:
  - "measured composition DNA"
  - "page shape retrieval facets"
  - "style composition query"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets"
    last_updated_at: "2026-07-22T19:16:28Z"
    last_updated_by: "implementation-agent"
    recent_action: "Verified measured composition facets"
    next_safe_action: "Regenerate metadata and commit scoped changes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/schema.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/indexer.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/retrieval.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "measured-composition-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Measured Composition and Retrieval Facets

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Read both research syntheses and isolate the measured composition recommendation. [EVIDENCE: `sol-codex/research.md` and `sol-opencode/research.md` identify measured composition and evidence-derived retrieval]
- [x] T002 Read the schema, indexer, retrieval, canonical helpers, and database tests. [EVIDENCE: `schema.mjs`, `indexer.mjs`, `retrieval.mjs`, and `canonical.mjs` were read before mutation]
- [x] T003 Capture the 69/69 passing database baseline. [EVIDENCE: pre-change command reported tests 69, pass 69, fail 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add version-compatible composition storage and migration (`schema.mjs`). [EVIDENCE: v2 migration preservation subtest passes]
- [x] T005 Derive canonical composition records and facets (`indexer.mjs`). [EVIDENCE: deterministic composition subtest passes]
- [x] T006 Add required and preferred composition facet query keys (`retrieval.mjs`). [EVIDENCE: composition filter/rank subtest passes]
- [x] T007 Add schema, derivation, retrieval, and compatibility tests (`tests/database/`). [EVIDENCE: full database command reports tests 73, pass 73, fail 0]
- [x] T008 Author the Level 2 phase packet (`005-measured-composition-and-retrieval-facets/`). [EVIDENCE: strict validator reports all five template headers and anchor sets valid]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run focused schema, indexer, and retrieval tests; 31/31 pass. [EVIDENCE: focused command reports tests 31, pass 31, fail 0]
- [x] T010 Run the full database suite. [EVIDENCE: final command reports 73/73 tests passing and 0 failures]
- [x] T011 Run strict packet validation and record the generated-metadata exception. [EVIDENCE: `validate.sh --strict` reports Errors 0 with orchestrator-owned graph metadata absent]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. [EVIDENCE: T001-T011 are checked above]
- [x] No `[B]` blocked tasks remaining. [EVIDENCE: no blocked task marker appears in the task phases]
- [x] Full database and packet verification recorded. [EVIDENCE: T010 and T011 cite final command outcomes]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../../../001-research/004-hallmark-design-skill-research/research/lineages/sol-codex/research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
