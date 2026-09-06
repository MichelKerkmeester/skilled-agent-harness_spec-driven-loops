# Iteration 2: Audit of runtime/hooks, runtime/cli Scripts, and shared/**

## Focus
Audit of previously unopened surfaces: `runtime/hooks` (claude, codex, cursor, devin, lib, pi), `.cjs` and `.mjs` scripts under `runtime/cli` outside retrieval, and `@spec-kit/shared` beyond frontmatter and path containment.
Standards evaluated: hook authoring and reachability conventions (`sk-code-opencode/references/shared/hooks.md`), universal code quality standards (`sk-code/shared/references/universal/code-quality-standards.md`), JavaScript style guide (`sk-code-opencode/references/javascript/style-guide.md`), and TypeScript style guide (`sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md`).
Audit angles evaluated: error handling & swallowed rejections, path resolution bugs, dead code residue, module boundary inversions, and test script parity.

---

## Findings

### F2.1 [P0/P1] Path Resolution Bug: Off-by-one REPO_ROOT in migrate-deep-loop scripts targets non-existent paths
- **Code:** `runtime/cli/migrate-deep-loop-legacy-owner-map.cjs:12-13,82,201` and `runtime/cli/migrate-deep-loop-local-owner.cjs:14,16-17`
  ```javascript
  // migrate-deep-loop-legacy-owner-map.cjs:11-13
  const SCRIPT_DIR = __dirname;
  const REPO_ROOT = path.resolve(SCRIPT_DIR, '../../../../');
  const ROOT_SPEC = '.opencode/specs/system-spec-kit/026-graph-and-context-optimization';
  // ...
  walk(REPO_ROOT); // walks only .opencode/
  const rootResearchDir = path.join(REPO_ROOT, ROOT_SPEC, 'research'); // .opencode/.opencode/specs/...
  ```
- **Violated Clause:** `universal/code-quality-standards.md §3 P0#2` (Input and path validation) and `universal/code-quality-standards.md §3 P0#1` (Correctness / Initialization safety).
- **What is actually present:** In both migration scripts, `SCRIPT_DIR` is `<repo>/.opencode/skills/system-spec-kit/runtime/cli` (5 levels below repository root). Resolving `'../../../../'` steps up only 4 directories, landing at `<repo>/.opencode` instead of the repository root. Consequently:
  1. `migrate-deep-loop-legacy-owner-map.cjs` constructs `path.join(REPO_ROOT, ROOT_SPEC, ...)` resulting in `<repo>/.opencode/.opencode/specs/...`, which fails `fs.existsSync()` and halts migration.
  2. `walk(REPO_ROOT)` traverses only `.opencode/`, missing all files in the rest of the workspace.
  3. `migrate-deep-loop-local-owner.cjs` checks `.opencode/.opencode/specs` and `.opencode/specs`, never finding the canonical top-level `specs/` directory.
- **Severity:** P0/P1 (critical path resolution bug causing script execution failure and missed file modifications).
- **One-line fix:** **mechanical** — change `path.resolve(SCRIPT_DIR, '../../../../')` to `path.resolve(SCRIPT_DIR, '../../../../..')` in both files.

### F2.2 [P1] Swallowed Unhandled Rejections in Claude, Devin, and Codex Stop Hook Adapters
- **Code:** `runtime/hooks/claude/completion-evidence-stop.cjs:146`, `runtime/hooks/devin/completion-evidence-stop.cjs:128`, and `runtime/hooks/codex/completion-evidence-stop.cjs:133`
  ```javascript
  main().catch(() => approve());
  ```
- **Violated Clause:** `universal/code-quality-standards.md §3 P0#4` ("No silent failures — exceptions either surface to the caller or are logged with enough context to debug").
- **What is actually present:** While the prior lane fixed `main().catch(() => {})` in the Cursor hook adapter (`runtime/hooks/cursor/completion-evidence-response.mjs:65-68`) to log error details to `process.stderr`, the sibling Stop hook adapters for Claude, Devin, and Codex still terminate with `main().catch(() => approve())`. Any unexpected exception during hook execution (such as payload malformation, syntax errors, or filesystem access failures) is completely swallowed without any diagnostic output.
- **Severity:** P1 (silent failure hides broken sentinel execution across three runtime hook adapters).
- **One-line fix:** **mechanical** — update `main().catch(...)` to log error diagnostics to `process.stderr` before exiting cleanly via `approve()`, replicating the cursor fix.

