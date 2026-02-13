# Verification Checklist: Phase 6 — Convert scripts/ to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-F
> **Session:** Session 3 (parallel with Phase 5)
> **Status:** Planning
> **Created:** 2026-02-07

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [compilation output / test result / file existence]
```

---

## Phase 6: scripts/ Conversion Verification

### Layer 6a: utils/ (10 files)

- [ ] CHK-120 [P0] `utils/` (10 files) — all converted, barrel exports resolve
  - **Evidence**:
  - `logger.ts` exports `LogLevel` enum, `log()` function
  - `path-utils.ts` exports `resolveSpecFolder()`, `getProjectRoot()`
  - `data-validator.ts` exports `ValidationResult` interface, validators
  - `input-normalizer.ts` exports `normalize()` function
  - `message-utils.ts` exports `extractMessages()` function
  - `prompt-utils.ts` exports `parsePrompt()` function
  - `tool-detection.ts` exports `detectToolUsage()` function
  - `validation-utils.ts` exports `fileExists()`, `validateFileContent()`
  - `file-helpers.ts` exports `readFile()`, `writeFile()`, `ensureDirectory()`
  - `index.ts` barrel exports all modules correctly

- [ ] CHK-121 [P0] `utils/` compilation — `tsc --build scripts` (utils only) compiles with 0 errors
  - **Evidence**:

- [ ] CHK-122 [P1] `utils/` tests — all utils-related tests pass
  - **Evidence**:

---

### Layer 6b: lib/ (10 files)

- [ ] CHK-123 [P0] `lib/` (10 files) — anchor-generator, content-filter, flowchart, semantic-summarizer
  - **Evidence**:
  - `ascii-boxes.ts` exports `AsciiBox` class
  - `decision-tree-generator.ts` exports `DecisionNode` interface, `generateTree()`
  - `anchor-generator.ts` exports `AnchorTag` type, `extractAnchors()`
  - `content-filter.ts` exports `ContentType` enum, `filterByType()`
  - `flowchart-generator.ts` exports `generateFlowchart()` (Mermaid output)
  - `simulation-factory.ts` exports `createSimulation()`
  - `semantic-summarizer.ts` exports `summarize()` (largest lib file, 591 lines)
  - `embeddings.ts` re-exports `shared/embeddings` correctly
  - `trigger-extractor.ts` re-exports `shared/trigger-extractor` correctly
  - `retry-manager.ts` re-exports `mcp_server/lib/providers/retry-manager` correctly

- [ ] CHK-124 [P0] `lib/` re-export stubs resolve correctly
  - **Evidence**:
  - `import { embed } from './lib/embeddings'` works
  - `import { extractTriggers } from './lib/trigger-extractor'` works
  - `import { withRetry } from './lib/retry-manager'` works

- [ ] CHK-125 [P0] `lib/` compilation — compiles with 0 errors
  - **Evidence**:

- [ ] CHK-126 [P1] `lib/` tests — all lib-related tests pass
  - **Evidence**:

---

### Layer 6c: renderers/ (2 files)

- [ ] CHK-127 [P0] `renderers/template-renderer.ts` — Mustache-like engine typed
  - **Evidence**:
  - `{{VAR}}` substitution typed
  - `{{#ARRAY}}` loops typed
  - `{{^ARRAY}}` inverted sections typed
  - `render(template: string, context: TemplateContext): string` signature

- [ ] CHK-128 [P0] `renderers/` compilation — compiles with 0 errors
  - **Evidence**:

- [ ] CHK-129 [P1] `renderers/` tests — template rendering tests pass
  - **Evidence**:

---

### Layer 6d: loaders/ (2 files)

- [ ] CHK-130 [P0] `loaders/data-loader.ts` — 3-priority loading chain typed
  - **Evidence**:
  - `DataSource` type: `'argument' | 'file' | 'fallback'`
  - `loadData<T>()` generic function typed
  - Priority order: arg → file → fallback

- [ ] CHK-131 [P0] `loaders/` compilation — compiles with 0 errors
  - **Evidence**:

- [ ] CHK-132 [P1] `loaders/` tests — data loading tests pass
  - **Evidence**:

---

### Layer 6e: extractors/ (9 files)

- [ ] CHK-133 [P0] `extractors/` (9 files) — all 8 extractors + barrel compile
  - **Evidence**:
  - `conversation-extractor.ts` exports `extractConversation()`
  - `decision-extractor.ts` exports `extractDecisions()`
  - `diagram-extractor.ts` exports `extractDiagrams()`
  - `opencode-capture.ts` exports `captureOpencodeReferences()`
  - `session-extractor.ts` exports `extractSession()`
  - `file-extractor.ts` exports `extractFileChanges()`
  - `implementation-guide-extractor.ts` exports `extractImplementationSteps()`
  - `collect-session-data.ts` exports `collectSessionData()` (757 lines)
  - `index.ts` barrel exports all correctly

- [ ] CHK-134 [P0] `extractors/collect-session-data.ts` (757 lines) — largest scripts file fully typed
  - **Evidence**:
  - `SessionData` interface defined
  - All 7 extractor imports typed
  - Error handling for partial failures typed
  - Orchestration logic fully typed

- [ ] CHK-135 [P0] `extractors/` compilation — compiles with 0 errors
  - **Evidence**:

- [ ] CHK-136 [P1] `extractors/` tests — all extractor tests pass
  - **Evidence**:

---

### Layer 6f: spec-folder/ (4 files)

- [ ] CHK-137 [P0] `spec-folder/` (4 files) — alignment validator, folder detector typed
  - **Evidence**:
  - `alignment-validator.ts` exports `validateContentAlignment()`, `AlignmentResult`
  - `directory-setup.ts` exports `setupContextDirectory()`
  - `folder-detector.ts` exports `detectSpecFolder()`, `SpecFolderInfo`, `filterArchiveFolders()`
  - `index.ts` barrel exports + snake_case aliases

- [ ] CHK-138 [P0] `spec-folder/index.ts` — snake_case aliases preserved (CRITICAL)
  - **Evidence**:
  - `detect_spec_folder` alias exported
  - `setup_context_directory` alias exported
  - `filter_archive_folders` alias exported
  - `validate_content_alignment` alias exported
  - Test both imports: `import { detectSpecFolder, detect_spec_folder } from './spec-folder'` works

- [ ] CHK-139 [P0] `spec-folder/` compilation — compiles with 0 errors
  - **Evidence**:

- [ ] CHK-140 [P1] `spec-folder/` tests — folder detection and validation tests pass
  - **Evidence**:

---

### Layer 6g: core/ (3 files)

- [ ] CHK-141 [P0] `core/config.ts` (213 lines) — configuration typed
  - **Evidence**:
  - `WorkflowConfig` interface defined
  - `CONFIG` object typed
  - `loadConfig()` function typed

- [ ] CHK-142 [P0] `core/workflow.ts` (550 lines) — 12-step pipeline typed end-to-end
  - **Evidence**:
  - All 12 stages typed with inputs/outputs
  - `WorkflowState` interface defined (tracks progress)
  - `WorkflowResult` interface defined (success, output, errors)
  - Lazy require() converted to static import (CRITICAL)
  - Error recovery typed
  - Partial completion handling typed

- [ ] CHK-143 [P0] `core/workflow.ts` — lazy require() → static import conversion verified
  - **Evidence**:
  - No dynamic `require()` calls remaining
  - All imports are static `import` statements at top of file
  - Compilation verifies all imports resolve

- [ ] CHK-144 [P0] `core/` compilation — compiles with 0 errors
  - **Evidence**:

- [ ] CHK-145 [P1] `core/` tests — workflow orchestration tests pass
  - **Evidence**:

---

### Layer 6h: memory/ entry points (3 files)

- [ ] CHK-146 [P0] `memory/generate-context.ts` — CLI entry point typed
  - **Evidence**:
  - `main(args: string[]): Promise<void>` signature
  - Command-line argument interface defined
  - Error handling with exit codes typed
  - Invokes core/workflow correctly

- [ ] CHK-147 [P0] `memory/rank-memories.ts` — ranking CLI typed
  - **Evidence**:
  - `main(input: NodeJS.ReadableStream): Promise<void>` signature
  - JSONL parsing typed
  - Uses shared/scoring/folder-scoring correctly

- [ ] CHK-148 [P0] `memory/cleanup-orphaned-vectors.ts` — cleanup CLI typed
  - **Evidence**:
  - `main(): Promise<void>` signature
  - Orphan detection typed
  - Database cleanup operations typed

- [ ] CHK-149 [P0] `memory/` compilation — compiles with 0 errors
  - **Evidence**:

---

## Phase 6 Quality Gate

### Compilation

- [ ] CHK-150 [P0] `tsc --build scripts` — 0 errors
  - **Evidence**:

- [ ] CHK-151 [P0] All TypeScript strict checks pass
  - **Evidence**:
  - No `any` in public API function signatures
  - All functions have explicit return types
  - Strict null checks pass

---

### Tests

- [ ] CHK-152 [P0] All 13 scripts tests pass against compiled output
  - **Evidence**:

- [ ] CHK-153 [P0] `npm run test:cli` passes — 100% success rate
  - **Evidence**:

---

### CLI Functionality

- [ ] CHK-154 [P0] `node scripts/memory/generate-context.js` (compiled) produces valid memory file
  - **Evidence**:
  - Command runs without errors
  - Output file created at expected path
  - Output file has valid JSON structure
  - Output file passes validation against memory schema

- [ ] CHK-155 [P0] `node scripts/memory/rank-memories.js` (compiled) produces valid ranking output
  - **Evidence**:
  - Command accepts stdin input
  - Ranking algorithm executes
  - Output is sorted correctly
  - Folder scores calculated

- [ ] CHK-156 [P1] `node scripts/memory/cleanup-orphaned-vectors.js` (compiled) completes cleanup
  - **Evidence**:
  - Database connection successful
  - Orphan detection runs
  - Cleanup operations complete
  - Summary statistics reported

---

### Backward Compatibility

- [ ] CHK-157 [P0] Snake_case aliases work — both camelCase and snake_case imports functional
  - **Evidence**:
  - `import { detectSpecFolder } from './spec-folder'` works
  - `import { detect_spec_folder } from './spec-folder'` works
  - Both resolve to same function
  - Test coverage for all 4 aliases

- [ ] CHK-158 [P0] Re-export proxies resolve correctly
  - **Evidence**:
  - `lib/embeddings` → `shared/embeddings` works
  - `lib/trigger-extractor` → `shared/trigger-extractor` works
  - `lib/retry-manager` → `mcp_server/lib/providers/retry-manager` works
  - All re-exported functions callable
  - Type inference works through proxies

---

### Code Quality

- [ ] CHK-159 [P1] No `any` in scripts/ public API
  - **Evidence**:
  - `grep -rn ': any' scripts/ --include='*.ts' | grep -v test` — minimal results

- [ ] CHK-160 [P1] All public functions have explicit return types
  - **Evidence**:

- [ ] CHK-161 [P2] TSDoc comments on public API functions
  - **Evidence**:

---

### Integration

- [ ] CHK-162 [P0] scripts/ imports from shared/ resolve correctly
  - **Evidence**:
  - Imports from `shared/embeddings` work
  - Imports from `shared/trigger-extractor` work
  - Imports from `shared/scoring/folder-scoring` work

- [ ] CHK-163 [P0] scripts/ imports from mcp_server/ resolve correctly (minimal)
  - **Evidence**:
  - Import from `mcp_server/core/config` works (CONFIG constant)
  - Re-export proxy to `mcp_server/lib/providers/retry-manager` works

---

## Phase 6 Completion Criteria

- [ ] CHK-164 [P0] All 42 files converted from .js to .ts
  - **Evidence**:
  - File count: `find scripts/ -name '*.ts' | wc -l` = 42+

- [ ] CHK-165 [P0] All tasks T160–T203 marked `[x]` in tasks.md
  - **Evidence**:

- [ ] CHK-166 [P0] No compilation errors in scripts/
  - **Evidence**:

- [ ] CHK-167 [P0] All 13 scripts tests pass
  - **Evidence**:

- [ ] CHK-168 [P0] CLI smoke tests pass (3 entry points)
  - **Evidence**:

- [ ] CHK-169 [P1] Snake_case aliases preserved and tested
  - **Evidence**:

- [ ] CHK-170 [P1] Re-export proxies verified
  - **Evidence**:

- [ ] CHK-171 [P1] Lazy require() eliminated from core/workflow.ts
  - **Evidence**:

- [ ] CHK-172 [P2] Documentation updated in scripts/README.md
  - **Evidence**:

---

## Rollback Plan

If Phase 6 fails:

- [ ] CHK-180 [P1] Git revert restores original .js files
  - **Evidence**:

- [ ] CHK-181 [P1] Original tests still pass against reverted code
  - **Evidence**:

- [ ] CHK-182 [P1] CLI tools functional after revert
  - **Evidence**:

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Layer 6a: utils/ | 3 | /3 | 2 P0, 1 P1 |
| Layer 6b: lib/ | 4 | /4 | 3 P0, 1 P1 |
| Layer 6c: renderers/ | 3 | /3 | 2 P0, 1 P1 |
| Layer 6d: loaders/ | 3 | /3 | 2 P0, 1 P1 |
| Layer 6e: extractors/ | 4 | /4 | 3 P0, 1 P1 |
| Layer 6f: spec-folder/ | 4 | /4 | 3 P0, 1 P1 |
| Layer 6g: core/ | 5 | /5 | 4 P0, 1 P1 |
| Layer 6h: memory/ | 4 | /4 | 3 P0 |
| Quality Gate: Compilation | 3 | /3 | 3 P0 |
| Quality Gate: Tests | 2 | /2 | 2 P0 |
| Quality Gate: CLI | 3 | /3 | 2 P0, 1 P1 |
| Quality Gate: Compatibility | 2 | /2 | 2 P0 |
| Quality Gate: Code Quality | 3 | /3 | 1 P1, 2 P2 |
| Quality Gate: Integration | 2 | /2 | 2 P0 |
| Completion | 9 | /9 | 5 P0, 3 P1, 1 P2 |
| Rollback | 3 | /3 | 3 P1 |
| **TOTAL** | **55** | **/55** | |

| Priority | Count |
|----------|------:|
| **P0** | 41 |
| **P1** | 12 |
| **P2** | 2 |
| **Grand Total** | **55** |

**Verification Date**: ________________

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Phase 6 Plan:** `phase-7-convert-scripts/plan.md`
- **Phase 6 Tasks:** `phase-7-convert-scripts/tasks.md`
- **Master Checklist:** `092-javascript-to-typescript/checklist.md` (CHK-120 through CHK-132)
- **Decision Record:** `092-javascript-to-typescript/decision-record.md` (inherits all 8 decisions)
