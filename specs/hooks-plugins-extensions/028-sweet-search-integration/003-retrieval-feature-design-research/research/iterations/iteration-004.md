# Iteration 4: Q4 — Boilerplate Demotion at Its Minimum Viable Size

## Focus

Design feature 4 (boilerplate demotion) at its minimum viable size: which Markdown line classes belong inside the `body` evidence field, where the class enters the rank tuple without breaking determinism, whether a cheaper version (a stock-sentence list, or demoting template folders) gets most of the value, and the concrete trigger that would justify building it.

Hard constraint held throughout: no embeddings, no vector or BM25 fusion, no MCP, no daemon, no persistent index beyond the committed trigger index. This iteration answers Q4 only; four sibling iterations cover Q1, Q2, Q3 and Q5.

Ambiguity resolved up front: "a cheaper version" names two different alternatives with two different targets, so both were measured separately rather than treated as one option.

## Actions Taken

1. Read the phase 2 synthesis section 6 and iteration 3 (the source lesson) for the claim being designed against.
2. Read `lib/rg-lane.mjs` end to end: `EVIDENCE_FIELDS`, `frontmatterFieldLines`, `isAnchorMarker`, `rankMatches` and the sort comparator.
3. Read `rg-wrapper.mjs`: the `search()` call into `rankMatches`, `formatSummary`, `schemaVersion` and the recipe builders.
4. Read `retrieval-conventions.md` sections 2.1, 5, 8 and 9 for the normative tuple and the coverage table.
5. Read `rg-wrapper-recipes.vitest.ts` for every assertion that parses a structured result.
6. Measured the real corpus with the wrapper: the stock-sentence query, a second stock guidance sentence, `closure gate`, and `acceptance criteria`; classified every returned line shape from the match text alone.
7. Re-measured the keyed lane for `acceptance criteria closure gate` to check whether the phase 2 template inversion still holds.
8. Searched the retrieval lane for any query logging surface and the runtime for compiled copies of these modules.

## Findings

1. **The measured boilerplate flood is a blockquote, not prose.** The stock sentence returns 787 structured rows today. 783 of the matched lines are the same blockquote text, `> This document decides whether the packet may close. A packet is closeable when`, and there are only 7 distinct matched line texts in the whole result set. The template copy is a blockquote at the acceptance-criteria example. [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md:17] [INFERENCE: `rg-wrapper.mjs structured "This document decides whether the packet may close" --json`, line-kind classification over `results[].text`]

2. **A body line class demotes that wall generically, but it cannot separate the rows inside it.** All 783 blockquote rows would receive the same `guidance` class, so ordering among them still falls to path and line. The visible change is that the one prose row in the set rises above them; it does not make the flood smaller or more informative. This is the key correction to the phase 2 framing: the flood is a volume problem, which feature 3's per-file cap owns, not a class problem. [INFERENCE: applying the proposed three-class rule to the 787-row measurement in Finding 1]

3. **The same shape repeats on a second stock sentence.** `A packet is closeable when` returns 787 rows: 782 blockquotes and 5 prose lines. The first prose row is at position 1 only because its path sorts early; the first blockquote is at position 3. [INFERENCE: `rg-wrapper.mjs structured "A packet is closeable when" --json`]

4. **On a query a user actually types, the tuple's real gap is structural evidence buried by path order.** `acceptance criteria` returns 11,012 rows, 9,418 of them `body`: 3,499 table rows, 2,956 list items, 1,300 prose lines, 878 headings and 785 blockquotes. The first heading is body position 1, but the first table row is body position 371 and the first blockquote is body position 370 — every table row is behind 370 path-ordered rows, and a caller reading the human top 20 never sees one. [INFERENCE: `rg-wrapper.mjs structured "acceptance criteria" --json`, per-kind first-position scan]

5. **The stock-sentence list is strictly narrower than a blockquote class.** The one measured flood line is a blockquote, so the generic class already demotes it. A curated deny list would cover only sentences someone remembered to add, would drift with the templates, and has no measured coverage the class lacks. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:352]

6. **Demoting template folders gets almost none of the free-text value and belongs to the other lane.** Of the 786 stock-sentence paths, 783 are real packets that copied the template sentence and only 3 are under `templates/examples` — 0.4% of the free-text result set. The template problem that *is* measured is on the keyed lane: `acceptance criteria closure gate` still returns the three level-2, level-3 and level-3+ acceptance-criteria template copies at `query-containment` 0.88 in slots 3-5 of 6, ahead of a real packet at `token-overlap` 0.75. [INFERENCE: keyed lookup run this iteration; ranking shape at .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs] That inversion cannot be fixed by a path tie-break placed after score; it needs either the judge's `template-default` class persisted in the artifact (schema 2 to 3) or a policy that demotes template documents ahead of score — and that policy would also demote a legitimate search for the template itself. It is a separate decision, not part of this feature.