### F2.3 [P1] Dead Code Residue: Uncalled wave orchestration modules in runtime/cli/lib
- **Code:** `runtime/cli/lib/wave-lifecycle.cjs`, `runtime/cli/lib/wave-segment-planner.cjs`, `runtime/cli/lib/wave-segment-state.cjs`, `runtime/cli/lib/wave-coordination-board.cjs`, and `runtime/cli/lib/wave-convergence.cjs`
- **Violated Clause:** `universal/code-quality-standards.md §1 Design Restraint Ladder (YAGNI)`, `shared/code-organization/imports-and-exports.md §3` (Dead Code / Unimported Exports), and `.opencode/skills/system-deep-loop/deep-research/SKILL.md §4` ("Wave orchestration is reference-only; intra-lineage wave orchestration is forbidden").
- **What is actually present:** Five CommonJS modules (comprising ~1,500 lines of complex state, planning, and coordination code) exist under `runtime/cli/lib/`. None of these modules have any production caller across `system-spec-kit` or the repository. They are imported exclusively by unit tests written specifically for them (`runtime/cli/tests/deep-loop-wave-*.vitest.ts`) and by internal cross-requires among themselves. Because wave orchestration is explicitly forbidden and classified as reference-only, these files are dead code.
- **Severity:** P1 (large surface of uncalled dead code adding maintenance overhead and cognitive burden).
- **One-line fix:** **judgment-required** — remove or archive the five `wave-*.cjs` modules and their associated unit tests.

### F2.4 [P1] Architecture Boundary Inversion: @spec-kit/shared hardcodes knowledge of runtime/database
- **Code:** `shared/config.ts:25,32,43` and `shared/paths.ts:64,80,147-156`
  ```typescript
  // shared/config.ts:32
  const DEFAULT_DB_DIR = path.join(PACKAGE_ROOT, 'runtime', 'database');
  // shared/paths.ts:80
  const productionDatabaseDir = path.join(resolveImportMetaRelativePackageRoot(), 'runtime', 'database');
  ```
- **Violated Clause:** `shared/code-organization/imports-and-exports.md §1, §3` (Module boundary breaks: shared depending on runtime) and `universal/code-quality-standards.md §1`.
- **What is actually present:** `@spec-kit/shared` is intended to be the foundational, platform-independent layer upon which `@spec-kit/runtime` builds. However, both `shared/config.ts` and `shared/paths.ts` hardcode paths into `runtime/database`. `shared/paths.ts:147` notes that this was inherited from the retired spec-kit memory server. This creates an architectural inversion where the shared library assumes the internal filesystem layout of a consumer package.
- **Severity:** P1 (package-layer boundary inversion coupling shared utility library to runtime internals).
- **One-line fix:** **judgment-required** — remove hardcoded `runtime/database` paths from `shared/` and require database directories to be passed via configuration options or environment variables.

### F2.5 [P1] Correctness / Telemetry Desynchronization: gate-3-classifier does not consult access-telemetry.json
- **Code:** `shared/gate-3-classifier.ts:505-517`
  ```typescript
  function getLastActiveChildId(folderPath: string): string | null {
    const metadata = readJsonRecord(path.join(folderPath, 'graph-metadata.json'));
    // ...
    const candidate = derivedRecord?.last_active_child_id ?? metadata.last_active_child_id;
    return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate.trim() : null;
  }
  ```
- **Violated Clause:** `runtime/lib/MODULE-MAP.md §2, §4` (Generator hardening splits `last_active_child_id` to `access-telemetry.json` via `resolveLastActiveChildFromStore`), and `universal/code-quality-standards.md §3 P0#1` (Correctness).
- **What is actually present:** Under generator hardening (`isGeneratorHardeningEnabled()`), the `last_active_child_id` pointer was moved out of `graph-metadata.json` and into `access-telemetry.json` to prevent dirtying generated files on read/resume. However, `shared/gate-3-classifier.ts` inspects only `graph-metadata.json`. Consequently, the classifier fails to observe the active child on hardened phase parents, leading to false `phase_parent_without_active_child` validation rejections during Gate 3 evaluation.
- **Severity:** P1 (subtle cross-layer desynchronization causing Gate-3 classifier to fail on valid phase parents).
- **One-line fix:** **judgment-required** — update `getLastActiveChildId` in `gate-3-classifier.ts` to inspect `access-telemetry.json` before falling back to `graph-metadata.json`.

### F2.6 [P1] Test Script Parity Deficit in @spec-kit/shared
- **Code:** `shared/package.json:18-19`
  ```json
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit --composite false -p tsconfig.json",
    "test": "echo 'No tests in shared workspace'",
    "test:task-enrichment": "echo 'No task-enrichment tests in @spec-kit/shared'"
  }
  ```
- **Violated Clause:** `sk-code-quality/SKILL.md` & `universal/code-quality-standards.md §4 P1#2` ("Test coverage at boundaries").
- **What is actually present:** While unit test files exist in the `shared` directory (`shared/frontmatter/parse-frontmatter.test.ts`, `shared/embeddings/profile.test.ts`, `shared/embeddings/registry.test.ts`, `shared/parsing/quality-extractors.test.ts`, `shared/parsing/spec-doc-health.test.ts`, `shared/predicates/boolean-expr.test.ts`), `shared/package.json` specifies `"test": "echo 'No tests in shared workspace'"`. Running package-level tests silently skips all existing test suites. Furthermore, major shared modules like `budget-allocator.ts`, `chunking.ts`, `gate-3-classifier.ts`, `ranking/learned-combiner.ts`, and `scoring/folder-scoring.ts` have no direct unit tests in the package.
- **Severity:** P1 (test runner script is a dummy echo, disabling CI test execution in the shared package).
- **One-line fix:** **mechanical** — update `shared/package.json` `"test"` script to run `vitest run` and add unit test coverage for uncovered modules.

