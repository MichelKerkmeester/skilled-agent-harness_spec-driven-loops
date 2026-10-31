# system-spec-kit docs-reality alignment — synthesis (r2)

**lineage:** `deepseek-v4-flash-docs-reality-r2` · **session:** `fanout-deepseek-v4-flash-docs-reality-r2-1788687489387-beu4xh` · **loop:** research (max-iterations) · **iterations:** 5/5 · **stopReason:** `maxIterationsReached`

Third-pass audit of the `system-spec-kit` documentation (`manual-testing-playbook/**`, `feature-catalog/**`, `references/**`) against its runtime implementation (`.opencode/skills/system-spec-kit/runtime/`, `shared/`, `templates/`, `SKILL.md`, `.opencode/commands/speckit/*.md`). This pass hunted **new** mismatches only — every item in the pre-supplied "ALREADY FOUND AND FIXED" list was excluded, and the two prior passes already corrected the strict/freshness semantics, the finalize-dist path, the doctor route lists, the README tree/counts, the phantom rule scripts, the save-flow re-index steps, and the other listed items. Every finding cites both a doc location and a code location. No file was edited.

---

## Summary

11 distinct doc-vs-code mismatches across 11 findings, dominated by two root causes that survive the two prior passes:

1. **The save/persistence layer still describes a live memory-index step that was retired.** The save workflow logs `Skipping retired legacy memory indexing` and sets `memoryId = null`; several feature-catalog and playbook docs still say the post-save review runs at "Step 10.5 before indexing", assert `indexMemoryFile()` / "indexing succeeds", and cite phantom memory-save handlers and cross-references (F2-01, F2-02, F2-03, F2-04, F4-01, F4-02, F5-03).
2. **Phantom test files and wrong build/dir paths.** Five vitest files are absent repo-wide yet appear in playbook command blocks (F4-01, F5-03), and two workflow references point at the wrong subdirectory or cross-root path (F5-01, F5-02). Plus two smaller items from the feature-flag and catalog families (F1-01, F3-01).

**Distribution:** 4 × P1 (wrong/harmful — verbatim command breaks: F2-01, F4-01, F5-03; plus the retired-index framing in F2-01), 7 × P2 (misleading/cosmetic). All confirmed by direct file-existence checks, directory listings, or runtime source reads.

---

## P1 — wrong / harmful (fix first)

### F2-01 · Post-save review runs at Step 11.75 (post-index), not 10.5; indexing retired
`feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:19,27,64-65` claims the review runs "after canonical packet continuity is written (Step 10.5 in the save workflow) and before indexing starts (Step 11)", "Runs before `indexMemoryFile()` embeds and persists the entry", and "The save always proceeds to indexing."
**Actual:** `runtime/cli/core/workflow.ts:1712-1723` runs Step 11 semantic indexing but logs `Skipping retired legacy memory indexing` and sets `memoryId = null` (`:449`, "this workflow no longer indexes"); the review actually runs at **Step 11.75** (`:1741`, invoked `:1744-1753`). `indexMemoryFile()` exists nowhere in live code.
**Fix:** re-frame the review as running at Step 11.75 after the retired index step; drop the "before indexing begins" / "proceeds to indexing" / `indexMemoryFile()` language.

### F4-01 · Playbook commands reference five non-existent test files
`manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:82,85,87` run `npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/opencode-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts ... tests/memory-render-fixture.vitest.ts ...` and `npx vitest run tests/test-integration.vitest.ts tests/workflow-e2e.vitest.ts`.
**Actual:** `tests/claude-code-capture.vitest.ts`, `tests/opencode-cli-capture.vitest.ts`, `tests/copilot-cli-capture.vitest.ts`, `tests/memory-render-fixture.vitest.ts`, `tests/workflow-e2e.vitest.ts` are **absent repo-wide** (verified `find .opencode/skills`); vitest fails when `--run` names a missing file. The other ten named files exist.
**Fix:** replace the five phantom test-file names with the real suite files that exercise those lanes.

### F5-03 · `core-workflow-infrastructure.md` runs two phantom vitest files and asserts a retired indexer
`manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md:22,23,36,41` runs `npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`, with signals "all targeted Vitest suites pass; ... indexing/scoring regressions do not fail."
**Actual:** `tests/memory-indexer-weighting.vitest.ts` and `tests/workflow-e2e.vitest.ts` are absent repo-wide; the other three exist. The "indexing/scoring regressions" signal describes a retired indexer (`workflow.ts:1712-1723`).
**Fix:** drop the two phantom test files and reword the indexing signal to the live post-save-review / trigger-index freshness checks.

---

## P2 — misleading / cosmetic

