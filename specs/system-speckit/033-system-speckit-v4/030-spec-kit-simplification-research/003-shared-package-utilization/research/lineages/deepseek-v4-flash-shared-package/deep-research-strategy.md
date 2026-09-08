---
title: Deep Research Strategy — @spec-kit/shared Round Two (post-remediation verification)
description: Persistent research plan for the deepseek-v4-flash-shared-package fan-out lineage: verify the 009 remediations, find what round one missed, re-examine kept rows with new evidence.
---

# Deep Research Strategy — deepseek-v4-flash-shared-package

## Research Topic

Round two of the dependency-and-utilization audit of `@spec-kit/shared` (`.opencode/skills/system-spec-kit/shared`) AFTER the 009-shared-package-dead-half-removal remediation. Three jobs in priority order: (1) verify each remediation landed completely and coherently in the current tree — a fix that left one consumer, one document line, one fixture or one asset behind is a finding; (2) find what round one missed, preferring angles it covered in one pass or not at all; (3) re-examine round one's kept rows and recorded decisions only with new evidence that its stated reason is wrong. Round one's synthesis: `lineages/glm-5-3-flash-shared-package/research.md`; the censused ledger: `research/confirmed-findings.md`; remediation: `specs/system-speckit/035-spec-kit-simplification-research/009-shared-package-dead-half-removal`. Do not re-report a row confirmed-findings marks fixed unless the fix is incomplete. Never reuse a round-one count. No validate.sh, no node tooling, no git writes; this worktree's dist directories are untracked and stale — read checked-in source only.

## Known Context

- Post-009 tree (checked-in source only): `shared/` = 13 top-level files (budget-allocator.ts, chunking.ts, compact-merger.ts, config.ts, context-types.ts, gate-3-classifier.ts, review-research-paths.cjs, trigger-extractor.ts, types.ts, unicode-normalization.ts + algorithms/rrf-fusion.ts, embeddings/{adapter,auto-select,factory,profile,registry,types,adapters/ollama,providers/{hf-local,ollama,openai,voyage}}, frontmatter/parse-frontmatter.ts, ipc/socket-server.ts, parsing/{memory-sufficiency,memory-template-contract,secret-scrubber,spec-doc-health}, predicates/boolean-expr.ts, scoring/folder-scoring.ts, utils/{jsonc-strip,path-containment,path-security,retry,token-estimate}, workspace/repo-root.mjs). Removed in 009: embeddings.ts, index.ts, paths.ts, algorithms/{adaptive-fusion,mmr-reranker,index}.ts, ranking/, contracts/, lib/structure-aware-chunker.ts, parsing/quality-extractors.ts, runtime/cli/lib/embeddings.ts, nine runtime tests, two CLI regression cases.
- 009 fixes claimed: telemetry-directory export in shared/config.ts (TELEMETRY_STORE_DIR) with gate-3-classifier + access-telemetry repointed; runtime/core/config.ts DB block removed; VOYAGE_BASE_URL in profile; HfLocalDtype in embeddings/types; EmbedderNotConfiguredError internal; getVectorShardPath gone; barrel + root export gone; review-research-paths.cjs export entry added; @huggingface/transformers dep dropped; test:task-enrichment script removed; tests excluded from build; model-server-constants parity test created; README rewritten around live modules; env-reference/architecture/env-example corrected.
- Observed pre-init (this lineage): `shared/package.json` still has `"main": "dist/index.js"` although index.ts was deleted — the first suspected incomplete remediation. `embeddings/factory.ts` still holds the memory-DB-era SQLite machinery (vec_metadata / vec_${dim} / vec_memories_rowids gate, resolveConfiguredDatabaseCandidates, resolveSpecKitPackageRoot) flagged inert by round one but NOT removed by 009; `embeddings/profile.ts` still has resolveDefaultActiveProfileDbDir/findUp + getDatabasePath; both derive the runtime/database directory with `process.cwd()`-relative bases, while config.ts's TELEMETRY_STORE_DIR resolves relative overrides against the package root — three derivation systems with two base semantics survive the L2 fix. `shared/utils/` has no test files though package.json's test script globs `utils/*.test.ts`.
- Round-one legacy rows with recorded decisions (re-list ONLY with new evidence): predicates/boolean-expr stays as documentary contract; SPEC_KIT_DB_DIR/SPECKIT_DB_DIR pair stays by design; advisor's half-isolation is the advisor's; L4 freshness claims = environment facts in this worktree; runtime/core config DB block removed; hooks' relative gate-3 imports stay (same package).
- Worktree facts: dist/ here is stale (still carries index.d.ts re-exporting from the removed barrel, lib/structure-aware-chunker.d.ts, embeddings.d.ts) and untracked — not evidence for or against the remediation; the 009 rebuild happened elsewhere.

