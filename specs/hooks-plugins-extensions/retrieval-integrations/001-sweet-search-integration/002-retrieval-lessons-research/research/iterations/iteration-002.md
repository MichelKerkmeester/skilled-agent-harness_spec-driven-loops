# Iteration 2: Per-file caps with an elision line (Q2)

## Focus

Q2: does one large file (a `research.md`, an iteration log, a changelog) flood Skilled's ranked retrieval results today, and would a per-file cap, a one-line-per-file guarantee and a "N more hits in M files not shown" line help?

Scope discipline for this iteration: only the grep-side shaping modules named by the question (`core/search/grep-output-shaping.js`, `core/search/grep-allocation-rules.js`) were read on the sweet-search side; the two Skilled retrieval lanes (`lookup-trigger-index.mjs` + the free-text ranker in `lib/rg-lane.mjs` / `rg-wrapper.mjs`) and `retrieval-conventions.md` were read on the Skilled side. No embeddings, no vector or BM25 fusion, no MCP, no daemon, no persistent index is proposed anywhere below.

## Actions Taken

1. Read sweet-search `grep-allocation-rules.js` in full (97 lines) and the per-file/hidden-count sections of `grep-output-shaping.js` (188-261, 690-909).
2. Read Skilled's keyed lane (`lookup-trigger-index.mjs` 140-249) and the free-text lane (`lib/rg-lane.mjs` 88-132, 355-412; `rg-wrapper.mjs` 100-159, 196-250), plus `retrieval-conventions.md` in full.
3. Ran the keyed lane against this repo: `lookup-trigger-index.mjs --json --scoring-only -- "trigger index lookup"`.
4. Ran the real free-text ranker (not a shell emulation) via `rg-wrapper.search('structured', …)` over one packet's `research/` folder for four query shapes.
5. Ran the Section 2.3 count recipe corpus-wide and packet-scoped, to size the flood and to test whether the count pass reproduces the ranker's totals exactly.

## Findings

1. **The keyed lane cannot be flooded by one large document; it is document-deduped by construction.** `lookup()` keys its accumulator on the document path (`byPath`), keeps one row per document scored by that document's best phrase, sorts, then slices to `--limit` (default 20) and sets a `truncated` boolean. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:200-239] Real query `"trigger index lookup"`: 9 results, 9 unique paths, `truncated: false`, 1,054 candidate phrases. A per-file cap is a no-op on this lane. [INFERENCE: based on the byPath accumulator and the observed 9/9 unique-path result]

2. **The free-text lane does flood, and only for some query shapes.** Running the real ranker over one packet's `research/` folder (34 matching files, 594 matches for `deep research`) gave: `deep research` → 594 rows, top-20 spread over 15 files, max 2 per file; `research` → 16,566 rows, top-20 over 8 files, **max 12 per file**; `iteration` → 10,078 rows, top-20 over 6 files, **max 14 per file**; `research iteration` → 94 rows, top-20 over 6 files, max 6 per file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:230-234] [INFERENCE: measured by calling `search('structured', q, { roots })` and counting distinct `path` values in `results.slice(0,20)`]

3. **The mechanism behind finding 2 is the rank tuple, not the file size.** `rankMatches` sorts by evidence field, then match class, then path, then line. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411] Match class is a per-line property, so a multi-token prose query scatters classes across files and keeps the top-k diverse; a single-token query makes nearly every line the same class (`phrase-containment`), after which the path tie-break groups one file's lines contiguously and a k cut takes that file's block first. [INFERENCE: derived from the four measured query shapes and the sort key order at rg-lane.mjs:408-411]

4. **At corpus scale the flood is an order of magnitude worse and the row count is unusable.** The Section 2.3 count recipe over `specs .skilled` reports 13,113 matching files and 111,342 matches for `research`, with a single iteration log holding **3,142** of them; `deep research` gives 1,588 files with a maximum of 33 per file. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:109-117] [INFERENCE: counts observed from the documented count recipe run against this repo]

