# Implementation Plan: Skill Rename — workflows-* to sk-*/mcp-*

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, TypeScript, JSONC, Shell |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem (skill folders) |
| **Testing** | grep verification, skill_advisor.py smoke test |

### Overview
Rename 7 skill folders from `workflows-*` convention to `sk-*`/`mcp-*` convention, then systematically update all references across the codebase. The implementation uses a phased approach: filesystem renames first, then content updates grouped by domain (skills → agents → commands → docs → tests), followed by verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] All references cataloged by 5 context agents

### Definition of Done
- [ ] All 7 folders renamed on disk
- [ ] Zero grep matches for old names in active files
- [ ] skill_advisor.py returns correct new names
- [ ] Docs updated (spec/plan)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace refactor across filesystem and file contents. No architectural changes.

### Key Components
- **Skill folders**: 7 folders under `.opencode/skill/` to rename
- **skill_advisor.py**: Central skill routing script with name-to-skill mappings
- **Agent files**: 12 files across 4 runtime directories with skill references
- **Command YAMLs**: 20+ template files referencing `workflows-documentation` paths
- **Install guides**: 4 files with skill registry tables
- **Root docs**: 5 files (README.md, CLAUDE.md, AGENTS.md, etc.)
- **system-spec-kit**: Config, tests, templates, and documentation referencing skill names

### Data Flow
No data flow changes. Skills are loaded by name from filesystem paths. Renaming folders and updating name strings maintains identical behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Filesystem Renames (7 operations)
- [ ] `mv .opencode/skill/workflows-code--opencode → sk-code--opencode`
- [ ] `mv .opencode/skill/workflows-code--web-dev → sk-code--web`
- [ ] `mv .opencode/skill/workflows-code--full-stack → sk-code--full-stack`
- [ ] `mv .opencode/skill/workflows-documentation → sk-documentation`
- [ ] `mv .opencode/skill/workflows-git → sk-git`
- [ ] `mv .opencode/skill/workflows-visual-explainer → sk-visual-explainer`
- [ ] `mv .opencode/skill/workflows-chrome-devtools → mcp-chrome-devtools`

