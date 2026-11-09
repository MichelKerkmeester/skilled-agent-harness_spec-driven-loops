---
title: "Research: build-ready designs for five retrieval improvements"
description: "Implementation-ready designs for five system-spec-kit retrieval improvements borrowed from sweet-search. Features 1-3 are ready to build in one packet; features 4-5 are designed but stay deferred behind named triggers."
trigger_phrases:
  - "retrieval feature design research"
  - "trigger index zero hit fallback design"
  - "rg wrapper flood control design"
importance_tier: "important"
contextType: "research"
---
# Research: build-ready designs for five retrieval improvements

<!-- ANCHOR:summary -->
## 1. Executive Summary

All five features now have designs a build phase can implement without further research. Each design names files and line ranges, the output change, exact contract wording, edge cases, current callers and tests, and test cases. None needs embeddings, MCP, a daemon or a new index.

| # | Feature | Status | Production change | Tests | Total size |
|---|---|---|---|---|---|
| 1 | Total candidate count | Build | 4 lines + 1 table row | ~42 lines | ~48 lines |
| 2 | Zero-hit fallback to changed files | Build | ~150–190 lines | ~250–320 lines | ~420–530 lines |
| 3 | One line per file + "+N more" | Build | ~80–100 lines | ~90–120 lines | ~200 lines |
| 4 | Rank structure above boilerplate | Defer | ~30 lines | ~85 lines | ~125 lines |
| 5 | Out-of-scope hint | Defer | ~70 lines | ~150 lines | ~240 lines |

Four results change the phase 2 picture:

- **Feature 2 must use `git status --untracked-files=all`.** The default mode collapses a brand-new, never-added packet folder into one `dir/` entry, which is exactly the case the fallback exists for. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:22]
- **Feature 3 should not use the existing capped recipe; it should be deleted.** `--max-count 1` keeps a file's first matching line, not its best-ranked one, and it destroys the per-file totals the "+N more" line needs. The recipe has no callers. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:24] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:26]
- **Feature 4's flood turned out to be a volume problem, and feature 3 owns volume.** The stock-sentence flood is 783 identical blockquote lines. A line class can't separate rows that are all the same. The gap a line class does fix is different: table rows for `acceptance criteria` first appear at body position 371. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-004.md:26] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-004.md:30]
- **No query log exists.** The deferred features' triggers must be recorded, reproducible queries in a packet, not log entries. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-004.md:36]
<!-- /ANCHOR:summary -->

---

## 2. Research Question and Scope

- **Question.** What is the build-ready design for each of the five retrieval improvements rated in phase 2?
- **Hard constraint.** No embeddings, no vector or BM25 fusion, no MCP, no daemon, and no persistent index beyond the committed trigger index.
- **Out of scope.** Writing code, and re-deciding whether to build. Phase 2 settled that: build features 1–3, defer 4–5.

---

## 3. Methodology

- **Workflow.** Five iterations of `/deep:research:auto`, one feature each, run in parallel on cli-devin with `deepseek-v4-1-flash-max` at the operator's direction. All five passed `verify-iteration.cjs`.
- **Brief.** Each iteration had to read the exact Skilled code, tests and callers it would change, cite `path:line`, and deliver a fixed set of design headings.
- **Synthesis.** It reconciled two cross-feature conflicts that the parallel runs could not see (section 9).

---

## 4. Feature 1: Total Candidate Count (build)

**Change.** Add `totalCandidates` to the keyed lookup answer, placed alphabetically between `tokens` and `truncated`. It defaults to `0` in the answer literal, so the early return on empty tokens still emits it. Assign it from `ordered.length` just before `truncated` is computed. It counts documents after the scope and `--scoring-only` filters, before the `--limit` cap. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:25] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:45]

**Human output.** Only the truncated line changes: `candidates : 20 of 137 (truncated) from 42 phrase(s)`. Every untruncated line stays byte-identical. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:29]

**Contract.**
- Section 8 gains a sentence defining `totalCandidates` and how it relates to `truncated`.
- Section 9 gains a `specs/**/research/**` row (trigger index: yes, except `research.md`; ripgrep: no) stating the deliberate divergence. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:97]
- The coverage-parity suite gains a third `SCOPED_DIVERGENCES` entry, so the table and its code-side twin stay in sync. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:37]

**Compatibility.** Five consumers exist. None parses a closed field set, so the new key is safe. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:33]

**Tests.** Nine cases: truncated, untruncated, `--limit 0`, filter order, the tokenless path, CLI JSON, CLI human, and two parity entries. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:136]

---

## 5. Feature 2: Zero-Hit Fallback to Changed Files (build)

