# Tasks: Phase 6 — Convert scripts/ to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-F
> **Session:** Session 3 (parallel with Phase 5)
> **Status:** Planning
> **Created:** 2026-02-07

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format:**
```
T### [W-F] [P?] Description (file path) [effort] {deps: T###}
```

---

## Phase 6: Convert scripts/ (42 files)

> **Goal:** Convert CLI scripts and their modules.
> **Workstream:** W-F (can start after Phase 3 SYNC-004)
> **Effort:** 42 files, ~9,096 lines

---

### Layer 6a: utils/ (10 files)

- [ ] T160 [W-F] Convert `utils/logger.ts` (38 lines) [10m] {deps: T042}
  - Type `LogLevel` enum: `'debug' | 'info' | 'warn' | 'error'`
  - Type `log(level: LogLevel, message: string, ...args: unknown[]): void`
  - Replace `module.exports` → named exports

- [ ] T161 [W-F] [P] Convert `utils/path-utils.ts` (72 lines) [15m] {deps: T042}
  - Type `resolveSpecFolder(path: string): string`
  - Type `getProjectRoot(): string`
  - Type `normalizePathSeparators(path: string): string`
  - Replace `require('path')` → `import path from 'path'`

- [ ] T162 [W-F] [P] Convert `utils/data-validator.ts` (100 lines) [30m] {deps: T042}
  - Define `ValidationResult` interface (valid: boolean, errors: string[])
  - Type all field validators: `validateString`, `validateArray`, `validateObject`
  - Type schema validation functions

- [ ] T163 [W-F] [P] Convert `utils/input-normalizer.ts` (339 lines) [45m] {deps: T042}
  - Type `normalize(text: string): string`
  - Type Unicode normalization functions
  - Type whitespace handling

- [ ] T164 [W-F] [P] Convert `utils/message-utils.ts` (185 lines) [30m] {deps: T042}
  - Type `extractMessages(log: string): Message[]`
  - Define `Message` interface (role, content, timestamp)
  - Type conversation parsing logic

- [ ] T165 [W-F] [P] Convert `utils/prompt-utils.ts` (104 lines) [20m] {deps: T042}
  - Type `parsePrompt(text: string): ParsedPrompt`
  - Define `ParsedPrompt` interface
  - Type Claude API prompt parsing

- [ ] T166 [W-F] [P] Convert `utils/tool-detection.ts` (119 lines) [20m] {deps: T042}
  - Type `detectToolUsage(content: string): ToolUsage[]`
  - Define `ToolUsage` interface (tool: string, count: number)
  - Type regex patterns as `readonly RegExp[]`

- [ ] T167 [W-F] [P] Convert `utils/validation-utils.ts` (92 lines) [20m] {deps: T160}
  - Type `fileExists(path: string): Promise<boolean>`
  - Type `validateFileContent(path: string, schema: Schema): ValidationResult`
  - Type content validation logic

- [ ] T168 [W-F] [P] Convert `utils/file-helpers.ts` (90 lines) [15m] {deps: T042}
  - Type `readFile(path: string): Promise<string>`
  - Type `writeFile(path: string, content: string): Promise<void>`
  - Type `ensureDirectory(path: string): Promise<void>`

- [ ] T169 [W-F] Convert `utils/index.ts` barrel [10m] {deps: T160-T168}
  - Export all utils with proper type re-exports

---

### Layer 6b: lib/ (10 files)

- [ ] T170 [W-F] Convert `lib/ascii-boxes.ts` (163 lines) [20m] {deps: T042}
  - `AsciiBox` class with typed methods
  - Type box drawing characters as `readonly string[]`
  - Type `draw(content: string, width: number): string`

- [ ] T171 [W-F] Convert `lib/decision-tree-generator.ts` (165 lines) [30m] {deps: T170}
  - Define `DecisionNode` interface (id, question, children, action)
  - Type `generateTree(decisions: DecisionRecord[]): DecisionNode`
  - Type `renderTree(node: DecisionNode): string`

