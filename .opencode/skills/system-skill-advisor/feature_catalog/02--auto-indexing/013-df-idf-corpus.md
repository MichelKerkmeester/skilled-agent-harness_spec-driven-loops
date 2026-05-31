---
title: "DF/IDF Corpus Stats (Active-Only)"
description: "Document-frequency and inverse-document-frequency statistics computed only over the active corpus, with debounced recomputation."
trigger_phrases:
  - "df-idf corpus"
  - "active corpus stats"
  - "idf debounced"
  - "lexical idf"
---

# DF/IDF Corpus Stats (Active-Only)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Feed the lexical lane with corpus-aware statistics so common tokens are discounted and skill-distinctive tokens dominate scoring. The corpus is restricted to active skills to avoid polluting routing with archived or future content.

## 2. HOW IT WORKS

`lib/corpus/df-idf.ts` computes DF/IDF over the active corpus only (excluding `z_archive/` and `z_future/`). Recomputation is debounced: multiple reindex events within the debounce window collapse into one recompute. The resulting statistics are consumed by the lexical lane in `lib/scorer/lanes/lexical.ts`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/df-idf.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Automated test | lexical lane scoring against IDF |
| `Playbook scenario [AI-004](../../manual_testing_playbook/06--auto-indexing/030-corpus-df-idf.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--auto-indexing/013-df-idf-corpus.md`

Related references:

- [`03--lifecycle-routing/016-archive-handling.md`](../03--lifecycle-routing/016-archive-handling.md), archive exclusion.
- [`04--scorer-fusion/019-five-lane-fusion.md`](../04--scorer-fusion/019-five-lane-fusion.md).
- [01-derived-extraction.md](./008-derived-extraction.md).
