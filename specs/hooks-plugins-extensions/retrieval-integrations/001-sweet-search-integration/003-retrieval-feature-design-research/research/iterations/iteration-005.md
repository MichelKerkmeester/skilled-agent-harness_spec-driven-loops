# Iteration 5: Q5 — Out-of-scope hint at minimum viable size

## Focus

Design feature 5, the out-of-scope hint, at its minimum viable size: the keyed-lane `outOfScope` field inside the existing posting loop, the ripgrep-lane `--scope` design, the threshold rule, and the concrete trigger that would justify building it. The hard constraint holds throughout: nothing that needs embeddings, vector or BM25 fusion, MCP, a daemon or a persistent index.

Scope of the answer: this iteration answers Q5 only. Four sibling iterations own Q1-Q4 in parallel.

## Actions Taken

1. Read `research/deep-research-config.json`, `deep-research-state.jsonl` and `deep-research-strategy.md`; confirmed `progressiveSynthesis: true`, session `2026-11-09T14:52:02Z`, and that the state log holds no iteration records yet (parallel fan-out; dispatch assigns iteration 5 with pre-substituted paths).
2. Read the phase 2 synthesis section for lesson 4 and its source iteration, `002-retrieval-lessons-research/research/iterations/iteration-004.md`, to carry the adopt/adapt/drop verdict and the measured costs forward.
3. Read `lookup-trigger-index.mjs` (all 384 lines) and `rg-wrapper.mjs` (all 357 lines) to fix exact insertion points and line ranges.
4. Traced every consumer of the lookup answer: `core/workflow.ts`, `generate-trigger-index.mjs`, `trigger-index.vitest.ts`, `host-trigger-index.vitest.ts`, and the documented CLI callers.
5. Read `retrieval-conventions.md` sections 3, 4, 5 and 9 to place the contract text and check the determinism rule the hint must not violate.

## Findings

1. **The keyed lane already computes the answer and discards it, and the discard point is exactly one line.** `lookup()` resolves `documentPath` and the scored class/score before the scope test, and the test is a bare `continue` at line 208. A tally there costs one `Map` increment per rejected posting, with no second read, no subprocess and no index beyond the one already parsed. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:202-224]

2. **The answer object has a fixed, additive-friendly shape, and every field is camelCase.** `candidatePhraseCount`, `discardedTokens`, `indexHash`, `manifestHash`, `normalizedQuery`, `results`, `schemaVersion`, `specFolder`, `tokens`, `truncated`. A nullable `outOfScope` key fits that convention and, being additive, cannot disturb a reader of the named fields. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:168-179]

3. **The only in-process consumer imports `loadIndex` and nothing else, so the field cannot break it.** `loadTriggerIndexRetrievalLibrary()` dynamically imports the module and picks `lookupModule.loadIndex`; `lookup()` is never called in-process outside tests. `generate-trigger-index.mjs` likewise imports only `loadIndex`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:286-300] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:62]

4. **No test passes `--spec-folder` today, and the scoped unit tests read named fields rather than the whole object.** The scoped cases call `lookup(..., { specFolder })` and assert `.results`; the CLI runner parses stdout JSON and the suite reads `candidatePhraseCount` and `results` by name. No assertion enumerates `Object.keys(answer)`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:878-889] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:909-914] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:854]

5. **The ripgrep wrapper has no scope concept, and its scoping mechanism is positional roots, not a flag.** `parseArgs` accepts `--root` (cwd) and repeatable `--search-root`; `search()` passes the roots to a recipe builder. A `--scope` flag is therefore genuinely new surface, and it must be defined against `--search-root` rather than layered on it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:260-292] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:204-212]

6. **A complement pass is expressible with the glob ordering the wrapper already relies on.** `GLOBS` documents "a later glob overrides an earlier one" and ends with the exclusions, so appending `--glob '!<scope>/**'` after `GLOBALS` yields "the default roots minus the scope" without a second root list or path arithmetic. The path-only recipe already carries `--max-count 1`, so the pass costs one path per matching file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:82-92] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:126-132]