7. **There is no query log to trigger on.** A search of `retrieval/*.mjs` and `retrieval/lib/*.mjs` for logging surfaces found none; the lane is stateless by contract. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202] So "a logged query" cannot exist today, and the trigger has to be a *recorded* query — the phase 2 pattern of a reproducible command committed in a packet iteration — rather than a log entry.

8. **The change is small and touches one ranking function.** `rankMatches` already has the matched line text and already reads the file once per path for frontmatter ranges, so a class computed from `match.text` adds no I/O, no state and no new dependency. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:380] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:396] Only one caller passes through it, and no test asserts the result key set. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:232]

## Build-Ready Design

### Files and line ranges

1. `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`
   - After `EVIDENCE_FIELDS` (lines 68-74): add a frozen `BODY_CLASSES` array, `['structural', 'content', 'guidance']`, mirroring the existing frozen-order pattern.
   - After `isAnchorMarker` (lines 352-358): add `classifyBodyLine(lineText)` — trim start, then `^#{1,6}\s` or `^\|` returns `structural`; `^>` or `^<!--` returns `guidance`; everything else returns `content`. Export it so the tests and any future caller can use the one classifier.
   - `rankMatches` (lines 380-412): compute `bodyClass` next to the evidence-field decision at line 391 (`evidenceField === 'body' ? classifyBodyLine(match.text) : null`), add it to the returned object at lines 398-405, and add the sort key at line 409, between `matchClassOrder` and `compareCodeUnits`, via a `bodyClassOrder` helper that maps `null` and unknown values after the three known classes.
2. `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`
   - `formatSummary` (lines 298-326): at the result print on line 313, build the label as `body/structural` or `body/guidance` when the class is not `content`, else the plain evidence field, then keep the existing `padEnd(20)`. No other output line changes.
3. `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`
   - Section 2.1 (lines 88-95): one sentence naming the structured result fields, after the recipe block.
   - Section 5 (lines 202-212): insert the body class as tuple item 3, renumber the existing item 3 to 4, and add one determinism sentence after the existing determinism paragraph.
4. `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts`
   - Extend `makeCorpus` (lines 34-56) with one fixture file carrying the same phrase in a heading, a table row, a list item, a prose line, a blockquote and an HTML comment.
   - Add a `describe('body line class', ...)` block after the existing ranking block (after line 194).

### Output change (JSON and human)

JSON, structured recipe only: every `results[]` entry gains `bodyClass`, one of `structural`, `content` or `guidance` for body rows, and `null` for `trigger_phrases`, `title-or-description` and `anchor-marker` rows. `schemaVersion` stays 1: the field is additive and no consumer has to change to keep reading what it already reads. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:60]

Human summary: the field column prints `body/structural` or `body/guidance` when the class is not `content`, and plain `body` otherwise, so the common case is unchanged and the new signal appears only where it moved a row. Every label stays within the existing 20-character column.

### Contract text (exact wording for retrieval-conventions.md)

Section 5, replacing the current items 1-3 (lines 206-208):

```text
1. **Evidence field**, most specific first: `trigger_phrases`, then title or description, then anchor marker, then body line.
2. **Normalized match class**, in the order `lib/normalize.mjs` ranks them: `exact`, `phrase-containment`, `query-containment`, `token-overlap`, then `partial`. The lookup emits these labels verbatim, and no document may rename them.
3. **Body line class**, only when the evidence field is body: `structural` (ATX heading or table row), then `content` (list item, prose or fenced code), then `guidance` (blockquote or HTML comment). Every other evidence field carries no body class.
4. **Relative path**, then one-based line number.
```

Section 5, appended after the determinism paragraph (line 212):

```text
Body line class is a tie-break inside one evidence field and one match class; it never reorders a row whose match class differs. It is computed from the matched line alone, so it adds no file read beyond the one the field classifier already performs and keeps no state between runs.
```

Section 2.1, appended after the recipe block (line 94):

```text
Each structured result carries `evidenceField`, `matchClass`, `bodyClass`, `path`, `line`, `packetPath` and `text`. `bodyClass` is `null` unless the evidence field is body; Section 5 defines the classes and their order.
```

