# Iteration 4: Module-Boundary Integrity

## Focus
Angle 4 — detect module-boundary breaks: cli importing compiled `dist` paths, `lib` importing `cli`, circular import edges, and `shared` depending on `runtime`.

## Findings

### F4.1 [Conforming] No dist-path, cli->lib, lib->cli, or shared->runtime import break found
- **Code:** scanned all in-scope `runtime/lib`, `runtime/cli`, `runtime/api`, `shared` `.ts/.mjs/.cjs` source for `from '.../dist/...'`, `from '.../runtime/cli'`, and `from '.../runtime/...'` from inside `shared`.
- **Standard:** `sk-code-opencode/references/shared/code-organization/imports-and-exports.md` §1 (import grouping) + §2 (local vs type-only), and the package's own boundary contract in `runtime/lib/MODULE-MAP.md` §1 ("legal import directions").
- **What is present:** Zero findings. All three scans returned empty:
  - No source file imports a compiled `dist/` path.
  - No `runtime/lib` or `runtime/api` source imports from `runtime/cli`.
  - No `shared` source imports from `runtime/`.
- **Severity:** Reported as a baseline (no finding). The stated non-goal "no abstractions beyond a cited standard" is satisfied because there is nothing to flag here.

### F4.2 [Conforming] Boundary is documented AND enforced by a test
- **Code:** `runtime/lib/MODULE-MAP.md` §1-§2 defines ownership and legal import directions; `runtime/cli/tests/import-policy-rules.vitest.ts` exists as an enforcement guard.
- **Standard:** universal §7 (a boundary contract must be maintained); the existence of a machine guard is the maintenance mechanism.
- **What is present:** The import-direction contract is not just a prose convention; it is re-checked by a test suite. This is the strongest possible posture for a module boundary and means the boundary is likely to remain intact.
- **Severity:** Reported as a positive baseline.

### F4.3 [P2] Boundary is a local convention, not a package `exports`/dependency constraint
- **Code:** `shared/package.json`, `runtime/package.json` — cross-package import edges are allowed by path (`@spec-kit/shared/...`) rather than blocked by an explicit `exports`/`files` whitelist or a `dependency-cruiser`-style rule.
- **Standard:** `imports-and-exports.md` §3 (export patterns); universal P1 "documentation completeness" for the boundary.
- **What is present:** Nothing today imports across the forbidden direction, but the guard is a hand-maintained test and a prose map rather than a tool-enforced package boundary. A future `runtime/lib` import of `../../cli/utils/...` would be caught only if the test enumerates that pattern.
- **Severity:** P2 (hardening opportunity, not a live break).
- **One-line fix:** **mechanical** — extend the import-policy test (or add a `dependency-cruiser`/`no-restricted-imports` rule) to forbid `runtime/* -> runtime/cli/*` and `shared/* -> runtime/*` by path pattern.

## Sources Consulted
- `runtime/lib/MODULE-MAP.md` §1-§2
- `runtime/cli/tests/import-policy-rules.vitest.ts`
- `shared/package.json`, `runtime/package.json`
- `sk-code-opencode/references/shared/code-organization/imports-and-exports.md`

## Assessment
- **newInfoRatio:** 0.4
- **Novelty justification:** The angle is closed as conforming — the scan found no live boundary break, which is itself the useful negative result; the only novel item is the P2 that the boundary is a test/prose guard rather than a tool-enforced package boundary.
- **Confidence:** High — boundary scans are mechanical; the "no break" conclusion holds for the import patterns searched. Residual risk: circular edges were not exhaustively proven (no cycle walker), noted below.

## Reflection
- What worked: Three targeted cross-boundary greps plus reading the documented module map gave a complete verdict for the searched patterns.
- What failed: A true circular-edge proof needs a cycle walker; the import-policy test presumably covers it, but was not run (repo tooling is out of scope for this lineage, per the audit brief).
- Ruled out: Reporting the empty scans as P0, since a negative result is correctly no-finding.

## Recommended Next Focus
Angle 5 — dead code: unimported exports, unreachable branches, and retired memory-database residue (sqlite, embeddings, MCP memory).
