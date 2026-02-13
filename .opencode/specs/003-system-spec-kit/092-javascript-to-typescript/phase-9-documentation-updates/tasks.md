# Tasks: Phase 8 — Documentation Updates

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-I
> **Level:** 3
> **Created:** 2026-02-07

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |

---

## Stream 8a: READMEs (7 files)

- [ ] T280 [W-I] [P] Update `system-spec-kit/README.md` (713 lines, 5 JS refs) [30m] {deps: T157, T203}
  - Update Node.js requirement note: mention TypeScript compilation step
  - Update script references: `.js` → `.ts` in source code references
  - Update build instructions: add `npm run build` before running scripts
  - Note: `node` commands still execute compiled `.js` files

- [ ] T281 [W-I] [P] Update `shared/README.md` (453 lines, 44 JS refs) [2h] {deps: T042}
  - **Architecture diagram:** Rewrite from CommonJS to ES module syntax
    - `require('./embeddings')` → `import { embed } from './embeddings'`
    - `module.exports = { ... }` → `export { ... }`
  - **Code examples:** Convert all 15+ code blocks to TypeScript
    - Add type annotations to function parameters and return types
    - Add interface definitions where applicable
    - Show `import type { ... }` for type-only imports
  - **Directory structure:** Update listing to show `.ts` files (source-focused view)
  - **Provider documentation:** Update import syntax in provider usage examples
  - **Note:** Add explanation that compiled output is CommonJS (source is ES modules)

- [ ] T282 [W-I] [P] Update `mcp_server/README.md` (1,066 lines, 56 JS refs) [2h] {deps: T157}
  - **Directory structure listing:** Update 50+ `.js` → `.ts` entries
    - Example: `lib/cognitive/fsrs-scheduler.js` → `lib/cognitive/fsrs-scheduler.ts`
  - **Module description table:** Add type information to descriptions
    - Example: "FSRS scheduler (calculateRetrievability, updateStability)" → "FSRS scheduler with typed FSRS v4 parameters"
  - **Code examples:** Convert 10+ examples to TypeScript
  - **Test running instructions:** Note TypeScript compilation happens automatically before tests
  - **Tool definitions:** Show typed tool input schemas where applicable

- [ ] T283 [W-I] [P] Update `scripts/README.md` (703 lines, 59 JS refs) [2h] {deps: T203}
  - **Directory structure listing:** Update 40+ `.js` → `.ts` entries
  - **"JavaScript Modules" section:** Rename to "TypeScript Modules"
  - **Code examples:** Convert CLI invocation examples
    - Show source file as `.ts`
    - Show execution command as `node scripts/memory/generate-context.js` (compiled)
  - **Module descriptions:** Add type information
    - Example: "workflow.js: 12-step pipeline" → "workflow.ts: 12-step pipeline with typed stage inputs/outputs"

- [ ] T284 [W-I] [P] Update `config/README.md` (176 lines, 6 JS refs) [15m] {deps: T203}
  - Update path references: `.js` → `.ts` where referring to source
  - Update script execution examples (compiled `.js` execution)

- [ ] T285 [W-I] [P] Update `templates/README.md` (179 lines, 3 JS refs) [15m] {deps: T203}
  - Update template file references: `.js` → `.ts`
  - Update script invocation examples

- [ ] T286 [W-I] [P] Update `constitutional/README.md` (751 lines, 1 JS ref) [10m] {deps: T157}
  - Update single reference to memory system architecture file

---

## Stream 8b: SKILL.md (1 file)

- [ ] T287 [W-I] Update SKILL.md (883 lines) [1h] {deps: T157, T203}
  - **Line 167:** "Canonical JavaScript modules" → "Canonical TypeScript modules"
  - **Script path references:** Update generate-context reference
    - Source: `scripts/memory/generate-context.ts`
    - Execution: `node scripts/memory/generate-context.js` (compiled)
  - **Architecture descriptions:** Update module counts if changed
    - Verify barrel index files didn't change total exposed module count
  - **Code examples:** Convert any inline code snippets to TypeScript
  - **Resource inventory:** Update to reflect `.ts` files in project structure
  - **Language description:** Add TypeScript compilation note to workflow description

---

## Stream 8c: References — Memory (6 files)

- [ ] T288 [W-I] [P] Update `references/memory/embedding_resilience.md` (422 lines, 10+ JS blocks) [1.5h] {deps: T042}
  - **Code blocks (10+):** Convert all JavaScript examples to TypeScript
    - Provider chain fallback example: add `ProviderTier` enum, `FallbackReason` type
    - Retry logic example: add `RetryConfig` interface, typed Promise return
    - Health tracking example: add typed health state interface
  - **File path references:** Update `.js` → `.ts` for source files
  - **Architecture table:** Update module references to TypeScript

- [ ] T289 [W-I] [P] Update `references/memory/memory_system.md` (594 lines, 8+ JS blocks) [1.5h] {deps: T157}
  - **Code blocks (8+):** Convert to TypeScript
    - Crypto hash usage: `Buffer.from(...).toString('hex')` → typed Buffer handling
    - State management: enum examples for `TierState`, `ConsolidationPhase`
    - Memory record examples: `MemoryRecord` interface with all fields typed
  - **Architecture table:** Update module references

