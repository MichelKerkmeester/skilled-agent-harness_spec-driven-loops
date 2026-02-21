# Implementation Plan: Phase 007 — Rename mcp-chrome-devtools to mcp-chrome-devtools

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
Rename `mcp-chrome-devtools` to `mcp-chrome-devtools` across 57 files (21 internal + 36 external). Uses `mcp-` prefix (not `sk-`) to categorize as MCP integration, aligning with `mcp-figma` and `mcp-code-mode`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Folder renamed to `mcp-chrome-devtools`
- [ ] Zero grep matches
- [ ] MCP categorization correct
- [ ] skill_advisor.py correct
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace with prefix change. No architectural changes.

### Key Components
- **Skill folder**: 21 files
- **skill_advisor.py**: 20 lines
- **Agent files**: 4 orchestrate.md
- **Install guides**: 4 files
- **Root docs**: 3 files
- **system-spec-kit**: 2 files
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [ ] `git mv .opencode/skill/mcp-chrome-devtools .opencode/skill/mcp-chrome-devtools`

### Step 2: Internal File Updates (21 files)
- [ ] SKILL.md, index.md, nodes/, references/, assets/, scripts/

### Step 3: External Reference Updates (36 files)
- [ ] skill_advisor.py (20 lines)
- [ ] orchestrate.md (4 runtimes)
- [ ] Install guides (4 files)
- [ ] Root docs (3 files)
- [ ] system-spec-kit (2 files)
- [ ] Other external refs

### Step 4: Changelog
- [ ] `git mv .opencode/changelog/11--mcp-chrome-devtools .opencode/changelog/11--mcp-chrome-devtools`

### Step 5: Verification
- [ ] grep: 0 matches
- [ ] skill_advisor.py smoke test
- [ ] MCP alignment check
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | All active files | `grep -r "mcp-chrome-devtools"` |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py "take screenshot"` |
| MCP check | Naming | Verify alignment with mcp-figma, mcp-code-mode |
| Directory | Filesystem | `ls -d` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3, 1, 2 complete | Internal | Pending | Must execute 4th |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken MCP integration
- **Procedure**: `git checkout -- .`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 2 ──► Phase 7 (This Phase) ──► Phase 4
                  │
                  ├── Step 1 ──► Steps 2-4 ──► Step 5
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (21) | Low | Small folder |
| Step 3: External (36) | Med | Moderate refs |
| Step 4: Changelog | Low | 1 `git mv` |
| Step 5: Verification | Low | grep + smoke |
| **Total** | **Medium-High** | **~57 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phases 3, 1, 2 confirmed complete
- [ ] Clean git state

### Rollback Procedure
1. `git checkout -- .`

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
