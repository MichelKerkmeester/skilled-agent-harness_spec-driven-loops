# Iteration 1: Feature 1 — total candidate count beside `truncated`

## Focus

Q1: design feature 1 at build-ready level — the exact field name and placement in the `lookup-trigger-index.mjs` answer object and `formatAnswer` output, every current caller and test that parses the answer, the section 9 exclusion-coverage row wording for `specs/**/research/**` in `retrieval-conventions.md`, and the test cases. Hard constraint restated: nothing in this design needs embeddings, vector or BM25 fusion, MCP, a daemon or a persistent index.

Selected interpretation: feature 1 is two additive changes in one packet-sized unit — (a) one new numeric field in the keyed lookup's answer, (b) one documentation row that records an exclusion the code already applies. Deferred alternatives: renaming `truncated`, adding a flag, or changing the human line for untruncated answers (all ruled out below).

## Actions Taken

1. Read the packet state: config, state JSONL (0 iteration records → iteration 1), strategy (Q1 focus, no exhausted approaches).
2. Read the phase 2 synthesis summary and recommendation ordering, then the matching section of iteration 5, which is the evidence this feature rests on.
3. Read `lookup-trigger-index.mjs` end to end: answer literal, candidate loop, cap block, `formatAnswer`, CLI `main`.
4. Grepped the whole `.skilled` tree for `loadIndex`, `lookup(`, `candidatePhraseCount`, `--scoring-only` and `truncated` to inventory every consumer of the answer.
5. Read `lib/corpus.mjs` exclusion list and the `isExcludedResearchPath` / `isExcludedDirectory` rules, then the coverage-parity suite's divergence table and research-walk test.
6. Read `retrieval-conventions.md` sections 5, 8 and 9 (ranking contract, lookup JSON mention, exclusion table).
7. Read the other answer consumers: `measure-cold-lookup.mjs`, `runtime/cli/core/workflow.ts`, `generate-trigger-index.mjs`, the doctor retrieval asset, and `host-trigger-index.vitest.ts`.

## Findings

### F1 — The seam is exactly where phase 2 said, and `ordered.length` is already in hand (redundant)

The ranked-and-filtered array is built at `:233`, `truncated` is derived from `ordered.length` at `:238`, and the capped slice is assigned at `:239`. The answer is declared in the literal at `:168-179` and documented in the JSDoc at `:148-159`. A total-count field therefore needs three declarations (JSDoc, literal default, assignment) and no new computation. This restates phase 2's finding; it is recorded because the design pins the line numbers. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:233] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:238]

### F2 — Field name and placement: `totalCandidates`, between `tokens` and `truncated` (new)

The answer literal is alphabetically ordered (`candidatePhraseCount`, `discardedTokens`, `indexHash`, `manifestHash`, `normalizedQuery`, `results`, `schemaVersion`, `specFolder`, `tokens`, `truncated`), so `totalCandidates` sorts between `tokens` and `truncated`. It must also be initialized to `0` in the literal, because the tokenless early return at `:182` returns the literal before any ranking runs — without the default, that path would emit `undefined` and drop the key from `JSON.stringify`. `totalCandidates` counts documents (the `byPath` Map dedups phrases per path at `:210-224`), after the scope filter and the `--scoring-only` filter, before the cap. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:168-182] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:210-224]

### F3 — Human output: show the total only on the truncated line (new)

The current line is `candidates : ${results.length}${truncated ? ' (truncated)' : ''} from ${candidatePhraseCount} phrase(s)` at `:332`. Adding `of ${totalCandidates}` only inside the truncated branch keeps every untruncated line byte-identical to today, so no doc example or log scraper changes; the truncated line becomes `candidates : 20 of 137 (truncated) from 42 phrase(s)`, which answers "was raising `--limit` worth it" directly. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:332]

### F4 — Compatibility surface is five consumers, and none parses a closed field set (partially new)

Every consumer reads named fields, never the whole object shape: `trigger-index.vitest.ts` asserts `candidatePhraseCount` (`:854`) and `truncated` (`:935`) and parses JSON in `runLookup` (`:910-915`); `host-trigger-index.vitest.ts` asserts only the human `source :` line and a path (`:183-184`); `measure-cold-lookup.mjs` reads `results.length` (`:99`); `workflow.ts` and `generate-trigger-index.mjs` import `loadIndex` only (`:293`, `:542`) and never call `lookup`; the doctor asset instructs recording `candidatePhraseCount` (`:176`) but parses nothing. No shell, `jq` or hook consumer of the answer exists — `--scoring-only` appears only in the lookup, its tests, a changelog and a generated manifest. Phase 2 named the test file; this caller inventory is new. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:854] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:293]