### Edge cases

- **Blockquote with leading whitespace or nesting** (`  > note`, `> > note`): the `^\s*>` test after trimming start catches both; nested guidance is still guidance.
- **Blockquote containing a list item** (`> - item`): blockquote wins and the row is `guidance`, matching the template guidance shape.
- **Table separator rows** (`|---|`): `structural` by the same pattern. They cannot contain a query phrase in practice, so this is harmless.
- **Multi-line HTML comment**: only the `<!--` opening line matches `guidance`; interior lines read as `content`. Documented gap — the classifier sees one line and the match record carries no block context.
- **Setext headings**: the title line reads as `content` and the underline line as `content`, because detection would need the previous line. ATX only; documented in the contract.
- **Fenced code**: fence lines and interior lines are `content`; the classifier does not track fence state. Documented gap.
- **Frontmatter lines outside `trigger_phrases` and `title`/`description`**: they remain `body` and classify by shape (a `key: value` line is `content`). This is the current evidence-field behavior, unchanged.
- **Anchor markers**: `isAnchorMarker` is checked before `body`, so `<!-- ANCHOR:... -->` never receives a body class and stays `null`.
- **CRLF and trailing whitespace**: `parseJsonLines` already strips the trailing newline; `trimStart` absorbs the rest. No class depends on line endings.
- **Empty line text**: returns `content`. A fixed-string match cannot be empty, so this is unreachable but defined.

### Compatibility

- **Callers:** `rankMatches` has exactly one caller, `rg-wrapper.mjs:232`; the other recipes (`path`, `count`) return paths and counts and never reach it.
- **Tests that parse the output today:** `rg-wrapper-recipes.vitest.ts:173` and `:183` read `evidenceField` only; no test asserts the full key set, key order or `stableStringify` shape. The ranking test at `:168` keeps passing because the new key sits after `matchClass`.
- **Human-output consumers:** `/speckit:search` and the agent recipes read the summary lines; the label suffix keeps the column width and removes no column.
- **Compiled copies:** no `rg-lane` or `rg-wrapper` file exists under `runtime/dist`, so no build step has to regenerate anything.
- **Schema:** additive JSON field, `schemaVersion` unchanged. A consumer that ignores `bodyClass` sees byte-identical existing fields.
- **Contract mirror:** the tuple is stated once, in section 5, and the code comment at `rg-lane.mjs:364` restates it; both must change together.

### Test cases

