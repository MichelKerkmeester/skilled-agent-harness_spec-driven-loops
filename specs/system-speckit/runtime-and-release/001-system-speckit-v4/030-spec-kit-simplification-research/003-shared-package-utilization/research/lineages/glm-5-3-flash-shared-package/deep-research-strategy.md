---
title: Deep Research Strategy — @spec-kit/shared Dependency-and-Utilization Audit
description: Persistent research plan for the glm-5-3-flash-shared-package fan-out lineage.
---

# Deep Research Strategy — glm-5-3-flash-shared-package

## Research Topic

Dependency-and-utilization audit of `@spec-kit/shared` (`.opencode/skills/system-spec-kit/shared`), a package exported via `index.ts` + `package.json` to five consumer trees (`system-spec-kit/runtime`, `system-skill-advisor`, `system-deep-loop`, `sk-doc`, `.opencode/bin`), which predates the memory database's retirement and may retain residue from that era. Role: dependency-and-utilization auditor — every module judged by what actually imports and calls it, never by its stated or README-claimed purpose. Non-goals: no edits; no redesign beyond the recommendation label; no prose-style review. Exactly 10 iterations, no early convergence (convergence signal = telemetry only).

## Known Context

- Ground truth surface: `.opencode/skills/system-spec-kit/shared/` — 33 impl modules + 11 test files + `types.ts` + `index.ts` (11.8 KB barrel) + `README.md` (27 KB) + `package.json` (export map: `.`/`main`, `./compact-merger`, `./budget-allocator`, `./embeddings`, `./workspace/repo-root.mjs`, wildcard `'./*.js'`+`'./*'` → `dist/`), ~33.5k lines TS source.
- Dependency wiring: all five trees declare `file:` deps; only two have installed `node_modules/@spec-kit/shared` symlinks in this worktree (skill-advisor `mcp-server`, runtime `cli`); others resolve via ancestor walk (realpath through the parent checkout) or the runtime vitest alias `@spec-kit/shared → ../shared` (`runtime/vitest.config.ts:31-33`) — tests import SOURCE, production imports `dist/`.
- First-pass census (pre-init): 132 package-import statements across the five trees; zero importers of the bare root `@spec-kit/shared`; `'@spec-kit/shared/index'` exactly 2; `contracts/retrieval-trace`, `predicates/boolean-expr`, `utils/retry`, `parsing/quality-extractors`, `ranking/matrix-math` have no direct package-specifier importer.
- Resolution escapes: `runtime/hooks/lib/spec-gate/spec-gate-core.mjs:54` + `cursor/spec-gate-prebind.mjs:25` + skill-advisor `gate3-corpus-runner.mjs:7` import `shared/dist/gate-3-classifier.js` via relative paths, bypassing the export map; deep-loop `runtime/lib/deep-loop/artifact-root.cjs:17-19` requires `shared/review-research-paths.cjs` via `path.join(__dirname, ...)` — that file has no export-map entry at all.
- Memory-DB residue hints: `config.ts` reads `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR` (two spellings); `paths.ts:118-126` doc-comment says the retired memory server owned the directory and the env var is "still spelled MEMORY_DB_PATH"; `embeddings/factory.ts` reads `vec_metadata`/`vec_memories_rowids`/per-embedder vector shards from `runtime/database/*.sqlite`; `embeddings.ts` is a 35.6 KB monolith whose barrel (`'@spec-kit/shared/embeddings'`) has exactly 1 importer (`runtime/cli/lib/embeddings.ts`, itself a re-export shim).
- `dist/` freshness: marker `.dist-freshness-…-84cc09eabb25.json` (mtime 12:13Z) predates all `shared/**.ts` source mtimes (16:29:35Z); `dist/gate-3-classifier.js` 11:29Z vs source 16:29Z. The checking machinery exists (`runtime/cli/lib/dist-freshness.cjs`, consulted by `bin/skill-advisor.cjs`, `finalize-dist.mjs`, `session-start-advisories.ts`, 3 test files) but the committed marker+dist predate the current sources in this worktree.
- Duplicate-derivation smell: THREE package-root resolvers inside the package (`config.ts:20-32` private, `paths.ts:66-117` exported, `embeddings/factory.ts` `resolveSpecKitPackageRoot()`) plus a FOURTH root resolver with different semantics (`workspace/repo-root.mjs`, git-aware) and a downstream re-derivation in `runtime/core/config.ts:97-110` of the `.db-updated` sentinel that `shared/config.ts` already derives.

## Key Questions

- q-census: For each of the 33 in-scope surfaces — who imports it (external+live, internal-only, orphan)? Complete census, no unverified claims.
- q-embeddings: After the memory-DB retirement, what in `embeddings/` + `embeddings.ts` still has a live consumer (skill-advisor daemon, hf-local model server, runtime) versus dead providers/adapters/registries/weighting?
- q-rank: Do `ranking/`, `scoring/`, `algorithms/`, `budget-allocator.ts` feed live retrieval, or only tests?
- q-boundary: Which `contracts/` + `context-types.ts` (+`types.ts`) symbols cross the package boundary versus stay internal?
- q-layout: Where does shared code assume runtime or database layout (or vitest) it should not know, and what duplication does that cause?
- q-env: Which env vars and paths do `config.ts`/`paths.ts`/embeddings resolve, and who reads each?
- q-tests: What test coverage does each module have against the coverage floor, and which tests are fossils of retired surfaces?
- q-removal: What is the ranked remove/merge/move backlog that breaks no live consumer?

