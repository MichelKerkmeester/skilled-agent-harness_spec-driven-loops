---
title: Deep Review Resource Map - gpt55r2-a-6
description: Files and evidence touched during the one-iteration search/retrieval review lineage.
trigger_phrases:
  - "gpt55r2-a-6 resource map"
  - "search retrieval folder boost evidence"
importance_tier: normal
contextType: general
---

# Resource Map - gpt55r2-a-6

## Scope Source

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:1-18` - Declares search/retrieval audit scope and numeric correctness emphasis.

## Files Touched For Evidence

| File | Purpose | Finding Link |
|------|---------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Folder boost ranking implementation and call site. | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Documents raw search result similarity as 0-100 scale. | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | Canonical score fallback normalizes similarity by `/100`. | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Emits semantic summary similarity as `sr.similarity * 100`. | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/openltm-retrieval-observability.vitest.ts` | Existing test covers folder boost only with 0-1 similarity inputs. | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts` | Checked boundedness/cancellation path called out by scope. | Clean surface |

## Evidence Summary

- Active P1: `applyFolderBoostRanking` caps boosted similarity at `1.0` even though surrounding contracts and producers use 0-100 similarity.
- Clean surface: trigger embedding backfill is default-off, chunks phrase sync, yields between chunks, limits pending embedding generation, and checks cancellation before both main loops.

## Coverage Gaps

- This lineage performed one iteration only; security, traceability, and maintainability were not exhaustive.
- Code graph was stale, so structural graph relationships were not trusted for this lineage.
