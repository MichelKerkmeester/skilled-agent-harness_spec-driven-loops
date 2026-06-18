---
title: "Tasks: advisor packed BM25F lexical shadow helper"
description: "Completed task ledger for the default-off packed BM25F advisor lexical shadow helper."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical"
    last_updated_at: "2026-06-10T21:14:49Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed implementation and verification tasks"
    next_safe_action: "Keep BM25 shadow-only until promotion phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/bm25-lexical-shadow.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-advisor-packed-bm25-lexical"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: advisor-packed-bm25-lexical

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Inspect current lexical scorer, lane registry, weights config, fusion call path, and scorer tests. Evidence: read `lexical.ts`, `lane-registry.ts`, `weights-config.ts`, `fusion.ts`, and scorer suites.
- [x] T002 Confirm no dependency or package changes are needed. Evidence: implementation uses existing TypeScript and Vitest only.
- [x] T003 [P] Identify out-of-scope surfaces. Evidence: `fusion.ts`, `types.ts`, and `advisor-validate.ts` were inspected but not modified.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement packed BM25F helper with term dictionary and typed-array postings. Evidence: `lanes/bm25.ts` creates `AdvisorPackedBm25Index` and clears mutable postings after finalization.
- [x] T005 Add query-time field weights for name, keywords, domains, intent signals, derived triggers, and description. Evidence: `ADVISOR_BM25_FIELD_WEIGHTS` and BM25F unit test.
- [x] T006 Add default-off shadow wrapper without changing live lexical scoring. Evidence: `scoreLexicalLane` unchanged; `scoreLexicalShadowLanes` only emits BM25 when the flag is enabled.
- [x] T007 Add registry metadata for BM25 shadow without adding it to live `SCORER_LANES`. Evidence: `SHADOW_SCORER_LANE_DEFINITIONS` in `lane-registry.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add and run BM25F focused tests. Evidence: `npx vitest run tests/scorer/bm25-lexical-shadow.vitest.ts` passed 1 file, 5 tests.
- [x] T009 Run scorer and advisor_validate suites. Evidence: scorer/validate Vitest command passed 9 files, 74 tests after the BM25 corpus test was added.
- [x] T010 Run typecheck and build. Evidence: `npm run typecheck` and `npm run build` exited 0.
- [x] T011 Update documentation. Evidence: spec, plan, tasks, and implementation summary reconciled.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: live scorer parity and out-of-scope boundary reviewed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
