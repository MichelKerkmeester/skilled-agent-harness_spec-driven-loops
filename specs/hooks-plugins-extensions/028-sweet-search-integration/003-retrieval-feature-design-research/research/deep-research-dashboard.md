---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Implementation-ready designs for five system-spec-kit retrieval improvements borrowed from sweet-search (phase 2 synthesis: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md): (1) total candidate count beside truncated plus a section 9 exclusion row; (2) zero-hit fallback to git-changed spec docs; (3) one line per file plus elision lines in the ripgrep wrapper; (4) boilerplate demotion in the ripgrep lane; (5) out-of-scope hint. Hard constraint: no embeddings, no vector/BM25 fusion, no MCP, no daemon, no persistent index.
- Started: 2026-11-09T14:52:02Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-09T14:52:02Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: feature 1, total candidate count beside truncated in lookup-trigger-index.mjs plus the section 9 research exclusion row | retrieval-output-contract | 0.70 | 5 | complete |
| 2 | Q2: zero-hit fallback to git-changed spec docs | - | 0.85 | 13 | complete |
| 3 | Q3: Design feature 3, per-file flood control in the ripgrep wrapper | design | 0.81 | 8 | complete |
| 4 | Q4: boilerplate demotion at its minimum viable size - body line classes, rank tuple placement, cheaper alternatives, and the build trigger | boilerplate-demotion | 0.94 | 8 | complete |
| 5 | Q5: out-of-scope hint at minimum viable size - keyed-lane outOfScope field, ripgrep-lane --scope, threshold rule, concrete build trigger | out-of-scope-hint | 0.70 | 8 | complete |

