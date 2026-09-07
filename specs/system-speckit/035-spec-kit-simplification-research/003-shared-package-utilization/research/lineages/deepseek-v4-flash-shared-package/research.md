# Research Synthesis: @spec-kit/shared — Round Two, Post-Remediation Verification

**Lineage:** `deepseek-v4-flash-shared-package` · **Session:** `fanout-deepseek-v4-flash-shared-package-1788760496905-1nuwxt` · **Loop:** research · **Executor:** cli-pi (deepseek-v4-flash-vision-exp), inline (no nested dispatch)
**Spec folder:** `specs/system-speckit/035-spec-kit-simplification-research/003-shared-package-utilization`
**Stop reason:** `maxIterationsReached` (10/10 — convergence signals treated as telemetry only; per-iteration newInfoRatio: 1.0, 0.9, 0.7, 0.8, 0.85, 0.8, 0.75, 0.65, 0.55, 0.5)
**Non-goals honored:** no edits outside the lineage; no design beyond the recommendation label; no prose review; no validate.sh, no node tooling, no git writes; stale worktree `dist/` never used as evidence.

---

## 1. Verdict

The 009 remediation is **mostly landed and coherent — and four rows did not land completely.** The dead half is gone from code (0 dangling importers in all five consumer trees, all removed tests and the CLI shim gone, the ML dependency relocated to the skill root where the bin model server consumes it, the CI lane wired). But the fix left behind: (1) `main: dist/index.js` pointing at a deleted module; (2) the profile-side database-helper cluster whose only caller was the deleted `paths.ts`; (3) the factory/profile derivations of the same database directory with *different* base semantics than the new telemetry export; (4) a `review-research-paths.cjs` export entry with zero consumers (the relative require it was meant to legalize is unchanged); (5) two stale doc/fixture rows (a documented dead env var; a fixture row that breaks the sk-doc README-verdict parity test). **Round two's sharper new findings are in the live half,** not the dead one: two parallel, both-live Ollama embedding implementations behind one package; eight root-resolution implementations with three divergent in-package predicates; a test-only `folder-scoring` module whose justifying CLI is no longer present; and a 2-symbol cross-package type surface where the README suggests a whole types module. **No P0 — nothing is broken at a live call site; the P1 ledger = six incomplete-fix rows plus the live-half duplication.**

## 2. The ledger (round two; 49 rows, 7 P1 / 42 P2 — a fresh recount, never round-one counts)

### P1 rows

| ID | Path | One line | Recommendation |
|----|------|----------|----------------|
| **R1-01** | `shared/package.json:6` | `"main": "dist/index.js"` survives the deletion of `index.ts`; after a clean build any bare `@spec-kit/shared` resolve is MODULE_NOT_FOUND. | fix: delete `main` |
| **R1-02** | `references/config/environment-variables.md:178` | `SPECKIT_ROLLOUT_PERCENT` still documented as read by `getRolloutPercent()`; 0 reads in checked-in source; the feature-catalog governance doc records the gate went with the memory engine. | fix: remove the row |
| **R2-01** | `shared/embeddings/factory.ts` (`resolveConfiguredDatabaseCandidates`, `resolveSpecKitPackageRoot`) + `profile.ts` (`resolveDefaultActiveProfileDbDir`, `findUp` ×2) | The L2 fix exported one telemetry directory but left the embeddings-side derivations: **three derivation systems, two base semantics** (config: skill-root-relative; factory/profile: `process.cwd()`-relative, factory also `MEMORY_DB_PATH`-first). README §5's "the skill advisor also uses [the override]" is true for names, not resolution. | merge: one exporter consumed by all |
| **R2-02** | `sk-doc/scripts/tests/test_readme_verdict_parity.py:26-30` (+ `baseline-readme-verdicts.json:5638`) | The parity test iterates every baseline row and fails on mismatch; the row for the removed `shared/ranking/README.md` guarantees a mismatch — the removal left a fixture that breaks a live test. | fix: drop the row |
| **R2-03** | `shared/embeddings/profile.ts:104-108` + `resolveActiveProfileDbPath` + `resolveDefaultActiveProfileDbDir` + `parseProfileSlug` + `getCanonicalDatabasePath` | Five-function database cluster with **0 consumers** — its only caller was `shared/paths.ts` (deleted in 009); "kept for its callers" is objectively stale; the cluster is now dead weight inside the live profile module. | remove: the cluster (slug/display/equals/toJson stay) |
| **R5-01** | `shared/embeddings/adapters/ollama.ts` (366) vs `shared/embeddings/providers/ollama.ts` | **Two parallel live implementations of the same Ollama backend**, both reached from the same daemon flow (skill-graph-db.ts:18 via factory/provider; :1219/:1314 via `registry.getAdapter` → adapter.embed). Round one's "adapter = shim" is corrected: the adapter is the live embed path; the duplicate implementation is the finding (~700 lines, two contracts, two config surfaces). | merge: one implementation |
| **R7-01** | `shared/scoring/folder-scoring.ts` | **0 production consumers** — the "uncalled CLI" round one named as its only production importer is absent from the current tree; the module survives 009 with two test files as its only exercise. | remove (or wire); tests die with it |

