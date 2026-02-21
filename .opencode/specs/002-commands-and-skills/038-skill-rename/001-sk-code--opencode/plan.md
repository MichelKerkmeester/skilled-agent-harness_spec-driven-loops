# Implementation Plan: Phase 001 — Rename workflows-code--opencode to sk-code--opencode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, Shell |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem (skill folders) |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Rename the `workflows-code--opencode` skill folder and update all 48 files (35 internal + 13 external) that reference the old name. Execute as a batch find-replace operation after the filesystem rename.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Phase 3 must complete first)

### Definition of Done
- [ ] Folder renamed to `sk-code--opencode`
- [ ] Zero grep matches for `workflows-code--opencode` in active files
- [ ] skill_advisor.py returns correct name
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace refactor. No architectural changes.

### Key Components
- **Skill folder**: `.opencode/skill/workflows-code--opencode/` (35 files)
- **skill_advisor.py**: 19 line changes in INTENT_BOOSTERS/MULTI_SKILL_BOOSTERS dictionaries
- **Agent files**: 4 orchestrate.md files across runtimes
- **Install guides**: 2 files with skill registry entries
- **Root docs**: CLAUDE.md skill references

### Data Flow
No data flow changes. Skills are loaded by name from filesystem paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [ ] `git mv .opencode/skill/workflows-code--opencode .opencode/skill/sk-code--opencode`
- [ ] Verify new folder exists with all contents

### Step 2: Internal File Updates (35 files)
- [ ] Update SKILL.md: name field, title, internal paths
- [ ] Update index.md: name, description
- [ ] Update all nodes/*.md: self-references, cross-skill references
- [ ] Update all references/*.md: hard-coded paths
- [ ] Update all assets/*.md: template paths, example invocations
- [ ] Update all scripts/*.sh: hard-coded paths

### Step 3: External Reference Updates (13 files)
- [ ] Update skill_advisor.py (19 lines)
- [ ] Update agent/orchestrate.md (4 runtimes)
- [ ] Update install guides (2 files)
- [ ] Update CLAUDE.md

### Step 4: Changelog & Cross-References
- [ ] `git mv .opencode/changelog/07--workflows-code--opencode .opencode/changelog/07--sk-code--opencode`
- [ ] Update references to this skill within other skill folders

### Step 5: Verification
- [ ] `grep -r "workflows-code--opencode" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ CLAUDE.md` → 0 results
- [ ] `python3 .opencode/skill/scripts/skill_advisor.py "opencode standards"` → `sk-code--opencode`
- [ ] `ls .opencode/skill/sk-code--opencode/` → exists
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All active files | `grep -r "workflows-code--opencode"` |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py` |
| Directory check | Filesystem | `ls -d` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 (full-stack) complete | Internal | Pending | Must complete first to avoid partial match |
| Filesystem access | Internal | Green | Cannot rename without access |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading, missed references
- **Procedure**: `git checkout -- .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ CLAUDE.md`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 3 (Full-Stack) ──► Phase 1 (This Phase) ──► Phase 2 (Web)
                              │
                              ├── Step 1 (Rename) ──► Steps 2-4 (Updates) ──► Step 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Step 1 (Rename) | Phase 3 complete | Steps 2-4 |
| Steps 2-4 (Updates) | Step 1 | Step 5 |
| Step 5 (Verify) | Steps 2-4 | Phase 2 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Filesystem Rename | Low | 1 `git mv` command |
| Step 2: Internal Updates | Med | 35 files, mechanical find-replace |
| Step 3: External Updates | Med | 13 files + 19 skill_advisor lines |
| Step 4: Changelog & Cross-refs | Low | 1 `git mv` + cross-ref scan |
| Step 5: Verification | Low | grep + smoke test |
| **Total** | **Medium** | **~48 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 3 confirmed complete
- [ ] Clean git state (or changes committed)

### Rollback Procedure
1. `git checkout -- .` to restore all modified files
2. `git mv .opencode/skill/sk-code--opencode .opencode/skill/workflows-code--opencode` (if folder was renamed)
3. Verify old skill folder restored

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure filesystem and content changes
<!-- /ANCHOR:enhanced-rollback -->
