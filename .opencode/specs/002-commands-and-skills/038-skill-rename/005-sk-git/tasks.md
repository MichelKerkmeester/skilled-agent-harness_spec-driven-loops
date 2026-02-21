# Tasks: Phase 005 — Rename workflows-git to sk-git

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

- [ ] T001 `git mv .opencode/skill/workflows-git .opencode/skill/sk-git`
- [ ] T002 Verify new folder with all 20 files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (20 files)

- [ ] T003 Update SKILL.md
- [ ] T004 Update index.md
- [ ] T005 [P] Update nodes/*.md (~5 files)
- [ ] T006 [P] Update references/*.md (~3 files)
- [ ] T007 [P] Update assets/*.md (~5 files)
- [ ] T008 [P] Update scripts/*.sh (~2 files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: skill_advisor.py (28 lines — highest)

- [ ] T009 Update INTENT_BOOSTERS for `workflows-git` → `sk-git` (~20 entries)
- [ ] T010 Update MULTI_SKILL_BOOSTERS for `workflows-git` → `sk-git` (~8 entries)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: External Reference Updates (39 files)

### Agent Files
- [ ] T011 [P] Update .opencode/agent/orchestrate.md
- [ ] T012 [P] Update .opencode/agent/chatgpt/orchestrate.md
- [ ] T013 [P] Update .claude/agents/orchestrate.md
- [ ] T014 [P] Update .gemini/agents/orchestrate.md

### Install Guides
- [ ] T015 [P] Update .opencode/install_guides/README.md
- [ ] T016 [P] Update .opencode/install_guides/SET-UP - AGENTS.md
- [ ] T017 [P] Update .opencode/install_guides/SET-UP - Opencode Agents.md
- [ ] T018 [P] Update .opencode/install_guides/SET-UP - Skill Creation.md

### Root Docs
- [ ] T019 Update CLAUDE.md
- [ ] T020 Update README.md
- [ ] T021 Update .opencode/README.md

### Other External
- [ ] T022 [P] Update remaining external references (system-spec-kit, command files, etc.)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Changelog & Cross-References

- [ ] T023 `git mv .opencode/changelog/10--workflows-git .opencode/changelog/10--sk-git`
- [ ] T024 Update cross-refs in other skill folders
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Step 6: Verification

- [ ] T025 `grep -r "workflows-git"` — expect 0
- [ ] T026 `python3 skill_advisor.py "git commit"` → `sk-git`
- [ ] T027 `python3 skill_advisor.py "push changes"` → `sk-git`
- [ ] T028 `python3 skill_advisor.py "create branch"` → `sk-git`
- [ ] T029 Verify folder exists, no old folder remains
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Grep verification passed (T025)
- [ ] All 3 smoke tests passed (T026-T028)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