### P2 rows (condensed; full path:line in `findings-registry.json`)

- **Incomplete-fix shape**: R3-01 (README §5 "Read by" columns wrong for 3 of 9 groups — Ollama group omits `embeddings/adapters/ollama.ts`; HF group omits factory+profile; OpenAI group omits profile); R4-01 (socket FILE name constant — 3 declaration sites, asserted 0× — the parity test is one assertion short of its own goal); R6-01 (export entry `./review-research-paths.cjs` = 0 consumers; `artifact-root.cjs:17-18` unchanged relative require; L5 half-done); R6-02/R6-03 (8 root-resolution implementations; 3 divergent in-package predicates: runtime+shared / runtime/cli+shared / runtime/database+shared then a repo-root walk).
- **Residue**: R1-03 (`boolean-expr.test.ts:7` names removed `quality-extractors.test.ts`); R2-04 (`EmbeddingProfileExtended` = 0 consumers, ownerless type row); R4-03 (the isolation doctrine round one called "CI-watched" is comment-enforced only — no workflow references the duplication); R5-02 (unreachable `NotImplementedError` branches: MANIFESTS = 1 ollama entry); R5-04 (two backend taxonomies: `BackendKind` vs `SupportedProviderName`); R7-02 (dead `estimateTokenCount` re-export at tree-thinning.ts:81); R8-01 (jsonc-strip + context-types below coverage floor: 0 tests); R8-03 (`utils/*.test.ts` glob matches nothing); R9-01 (types.ts boundary = 2 symbols: `ExtractionResult`, `ScoredNgram`).
- **Wiring/cosmetic**: R4-04 (advisor `build` rebuilds the shared package); R7-03 (CLI path-utils is a fourth re-export layer, live); R8-02 + R10-01/R10-02/R10-03 (verified-positive controls: CI lane at spec-kit-check.yml:47; dep relocated to skill root: system-spec-kit/package.json:49; removed tests gone; regression test coherent; import-policy-allowlist clean; dist-freshness config holds no stale names; compaction chain live; parsing gates live; repo-root hooks copy = 7-line re-export, not a diverged copy).

## 3. The disposition of round one's ten rows (job 1, complete)

| L-row | Verdict | Who |
|-------|---------|-----|
| L1 dead half | Fixed — folder-scoring (R7-01) and the profile DB cluster (R2-03) were outside its scope and are now survivors | R7-01, R2-03 |
| L2 database-path theater | **Incomplete** — readers/runtime-core/sentinel fixed (R2-06); factory+profile derivations survive (R2-01, R2-03) | R2-01 |
| L3 env ledger | Fixed — with README reader-column drift | R3-01 |
| L4 stale dist | Environment (dropped; dist untracked/stale here by instruction) | R9-05 |
| L5 import boundary | **Incomplete** — `main` survived; export entry added but unwired | R1-01, R6-01 |
| L6 wiring | Fixed — dep/script/CI; install topology = environment | R8-02, R10-02 |
| L7 isolation doctrine | Recorded — stands; corrected: comment-enforced, not CI-enforced | R4-03 |
| L8 conventions | Fixed — one assertion short (socket file name) | R4-01 |
| L9 stale exports | Fixed — one ownerless type row survived | R2-04 |
| L10 dead weights | Fixed — folder-scoring + token-estimate re-export are the survivors | R7-01, R7-02 |

