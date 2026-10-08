---
title: "Implementation Plan: Fold one-off repairs"
description: "Clarify fill-frontmatter value-source order, add grouped-detail reporting in upgrade-legacy, and retire one-off scripts by folding logic into permanent tools."
trigger_phrases:
  - "fold one off repairs plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fold one-off repairs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, Node.js 22+, TypeScript |
| **Framework** | Vitest for tests, Bash for scripts |
| **Testing** | Vitest unit and integration tests |

### Overview
Fold remaining one-off repair logic (add-fm-fields.mjs logic, not in repo) into permanent tools by clarifying frontmatter value-source order (template literal per class first), adding grouped-detail reporting in upgrade-legacy to show failures by rule, and ensuring all repair steps are idempotent. Phase 15 already replaced fix-specfolder.mjs with repair-derived.cjs in archive.sh.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Frontmatter value-source order documented
- [ ] Grouped-detail report format approved
- [ ] One-off scripts identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Docs updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Consolidation into permanent tools. Replace batch-script logic with standard repair pipeline steps.

### Key Components
- **fillMissingFrontmatter** in upgrade-legacy.mjs: respects document class, template literal first
- **Grouped-detail report** in upgrade-legacy.mjs: groups failures by rule and counts details
- **Archive description generator** call: verifies Phase 15 integration

### Data Flow
1. Packet arrives at upgrade-legacy validation step
2. Frontmatter fill runs per document class (template literal source takes precedence)
3. Validation collects failures
4. Grouped-detail report groups by rule and shows counts
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fillMissingFrontmatter` in frontmatter-migration.ts | Fills missing frontmatter | Ensure template literal per class is primary source | Code inspection and test |
| Document class templates | Define default values per class | Verify templates define class values correctly | grep for DOC_DEFAULT fields in frontmatter-migration.ts |
| Grouped-detail report output format | Reports failures grouped by rule | Implement "### folder / x RULE" format with counts | New test in upgrade-legacy.vitest.ts |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Frontmatter fill per class, grouped-detail output | Vitest |
| Integration | Upgrade-legacy with fill and report | Vitest with real packets |
| Manual | Archive re-derive, spec.md copy behavior | Real packet archive/restore |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SH-11 anchor repair mode | Internal | Being planned | Does not block this phase |
| Node.js 22+ | External | Available | Tests require Node environment |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests fail on value-source order or grouped-detail format.
- **Procedure**: Revert commits, which only change tool logic and tests. No data changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Document class audit ──────┐
                           ├──► Implement changes ──► Test ──► Verify
Grouped-detail design ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Implement |
| Implement | Audit | Test |
| Test | Implement | Verify |
| Verify | Test | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit and design | Low | 1-2 hours |
| Implementation | Medium | 2-3 hours |
| Testing | Medium | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **6-9 hours** |
<!-- /ANCHOR:effort -->

---
