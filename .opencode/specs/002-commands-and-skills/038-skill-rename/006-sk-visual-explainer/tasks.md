# Tasks: Phase 006 — Rename sk-visual-explainer to sk-visual-explainer

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
## Step 1: Filesystem Rename

- [x] T001 `git mv .opencode/skill/sk-visual-explainer .opencode/skill/sk-visual-explainer`
- [x] T002 Verify new folder with all 22 files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (22 files)

- [x] T003 Update SKILL.md
- [x] T004 Update index.md
- [x] T005 [P] Update nodes/*.md (~4 files)
- [x] T006 [P] Update references/*.md (~3 files)
- [x] T007 [P] Update assets/*.md (~8 files)
- [x] T008 [P] Update scripts/*.sh (~2 files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (6 files)

### skill_advisor.py (16 lines)
- [x] T009 Update INTENT_BOOSTERS for `sk-visual-explainer` → `sk-visual-explainer`
- [x] T010 Update MULTI_SKILL_BOOSTERS

### Agent Files
- [x] T011 [P] Update .opencode/agent/orchestrate.md
- [x] T012 [P] Update .opencode/agent/chatgpt/orchestrate.md

### Command Files
- [x] T013 [P] Update .opencode/command/visual-explainer/generate.md
- [x] T014 [P] Update .opencode/command/visual-explainer/fact-check.md
- [x] T015 [P] Update .opencode/command/visual-explainer/diff-review.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Changelog & Cross-References

- [x] T016 Check if changelog dir exists for `sk-visual-explainer`; rename if yes
- [x] T017 Update cross-refs in other skill folders
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Verification

- [x] T018 `grep -r "sk-visual-explainer"` — expect 0
- [x] T019 skill_advisor.py smoke test
- [x] T020 Verify folder exists, no old folder remains
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Grep verification passed (T018)
- [x] Smoke test passed (T019)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