7. **The hint is currently dead on the keyed lane and unused on the ripgrep lane.** No caller passes `--spec-folder` to the lookup: the documented Gate 1 form is unscoped, `/speckit:search` runs it unscoped, and the only mentions are the usage comment, tests and docs. `rg-wrapper.mjs` has no `--scope`, so no scoped ripgrep call exists to hint on. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18] [SOURCE: .skilled/commands/speckit/search.md:81] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:129]

8. **The determinism clause in section 5 is the binding constraint on the design.** "Two runs over an unchanged corpus therefore produce the same ordering" applies to the tuple. The hint must be outside the tuple: a sorted tally, no filesystem order, no timestamps, and no effect on `results` or the exit status. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212]

## Design

### Files and line ranges

| File | Change | Lines (current) |
|------|--------|-----------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Add `OUT_OF_SCOPE_THRESHOLD = 1` and `OUT_OF_SCOPE_TRACK_LIMIT = 5` after `PARTIAL_CLASS` | 85-86 |
| same | Extend the `lookup()` return JSDoc with the nullable field | 147-159 |
| same | Add `outOfScope: null` to the answer literal | 168-179 |
| same | Tally the rejected document in the posting loop, immediately before the `continue` | 208 |
| same | Decide emission after `answer.results` is assigned | 238-240 |
| same | New private helpers `outOfScopeTrackKey(documentPath)` and `rankOutOfScopeTracks(tally)` below `normalizeSpecFolder` | after 251 |
| same | Emit one `outside` line after the `candidates` line | 332-333 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Usage header gains `[--scope <path>] [--no-out-of-scope]` | 29-33 |
| same | `parseArgs` accepts and validates the two flags; `--scope` and `--search-root` are mutually exclusive | 260-292 |
| same | `search()` normalizes the scope, counts matches, and runs the conditional probe | 204-250 |
| same | New private helper `outOfScopeProbe(phrase, scope, options)` beside `search()` | before 252 |
| same | `formatSummary` prints the `outside` line when the field is non-null | 298-326 |
| same | `main()` forwards `scope` and `noOutOfScope` | 341-344 |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | New subsection at the end of section 3, plus one sentence in section 5 | after 168; after 212 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Keyed cases beside the existing scoped test | after 889 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts` | Ripgrep cases | end of file |

### Output change (JSON and human)

**Keyed lane — JSON.** One new nullable key on the `lookup()` answer:

```json
"outOfScope": { "documents": 3, "tracks": [{ "path": "specs/system-speckit", "count": 2 }, { "path": ".skilled/skills/system-spec-kit", "count": 1 }] }
```

- `null` when `specFolder` is `null`, when the query produced no candidate tokens, or when the in-scope answer holds more than `OUT_OF_SCOPE_THRESHOLD` (1) document.
- `documents` counts **distinct documents** the scope test rejected, so it is comparable with `results.length`. It is the full count, independent of `--limit` and of `truncated`.
- `tracks` is the first two path segments: `specs/<track>` for a `specs/` path, `.skilled/<area>` for a `.skilled/` path, otherwise the first segment. Sorted by `count` descending, then `path` in code-unit order; capped at `OUT_OF_SCOPE_TRACK_LIMIT` (5). `documents` is not the sum of the capped list.

**Keyed lane — human.** One line directly after `candidates`, omitted entirely when the field is null:

```text
candidates : 0 from 1136 phrase(s)
outside    : 3 document(s) in 2 other track(s): specs/system-speckit (2), .skilled/skills/system-spec-kit (1)
```

Exit codes are untouched: the field never turns exit 1 into exit 0, and never into exit 2.

**Ripgrep lane — JSON.** One new nullable key on the execution record:

```json
"outOfScope": { "scope": "specs/system-speckit/031-system-speckit-v4/017-memory-database-decommission", "files": 31, "sample": ["specs/other/a.md", "specs/other/b.md"] }
```

- `null` when `--scope` is absent, when the scoped run returned more than one match, when `--no-out-of-scope` is set, when the probe errored, or when the probe found nothing.
- `files` counts files with at least one match outside the scope. `sample` holds at most five repo-relative paths in code-unit order.
- `--scope <path>` replaces the default roots for the primary run (exactly one root), and is mutually exclusive with `--search-root`; both together is exit 2.

**Ripgrep lane — human.** After the existing `paths`/`ranked`/`counts` block, only when non-null:

```text
outside : 31 file(s) outside specs/system-speckit/031-system-speckit-v4/017-memory-database-decommission
  specs/other/a.md
  specs/other/b.md
