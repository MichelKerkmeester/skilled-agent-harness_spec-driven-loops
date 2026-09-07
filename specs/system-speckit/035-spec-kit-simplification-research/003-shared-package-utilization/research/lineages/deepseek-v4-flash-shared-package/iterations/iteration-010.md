# Iteration 10: Final reconciliation — every confirmed-findings row vs the current tree, and the ranked backlog

## Focus

Close the loop: verdict per confirmed-findings L-row (fixed / incomplete / environment / recorded), the fresh post-009 finding ledger, and the ranked simplification backlog ordered by severity and consumer impact. Plus final verified-positive controls.

## Findings

| # | path:line | Claim | Observed (current tree) | Severity | Recommendation |
|---|-----------|-------|-------------------------|----------|----------------|
| R10-01 | L1 verification: removal completeness | The dead half went with its consumers, tests, assets | Code-level: clean (0 dangling importers in all five trees, iter 1). Package-level: `main` survived (R1-01). Doc-level: `SPECKIT_ROLLOUT_PERCENT` row survived (R1-02); fixture row survived (R2-02). Asset-level: the 009-deleted tests are gone (ls: 0 matches); `memory-pipeline-regressions.vitest.ts` coherently adjusted (phrases reference trigger extraction, not the monolith; factory stays unmocked). The dep moved, not vanished: `@huggingface/transformers` now declared at skill root (system-spec-kit/package.json:49) + advisor (mcp-server/package.json) where the bin model server consumes it. | P1 (ledger) | — |
| R10-02 | L6 verification | Dependency/script fixes | `test:task-enrichment` gone; deps = @modelcontextprotocol/sdk + js-yaml only; CI lane wired (R8-02). The wiring "2/5 install" question remains the environment story (this worktree) — not re-collectable. | P2 (verified) | — |
| R10-03 | residue sweep (final) | — | No additional removed-name references beyond R1-01..R4-04 rows; no dangling relative imports into removed shared paths; remove-verify complete. | P2 (verified) | — |

## Full disposition of the ten confirmed-findings rows