## Key Questions

- q-verify-l1: Did the removed half leave any importer, require, doc line, fixture, allowlist entry, or asset behind in checked-in source?
- q-verify-l2: Is the telemetry-directory export the single derivation now, or do factory/profile still derive the same directory with different semantics?
- q-verify-l39: VOYAGE_BASE_URL everywhere; HfLocalDtype home; error class internal; shard-path method gone; README config table complete against the env-var census.
- q-verify-l8: Does the model-server-constants parity test actually read both declaration sites, and do the declarations match?
- q-new-embeddings: Post-009, which embeddings modules have a live termination (advisor daemon / model server) vs internal-only vs orphan — with the adapter/auto-select/provider drama re-derived from the current tree.
- q-new-roots: How many package-root resolvers and database-directory derivations exist now (config, factory, profile, repo-root.mjs, review-research-paths, runtime/core) and which are redundant.
- q-new-docs: Do ARCHITECTURE.md, ENV-REFERENCE.md, environment-variables.md, .env.example, core/lib/parsing READMEs still name removed members or removed env vars.
- q-new-coverage: Per-module test coverage in the current tree; which modules have none; who runs the shared test lane.
- q-kept: Any new evidence against the four recorded decisions.

## Answered Questions

- (none yet — iteration 1 opens)

## What Worked

- (round one, to build on) Rooting census greps at per-tree paths; terminating import chains in runners; reading shim headers before assuming shimness; positive-evidence controls (0-hit censuses).
- (this lane, pre-init) A file walk of the actual post-009 tree instead of trusting the removal list; reading package.json + tsconfig before any grep.

## What Failed

- (this lane, pre-init) A repo-root-rg over removed names swept the entire specs/ tree including z_archive — must restrict to .opencode code + docs surfaces, excluding specs/, changelogs, and archive.
- A `*.tsbuildinfo` file polluted a grep output; exclude it and other JSON build artifacts explicitly.

## Exhausted Approaches

- None yet.

## Ruled-Out Directions

- (pre-init) Nothing ruled out yet. Round one's dist-based evidence is not re-collectable here (dist stale by instruction) — the dist/freshness question stays an environment-note only.
- The repository-rooted `.opencode` census without excluding specs/ and changelog (pollutes results).

## Divergence Frontier

- (pre-init) The three database-directory derivations with two base semantics (config PACKAGE_ROOT vs factory/profile process.cwd()) — the leading candidate for an incomplete L2 remediation; resolution pending iteration 2/6.
- `main: dist/index.js` vs deleted index.ts — the leading candidate for an incomplete L5 remediation (stale export-map line); resolution pending iteration 1.

## Next Focus

None — the loop is complete (10/10, `maxIterationsReached`). Synthesis: `research.md`; the consolidated ledger: `findings-registry.json` (49 rows: 7 P1 / 42 P2); convergence: `convergence-report.json`; session record: `synthesis-record.json`. Verdict: the 009 remediation is mostly landed — four incomplete-fix rows (R1-01 main, R1-02 env doc row, R2-01 derivations, R2-02 fixture), two survivors with fresh evidence (R2-03 profile cluster, R7-01 folder-scoring), and the live-half duplication R5-01 (parallel Ollama implementations).

## Answered Questions (final)

- q-verify-l1 ✓ (iter 1) — code residue clean; main + doc + fixture rows survived the sweep.
- q-verify-l2 ✓ (iter 2) — readers/runtime-core/sentinel fixed; factory/profile derivations survive with divergent bases (R2-01); profile DB cluster orphaned (R2-03).
- q-verify-l39 ✓ (iter 3) — all L9 fixes landed; README §5 reader columns drift in 3 of 9 groups (R3-01).
- q-verify-l8 ✓ (iter 4) — parity test landed within its scoped assertions; socket file name (3 sites) unasserted (R4-01).
- q-new-embeddings ✓ (iter 5) — adapter path is live (skill-graph-db → getAdapter → embed), sharing the backend with the provider path (R5-01); bin model server = 0 shared imports.
- q-new-roots ✓ (iter 6) — 8 root-resolution implementations; 3 divergent in-package predicates; review-research-paths export entry unwired (R6-01).
- q-new-docs ✓ (iter 1+2) — SPECKIT_ROLLOUT_PERCENT row (R1-02) + sk-doc fixture row (R2-02) are the doc-level leftovers; README otherwise matches the tree.
- q-new-coverage ✓ (iter 8) — inventory: 10 colocated + 12 externally covered; jsonc-strip + context-types uncovered (R8-01); utils glob no-op (R8-03); CI lane wired (R8-02).
- q-kept ✓ (iter 9) — all four recorded decisions stand; no new evidence; one correction (isolation = comment-enforced, R4-03).
