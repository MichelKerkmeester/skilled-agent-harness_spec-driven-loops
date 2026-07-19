---
title: "Deterministic Derived Extraction"
description: "Deterministic n-gram and pattern extraction pipeline that generates graph-metadata.json.derived entries from SKILL.md sources."
trigger_phrases:
  - "derived extraction"
  - "n-gram extraction"
  - "graph-metadata derived"
  - "deterministic extraction"
version: 0.8.0.13
---

# Deterministic Derived Extraction

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Automatically generate routing-ready derived entries for every skill without hand-written routing metadata. Extraction stays deterministic so identical sources always produce identical derived output.

## 2. HOW IT WORKS

`lib/derived/extract.ts` reads frontmatter, SKILL.md body, fenced examples, `references/**`, `assets/**`, `intent_signals`, `source_docs` and declared `derived.key_files`. It emits n-grams and triggered patterns with stable sort order. `lib/derived/sync.ts` writes the result into `graph-metadata.json.derived` only. SKILL.md is never mutated. The extraction pipeline is the same path consumed by rebuild-from-source (see [`daemon-and-freshness/rebuild-from-source.md`](../../feature-catalog/daemon-and-freshness/rebuild-from-source.md)).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/extract.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | derived-sync correctness |
| `Playbook scenario [AI-001](../../manual-testing-playbook/auto-indexing/derived-extraction.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `auto-indexing/derived-extraction.md`

Related references:

- [02-sanitizer.md](./sanitizer.md).
- [03-provenance-and-trust-lanes.md](../../feature-catalog/auto-indexing/provenance-and-trust-lanes.md).
- [05-anti-stuffing.md](../../feature-catalog/auto-indexing/anti-stuffing.md).
