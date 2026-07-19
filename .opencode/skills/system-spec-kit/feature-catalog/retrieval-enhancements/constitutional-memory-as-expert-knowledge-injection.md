---
title: "Constitutional memory as expert knowledge injection"
description: "Constitutional-tier memories receive retrieval directive metadata that instructs the LLM when to surface them."
trigger_phrases:
  - "constitutional memory expert knowledge injection"
  - "retrieval directive"
  - "constitutional-tier memories"
  - "retrieval_directive metadata"
  - "always-surface memory rules"
version: 3.6.0.13
---

# Constitutional memory as expert knowledge injection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Constitutional-tier memories receive retrieval directive metadata that instructs the LLM when to surface them.

Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."

---

## 2. HOW IT WORKS

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.

In the Stage 1 injection path, constitutional rows now use `shouldApplyScopeFiltering` rather than `hasGovernanceScope` alone before merge. This means injected constitutional results honor global scope-enforcement rollout as well as caller-provided governance scope, preventing deny-by-default tenants from receiving out-of-scope constitutional rows.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval directive enrichment |
| `mcp-server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1 constitutional candidate injection with scope filtering |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/retrieval-directives.vitest.ts` | Automated test | Retrieval directive tests |
| `mcp-server/tests/stage1-expansion.vitest.ts` | Automated test | Stage 1 constitutional scope filtering before merge |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval-enhancements/constitutional-memory-as-expert-knowledge-injection.md`
Related references:
- [dual-scope-memory-auto-surface.md](../../feature-catalog/retrieval-enhancements/dual-scope-memory-auto-surface.md) — Dual-scope memory auto-surface
- [spec-folder-hierarchy-as-retrieval-structure.md](../../feature-catalog/retrieval-enhancements/spec-folder-hierarchy-as-retrieval-structure.md) — Spec folder hierarchy as retrieval structure
