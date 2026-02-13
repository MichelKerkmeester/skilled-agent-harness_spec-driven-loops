---
title: Barter Knowledge Migration to Skill Subfolders
description: Migrate knowledge from repositories/ symlink pattern to bundled skill subfolders
level: 3
status: completed
created: 2024-12-31
updated: 2024-12-31
---

# Barter Knowledge Migration to Skill Subfolders

## 1. OBJECTIVE

Migrate stack-specific knowledge from the external `repositories/*/knowledge/` symlink pattern into bundled subfolders within the `workflows-code` skill, fixing the broken skill calling mechanism.

## 2. PROBLEM STATEMENT

### Current Architecture (Broken)

```
workflows-code/
├── SKILL.md
└── references/
    └── REDIRECT.md  → "Go look at .opencode/knowledge/"

.opencode/knowledge/ → SYMLINK → $BARTER_AI_SPECKIT/repositories/{project}/knowledge/
```

**Why This Breaks Skill Calling:**
1. Skills expect resources to be **BUNDLED** at relative paths (`references/*.md`)
2. The REDIRECT pattern points to EXTERNAL paths outside the skill
3. Symlinks require environment setup (`BARTER_AI_SPECKIT`)
4. OpenCode skill loading doesn't understand external path redirects
5. The skill is not portable or self-contained

### Target Architecture (Fixed)

```
workflows-code/
├── SKILL.md                        # Enhanced with subfolder routing
└── references/
    ├── common/                     # Universal patterns
    ├── backend-system/             # Go knowledge (17 files)
    ├── fe-partners-app/            # Angular knowledge (9 files)
    ├── barter-expo/                # React Native knowledge (7 files)
    ├── gaia-services/              # Python knowledge (6 files)
    └── postgres-backup-system/     # DevOps knowledge (6 files)
```

**Why This Works:**
1. All resources BUNDLED inside skill folder
2. SKILL.md uses relative paths (`references/backend-system/go_standards.md`)
3. No external dependencies or symlinks required
4. Skill is self-contained and portable
5. Stack detection maps to subfolder names

## 3. SCOPE

### In Scope
- Create subfolder structure in `workflows-code/references/`
- Migrate 45 knowledge files from `repositories/*/knowledge/`
- Move existing universal content to `references/common/`
- Update SKILL.md route function with new paths
- Remove REDIRECT.md
- Update stack detection to map to folder names

### Out of Scope
- Modifying `repositories/*/specs/` (keep project-specific specs separate)
- Creating new Python/Flask content (keep existing stubs)
- Changes to other skills
- Changes to AGENTS.md routing (separate task)
- Deleting original knowledge files in repositories/ (keep as backup)

## 4. SUCCESS CRITERIA

- [x] All 5 subfolders created with correct names
- [x] All 45 knowledge files migrated (46 total including common/)
- [x] Existing content moved to `common/`
- [x] SKILL.md updated with new route function (v4.0.0)
- [x] REDIRECT.md removed
- [x] Stack detection maps correctly to folder names
- [ ] Skill can be loaded and resources accessed (pending manual test)

## 5. CONTENT INVENTORY

| Source | Target | Files | Size |
|--------|--------|-------|------|
| `repositories/backend-system/knowledge/` | `references/backend-system/` | 17 | 298 KB |
| `repositories/fe-partners-app/knowledge/` | `references/fe-partners-app/` | 9 | 176 KB |
| `repositories/barter-expo/knowledge/` | `references/barter-expo/` | 7 | 141 KB |
| `repositories/gaia-services/legacy-knowledge/` | `references/gaia-services/` | 6 | 1 KB |
| `repositories/postgres-backup-system/knowledge/` | `references/postgres-backup-system/` | 6 | 59 KB |
| Existing `references/` content | `references/common/` | 2 | ~15 KB |

**Total:** 47 files, ~690 KB
