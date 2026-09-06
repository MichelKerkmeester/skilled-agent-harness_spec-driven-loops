# Iteration 1: Audit of runtime/lib and runtime/api

## Focus
Surfaces unopened by the prior lane: `runtime/lib` (validation, graph, description, continuity, parsing, spec, utils, config) and `runtime/api` against the TypeScript style guide (`sk-code-opencode/references/typescript/style-guide/`), universal code quality standards (`sk-code/shared/references/universal/code-quality-standards.md`), and the library module map (`runtime/lib/MODULE-MAP.md`).
Audit angles evaluated: module boundaries, helper duplication vs `@spec-kit/shared`, error handling & streams, dead/retired code, naming conventions, and test coverage floor.

---

## Findings

### F1.1 [P1] Boundary Seam Break: runtime/api directly imports internal handlers bypassing lib discovery seam
- **Code:** `runtime/api/graph-refresh.ts:12`
  ```typescript
  import { findSpecDocuments } from '../handlers/spec-doc-discovery.js';
  ```
- **Violated Clause:** `runtime/lib/MODULE-MAP.md §3.5` ("Forbidden Global Directions: lib/* → handlers/* outside the discovery/ seam", and `runtime/lib/MODULE-MAP.md §4` "Spec Document Discovery: Seam for lib/ callers: lib/discovery/spec-document-finder.ts. Rule: lib/ code imports the seam") and `shared/code-organization/imports-and-exports.md §1`.
- **What is actually present:** `runtime/api/graph-refresh.ts` line 4 states `// @public — scripts should import from here, not handlers/ or lib/ internals`, but line 12 directly imports `findSpecDocuments` across package layers from `../handlers/spec-doc-discovery.js`. A dedicated inward seam `runtime/lib/discovery/spec-document-finder.ts` already exists specifically to insulate external and sibling layers from reaching sideways into handlers.
- **Severity:** P1 (standards violation and architecture boundary break with maintenance coupling).
- **One-line fix:** **mechanical** — update `runtime/api/graph-refresh.ts:12` to import `findSpecDocuments` from `../lib/discovery/spec-document-finder.js`.

### F1.2 [P1] Reverse Layering: runtime/lib depends outward on runtime/cli files and compiled dist directories
- **Code:** `runtime/lib/validation/orchestrator.ts:76-78,230,244-247` and `runtime/lib/validation/spec-doc-structure.ts:104-107`
  ```typescript
  // orchestrator.ts:76-78
  const VALIDATOR_REGISTRY_PATH = path.join(SKILL_ROOT, 'runtime', 'cli', 'lib', 'validator-registry.json');
  const VALIDATOR_RULES_ROOT = path.join(SKILL_ROOT, 'runtime', 'cli', 'rules');
  const VALIDATOR_DIST_VALIDATION_ROOT = path.join(SKILL_ROOT, 'runtime', 'cli', 'dist', 'validation');
  // spec-doc-structure.ts:104-107
  const DEFAULT_FRONTMATTER_ALLOWLIST = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../cli/lib/frontmatter-grandfather-allowlist.json',
  );
  ```
- **Violated Clause:** `runtime/lib/MODULE-MAP.md §1, §3.3, §3.5` (validation may import templates, spec, graph, description, config; Forbidden directions: `lib/* → cli/*`) and `shared/code-organization/imports-and-exports.md §3`.
- **What is actually present:** The core engine library (`runtime/lib/validation`) hardcodes paths pointing outward into the consumer CLI workspace (`runtime/cli/lib/validator-registry.json`, `runtime/cli/rules/*.sh`, `runtime/cli/dist/validation`, and `runtime/cli/lib/frontmatter-grandfather-allowlist.json`). This inverts the architectural hierarchy, coupling a reusable library to the build artifacts and directory layout of a specific consumer CLI.
- **Severity:** P1 (architecture inversion: core library layer depends outward on consumer CLI directory structure and dist output).
- **One-line fix:** **judgment-required** — relocate shared registries/allowlists into `runtime/lib/` or inject rule locations into the orchestrator via `ValidateOpts`.

### F1.3 [P1] Helper Duplication: Custom regex frontmatter parsing in thin-continuity-record.ts and packet-synopsis.ts
- **Code:** `runtime/lib/continuity/thin-continuity-record.ts:108-109,476-486` and `runtime/lib/description/packet-synopsis.ts:52-63`
  ```typescript
  // thin-continuity-record.ts:108-109,476-486
  const FRONTMATTER_RE = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/;
  const BODY_AFTER_FRONTMATTER_RE = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n[\s\S]*?\r?\n---(?:\s*\r?\n|$)?/;
  function extractFrontmatter(markdown: string): { rawFrontmatter: string; body: string } { ... }

  // packet-synopsis.ts:52-63
  function extractFrontmatterDescription(raw: string): string | null {
    const match = raw.match(/^(?:﻿)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---/);
    ...
  }
  ```
