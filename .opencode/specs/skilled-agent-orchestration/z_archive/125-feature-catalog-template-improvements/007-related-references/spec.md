---
title: "Phase 007: Related References — All Skills"
description: "Script-driven: add 'Related references:' prev/next links to SOURCE METADATA in all 315 snippets currently missing them. Link titles sourced from frontmatter — no AI judgment needed."
importance_tier: "normal"
contextType: "general"
---
# Phase 007: Related References — All Skills

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 007 |
| **Status** | Planned |
| **Method** | Python script (mostly automated) |
| **Prerequisite** | Phase 002 complete |
| **Skill targets** | All three skills |

---

## 2. PROBLEM & PURPOSE

315 of 366 snippets lack `Related references:` in SOURCE METADATA, making it hard to navigate within a category without returning to the root catalog. Each snippet should link to its immediate neighbors (previous and next file in the same category directory, sorted by filename).

---

## 3. SCOPE

### Target
All snippet files lacking `Related references:` across all three skills (~315 files).

### Link format
```markdown
Related references:
- [NN-prev-feature.md](NN-prev-feature.md) — {prev frontmatter title}
- [NN-next-feature.md](NN-next-feature.md) — {next frontmatter title}
```

### Edge cases
| Situation | Handling |
|---|---|
| First file in category (no prev) | Only next link |
| Last file in category (no next) | Only prev link |
| Only file in category | Omit Related references entirely |
| File already has Related references | Skip (idempotent) |

---

## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | All multi-file categories have related references | `grep -rL "Related references" */feature_catalog/*/*.md` returns only singleton categories |
| R-002 | Links use relative paths within the category | No absolute paths, no cross-category links |
| R-003 | Link text is the neighbor's frontmatter title | Title field used, not the filename slug |
| R-004 | Script is idempotent | Re-running adds nothing if already present |

---

## 5. SUCCESS CRITERIA

- All snippets in multi-file categories have `Related references:` in SOURCE METADATA
- Link text matches the neighboring file's `title` frontmatter value
- Zero broken relative links (prev/next files all exist)