```

### Threshold rule

One constant, one comparison, both lanes:

- **Keyed:** emit when `specFolder !== null && answer.results.length <= 1`. A scope that already answered with two or more documents has answered; the hint is for the near-empty answer, which is the only case where "the topic is absent here" and "the topic lives elsewhere" are indistinguishable.
- **Ripgrep:** emit when `scope !== null && noOutOfScope === false && matchCount <= 1 && record.outcome !== 'error'`, where `matchCount` is `results.length` for `structured`, `paths.length` for `path`, and `counts.length` for `count`.

The threshold is deliberately 1 rather than 0. A single hit is still a near-miss an operator may not trust, and the phase 2 measurement priced the probe as affordable exactly on the low-hit path. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:32-34]

### Contract text (exact wording for retrieval-conventions.md)

Append to section 3, after the parity paragraph that ends at line 168:

> ### Reporting what a scope hid
>
> A scoped search that finds little is indistinguishable from a topic the scope does not cover. Both lanes report the difference on one line, and only when the scope answered little.
>
> - **Trigger index lane.** `lookup()` returns `outOfScope: { documents, tracks }` when `--spec-folder` is set and the in-scope answer holds at most one document; otherwise `outOfScope` is `null`. `documents` counts distinct documents the scope test rejected. `tracks` lists the first two path segments (`specs/<track>` or `.skilled/<area>`), highest count first, path breaking ties, at most five entries.
> - **Ripgrep lane.** `rg-wrapper.mjs --scope <path>` narrows the search to that path and, when the scoped run returns at most one match, runs one path-only pass over the default roots with `--glob '!<scope>/**'`. The record carries `outOfScope: { scope, files, sample }`, `sample` holding at most five repo-relative paths in code-unit order. `--no-out-of-scope` suppresses the pass.
>
> The hint never changes a result set, an ordering or an exit status. A scoped miss stays exit 1.

Append to section 5, after line 212:

> The out-of-scope hint (`outOfScope`) is reporting only. It never enters the rank tuple, never reorders a result and never changes an exit status.

### Edge cases

- **Scope matches nothing** (`specs/missing`): every candidate document is out of scope, so the hint reports the real total. This is the case that most needs the line.
- **Scope is a root** (`specs`): the tally covers `.skilled` only, which is correct — the keyed tally is "documents the prefix test rejected", not "documents outside the corpus".
- **No usable query tokens** (`tokens.length === 0`): no postings are walked, so `outOfScope` stays `null`. The hint must not claim a scope miss for a query the lane never ran.
- **`--limit 0` and truncation:** the tally is computed before the cap and is independent of both; `truncated` is a limit fact, not a scope fact.
- **Trailing slash:** `normalizeSpecFolder` already strips it for the keyed lane; `parseArgs` must strip it for `--scope` so the exclusion glob and the `scope` field agree.
- **Absolute or escaping scope in `rg-wrapper.mjs`:** reject with exit 2 rather than emit a glob that could match nothing silently. A path containing `..` after normalization is refused.
- **Probe failure:** if the out-of-scope pass exits 2, the primary record is still returned with `outOfScope: null` and its own exit status. An optional diagnostic must never turn a clean scoped hit into an error.
- **Determinism:** both tallies sort by count descending then path in code-unit order; `sample` sorts by path. No filesystem iteration order, no timestamps.
- **Cost:** keyed +6 ms on a 4.6 MB parse already paid; ripgrep +0.77 s, spent only on a scoped query that returned at most one match. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22]

### Compatibility (callers and tests that parse the output today)

| Consumer | What it reads | Effect of the new key |
|----------|---------------|-----------------------|
| `core/workflow.ts:286-300` | `loadIndex` only | None; `lookup()` is not imported in-process |
| `retrieval/generate-trigger-index.mjs:62` | `loadIndex` only | None |
| `tests/trigger-index.vitest.ts:33-35` | `loadIndex`, `lookup`, `specFolderMatches`; named fields (`results`, `candidatePhraseCount`, `normalizedQuery`, `tokens`, `discardedTokens`, `indexHash`, `manifestHash`) | None; assertions read named fields, never `Object.keys` |
| `tests/trigger-index.vitest.ts:909-914` | CLI `--json` stdout parsed whole | Additive key only |
| `tests/host-trigger-index.vitest.ts:26,36` | `defaultIndexPath`, CLI stdout | Additive key only |
| Documented CLI callers (`SKILL.md:129`, `search.md:81`, Gate 1 pointer, README, troubleshooting, `trigger-config.md`) | Named fields, exit status | None; exit contract unchanged |
| `rg-wrapper.mjs` `formatSummary` | Named record fields | Additive key only; new line printed conditionally |
| `stableStringify(record)` JSON consumers | Named fields | Additive key only |

`SCHEMA_VERSION` in `rg-wrapper.mjs` stays `1`: its comment says to bump when a consumer *would have to change*, and an additive nullable key requires no change. If the build owner prefers strict versioning for the wrapper's JSON, bump to `2` and note it in section 3; that is the only open compatibility choice in this design.

The one behavior change that is not additive is `--scope` narrowing the primary run. It is a new flag, so no existing invocation changes.

### Test cases

Keyed lane, in `trigger-index.vitest.ts` beside the existing scoped test (`:878-889`):

1. Scoped lookup with zero in-scope and N out-of-scope documents → `outOfScope.documents === N`, tracks sorted by count then path.
2. Scoped lookup with two or more in-scope documents → `outOfScope === null`.
3. Unscoped lookup → key present with value `null`.
4. `specFolder: 'specs/missing'` → all candidates counted, tracks non-empty.
5. A query whose tokens all fall below the candidate floor → `outOfScope === null`.
6. Two identical scoped runs → `deepEqual` on the whole answer, proving determinism.
7. CLI `--json --spec-folder` → key present; exit still `1` on zero in-scope results.
8. `--limit 1` and `--limit 0` produce the same `outOfScope`.
9. Track keys: `specs/track/a.md` → `specs/track`; `.skilled/skills/system-spec-kit/a.md` → `.skilled/skills/system-spec-kit`.
10. Track cap: more than five tracks → `tracks.length === 5`, `documents` still the full count.

Ripgrep lane, in `rg-wrapper-recipes.vitest.ts`:

11. `--scope` with zero matches in scope and matches outside → `outOfScope.files > 0`, `sample` sorted and capped at five.
12. `--scope` with two or more in-scope matches → `outOfScope === null` and no second invocation.
13. `--no-out-of-scope` on a zero-hit scoped run → `outOfScope === null`.
14. `--scope` together with `--search-root` → exit 2 with a named error.
15. Absolute scope, or one escaping the cwd → exit 2.
16. Probe failure (injected ripgrep error) → primary record returned, `outOfScope === null`, primary exit preserved.
17. Human summary contains the `outside` line only when the field is non-null.
18. Recipe parity for the probe: argv is the path recipe over the default roots with `--glob '!<scope>/**'` last.

### Size

| Part | Code | Tests | Docs |
|------|------|-------|------|
| Keyed lane | ~25 LOC (constants, tally, two helpers, one format line) | ~70 LOC | ~10 lines |
| Ripgrep lane | ~45 LOC (two flags, validation, probe, one format block) | ~80 LOC | ~8 lines |
| **Total** | **~70 LOC** | **~150 LOC** | **~18 lines** |

Four files touched, no new module, no dependency, no index change.

### Concrete trigger that would justify building it

The design is build-ready but **deferred**, and the trigger is a consumer, not a date:

- **Primary trigger:** the first caller that passes a scope. Today there is none: the Gate 1 form is unscoped, `/speckit:search` runs the lookup unscoped, and no test passes `--spec-folder`. [SOURCE: .skilled/commands/speckit/search.md:81] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:129]
- **Secondary trigger:** a recorded scoped search that returned at most one hit while the same phrase found the needed fact in a sibling packet. No query log exists today, so this trigger is observational, not automatic.
- **If only one half is built, build the ripgrep half**, because section 3 makes positional scoping a documented live practice there and the wrapper is the only lane that can express it today. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:147-168]

## Questions Answered

- **Q5:** Design feature 5, the out-of-scope hint, at its minimum viable size: the keyed-lane `outOfScope` field inside the existing posting loop, the ripgrep-lane `--scope` design, the threshold rule, and the concrete trigger (which caller or command starting to pass a scope) that would justify building it.

## Questions Remaining

None for Q5. The open compatibility choice (`SCHEMA_VERSION` 1 or 2 for the wrapper) is named in the design and belongs to the build phase, not to research.

## Ruled Out

- **Porting `probeOutsideScope` literally.** It requires a sparse gram index; the hard constraint forbids a persistent index, so the port would return `null` on every call. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:18]
- **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path. The threshold confines it to the low-hit path. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22]
- **Firing on the keyed lane's unscoped zero.** With no scope there is nothing out of scope; the observed zero was a phrase miss. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:52]
- **Treating `truncated` as the hint.** It reports the result cap, not the scope boundary; a scoped run can be `truncated: false` and still hide documents in other tracks.
- **A second keyed pass to compute the tally.** The posting loop already holds every rejected document; a second pass would re-read the index for a fact already in hand.

## Dead Ends

None. Every named source existed and was read.

## Edge Cases

- **Ambiguous input:** "the concrete trigger" has two readings — a code consumer and an observed query. Both are named above; the code consumer is primary because it is checkable, the observation is secondary because no query log exists.
- **Contradictory evidence:** none. Phase 2's verdict and this iteration's code reading agree on cost and on the zero-consumer fact.
- **Missing dependencies:** none; `rg-wrapper-recipes.vitest.ts` was listed but not read in full, so the ripgrep test cases are specified against `rg-wrapper.mjs`'s exported surface (`search`, `parseArgs`, `formatSummary`, `main`) rather than against existing test scaffolding.
- **Partial success:** none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` (all 384 lines)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` (all 357 lines)
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` (255-344)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` (import line)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` (830-909)
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` (147-216, 283-313)
- `.skilled/commands/speckit/search.md` (81)
- `.skilled/skills/system-spec-kit/SKILL.md` (129)
- `specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md` (90-164)
- `specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md` (all 88 lines)

## Assessment

- New information ratio: 0.70
- Questions addressed: Q5
- Questions answered: Q5

## Reflection

- **What worked and why:** reading both lane files end to end before designing fixed the insertion points exactly and surfaced the one fact the phase 2 verdict could not state — that the only in-process consumer imports `loadIndex` alone, which turns "adding a field might break a caller" from a risk into a checked negative.
- **What did not work and why:** the first repository-wide search for callers was drowned by dispatch receipts under the research packet; narrowing to `.skilled` and then to the runtime tree produced the real consumer list. The lesson: search the runtime first, then docs, and treat generated receipts as noise.
- **What I would do differently:** read `rg-wrapper-recipes.vitest.ts` before specifying the ripgrep test cases, so they name existing fixtures instead of the exported surface only.

## Recommended Next Focus

Q5 is complete. The lineage's remaining step is synthesis: merge the five verdicts into one build-order table with sizes and triggers, and carry the single open compatibility choice (`SCHEMA_VERSION` for the wrapper) into it.

## SCOPE VIOLATIONS

None. All writes stayed inside the research packet; the researched runtime files were read only.
