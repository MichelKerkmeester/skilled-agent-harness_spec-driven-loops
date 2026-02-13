---
title: Task Breakdown - Knowledge Migration
description: Detailed task breakdown for migrating knowledge to skill subfolders
level: 3
status: in_progress
created: 2024-12-31
---

# Task Breakdown - Knowledge Migration

## User Stories

### US-1: As a developer, I want knowledge bundled in the skill so it loads reliably

**Tasks:**

| ID | Task | Estimate | Status |
|----|------|----------|--------|
| 1.1 | Create `references/common/` subfolder | 1 min | Pending |
| 1.2 | Create `references/backend-system/` subfolder | 1 min | Pending |
| 1.3 | Create `references/fe-partners-app/` subfolder | 1 min | Pending |
| 1.4 | Create `references/barter-expo/` subfolder | 1 min | Pending |
| 1.5 | Create `references/gaia-services/` subfolder | 1 min | Pending |
| 1.6 | Create `references/postgres-backup-system/` subfolder | 1 min | Pending |

### US-2: As a developer, I want all existing knowledge migrated to new structure

**Tasks:**

| ID | Task | Estimate | Status |
|----|------|----------|--------|
| 2.1 | Move `stack_detection.md` to `common/` | 1 min | Pending |
| 2.2 | Copy backend-system knowledge (17 files) | 2 min | Pending |
| 2.3 | Copy fe-partners-app knowledge (9 files) | 1 min | Pending |
| 2.4 | Copy barter-expo knowledge (7 files) | 1 min | Pending |
| 2.5 | Copy gaia-services knowledge (6 files) | 1 min | Pending |
| 2.6 | Copy postgres-backup-system knowledge (6 files) | 1 min | Pending |

### US-3: As a developer, I want SKILL.md to use bundled resources

**Tasks:**

| ID | Task | Estimate | Status |
|----|------|----------|--------|
| 3.1 | Add STACK_TO_FOLDER mapping | 5 min | Pending |
| 3.2 | Update route_resources() function | 10 min | Pending |
| 3.3 | Replace all .opencode/knowledge/ references | 10 min | Pending |
| 3.4 | Update resource loading examples | 5 min | Pending |

### US-4: As a developer, I want obsolete files removed

**Tasks:**

| ID | Task | Estimate | Status |
|----|------|----------|--------|
| 4.1 | Delete REDIRECT.md | 1 min | Pending |
| 4.2 | Verify no broken references | 5 min | Pending |

### US-5: As a developer, I want the migration verified

**Tasks:**

| ID | Task | Estimate | Status |
|----|------|----------|--------|
| 5.1 | Verify file counts per folder | 2 min | Pending |
| 5.2 | Verify SKILL.md syntax | 2 min | Pending |
| 5.3 | Test skill loading | 5 min | Pending |

---

## Dependencies

```
1.1-1.6 (Create folders)
    │
    └──► 2.1-2.6 (Copy files)
              │
              └──► 3.1-3.4 (Update SKILL.md)
                        │
                        └──► 4.1-4.2 (Cleanup)
                                  │
                                  └──► 5.1-5.3 (Verify)
```

## Summary

| Category | Tasks | Est. Time |
|----------|-------|-----------|
| Create Structure | 6 | 6 min |
| Migrate Files | 6 | 7 min |
| Update SKILL.md | 4 | 30 min |
| Cleanup | 2 | 6 min |
| Verification | 3 | 9 min |
| **Total** | **21** | **~58 min** |
