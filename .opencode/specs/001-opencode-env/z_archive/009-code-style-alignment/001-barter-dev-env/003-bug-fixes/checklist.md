---
title: "Bug Fixes Checklist"
status: complete
---

# Bug Fixes Checklist

## P0 - Critical Bug Fixes (Tier 1) - COMPLETE

### C1: Create debugging_checklist.md
- [x] Create file at `assets/debugging_checklist.md`
- [x] Add Issue Capture section (~7 items)
- [x] Add Scope Assessment section (~5 items)
- [x] Add Evidence Gathering section (~7 items)
- [x] Add Hypothesis Formation section (~5 items)
- [x] Add Hypothesis Testing section (~5 items)
- [x] Add Stack-Specific sections (5 stacks × ~7 items)
- [x] Add Resolution section (~7 items)
- [x] Add Verification section (~5 items)
- [x] Add Post-Resolution section (~4 items)
- [x] Verify total ~60 items

### C2: Create verification_checklist.md
- [x] Create file at `assets/verification_checklist.md`
- [x] Add Code Quality section (~8 items)
- [x] Add Testing section (~6 items)
- [x] Add Stack-Specific sections (5 stacks × ~5 items)
- [x] Add Security section (~7 items)
- [x] Add Documentation section (~5 items)
- [x] Add Final Checks section (~6 items)
- [x] Add Verification Statement template
- [x] Verify total ~50 items

### M15: Fix SKILL.md frontmatter
- [x] Add `globs: ["**/*.go", "**/*.ts", "**/*.tsx", "**/*.py", "**/*.js"]`
- [x] Add `alwaysApply: false`
- [x] Update version to 5.0.0

### M12-M14: Sync stack_detection.md
- [x] M12: Change `go-backend` to `GO_BACKEND`
- [x] M12: Change `angular` to `ANGULAR`
- [x] M12: Change `expo` to `EXPO`
- [x] M12: Change `python` to `PYTHON`
- [x] M13: Add DEVOPS detection pattern
- [x] M14: Add `2>/dev/null` to expo detection

## P1 - Link Fixes (Tier 2) - COMPLETE

### M1-M5: Fix old paths
- [x] M1: `references/postgres-backup-system/architecture.md`
- [x] M2: `references/postgres-backup-system/project_rules.md`
- [x] M3: `assets/postgres-backup-system/api_reference.md`
- [x] M4: `assets/postgres-backup-system/deployment.md`
- [x] M5: `assets/postgres-backup-system/development_guide.md`

### M6-M11: Fix cross-references
- [x] M6: `references/fe-partners-app/api-patterns.md` → form-patterns.md
- [x] M7: `references/fe-partners-app/component-architecture.md` → form-patterns.md
- [x] M8: `assets/fe-partners-app/form-patterns.md` → api-patterns.md
- [x] M9: `assets/fe-partners-app/form-patterns.md` → component-architecture.md
- [x] M10: `assets/backend-system/README_CRON_TRACKING.md` → cron_execution_tracking.md
- [x] M11: `assets/backend-system/README_CRON_TRACKING.md` → remove or fix cron_tracking_quick_reference.md

## P2 - Smart Router Enhancements (Tier 3)

### Resource Priority System
- [ ] Add P1/P2/P3 classification to registry
- [ ] Document priority levels in SKILL.md
- [ ] Update route_resources() for priority

### Task-Aware Loading
- [ ] Add keyword lists to P2 files
- [ ] Implement task classification
- [ ] Test keyword matching

### Fallback Logic
- [ ] Add Phase 2 fallback (else clause)
- [ ] Add Phase 3 fallback (else clause)
- [ ] Test unknown stack handling

---

## Verification Tests

### Detection Tests
- [ ] D1: Go project (go.mod) → backend-system
- [ ] D2: Angular project (angular.json) → fe-partners-app
- [ ] D3: Expo project (app.json + expo) → barter-expo
- [ ] D4: Python project (requirements.txt + flask) → gaia-services
- [ ] D5: DevOps project (Makefile + pg_dump) → postgres-backup-system

### Link Tests
- [ ] No broken internal links in references/
- [ ] No broken internal links in assets/
- [ ] All cross-folder links use correct paths

---

## Sign-Off

| Tier | Status | Date |
|------|--------|------|
| Tier 1 (Critical) | ✅ Complete | 2024-12-31 |
| Tier 2 (Links) | ✅ Complete | 2024-12-31 |
| Tier 3 (Enhancements) | ⏳ Pending | - |
