---
title: "Bug Fixes Implementation Plan"
status: in-progress
---

# Bug Fixes Implementation Plan

## Overview

Implement fixes in three tiers, with each tier building on the previous.

## Tier 1: Critical Bug Fixes (1-2 hours)

### Task 1.1: Create debugging_checklist.md
- **File:** `assets/debugging_checklist.md`
- **Content:** ~60 items from recommendations-report.md Section 6.2
- **Sections:** Issue Capture, Scope Assessment, Evidence Gathering, Hypothesis, Stack-Specific (5 stacks), Resolution, Verification

### Task 1.2: Create verification_checklist.md
- **File:** `assets/verification_checklist.md`
- **Content:** ~50 items from recommendations-report.md Section 6.2
- **Sections:** Code Quality, Testing, Stack-Specific (5 stacks), Security, Documentation, Final Checks, Verification Statement

### Task 1.3: Fix SKILL.md frontmatter
- **File:** `SKILL.md`
- **Add:** `globs` and `alwaysApply` fields
- **Update:** version to 5.0.0

### Task 1.4: Sync stack_detection.md
- **File:** `references/common/stack_detection.md`
- **Fix M12:** Change lowercase output to uppercase (GO_BACKEND, etc.)
- **Fix M13:** Add DEVOPS detection
- **Fix M14:** Add `2>/dev/null` error suppression

## Tier 2: Link Fixes (2-3 hours)

### Task 2.1: Fix old paths (M1-M5)
Update `.opencode/knowledge/` to relative paths in:
- `references/postgres-backup-system/architecture.md`
- `references/postgres-backup-system/project_rules.md`
- `assets/postgres-backup-system/api_reference.md`
- `assets/postgres-backup-system/deployment.md`
- `assets/postgres-backup-system/development_guide.md`

### Task 2.2: Fix cross-references (M6-M11)
Update refs↔assets links in:
- `references/fe-partners-app/api-patterns.md`
- `references/fe-partners-app/component-architecture.md`
- `assets/fe-partners-app/form-patterns.md`
- `assets/backend-system/README_CRON_TRACKING.md`

## Tier 3: Smart Router Enhancements (2-3 hours)

### Task 3.1: Add resource priority
- Add P1/P2/P3 classification to SKILL.md registry
- Update route_resources() to use priority levels

### Task 3.2: Add task-aware loading
- Add keyword matching for P2 files
- Implement task classification logic

### Task 3.3: Add fallback logic
- Add else clause to Phase 2 routing
- Add else clause to Phase 3 routing

## Execution Order

```
Tier 1 (Critical) ──► Tier 2 (Links) ──► Tier 3 (Enhancements)
     │                    │                    │
     ▼                    ▼                    ▼
  1.1 debugging_checklist  2.1 old paths       3.1 priority
  1.2 verification_checklist 2.2 cross-refs    3.2 task-aware
  1.3 frontmatter                              3.3 fallback
  1.4 stack_detection
```

## Verification

After each tier:
1. Run validation tests from recommendations-report.md Section 7
2. Verify no broken links
3. Test detection for each repository type
