# Iteration 2: L2 verification — telemetry directory chain and the surviving database derivations

## Focus

Verify the confirmed-findings L2 fix end to end (telemetry-directory export + its two readers + runtime/core removal), then measure what the fix left behind: any remaining derivation of the runtime/database directory. Also resolve R1-04's consumer behavior.

## Findings

| # | path:line | Declared purpose | Observed | Severity | Recommendation |
|---|-----------|------------------|----------|----------|----------------|
| R2-01 | `shared/embeddings/factory.ts` (`resolveConfiguredDatabaseCandidates` ≈:330-360, `resolveSpecKitPackageRoot` ≈:280) + `shared/embeddings/profile.ts` (`resolveDefaultActiveProfileDbDir` + two `findUp` walks ≈:230-275) | Derive the runtime/database directory for the advisor's SQLite reads | The L2 fix exported one telemetry directory from `config.ts` and removed `shared/paths.ts` + the runtime/core block, but the embeddings-side derivation cluster survives: factory (MEMORY_DB_PATH first, then SPEC_KIT_DB_DIR\|SPECKIT_DB_DIR, then packageRoot/runtime/database) and profile (env pair, then two findUp walks, then cwd/runtime/database). **Three derivation systems remain** for one directory, with **two base semantics**: `config.ts` resolves a relative override against the package root; factory/profile resolve against `process.cwd()`. The README §5 sentence "config.ts … honours the database-directory override the skill advisor also uses" is true for the env names only, not the resolution. | **P1** | merge: one exporter (config.ts) consumed by factory/profile; or document the divergent bases |
| R2-02 | `sk-doc/scripts/tests/test_readme_verdict_parity.py:26-30` + `baseline-readme-verdicts.json:5638` | Baseline-parity test over every recorded README verdict | The runner iterates EVERY baseline row and returns 1 on any mismatch; the row for `shared/ranking/README.md` (deleted in 009) can no longer produce a matching verdict — the removed directory left a fixture row the live test walks. (Resolves R1-04 from P2-pending to confirmed; the test itself was not executed — no tooling.) | **P1** | fix: remove the fixture row |
| R2-03 | `shared/embeddings/profile.ts:104-108` (`getDatabasePath` — "the canonical form under another name, kept for its callers") + `resolveActiveProfileDbPath` + `resolveDefaultActiveProfileDbDir` + `parseProfileSlug` + `getCanonicalDatabasePath` | Profile/database helpers | Checked-in census: **0 consumers** of all five. Round one recorded `getDatabasePath` as the production seam because `shared/paths.ts:302` called it; 009 deleted paths.ts, so the seam's caller is gone and the entire cluster is dead weight inside the live profile module — the "kept for its callers" comment is now objectively stale. | **P1** | remove: the cluster (EmbeddingProfile's slug/display/equals/toJson stay — providers use those); keep `getCanonicalDatabasePath` only if a caller appears |
| R2-04 | `shared/types.ts:37-38` (`EmbeddingProfileExtended`, with `getDatabasePath` member) | Cross-package profile type | 0 checked-in consumers (the barrel that re-exported it is gone; only the stale worktree dist references it). Round one's L9 type-rows were slated to die with their owners; this one survived the cleanup with no owner left. | P2 | document/remove: dead interface, or fold its meaning into `EmbeddingProfileData` |
| R2-05 | `shared/config.test.ts` | Guards TELEMETRY_STORE_DIR = skill-root/runtime/database with env cleared | Correct and complete: spawns a child with SPEC_KIT_DB_DIR/SPECKIT_DB_DIR/MEMORY_DB_PATH deleted, asserts the derived dir equals SKILL_ROOT/runtime/database, and rejects a shared-package-relative result. Still matches the updated root `*.test.ts` glob. | P2 (verified-positive) | (none) |
| R2-06 | `shared/gate-3-classifier.ts:16,509` + `runtime/lib/graph/access-telemetry.ts:14,51,69` + `runtime/core/config.ts` | L2 readers | Both readers import TELEMETRY_STORE_DIR and use it for the access-telemetry path; runtime/core/config.ts has zero DB references (block removed); `.db-updated` = 0 hits anywhere checked-in (sentinel fully gone). | P2 (verified-positive) | (none) |

## Ruled out this iteration

- The `db-updated`/runtime-core halves of L2: fully fixed (R2-06 controls).
- `adapters/README.md` / INSTALL-GUIDE.md adapter-contract lines: current-architecture documentation, not residue.
- dist-derived hits (`dist/index.js`, `dist/embeddings/providers/*.js`): stale worktree artifacts, excluded by instruction.

## Sources Consulted

- `shared/config.ts` (TELEMETRY_STORE_DIR + getDbDir + PACKAGE_ROOT), `shared/config.test.ts` (full)
- `shared/gate-3-classifier.ts:16,509`; `runtime/lib/graph/access-telemetry.ts:14,32,51,69`; `runtime/core/config.ts` (zero-hit)
- `shared/embeddings/factory.ts` (resolveConfiguredDatabaseCandidates, resolveSpecKitPackageRoot, MEMORY_DB_PATH precedence)
- `shared/embeddings/profile.ts` (full read: getDatabasePath/getCanonicalDatabasePath/resolveActiveProfileDbPath/resolveDefaultActiveProfileDbDir/parseProfileSlug)
- Census: resolveActiveProfileDbPath|getCanonicalDatabasePath|parseProfileSlug|getDatabasePath|EmbeddingProfileExtended over `.opencode` (checked-in, non-dist)
- `sk-doc/scripts/tests/test_readme_verdict_parity.py` (consumer loop), `baseline-readme-verdicts.json:5638`
- Checked-in provider imports of `../profile.js` (all four providers: live)

## Assessment

- newInfoRatio: 0.9 — R2-01/R2-03 quantify what the L2 fix left (two derivation systems + a 5-function dead cluster); R2-02 upgrades iter-1 R1-04; R2-04 is a type-row with no owner. Some verification overlap with round one's findings, but post-remediation state is newly evidenced.
- Confidence: high for R2-03/R2-04/R2-05/R2-06 (direct census); high for R2-02 (consumer code read; not executed).

## Reflection

- Worked: reading the parity-test consumer before grading the fixture row — the loop-iterate-then-fail shape converted a P2 guess into a P1.
- Failed: none.
- Ruled out: dist as evidence; changelog/"what left" narrative hits.

## Recommended Next Focus

Iteration 3: L3/L9 verification — VOYAGE base-URL spelling sweep (profile vs provider vs auto-select), HfLocalDtype home, EmbedderNotConfiguredError internals, getVectorShardPath absence, and the README §5 configuration-table completeness against a fresh env-var census of the current tree.