- **Violated Clause:** `@spec-kit/shared/frontmatter/parse-frontmatter.ts:5-10` ("Single shared frontmatter parser for every skill that reads a leading `---` fenced block... Before this module each family carried its own regex or indexOf split") and `shared/code-organization/imports-and-exports.md §1` (Reuse shared modules).
- **What is actually present:** Despite `@spec-kit/shared/frontmatter/parse-frontmatter` being created specifically as the single authoritative parser to eliminate divergent regexes, both `thin-continuity-record.ts` and `packet-synopsis.ts` hand-roll their own regexes for leading frontmatter block extraction. (Note: this is distinct from the previously documented `frontmatter-migration.ts` duplication in the CLI).
- **Severity:** P1 (standards violation and parser duplication risking subtle divergence across CRLF and comment-prefix edge cases).
- **One-line fix:** **mechanical** — replace custom regexes in `thin-continuity-record.ts` and `packet-synopsis.ts` with calls to `parseFrontmatter(content)` from `@spec-kit/shared/frontmatter/parse-frontmatter`.

### F1.4 [P1] Inconsistent Stream Usage in CLI Entry Point: spec-doc-structure.ts emits standard data payload to stderr
- **Code:** `runtime/lib/validation/spec-doc-structure.ts:1250-1256,1337`
  ```typescript
  // spec-doc-structure.ts:1250-1256
  function emitTsv(result: RuleResult): void {
    process.stderr.write(`rule\t${result.rule}\n`);
    process.stderr.write(`status\t${result.status}\n`);
    process.stderr.write(`message\t${result.message}\n`);
    for (const diagnostic of result.diagnostics) {
      process.stderr.write(`detail\t${diagnostic.code}: ${diagnostic.detail}\n`);
    }
  }
  // spec-doc-structure.ts:1337
  if (options.output === 'json') {
    process.stderr.write(`${JSON.stringify(result, null, 2)}\n`);
  }
  ```
- **Violated Clause:** `universal/code-quality-standards.md §3 P0#4` / OpenCode CLI conventions (`shell/quality-standards/validation-security-and-shellcheck.md §3` & `typescript/quality-standards/tsdoc-errors-and-async.md`).
- **What is actually present:** In `spec-doc-structure.ts`, the CLI entrypoint (`if (import.meta.url === file://${process.argv[1]})`) emits normal, successful programmatic output (both TSV format and JSON format) to `process.stderr` while exiting with code 0 (`return 0`). Downstream consumers redirecting stdout capture empty output, and pipelines checking stderr encounter false diagnostics.
- **Severity:** P1 (stream contract inconsistency in public CLI execution path).
- **One-line fix:** **mechanical** — change `process.stderr.write` to `process.stdout.write` for success output in `emitTsv` and JSON serialization branches.

### F1.5 [P1] Swallowed Exceptions Bypassing Validation Checks
- **Code:** `runtime/lib/validation/generated-metadata-integrity.ts:150-154` and `runtime/lib/validation/spec-doc-structure.ts:527-529`
  ```typescript
  // generated-metadata-integrity.ts:150-154
  let expected: string | null = null;
  try {
    expected = computeSourceFingerprintForFolder(path.dirname(filePath));
  } catch {
    expected = null;
  }
  // ...
  if (expected && storedFingerprint !== expected) { // bypassed if expected is null
  ```
- **Violated Clause:** `universal/code-quality-standards.md §3 P0#4` ("No silent failures — exceptions either surface to the caller or are logged with enough context to debug").
- **What is actually present:** In `generated-metadata-integrity.ts`, when `computeSourceFingerprintForFolder` throws (e.g. read failure or corrupt document), the exception is swallowed and `expected` is set to `null`. At line 197, `if (expected && storedFingerprint !== expected)` quietly skips reporting a mismatch, allowing uncomputable fingerprints to silently pass. Similarly, in `spec-doc-structure.ts:527-529`, allowlist JSON parse errors are swallowed silently.
- **Severity:** P1 (silent failure suppresses integrity violation reporting on damaged or unparseable files).
- **One-line fix:** **judgment-required** — emit a `SOURCE_FINGERPRINT_UNCOMPUTABLE` or `ALLOWLIST_UNPARSEABLE` diagnostic instead of swallowing the exception.

### F1.6 [P1] Test Coverage Floor: runtime/api entry point lacks dedicated test suite in runtime/tests
- **Code:** `runtime/api/index.ts` and `runtime/api/graph-refresh.ts`
- **Violated Clause:** `sk-code-quality/SKILL.md` & `universal/code-quality-standards.md §4 P1#2` ("Test coverage at boundaries — happy path plus at least one edge case per public surface").
- **What is actually present:** `runtime/api/` is declared as the primary public entry point for `@spec-kit/runtime/api`. However, `runtime/tests/` contains no test file verifying `api/index.ts` exports or `api/graph-refresh.ts` resolution logic directly (`runtime/tests/api-validation.vitest.ts` tests unrelated key validation). The fallback resolution order in `graph-refresh.ts` (direct candidate, `SPEC_KIT_SPECS_DIR`, `findSpecDocuments`, canonical candidate, legacy `.opencode/specs`, and the throw on unresolved path) lacks boundary test coverage within the package test suite.
- **Severity:** P1 (coverage floor gap on declared public surface).
- **One-line fix:** **judgment-required** — add `runtime/tests/api-graph-refresh.vitest.ts` testing happy path resolution, environment variable overrides, and the error case for invalid paths.

