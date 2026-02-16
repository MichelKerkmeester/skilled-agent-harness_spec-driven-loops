---
title: "Data Extractors"
description: "Extractor inventory for session, conversation, decision, file, and implementation data capture."
trigger_phrases:
  - "data extractors"
  - "collect session data"
  - "decision extraction"
importance_tier: "normal"
---

# Data Extractors

The `extractors/` directory converts collected session input into structured data used by templates and indexing.

## Current Inventory

- `collect-session-data.ts`
- `conversation-extractor.ts`
- `decision-extractor.ts`
- `diagram-extractor.ts`
- `file-extractor.ts`
- `implementation-guide-extractor.ts`
- `session-extractor.ts`
- `opencode-capture.ts`
- `index.ts`

## Role in Pipeline

- Input: normalized data from `loaders/data-loader.ts`
- Processing: extraction and enrichment across conversation, files, decisions, and session context
- Output: structured objects consumed by `renderers/template-renderer.ts` and core workflow/indexing layers

## Notes

- Decision tree generation logic is provided by `lib/decision-tree-generator.ts` and used by extractor flow.
- Runtime imports use compiled files under `dist/extractors/`.

## Quick Import Check

```bash
node -e "const e=require('./.opencode/skill/system-spec-kit/scripts/dist/extractors'); console.log(Object.keys(e))"
```
