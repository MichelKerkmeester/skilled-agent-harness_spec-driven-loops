# Implementation Plan

## Phase 1: File Headers (All 70 files)
Replace JSDoc/comment block headers with 3-line box-drawing format:
- JavaScript: `// ───────────────────────────────────────────────────────────────`
- Shell: `# ───────────────────────────────────────────────────────────────`

## Phase 2: Function Naming (~200+ functions)
Convert all JavaScript function names from camelCase to snake_case:
- `generateEmbedding` → `generate_embedding`
- `loadConfig` → `load_config`

## Phase 3: Variable Naming
Convert JavaScript variable names from camelCase to snake_case:
- `apiKey` → `api_key`
- `baseUrl` → `base_url`

## Phase 4: Section Headers
Convert to numbered multi-line format:
```javascript
/* ─────────────────────────────────────────────────────────────
   1. SECTION NAME
──────────────────────────────────────────────────────────────── */
```

## Phase 5: Cleanup
- Remove VERSION, CREATED, UPDATED metadata
- Add trailing commas to multi-line objects/arrays

## Parallel Execution Strategy
10 agents working on non-overlapping file sets simultaneously.
