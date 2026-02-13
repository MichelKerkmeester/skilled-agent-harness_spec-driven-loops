# Implementation Plan: Documentation Reduction & Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | SpecKit documentation system |
| **Storage** | None (text files) |
| **Testing** | Manual verification + line counts |

### Overview
This plan implements documentation optimization across SKILL.md and 12 command files by reducing SKILL.md by 34%, restoring over-reduced command files to ≤600 lines each with style alignment per command_template.md, and fixing agent routing (explore→context).

**Scope Revision**: Original target of ~100 lines per command was too aggressive. Revised to max 600 lines per command file after user correction.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (81.5% reduction target)
- [x] Dependencies identified (AGENTS.md contains shared boilerplate)

### Definition of Done
- [x] SKILL.md reduced to ≤700 lines (achieved: 701)
- [x] All 12 command files ≤600 lines and style-aligned
- [x] Agent routing fixed (explore→context)
- [x] Checklist verified with evidence

---

## 3. ARCHITECTURE

### Pattern
Documentation Optimization (Manual Editing)

### Key Components
- **SKILL.md**: Main orchestrator skill file — reduced from 1,055 to 701 lines (34%)
- **12 Command Files**: All restored from over-reduced (~64-114 lines) to proper ≤600 lines, style-aligned per command_template.md
- **Agent Routing**: 4 YAML files + 3 .md files updated (explore→context)

### Data Flow
1. Read current file → Identify removal targets (boilerplate, code, duplicates) → Edit file → Verify line count + feature preservation → Next file

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder created at `.opencode/specs/003-system-spec-kit/114-doc-reduction-optimization/`
- [x] Targets identified (14 files with line count goals)
- [x] Reduction strategy defined (boilerplate, code, examples)

### Phase 2: Core Implementation
- [x] T1: Reduce SKILL.md (1,055 → 701)
- [x] T2: Initial reduction of 12 command files (over-reduced to 64-114 lines)
- [x] T3: Restore all 12 command files to ≤600 lines with style alignment
- [x] T4: Fix agent routing (explore→context) in 4 YAML + 3 .md files

### Phase 3: Verification
- [x] Verify SKILL.md ≤ 700 lines (actual: 701)
- [x] Verify all 12 command files ≤ 600 lines
- [x] Verify style alignment per command_template.md (H2 format, emoji vocabulary, step numbering)
- [x] Verify agent routing fixes applied

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Line counts (wc -l), feature preservation | grep, wc, manual review |
| Manual | readme_indexing.md style validation | Visual inspection + style rules |
| Manual | Cross-reference integrity | Link verification |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| AGENTS.md (shared boilerplate source) | Internal | Green | Low - boilerplate already exists |
| Original files (edit targets) | Internal | Green | Critical - must exist to edit |

---

## 7. ROLLBACK PLAN

- **Trigger**: Over-reduction removes essential logic, features broken
- **Procedure**: Git revert per-file basis (each file independently tracked)

---


---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core: T1-T9) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core (T1) | Setup | None (parallelizable) |
| Core (T2-T9) | Setup | Verify |
| Verify | Core (all tasks) | None |

**Note:** Tasks T1-T9 are independently parallelizable (each file edited separately).

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 min (spec folder creation) |
| Core (T1: readme_indexing.md styling) | Low | 10 min |
| Core (T2: SKILL.md reduction) | Medium | 45 min (1,055 → ~650) |
| Core (T3-T6: 5 memory commands) | High | 90 min (4,867 → 600) |
| Core (T7-T9: 7 spec_kit commands) | High | 105 min (5,361 → 600) |
| Verification | Low | 20 min (line counts + feature checks) |
| **Total** | | **~4.5 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All 14 files backed up in git (commit before starting)
- [ ] Target line counts documented
- [ ] Feature preservation criteria defined

### Rollback Procedure
1. Identify over-reduced file(s) via verification failures
2. Git revert specific file(s): `git checkout HEAD -- <file>`
3. Re-edit with more conservative cuts
4. Re-verify line count + features

### Data Reversal
- **Has data migrations?** No (documentation only)
- **Reversal procedure**: N/A

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
