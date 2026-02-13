# Implementation Plan: Create Folder README Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML, Markdown |
| **Framework** | OpenCode command system |
| **Storage** | File-based (no database) |
| **Testing** | Manual YAML validation, grep verification |

### Overview
This plan fixes 10 alignment gaps between the `/create:folder_readme` command's execution asset (`create_folder_readme.yaml`) and entry point (`folder_readme.md`) versus the canonical `readme_template.md`. Changes are organized into 3 phases: HIGH gaps first (structural/breaking), then MEDIUM (consistency), then LOW (polish). All work modifies 2 files only.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (10 gaps, each verifiable)
- [x] Dependencies identified (spec 115 complete, template stable)

### Definition of Done
- [ ] All 10 gaps resolved
- [ ] YAML syntax valid (no parse errors)
- [ ] All key references in `folder_readme.md` resolve to actual YAML keys
- [ ] Consistent DQI target, emojis, and section structure
- [ ] Spec/plan/tasks synchronized

---

## 3. ARCHITECTURE

### Pattern
Configuration alignment — no architectural changes. Both files are static assets consumed by the OpenCode command system.

### Key Components
- **`create_folder_readme.yaml`**: Execution asset defining README types, section structures, emoji conventions, naming steps, and embedded templates. 765 lines.
- **`folder_readme.md`**: Command entry point that references YAML keys and provides step-by-step instructions. 463 lines.
- **`readme_template.md`**: Canonical source of truth (READ-ONLY). 1058 lines, 14 sections. Located at `.opencode/skill/workflows-documentation/assets/documentation/readme_template.md`.

### Data Flow
```
User invokes /create:folder_readme
    → folder_readme.md (command entry point, references YAML keys)
    → create_folder_readme.yaml (execution asset, defines structures)
    → readme_template.md (canonical template, referenced for section standard)
    → Generated README output
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: HIGH Gaps (Structural Fixes)
- [ ] Gap 1: Align YAML type-specific sections to template's 14-section standard
- [ ] Gap 2: Remove/replace ~140 lines of embedded conflicting templates in YAML
- [ ] Gap 3: Fix broken `notes.*` key references in `folder_readme.md`

### Phase 2: MEDIUM Gaps (Consistency Fixes)
- [ ] Gap 4: Standardize DQI target across YAML and command file
- [ ] Gap 5: Align emoji usage (features, troubleshooting) between YAML and template
- [ ] Gap 6: Fix YAML internal emoji inconsistency (`emoji_conventions` vs actual usage)

### Phase 3: LOW Gaps (Polish)
- [ ] Gap 7: Add missing template evolution pattern references (anchors, TOC, badges, diagrams)
- [ ] Gap 8: Fix 5-step vs 6-step naming confusion
- [ ] Gap 9: Correct command name in examples (`/create:folder_readme` consistently)
- [ ] Gap 10: Fix step numbering in `folder_readme.md` (start at 1, not 4)

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | YAML validity after all changes | Manual YAML parse check |
| Reference | All `folder_readme.md` key refs resolve | Grep for key names in YAML |
| Consistency | DQI target, emojis, section names match | Manual cross-file comparison |
| Structure | Each README type has template-aligned sections | Manual section-by-section audit |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `readme_template.md` (spec 115) | Internal | Green (complete) | Cannot determine canonical sections |
| `create_folder_readme.yaml` | Internal | Green (exists, 765 lines) | Primary target file |
| `folder_readme.md` | Internal | Green (exists, 463 lines) | Secondary target file |

---

## 7. ROLLBACK PLAN

- **Trigger**: YAML parse errors or broken command generation after changes
- **Procedure**: `git checkout` the two modified files to pre-change state

---

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (HIGH) ──► Phase 2 (MEDIUM) ──► Phase 3 (LOW)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (HIGH) | None | Phase 2 (MEDIUM) |
| Phase 2 (MEDIUM) | Phase 1 | Phase 3 (LOW) |
| Phase 3 (LOW) | Phase 2 | None |

Phase 1 must complete first because structural changes (section alignment, template removal) affect the locations where MEDIUM and LOW fixes apply.

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (HIGH gaps 1-3) | Medium | 2-3 hours |
| Phase 2 (MEDIUM gaps 4-6) | Low | 1-2 hours |
| Phase 3 (LOW gaps 7-10) | Low | 1 hour |
| **Total** | | **4-6 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Both files backed up (git tracked)
- [ ] YAML syntax validated before committing
- [ ] All key references verified

### Rollback Procedure
1. `git diff` to review all changes
2. `git checkout -- .opencode/command/create/assets/create_folder_readme.yaml .opencode/command/create/folder_readme.md`
3. Verify command still functions with original files
4. Document what caused the rollback

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — file-based changes only, git revert suffices

---

## Gap-to-Fix Mapping

| Gap # | Severity | File(s) | Fix Description |
|-------|----------|---------|-----------------|
| 1 | HIGH | YAML | Restructure type-specific sections to match 14-section template standard |
| 2 | HIGH | YAML | Replace ~140 lines of embedded templates with references to `readme_template.md` |
| 3 | HIGH | folder_readme.md | Replace `notes.readme_type_selection`, `notes.key_patterns` with valid YAML key paths |
| 4 | MEDIUM | YAML + folder_readme.md | Unify DQI target to single value (recommend 75) |
| 5 | MEDIUM | YAML | Align emojis for features/troubleshooting sections with template |
| 6 | MEDIUM | YAML | Reconcile `emoji_conventions` definitions with actual emoji usage throughout |
| 7 | LOW | YAML | Add references to template's anchor, TOC, badge, and diagram patterns |
| 8 | LOW | YAML | Rename `sequential_5_step` to match actual step count, or adjust steps |
| 9 | LOW | folder_readme.md | Replace `/documentation:create_readme` with `/create:folder_readme` |
| 10 | LOW | folder_readme.md | Renumber steps to start at 1, not 4 |

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