**Shape.**
- **Module.** A new `lib/changed-docs.mjs`, loaded with a dynamic `import()` only on a zero-hit, so normal lookups pay nothing. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:18]
- **Entry point.** `lookup()` stays synchronous and unchanged. A new async `lookupWithFallback()` calls it with `limit: 0`, merges any fallback hits, then applies the slice itself. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:20]
- **Git command.** `git status --porcelain=v1 -z --untracked-files=all -- <roots>`, scoped to `--spec-folder` when one is given. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:22]
- **Parsing.** Renames and copies emit a second field; keep the new path. Skip deletions. Keep staged additions. Submodules and directories drop out through the `*.md` check plus `isFile()`. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:24]
- **Scoring.** Read declared phrases with `readTriggerPhrases` and score them with the existing `scorePhrase`, best per document. Sort paths before reading, so the order never depends on git's output. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:28]

**Output.**
- A `staleFallback: { available, files, matches, paths, truncated }` field, appended last and present only when the fallback ran. All other JSON stays byte-identical. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:30]
- In human output, one `fallback :` line.
- Exit `1` only when the index and the fallback both found nothing. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:32]

**Opt-outs.** `--no-stale-fallback`, and implicitly any explicit `--index`. This keeps every test fixture and parity artifact hermetic. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:26]

**Budget.**
- Scoped: about 0.05 s.
- Repo-wide: about 0.9 s.
- `MAX_FALLBACK_FILES = 200`, over a sorted list, caps the worst case. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:36]

**Contract.**
- Section 4 gains a "keyed-lane zero-hit fallback" note.
- Section 5's determinism promise becomes "deterministic for a fixed index and a fixed worktree state". [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:105]

**Tests.** An 18-case git-fixture matrix in a new `stale-fallback.vitest.ts`. It covers staged files, untracked folders, renames, deletions, non-git directories, a missing git binary, both opt-outs, scope, the limit, the cap, determinism and the human format. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:151]

---

## 6. Feature 3: One Line per File + "+N more" (build)

**The flood is live in the shipped wrapper.** Searching `iteration` in one research folder returned 190 rows across 6 files, and all 20 displayed rows came from one file. JSON output emits every row, because the only cap is a display slice. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:22]

**Change.**
- After `rankMatches`, keep the first row per path. That row is already the file's best-ranked line, so this needs no re-sort and keeps determinism. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:30]
- Then cut to `--limit`: default 20, with `0` meaning uncapped. This is the same flag name the keyed lane uses. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:34]
- Totals come from the same ripgrep run, with no second scan. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:28]
- Delete the unused `structuredCappedRecipe`.

**Output.** JSON gains `matchCount`, `fileCount`, `hidden: { files, matches }`, `limit`, and `moreInFile` on each row. `results` now holds one row per file, so the wrapper's `schemaVersion` goes to 2. Human output gains `(+N more in this file)` and a tail line `+N more files with M matches`. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:68]

**Compatibility.** [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:32] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:156]
- **One test breaks as written:** "ranks a frontmatter hit above a body hit" puts both lines in one file. Move the body line to a second file.
- **One caller changes one line:** `ops/retrofit-convention.mjs` should read `record.matchCount`.
- `search-presentation.txt` needs a hidden-count slot.

---

## 7. Feature 4: Rank Structure above Boilerplate (designed, deferred)

**Minimum design.**
- Add a `bodyClass` inside the `body` evidence field, computed from the matched line text with no new I/O: `structural` for headings and table rows, `guidance` for blockquotes and HTML comments, `content` for everything else.
- It becomes item 3 of the rank tuple, before path.
- The JSON field is additive, so `schemaVersion` is unchanged.
- About 125 lines.

[SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-004.md:42] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-004.md:119]

**Cheaper versions rejected.**
- A stock-sentence deny list covers less than the blockquote class and drifts as the templates change.
- Demoting template folders touches 0.4% of the free-text flood. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-004.md:32] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-004.md:34]

**Trigger.** A packet iteration or review records a reproducible `rg-wrapper.mjs structured "<query>"` run where a `guidance` row sits in the top 10 ahead of a structural or content row the caller then needed.

**Separate, already-measured problem.** On the keyed lane, three template copies outrank a real packet for `acceptance criteria closure gate`. That fix needs a schema or path-policy decision, not a line class.

---

## 8. Feature 5: Out-of-Scope Hint (designed, deferred)

**Minimum design.**
- **Keyed lane.** Tally the documents rejected by the bare `continue` in the posting loop. Return `outOfScope: { documents, tracks }` when a scope is set and at most one in-scope document was found. Tracks list at most five, sorted by count and then path. About +6 ms. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-005.md:19] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-005.md:97]
- **Ripgrep lane.** A new `--scope <path>` flag. When the scoped run returns at most one match, one path-only pass runs over the default roots with `--glob '!<scope>/**'` appended last. The glob order already supports this. About 0.77 s, only on that low-hit path. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-005.md:29]
- **Reporting only.** The hint never changes results, ordering or the exit code. This keeps the section 5 determinism promise. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-005.md:33]
- **Size.** About 70 lines of code and 150 lines of tests.