### F1.7 [P2] Header & Section Banner Conformance Gaps Across runtime/lib
- **Code:** `runtime/lib/graph/access-telemetry.ts:1`, `runtime/lib/graph/generated-metadata-drift.ts:1`, `runtime/lib/graph/graph-metadata-parser.ts:1`, `runtime/lib/graph/graph-metadata-schema.ts:1`, `runtime/lib/spec/is-phase-parent.ts:1`, `runtime/lib/utils/canonical-path.ts:1`, `runtime/lib/utils/exhaustiveness.ts:1`, `runtime/lib/utils/index-scope.ts:1`, `runtime/lib/context/shared-payload.ts:1`, `runtime/lib/parsing/content-normalizer.ts:164,182`, `runtime/lib/extraction/entity-extractor.ts:23`
- **Violated Clause:** `typescript/style-guide/overview-strict-and-naming.md §2` (Header box width: 67 characters total: `// ` + 64 box characters) and `§4 Section Organization` (standard numbered section dividers `// 1. IMPORTS`, `// 2. TYPE DEFINITIONS`, etc.).
- **What is actually present:** Multiple modules use 66-character divider lines (`// ` + 63 dashes) instead of 67 characters, completely omit numbered section dividers (`access-telemetry.ts`, `is-phase-parent.ts`, `canonical-path.ts`, `exhaustiveness.ts`, `index-scope.ts`, `shared-payload.ts`), break section dividers with blank lines (`content-normalizer.ts:164,182`), or place exported functions (`normalizeEntityName`) before Section 1 (`entity-extractor.ts:23`).
- **Severity:** P2 (cosmetic styling and section-banner convention deviations).
- **One-line fix:** **mechanical** — format header boxes to 67 characters, add standard numbered section banners, and remove blank lines inside dividers.

### F1.8 [P2] Mixed snake_case and camelCase in description-schema.ts
- **Code:** `runtime/lib/description/description-schema.ts:28,66`
- **Violated Clause:** `typescript/style-guide/overview-strict-and-naming.md §5` (Naming conventions: camelCase for object properties in TypeScript).
- **What is actually present:** In `perFolderDescriptionSchema`, property `trigger_phrases` is declared with `snake_case` while all other properties (`specFolder`, `folderSlug`, `parentChain`, `memorySequence`, `memoryNameHistory`) use standard `camelCase`.
- **Severity:** P2 (naming inconsistency in public schema definition).
- **One-line fix:** **judgment-required** — document `trigger_phrases` as an intentional compatibility property with frontmatter or provide camelCase mapping.

---

## Sources Consulted
- `runtime/api/graph-refresh.ts:12`
- `runtime/api/index.ts:1-103`
- `runtime/lib/validation/orchestrator.ts:76-78,230,244-247`
- `runtime/lib/validation/spec-doc-structure.ts:104-107,527-529,1250-1256,1337`
- `runtime/lib/validation/generated-metadata-integrity.ts:150-154`
- `runtime/lib/continuity/thin-continuity-record.ts:108-109,476-486`
- `runtime/lib/description/packet-synopsis.ts:52-63`
- `runtime/lib/description/description-schema.ts:28,66`
- `runtime/lib/parsing/content-normalizer.ts:164,182`
- `runtime/lib/extraction/entity-extractor.ts:23`
- `runtime/lib/MODULE-MAP.md §1, §3, §4`
- `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md §2, §4, §5`
- `sk-code/shared/references/universal/code-quality-standards.md §3, §4`

---

## Assessment
- **newInfoRatio:** 1.0
- **Novelty justification:** First systematic pass over `runtime/lib` and `runtime/api`; uncovered 6 P1 deviations (seam bypass in `graph-refresh.ts`, reverse layering in `orchestrator.ts`/`spec-doc-structure.ts`, duplicate frontmatter regexes in continuity/synopsis, stderr output in validation CLI, swallowed integrity exceptions, and missing API test suite) and 2 P2 deviations not surfaced by prior lanes.
- **Confidence:** High (verified by direct code citations and standards comparison across all cited lines).

---

## Reflection
- **What worked:** Tracing cross-layer imports from `api` and `lib` to `handlers` and `cli` revealed multiple boundary inversions and duplicate parsing that isolated file reviews missed.
- **What failed:** Type-checking check for `: any` returned almost zero matches (`runtime/lib` has disciplined TypeScript types); TS type-safety is largely conforming.
- **Ruled out:** `runtime/lib/discovery/spec-document-finder.ts` is an intentional seam for inward dependencies, not an illegal handler import.

---

## Recommended Next Focus
Iteration 2: Audit `runtime/hooks` (claude, codex, cursor, devin, lib), `.cjs` and `.mjs` scripts under `runtime/cli` outside retrieval, and `shared/**` beyond frontmatter and path containment against error handling, hook conventions, and standards.
