---
title: Validation Checklist - Knowledge Migration
description: P0/P1/P2 validation checklist for knowledge migration
level: 3
status: in_progress
created: 2024-12-31
---

# Validation Checklist - Knowledge Migration

## P0 - HARD BLOCKERS (Must Complete)

### Structure Verification
- [x] `references/common/` folder exists
- [x] `references/backend-system/` folder exists
- [x] `references/fe-partners-app/` folder exists
- [x] `references/barter-expo/` folder exists
- [x] `references/gaia-services/` folder exists
- [x] `references/postgres-backup-system/` folder exists

### Content Migration
- [x] `common/stack_detection.md` exists
- [x] `backend-system/` contains 17 files
- [x] `fe-partners-app/` contains 9 files
- [x] `barter-expo/` contains 7 files
- [x] `gaia-services/` contains 6 files
- [x] `postgres-backup-system/` contains 6 files

### SKILL.md Updates
- [x] STACK_TO_FOLDER mapping added
- [x] route_resources() uses `references/{folder}/` paths
- [x] No `.opencode/knowledge/` references remain (verified: 0 occurrences)
- [x] REDIRECT.md removed

---

## P1 - Must Complete OR User-Approved Deferral

### File Integrity
- [ ] All migrated files readable (no corruption)
- [ ] File sizes match originals
- [ ] No duplicate files in wrong locations

### Stack Detection
- [ ] GO_BACKEND maps to `backend-system`
- [ ] ANGULAR maps to `fe-partners-app`
- [ ] EXPO maps to `barter-expo`
- [ ] REACT_NATIVE maps to `barter-expo`
- [ ] PYTHON maps to `gaia-services`
- [ ] DEVOPS detection added for `postgres-backup-system`

### Documentation
- [ ] SKILL.md internal documentation updated
- [ ] Resource paths documented in route function

---

## P2 - Can Defer Without Approval

### Optimization
- [ ] Consider adding README.md to each subfolder
- [ ] Consider alphabetizing file references in SKILL.md
- [ ] Consider adding file count comments

### Cleanup (Original Files)
- [ ] Document that `repositories/*/knowledge/` kept as backup
- [ ] Consider future cleanup task for removing originals

### Testing
- [ ] Manual test with Go project
- [ ] Manual test with Angular project
- [ ] Manual test with React Native project
- [ ] Manual test with Python project
- [ ] Manual test with DevOps project

---

## Verification Commands

```bash
# Check folder structure
ls -la "$SKILL_REF/"

# Count files per folder
for dir in common backend-system fe-partners-app barter-expo gaia-services postgres-backup-system; do
  echo "$dir: $(ls -1 "$SKILL_REF/$dir" 2>/dev/null | wc -l) files"
done

# Verify no .opencode/knowledge references in SKILL.md
grep -c ".opencode/knowledge" SKILL.md  # Should be 0

# Verify REDIRECT.md removed
ls "$SKILL_REF/REDIRECT.md" 2>/dev/null && echo "REDIRECT.md still exists!" || echo "REDIRECT.md removed"
```

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| P0 Complete | Claude | 2024-12-31 |
| P1 Complete | Pending manual testing | |
| P2 Deferred/Complete | Deferred | |
