# Plan: Phase 6 — Convert scripts/ to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-F
> **Session:** Session 3 (parallel with Phase 5)
> **Status:** Planning
> **Created:** 2026-02-07

---

## 1. Phase Overview

**Goal:** Convert all 42 scripts files (~9,096 lines) from JavaScript to TypeScript.

**Can Start After:** Phase 3 (SYNC-004) — `shared/` converted to TypeScript
**Runs Parallel With:** Phases 4–5 (mcp_server/ conversion)

**Target:** 42 files across 8 sub-layers, all CLI scripts and supporting modules

---

## 2. Dependency Note

Phase 6 depends ONLY on Phase 3 completion (SYNC-004). It does NOT depend on Phase 4 or Phase 5.

**Reason:** The `scripts/` directory imports from:
- `shared/` (converted in Phase 3)
- `mcp_server/core/config.js` (minimal, can remain JS during Phase 6)
- `mcp_server/lib/providers/embeddings.js` (re-export stub to shared/)

Most scripts imports are from `shared/`. The few `mcp_server/` imports are either config constants or re-exports pointing back to `shared/`.

**Result:** Phase 6 can proceed independently once `shared/` types are available.

---

## 3. Conversion Order (8 Sub-Layers)

| Layer | Directory | Files | Lines | Key Types |
|-------|-----------|------:|------:|-----------|
| 6a | `utils/` | 9+1 barrel | 1,060 | `LogLevel`, `InputLimits`, `ValidationResult` |
| 6b | `lib/` | 10 | 2,368 | `AsciiBox`, `DecisionNode`, `AnchorTag`, `TemplateContext` |
| 6c | `renderers/` | 2 | 224 | `TemplateRenderer`, Mustache-like engine types |
| 6d | `loaders/` | 2 | 173 | `DataSource`, 3-priority loading chain |
| 6e | `extractors/` | 9 | 2,903 | `SessionData`, `DecisionRecord`, `DiagramOutput` |
| 6f | `spec-folder/` | 4 | 840 | `SpecFolderInfo`, `AlignmentResult`, snake_case aliases |
| 6g | `core/` | 3 | 778 | `WorkflowConfig`, 12-step pipeline orchestration |
| 6h | `memory/` | 3 | 750 | CLI entry points, argument parsing |

**Parallelization:**
- Layers 6a–6d can be parallelized (no inter-dependencies)
- Layers 6e–6f depend on 6a–6b (extractors use utils and lib modules)
- Layer 6g depends on all prior layers (workflow orchestrates everything)
- Layer 6h depends on 6g (entry points invoke workflow)

---

## 4. Sub-Layer Details

### Layer 6a: utils/ (10 files, 1,060 lines)

Foundational utilities used throughout scripts/.

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `logger.ts` | 38 | `LogLevel` enum: `'debug' \| 'info' \| 'warn' \| 'error'` |
| 2 | `path-utils.ts` | 72 | `resolveSpecFolder(path: string): string`, path helpers |
| 3 | `data-validator.ts` | 100 | `ValidationResult`, field validators |
| 4 | `input-normalizer.ts` | 339 | `normalize(text: string): string`, unicode handling |
| 5 | `message-utils.ts` | 185 | Message extraction from conversation logs |
| 6 | `prompt-utils.ts` | 104 | Prompt parsing for Claude API |
| 7 | `tool-detection.ts` | 119 | Tool usage detection in conversation |
| 8 | `validation-utils.ts` | 92 | File existence, content validation |
| 9 | `file-helpers.ts` | 90 | File system utilities |
| 10 | `index.ts` | — | Barrel export |

**Dependencies:** Only Node.js built-ins (`fs`, `path`) and `shared/`

---

### Layer 6b: lib/ (10 files, 2,368 lines)

Core logic modules for context generation.

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `ascii-boxes.ts` | 163 | `AsciiBox` class, box drawing characters |
| 2 | `decision-tree-generator.ts` | 165 | `DecisionNode` interface, tree rendering |
| 3 | `anchor-generator.ts` | 229 | `AnchorTag` type, anchor extraction from markdown |
| 4 | `content-filter.ts` | 417 | Content type detection, filtering logic |
| 5 | `flowchart-generator.ts` | 363 | Mermaid flowchart generation |
| 6 | `simulation-factory.ts` | 416 | Scenario simulation for documentation |
| 7 | `semantic-summarizer.ts` | 591 | LLM-based summarization (largest lib file) |
| 8 | `embeddings.ts` | — | Re-export stub → `shared/embeddings` |
| 9 | `trigger-extractor.ts` | — | Re-export stub → `shared/trigger-extractor` |
| 10 | `retry-manager.ts` | — | Re-export stub → `mcp_server/lib/providers/retry-manager` |

**Note:** 3 files are re-export stubs (no logic), just type-safe proxies.

