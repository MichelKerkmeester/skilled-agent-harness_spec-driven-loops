# r2-14 angle: wiring / import-boundary

**Angle summary:** The 026 scripts-to-handlers import-boundary concern is real, CI-enforced and correctly resolved. A direct reuse of the `handlers/quality-loop.ts` scorer from `scripts/dq` would violate the boundary, and the `@spec-kit/mcp-server/api` barrel route 026 chose is a live, already-used escape that clears every gate in `npm run check`.

**Slice verdict:** CLEAN. The 026 reasoning holds against live code. The four findings below are confirmations and two design-precision advisories. No P0 or P1.

---

## FINDING 1 (P2 advisory, VINDICATED): the scripts to handlers boundary is real and wired into CI

The boundary 026 relies on exists and is enforced, not just documented.

- `scripts/evals/import-policy-rules.ts:12-16` declares `PROHIBITED_PACKAGE_IMPORTS` containing `@spec-kit/mcp-server/lib`, `@spec-kit/mcp-server/core` and `@spec-kit/mcp-server/handlers`.
- `scripts/evals/import-policy-rules.ts:18-19` declares `RELATIVE_INTERNAL_RUNTIME_IMPORT_RE = /^\.\.(?:\/\.\.)*\/(?:mcp_server\/(?:lib|core|handlers)|shared)(?:$|\/)/`, so a relative `../../mcp_server/handlers/...` path is caught too.
- `scripts/package.json:19` wires the enforcer into the `check` target: `npx tsx evals/check-no-mcp-lib-imports.ts && bash check-api-boundary.sh && npx tsx evals/check-architecture-boundaries.ts ... && npx tsx evals/check-no-mcp-lib-imports-ast.ts`.

**Class:** LIVE-CODE. The spec premise in `026-shared-safe-fix-engine/spec.md` §7 that names `import-policy-rules.ts` as the definer and `check-no-mcp-lib-imports.ts` as the enforcer matches the tree exactly.

---

## FINDING 2 (P2 advisory, VINDICATED): direct handler reuse violates, the api-barrel route is real and live

Reusing the scorer the naive way is blocked, and the chosen route is proven in use.

- The scorer is exported at `mcp_server/handlers/quality-loop.ts:747` (`export { computeMemoryQualityScore, ... }`) and defined at `:392`. This matches the spec's `quality-loop.ts:392,747` citation exactly.
- A `scripts/dq` import of `@spec-kit/mcp-server/handlers/quality-loop` is caught by `PROHIBITED_PACKAGE_IMPORTS`, and a relative `../../mcp_server/handlers/quality-loop.js` is caught by `RELATIVE_INTERNAL_RUNTIME_IMPORT_RE`. Both forms violate.
- The barrel route resolves: `scripts/tsconfig.json:11` maps `"@spec-kit/mcp-server/api": ["../mcp_server/api/index.ts"]`, and `@spec-kit/mcp-server/api` is NOT in the prohibited list nor matched by the relative regex.
- The route is already live, not theoretical. Existing scripts consume the barrel: `scripts/spec-folder/generate-description.ts`, `scripts/core/workflow.ts`, `scripts/evals/run-performance-benchmarks.ts`, `scripts/memory/rebuild-auto-entities.ts`, `scripts/memory/cleanup-orphaned-vectors.ts` and `scripts/memory/reindex-embeddings.ts`.
- The barrel's own header at `mcp_server/api/index.ts:4-7` states the intent the route depends on: "@public ... external consumers (scripts/, other packages) ... Consumer scripts import from '@spec-kit/mcp-server/api' instead of lib/."

**Class:** LIVE-CODE.

---

## FINDING 3 (P2 advisory, SPEC-PREMISE gap): REQ-008 under-names the gate set, but the route still clears all of it

