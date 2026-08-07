---
title: "Phase 008: Master Catalog Enrichment — All Skills"
description: "Add trigger_phrases and last_updated to all 3 master feature_catalog.md files. Fix any remaining stale references. Small scope — 3 files, AI edits."
importance_tier: "normal"
contextType: "general"
---
# Phase 008: Master Catalog Enrichment — All Skills

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 008 |
| **Status** | Planned |
| **Method** | AI edits (3 files) |
| **Prerequisite** | Phase 002 complete |
| **Skill targets** | All three skills (master catalogs only) |

---

## 2. SCOPE

### Target files (3 total)
```
system-spec-kit/feature_catalog/feature_catalog.md     (4,715 lines)
system-skill-advisor/feature_catalog/feature_catalog.md  (136 lines)
system-code-graph/feature_catalog/feature_catalog.md     (277 lines)
```

### Operations per file
1. Add `trigger_phrases:` block to frontmatter (3-5 skill-level phrases)
2. Add `last_updated: "2026-05-31"` to frontmatter
3. Scan body for `FEATURE_CATALOG.md` (uppercase) references → fix to lowercase
4. Verify frontmatter has `title` and `description` (already present)

---

## 3. TRIGGER PHRASE GUIDELINES

Master catalog trigger phrases represent the skill as a whole, not individual features:

| Skill | Suggested trigger phrases |
|---|---|
| system-spec-kit | "spec kit memory feature catalog", "spec kit memory features", "spec kit memory MCP features", "what does spec kit memory do", "spec kit feature inventory" |
| system-skill-advisor | "skill advisor feature catalog", "skill advisor features", "advisor MCP features", "what does skill advisor do" |
| system-code-graph | "code graph feature catalog", "code graph features", "code index MCP features", "what does code graph do" |

---

## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | All 3 master catalogs have `trigger_phrases:` | grep finds it in all 3 |
| R-002 | All 3 have `last_updated:` | grep finds it in all 3 |
| R-003 | No uppercase `FEATURE_CATALOG.md` in body | grep returns 0 |
| R-004 | Body content unchanged | git diff shows only frontmatter additions |

---

## 5. SUCCESS CRITERIA

- 3 master catalogs have `trigger_phrases:`, `last_updated:`, lowercase filename references
- No body prose changed
