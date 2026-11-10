# Iteration 4: Q4 — Out-of-scope hit hint

## Focus

Whether a one-line "also N hits in other tracks: X, Y" would help a track- or packet-scoped search that returns little, and what it costs on this repository. Sources named by the question were read before any claim: sweet-search `core/search/grep-outside-probe.js`, Skilled `lookup-trigger-index.mjs`, and `retrieval-conventions.md`. Four real queries were run against this checkout (two keyed, two ripgrep) so the cost figures are observed, not inferred.

Scope of the answer: this iteration answers Q4 only. The four sibling iterations own Q1, Q2, Q3 and Q5.

## Actions Taken

1. Read `research/deep-research-config.json`, `deep-research-state.jsonl` and `deep-research-strategy.md`; confirmed iteration 4 of 5, no prior iteration records, `progressiveSynthesis: true`, session `2026-11-09T14:31:51Z`.
2. Read the full sweet-search probe module and both Skilled files named in the question.
3. Searched the repository for any caller that passes `--spec-folder` to the keyed lookup, and for any existing out-of-scope concept in the retrieval runtime.
4. Ran four real queries: keyed scoped, keyed unscoped, ripgrep scoped, ripgrep unscoped — each timed.

## Findings

1. **sweet-search's probe is conditional on a persistent index, so its mechanism cannot transfer.** `probeOutsideScope` returns `null` — meaning "run the exact search instead" — unless a sparse gram index exists and answers `queryLiterals`, and it declines again when the candidate pool is at or under the exact threshold. Past that threshold it reads at most 512 candidate files (2048 when the scope itself answered nothing) and reports `N+ files` when the pool was capped. Every constant in that file exists to bound a whole-repo grep: the header states the cost model directly, "~11 us a file on kubernetes … 33 ms for 3,023 … 300-800 ms for a license header in 26,000". [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-outside-probe.js:57-67] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-outside-probe.js:24-30] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-outside-probe.js:1-14]

2. **Skilled's keyed lane already computes the out-of-scope answer and throws it away.** In `lookup()`, the posting loop resolves `documentPath` and the scored match class/score *before* the scope test, and the scope test is a bare `continue`. Counting the rejected documents, and tallying their top-level path segment, is one `Map` increment at that exact point — no second read, no subprocess, no index beyond the one already parsed. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:202-224]

3. **Measured on this repo: the hint is free on the keyed lane and 64x on the ripgrep lane.** Phrase `trigger index generator`, scoped to this packet: 0 documents from 1,136 candidate phrases, 0.101 s. The same phrase unscoped: 3 documents in 2 other tracks (`specs/system-speckit/031-system-speckit-v4` ×2, `.skilled/skills/system-spec-kit` ×1), 0.107 s — the hint's data costs +6 ms, inside the 4.6 MB index parse already paid. Ripgrep lane, phrase `goal posture rule`: scoped 0.012 s / 0 files, unscoped 0.772 s / 31 files — 64x, because there it is a second whole-corpus pass. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:106-122]

4. **No lane emits any out-of-scope signal today, and no live caller passes a scope to the keyed lane.** The answer object carries `truncated` (a limit fact) and nothing about scope, so the scoped run printed `results: []` beside `candidatePhraseCount: 1136` — indistinguishable from "this packet knows nothing about the topic" when 1,136 phrases matched tokens. A repository-wide search for `lookup-trigger-index.mjs … --spec-folder` returns only the script's own usage comment and archived transcripts, so the Gate 1 form mandated by `AGENTS.md` is unscoped and the scoped keyed lane has no consumer. `rg-wrapper.mjs` has no scope concept at all: its surface is `--search-root` repeats, so a caller narrows the roots and the wrapper has no way to know anything was left out. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:168-179] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:29-33]

5. **The two lanes disagree about what a miss means, and that decides who needs the line.** For `goal posture rule` the keyed lane returns 0 documents even unscoped — a *phrase* miss, since no author declared it — while ripgrep returns 31 files unscoped and 0 in scope: a genuine in-scope absence with presence outside. A hint fired on the keyed lane's zero would therefore be misleading, while on the ripgrep lane it is exactly the missing fact. Scoping is a documented live practice only for the ripgrep lane, where Section 3 makes the positional path the whole mechanism. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:149-168] [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:206-212]

## Verdict: ADAPT

Adopt the signal, drop the machinery, and split by lane.