- [ ] T290 [W-I] [P] Update `references/memory/save_workflow.md` (539 lines) [30m] {deps: T203}
  - **Script paths:** Update to `.ts` source references
  - **Node.js invocation:** Note compilation step where applicable
  - **Workflow diagrams:** Update file extensions in flowchart boxes

- [ ] T291 [W-I] [P] Update `references/memory/trigger_config.md` (345 lines) [30m] {deps: T041}
  - **Code blocks (3):** Convert remaining JavaScript examples to TypeScript
    - Trigger extraction example: show `TriggerPhrase` type, `ExtractionStats` interface
    - Regex pattern example: `readonly RegExp[]` type annotation
    - Trigger matching example: `TriggerMatch[]` return type

- [ ] T292 [W-I] [P] Update `references/memory/epistemic-vectors.md` (396 lines, 1 ref) [5m]
  - Update single reference to vector index module

- [ ] T293 [W-I] [P] Update `references/memory/index` or other memory refs if they exist [15m]
  - Scan for additional memory reference files not in master list
  - Update any discovered files following same pattern

---

## Stream 8d: References — Other (8 files)

- [ ] T294 [W-I] [P] Update `references/structure/folder_routing.md` (572 lines) [30m] {deps: T203}
  - **Code blocks (2):** Convert JavaScript examples to TypeScript
    - Folder detection logic: add typed return values
    - Path validation: show typed string manipulation
  - **Script paths:** Update to `.ts` source references

- [ ] T295 [W-I] [P] Update `references/debugging/troubleshooting.md` (461 lines) [30m] {deps: T157}
  - **Code blocks (5):** Convert JavaScript debug examples to TypeScript
    - Error handling: show typed `MemoryError` with `ErrorCode`
    - Stack trace examples: update file extensions
    - REPL examples: show type checking in Node.js REPL

- [ ] T296 [W-I] [P] Update `references/config/environment_variables.md` (200 lines) [15m] {deps: T157, T203}
  - **`node` command references:** Update where showing script execution
  - Note compilation step where applicable

- [ ] T297 [W-I] [P] Update `references/workflows/execution_methods.md` (256 lines) [15m] {deps: T203}
  - Update script path references
  - Update execution workflow to include TypeScript compilation

- [ ] T298 [W-I] [P] Update `references/workflows/quick_reference.md` (609 lines) [15m] {deps: T203}
  - Update quick command references: script paths
  - Update file extension filters where applicable

- [ ] T299 [W-I] [P] Update `references/validation/phase_checklists.md` (182 lines) [10m] {deps: T203}
  - Update validation script references
  - Update file type filters

- [ ] T300 [W-I] [P] Update `references/templates/template_guide.md` (1,060 lines) [15m] {deps: T203}
  - Update template script references
  - Update code examples if templates include code snippets

- [ ] T301 [W-I] [P] Update `references/templates/level_specifications.md` (755 lines) [10m] {deps: T203}
  - Update script references in level definitions

---

## Stream 8e: Assets (1 file)

- [ ] T302 [W-I] [P] Update `assets/template_mapping.md` (463 lines) [10m] {deps: T203}
  - Update script path references in template mapping table
  - Update any code examples showing template usage

---

## Stream 8f: Changelog

- [ ] T303 [W-I] Update system-spec-kit `CHANGELOG.md` — full migration entry [30m] {deps: T271}
  - **Migration Summary:** Document all phases completed (0-9)
  - **Architecture Decisions:** List all 8 decisions (D1-D8) with brief rationale
    - Reference `decision-record.md` for full details
  - **Infrastructure:** Document TypeScript setup (tsconfig, project references, build scripts)
  - **Migration Phases:** One-line summary of each phase's scope
  - **Changed:** Source files .js → .ts, documentation code examples
  - **Added:** shared/types.ts, sqlite-vec.d.ts, TS standards docs, build pipeline
  - **Preserved:** Backward-compatible exports, compiled output behavior, file paths, configs, security
  - **Performance:** Build time, startup time, response time, output size
  - **Cross-reference:** Link to decision-record.md for full architectural context

---

## Completion Criteria

- [ ] All 24 tasks (T280-T303) marked `[x]`
- [ ] All code examples compile with `tsc --noEmit` (spot-check 10 files)
- [ ] All path references point to existing files (automated check)
- [ ] All internal links resolve (automated check)
- [ ] CHANGELOG.md references all 8 decisions from decision-record.md
- [ ] 10 high-impact files manually reviewed for accuracy

---

## Cross-References

- **Plan:** `plan.md` (Phase 8 execution strategy)
- **Checklist:** `checklist.md` (CHK-150 through CHK-169)
- **Parent Plan:** `../plan.md` (Phase 8, lines 331-347)
- **Parent Tasks:** `../tasks.md` (T280-T303 master list)
