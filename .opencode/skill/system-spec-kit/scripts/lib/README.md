---
title: "Scripts Library"
description: "Shared TypeScript and shell helper libraries used by system-spec-kit scripts."
trigger_phrases:
  - "scripts library"
  - "anchor generator"
  - "shell common"
importance_tier: "normal"
---

# Scripts Library

The `lib/` directory provides reusable helper modules for memory generation, formatting, scoring, and shell script support.

## Current Inventory

TypeScript modules:
- `anchor-generator.ts`
- `ascii-boxes.ts`
- `content-filter.ts`
- `decision-tree-generator.ts`
- `embeddings.ts`
- `flowchart-generator.ts`
- `retry-manager.ts`
- `semantic-summarizer.ts`
- `simulation-factory.ts`
- `trigger-extractor.ts`

Shell helper libraries:
- `git-branch.sh`
- `shell-common.sh`
- `template-utils.sh`

## Notes

- `embeddings.ts` and `trigger-extractor.ts` are wrapper/re-export style modules aligned with shared package behavior.
- `shell-common.sh` and `template-utils.sh` are used by shell workflows such as validation and upgrade operations.
- Runtime JavaScript output is under `dist/lib/`.

## Quick Validation

```bash
node -e "const m=require('./.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator'); console.log(typeof m.generateAnchorId)"
```