| L-row | Verdict | Evidence |
|-------|---------|----------|
| L1 dead half | **Fixed, with three survivors outside its scope**: folder-scoring (R7-01, test-only), profile DB cluster (R2-03, dead after paths.ts), factory SQLite block (R2-01, still-gated residue) | iteration 1, 2, 5, 7 |
| L2 database-path theater | **INCOMPLETE** — readers + runtime/core + sentinel fully fixed (R2-06); factory/profile derivations survive with divergent bases (R2-01) + profile cluster dead (R2-03) | iteration 2 |
| L3 env ledger | **Fixed** (spelling, 28 vars listed) with README reader-column drift (R3-01) | iteration 3 |
| L4 stale dist | **Environment** (dropped; this worktree's dist is untracked/stale by instruction) | iteration 9 |
| L5 import boundary | **INCOMPLETE** — barrel/root export gone and type import repointed, but `main` survived (R1-01) and the review-research-paths export entry is unwired (R6-01) | iteration 1, 6 |
| L6 wiring | **Fixed** (dep dropped, scripts trimmed, CI lane verified R8-02); install topology remains environment | iteration 8 |
| L7 isolation doctrine | **Recorded** — stands; correction: comment-enforced, not CI-enforced (R4-03) | iteration 4 |
| L8 conventions | **Fixed** with one assertion short: socket FILE name constant (3 sites) unasserted (R4-01) | iteration 4 |
| L9 stale exports | **Fixed** (VOYAGE_BASE_URL, HfLocalDtype, error class, shard method) with `EmbeddingProfileExtended` as the ownerless survivor (R2-04) | iteration 2, 3 |
| L10 dead weights | **Fixed** (dep, script, dist-exclusion) with the folder-scoring survivor (R7-01) and the token-estimate re-export (R7-02) | iteration 7 |

## The ranked simplification backlog (post-009, ordered severity × consumer impact)

1. **FIX `main` → deleted barrel (R1-01)** — one line; fixes a latent MODULE_NOT_FOUND for any bare `@spec-kit/shared` resolve after a clean build. P1.
2. **MERGE the parallel Ollama implementations (R5-01)** — `adapters/ollama.ts` + `providers/ollama.ts`, both live in the skill-graph-db flow; the largest duplication in the live half (~700 lines, two contracts, two config surfaces). P1.
3. **MERGE the database-directory derivations (R2-01) and REMOVE the dead profile cluster (R2-03)** — completes L2: one exporter (config.ts TELEMETRY_STORE_DIR) consumed by factory/profile; the 5-function `getDatabasePath`/`resolveActiveProfileDbPath`/`parseProfileSlug` cluster and its cwd-relative walks go with `paths.ts`. P1.
4. **REMOVE `scoring/folder-scoring.ts` (R7-01)** — 0 production consumers (the CLI that justified it is absent); 2 test files die with it. P1.
5. **FIX the two stale rows that break a live gate: `references/config/environment-variables.md:178` (R1-02) and the sk-doc baseline fixture (R2-02)** — the env row violates REQ-001 semantics; the fixture breaks the README-verdict parity test. P1.
6. **MERGE the root resolvers (R6-02, R6-03)** — 8 implementations, 3 divergent predicates inside shared; one resolver (repo-root.mjs) + one consumer.
7. **FIX the unwired export entry (R6-01)** — repoint `artifact-root.cjs` to the specifier or drop the entry.
8. **FIX the README §5 reader columns (R3-01)** — 3 of 9 "Read by" cells wrong/omitted (adapters module, profile.ts, factory.ts).
9. **FIX the parity test (R4-01)** — add the socket FILE name (3 sites) to `model-server-constants.test.ts`; document comment-enforced isolation (R4-03) and the advisor-build-rebuilds-shared wiring (R4-04).
10. **DOCUMENT/MOVE the register (R9-01, R2-04, R7-02, R8-01, R8-03, R5-04)** — types.ts → 2 crossing symbols; EmbeddingProfileExtended removal; dead token-estimate re-export line; jsonc-strip/context-types coverage; no-op `utils/*.test.ts` glob; two backend taxonomies.

## Memory-DB residue state (recounted, post-009)

- (a) **Factory SQLite block** — `vec_metadata`/`vec_${dim}`/`vec_memories_rowids` gate + `resolveConfiguredDatabaseCandidates` + `resolveSpecKitPackageRoot`: still present, still inert-or-drift-warning, now joined by profile's dead derivation cluster (R2-01/R2-03) — the one remaining *functional* residue locus.
- (b) **Naming** — `parsing/memory-*`, `MemoryEvidenceSnapshot`, `_memory.continuity`: live gates under retired names (verified R7-05; recorded decision, stays).
- (c) **MEMORY_DB_PATH / SPEC_KIT_DB_DIR|SPECKIT_DB_DIR** — repurposed, documented, 2-spelled by decision (R9-04).
- (d) **SPECKIT_ROLLOUT_PERCENT** — removed from code; one documentation row remains (R1-02).
- (e) **runtime/database** — now the telemetry store's home (live); the sentinel theater is gone.

## Ruled out this iteration

- Anything dist-based (environment); nested-dispatch alternatives (forbidden); rerunning counts from round one (recounted throughout).

## Sources Consulted

- `system-spec-kit/package.json:49` (transformers declaration), advisor `mcp-server/package.json`, shared package.json deps
- `runtime/tests/` listing (removed tests: 0 matches); `memory-pipeline-regressions.vitest.ts:28,52,58`
- The full L-row disposition collated from iterations 1-9 evidence
- Backlog ordering: severity (P1 first) × consumer impact (live-endpoints first, test-fixtures before cosmetics)

## Assessment

- newInfoRatio: 0.5 — collation and disposition of previously-gathered evidence; the two final verifications (dep home, regression-test coherence) are the only new probes.
- Confidence: high — every row in the disposition is tied to a path:line from iterations 1-9; the L4 environment row is explicitly labeled.

## Reflection

- Worked: ending with a disposition table rather than more findings — the second-round value is the fix-verification ledger, not another census.
- Failed: minor — the transformers-dep check needed a second grep (declared at skill root, not in bin's own package.json).
- Ruled out: — (terminal iteration).

## Recommended Next Focus

None — the loop is complete (10/10, `maxIterationsReached`). Synthesis: `research.md`; the consolidated ledger: `findings-registry.json`; convergence: `convergence-report.json`.
