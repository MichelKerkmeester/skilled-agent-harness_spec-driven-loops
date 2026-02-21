# Tasks: Skill Rename — workflows-* to sk-*/mcp-*

<!-- SPECKIT_LEVEL: 3+ -->
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

<!-- ANCHOR:phase-0 -->
## Phase 0: Documentation Setup

- [x] T001 Upgrade parent spec.md to Level 3+ (spec.md)
- [x] T002 Upgrade parent plan.md to Level 3+ (plan.md)
- [x] T003 Upgrade parent checklist.md to Level 3+ (checklist.md)
- [x] T004 Create parent tasks.md (tasks.md)
- [x] T005 Create parent decision-record.md (decision-record.md)
- [x] T006 [P] Create phase 001-sk-code--opencode/ folder with L2 docs
- [x] T007 [P] Create phase 002-sk-code--web/ folder with L2 docs
- [x] T008 [P] Create phase 003-sk-code--full-stack/ folder with L2 docs
- [x] T009 [P] Create phase 004-sk-documentation/ folder with L2 docs
- [x] T010 [P] Create phase 005-sk-git/ folder with L2 docs
- [x] T011 [P] Create phase 006-sk-visual-explainer/ folder with L2 docs
- [x] T012 [P] Create phase 007-mcp-chrome-devtools/ folder with L2 docs
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-exec -->
## Phase Execution (Sequential — Longest Match First)

- [ ] T013 Execute Phase 3: `sk-code--full-stack` → `sk-code--full-stack` (003-sk-code--full-stack/)
- [ ] T014 Execute Phase 1: `workflows-code--opencode` → `sk-code--opencode` (001-sk-code--opencode/)
- [ ] T015 Execute Phase 2: `workflows-code--web-dev` → `sk-code--web` (002-sk-code--web/)
- [ ] T016 Execute Phase 7: `mcp-chrome-devtools` → `mcp-chrome-devtools` (007-mcp-chrome-devtools/)
- [ ] T017 Execute Phase 4: `workflows-documentation` → `sk-documentation` (004-sk-documentation/)
- [ ] T018 Execute Phase 6: `workflows-visual-explainer` → `sk-visual-explainer` (006-sk-visual-explainer/)
- [ ] T019 Execute Phase 5: `workflows-git` → `sk-git` (005-sk-git/)
<!-- /ANCHOR:phase-exec -->

---

<!-- ANCHOR:verification -->
## Final Verification

- [ ] T020 Run full grep verification: 0 matches for all old names
- [ ] T021 Run skill_advisor.py smoke tests (4 queries)
- [ ] T022 Verify all 7 new folders exist
- [ ] T023 Verify no old folders remain
- [ ] T024 Update parent Phase Documentation Map with completion status
- [ ] T025 Save memory context
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Full grep verification passed (T020)
- [ ] skill_advisor.py smoke tests passed (T021)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
