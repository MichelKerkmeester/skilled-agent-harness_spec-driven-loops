<!-- SPECKIT_LEVEL: 2 -->
# Tasks: Memory Command README Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[D]` | Deferred |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `- [ ] **T###** | Priority | Description | Status`

---

## Phase 1: P0 — manage.md Updates

- [x] **T001** | P0 | Add `includeReadmes` parameter section to `manage.md` — document type (boolean), default (true), and usage for controlling README inclusion in index scans | Complete
- [x] **T002** | P0 | Add README scan workflow documentation to `manage.md` — describe 4-source discovery pipeline: specFiles, constitutionalFiles, skillReadmes (via `findSkillReadmes()`), projectReadmes (via `findProjectReadmes()`) | Complete
- [x] **T003** | P0 | Add tiered importance weight documentation to `manage.md` — weight table (User 0.5, Project READMEs 0.4, Skill READMEs 0.3), scoring formula `score *= (0.5 + importance_weight)`, and `README_EXCLUDE_PATTERNS` mention | Complete

---

## Phase 2: P1 — save.md Updates

- [x] **T004** | P1 | Add `includeReadmes` to `save.md` parameter table — consistent format with manage.md, type boolean, default true | Complete
- [x] **T005** | P1 | Document 4-source indexing pipeline in `save.md` — reference `findProjectReadmes()` and `findSkillReadmes()`, explain how README files flow through the save pipeline with `calculateReadmeWeight()` | Complete
- [x] **T006** | P1 | Add anchor prefix matching documentation to `save.md` anchor section — explain that `anchors: ['summary']` matches `summary-049` via exact match priority then prefix fallback with shortest-match selection | Complete

---

## Phase 3: P2 — CONTEXT.md + Implement YAMLs

- [x] **T007** | P2 | Add README context mention to `CONTEXT.md` — note that memory context now includes README documentation from skills and project directories | Complete
- [x] **T008** | P2 | Add anchor prefix matching documentation to `CONTEXT.md` — brief explanation of prefix matching behavior for anchor-based retrieval | Complete
- [x] **T009** | P2 | Update `spec_kit_implement_auto.yaml` anchor pattern — add note about prefix matching behavior (exact match priority, prefix fallback) | Complete
- [x] **T010** | P2 | Update `spec_kit_implement_confirm.yaml` anchor pattern — same prefix matching note as T009 | Complete

---

## Phase 4: P3 — Create YAML Batch Updates

- [x] **T011** | P3 | Update `create_folder_readme.yaml` — add note that created README files are auto-indexed by memory system with importance_weight 0.3 (skill READMEs) | Complete
- [x] **T012** | P3 | Update `create_folder_skill.yaml` — add anchor prefix matching note in anchor-related sections if applicable | Complete
- [x] **T013** | P3 | Update `create_folder_agent.yaml` — add anchor prefix matching note if anchor patterns are referenced | Complete
- [x] **T014** | P3 | Update `create_folder_command.yaml` and `create_folder_spec.yaml` — add prefix matching mentions where anchor patterns exist | Complete

---

## Phase 5: Verification & Memory Save

- [x] **T015** | P0 | Re-read all modified files and verify cross-reference consistency — weight values (0.3/0.4/0.5) match across all documents, no contradictions with spec 111 | Complete
- [x] **T016** | P1 | Verify all YAML files parse correctly — no syntax errors introduced by modifications | Complete
- [x] **T017** | P1 | Generate memory context for spec 112 — run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` with spec 112 folder path | Complete

---

## Completion Criteria

- [x] All P0 tasks marked `[x]` (T001, T002, T003, T015)
- [x] All P1 tasks marked `[x]` OR user-approved deferral (T004, T005, T006, T016, T017)
- [x] All P2 tasks marked `[x]` OR documented deferral (T007-T010)
- [x] All P3 tasks marked `[x]` OR deferred without approval needed (T011-T014)
- [x] No YAML syntax errors in modified files
- [x] Weight values consistent across all documents

---

## Task Summary

| Phase | Tasks | Priority Breakdown |
|-------|-------|-------------------|
| Phase 1: manage.md (P0) | T001-T003 | P0: 3 |
| Phase 2: save.md (P1) | T004-T006 | P1: 3 |
| Phase 3: CONTEXT.md + YAMLs (P2) | T007-T010 | P2: 4 |
| Phase 4: Create YAMLs (P3) | T011-T014 | P3: 4 |
| Phase 5: Verification | T015-T017 | P0: 1, P1: 2 |
| **TOTAL** | **17 tasks** | **P0: 4, P1: 5, P2: 4, P3: 4** |

---

## Progress Tracking

**Last Updated**: 2026-02-12

| Phase | Status | Completed | Remaining |
|-------|--------|-----------|-----------|
| Phase 1 | Complete | 3/3 | 0 |
| Phase 2 | Complete | 3/3 | 0 |
| Phase 3 | Complete | 4/4 | 0 |
| Phase 4 | Complete | 4/4 | 0 |
| Phase 5 | Complete | 3/3 | 0 |

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `003-system-spec-kit/111-readme-anchor-schema/implementation-summary.md`

---

<!--
LEVEL 2 TASKS
- Core + L2 addendum
- 17 tasks across 5 phases
- Priority tagged P0/P1/P2/P3
- File path references for traceability
-->