- [ ] T172 [W-F] [P] Convert `lib/anchor-generator.ts` (229 lines) [30m] {deps: T042}
  - Define `AnchorTag` type (text, slug, level)
  - Type `extractAnchors(markdown: string): AnchorTag[]`
  - Type `generateTOC(anchors: AnchorTag[]): string`

- [ ] T173 [W-F] [P] Convert `lib/content-filter.ts` (417 lines) [1h] {deps: T042}
  - Type `filterByType(content: string, type: ContentType): string`
  - Define `ContentType` enum: `'CODE' | 'TEXT' | 'DIAGRAM' | 'TABLE'`
  - Type regex-based content detection

- [ ] T174 [W-F] [P] Convert `lib/flowchart-generator.ts` (363 lines) [45m] {deps: T042}
  - Type `generateFlowchart(steps: Step[]): string` (Mermaid output)
  - Define `Step` interface (id, label, next, condition)
  - Type Mermaid syntax builders

- [ ] T175 [W-F] [P] Convert `lib/simulation-factory.ts` (416 lines) [45m] {deps: T042}
  - Type `createSimulation(scenario: Scenario): Simulation`
  - Define `Scenario` interface, `Simulation` output type
  - Type state machine transitions

- [ ] T176 [W-F] [P] Convert `lib/semantic-summarizer.ts` (591 lines) [1h] {deps: T042}
  - Largest lib file — LLM-based summarization
  - Type `summarize(text: string, options?: SummaryOptions): Promise<string>`
  - Define `SummaryOptions` interface (maxLength, style, focus)
  - Type Claude API integration

- [ ] T177 [W-F] Convert `lib/embeddings.ts` re-export stub [10m] {deps: T040}
  - `export * from '../../../shared/embeddings';`
  - Type-safe proxy to shared workspace

- [ ] T178 [W-F] [P] Convert `lib/trigger-extractor.ts` re-export stub [10m] {deps: T041}
  - `export * from '../../../shared/trigger-extractor';`

- [ ] T179 [W-F] [P] Convert `lib/retry-manager.ts` re-export stub [10m] {deps: T139}
  - `export * from '../../../mcp_server/lib/providers/retry-manager';`

---

### Layer 6c: renderers/ (2 files)

- [ ] T180 [W-F] Convert `renderers/template-renderer.ts` (189 lines) [45m] {deps: T042}
  - Type Mustache-like template engine: `{{VAR}}`, `{{#ARRAY}}...{{/ARRAY}}`
  - Define `TemplateContext` type (Record<string, unknown>)
  - Type `render(template: string, context: TemplateContext): string`
  - Type variable substitution, array loops, inverted sections

- [ ] T181 [W-F] Convert `renderers/index.ts` barrel [10m] {deps: T180}

---

### Layer 6d: loaders/ (2 files)

- [ ] T182 [W-F] Convert `loaders/data-loader.ts` (151 lines) [30m] {deps: T042, T161}
  - Type 3-priority data loading chain (arg → file → fallback)
  - Define `DataSource` type: `'argument' | 'file' | 'fallback'`
  - Type `loadData<T>(sources: DataSource[], defaults: T): Promise<T>`

- [ ] T183 [W-F] Convert `loaders/index.ts` barrel [10m] {deps: T182}

---

### Layer 6e: extractors/ (9 files)

- [ ] T184 [W-F] Convert `extractors/conversation-extractor.ts` (204 lines) [30m] {deps: T164, T166}
  - Type `extractConversation(log: string): ConversationTurn[]`
  - Define `ConversationTurn` interface (speaker, message, tools, timestamp)
  - Depends on message-utils and tool-detection

- [ ] T185 [W-F] [P] Convert `extractors/decision-extractor.ts` (295 lines) [45m] {deps: T171, T172}
  - Type `extractDecisions(content: string): DecisionRecord[]`
  - Define `DecisionRecord` interface (id, decision, rationale, alternatives)
  - Depends on decision-tree-generator and anchor-generator

- [ ] T186 [W-F] [P] Convert `extractors/diagram-extractor.ts` (216 lines) [30m] {deps: T174, T171}
  - Type `extractDiagrams(markdown: string): DiagramOutput[]`
  - Define `DiagramOutput` interface (type, code, caption)
  - Depends on flowchart-generator