REQ-008 acceptance in `026-shared-safe-fix-engine/spec.md` §4 says the engine "passes `check-no-mcp-lib-imports`", naming only the single regex checker. The live `check` target runs a broader suite: `check-no-mcp-lib-imports.ts`, `check-no-mcp-lib-imports-ast.ts` (`scripts/package.json:18-19`), `check-api-boundary.sh` and `check-architecture-boundaries.ts`. I verified the api-barrel route passes every one of them, so this is a documentation completeness gap, not a correctness defect.

- The AST checker cannot follow the package barrel into `handlers/`. `scripts/evals/check-no-mcp-lib-imports-ast.ts` `registerLocalDependency` returns early on any non-relative import (`if (!isLocalRelativeImport(importPath)) return;`), so `@spec-kit/mcp-server/api` is never queued as a re-export target.
- Its `resolveLocalImportTarget` further constrains follow targets to inside `SCRIPTS_ROOT` via a realpath containment check (`realCandidate.startsWith(realScriptsRoot)`), and `parsedByFile` is built only from `findTsFiles(SCRIPTS_ROOT)` at line 362. `mcp_server/api/index.ts` is never parsed, so the `../handlers/quality-loop.js` re-export inside the barrel is invisible to the transitive walk.
- `check-architecture-boundaries.ts:14-16` enforces only GAP A (shared/ neutrality) and GAP B (mcp_server/scripts wrapper-only). Neither touches `scripts/dq` importing the api barrel.

**Class:** SPEC-PREMISE. The premise is sound on outcome, the gate list it cites is incomplete.

---

## FINDING 4 (P2 advisory, design precision): the 026 edit adds the first handlers-sourced re-export to the @public barrel

The "Files to Change" row in `026-shared-safe-fix-engine/spec.md` §3 modifies `mcp_server/api/index.ts` to re-export `computeMemoryQualityScore` from `../handlers/quality-loop.js`. Today every re-export in `mcp_server/api/index.ts` sources from a sibling api module (`./eval.js`, `./indexing.js`, `./search.js`, `./providers.js`, `./storage.js`) or from `../lib/...`. There are zero `../handlers/...` re-exports in the barrel. The 026 edit would introduce the first one.

- This is mechanically permitted. `check-api-boundary.sh` blocks only `lib/ -> api/` (its `RELATIVE` grep targets `lib/` importing `api/`), and `check-architecture-boundaries.ts` GAP A/B do not cover `api -> handlers`. So no gate rejects it.
- It is a mild layering smell. The pure scorer is the one symbol the @public surface would pull from the handler layer rather than from `lib/`. A cleaner route relocates the pure `computeMemoryQualityScore` into `lib/` (it already imports only `../lib/eval/eval-db.js` and `../lib/search/search-flags.js` per `quality-loop.ts:4-5`) and re-exports it through the barrel from there, preserving the barrel's lib-only sourcing pattern. This is advisory and does not block the 026 route.

**Class:** LIVE-CODE (current barrel state) plus SPEC-PREMISE (proposed modification).

---

## Evidence checked

- `scripts/evals/import-policy-rules.ts` (prohibited list and relative regex)
- `scripts/evals/check-no-mcp-lib-imports.ts` (regex enforcer, transitive local re-export scan)
- `scripts/evals/check-no-mcp-lib-imports-ast.ts` (AST enforcer, local-scripts-only transitive follow)
- `scripts/evals/check-architecture-boundaries.ts` (GAP A/B scope)
- `scripts/check-api-boundary.sh` (lib -> api one-way)
- `scripts/evals/import-policy-allowlist.json` (no scorer exception, all four entries past `expiresAt`, out of this slice)
- `scripts/package.json:18-19` (check target wiring)
- `scripts/tsconfig.json:11,13` (api alias mapping)
- `mcp_server/api/index.ts` (barrel surface, zero handlers re-exports)
- `mcp_server/handlers/quality-loop.ts:4-5,392,747` (scorer imports, definition, export)
- `scripts/core/post-save-review.ts:573` (`reviewPostSaveQuality` export, the legal intra-scripts reuse)
- `026-shared-safe-fix-engine/spec.md` §3, §4 REQ-008, §7, §10
- Confirmed `scripts/dq/` does not exist yet (program is research-only)