5. **Skilled already contains a fetch-side per-file cap, in one of two recipe builders for the same lane.** `structuredCappedRecipe` passes `--max-count 1`, justified as "the caller ranks by file and field, and the second match in a file never changes that". [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:100-112] The wrapper that actually serves the structured recipe has no `--max-count` at all, and ranks the full output. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:115-117] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:232] This is a live contradiction inside the codebase, and the capped builder's stated rationale is wrong on its own terms: the second match in a file is the only evidence that the file has more than one, so it changes both hit density and the elision count.

6. **sweet-search solves it with three coupled parts, not one cap.** (a) A streaming per-file cap that still counts what it drops: `applyGrepFileDiversity` keeps at most `perFileCap` per file and at most `maxFiles` files, returning `hiddenFileCount`, `hiddenMatchCount` and a `hiddenSample`. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js:188-261] (b) A one-line-per-file guarantee before any file gets a second line, then a weighted allocation of the remaining budget, with weight `sqrt(hits) x prior` so source outranks test outranks generated. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-allocation-rules.js:9-10] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-allocation-rules.js:53-96] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js:265-272] (c) Elision that is never silent: an inline `(+N more in this file)` appended to the last shown line of every truncated file, and a tail line `# +N more file(s) with M match(es) — e.g. …; narrow the regex, raise -k, or drill in with --in <file>`. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js:705-710] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js:760-763] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js:791-800]

7. **The totals pass the elision line needs already exists and is exact.** The count recipe returned 594 matches across 34 files for `deep research` in the same folder where the structured recipe returned 594 ranked rows across 34 files — identical totals, one extra invocation, no index and no daemon. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:109-117] Today the rank tuple carries no `more` and no hidden-files field, so that count is thrown away. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212]

8. **A per-file cap alone is not the fix; it is cap plus final-k plus the elision line.** Capping at one line per file still yields 13,113 rows corpus-wide for `research`, so a k cut is still required; and a k cut without the guarantee pass would simply re-introduce path-order bias, taking one line each from the alphabetically first k files. sweet-search's guarantee pass exists precisely so a k cut is breadth-fair. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-allocation-rules.js:53-65] [INFERENCE: 13,113 files is the corpus-wide file count for `research` measured with the count recipe]

## Questions Answered

- Q2 (per-file caps with an elision line): answered. Flood is real but query-shape dependent — 12-14 of 20 top slots to one file for a single-token probe, 2 of 20 for a multi-token phrase. The keyed lane is immune by construction. The elision line is the part Skilled actually lacks; the cap exists in one recipe builder but not the one the CLI uses. Verdict: **adapt**.

**Verdict detail for Q2 — adapt**