1. `classifyBodyLine` table: `## Scope` and `| AC-1 | text |` return `structural`; `- item`, `plain prose`, ` ``` ` and `|---|`-free text return `content`; `> note`, `  > nested` and `<!-- FILL: x -->` return `guidance`.
2. Rank fixture: the same phrase in a heading, a table row, a list item, a prose line, a blockquote and an HTML comment in one file, plus a frontmatter hit — assert the frontmatter hit first, then body rows as structural, content, guidance, with path and line breaking ties inside each class.
3. Non-body rows: `bodyClass` is `null` for `trigger_phrases`, `title-or-description` and `anchor-marker` results.
4. Determinism: two `rankMatches` calls over the same parsed matches return deep-equal arrays.
5. Wrapper integration: `search('structured', ...)` returns `bodyClass` on every row and the value is one of the three classes or `null`.
6. `formatSummary`: a guidance row prints `body/guidance`, a content row prints `body`, and the label column stays within 20 characters.
7. Regression: the existing frontmatter-above-body test, the anchor-marker test and `assertRecipeParity` pass unchanged.
8. Corpus sanity, manual and not asserted: `structured "acceptance criteria"` moves table rows into the structural block instead of first appearing at body position 371.

### Size

- `rg-lane.mjs`: about 24 lines (frozen array, classifier with JSDoc, sort key and helper).
- `rg-wrapper.mjs`: about 5 lines (label construction).
- `retrieval-conventions.md`: about 12 lines (two contract additions and one field sentence).
- `rg-wrapper-recipes.vitest.ts`: about 80-90 lines (fixture extension and the new describe block).
- **Total: about 125 lines (range 110-140).** No schema change, no new file, no new dependency, no new I/O.

## Ruled Out

- **Stock-sentence deny list.** The measured flood line is a blockquote, so the generic `guidance` class demotes it; a curated list adds drift and covers only sentences someone remembered (Finding 5).
- **Demoting template folders for the free-text flood.** 3 of 786 paths, 0.4% of the result set; the flood is 783 real packets that copied the sentence (Finding 6).
- **Treating template-folder demotion as the whole of feature 4.** The measured template inversion is on the keyed lane, and fixing it needs a schema or policy decision that also affects legitimate template lookups (Finding 6).
- **One line per section spread.** That is feature 3's per-file cap, and folding it in would double this change's size (Finding 2).
- **Setext heading detection.** It needs the previous line, which the match record does not carry.

## Dead Ends

- **Making a line class shrink the stock-sentence result set.** All 783 rows are the same blockquote; no class computed from a single line can separate them. Volume belongs to feature 3.
- **Using `matchClass` to prefer headings on fixed-string queries.** 786 of 787 stock-sentence rows are `phrase-containment`, confirming the phase 2 finding that the match class is degenerate for fixed-string hits; it cannot carry a shape preference.

## Edge Cases

- **Ambiguous input:** "a cheaper version" named two alternatives with different targets; both were measured separately rather than collapsed into one.
- **Contradictory evidence:** phase 2 described the flood rows as `body` (true — the evidence field) and as prose-shaped (not true — the matched line is a blockquote). Both axes are real and are reported separately: evidence field `body`, line class `guidance`.
- **Missing dependencies:** no query log exists in the retrieval lane, which is the subject of Finding 7 rather than a tool failure.
- **Partial success:** none; every measurement exited 0.

## Questions Answered

- Q4: Design feature 4, boilerplate demotion, at its minimum viable size: the Markdown line classes inside the body evidence field, how they slot into the rank tuple without breaking determinism, whether a cheaper version (a stock-sentence list, or demoting template folders) gets most of the value, and the concrete trigger (what logged query) that would justify building it.

## Questions Remaining

- Q1, Q2, Q3, Q5: covered by the four sibling iterations.

## Next Focus

No further iteration on Q4. The design is build-ready at about 125 lines, but the phase 2 defer verdict stands: **do not build yet.** The trigger, restated as a recorded query because no query log exists:

- **Trigger:** a packet iteration or review records a query where a `guidance` body row occupies a top-10 slot in the human output ahead of a `structural` or `content` body row the caller then used, reproducible with `rg-wrapper.mjs structured "<query>" --json`.
- **Closest current evidence, not sufficient:** `acceptance criteria` buries all 3,499 table rows below body position 371, but no caller has recorded a miss caused by it, and the blockquote wall in the two stock-sentence queries would only be reordered among identical rows.
- **Cheapest already-triggered adjacent change, separate packet:** the keyed-lane template inversion (three template copies in slots 3-5 of 6 for `acceptance criteria closure gate`) is measured today, but its fix is an artifact-schema or path-policy decision, not a free-text line class.

Progressive synthesis note: `research/research.md` was not updated. The dispatch allowlist for this iteration names only the iteration file and the delta file, and four sibling iterations write the same synthesis concurrently; the workflow-owned synthesis step should merge this section instead.

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:69, :352, :380, :396, :408
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:60, :232, :313
- .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:88, :202, :206, :208, :212, :283
- .skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts:34, :168, :173, :183
- .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md:17
- specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md:83-95
- specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-003.md:17-27
- Query: `rg-wrapper.mjs structured "This document decides whether the packet may close" --json`
- Query: `rg-wrapper.mjs structured "A packet is closeable when" --json`
- Query: `rg-wrapper.mjs structured "acceptance criteria" --json`
- Query: `rg-wrapper.mjs structured "closure gate" --json`
- Query: `lookup-trigger-index.mjs --json --scoring-only -- "acceptance criteria closure gate"`

## Assessment

- New information ratio: 0.94
- Questions addressed: Q4
- Questions answered: Q4

## Reflection

- **What worked and why:** classifying the actual matched line text instead of trusting the phase 2 label. The flood was described as boilerplate prose; measuring it showed 783 identical blockquotes, which changes the design — a blockquote class covers it, a stock-sentence list adds nothing, and neither can shrink the wall. The `acceptance criteria` measurement then located the real ordering gap: 3,499 table rows behind 370 path-ordered rows.
- **What did not work and why:** the first framing assumed line classes would fix the stock-sentence flood. It does not: when every row shares one class, the class is a no-op, and only per-file elision changes what the caller sees.
- **What I would do differently:** measure the keyed lane before calling template-folder demotion "cheap". The free-text share is 0.4%, and the lane where the inversion is real needs a schema change, so the alternative is not a drop-in substitute.

**Status:** complete