## Answered Questions

- q-census ✓ — (iter 1, refined 2-6) 33 surfaces: 24 externally imported; 4-7 confirmed importless (quality-extractors, boolean-expr, retry, retrieval-trace, the F3.1 quartet's non-rrf half, the F6.3 island).
- q-embeddings ✓ — (iter 2) live = advisor→factory→providers, traced end-to-end; the 1,011-line monolith + its barrel + the runtime shim = a three-layer corpse; the persisted-ollama precedence can never fire (0×vec_memories_rowids).
- q-rank ✓ — (iter 3) 1,334 of 2,645 ranking/fusion lines = production-uncalled; rrf-fusion = 1 advisor import; budget-allocator = the compact hook; folder-scoring = an uncalled CLI.
- q-boundary ✓ — (iter 4) ≈10 of 38 types.ts symbols cross; retrieval-trace = 0 consumers (incl. the twice-defined DegradedModeContract); gate-3 = 3-4 of 27 exports.
- q-layout ✓ — (iter 2+4+6) six root-resolvers; 4 derivations of the .db-updated/telemetry-store path; the already-diverged hooks copy of repo-root.mjs.
- q-env ✓ — (iter 6) 24 reads vs 7 declared; the 2-spelling family ×4; the launcher's CHILD_ENV_ALLOWLIST = a second, unenforced env contract.
- q-tests — (iter 5, finalizing 7-8) the quartet + 2 islands are kept alive only by their own tests.
- q-removal — (iter 10: the ranked backlog; the candidate set is complete).

## What Worked

- Rooting every census grep at the five tree paths explicitly (`.opencode`-rooted runs silently skip the trees' contents).
- Terminating each import chain in a runner (advisor handler / registered hook / isMainModule CLI / no-caller) — "imported" and "live" finally separated (iters 2-3).
- Reading shim/registry/README-module headers before assuming shimness: the advisor's isolation doctrine, the scripts-registry's self-described re-export, and repo-root.mjs's design rationale were all invisible to import-census (iters 5-6).
- Positive-evidence controls: the 0-hit `vec_memories_rowids` census, the 0-importer counts, and the Barrel's own duplication comment did half the ledger's work.
- Empirical resolution probes (`node -e require.resolve` ×2) converted the dependency-wiring question from assumption to observation (iter 1).

## What Failed

- Function-usage counts without tiering (tests/JSON fixtures initially counted as production) — corrected by tiering every hit before writing (iter 2).
- The first env census included `dist/` (a 1,200-line compiled vanishing-module line) — re-run with source-only filters (iter 6).
- Same-named modules (the two validate-memory-quality.ts) resist census-level attribution; the -l hit for index-scope.ts turned out to be a comment — both caught by reading the import blocks before writing (iters 3, 5).

## Exhausted Approaches

- `.opencode`-rooted rg as the census method (interior symlinks) — retired in favor of per-tree rooting (iter 1).
- Treating the export map as the import boundary — four mechanisms documented; the map predicts nothing (iter 1).
- Tiering production vs tests by filename alone — the same-named validator pair and the comment-only references required read-back (iters 3, 5).

## Ruled-Out Directions

- The parsing/memory tier as retired functionality (live gates, retired names — F5.2).
- The skill advisor as isolation-strict (73-line duplicate under CI, 35 KB direct — F5.5).
- The runtime as a production embeddings consumer (dead shim; tests via the vitest alias — F2.1/F1.6).
- repo-root.mjs as git-aware; chunking as the compaction path; the context-type semantics duplicated in the runtime; the advisor consuming the shared gate-3 root machinery or the shared intent profiles (F6.2, F6.4, F4.2, F4.3, F3.2).

## Divergence Frontier

- Resolved (iter 2): the vec_metadata convention = advisor-owned (schema.ts writes it, the launcher points MEMORY_DB_PATH at it); the factory's persisted-pointer precedence = inert against that store (no vec_memories_rowids, no getVectorShardPath shard).
- Resolved (iters 3-6): the second-order chains — the compact-hook→compact-merger→budget-allocator chain is LIVE; the embeddings-shim/barrel/monolith chain is DEAD; trigger-extractor terminates in the save-flow extractors via a registered pass-through; folder-scoring's only production importer is an uncalled CLI.
- Open: the dist-freshness source-hash recompute (F1.7) — the committed marker (12:13Z) predates the 16:29Z source mtimes; the hash scheme lives in runtime/cli/lib/dist-freshness.cjs.
- Open: the dependency trio's (js-yaml / @modelcontextprotocol/sdk / @huggingface/transformers) in-shared importers; the no-op `test:task-enrichment` script; the test-coverage census vs the floor (q-tests final); the memory-era residue sweep for fossils of the retired DB.

## Next Focus

None — the loop is complete (10/10, `maxIterationsReached`). The synthesis: `research.md`; the deduped ledger: `findings-registry.json` (53 F-rows → 10 P1 L-rows + 23 P2); the convergence: `convergence-report.json`; the session record: `synthesis-record.json`. The final adversarial re-probes (iteration 10): no root node_modules (F1.5's mechanism = stays inference-flagged); no hook registration in the root opencode.json (F9.5's outside-the-audit caveat stands); `vecTableNameForDim(dim)` = `vec_${dim}` = the factory's expectedTable convention — the inert-branch failure = precisely the `vec_memories_rowids` gate (F2.4 sharpened).