### F5 — The section 9 row must mirror `isExcludedResearchPath`, and the parity suite needs a matching entry (new)

The walker's rule is narrower than a glob: the first `research` segment must sit at index ≥ 3 under `specs`, its parent must match `/^\d{3}-/`, and everything below it is pruned except a single child named `research.md` (`:168-174`). The parity test already asserts the four behaviors (`specs/research/001-p/spec.md` kept, `…/research/iterations/x.md` pruned, `…/research/research.md` kept, `…/002-c/research/x.md` pruned), but `SCOPED_DIVERGENCES` registers only `lineages` and `fixtures` (`:82-101`), so the broader `research/**` divergence has no code-side twin even though the suite's own header calls itself the table's single source of truth (`:26-30`). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:168-174] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts:82-101]

---

## Design: Feature 1 — `totalCandidates` beside `truncated`, plus the section 9 row

### Files and line ranges

| File | Lines today | Change |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | 148-159 (JSDoc) | add `totalCandidates: number,` after `candidatePhraseCount` (`:156`) |
| same | 168-179 (answer literal) | add `totalCandidates: 0,` between `tokens` (`:177`) and `truncated` (`:178`) |
| same | 232-240 (cap block) | insert `answer.totalCandidates = ordered.length;` before `:238` |
| same | 323-338 (`formatAnswer`) | replace the `candidates :` template at `:332` |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | 279 (lookup JSON sentence) | append one sentence naming both counts |
| same | 302-313 (exclusion table) | insert one row after `lineages` (`:312`), before `fixtures` (`:313`) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | 816-896 (`describe('lookup')`) | three unit cases |
| same | 870-876 (tokenless test) | one assertion |
| same | 898-945 (`describe('lookup --scoring-only')`) | one CLI JSON case, one human-line case |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | 77-101 (`SCOPED_DIVERGENCES`) | third entry |
| same | 139-163 (research walk test) | two more expected paths |

### Output change (JSON and human)

`lookup()` JSDoc (`:148-159`) gains, after `candidatePhraseCount`:

```js
 *   totalCandidates: number,
```

The answer literal (`:168-179`) gains, alphabetically:

```js
    totalCandidates: 0,
```

The cap block (`:232-240`) becomes:

```js
  answer.totalCandidates = ordered.length;
  answer.truncated = limit > 0 && ordered.length > limit;
  answer.results = limit > 0 ? ordered.slice(0, limit) : ordered;
```

`formatAnswer` (`:332`) becomes:

```js
    `candidates : ${answer.results.length}${answer.truncated ? ` of ${answer.totalCandidates} (truncated)` : ''} from ${answer.candidatePhraseCount} phrase(s)`,
```

Resulting outputs:

- JSON, truncated: `"totalCandidates": 137` alongside `"results"` (20 rows) and `"truncated": true`.
- JSON, untruncated: `"totalCandidates"` equals `results.length`; `"truncated": false`.
- Human, truncated: `candidates : 20 of 137 (truncated) from 42 phrase(s)`.
- Human, untruncated: `candidates : 6 from 42 phrase(s)` — unchanged from today.
- Exit codes unchanged: `0` when any returned row scores above zero, `1` for a scoring-only miss, `2` for invocation or index failure. `totalCandidates` never affects the exit.

### Contract text (exact wording for `retrieval-conventions.md`)

Section 8, final paragraph (`:279`), replace the last sentence and keep the rest:

> The lookup applies its own two limits to the prompt, not to declared phrases: a query token shorter than three characters is dropped before matching, and only the first eight distinct eligible tokens are kept, in the order they first appear; both discards are reported in the lookup's JSON output. That output also carries `candidatePhraseCount`, the phrases whose text admitted the query, and `totalCandidates`, the documents ranked after the scoring filter and before `--limit`; `truncated` is true only when `totalCandidates` exceeds a non-zero `--limit`, so a caller can read how many candidates a cap hid instead of only that it hid some.