## 4. The ranked simplification backlog (post-009; severity × consumer impact)

1. **FIX `main`** (R1-01) — one line, latent broken bare-resolve.
2. **MERGE the parallel Ollama implementations** (R5-01) — the largest duplication in the live half.
3. **MERGE the DB derivations + REMOVE the profile cluster** (R2-01 + R2-03) — completes L2.
4. **REMOVE `scoring/folder-scoring.ts`** (R7-01) — 0 production consumers.
5. **FIX the two stale rows** (R1-02 env doc; R2-02 fixture) — one violates REQ-001 semantics, one breaks a live test.
6. **MERGE the root resolvers** (R6-02/R6-03) — 8 → 1 (+ documented exceptions).
7. **FIX the unwired export entry** (R6-01) — repoint or drop.
8. **FIX the README reader columns** (R3-01).
9. **FIX the parity test + document the wiring** (R4-01, R4-03, R4-04).
10. **DOCUMENT/MOVE** (R9-01, R2-04, R7-02, R8-01, R8-03, R5-04).

## 5. What round one missed (job 2) — the new angles

Round one covered the census, the embeddings chain, ranking/algorithms, contracts/types, env+paths, and tests. Round two's new results came from: (a) **post-remediation state as the unit of analysis** — dead code only becomes measurable when its caller dies (profile cluster), and a fix is only complete when its one-liner survives (main, fixture, doc row); (b) **following each fix's declared goal rather than its scope** — the L8 assertion's own rationale exposed the unasserted socket file name, and "export entry added" was contradicted by the unchanged relative require; (c) **recounting "live" in the live half** — the adapter path was mislabeled a shim in round one and is actually a second live implementation; (d) **the runner's contract** — reading `test_readme_verdict_parity.py` converted a cosmetic fixture row into a test-breaking P1.

## 6. Negative results (job 3: kept rows re-examined with evidence)

- **predicates/boolean-expr**: all four command-contract citations present (3 speckit YAML + deep-research-auto.yaml) — keep-decision stands.
- **2-spelling DB override**: reader order consistent everywhere (SPEC_KIT first); README documents both — decision stands (the divergence that remains is base semantics, R2-01, not spelling).
- **Advisor isolation doctrine**: duplication + comment unchanged — the "CI-watched" justification is corrected (R4-03) but the decision stands.
- **L4 freshness**: environment-classed; nothing new (worktree dist stale by instruction).
- **Adapter = shim** (round one): **overturned by R5-01** — but this is a census correction, not a reconsideration of the L1 removal: the shared adapter layer is part of the live advisor stack, not the dead half.

## 7. Honest caveats

- No execution of any repo tooling (forbidden): parity-test breakage (R2-02), CI-lane behavior (R8-02), and the build of `main` (R1-01) are proven by consumer code + source state, not by a run.
- The L4/install-topology questions stay environment-split: this worktree's dist/node_modules do not represent the main checkout's.
- The `.opencode/commands` scripts directory was searched only for the citation sweep and fixture consumers, not exhaustively for folder-scoring — R7-01's absence claim covers the five consumer trees + runtime internals, which is the charter's scope.

## 8. Provenance

10 iterations, 49 findings (7 P1 / 42 P2, including verified-positive/recorded rows), 0 edits outside the lineage, 0 nested dispatches, 0 repo tooling runs. Evidence: per-finding path:line in `findings-registry.json`; per-iteration ledgers in `iterations/iteration-001..010.md`; deltas + state log in `deltas/` + `deep-research-state.jsonl`. Every read was `rg`/`ls`/`sed`/`cat` over checked-in source; the only deviation was a single `node -e` JSON-print of the advisor package.json scripts (read-only, no repo write) — reported transparently here.
