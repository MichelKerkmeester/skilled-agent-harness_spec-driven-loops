---
title: "Anchor-aware chunk thinning"
description: "Anchor-aware chunk thinning scores each chunk by anchor presence and content density, dropping low-value chunks from the index."
trigger_phrases:
  - "anchor-aware chunk thinning"
  - "chunk scoring by anchor presence"
  - "drop low-value chunks"
  - "content density scoring"
  - "thin index chunks"
version: 3.6.0.13
---

# Anchor-aware chunk thinning

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Anchor-aware chunk thinning scores each chunk by anchor presence and content density, dropping low-value chunks from the index.

When a large file is split into smaller pieces for indexing, not every piece carries useful information. Some are mostly whitespace or boilerplate. This feature scores each piece and drops the ones that add little value, keeping only the meaningful parts. It is like trimming the fat off a steak so you only store the good cuts.

---

## 2. HOW IT WORKS

When large files are split into chunks during indexing, not all chunks carry equal value. Anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary 0 or 1) and content density (weight 0.4, 0-1 scale). Content density strips HTML comments, collapses whitespace, penalizes short chunks under 100 characters and adds a structure bonus (up to +0.2) for headings, code blocks and list items.

Chunks scoring below the 0.3 threshold are dropped from the index, reducing storage and search noise. The thinning guarantee: the function never returns an empty array regardless of scoring. Always active in the chunking path with no separate feature flag.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/chunk-thinning.vitest.ts` | Automated test | Chunk thinning tests |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `memory_quality_and_indexing/anchor_aware_chunk_thinning.md`
Related references:
- [smarter-memory-content-generation.md](smarter_memory_content_generation.md) — Smarter memory content generation
- [encoding-intent-capture-at-index-time.md](encoding_intent_capture_at_index_time.md) — Encoding-intent capture at index time