- **Adopt** the one-line shape and its trigger condition: print only when the scope answered little, name the count and the ranked top files. Keep sweet-search's `scopeAnswered` idea — a scope that already answered gets a cheaper probe than one that returned nothing — because that is the difference between a useful nudge and noise.
- **Adapt, keyed lane (primary):** add `outOfScope: { documents: n, tracks: [{ path, count }] }` to the `lookup()` answer, computed inside the existing posting loop at the `continue`, and emitted only when `specFolder !== null` and the in-scope result is under a small threshold. Rough size: 20-30 lines in `lookup()` plus one line in `formatAnswer`. Cost measured above: +6 ms, no I/O, no dependency, no index change.
- **Adapt, ripgrep lane (secondary, genuinely new feature):** `rg-wrapper.mjs` would need a `--scope <path>` input it does not have today, then a conditional path-only second pass over the remaining roots when the scoped pass returns at most one match. Rough size: 35-45 lines plus a threshold constant. Cost on this repo: 0.77 s, acceptable only because it fires on a low-hit scoped query and never on an ordinary one.
- **Drop from the sweet-search implementation:** the gram-index candidate capping, the 800 / 512 / 2048 constants, the `N+ files` elision, source-file-first ordering and the "print only for a source file" gate. All of it bounds a grep cost that the keyed lane does not have and that the ripgrep lane cannot afford per call.

**Caveat that bounds the verdict:** the keyed-lane half is cheap but currently dead — no caller passes `--spec-folder`, so the field would never populate. Build it alongside the first real scoped consumer, not before. If a build phase must pick one, pick the ripgrep lane, where scoping is actually practiced.

**Files a build phase would change**

| File | Where | Rough size |
|------|-------|-----------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | answer shape `:168-179`, posting loop `:202-224`, `formatAnswer` `:323-338` | ~25 LOC |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | usage/`parseArgs` `:29-33`, report assembly | ~40 LOC (new `--scope`) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | existing `specFolder` cases `:882-894` | ~40 LOC |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | §3 or §5, one paragraph | ~1 paragraph |

## Ruled Out

- **A literal port of `probeOutsideScope`.** It requires `ensureSparseGramIndex` and a queryable gram index; the hard constraint forbids a persistent index and `retrieval-conventions.md` names vector/BM25/stateful retrieval as a declared loss. A port would return `null` on every call here.
- **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path to help the rare one.
- **Firing the hint on the keyed lane's unscoped zero.** With no scope supplied there is nothing out of scope, and the observed zero was a phrase miss (0 unscoped) rather than a scope miss.
- **Treating `truncated` as the existing hint.** It reports the result cap, not the scope boundary; the scoped run above had `truncated: false` and still hid 3 documents in other tracks.

## Dead Ends

None. Every named source existed and every query ran.

## Edge Cases

- **Ambiguous input:** "other tracks" has no definition for a lane whose corpus includes `.skilled/skills` as well as `specs/`. Selected interpretation: report the first two path segments (`specs/<track>` or `.skilled/<area>`) — the same key used in the measurement. Deferred: whether a build phase should restrict the tally to `specs/` tracks only.
- **Contradictory evidence:** none found.
- **Missing dependencies:** none; all three named files were read.
- **Partial success:** none.

## Sources Consulted

- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-outside-probe.js` (all 109 lines)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` (all 384 lines)
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` (all 333 lines)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` (header and argument surface)
- Live queries, this checkout, 2026-11-09: keyed scoped/unscoped for `trigger index generator`; ripgrep scoped/unscoped for `goal posture rule`

## Assessment

- New information ratio: 0.85
- Questions addressed: Q4
- Questions answered: Q4

## Reflection

- **What worked and why:** reading the probe's own cost comments before running anything made the right measurement obvious — the question is a cost question, so the decisive experiment was scoped-vs-unscoped timing on both lanes rather than a feature comparison. The keyed-lane result (+6 ms) is the finding that changes the verdict: it moves the lesson from "expensive, skip it" to "free where it is cheap, optional where it is not".
- **What did not work and why:** the first probe phrase, `goal posture rule`, turned out to be a keyed-lane phrase miss at every scope, which would have shown "no scope effect" for the wrong reason. Re-running with a declared phrase (`trigger index generator`) isolated the scope variable. The lesson: a scope experiment needs a phrase the index actually holds.
- **What I would do differently:** confirm the phrase is a declared trigger before using it as a scope probe, and check the consumer question (`--spec-folder` callers) before designing the field, because a zero-consumer field is the main risk in the recommendation.

## Recommended Next Focus

Siblings own Q1-Q3 and Q5 in parallel; this lineage's remaining step is synthesis of the five verdicts into one adopt/adapt/drop table with sizes. If a sixth iteration were available, the narrowest useful one is confirming whether the resume ladder or any command would pass `--spec-folder` — that single fact decides whether the keyed-lane half is worth building at all.
