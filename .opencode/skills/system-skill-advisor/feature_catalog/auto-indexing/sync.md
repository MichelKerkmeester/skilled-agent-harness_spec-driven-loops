---
title: "Graph-Metadata Derived Sync"
description: "Write pipeline that persists derived extraction into graph-metadata.json.derived without ever mutating SKILL.md."
trigger_phrases:
  - "derived sync"
  - "graph-metadata write"
  - "derived.json write"
  - "sync derived block"
version: 0.8.0.13
---

# Graph-Metadata Derived Sync

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Persist derived extraction so the scorer and rebuild-from-source pipeline can both consume it, while keeping the source-of-truth SKILL.md untouched.

## 2. HOW IT WORKS

`lib/derived/sync.ts` takes the output of `lib/derived/extract.ts`, routes it through `lib/derived/sanitizer.ts` and writes only the `derived` block of each skill's `graph-metadata.json`. Non-derived metadata in the same file is preserved byte-for-byte. Partial writes are avoided by writing through a temp file plus atomic rename. SKILL.md is never touched.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/sync.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/sanitizer.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | sync correctness and non-derived preservation |
| `Playbook scenario [AI-001](../../manual_testing_playbook/auto-indexing/derived-extraction.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `auto-indexing/sync.md`

Related references:

- [01-derived-extraction.md](./derived-extraction.md).
- [02-sanitizer.md](./sanitizer.md).
- [`daemon-and-freshness/rebuild-from-source.md`](../daemon-and-freshness/rebuild-from-source.md).