---

### Layer 6c: renderers/ (2 files, 224 lines)

Template rendering engine.

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `template-renderer.ts` | 189 | `TemplateContext`, Mustache-like: `{{VAR}}`, `{{#ARRAY}}`, `{{^ARRAY}}` |
| 2 | `index.ts` | 35 | Barrel export |

**Key features:**
- Variable substitution: `{{VAR}}`
- Array loops: `{{#ARRAY}}...{{/ARRAY}}`
- Inverted sections: `{{^ARRAY}}...{{/ARRAY}}`
- Nested context support

---

### Layer 6d: loaders/ (2 files, 173 lines)

Data loading with fallback chain.

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `data-loader.ts` | 151 | `DataSource` type, 3-priority loading (arg → file → fallback) |
| 2 | `index.ts` | 22 | Barrel export |

**Loading priority:**
1. Command-line argument (highest)
2. File path if exists
3. Default fallback value

---

### Layer 6e: extractors/ (9 files, 2,903 lines)

Content extraction from conversation logs and spec files.

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `conversation-extractor.ts` | 204 | Extract turns from conversation logs |
| 2 | `decision-extractor.ts` | 295 | `DecisionRecord`, decision tree from discussions |
| 3 | `diagram-extractor.ts` | 216 | `DiagramOutput`, extract Mermaid diagrams |
| 4 | `opencode-capture.ts` | 443 | OpenCode framework references |
| 5 | `session-extractor.ts` | 357 | Session metadata extraction |
| 6 | `file-extractor.ts` | 235 | File change tracking |
| 7 | `implementation-guide-extractor.ts` | 373 | Implementation steps from conversation |
| 8 | `collect-session-data.ts` | 757 | **LARGEST** — assembles all session data |
| 9 | `index.ts` | 23 | Barrel export |

**Top complexity:** `collect-session-data.ts` (757 lines) — orchestrates 7 other extractors.

---

### Layer 6f: spec-folder/ (4 files, 840 lines)

Spec folder detection and validation.

| # | File | Lines | Key Types | Snake_case Aliases |
|---|------|------:|-----------|-------------------|
| 1 | `alignment-validator.ts` | 451 | `AlignmentResult`, content validation | `validate_content_alignment` |
| 2 | `directory-setup.ts` | 103 | Spec folder creation | `setup_context_directory` |
| 3 | `folder-detector.ts` | 238 | `SpecFolderInfo`, folder search | `detect_spec_folder` |
| 4 | `index.ts` | 48 | Barrel export + snake_case aliases | `filter_archive_folders` |

**CRITICAL:** Must preserve all snake_case export aliases for backward compatibility (from spec 090).

**Snake_case exports:**
```typescript
export { detectSpecFolder as detect_spec_folder };
export { setupContextDirectory as setup_context_directory };
export { filterArchiveFolders as filter_archive_folders };
export { validateContentAlignment as validate_content_alignment };
```

---

### Layer 6g: core/ (3 files, 778 lines)

Workflow orchestration — depends on nearly everything.

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `config.ts` | 213 | `WorkflowConfig`, specs directory utilities |
| 2 | `workflow.ts` | 550 | **12-step pipeline**, orchestrates all extractors/loaders/renderers |
| 3 | `index.ts` | 15 | Barrel export |

**workflow.ts dependencies (imports from):**
- `utils/` (logger, validators, file-helpers)
- `lib/` (semantic-summarizer, anchor-generator, content-filter)
- `extractors/` (collect-session-data)
- `loaders/` (data-loader)
- `renderers/` (template-renderer)
- `spec-folder/` (detect-spec-folder, validate-content-alignment)

**12-step pipeline:**
1. Load configuration
2. Detect spec folder
3. Validate alignment
4. Load conversation data
5. Extract session metadata
6. Extract decisions
7. Extract diagrams
8. Generate anchors
9. Filter content
10. Render template
11. Validate output
12. Write memory file

**Special note:** `workflow.ts` previously used lazy `require()` for conditional loading. Convert to static `import` during TypeScript migration.

---

### Layer 6h: memory/ (3 files, 750 lines)

CLI entry points.

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `generate-context.ts` | 277 | CLI argument parsing, invokes workflow |
| 2 | `rank-memories.ts` | 333 | Folder ranking, uses `shared/scoring/folder-scoring` |
| 3 | `cleanup-orphaned-vectors.ts` | 140 | Vector index maintenance |

**Entry points:**
```bash
node scripts/memory/generate-context.js [spec-folder-path] [--mode=MODE]
node scripts/memory/rank-memories.js < memories.jsonl
node scripts/memory/cleanup-orphaned-vectors.js
```

---

## 5. Special Considerations

### Lazy require() Conversion