Section 9, exclusion-coverage table, new row inserted after the `lineages` row (`:312`):

> | `specs/**/research/**` (except a numbered packet's or phase's `research/research.md`) | Yes | No | Deliberate divergence. The trigger index indexes only the synthesis document and prunes the rest of that `research/` tree — iteration narratives, deltas, prompts, dispatch receipts and lineage copies — because it is run output rather than authored content. Ripgrep is a raw evidence lane with no ranking to protect, and a researcher may legitimately need to grep an iteration log or a prompt render for an exact fact; converging would be a real coverage loss. The narrower `lineages` row above still applies inside this tree |

Both statements are checkable against the code: `isExcludedResearchPath` enforces the `research.md` exception and the numbered-parent condition, and `answer.totalCandidates` is assigned from the post-filter, pre-cap array.

### Edge cases

| Case | Behavior |
|---|---|
| Every query token discarded (`tokens.length === 0`, early return `:182`) | literal default gives `totalCandidates: 0`; human line stays `candidates : 0 from 0 phrase(s)` |
| `--limit 0` | `truncated` false, `totalCandidates === results.length`; human line prints no total |
| `--scoring-only` | total is post-filter, so it counts only rows a raised limit would actually return under the same flags |
| `--spec-folder` scope | total is post-scope, because the scope filter runs during posting accumulation (`:208`) |
| `limit` greater than or equal to the ranked count | `truncated` false, no ` of N` segment |
| One document owning several candidate phrases | counted once — `byPath` is keyed by document path (`:210-224`) |
| Malformed or missing index | unchanged: exit `2` with stderr before `lookup` runs (`:365-371`) |
| A caller that reads only `truncated` | unchanged boolean, same truth table |

### Compatibility (callers and tests that parse the output today)

| Consumer | Site | What it reads | Impact |
|---|---|---|---|
| CLI `main` | `lookup-trigger-index.mjs:373-379` | whole answer for `JSON.stringify` / `formatAnswer` | additive key only |
| Unit tests | `trigger-index.vitest.ts:816-896` | `normalizedQuery`, `tokens`, `results`, `indexHash`, `manifestHash`, `candidatePhraseCount` (`:854`) | none — all preserved |
| CLI tests | `trigger-index.vitest.ts:910-915`, `:935` | `JSON.parse(stdout)`, `results`, `truncated` | none — `truncated` truth table unchanged |
| Host lookup test | `host-trigger-index.vitest.ts:180-184` | human `source :` line and one path | none — line untouched |
| Cold-lookup measurement | `measure-cold-lookup.mjs:97-102` | `results.length` | none |
| Index consumers | `workflow.ts:293`, `generate-trigger-index.mjs:542` | `loadIndex` only | unaffected — they never call `lookup` |
| Doctor asset | `doctor-speckit-retrieval.yaml:176` | instructs recording `candidatePhraseCount` | none; optionally also record `totalCandidates` |

No consumer validates a closed field set, so an additive key cannot break a parser. No hook, shell script or `jq` filter reads `.truncated` or the human `candidates` line.

### Test cases