- [ ] T187 [W-F] [P] Convert `extractors/opencode-capture.ts` (443 lines) [1h] {deps: T042}
  - Type `captureOpencodeReferences(content: string): OpencodeRef[]`
  - Define `OpencodeRef` interface (type, path, context)
  - Type OpenCode framework keyword detection

- [ ] T188 [W-F] [P] Convert `extractors/session-extractor.ts` (357 lines) [45m] {deps: T042}
  - Type `extractSession(log: string): SessionMetadata`
  - Define `SessionMetadata` interface (date, duration, participants, topics)

- [ ] T189 [W-F] Convert `extractors/file-extractor.ts` (235 lines) [30m] {deps: T172, T168}
  - Type `extractFileChanges(content: string): FileChange[]`
  - Define `FileChange` interface (path, operation, diff)

- [ ] T190 [W-F] Convert `extractors/implementation-guide-extractor.ts` (373 lines) [45m] {deps: T189}
  - Type `extractImplementationSteps(content: string): ImplementationStep[]`
  - Define `ImplementationStep` interface (order, description, files, validation)

- [ ] T191 [W-F] Convert `extractors/collect-session-data.ts` (757 lines) [1.5h] {deps: T184-T190, T173, T089}
  - Largest non-test file in scripts/ — assembles all session data
  - Type `collectSessionData(specFolder: string): Promise<SessionData>`
  - Define `SessionData` interface (conversation, decisions, diagrams, implementation, metadata)
  - Orchestrates all 7 extractors + content-filter + mcp_server/core/config
  - Type error handling for partial failures

- [ ] T192 [W-F] Convert `extractors/index.ts` barrel [10m] {deps: T184-T191}

---

### Layer 6f: spec-folder/ (4 files)

- [ ] T193 [W-F] Convert `spec-folder/alignment-validator.ts` (451 lines) [1h] {deps: T042}
  - Type `validateContentAlignment(specFolder: string): AlignmentResult`
  - Define `AlignmentResult` interface (aligned: boolean, mismatches: Mismatch[], score: number)
  - Define `Mismatch` interface (expected, actual, severity)
  - Type alignment scoring algorithm

- [ ] T194 [W-F] Convert `spec-folder/directory-setup.ts` (103 lines) [20m] {deps: T161}
  - Type `setupContextDirectory(specFolder: string): Promise<void>`
  - Type directory creation, permission checks
  - Depends on path-utils

- [ ] T195 [W-F] Convert `spec-folder/folder-detector.ts` (238 lines) [30m] {deps: T089, T193}
  - Type `detectSpecFolder(startPath: string): SpecFolderInfo | null`
  - Define `SpecFolderInfo` interface (path, number, name, depth)
  - Type `filterArchiveFolders(folders: string[]): string[]`
  - Depends on mcp_server/core/config for specs directory constant

- [ ] T196 [W-F] Convert `spec-folder/index.ts` barrel (48 lines) [15m] {deps: T193-T195}
  - Preserve snake_case aliases (CRITICAL for backward compatibility from spec 090):
  - `export { detectSpecFolder as detect_spec_folder };`
  - `export { setupContextDirectory as setup_context_directory };`
  - `export { filterArchiveFolders as filter_archive_folders };`
  - `export { validateContentAlignment as validate_content_alignment };`

---

### Layer 6g: core/ (3 files)

- [ ] T197 [W-F] Convert `core/config.ts` (213 lines) [30m] {deps: T042}
  - Type `CONFIG` object with all configuration constants
  - Type `loadConfig(): WorkflowConfig`
  - Define `WorkflowConfig` interface (specsDir, templatesDir, outputDir, etc.)
  - Type specs directory utilities