**Trigger.** The first caller that passes a scope. Today none does: Gate 1 and `/speckit:search` run the lookup unscoped. If only one half is ever built, build the ripgrep half. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-005.md:31] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-005.md:188]

---

## 9. Cross-Feature Conflicts Resolved

The parallel iterations could not see each other. Synthesis settles these:

1. **The wrapper's `schemaVersion`.** Feature 3 bumps it to 2, because `results` changes meaning. Feature 5 assumed it stays 1. **Resolution:** feature 3 owns the bump. Features 4 and 5 add only nullable fields, so they need no further bump.
2. **`totalCandidates` with the fallback.** Feature 2's `lookupWithFallback()` re-slices after the merge, so it must recompute `totalCandidates` and `truncated` from the merged list. Otherwise feature 1's count would undercount fallback hits. **Resolution:** build feature 1 first, then feature 2 sets both fields after the merge and adds one test for it.
3. **The keyed lookup's human `candidates :` line.** Feature 1 owns it. Feature 2 adds its own `fallback :` line rather than changing it. Both designs already agree on this.
4. **The `--limit` name.** Feature 3 reuses the keyed lane's `--limit`, with the same default of 20 and `0` meaning uncapped, so there is one vocabulary across both lanes.

---

## 10. Recommendations: Build Phase Task List

**One build packet inside `.skilled/skills/system-spec-kit/`, in this order:**

1. **Feature 1:**
   - `totalCandidates` in `lookup-trigger-index.mjs`: JSDoc, literal default, assignment and the human line.
   - The section 8 sentence and the section 9 `research/**` row in `retrieval-conventions.md`.
   - Tests in `trigger-index.vitest.ts`, and a third `SCOPED_DIVERGENCES` entry in `retrieval-coverage-parity.vitest.ts`.
2. **Feature 2:**
   - New `lib/changed-docs.mjs`.
   - `lookupWithFallback()`, the `--no-stale-fallback` flag, an async `main()` and the `fallback :` line.
   - Recompute `totalCandidates` and `truncated` after the merge.
   - Section 4 and section 5 amendments, plus the retrieval README.
   - New `stale-fallback.vitest.ts`: the 18-case matrix plus the merged-count case.
3. **Feature 3:**
   - First-row-per-file shaping and the `--limit` cut in `rg-wrapper.mjs` and `lib/rg-lane.mjs`.
   - Delete `structuredCappedRecipe`.
   - `schemaVersion` 2, the new JSON fields and the human suffix and tail lines.
   - Fix the one breaking test, update `ops/retrofit-convention.mjs:488` and `search-presentation.txt`.
   - Sections 2.1 and 5 contract text.
4. **Gate:**
   - Run the full system-spec-kit retrieval test suite before the change for a baseline, then after it, and report the difference.
   - Run the Gate 1 lookup for a freshly created packet and confirm it is found through `staleFallback`.

**Deferred, with designs on file:** features 4 and 5, each behind its trigger in sections 7 and 8.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| A new `--k` flag in the ripgrep wrapper | Splits the vocabulary; `--limit` already exists on the keyed lane | iteration-003.md:34 | 3 |
| Wire `structuredCappedRecipe` (`--max-count 1`) | Keeps a file's first line, not its best, and loses the totals | iteration-003.md:26 | 3 |
| A count recipe as a second scan for totals | The same ripgrep run already holds every match | iteration-003.md:28 | 3 |
| Make `lookup()` async | Breaks direct test callers; a wrapper function is safer | iteration-002.md:20 | 2 |
| Default `--untracked-files` mode | Hides a brand-new packet folder | iteration-002.md:22 | 2 |
| Run the fallback when `--index` is given | Breaks fixture isolation | iteration-002.md:26 | 2 |
| A stock-sentence deny list | Narrower than the blockquote class, and drifts | iteration-004.md:32 | 4 |
| Demote template folders in free text | Touches 0.4% of the flood | iteration-004.md:34 | 4 |
| Let the out-of-scope hint affect results or the exit code | Breaks the section 5 determinism promise | iteration-005.md:33 | 5 |

---

## Divergence Map

- **Saturated directions.** Additive answer fields with named-field consumers. All five iterations confirmed that no consumer parses a closed field set.
- **Pivots taken.** None.
- **Pivot failures and audited overrides.** The operator chose parallel runs. Two conflicts that resulted were resolved in section 9.
- **Remaining frontier.** The keyed-lane template inversion, which needs a schema or path-policy decision.

---

## 11. Open Questions

- Should the build packet bump the wrapper's `schemaVersion` even though nothing reads it today? This design says yes, as part of feature 3.
- Should the keyed-lane template inversion get its own packet? It is measured, but outside these five features.

---

## 12. Executor Provenance

- **Iterations 1–5:** cli-devin, `deepseek-v4-1-flash-max`, all run in parallel.

---

## 13. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: feature 3 flood-control design; run 4: feature 4 minimum design (defer); run 5: feature 5 minimum design (defer)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