- **F1-01** `feature-catalog/governance/feature-flag-governance.md:72` lists `runtime/ENV-REFERENCE.md` as the canonical reference that "documents `SPECKIT_COMPILED_ROUTING` and `_DEBUG`". Actual: `runtime/ENV-REFERENCE.md` has 0 occurrences of the flag (grep -c → 0); it lives in `.env.example:133-134` and the resolver/advisor sources. → drop the ENV-REFERENCE.md row from the source list, or add the flag to it.
- **F2-02** `post-save-quality-review.md:98` cites `runtime/cli/tests/workflow-e2e.vitest.ts` ("End-to-end coverage of Step 10.5 placement"). Actual: no such file; real suite is `workflow-*.vitest.ts`. → point at the real test file or drop the row.
- **F2-03** `post-save-quality-review.md:80-81` cross-references `05-pre-storage-quality-gate.md` and `01-verify-fix-verify-memory-quality-loop.md`. Actual: neither exists anywhere in the skill tree. → drop or rename to real companion docs.
- **F2-04** `feature-catalog/memory-quality-and-indexing/spec-doc-structure-validator.md:46` lists `runtime/handlers/memory-save.ts` as the "Save-path integration that invokes the validator before storage". Actual: `runtime/handlers/` holds only `README.md`, `save/`, `spec-doc-discovery.ts`; the validator runs via `validator-registry.json` (`ts:spec-doc-structure`) + `validate.sh`. → replace the handler row with the real exposure, or drop it.
- **F3-01** `feature-catalog/governance/feature-flag-governance.md:58` ("`compiled-serving` is the fourth code") and `manual-testing-playbook/governance/feature-flag-governance.md:46` ("a `causeCode` from the documented four"). Actual: `compiled-route-status.cjs` assigns at least **eight** `causeCode` values (`compiled-serving`, `flag-off`, `legacy-authority`, `missing-manifest`, `engine-throw`, `stale-manifest`, `identity-mismatch`, `compile-error`). → replace with the full contract or point at `compiled-route-status.cjs:18-28`.
- **F4-02** `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:22,25,27,130,142` asserts "Indexing succeeds when validation passes" / "`M-007a` validates and indexes successfully". Actual: the save workflow skips the retired memory index (`workflow.ts:1712-1723,449`); only the trigger-index freshness check remains. → reword to the trigger-index freshness / canonical-spec-doc save landing.
- **F5-01** `references/workflows/agent-io-contract.md:186` cites `runtime//lib/deep-loop/post-dispatch-validate.ts` (double-slash typo; `runtime/lib/` has no `deep-loop/`). Actual: the module is `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` (plus `evidence-contract.ts`). → fix the path and root.
- **F5-02** `references/workflows/spec-folder-write-recipe.md:83` runs `node .../runtime/cli/dist/spec-folder/backfill-graph-metadata.js`. Actual: `dist/spec-folder/` has no such file; it is at `runtime/cli/dist/graph/backfill-graph-metadata.js` (source `runtime/cli/graph/backfill-graph-metadata.ts`). → change `dist/spec-folder/` to `dist/graph/`.

---

## Ruled out (evidence-checked, not findings)

- compiled-routing eligibility set / cutover / launcher allowlist — all match runtime source (`compiled-routing-flag.ts:14-19,30-35,59`; `resolve.cjs:25-36,51-54`; `system-skill-advisor-launcher.cjs:124`).
- autopilot command-router contract — `complete.md`/`plan.md`/`implement.md` and `speckit-complete-auto.yaml` match verbatim, including `SPECKIT_AUTOPILOT_RESULT` and the four reason codes.
- `validator-registry.js`/`scripts-registry.js` "phantom extension" — false positives; the docs cite `.json`, which exists.
- doctor-commands README route enumeration omission — adjacent to the already-fixed "doctor route lists / README removed two" item, not re-reported.
- completion-freshness-validator / filter-config-contract scenarios — env vars, source, and test paths all exist and match runtime.
- doctor-deep-loop scripts (`runtime/scripts/{status,query,convergence}.cjs` under `system-deep-loop`) — all exist; `.opencode/specs` is a symlink to `specs/`.
- `validateEvidenceContract` function — the symbol is real in system-deep-loop; only the cited path string is wrong (F5-01).
- spec-kit SKILL.md command references (`/speckit:plan|implement|complete|save|resume`, `--intake-only`) — all match existing `.opencode/commands/speckit/*.md`.
- `references/config` hook and lease paths (`runtime/dist/hooks/claude/*.js`, `hooks/codex/user-prompt-submit.js`) — all exist.

## Deduplication notes

- **F2-02** (feature-catalog post-save review phantom `workflow-e2e`) and **F4-01** (playbook session-capturing phantom `workflow-e2e` plus four others) both name `workflow-e2e.vitest.ts` but are separate docs/citation sites with separate fixes; kept distinct.
- **F2-01** (retired-index framing in post-save-quality-review) and **F4-02** / **F5-03** (retired-index framing in playbook scenarios) share the same root cause but different doc locations; each is its own edit.

## Remaining open cluster (not line-pinned this pass)

A broader set of phantom memory-save test files (`evidence-marker-lint`, `handler-memory-save`, `integration-save-pipeline`, `quality-loop`, `save-quality-gate`, `recovery-hints`, `session-isolation`, `session-cached-consumer`, `preflight`) appears across further playbook scenarios; a follow-up pass should pin each exact doc line. `authored-continuity-snapshot.md` was excluded (already-fixed openltm test).

## References

- Ground-truth docs audited: `.opencode/skills/system-spec-kit/manual-testing-playbook/**`, `feature-catalog/**`, `references/**`, plus `SKILL.md`.
- Run artifacts: `iterations/iteration-001..005.md`, `deltas/iter-001..005.jsonl`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`.
- Stop reason: `maxIterationsReached` (5/5; convergence-threshold 3 was telemetry only under stopPolicy=max-iterations).
