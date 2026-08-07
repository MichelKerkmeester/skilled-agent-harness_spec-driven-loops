---
title: "Plan: Phase 008 — Master Catalog Enrichment"
description: "Execution plan for enriching the 3 master feature_catalog.md files with trigger_phrases and last_updated."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 008 — Master Catalog Enrichment

---

## 1. APPROACH

Three targeted file edits. Each master catalog is large (spec-kit is 4,715 lines) but only the frontmatter block needs updating — no need to read the full file content for this phase.

---

## 2. EDITS PER FILE

### system-spec-kit/feature_catalog/feature_catalog.md

Current frontmatter:
```yaml
---
title: "Spec Kit Memory: Feature Catalog"
description: "..."
---
```

Target frontmatter:
```yaml
---
title: "Spec Kit Memory: Feature Catalog"
description: "..."
trigger_phrases:
  - "spec kit memory feature catalog"
  - "spec kit memory features"
  - "spec kit MCP feature inventory"
  - "what does spec kit memory do"
  - "memory MCP feature catalog"
last_updated: "2026-05-31"
---
```

### system-skill-advisor/feature_catalog/feature_catalog.md

Target additions:
```yaml
trigger_phrases:
  - "skill advisor feature catalog"
  - "skill advisor features"
  - "advisor MCP feature inventory"
  - "what does skill advisor do"
last_updated: "2026-05-31"
```

### system-code-graph/feature_catalog/feature_catalog.md

Target additions:
```yaml
trigger_phrases:
  - "code graph feature catalog"
  - "code graph features"
  - "code index MCP feature inventory"
  - "what does code graph do"
last_updated: "2026-05-31"
```

---

## 3. EXECUTION ORDER

```
1. Edit system-skill-advisor master catalog (smallest — 136 lines)
2. Edit system-code-graph master catalog (277 lines)
3. Edit system-spec-kit master catalog (4,715 lines — only edit frontmatter)
4. Scan all 3 for 'FEATURE_CATALOG.md' uppercase → fix if found
5. git diff --stat → verify only frontmatter changed
6. Commit: "chore(125-008): add trigger_phrases + last_updated to master catalogs"
```

---

## 4. VERIFICATION

```bash
# All 3 master catalogs have trigger_phrases
grep -l "trigger_phrases:" \
  .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md \
  .opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md \
  .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md | wc -l
# Expected: 3

# No uppercase FEATURE_CATALOG.md remaining
grep -r "FEATURE_CATALOG\.md" \
  .opencode/skills/system-spec-kit/feature_catalog/ \
  .opencode/skills/system-skill-advisor/feature_catalog/ \
  .opencode/skills/system-code-graph/feature_catalog/ | wc -l
# Expected: 0
```