### Phase 2: Update Internal Skill References (~290 files)
For each renamed skill folder, update all internal files:
- [ ] SKILL.md — name field, title, internal references, self-paths
- [ ] index.md — name, description
- [ ] README.md — title, paths, related skills references
- [ ] nodes/*.md — cross-references to other skills, self-references
- [ ] references/*.md — hard-coded paths, cross-skill references
- [ ] assets/*.md — template paths, example invocations
- [ ] scripts/*.{sh,py,mjs} — hard-coded paths

**Find-replace operations per skill:**

| Old Name | New Name | Also update paths |
|----------|----------|-------------------|
| `workflows-code--opencode` | `sk-code--opencode` | `.opencode/skill/workflows-code--opencode/` → `.opencode/skill/sk-code--opencode/` |
| `workflows-code--web-dev` | `sk-code--web` | `.opencode/skill/workflows-code--web-dev/` → `.opencode/skill/sk-code--web/` |
| `workflows-code--full-stack` | `sk-code--full-stack` | `.opencode/skill/workflows-code--full-stack/` → `.opencode/skill/sk-code--full-stack/` |
| `workflows-documentation` | `sk-documentation` | `.opencode/skill/workflows-documentation/` → `.opencode/skill/sk-documentation/` |
| `workflows-git` | `sk-git` | `.opencode/skill/workflows-git/` → `.opencode/skill/sk-git/` |
| `workflows-visual-explainer` | `sk-visual-explainer` | `.opencode/skill/workflows-visual-explainer/` → `.opencode/skill/sk-visual-explainer/` |
| `workflows-chrome-devtools` | `mcp-chrome-devtools` | `.opencode/skill/workflows-chrome-devtools/` → `.opencode/skill/mcp-chrome-devtools/` |

**Special cases:**
- Bare `workflows-code` → `sk-code--web` (default variant)
- Wildcard `workflows-code--*` → `sk-code--*`

### Phase 3: Update skill_advisor.py (~100+ lines)
- [ ] Update all `workflows-git` entries in INTENT_BOOSTERS → `sk-git`
- [ ] Update all `workflows-chrome-devtools` entries → `mcp-chrome-devtools`
- [ ] Update all `workflows-documentation` entries → `sk-documentation`
- [ ] Update all `workflows-visual-explainer` entries → `sk-visual-explainer`
- [ ] Update all `workflows-code--web-dev` entries → `sk-code--web`
- [ ] Update all `workflows-code--opencode` entries → `sk-code--opencode`
- [ ] Update all `workflows-code--full-stack` entries in MULTI_SKILL_BOOSTERS → `sk-code--full-stack`

### Phase 4: Update Agent Files (12 files × 4 runtimes)
- [ ] `.opencode/agent/orchestrate.md` — skill tables, routing tables, path references
- [ ] `.opencode/agent/review.md` — `workflows-code--*` → `sk-code--*`, bare references
- [ ] `.opencode/agent/write.md` — `workflows-documentation` → `sk-documentation` (extensive: ~30 refs)
- [ ] `.opencode/agent/chatgpt/orchestrate.md` — same as above
- [ ] `.opencode/agent/chatgpt/review.md` — same as above
- [ ] `.opencode/agent/chatgpt/write.md` — same as above
- [ ] `.claude/agents/orchestrate.md` — same as above
- [ ] `.claude/agents/review.md` — same as above
- [ ] `.claude/agents/write.md` — same as above
- [ ] `.gemini/agents/orchestrate.md` — same as above
- [ ] `.gemini/agents/review.md` — same as above
- [ ] `.gemini/agents/write.md` — same as above

### Phase 5: Update Command Files (~25 files)
- [ ] `.opencode/command/create/` — All 12 YAML asset files (auto/confirm pairs for skill, skill_asset, skill_reference, agent, install_guide, folder_readme)
- [ ] `.opencode/command/create/` — All 6 .md files (skill.md, skill_asset.md, skill_reference.md, agent.md, install_guide.md, folder_readme.md)
- [ ] `.opencode/command/create/README.txt`
- [ ] `.opencode/command/README.txt`
- [ ] `.opencode/command/visual-explainer/` — 5 files (generate.md, fact-check.md, diff-review.md, plan-review.md, recap.md)

### Phase 6: Update Install Guides (4 files)
- [ ] `.opencode/install_guides/README.md` — skill registry, routing tables, file paths, manifest
- [ ] `.opencode/install_guides/SET-UP - AGENTS.md` — skill routing, triggers, manifest
- [ ] `.opencode/install_guides/SET-UP - Opencode Agents.md` — template paths, prerequisites
- [ ] `.opencode/install_guides/SET-UP - Skill Creation.md` — script paths, prerequisites

### Phase 7: Update Root & System Documentation (5+ files)
- [ ] `README.md` (project root) — skill table, changelog paths, examples
- [ ] `CLAUDE.md` (project root) — documentation workflow reference
- [ ] `AGENTS.md` — quick reference table (if separate from CLAUDE.md)
- [ ] `.opencode/README.md` — skill registry table, manual reference example
- [ ] `PUBLIC_RELEASE.md` — version table entries (historical — evaluate case by case)

### Phase 8: Update system-spec-kit References (~20 files)
- [ ] `config/config.jsonc` — indexedSkills array
- [ ] `SKILL.md` — downstream skill references, workflow chains
- [ ] `README.md` — related resources table
- [ ] `nodes/rules.md` — routing rules
- [ ] `templates/*/implementation-summary.md` — HVR_REFERENCE paths (8 files)
- [ ] `templates/*/decision-record.md` — HVR_REFERENCE paths (3 files)
- [ ] `templates/core/impl-summary-core.md` — HVR_REFERENCE paths
- [ ] `assets/template_mapping.md` — skill reference
- [ ] `references/templates/template_guide.md` — skill reference
- [ ] `references/templates/level_specifications.md` — skill reference
- [ ] `references/workflows/quick_reference.md` — skill reference
- [ ] `scripts/sgqs/index.ts` — example queries
- [ ] `scripts/lib/flowchart-generator.ts` — comment reference
- [ ] Test files (4 .vitest.ts files) — fixture skill names

### Phase 9: Rename Changelog Directories (7 renames)
- [ ] `mv .opencode/changelog/07--workflows-code--opencode → 07--sk-code--opencode`
- [ ] `mv .opencode/changelog/08--workflows-code--web-dev → 08--sk-code--web`
- [ ] `mv .opencode/changelog/09--workflows-code--full-stack → 09--sk-code--full-stack`
- [ ] `mv .opencode/changelog/06--workflows-documentation → 06--sk-documentation`
- [ ] `mv .opencode/changelog/10--workflows-git → 10--sk-git`
- [ ] `mv .opencode/changelog/11--workflows-chrome-devtools → 11--mcp-chrome-devtools`
- [ ] Verify: `workflows-visual-explainer` changelog dir existence

### Phase 10: Verification
- [ ] Run: `grep -r "workflows-code--\|workflows-documentation\|workflows-git\|workflows-visual-explainer\|workflows-chrome-devtools" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ README.md CLAUDE.md AGENTS.md .opencode/README.md`
- [ ] Expected: 0 results (excluding changelog content, specs/memory, archives)
- [ ] Run: `python3 .opencode/skill/scripts/skill_advisor.py "git commit"` → verify returns `sk-git`
- [ ] Run: `python3 .opencode/skill/scripts/skill_advisor.py "implement feature"` → verify returns `sk-code--web`
- [ ] Run: `python3 .opencode/skill/scripts/skill_advisor.py "create documentation"` → verify returns `sk-documentation`
- [ ] Run: `python3 .opencode/skill/scripts/skill_advisor.py "take screenshot"` → verify returns `mcp-chrome-devtools`
- [ ] Verify all 7 new folders exist: `ls -d .opencode/skill/sk-* .opencode/skill/mcp-chrome-devtools`
- [ ] Verify no old folders remain: `ls -d .opencode/skill/workflows-* 2>/dev/null` → empty
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All active files | `grep -r` with exclusion patterns |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py "<query>"` |
| Directory verification | Filesystem | `ls -d` for new/old folders |
| Unit tests | system-spec-kit test files | `npx vitest` (after fixture updates) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Filesystem access to .opencode/skill/ | Internal | Green | Cannot rename folders |
| No concurrent sessions modifying skills | Internal | Green | Conflicts during rename |
| Git tracking of renames | Internal | Green | Use `git mv` for clean tracking |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken skill loading, missed references causing errors
- **Procedure**: `git checkout -- .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/` to restore all modified files. Skill folder renames tracked by git can be reverted via `git checkout`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Filesystem Renames) ──┐
                                ├──► Phase 2 (Internal Skill Refs)
                                ├──► Phase 3 (skill_advisor.py)
                                ├──► Phase 4 (Agent Files)
                                ├──► Phase 5 (Command Files)
                                ├──► Phase 6 (Install Guides)
                                ├──► Phase 7 (Root Docs)
                                ├──► Phase 8 (system-spec-kit)
                                └──► Phase 9 (Changelog Dirs)
                                         │
                                         ▼
                                Phase 10 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Renames) | None | Phases 2-9 |
| Phases 2-9 | Phase 1 | Phase 10 |
| Phase 10 (Verify) | Phases 2-9 | None |

**Note**: Phases 2-9 are independent of each other and can be executed in parallel after Phase 1 completes. However, for implementation simplicity, sequential execution per-phase is recommended.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Filesystem Renames | Low | 7 `git mv` commands |
| Phase 2: Internal Skill Refs | High | ~290 files, mostly mechanical |
| Phase 3: skill_advisor.py | Med | ~100 line changes in 1 file |
| Phase 4: Agent Files | Med | 12 files, ~10 replacements each |
| Phase 5: Command Files | High | ~25 files, ~172 refs for `workflows-documentation` alone |
| Phase 6: Install Guides | Med | 4 files, ~80 references total |
| Phase 7: Root Docs | Low | 5 files, ~30 references total |
| Phase 8: system-spec-kit | Med | ~20 files, mix of config/test/template |
| Phase 9: Changelog Dirs | Low | 7 `git mv` commands |
| Phase 10: Verification | Low | grep + smoke tests |
| **Total** | **High** | **~370 unique files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Working on clean git state (or committed current changes)
- [ ] No other sessions actively using skill files

### Rollback Procedure
1. `git checkout -- .` to restore all file contents
2. Verify old skill folders restored
3. Run skill_advisor.py smoke test to confirm restored state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure filesystem and content changes, fully git-reversible
<!-- /ANCHOR:enhanced-rollback -->

---

## IMPLEMENTATION NOTES

### Recommended Implementation Strategy

Given the massive number of files (~370), the implementation should use **batch sed/find-replace operations** rather than individual file edits:

1. **Phase 1**: Use `git mv` for folder renames (preserves git history)
2. **Phases 2-9**: For each old→new name pair, use recursive find-replace across all relevant directories:
   - Process replacements in order from most specific to least specific to avoid partial matches:
     1. `workflows-code--full-stack` → `sk-code--full-stack` (longest first)
     2. `workflows-code--opencode` → `sk-code--opencode`
     3. `workflows-code--web-dev` → `sk-code--web`
     4. `workflows-chrome-devtools` → `mcp-chrome-devtools`
     5. `workflows-documentation` → `sk-documentation`
     6. `workflows-visual-explainer` → `sk-visual-explainer`
     7. `workflows-git` → `sk-git`
     8. `workflows-code--*` → `sk-code--*` (wildcard pattern in prose)
     9. `workflows-code` (bare) → `sk-code--web` (only in non-wildcard contexts)

### Files to Exclude from Replacement
- `.opencode/changelog/*/v*.md` — changelog entry content (historical)
- `.opencode/specs/*/memory/` — auto-generated memory files
- `z_archive/` directories — archived content
- `.git/` — git internals

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
