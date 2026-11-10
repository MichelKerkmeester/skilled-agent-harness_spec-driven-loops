# Iteration 8: Staleness impact quantification + regenerate-ownership verification

## Focus

Quantify what F1.1's staleness actually costs (is the served index missing live phrases or misattributing paths?), explain the manifestHash drift mechanism via manifest diffing, and verify regenerate ownership (AGENTS.md:477) against install-guides phrase quality.

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F8.1 | committed `runtime/data/trigger-index.json` vs fresh build (set comparison) | Claimed (implied by F1.1): the stale index narrows retrieval. Actual, refined: the committed index and today's fresh build have **identical path sets (13,560), phrase sets (35,281), and postings (45,808 phrase→path pairs; 45,806 unique)** — zero attribution drift. The staleness is real (manifestHash/corpusHash differ) but **behaviorally invisible to lookups today**: every query returns the same candidates either way. | P2 (downgrade from the feared "P1 serving stale results": F1.1 stays P1 as a process defect — three inconsistent committed snapshots — but with quantified zero query impact today) | Keep F1.1's fix (regenerate + consistency check); the ledger records that staleness was caught before it bit. |
| F8.2 | manifest diff (committed fixtures vs fresh manifest) | Claimed (mechanism): fixture regeneration changed the corpus composition. Actual: `includedPathCount` 28,430 → 28,434; 39 fresh-only paths vs 35 committed-only; the fresh-only set is dominated by a restructured skill tree (`sk-design/ROUTER.md`, `sk-design/sk-design-fundamentals/**` — a hub conversion that moved README/benchmark/docs into a mode folder), while committed-only paths are the pre-conversion locations. The skipped list also shifted (`dist` dirs moved out of the walk; `node_modules` now resolved as symlinked directories). The manifestHash drift is fully explained by real tree restructuring — the generator is correct; the artifacts were simply never re-published after it. | P2 (mechanism confirmed; narrows F1.1's root cause to "no regeneration run post-restructure") | Fix with F1.1: one `generate-trigger-index.mjs` run publishes all four artifacts consistently. |
| F8.3 | `EXCLUDED_DIR_NAMES` (`lib/corpus.mjs:23`) vs manifest skipped reasons | Claimed (F5.8): `dist` pruning missing from conventions §9. Actual: fresh skippedPaths show the operational rule working (`mcp-code-mode/mcp-server/dist` → "excluded directory"), while the committed fixture shows the same entries as **also excluded** under the older tree. Consistent behavior across snapshots; §9 doc gap stands unchanged. | P2 | (Unchanged: add the `dist` row to §9.) |
| F8.4 | skipped-reason drift between snapshots | Claimed (F8.2 corollary): "symlinked directory" reasons appear fresh-only for `node_modules` paths. Actual: `system-deep-loop/node_modules`, `system-spec-kit/node_modules` are symlinks in the current tree (dependency dirs symlinked into workspaces); the walker correctly refuses them (cycle-safe) and reports the reason. Behavior consistent with `corpus.mjs:186-196`. No defect; the reason-string asymmetry between snapshots is tree state, not code. | P2 (positive) | Document. |
| F8.5 | AGENTS.md:477 regenerate ownership | Claimed: "run after trigger phrases change; commit the regenerated index". Actual: the instruction exists but names **no owner and no trigger surface** — the save-time check (F7.2) only fires for the saved packet's spec.md; a phrase change in a skill doc, agent doc, or an unsaved packet has no detecting surface except a human running the generator. Combined with F4.3 (doctor lacks the comparison), the ownership chain is: change frontmatter → *hope* someone regenerates. Today's F1.1 is the demonstrated failure mode. | P1 (consolidated with F1.1/F4.3: the invariant is enforced at three partial points — save-time per-packet, acceptance-time, nowhere at whole-corpus time) | Fix: doctor manifestHash check (closes the whole-corpus gap) + AGENTS.md:477 pointing at the doctor check as the verifier. |
| F8.6 | `install-guides` trigger_phrases quality sample | Claimed (conventions §9): install-guides "carries well-formed `trigger_phrases` frontmatter". Actual: sampled the root's markdown — frontmatter present and distinctive (tool-install specifics, not generic workflow words). Consistent with §9's converged-in-coverage-alignment note. | P2 (positive) | Document. |
| F8.7 | freshness semantics of `manifestHash` | Claimed (generator header + F1.1 recommendation): manifestHash is the consistency token across all four artifacts. Actual: manifest identity = corpusHash + exclusions + ignoredPaths + includedPathCount + schemaVersion + parserVersion + roots. Any corpus, policy, or parser change moves it. It is the correct whole-corpus staleness token — a doctor-side `index.manifestHash == manifest.manifestHash` comparison (both committed files, no build needed) detects today's exact defect in O(1). | P2 (positive design; makes F4.3's fix cheap) | Document as the doctor check's implementation note. |
| F8.8 | committed-only paths still carrying phrases in the fresh corpus? | Claimed (F8.2 corollary): restructuring could orphan phrase attributions. Actual: postings are identical between snapshots, so no phrase lost or gained an attribution — the restructure moved files but every moved document's phrases resolve to the same canonical set. The generator's `canonicalRelativePath` fold and realpath dedupe handled the hub conversion cleanly. | P2 (positive) | Document. |

Ruled out: "stale index drops recently added skill docs from Gate 1" (F8.1: identical path sets — the restructure's new paths are IN both snapshots because the committed snapshot post-dates the file moves but pre-dates the fixture regeneration's tree state at manifest-identity level only; hash drift without content drift is explained by F8.2's manifest identity fields — excluded/skip-path composition changed the hash while the published index inputs netted out identical); "phrase attribution drift" (F8.8: zero).

## Sources Consulted

- Committed index + fixture manifest vs lineage-dir fresh build artifacts (full JSON set-diff, postings comparison, manifest identity field-by-field)
- `lib/corpus.mjs` exclusion/symlink sections (re-checked against skipped reasons)
- `AGENTS.md:477`
- `install-guides` frontmatter sample
- `runtime/cli/core/workflow.ts:344` (F7.2's check, re-read for ownership-chain framing)

## Assessment

- newInfoRatio: 0.55 — the quantification (zero query impact, mechanism explained) materially reframes F1.1's severity; no new defect rows beyond F8.5's ownership consolidation.
- Novelty justification: the byte-level staleness impact quantification and the manifest-identity drift mechanism are new evidence; F8.5 converts three earlier partials into one ownership-chain finding.

## Reflection

- Worked: set-diffing the two artifacts (instead of trusting hash inequality to imply content drift) prevented the ledger from overstating the defect — the hashes differ, the retrieval behavior does not.
- Failed: nothing; the manifest identity fields are the textbook case of a good consistency token.
- Ruled out: see above.

## Recommended Next Focus

Iteration 9: severity roll-up and cross-check — re-verify every P1 row's evidence path still holds (F1.1, F2.6, F3.1, F3.2, F4.1, F4.3, F4.9, F6.5, F7.4, F8.5), dedupe merged rows, and stress-test the two P2s most likely to be wrong (F2.7's ≤4-token coverage claim; F5.3's latency claim) with fresh probes.
