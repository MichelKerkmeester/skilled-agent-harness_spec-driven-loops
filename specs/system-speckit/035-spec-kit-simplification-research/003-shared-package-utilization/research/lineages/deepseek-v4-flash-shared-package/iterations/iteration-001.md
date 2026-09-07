# Iteration 1: Residue verification after the dead-half removal — imports, exports, fixtures, docs

## Focus

Job 1 (priority 1): find anything the 009 removal left behind — a dangling importer, a stale export-map/main line, a fixture or allowlist entry, or a document line naming a removed member. Checked-in source only; this worktree's `dist/` is untracked/stale and not evidence.

## Findings

| # | path:line | Declared purpose | Observed | Severity | Recommendation |
|---|-----------|------------------|----------|----------|----------------|
| R1-01 | `shared/package.json:6` (`"main": "dist/index.js"`) | Bare-package fallback entry point | `index.ts` was deleted in 009 ("the root barrel and the root export went with them") and the `exports` map has no `"."` entry — but `main` still points at `dist/index.js`, a module a clean build no longer emits. Any bare `require('@spec-kit/shared')`/`import '@spec-kit/shared'` now resolves through a dead field: either the stale dist artifact (this worktree) or MODULE_NOT_FOUND (after the 009 rebuild elsewhere). The L5 fix removed the barrel and the root export and left this line. | **P1** | fix: delete the `main` field (or add `"."` to `exports` if a bare specifier is intended — nothing imports it today) |
| R1-02 | `references/config/environment-variables.md:178` | Documents `SPECKIT_ROLLOUT_PERCENT` "read by `getRolloutPercent()`" | Checked-in source census (excluding stale dist, changelogs, specs): **0 reads** of `SPECKIT_ROLLOUT_PERCENT` and 0 definitions of `getRolloutPercent`. `feature-catalog/governance/feature-flag-governance.md:43` states the rollout gate "went with the memory engine… no longer one shared runtime helper". 009 listed this file as modified and the residue sweep missed the row; it is the last documentation of the dead rollout flag (round one F9.2(c)). | **P1** | fix: remove the table row (the variable no longer exists) |
| R1-03 | `shared/predicates/boolean-expr.test.ts:7` | Test header comment | "// quality-extractors.test.ts convention in this directory." — `quality-extractors.test.ts` was deleted in 009; the comment is the only remaining reference. | P2 | document: drop the stale reference (keep the durable why) |
| R1-04 | `sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json:5638` | Baseline fixture: validator verdict for `.opencode/skills/system-spec-kit/shared/ranking/README.md` | `ranking/` was removed in 009; the fixture still records a verdict for the removed path. Consumer check deferred to iteration 2 (if the runner asserts every fixture row, this is a P1; if it tolerates missing rows, P2). | **P2 (pending consumer check)** | fix: drop the row or confirm the runner tolerates it |
| R1-05 | `runtime/cli/lib/dist-freshness.cjs:26-30` | Freshness watch configuration for the shared package | Uses `sourceCandidates: ['.']` + `distEntries: {default: 'dist/tsconfig.tsbuildinfo'}` — no static file list, so no stale removed-file names. The freshness machinery needs no repair for the removal. (The L4 "stale dist / unprovisioned" question remains an environment fact in this worktree, per confirmed-findings; not re-collectable here without node tooling.) | P2 (verified-positive) | (none) |
| R1-06 | `runtime/cli/evals/import-policy-allowlist.json` | Allowlist for test-time imports of internal paths | Clean of removed names: the shared entries are `../../shared/utils`, `../shared/utils` (fixture-string noise in the boundary test), `../../shared/parsing/memory-template-contract`, `../../shared/gate-3-classifier` — all alive. The 009-modified allowlist survived the removal. | P2 (verified-positive) | (none) |

## Ruled out this iteration

- The `adaptive-fusion`/`ranking`/`quality-extractors` hits in changelogs, `shared/README.md` "What left" paragraph, `algorithms/README.md`, and `ENV-REFERENCE.md:286` = removal records, not residue.
- No dangling specifier or relative importer of any removed module in the five consumer trees (specifier + relative sweeps both clean; the only hits were the stale worktree `dist/`, excluded by instruction).

## Sources Consulted

- `shared/package.json`, `shared/tsconfig.json` (checked in)
- `references/config/environment-variables.md` (line 178 row), `feature-catalog/governance/feature-flag-governance.md:43`
- `rg SPECKIT_ROLLOUT_PERCENT|getRolloutPercent` over `.opencode/skills` + `.opencode/bin` (checked-in, non-changelog)
- Specifier + relative sweeps for every removed module path over `.opencode/skills`, `.opencode/bin`, `.github`
- `runtime/cli/evals/import-policy-allowlist.json` (full entry read)
- `runtime/cli/lib/dist-freshness.cjs` package-entry block
- `predicates/boolean-expr.test.ts` header; `sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` row 5638

## Assessment

- newInfoRatio: 1.0 — first pass over this angle; R1-01 and R1-02 are newly evidenced incomplete-remediation rows (the one-line `main` and the one-row env doc both survived a "residue sweep" that REQ-001 forbade). R1-04 pending.
- Confidence: high for R1-01/R1-02/R1-03 (direct read); medium for R1-04 (consumer behavior not yet read).

## Reflection

- Worked: sweeping for removed names in docs/fixtures separately from code — the code sweep was clean while two doc/fixture rows were not; a code-only residue test would have passed falsely.
- Failed: none this iteration.
- Ruled out: dist-as-evidence (stale by instruction); changelog/"what left" narrative hits.

## Recommended Next Focus

Iteration 2: the L2 telemetry-directory chain end to end — `config.ts` TELEMETRY_STORE_DIR export, its two readers (gate-3-classifier.ts, access-telemetry.ts), the `config.test.ts` coverage, and whether factory.ts/profile.ts still derive the same runtime/database directory with different base semantics (the pre-init suspect). Plus R1-04's consumer resolution (sk-doc baseline fixture runner).
