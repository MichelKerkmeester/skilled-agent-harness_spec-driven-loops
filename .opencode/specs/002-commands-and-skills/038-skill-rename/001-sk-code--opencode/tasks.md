# Tasks: Phase 001 — Rename workflows-code--opencode to sk-code--opencode

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

- [ ] T001 `git mv .opencode/skill/workflows-code--opencode .opencode/skill/sk-code--opencode`
- [ ] T002 Verify new folder exists with all contents intact
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (35 files)

- [ ] T003 Update SKILL.md — name field, title, self-references, paths (.opencode/skill/sk-code--opencode/SKILL.md)
- [ ] T004 Update index.md — name, description (.opencode/skill/sk-code--opencode/index.md)
- [ ] T005 [P] Update nodes/quick-reference.md — self-references, cross-skill refs
- [ ] T006 [P] Update nodes/when-to-use.md — self-references
- [ ] T007 [P] Update nodes/implementation-workflow.md — paths, cross-refs
- [ ] T008 [P] Update nodes/verification-workflow.md — paths
- [ ] T009 [P] Update nodes/language-standards.md — cross-refs
- [ ] T010 [P] Update nodes/project-detection.md — cross-refs
- [ ] T011 [P] Update references/*.md (~5 files) — hard-coded paths to skill folder
- [ ] T012 [P] Update assets/*.md (~15 files) — template paths, example invocations
- [ ] T013 [P] Update scripts/*.sh (~3 files) — hard-coded paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (13 files)

### skill_advisor.py (19 lines)
- [ ] T014 Update INTENT_BOOSTERS entries for `workflows-code--opencode` → `sk-code--opencode` (.opencode/skill/scripts/skill_advisor.py)
- [ ] T015 Update MULTI_SKILL_BOOSTERS entries for `workflows-code--opencode` → `sk-code--opencode` (.opencode/skill/scripts/skill_advisor.py)

### Agent Files (4 runtimes)
- [ ] T016 [P] Update .opencode/agent/orchestrate.md — skill table, routing references
- [ ] T017 [P] Update .opencode/agent/chatgpt/orchestrate.md — skill table
- [ ] T018 [P] Update .claude/agents/orchestrate.md — skill table
- [ ] T019 [P] Update .gemini/agents/orchestrate.md — skill table

### Install Guides
- [ ] T020 [P] Update .opencode/install_guides/README.md — skill registry
- [ ] T021 [P] Update .opencode/install_guides/SET-UP - AGENTS.md — skill references

### Root Docs
- [ ] T022 Update CLAUDE.md — skill references
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Changelog & Cross-References

- [ ] T023 `git mv .opencode/changelog/07--workflows-code--opencode .opencode/changelog/07--sk-code--opencode`
- [ ] T024 Update cross-references to `workflows-code--opencode` in other skill folders (scan: `grep -r "workflows-code--opencode" .opencode/skill/ --include="*.md"`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Verification

- [ ] T025 Run `grep -r "workflows-code--opencode" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ CLAUDE.md` — expect 0 results
- [ ] T026 Run `python3 .opencode/skill/scripts/skill_advisor.py "opencode standards"` — expect `sk-code--opencode`
- [ ] T027 Verify `ls .opencode/skill/sk-code--opencode/` — folder exists
- [ ] T028 Verify `ls .opencode/skill/workflows-code--opencode 2>/dev/null` — no old folder
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Grep verification passed (T025)
- [ ] Smoke test passed (T026)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
