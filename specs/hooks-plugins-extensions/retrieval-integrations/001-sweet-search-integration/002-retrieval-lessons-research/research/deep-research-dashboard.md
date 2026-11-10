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
- Topic: Which lexical search techniques from sweet-search (core/search grep-side modules) would improve system-spec-kit retrieval (committed trigger index, ripgrep recipes, caller-side ranking tuple)? Hard constraint: no embeddings, no vector/BM25 fusion, no MCP, no daemon, no persistent index. Test five lessons: zero-hit fallback to git-changed files, per-file caps with elision line, meaningful-line preference over boilerplate, out-of-scope hit hint, and dedup plus final-k cut.
- Started: 2026-11-09T14:31:51Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-09T14:31:51Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: Zero-hit fallback (sweet-search core/search/grep-unindexed-fallback.js): should the committed trigger index re-check git-modified and untracked spec docs on a miss, does Skilled already do this, how stale is the index in practice, and what does it cost | retrieval | 0.90 | 11 | complete |
| 2 | Q2: Per-file caps with an elision line (core/search/grep-output-shaping.js, grep-allocation-rules.js) | retrieval-shaping | 0.94 | 8 | complete |
| 3 | Q3: meaningful-line preference over template boilerplate in Skilled retrieval | retrieval-ranking | 0.93 | 7 | complete |
| 4 | Q4: out-of-scope hit hint - whether a track- or packet-scoped search returning little should print one line naming hits in other tracks, and its cost on this repo | retrieval | 0.85 | 5 | complete |
| 5 | Q5 dedup plus final-k: do runtime mirror folders or z_archive copies return the same text more than once today, and would dedup plus a strict final-k cut help | retrieval-dedup | 0.90 | 7 | complete |

- iterationsCompleted: 5
- keyFindings: 38
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Zero-hit fallback (sweet-search core/search/grep-unindexed-fallback.js): when the committed trigger index misses because a packet is new or edited since the last index build, should the lookup re-check only git's modified and untracked spec docs? Does Skilled's lookup already do anything like this, how often is the index stale in practice, and what is the cost?
- [x] Q2: Per-file caps with an elision line (core/search/grep-output-shaping.js, grep-allocation-rules.js): does one large file (a research.md, an iteration log, a changelog) flood Skilled's ranked results today, and would a per-file cap, a one-line-per-file guarantee and a "N more hits in M files not shown" line help? Show real queries.
- [x] Q3: Meaningful-line preference (core/search/grep-line-classes.js): beyond the existing evidence-field order (trigger_phrases, title/description, anchor, body), would demoting template boilerplate (FILL comments, stock template sentences repeated in every packet) improve results? Show real queries where boilerplate matches crowd out real content.
- [x] Q4: Out-of-scope hint (core/search/grep-outside-probe.js): when a track- or packet-scoped search returns little, would a one-line "also N hits in other tracks: X, Y" help, and what does it cost on this repo?
- [x] Q5: Dedup plus final-k (core/search/span-dedupe.js, final-k.js): do runtime mirror folders (.claude/, .opencode/, .codex/ and others) or z_archive copies return the same text more than once today, given the coverage and exclusion policy in retrieval-conventions.md section 9? Would dedup and a strict final-k cut help?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▆▆▇████▇▇▇▅▄▃▁▂▂▃▄▅
- score sparkline: ▅▆▆▇████▇▇▇▅▄▃▁▂▂▃▄▅
- Last 3 ratios: 0.93 -> 0.85 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":56,"other":35}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **`git ls-files --modified --others` as the candidate source.** Rejected on measured coverage: it loses 14 of 29 changed `.md` files, all staged additions. (iteration 1)
- **Body-text grep over changed files as the fallback mechanism.** Rejected on contract: the keyed lane matches declared phrases, not prose. (iteration 1)
- **Porting `indexFreshness` verbatim.** Rejected on evidence: Skilled's index has no `publishedAt`, and checkout mtimes are not a build-time proxy. (iteration 1)
- **Running `--check` on zero-hit.** Rejected on documented cost: a full corpus walk, explicitly never per lookup. (iteration 1)
- **Adopting `perFileCap` alone.** One line per file still returns 13,113 rows corpus-wide for a single common token, so it does not bound output on its own. [INFERENCE: corpus-wide file count measured with the count recipe] (iteration 2)
- **Copying sweet-search's weighted allocation (Sainte-Laguë / `sat2`) into Skilled.** Would create a second relevance ranker beside the evidence-field/match-class tuple; the tuple already breaks the tie the allocation would be guessing at. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212] (iteration 2)
- **Measuring the flood with a shell sort.** A `sort -t: -k1,1 -k2,2n | head -20` emulation of the rank tuple reported 20 of 20 top lines from a single file for `deep research`, which the real ranker contradicts (15 distinct files in the same top 20). The emulation dropped the match-class component that precedes the path tie-break, so it manufactured a flood that the shipped ranker does not produce for that query. Re-measured by calling `search('structured', …)` directly; only the real-ranker numbers are used above. Candidate for "exhausted approaches": do not emulate the rank tuple with `sort`. (iteration 2)
- **Per-file cap on the trigger-index lane.** Structurally impossible to need: one row per document already. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:226-239] (iteration 2)
- **Applying line classes to the keyed lane.** It returns documents, not lines (Finding 1). No code change there can express the lesson. (iteration 3)
- **Demoting `template-default` phrases by deleting them.** The convention explicitly refuses to delete an author's phrase, so any fix must demote at rank time, not remove at generation time. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:91] (iteration 3)
- **Porting `classifyGrepLines` / `selectGrepLinesByClass` as written.** Both need a symbol entity list and an index-freshness predicate (Finding 6); adopting them would require the persistent index the topic forbids. (iteration 3)
- **Treating `FILL` as the boilerplate to demote.** It survives once per template example file and not across authored packets, so demoting it would buy almost nothing (Finding 4). The stock prose sentences are the real pollutant. (iteration 3)
- **A literal port of `probeOutsideScope`.** It requires `ensureSparseGramIndex` and a queryable gram index; the hard constraint forbids a persistent index and `retrieval-conventions.md` names vector/BM25/stateful retrieval as a declared loss. A port would return `null` on every call here. (iteration 4)
- **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path to help the rare one. (iteration 4)
- **Firing the hint on the keyed lane's unscoped zero.** With no scope supplied there is nothing out of scope, and the observed zero was a phrase miss (0 unscoped) rather than a scope miss. (iteration 4)
- **Treating `truncated` as the existing hint.** It reports the result cap, not the scope boundary; the scoped run above had `truncated: false` and still hid 3 documents in other tracks. (iteration 4)

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
[All tracked questions are resolved]

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
