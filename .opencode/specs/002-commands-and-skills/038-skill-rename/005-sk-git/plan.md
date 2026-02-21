# Implementation Plan: Phase 005 — Rename workflows-git to sk-git

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
| **Storage** | Filesystem |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Rename `workflows-git` to `sk-git` across 59 files (20 internal + 39 external). Executes last (7th) due to shortest name. Has highest skill_advisor.py line count (28).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear
- [x] Success criteria measurable
- [x] Dependencies: all other phases must complete first

### Definition of Done
- [ ] Folder renamed to `sk-git`
- [ ] Zero grep matches
- [ ] skill_advisor.py correct (28 lines updated)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace. No architectural changes.

### Key Components
- **Skill folder**: 20 files
- **skill_advisor.py**: 28 lines (highest — INTENT_BOOSTERS + MULTI_SKILL_BOOSTERS)
- **Agent files**: 4 orchestrate.md
- **Install guides**: 4 files
- **Root docs**: 3 files
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [ ] `git mv .opencode/skill/workflows-git .opencode/skill/sk-git`

### Step 2: Internal File Updates (20 files)
- [ ] SKILL.md, index.md
- [ ] nodes/*.md (~5 files)
- [ ] references/*.md (~3 files)
- [ ] assets/*.md (~5 files)
- [ ] scripts/*.sh (~2 files)

### Step 3: skill_advisor.py (28 lines)
- [ ] INTENT_BOOSTERS entries
- [ ] MULTI_SKILL_BOOSTERS entries

### Step 4: External Reference Updates (39 files)
- [ ] orchestrate.md (4 runtimes)
- [ ] Install guides (4 files)
- [ ] Root docs (3 files)
- [ ] Other external refs

### Step 5: Changelog & Cross-References
- [ ] `git mv .opencode/changelog/10--workflows-git .opencode/changelog/10--sk-git`
- [ ] Cross-refs in other skills

### Step 6: Verification
- [ ] grep: 0 matches
- [ ] skill_advisor.py smoke tests
- [ ] Directory check
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | All active files | `grep -r "workflows-git"` |
| Smoke test | skill_advisor.py | Multiple git queries |
| Directory | Filesystem | `ls -d` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| All phases (1-4, 6-7) complete | Internal | Pending | Must execute last |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading
- **Procedure**: `git checkout -- .`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 6 ──► Phase 5 (This Phase — LAST)
                  │
                  ├── Step 1 ──► Steps 2-5 ──► Step 6
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (20) | Low | Small folder |
| Step 3: skill_advisor (28 lines) | Med | Highest line count |
| Step 4: External (39) | Med | Moderate refs |
| Step 5: Changelog | Low | 1 `git mv` |
| Step 6: Verification | Low | grep + smoke |
| **Total** | **Medium-High** | **~59 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All other phases confirmed complete
- [ ] Clean git state

### Rollback Procedure
1. `git checkout -- .`
2. Verify restored

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
