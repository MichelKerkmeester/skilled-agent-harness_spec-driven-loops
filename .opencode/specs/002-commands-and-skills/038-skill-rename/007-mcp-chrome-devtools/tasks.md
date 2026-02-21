# Tasks: Phase 007 — Rename mcp-chrome-devtools to mcp-chrome-devtools

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

- [ ] T001 `git mv .opencode/skill/mcp-chrome-devtools .opencode/skill/mcp-chrome-devtools`
- [ ] T002 Verify new folder with all 21 files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (21 files)

- [ ] T003 Update SKILL.md — name, title, self-refs, MCP designation
- [ ] T004 Update index.md — name, description, category
- [ ] T005 [P] Update nodes/*.md (~5 files) — self-refs, cross-skill refs
- [ ] T006 [P] Update references/*.md (~3 files) — paths
- [ ] T007 [P] Update assets/*.md (~5 files) — template paths
- [ ] T008 [P] Update scripts/*.sh (~3 files) — paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (36 files)

### skill_advisor.py (20 lines)
- [ ] T009 Update INTENT_BOOSTERS for `mcp-chrome-devtools` → `mcp-chrome-devtools`
- [ ] T010 Update MULTI_SKILL_BOOSTERS

### Agent Files (4 runtimes)
- [ ] T011 [P] Update .opencode/agent/orchestrate.md
- [ ] T012 [P] Update .opencode/agent/chatgpt/orchestrate.md
- [ ] T013 [P] Update .claude/agents/orchestrate.md
- [ ] T014 [P] Update .gemini/agents/orchestrate.md

### Install Guides (4 files)
- [ ] T015 [P] Update .opencode/install_guides/README.md
- [ ] T016 [P] Update .opencode/install_guides/SET-UP - AGENTS.md
- [ ] T017 [P] Update .opencode/install_guides/SET-UP - Opencode Agents.md
- [ ] T018 [P] Update .opencode/install_guides/SET-UP - Skill Creation.md

### Root Docs (3 files)
- [ ] T019 Update CLAUDE.md
- [ ] T020 Update README.md
- [ ] T021 Update .opencode/README.md

### system-spec-kit
- [ ] T022 Update system-spec-kit/SKILL.md
- [ ] T023 Update system-spec-kit/nodes/rules.md

### Other External
- [ ] T024 [P] Update remaining external references
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Changelog & Cross-References

- [ ] T025 `git mv .opencode/changelog/11--mcp-chrome-devtools .opencode/changelog/11--mcp-chrome-devtools`
- [ ] T026 Update cross-refs in other skill folders
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Verification

- [ ] T027 `grep -r "mcp-chrome-devtools"` — expect 0
- [ ] T028 `python3 skill_advisor.py "take screenshot"` → `mcp-chrome-devtools`
- [ ] T029 `python3 skill_advisor.py "devtools"` → `mcp-chrome-devtools`
- [ ] T030 Verify folder exists, no old folder remains
- [ ] T031 Verify MCP alignment: `ls .opencode/skill/mcp-*` shows mcp-chrome-devtools alongside mcp-figma, mcp-code-mode
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Grep verification passed (T027)
- [ ] Smoke tests passed (T028-T029)
- [ ] MCP alignment verified (T031)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
