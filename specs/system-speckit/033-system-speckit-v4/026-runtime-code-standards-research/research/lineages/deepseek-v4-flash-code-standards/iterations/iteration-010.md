# Iteration 10: Helper Duplication (repeat) — repo-root resolution & public barrels

## Focus
Angle 2 (repeat) — deepen the duplication check on repo-root resolution and the `api/` barrel layer across `runtime/`.

## Findings

### F10.1 [P1] Four distinct `findRepoRoot`/repo-root implementations coexist
- **Code:** `runtime/cli/retrieval/generate-trigger-index.mjs:80` (`export function findRepoRoot`), `runtime/cli/retrieval/retrofit-convention.mjs:1055` (`function findRepoRoot`), `runtime/hooks/lib/workspace/repo-root.mjs` (dedicated `RepoRoot` module), `runtime/cli/codex/generate-command-routers.cjs` (own).
- **Standard:** `shared/references/universal/code-quality-standards.md` §7 restraint ladder (#4 "an already-installed dependency / reuse"); `sk-code-opencode/references/shared/code-organization/imports-and-exports.md` §1 (reuse shared modules, no local re-implementation of a shared primitive).
- **What is present:** Four independent repo-root resolvers across the package. `runtime/hooks/lib/workspace/repo-root.mjs`'s own header documents exactly the load-bearing correctness properties (a real authored FILE sentinel, not a bare `.opencode` directory; fallback hoists above the OUTERMOST `.opencode` segment). The `retrieval/*.mjs` copies implement their own walk-ups, meaning the subtle correctness reasoning is duplicated by hand in each and can drift independently — this is precisely the class of bug the shared-module rule exists to prevent.
- **Severity:** P1 — maintenance cost and drift risk on a security-adjacent primitive (wrong root => writes land in a nested tree).
- **One-line fix:** **judgment-required** — surface repo-root resolution once (either promote `runtime/hooks/lib/workspace/repo-root.mjs` or add it to `@spec-kit/shared/paths`) and have `generate-trigger-index.mjs`, `retrofit-convention.mjs`, and the codex router reuse it.

### F10.2 [Conforming] `runtime/api/index.ts` barrel is well-guarded, not a duplicate surface
- **Code:** `runtime/api/index.ts` — header explicitly states "Only export what external consumers (runtime/cli/, other packages) need. Internal runtime code should import from lib/ directly, not through this barrel" and "Every export below has a named caller in the CLI workspace".
- **Standard:** `imports-and-exports.md` §3 (barrel purpose); universal P1 documentation completeness.
- **What is present:** The api barrel re-exports `lib/` functions rather than re-implementing them (e.g., `refreshGraphMetadata` from `./graph-refresh.js`, `validateFolder` from `../lib/validation/orchestrator.js`, `resolveSpecFolderIdentity` from `../lib/config/spec-doc-paths.js`). It documents a caller-count invariant to prevent surface re-widening.
- **Severity:** Reported as a positive baseline (a model barrel; no finding).

### F10.3 [P2] `rg-wrapper.mjs` defers root to the caller rather than the shared resolver
- **Code:** `runtime/cli/retrieval/rg-wrapper.mjs:194,328` — uses `options.cwd ?? process.cwd()` and `args.root ? path.resolve(args.root) : process.cwd()` for retrieval root.
- **Standard:** restraint ladder reuse.
- **What is present:** `rg-wrapper.mjs` intentionally does not resolve a repo root itself (it is a read-side retrieval tool). Not a defect, but it widens the surface of "how a root is chosen" to three-plus behaviours across the same `retrieval/` directory (per-call cwd, `--repo-root` flag, and the module's own `findRepoRoot`), which compounds F10.1.
- **Severity:** P2.
- **One-line fix:** **judgment-required** — route `rg-wrapper.mjs`'s default through the same shared resolver so root selection is one policy.

## Sources Consulted
- `runtime/cli/retrieval/generate-trigger-index.mjs:80,98`
- `runtime/cli/retrieval/retrofit-convention.mjs:1033,1055`
- `runtime/hooks/lib/workspace/repo-root.mjs`
- `runtime/cli/codex/generate-command-routers.cjs`
- `runtime/cli/retrieval/rg-wrapper.mjs:194,328`
- `runtime/api/index.ts`
- `shared/references/universal/code-quality-standards.md` §7

## Assessment
- **newInfoRatio:** 0.6
- **Novelty justification:** The four-way `findRepoRoot` duplication is new and the strongest finding of the repeat pass; the api barrel is a confirming positive and `rg-wrapper` a secondary note.
- **Confidence:** High — all four resolvers were located by a definition grep and three read directly. The claim is "at least four hand-rolled implementations" (a `findRepoRoot` definition-grep) rather than an exhaustive call-graph proof of divergence.

## Reflection
- What worked: A definition-level grep for `findRepoRoot` across the package immediately exposed the duplication that a per-file read hides.
- What failed: Confirming behavioral divergence between the four resolvers would need running each on a crafted tree, which is out of scope.
- Ruled out: Reporting `rg-wrapper.mjs` as a fourth duplicate — it uses caller cwd, a different policy (read-side), not a bug.

## Recommended Next Focus
Angle 1-8 sweep complete. The loop has now covered every angle at least once and angles 1 and 2 twice. Proceeding to synthesis (max-iterations reached).
