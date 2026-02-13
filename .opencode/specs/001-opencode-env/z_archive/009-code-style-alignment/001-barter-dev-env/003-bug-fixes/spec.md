---
title: "Barter workflows-code Bug Fixes & Smart Router Implementation"
status: in-progress
created: 2024-12-31
level: 3
parent: 002-bug-analysis
---

# Barter workflows-code Bug Fixes & Smart Router Implementation

## Objective

Implement the bug fixes and smart router enhancements identified in `002-bug-analysis/`.

## Scope

### In Scope
- Tier 1: Critical bug fixes (missing assets, frontmatter, sync)
- Tier 2: Medium bug fixes (broken links, old paths)
- Tier 3: Smart router enhancements (priority system, task-aware loading)

### Out of Scope
- Changes to original developer logic/design decisions
- Content quality improvements
- Low priority bugs (typos, deprecated APIs) - deferred

## Bug Summary (from 002-bug-analysis)

| Severity | Count | This Spec |
|----------|-------|-----------|
| 🔴 Critical | 2 | ✅ Fix all |
| 🟠 Medium | 15 | ✅ Fix all |
| 🟡 Low | 5 | ⏸️ Deferred |

## Implementation Tiers

### Tier 1: Critical Bug Fixes (1-2 hours)
- [ ] C1: Create `assets/debugging_checklist.md` (~60 items)
- [ ] C2: Create `assets/verification_checklist.md` (~50 items)
- [ ] M15: Add missing frontmatter fields to SKILL.md
- [ ] M12-M14: Sync stack_detection.md with SKILL.md

### Tier 2: Link Fixes (2-3 hours)
- [ ] M1-M5: Update old `.opencode/knowledge/` paths
- [ ] M6-M11: Fix cross-references between refs↔assets

### Tier 3: Smart Router Enhancements (2-3 hours)
- [ ] Add resource priority system (P1/P2/P3)
- [ ] Add task-aware keyword matching
- [ ] Add Phase 2/3 fallback logic
- [ ] Add detection confidence reporting

## Success Criteria

- [ ] All critical bugs (C1, C2) resolved
- [ ] All medium bugs (M1-M15) resolved
- [ ] SKILL.md version updated to 5.0.0
- [ ] All verification tests pass
- [ ] No broken internal links

## Related Specs

| Spec | Relationship |
|------|--------------|
| `002-bug-analysis/` | Source of bug inventory and recommendations |
| `001-initial-setup/` | Original migration that created structure |