**Current (JS):**
```javascript
// workflow.js (line ~45)
const loader = require('./loaders/data-loader'); // lazy load
```

**Target (TS):**
```typescript
import { loadData } from './loaders/data-loader'; // static import
```

**Rationale:** TypeScript encourages static imports for type inference. Lazy loading was optimization in JS (faster startup), but with TypeScript compilation, startup time is dominated by `tsc` build, not module loading.

---

### Re-export Proxy Update

3 files are re-export proxies to other workspaces:

| File | Exports from |
|------|-------------|
| `lib/embeddings.ts` | `shared/embeddings` |
| `lib/trigger-extractor.ts` | `shared/trigger-extractor` |
| `lib/retry-manager.ts` | `mcp_server/lib/providers/retry-manager` |

**Current (JS):**
```javascript
module.exports = require('../../../shared/embeddings');
```

**Target (TS):**
```typescript
export * from '../../../shared/embeddings';
```

---

### Snake_case Alias Preservation (spec 090)

From spec 090 (snake_case standardization), `spec-folder/index.ts` exports both camelCase and snake_case:

**Target:**
```typescript
// spec-folder/index.ts
export { detectSpecFolder, detectSpecFolder as detect_spec_folder } from './folder-detector';
export { setupContextDirectory, setupContextDirectory as setup_context_directory } from './directory-setup';
export { filterArchiveFolders, filterArchiveFolders as filter_archive_folders } from './folder-detector';
export { validateContentAlignment, validateContentAlignment as validate_content_alignment } from './alignment-validator';
```

**Test after conversion:**
```javascript
// Verify both work
import { detectSpecFolder, detect_spec_folder } from './spec-folder';
```

---

## 6. Agent Allocation (Session 3)

Phase 6 runs in Session 3 alongside Phase 5.

| Agent | Task | Est. Files |
|-------|------|-----------|
| Agent 7 | Layer 6a + 6b: utils/ + lib/ | 19 files |
| Agent 8 | Layer 6c + 6d + 6e: renderers/ + loaders/ + extractors/ | 13 files |
| Agent 9 | Layer 6f + 6g: spec-folder/ + core/ | 7 files |
| Agent 10 | Layer 6h: memory/ entry points | 3 files |

**Parallelization:**
- Agent 7 and Agent 8 can work in parallel (no dependencies)
- Agent 9 waits for Agent 7 (spec-folder/ uses utils/, core/ uses lib/)
- Agent 10 waits for Agent 9 (memory/ entry points invoke core/workflow)

---

## 7. Verification Steps

After all 42 files converted:

1. **Compilation:** `tsc --build scripts` — 0 errors
2. **Tests:** `npm run test:cli` — all 13 scripts tests pass
3. **CLI smoke test:** `node scripts/memory/generate-context.js` produces valid memory file
4. **Ranking smoke test:** `node scripts/memory/rank-memories.js` produces ranked output
5. **Snake_case aliases:** Verify backward-compatible imports work
6. **Re-export proxies:** Verify `lib/embeddings`, `lib/trigger-extractor`, `lib/retry-manager` resolve correctly

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| TypeScript strict errors | 0 |
| Scripts tests pass rate | 100% (13 files) |
| CLI tools functional | All 3 entry points produce correct output |
| Snake_case exports | All 4 aliases preserved and tested |
| Re-export proxies | All 3 resolve correctly |
| Compiled output | Identical behavior to original JS |

---

## 9. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Lazy require() breaks | Convert to static import early in Layer 6g |
| Snake_case aliases lost | Verify exports in `spec-folder/index.ts` before claiming Layer 6f done |
| Re-export proxies fail | Test import chain after Layer 6b conversion |
| CLI argument parsing changes | Run smoke tests with various argument combinations |
| Workflow orchestration breaks | Test end-to-end with real spec folder after Layer 6g |

---

## 10. Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Master Plan:** `092-javascript-to-typescript/plan.md` (Phase 6, lines 289–307)
- **Master Tasks:** `092-javascript-to-typescript/tasks.md` (T160–T203)
- **Master Checklist:** `092-javascript-to-typescript/checklist.md` (CHK-120 through CHK-132)
- **Decision Record:** `092-javascript-to-typescript/decision-record.md` (inherits all 8 decisions)

---

## 11. Timeline Estimate

| Layer | Est. Time |
|-------|-----------|
| 6a: utils/ | 3h |
| 6b: lib/ | 4h |
| 6c: renderers/ | 1h |
| 6d: loaders/ | 1h |
| 6e: extractors/ | 6h |
| 6f: spec-folder/ | 3h |
| 6g: core/ | 4h |
| 6h: memory/ | 2h |
| **Verification** | 1h |
| **Total** | ~25h (parallel: 3 agents → ~9h) |

---

**Status:** Ready for implementation after Phase 3 (SYNC-004) completes.