- [ ] T198 [W-F] Convert `core/workflow.ts` (550 lines) [1.5h] {deps: T169, T192, T183, T181, T196, T176, T172, T173}
  - 12-step pipeline orchestration — depends on nearly everything
  - Type all 12 pipeline stages with typed inputs/outputs
  - Define `WorkflowState` interface (tracks pipeline progress)
  - Define `WorkflowResult` interface (success: boolean, output: string, errors: Error[])
  - Convert lazy require() → static import (CRITICAL change)
  - Type error recovery and partial completion handling
  - Depends on: utils/, extractors/, loaders/, renderers/, spec-folder/, lib/

- [ ] T199 [W-F] Convert `core/index.ts` barrel [10m] {deps: T197, T198}

---

### Layer 6h: memory/ entry points (3 files)

- [ ] T200 [W-F] Convert `memory/generate-context.ts` (277 lines) [45m] {deps: T198}
  - CLI entry point — argument parsing, spec folder validation
  - Type `main(args: string[]): Promise<void>`
  - Type command-line argument interface
  - Type error handling with exit codes
  - Invokes core/workflow

- [ ] T201 [W-F] [P] Convert `memory/rank-memories.ts` (333 lines) [45m] {deps: T033}
  - Stdin/file reader, folder grouping, scoring
  - Type `main(input: NodeJS.ReadableStream): Promise<void>`
  - Type memory record parsing from JSONL
  - Uses shared/scoring/folder-scoring

- [ ] T202 [W-F] [P] Convert `memory/cleanup-orphaned-vectors.ts` (140 lines) [30m] {deps: T042}
  - Vector index maintenance
  - Type `main(): Promise<void>`
  - Type orphan detection logic
  - Type database cleanup operations

---

### Phase 6 Verification

- [ ] T203 [W-F] Verify full scripts/ compilation and tests [30m] {deps: T200-T202}
  - `tsc --build scripts` compiles with 0 errors
  - All 13 scripts tests pass against compiled output
  - `node scripts/memory/generate-context.js` (compiled) produces valid output
  - `node scripts/memory/rank-memories.js` (compiled) produces ranked output
  - Verify snake_case aliases work: test import both camelCase and snake_case
  - Verify re-export proxies resolve: test imports from lib/embeddings, lib/trigger-extractor, lib/retry-manager

---

## Completion Criteria

- [ ] All 42 tasks marked `[x]`
- [ ] No `[B]` blocked tasks
- [ ] `tsc --build scripts` — 0 errors
- [ ] All 13 scripts tests pass (100% pass rate)
- [ ] CLI smoke tests: generate-context, rank-memories, cleanup-orphaned-vectors all work
- [ ] Snake_case aliases preserved and tested
- [ ] Re-export proxies resolve correctly
- [ ] Lazy require() converted to static import (core/workflow.ts)

---

## Task Dependencies Summary

```
T160-T169 (utils/)          [Independent, depends on T042 (shared/)]
    ↓
T170-T179 (lib/)            [Depends on utils/ for logger, file-helpers]
    ↓
T180-T183 (renderers/loaders/) [Independent from lib/, depends on T042]
    ↓
T184-T192 (extractors/)     [Depends on utils/, lib/, renderers/]
    ↓
T193-T196 (spec-folder/)    [Depends on utils/, mcp_server/core/config]
    ↓
T197-T199 (core/)           [Depends on ALL prior layers]
    ↓
T200-T202 (memory/)         [Depends on core/workflow]
    ↓
T203 (Verification)         [Depends on ALL]
```

---

## Status Updates Log

*(To be filled during implementation)*

### Session 3 — Phase 6

**Agent 7: T160-T179 (utils/ + lib/)**
- Status: Pending
- Evidence:

**Agent 8: T180-T192 (renderers/ + loaders/ + extractors/)**
- Status: Pending
- Evidence:

**Agent 9: T193-T199 (spec-folder/ + core/)**
- Status: Pending
- Evidence:

**Agent 10: T200-T203 (memory/ + verification)**
- Status: Pending
- Evidence:

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Phase 6 Plan:** `phase-7-convert-scripts/plan.md`
- **Master Tasks:** `092-javascript-to-typescript/tasks.md` (T160-T203)
- **Master Checklist:** `092-javascript-to-typescript/checklist.md` (CHK-120 through CHK-132)