### F2.7 [P2] Retired SQLite Error Residue in shared/utils/retry.ts
- **Code:** `shared/utils/retry.ts:74-75`
  ```typescript
  /SQLITE_BUSY/,   // SQLite database is locked/busy
  /SQLITE_LOCKED/, // SQLite table is locked
  ```
- **Violated Clause:** `universal/code-quality-standards.md §1 Design Restraint Ladder (YAGNI)` & Angle 5 (retired memory-database residue).
- **What is actually present:** `TRANSIENT_ERROR_PATTERNS` retains regex patterns for `SQLITE_BUSY` and `SQLITE_LOCKED`. SQLite storage has been retired from system-spec-kit in favor of markdown and JSON artifacts; these regexes are obsolete residue.
- **Severity:** P2 (retired technology residue).
- **One-line fix:** **mechanical** — delete lines 74-75 from `shared/utils/retry.ts`.

### F2.8 [P2] Header and Directive Placement Inconsistencies in CLI Scripts
- **Code:** `runtime/cli/lib/wave-convergence.cjs:1-5`, `runtime/cli/metrics/fable-metrics.cjs:1-5`, `runtime/cli/check-markdown-links.cjs:4-6`, `runtime/cli/validation/ephemeral-pointer-audit.mjs:2-31`
- **Violated Clause:** `sk-code-opencode/references/javascript/style-guide.md §2, §3` and `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md §2`.
- **What is actually present:** In `wave-convergence.cjs` and `fable-metrics.cjs`, `'use strict';` is placed on line 1 before the boxed module header block, violating the requirement that files begin with the boxed header immediately followed by `'use strict';`. In `check-markdown-links.cjs`, the header uses an unadorned filename title rather than `// MODULE:`. In `ephemeral-pointer-audit.mjs`, the boxed header is entirely replaced by a docstring block.
- **Severity:** P2 (cosmetic formatting and header convention divergences).
- **One-line fix:** **mechanical** — place boxed headers on line 1 followed by `'use strict';` and adopt the standard `// MODULE:` template.

---

## Sources Consulted
- `runtime/cli/migrate-deep-loop-legacy-owner-map.cjs:11-13,82,201`
- `runtime/cli/migrate-deep-loop-local-owner.cjs:13-18`
- `runtime/hooks/claude/completion-evidence-stop.cjs:146`
- `runtime/hooks/devin/completion-evidence-stop.cjs:128`
- `runtime/hooks/codex/completion-evidence-stop.cjs:133`
- `runtime/hooks/cursor/completion-evidence-response.mjs:65-68`
- `runtime/cli/lib/wave-lifecycle.cjs:1-30`
- `runtime/cli/lib/wave-convergence.cjs:1-45`
- `runtime/cli/lib/wave-coordination-board.cjs:1-30`
- `shared/config.ts:23-44`
- `shared/paths.ts:60-85,147-156`
- `shared/gate-3-classifier.ts:505-525`
- `shared/package.json:15-20`
- `shared/utils/retry.ts:74-75`
- `runtime/cli/metrics/fable-metrics.cjs:1-10`
- `runtime/cli/check-markdown-links.cjs:1-10`
- `runtime/cli/validation/ephemeral-pointer-audit.mjs:1-15`
- `sk-code-opencode/references/shared/hooks.md §1-3`
- `sk-code-opencode/references/javascript/style-guide.md §2-3`
- `universal/code-quality-standards.md §1, §3, §4`

---

## Assessment
- **newInfoRatio:** 0.90
- **Novelty justification:** First audit of `runtime/hooks`, `runtime/cli` scripts outside retrieval, and `shared/**`. Uncovered 1 P0/P1 path resolution defect, 5 P1 deviations (unhandled rejection swallowing in 3 stop hooks, 5 dead wave-orchestration modules, inverted shared-to-runtime database dependency, Gate-3 telemetry desynchronization, and disabled shared package tests), and 2 P2 cosmetic/residue findings.
- **Confidence:** High (all findings verified with exact line numbers, code snippets, and standard citations).

---

## Reflection
- **What worked:** Inspecting the actual directory depth of scripts using `path.resolve(__dirname, ...)` immediately exposed the off-by-one path computation in the migration scripts. Comparing sibling hook implementations revealed that the Cursor hook fix had not been propagated to Claude, Devin, or Codex.
- **What failed:** Looking for live production invocations of `wave-*.cjs` confirmed that wave orchestration is completely dead in this repo — zero callers exist outside its own tests.
- **Ruled out:** `shared/ipc/socket-server.ts` is not dead code (it is exported and consumed by the skill-advisor daemon).

---

## Recommended Next Focus
Loop cap reached (`maxIterations=2`). Proceed directly to `phase_synthesis` to consolidate findings into `research/research.md`, produce `resource-map.md`, and record the terminal state record with `stopReason: "maxIterationsReached"`.
