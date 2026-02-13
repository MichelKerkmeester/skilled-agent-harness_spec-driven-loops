# Tasks: Phase 17 — workflows-code--opencode Alignment

## Track A: Skill Updates (workflows-code--opencode)

### A1. Update TypeScript Header Template [P0]
- [x] Audit: Identified all 62+ TS files use `// -------` not `// ============`
- [x] Fix: Update `references/typescript/style_guide.md` Section 1 template
- [x] Fix: Update `SKILL.md` Section 10 Quick Reference TS template
- [x] Verify: Template matches actual codebase convention

### A2. Fix All JavaScript Evidence Citations [P0]
- [x] Audit: Identified 25+ broken citations across 4 reference files
- [x] Fix: `references/javascript/style_guide.md` — 7 citations updated (.js → .ts + line numbers)
- [x] Fix: `references/javascript/quality_standards.md` — 7 citations updated
- [x] Fix: `references/shared/code_organization.md` — 6 citations updated + code examples modernized
- [x] Fix: `references/shared/universal_patterns.md` — 2 citations updated + code examples modernized
- [x] Verify: All cited files exist with correct extensions

### A3. Update SKILL.md File Counts [P0]
- [x] Audit: "206 JavaScript files" is obsolete (now ~65 JS, ~341 TS)
- [x] Fix: Update Section 2 Resource Router comments (~65 JS, ~341 TS)
- [x] Fix: Update Section 3 Evidence-Based Patterns table
- [x] Verify: Counts match reality

### A4. Update MCP Server Structure Diagram [P1]
- [x] Audit: Diagram shows all .js, reality is all .ts + 12 missing directories
- [x] Fix: Update `references/shared/code_organization.md` Section 6 — full MCP server tree rebuilt
- [x] Fix: Update Section 6 scripts directory tree rebuilt
- [x] Verify: Directory trees match actual structure

### A5. Document snake_case Exception for DB-Mapped Properties [P1]
- [x] Audit: 34+ files intentionally use snake_case for DB column mapping
- [x] Fix: Add exception subsection to TS style_guide.md Section 4 (Naming Conventions)
- [x] Fix: Added entry to Naming Summary Table
- [x] Verify: Exception is clearly scoped (DB-mapped only, with mapping layer recommendation)

### A6. Document Block-Comment Section Divider Pattern [P1]
- [x] Audit: 27+ files use `/* --- */` block-comment format
- [x] Fix: Update TS style_guide.md Section 3 — renamed to "Section Divider Templates" with Format A + Format B
- [x] Verify: Both line-comment and block-comment formats documented

### A7. Add Test File Exemption Tier [P1]
- [x] Audit: 12 test runner files legitimately skip exports/guards
- [x] Fix: Add Section 8 "Test File Exemption Tier" to JS quality_standards.md
- [x] Verify: Exemptions clearly defined with scope, rationale, and example

### A8. Document Mixed JS/TS Coexistence [P2]
- [x] Audit: Pattern exists but undocumented
- [x] Fix: Add Section 8 "Mixed JS/TS Coexistence Patterns" to TS style_guide.md (5 patterns)
- [x] Verify: Covers require(), strict, import patterns, allowJs

### A9. Update tsconfig outDir Documentation [P2]
- [x] Audit: All 3 workspaces use `./dist`, skill says `.`
- [x] Fix: Update TS quality_standards.md Section 9 — root + 2 workspace examples updated
- [x] Verify: Matches actual tsconfig files

## Track B: Code Fixes (system-spec-kit)

### B1. Remove 'use strict' from All .ts Files [P0]
- [x] Audit: 37+ TS files retain JS-era directive
- [x] Fix: Batch removed `'use strict';` from 98 .ts files
- [x] Verify: Zero TS files contain 'use strict'; JS files correctly retained

### B2. snake_case → camelCase Interface Migration [P1]
- [x] Audit: IEmbeddingProvider + 3 providers + all callers affected
- [x] Fix: Renamed in types.ts (IEmbeddingProvider, ProviderMetadata, UsageStats, EmbeddingCacheStats, LazyLoadingStats, ExtractionStats)
- [x] Fix: Renamed in 3 providers (voyage.ts, hf-local.ts, openai.ts)
- [x] Fix: Renamed in profile.ts (getDatabasePath, toDisplayString, toJson)
- [x] Fix: Renamed in embeddings.ts (all caller sites)
- [x] Fix: Renamed in trigger-extractor.ts (ExtractionStats usage)
- [x] Fix: Renamed in mcp_server callers (memory-crud.ts, vector-index.ts, vector-index-impl.js)
- [x] Fix: Renamed in test files (lazy-loading.test.js, trigger-extractor.test.ts, test-embeddings-factory.js)
- [x] Verify: MemoryRecord untouched (DB-mapped), Voyage `input_type` untouched (API param), LRU internals untouched
- [x] Verify: 13 files modified, 0 new TS errors introduced

### B3. Create shared/index.ts Barrel File [P1]
- [x] Audit: Missing centralized export surface
- [x] Fix: Created shared/index.ts with 8 export sections (types, embeddings, factory, profile, chunking, trigger-extractor, utils, scoring)
- [x] Verify: All exports verified against source files

### B4. Fix Shell Strict Mode [P1]
- [x] Audit: 7 scripts with incomplete `set -euo pipefail`
- [x] Fix: Upgraded check-completion.sh and registry-loader.sh to `set -euo pipefail`
- [x] Fix: Documented bash 3.2 array compatibility reason for validate.sh (kept as-is)
- [x] Verify: All scripts pass `bash -n` syntax check

### B5. Fix filters.jsonc snake_case Keys [P2]
- [x] Audit: 6 snake_case property keys
- [x] Fix: Renamed all 6 keys to camelCase in filters.jsonc
- [x] Fix: Updated 3 consumer files (content-filter.ts, test-scripts-modules.js, preflight.test.ts)
- [x] Verify: No remaining references to old key names

### B6. Verify TS File Headers [P2 — Depends on A1]
- [x] Audit: All 62+ files consistent with each other
- [x] Fix: After A1, verified all match updated standard
- [x] Verify: Zero files use `// ============` — all use `// -------` consistently