1. Unit, truncated: `lookup(loaded, 'spec folder question', { limit: 2 })` on `buildFixtureIndex()` → `results` length 2, `truncated` true, `totalCandidates` 6 (the fixture's six documents are asserted at `:835-842`).
2. Unit, untruncated: `lookup(loaded, 'spec folder question')` → `results` 6, `truncated` false, `totalCandidates` 6.
3. Unit, cap lifted: same query with `{ limit: 0 }` → `results` 6, `truncated` false, `totalCandidates` 6.
4. Unit, filter order: `lookup(loaded, 'cified drift zone')` → `totalCandidates` 1; the same query with `{ scoringOnly: true }` → `totalCandidates` 0 and empty results, proving the filter runs before the count.
5. Unit, tokenless: extend the test at `:870-876` with `expect(answer.totalCandidates).toBe(0)`.
6. CLI JSON: `runLookup(indexPath, 'Spec folder question', ['--limit', '2'])` on the scoring fixture (four documents) → `status` 0, `results` 2, `truncated` true, `totalCandidates` 4.
7. CLI human: spawn without `--json` at `--limit 2` → stdout matches `/^candidates : 2 of 4 \(truncated\) from \d+ phrase\(s\)$/m`; a second spawn at the default limit must not contain ` of ` on that line.
8. Coverage parity: add `specs/t/001-p/002-c/research/research.md` to `expectedFiles` (kept) and `specs/t/001-p/research/prompts/x.md` (pruned) to the existing research-walk test.
9. Coverage parity: add the third `SCOPED_DIVERGENCES` entry named `specs/**/research/** (except a numbered packet's or phase's research/research.md)` with `triggerIndexExcludes: true`, `ripgrepExcludes: false` and the row's reason; the existing loop at `:208-212` asserts the flags and a non-empty reason.

### Size

| Area | Added lines | Modified lines |
|---|---:|---:|
| `lookup-trigger-index.mjs` | 3 | 1 (JSDoc line, literal line, assignment line; one template line replaced) |
| `retrieval-conventions.md` | 1 (table row) | 1 (paragraph sentence) |
| `trigger-index.vitest.ts` | ~29 | 0 |
| `retrieval-coverage-parity.vitest.ts` | ~13 | 0 |
| **Total** | **~46** | **2** |

Production and contract changes together are 4 edited lines plus 1 table row; the rest is tests. That matches phase 2's "about 3–5 lines" estimate.

## Ruled Out

- **`candidateDocumentCount` as the field name** — it parallels `candidatePhraseCount` but reads as a second phrase count in the same object; `totalCandidates` names the denominator the cap divided.
- **`hiddenCandidates` / `remainingCandidates` (the difference)** — derivable from `totalCandidates - results.length`, and storing a derived value invites drift.
- **Always printing `N of T` in the human line** — changes every untruncated answer for no caller benefit and churns documented output; only the truncated line gains information.
- **A `--report-total` flag** — the number is already computed; a flag creates a mode with no consumer.
- **Human-only reporting** — Gate 1 reads `--json`, so a human-only field would never reach the caller that needs it.
- **Renaming `truncated` to a count** — breaks the boolean assertion at `trigger-index.vitest.ts:935` and every caller comparing it; additive is cheaper and reversible.

## Dead Ends

None definitively eliminated this iteration. The six ruled-out directions above are design alternatives, not exhausted research paths.

## Edge Cases

- Ambiguous input: the field name had two defensible spellings. Selected `totalCandidates`; `candidateDocumentCount` is recorded in Ruled Out.
- Contradictory evidence: none. The code, the parity test and section 9 agree on the `research/**` rule; only the document is silent.
- Missing dependencies: none. Every source was readable in the worktree.
- Partial success: none. All planned actions completed.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:83,148-159,168-182,198,210-240,323-338,365-379`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:61-73,168-174,190-195`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:816-896,898-945`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:170-185`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts:26-30,77-101,139-163,187-213`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-213,245-281,283-315`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:97-102`
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:243-247,290-296`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:62,539-543`
- `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:31-32,176`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md:18-22,122-136`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:29,51-53`

## Questions Answered

- Q1: Design feature 1, the total candidate count: the exact field name and placement in the lookup-trigger-index.mjs answer object and formatAnswer output, every current caller and test that parses the answer (so nothing breaks), the section 9 exclusion-coverage row wording for specs/**/research/** in retrieval-conventions.md, and the test cases.

## Questions Remaining

- Q2: zero-hit fallback to git-changed spec docs.
- Q3: per-file flood control in the ripgrep wrapper.
- Q4: boilerplate demotion.
- Q5: out-of-scope hint.

## Assessment

- New information ratio: 0.70
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: reading the answer consumers before choosing a name. The field set is open everywhere, so an additive key was safe without a compatibility shim; had any consumer asserted a whole-object equality, the design would have needed a version note instead.
- What did not work and why: the first grep for callers used a glob exclusion that silently matched nothing, which would have understated the consumer list. Re-running with a plain pattern and a narrower path fixed it; the lesson is to verify a zero-match grep before trusting it.
- What I would do differently: read `lib/corpus.mjs`'s research rule before drafting the section 9 row. The draft first said "prunes every `research/` tree", which the walker does not do — `specs/research/001-p/spec.md` is walked and a numbered packet's `research.md` survives.

## Next Focus

Q2: the zero-hit fallback to git-changed spec docs — module boundary, git command and parsing, scoring with existing helpers, `staleFallback` answer field, exit codes, opt-out flag, contract amendments and test matrix.