- iterationsCompleted: 5
- keyFindings: 37
- openQuestions: 1
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/5
- [x] Q1: Design feature 1, the total candidate count: the exact field name and placement in the lookup-trigger-index.mjs answer object and formatAnswer output, every current caller and test that parses the answer (so nothing breaks), the section 9 exclusion-coverage row wording for specs/**/research/** in retrieval-conventions.md, and the test cases.
- [x] Q2: Design feature 2, the zero-hit fallback to git-changed spec docs: module boundary (new lib/changed-docs.mjs or inline), the git command and its parsing (git status --porcelain, renames, deletions, staged additions, non-git, missing git binary, submodules), how frontmatter trigger_phrases are read and scored with the existing helpers, the staleFallback answer field, exit-code rules, the opt-out flag, the section 4 and 5 contract amendments for determinism, performance budget, and the test matrix.
- [x] Q4: Design feature 4, boilerplate demotion, at its minimum viable size: the Markdown line classes inside the body evidence field, how they slot into the rank tuple without breaking determinism, whether a cheaper version (a stock-sentence list, or demoting template folders) gets most of the value, and the concrete trigger (what logged query) that would justify building it.
- [x] Q5: Design feature 5, the out-of-scope hint, at its minimum viable size: the keyed-lane outOfScope field inside the existing posting loop, the ripgrep-lane --scope design, the threshold rule, and the concrete trigger (which caller or command starting to pass a scope) that would justify building it.
- [ ] Q3: Design feature 3, per-file flood control in the ripgrep wrapper: where in rg-wrapper.mjs and lib/rg-lane.mjs the one-line-per-file guarantee and k cut go, how totals are obtained (the count recipe or the same rg run), the exact '+N more in this file' and '+N more files with M matches' output for human and JSON formats, what happens to structuredCappedRecipe, contract text for sections 2.1 and 5, and tests. [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Q3: Design feature 3, per-file flood control in the ripgrep wrapper: where in rg-wrapper.mjs and lib/rg-lane.mjs the one-line-per-file guarantee and k cut go, how totals are obtained (the count recipe or the same rg run), the exact '+N more in this file' and '+N more files with M matches' output for human and JSON formats, what happens to structuredCappedRecipe, contract text for sections 2.1 and 5, and tests.

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▂▃▄▅▅▅▅▅▄▅▅▆▇█▇▅▄▂▁
- score sparkline: ▁▂▃▄▅▅▅▅▅▄▅▅▆▇█▇▅▄▂▁
- Last 3 ratios: 0.81 -> 0.94 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"code":50,"other":48}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **`candidateDocumentCount` as the field name** — it parallels `candidatePhraseCount` but reads as a second phrase count in the same object; `totalCandidates` names the denominator the cap divided. (iteration 1)
- **`hiddenCandidates` / `remainingCandidates` (the difference)** — derivable from `totalCandidates - results.length`, and storing a derived value invites drift. (iteration 1)
- **A `--report-total` flag** — the number is already computed; a flag creates a mode with no consumer. (iteration 1)
- **Always printing `N of T` in the human line** — changes every untruncated answer for no caller benefit and churns documented output; only the truncated line gains information. (iteration 1)
- **Human-only reporting** — Gate 1 reads `--json`, so a human-only field would never reach the caller that needs it. (iteration 1)
- **Renaming `truncated` to a count** — breaks the boolean assertion at `trigger-index.vitest.ts:935` and every caller comparing it; additive is cheaper and reversible. (iteration 1)
- **`git ls-files --modified --others` as the candidate source.** Measured loss of 14 of 29 changed docs, all staged additions. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32] (iteration 2)
- **Body-text grep over changed files.** The keyed lane matches declared phrases; prose belongs to the ripgrep lane. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34] (iteration 2)
- **Enabling the fallback for an explicit `--index`.** Would make temp-corpus fixtures depend on the developer's worktree. (iteration 2)
- **Making `lookup()` async or adding fallback logic inside it.** Would break the exported synchronous contract every test asserts. (iteration 2)
- **mtime comparison or a pending-reindex queue.** The index has no publish timestamp, and checkout mtimes are not build times. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md:149] (iteration 2)
- **Running `--check` on zero-hit.** It is a full corpus walk and by contract never runs per lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84] (iteration 2)
- **A `--k` flag.** The keyed lane already spells the same bound `--limit`, default 20, 0 uncapped; a second name would fork one vocabulary. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18-23] (iteration 3)
- **A second invocation of the count recipe for totals.** Exact, but it doubles the scan for numbers the uncapped structured fetch already holds. Only worth it if the fetch is capped, which the first bullet rules out. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31] (iteration 3)
- **Copying sweet-search's weighted allocation.** It would add a second ranker beside the evidence-field/match-class tuple, which already orders the rows the guarantee pass keeps. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md:77] (iteration 3)
- **Wiring `structuredCappedRecipe` (`--max-count 1`) into the wrapper.** It keeps each file's earliest matching line rather than its best-ranked one, and it removes the per-file count the elision line needs. [SOURCE: local `rg --help` output for `--max-count`] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411] (iteration 3)
- None this iteration. Every planned read and the bounded measurement succeeded. (iteration 3)
- **Demoting template folders for the free-text flood.** 3 of 786 paths, 0.4% of the result set; the flood is 783 real packets that copied the sentence (Finding 6). (iteration 4)
- **Making a line class shrink the stock-sentence result set.** All 783 rows are the same blockquote; no class computed from a single line can separate them. Volume belongs to feature 3. (iteration 4)
- **One line per section spread.** That is feature 3's per-file cap, and folding it in would double this change's size (Finding 2). (iteration 4)
- **Setext heading detection.** It needs the previous line, which the match record does not carry. (iteration 4)
- **Stock-sentence deny list.** The measured flood line is a blockquote, so the generic `guidance` class demotes it; a curated list adds drift and covers only sentences someone remembered (Finding 5). (iteration 4)
- **Treating template-folder demotion as the whole of feature 4.** The measured template inversion is on the keyed lane, and fixing it needs a schema or policy decision that also affects legitimate template lookups (Finding 6). (iteration 4)
- **Using `matchClass` to prefer headings on fixed-string queries.** 786 of 787 stock-sentence rows are `phrase-containment`, confirming the phase 2 finding that the match class is degenerate for fixed-string hits; it cannot carry a shape preference. (iteration 4)
- **A second keyed pass to compute the tally.** The posting loop already holds every rejected document; a second pass would re-read the index for a fact already in hand. (iteration 5)
- **Firing on the keyed lane's unscoped zero.** With no scope there is nothing out of scope; the observed zero was a phrase miss. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:52] (iteration 5)
- **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path. The threshold confines it to the low-hit path. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22] (iteration 5)
- **Porting `probeOutsideScope` literally.** It requires a sparse gram index; the hard constraint forbids a persistent index, so the port would return `null` on every call. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:18] (iteration 5)
- **Treating `truncated` as the hint.** It reports the result cap, not the scope boundary; a scoped run can be `truncated: false` and still hide documents in other tracks. (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1, Q2, Q3, Q5: covered by the four sibling iterations.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
