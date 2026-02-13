---
title: "Barter workflows-code Bug Analysis & Smart Router Design"
status: completed
created: 2024-12-31
updated: 2024-12-31
level: 3
---

# Barter workflows-code Bug Analysis & Smart Router Design

## Objective

Comprehensive bug analysis of the workflows-code skill in the Barter Development Environment, followed by design of an optimized smart router for efficient multi-repository orchestration.

## Scope

### In Scope
- Bug identification in SKILL.md and all 46 bundled resources
- Analysis of routing logic for 5 repositories
- Design of smart task-aware resource loading
- Comprehensive debugging and verification checklists

### Out of Scope
- Actual bug fixes (separate spec: `003-bug-fixes/`)
- Changes to original developer logic/design decisions
- Content quality improvements (only structural bugs)

## Context

The workflows-code skill serves 5 different repositories:

| Repository | Stack | References | Assets | Total Files |
|------------|-------|------------|--------|-------------|
| backend-system | Go | 15 | 2 | 17 |
| fe-partners-app | Angular | 5 | 4 | 9 |
| barter-expo | React Native | 6 | 1 | 7 |
| gaia-services | Python | 6 (stubs) | 0 | 6 |
| postgres-backup-system | DevOps | 3 | 3 | 6 |
| **common** | Universal | 1 | 2 (missing) | 1 |
| **Total** | - | 36 | 10 | **46** |

## Bug Summary

### By Severity

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 2 | Missing universal assets (blocks Phase 2/3) |
| 🟠 Medium | 15 | Broken links, old paths, detection drift |
| 🟡 Low | 5 | Typos, deprecated APIs, formatting |
| **Total** | **22** | |

### Critical Bugs (Must Fix)

| ID | Bug | Location | Impact |
|----|-----|----------|--------|
| C1 | Missing `debugging_checklist.md` | `assets/` | Phase 2 workflow broken |
| C2 | Missing `verification_checklist.md` | `assets/` | Phase 3 workflow broken |

### Medium Bugs (Should Fix)

| ID | Bug | Category |
|----|-----|----------|
| M1-M5 | Old `.opencode/knowledge/` paths | Migration artifact |
| M6-M11 | Broken cross-references (refs↔assets) | Split artifact |
| M12-M14 | Stack detection drift | Logic drift |
| M15 | Missing frontmatter fields | Incomplete |

### Low Bugs (Nice to Fix)

| ID | Bug | Location |
|----|-----|----------|
| L1 | Typo "envrionment" | expo-patterns.md |
| L2 | Date subtraction syntax | performance-optimization.md |
| L3 | Missing FlashList prop | performance-optimization.md |
| L4 | Lowercase headings | gaia-services stubs |
| L5 | Deprecated K8s API | deployment.md |

### Root Causes

| # | Root Cause | Bugs Caused |
|---|------------|-------------|
| 1 | Incomplete skill development | C1, C2 |
| 2 | Migration without link updates | M1-M5 |
| 3 | Reference/Asset split without cross-ref updates | M6-M11 |
| 4 | Duplicated logic without sync | M12-M14 |

## Recommendations Summary

### Smart Router Design

| Feature | Current | Proposed |
|---------|---------|----------|
| Resource loading | Load all (~15K tokens) | Task-aware P1/P2/P3 (~3-5K tokens) |
| Detection | Single strategy | Multi-strategy with confidence |
| Task classification | Phase-based only | Keyword-based task types |
| Checklists | Missing | 60+ items (debugging), 50+ items (verification) |

### Implementation Tiers

| Tier | Effort | Tasks |
|------|--------|-------|
| **Tier 1** | 1-2 hours | Create missing assets, fix frontmatter |
| **Tier 2** | 4-6 hours | Add priority system, fix all links |
| **Tier 3** | Future | Git detection, token tracking, lazy loading |

## Deliverables

| Deliverable | Status | Description |
|-------------|--------|-------------|
| `analysis-report.md` | ✅ Complete | Full bug inventory with evidence |
| `recommendations-report.md` | ✅ Complete (v2.0) | Smart router design (~950 lines) |
| `checklist.md` | ✅ Complete | All bugs tracked |
| `plan.md` | ✅ Complete | Methodology and timeline |

## Success Criteria

- [x] All 22 bugs documented with severity, location, and evidence
- [x] 4 root causes identified
- [x] Smart router architecture designed
- [x] Resource priority system (P1/P2/P3) defined
- [x] Comprehensive checklists designed (60+ and 50+ items)
- [x] Implementation roadmap with 3 tiers defined
- [x] Context management strategy documented
- [x] Validation test cases defined
- [x] Troubleshooting guide created

## Related Specs

| Spec | Relationship |
|------|--------------|
| `001-initial-setup/` | Migration that created current structure |
| `003-bug-fixes/` (future) | Implementation of fixes |