- Adopt: the elision line (`(+N more in this file)` per truncated file, plus `# +N more file(s) with M match(es) — e.g. …` when files are dropped) and the one-line-per-file guarantee ahead of the k cut.
- Adapt: do not copy the Sainte-Laguë allocation or the `sqrt(hits) x prior` weighting. Skilled's rank tuple already orders by evidence field and match class, which is a better relevance signal than hit count, and adding a second ranking system would put two rankers in the same lane. Use the cap only as a fetch bound and the guarantee only as a k-cut policy.
- Drop: any per-file cap on the keyed lane (no-op), and the `--max-count 1` rationale as written.
- File a build phase would change: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` (capped fetch + totals pass + `more`/`hidden` on each result), with `lib/rg-lane.mjs` reused rather than duplicated, and `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` §2.1/§5 updated to state the cap and the elision contract.
- Rough size: ~80-140 lines of code in `rg-wrapper.mjs`, ~20 lines of doc, plus tests in `runtime/cli/tests/rg-wrapper-recipes.vitest.ts`. No new module, no new dependency, no index, no daemon.

## Questions Remaining

- Q1, Q3, Q4, Q5 remain (each owned by a sibling iteration in this fan-out).
- Carried forward from this iteration: does the 3,142-match iteration log (`.../research/iterations-modes/iteration-038.md`) have a mirror copy that Q5's dedup would collapse, and does that change the cap arithmetic? Measured here only as a count, not as a duplicate.

## Ruled Out

- **Per-file cap on the trigger-index lane.** Structurally impossible to need: one row per document already. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:226-239]
- **Adopting `perFileCap` alone.** One line per file still returns 13,113 rows corpus-wide for a single common token, so it does not bound output on its own. [INFERENCE: corpus-wide file count measured with the count recipe]
- **Copying sweet-search's weighted allocation (Sainte-Laguë / `sat2`) into Skilled.** Would create a second relevance ranker beside the evidence-field/match-class tuple; the tuple already breaks the tie the allocation would be guessing at. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212]

## Dead Ends

- **Measuring the flood with a shell sort.** A `sort -t: -k1,1 -k2,2n | head -20` emulation of the rank tuple reported 20 of 20 top lines from a single file for `deep research`, which the real ranker contradicts (15 distinct files in the same top 20). The emulation dropped the match-class component that precedes the path tie-break, so it manufactured a flood that the shipped ranker does not produce for that query. Re-measured by calling `search('structured', …)` directly; only the real-ranker numbers are used above. Candidate for "exhausted approaches": do not emulate the rank tuple with `sort`.

## Edge Cases

- **Contradictory evidence (resolved):** two recipe builders for the same structured lane disagree on `--max-count`. Resolved in favour of the uncapped builder being the one that actually runs, verified by reading `search()` and by the observed 594-row return for a 594-match corpus scope. The contradiction itself is recorded as a finding rather than smoothed over.
- **Ambiguous input:** iteration-number derivation. The state log carries no `type: "iteration"` records (siblings for Q1/Q3/Q4/Q5 run in parallel), so counting records would yield iteration 1 while the dispatch pre-substitutes iteration 2. Followed the dispatch path (`iteration-002.md`), as the prompt pack owns the number.
- **Missing dependency:** none. All named modules and both Skilled lanes were readable.
- **Partial success:** none. All planned measurements ran.

## Sources Consulted

- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-allocation-rules.js:1-97
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js:188-261
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js:690-909
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:140-249
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:88-132
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:355-412
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:100-159
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:196-250
- .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:1-294
- Query: `lookup-trigger-index.mjs --json --scoring-only -- "trigger index lookup"` (9 results, 9 unique paths, truncated false, 1054 candidate phrases)
- Query: `rg-wrapper.search('structured', …)` over `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/002-deep-loop-effectiveness-and-fanout/research` for `deep research` (594 rows / 34 files / 15 files in top 20), `research` (16,566 / 8 / max 12), `iteration` (10,078 / 6 / max 14), `research iteration` (94 / 6 / max 6)
- Query: Section 2.3 count recipe corpus-wide for `research` (13,113 files, 111,342 matches, max 3,142 in one file) and `deep research` (1,588 files, max 33)

## Assessment

- New information ratio: 0.94
- Questions addressed: Q2
- Questions answered: Q2
- Findings: 8 total — 7 fully new, 1 partially new (the count recipe was already documented; its exact agreement with the ranker's totals is the new part), 0 redundant against packet state, which held no prior iteration records.

## Reflection

- What worked and why: reading both recipe builders before measuring. The contradiction in finding 5 is invisible from either file alone, and it is the actual build target — the cap exists, it is simply not wired into the path the CLI runs.
- What did not work and why: emulating the rank tuple with `sort`. The tuple has four components and the emulation kept two, so it silently removed the match-class spread that keeps multi-token queries diverse, and produced a dramatic but false flood number. The correction cost one extra call and changed the headline from "always floods" to "floods for single-token probes".
- What I would do differently: call the shipped ranker first and treat any shell approximation as a hypothesis, not a measurement.

## Recommended Next Focus

Q3 (meaningful-line preference over template boilerplate): the same rank-tuple component that decided this iteration's outcome — match class computed per line — is the surface Q3 would change, so the evidence here (class distribution dominating the top 20) is directly reusable. Secondary: hand Q5 the 3,142-match iteration log as a dedup candidate.

## Next Focus

Q3: meaningful-line preference (`core/search/grep-line-classes.js`) — would demoting template boilerplate improve results, shown with real queries?
