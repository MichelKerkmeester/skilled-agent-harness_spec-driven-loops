---
title: "Investigation Research"
status: complete
---

# 🔍 Research: Memory Index Failures

## Investigation Summary

Root cause identified: **argument order mismatch** in the `evaluateMemory()` call within `memory-save.ts`. The PE (Prediction Error) gate function expects 4 arguments `(contentHash, content, candidates, options)` but was called with 3 arguments in wrong order `(candidates, content, options)`. This caused the options object `{ checkContradictions: true }` to be treated as the candidates array, crashing on `.filter()`.

## Key Findings

### Finding 1: The Actual Error (Unmasked)
- **Error**: `candidates.filter is not a function`
- **Location**: `prediction-error-gate.ts:184` → `filterRelevantCandidates()` → `.filter()` on non-array
- **Masked as**: "An unexpected error occurred. Please try again." by `userFriendlyError()` in `core.ts:147`
- **Only visible via**: `memory_save()` on individual files (uses error-preserving path), or server stderr logs

### Finding 2: Error Masking Architecture
- `batch-processor.ts:82` calls `userFriendlyError()` which has only 7 known patterns
- Any non-matching error → generic message → original error lost from MCP response
- Original error IS logged to `console.error` (stderr) but agents can't see it
- See `scratch/agent4-error-origin-trace.md` for full trace

### Finding 3: Why Only Some Files Fail
- PE gate only runs when `candidates.length > 0` (existing similar memories found)
- First ~180 files indexed fine (no similar memories existed yet)
- Later files found matches → triggered PE gate → crashed
- This is why the same files consistently fail: they happen to match existing entries

### Finding 4: Voyage Embedding Pipeline Gaps (Agent 3)
- MAX_TEXT_LENGTH (8000 chars) based on HF model, not Voyage's 32K token limit
- Retry module loaded via fragile `require()` with silent fallback
- No native batch API usage (individual requests instead)
- Provider fallback dimension mismatch risk (1024d vs 768d)
- See `scratch/agent3-voyage-embedding-analysis.md` for details

### Finding 5: specFolder Detection (Agent 7)
- 3-stage extraction always returns a string (never null)
- Constitutional files use Stage 3 (parent dir name)
- Empty string causes validation failure, but this is a separate issue
- NOT the root cause of the 129 failures
- See `scratch/agent7-path-analysis.md` for details

## File Reference Map

| File | Role | Key Lines |
|------|------|-----------|
| `memory-save.ts` | Call site with bug | 560-565 |
| `prediction-error-gate.ts` | Function with correct signature | 159-172 |
| `core.ts` | Error masking | 130-148 |
| `batch-processor.ts` | Error wrapping for index_scan | 82 |
| `memory-save.js` (compiled) | Running code with bug | 418 |
