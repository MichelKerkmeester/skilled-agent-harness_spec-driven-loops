# Iteration 3: Per-file flood control in the ripgrep wrapper (Q3)

## Focus

Q3: design feature 3, per-file flood control in the ripgrep wrapper — where the one-line-per-file guarantee and the k cut go in `rg-wrapper.mjs` and `lib/rg-lane.mjs`, how totals are obtained (the count recipe or the same rg run), the exact `(+N more in this file)` and `+N more files with M matches` output for human and JSON formats, what happens to `structuredCappedRecipe`, the contract text for conventions sections 2.1 and 5, and the tests.

Scope discipline: only the free-text lane (`rg-wrapper.mjs`, `lib/rg-lane.mjs`), its one non-test caller (`ops/retrofit-convention.mjs`), its tests, the conventions document and the command presentation asset were read on the Skilled side. The phase 2 synthesis and its iteration 2 were read as the input. Nothing proposed here needs embeddings, vector or BM25 fusion, MCP, a daemon or a persistent index.

## Actions Taken

1. Read the state trio (config, state JSONL, strategy) and confirmed iteration 3 from the dispatch path; the state log carries no iteration records because five sibling iterations run in parallel, so the pre-substituted `iteration-003.md` is authoritative.
2. Read the phase 2 synthesis section 5 and its source iteration `002-retrieval-lessons-research/research/iterations/iteration-002.md` in full.
3. Read `rg-wrapper.mjs` in full (357 lines) and `lib/rg-lane.mjs` in full (436 lines).
4. Read `retrieval-conventions.md` sections 2.1 and 5, `tests/rg-wrapper-recipes.vitest.ts` in full, and the `search()` call site in `ops/retrofit-convention.mjs`.
5. Ran the shipped wrapper against this packet's `research/` folder for `iteration` and computed totals from its JSON: 190 rows, 6 files, max 34 in one file, first 20 display rows all from one file.
6. Grepped the whole repository for `structuredCappedRecipe` (only the definition in code), for `rg-wrapper` consumers, and for the keyed lane's `--limit` vocabulary; read `rg --help` for `--max-count` semantics.

## Findings

1. **The flood is live in the shipped wrapper, not only in the phase 2 measurement.** `search('structured', 'iteration', { roots: [<this packet>/research] })` returned 190 ranked rows across 6 files, with one file holding 34 of them; the first 20 rows — the human display cap — all came from that single file. [SOURCE: local run — `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs structured "iteration" --json --search-root specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research` → 190 rows / 6 files / max 34 per file / first 20 rows from 1 file] This reproduces phase 2's shape (`research` → 12 of 20, `iteration` → 14 of 20) on a different corpus and is worse. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:21]

2. **The only cap today is presentation-only, and JSON emits every row.** `search()` ranks the full parsed match set and assigns it to `record.results` with no cut; `formatSummary` then slices the first 20 for the human view, while `--json` writes the whole record through `stableStringify`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:230-234] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:310-315] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:351]

3. **`structuredCappedRecipe` has zero callers anywhere in the repository.** Its only code occurrence is the definition; the wrapper's structured builder is uncapped, and `assertRecipeParity` compares the wrapper against the uncapped lane builder only. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:110-112] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:115-117] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:163-179] [SOURCE: repository-wide grep for `structuredCappedRecipe` — 1 code match, the definition; all other hits are research docs and prompts]

4. **Wiring `--max-count 1` into the fetch would pick the wrong line and destroy the elision totals.** Ripgrep's `--max-count` limits "the number of matching lines per file searched", so one match keeps the file's earliest matching line, not the rank tuple's best line for that file; and with only one line returned, `moreInFile` cannot be computed. [SOURCE: local run — `rg --help | rg -A4 -- '--max-count'` → "Limit the number of matching lines per file searched to NUM"] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411] The capped builder's own rationale ("the second match in a file never changes that") is therefore wrong on both counts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:100-104]

5. **Totals come free from the same rg run; no count recipe and no second invocation are needed.** The uncapped structured fetch already parses every match into `parsed.matches`, and `rankMatches` returns every row; per-file counts are one `Map` pass over that array. The count recipe would reproduce the totals exactly (phase 2 measured identical 594/34 totals) but costs a second full scan and would only be required if the fetch were capped. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:231-233] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:380-412] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31]

6. **The rank tuple makes the guarantee pass a filter, not a second ranker.** `rankMatches` sorts by evidence field, match class, relative path, line; the first occurrence of a path in that order is that file's best-ranked line, and first-occurrence order is the file order. Shaping can therefore keep the first row per path and slice, with no re-sort and no determinism loss. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411]

7. **Compatibility surface is small but concrete: one caller, one failing test, two presentation contracts.** `ops/retrofit-convention.mjs` is the only non-test caller of `search()` and reads `record.results?.length` as `resultCount`; the test `ranks a frontmatter hit above a body hit` puts a trigger-phrase line and a body line in the same file, so one-line-per-file removes its `body` row; `formatSummary` and `search-presentation.txt` §3 both report a shown count with no hidden count. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:481-491] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts:168-177] [SOURCE: .skilled/commands/speckit/assets/search-presentation.txt:73-113]

8. **The flag vocabulary already exists on the keyed lane.** `lookup-trigger-index.mjs` uses `--limit`, default 20, `--limit 0` lifts the cap, and the value must be a whole decimal (`/^\d+$/`). Reusing `--limit` in the wrapper keeps one name across both lanes; a new `--k` would fork it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18-23] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:83] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:296-306]

## Design

### Files and line ranges

1. `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`
   - §1 constants, after the exit-status block (lines 63-66): add `export const DEFAULT_LIMIT = 20;` with the same "mirrors the trigger lane's result cap" comment the keyed lane carries. This file owns the default because shaping lives here; do not touch `lookup-trigger-index.mjs` in this feature.
   - Delete `structuredCappedRecipe` (lines 100-112). It has zero callers, no test imports it, `assertRecipeParity` does not reference it, and its `--max-count 1` would keep the file's first matching line rather than its best-ranked one. If a reviewer refuses deletion, leave the function but add a comment that the wrapper must not use it; deletion is the recommended build.
   - New §7 after `matchClassOrder` (after line 436): `export function shapeRankedMatches(ranked, options = {})`, about 35 lines. One `Map` keyed on `row.path` accumulating `{ row, count }` in first-occurrence order; `files = [...map.values()]`; `shown = limit === 0 ? files : files.slice(0, limit)`; `dropped = files.slice(shown.length)`; return `{ results: shown.map(({ row, count }) => ({ ...row, moreInFile: count - 1 })), matchCount: ranked.length, fileCount: files.length, hidden: { files: dropped.length, matches: dropped.reduce((sum, e) => sum + e.count, 0) }, limit }`.

2. `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`
   - Usage comment (lines 29-33): add `[--limit <n>]`.
   - Import block from `./lib/rg-lane.mjs` (lines 41-52): add `DEFAULT_LIMIT` and `shapeRankedMatches`.
   - `SCHEMA_VERSION` (line 61): `1` → `2`. The comment above it says to bump when a consumer would have to change to read the report, and `results` changes meaning from every match to one row per file.
   - `search()` JSDoc (lines 191-202): add `fileCount`, `hidden`, `limit`, `matchCount`, `truncated` to the record shape.
   - `search()` record initializer (lines 213-224): add `fileCount: null`, `hidden: null`, `limit: null`, `matchCount: null`, `truncated: false`.
   - `search()` structured branch (lines 230-235): rank, then `const shaped = shapeRankedMatches(ranked, { limit: options.limit ?? DEFAULT_LIMIT })`; assign `record.results = shaped.results`, `record.matchCount = shaped.matchCount`, `record.fileCount = shaped.fileCount`, `record.hidden = shaped.hidden`, `record.limit = shaped.limit`, `record.truncated = shaped.hidden.files > 0`.
   - `search()` options JSDoc (line 190): add `limit?: number`.
   - `parseArgs()` (lines 260-292): accept `--limit` beside `--root`/`--search-root`; validate with `/^\d+$/` and throw `--limit requires a non-negative integer` (same message and rule as `lookup-trigger-index.mjs:301-306`); default `DEFAULT_LIMIT`; include `limit` in the return object.
   - `main()` (lines 341-344): pass `limit: args.limit`.
   - `formatSummary()` (lines 310-315): replace the `ranked : N match(es)` line and add the per-row suffix and hidden tail (exact strings below).

3. `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`
   - §2.1, after the recipe block (after line 96): the shaping paragraph quoted below.
   - §5, after item 3 (after line 208): a fourth numbered item, quoted below.

4. `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts`
   - Update the ranking fixture (lines 168-177) so the `body` match lives in a second file, and add a shaping `describe` block (cases below).

5. Caller (one line, same build): `.skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:488` — use `record.matchCount ?? record.results?.length ?? record.paths?.length ?? record.counts?.length ?? 0` so the baseline keeps total-match semantics for the structured recipe.

6. Docs in the same build (not part of the code contract): `retrieval/README.md:95,112-132`, `lib/README.md:48-50` (`rg-lane.mjs` row), and `commands/speckit/assets/search-presentation.txt:73-113` (a `HIDDEN=<files>/<matches>` slot and the row suffix).

### Output change (JSON and human)

JSON, structured recipe, after shaping (the five new fields are additive; `results` changes meaning):

```json
{
  "command": "rg --no-config --hidden --json ...",
  "counts": null,
  "exitCode": 0,
  "fileCount": 6,
  "hidden": { "files": 0, "matches": 0 },
  "limit": 20,
  "matchCount": 190,
  "outcome": "match",
  "paths": null,
  "recipe": "structured",
  "results": [
    {
      "evidenceField": "trigger_phrases",
      "line": 12,
      "matchClass": "exact",
      "packetPath": "specs/.../research",
      "path": "specs/.../research/research.md",
      "text": "...",
      "moreInFile": 33
    }
  ],
  "schemaVersion": 2,
  "stderr": "",
  "truncated": false,
  "unparsedLines": 0
}
```

Field rules:

| Field | Value |
|---|---|
| `results` | At most `limit` rows, one per file, in the rank tuple's existing order. `limit` 0 = every file's best row. |
| `results[].moreInFile` | Matches in that file minus 1. Always an integer; 0 when the file had one match. |
| `matchCount` | Total matches in the run, before shaping. |
| `fileCount` | Distinct files in the run, before the cut. |
| `hidden.files` | `fileCount - results.length`. |
| `hidden.matches` | Total matches in the dropped files. |
| `limit` | Effective limit (20 default; 0 = uncapped). |
| `truncated` | `hidden.files > 0`. |
| Non-structured recipes | The five new fields stay `null`/`false`; `paths` and `counts` already carry their totals. |

Human, `formatSummary`, structured recipe:

```text
recipe  : structured
command : rg --no-config --hidden --json ...
exit    : 0 (match)
ranked  : 190 match(es) in 6 file(s); showing 6 file(s) at limit 20
  trigger_phrases      specs/.../research/research.md:12 (+33 more in this file)
  body                 specs/.../research/iteration-001.md:8
  +4 more files with 12 matches
```

Rules: the per-row suffix is exactly `(+N more in this file)` and is omitted when `N` is 0; the tail is exactly `+N more files with M matches` and is omitted when `N` is 0; `limit 0` renders as `limit 0 (uncapped)`. The `ranked` label stays; its value now reports totals and shown files rather than `results.length`.

### Contract text (exact wording for retrieval-conventions.md)

§2.1, append after the recipe block:

> The wrapper that serves this recipe applies two bounds after parsing, never inside ripgrep: it keeps **one line per file** — that file's highest-ranked line, because the Section 5 tuple already orders the rows — and then cuts the resulting file list at `--limit` files (default 20; `--limit 0` lifts the cut). The bound is applied after ranking on purpose. `--max-count 1` would stop reading a file at its first matching line, which is the file's earliest line, not its highest-ranked one, and it would also destroy the per-file totals the elision needs.
>
> The bound is reported, never silent. A shown row whose file held more matches carries `(+N more in this file)`. A run that dropped whole files ends with `+N more files with M matches`. The JSON form carries the same numbers as `moreInFile` on each result, `hidden: { files, matches }` on the record, and `matchCount`, `fileCount`, `limit` and `truncated` at the top level. A caller that needs a hidden row raises `--limit`; nothing is returned silently beyond the bound.

§5, append as item 4 after the three tuple components:

> 4. **Post-rank shaping**, applied after the tuple and never as part of it: one line per file (that file's first-ranked row), then a cut at `--limit` files, default 20, with `--limit 0` uncapped. Shaping filters the ordered list; it never re-sorts it, so the tuple remains the lane's only ranker. The cut is reported in the same answer: `moreInFile` on each result, and `hidden: { files, matches }` plus `matchCount`, `fileCount`, `limit` and `truncated` on the record.

### Edge cases

- `--limit 0` returns every file's best row, with `hidden: { files: 0, matches: 0 }` and `truncated: false`; per-row `moreInFile` still applies.
- `--limit` must match `/^\d+$/`; negative, fractional, or trailing-junk values throw `--limit requires a non-negative integer`, mirroring the keyed lane.
- `limit` greater than `fileCount`: no tail line, `truncated: false`, `hidden.files: 0`.
- A file with exactly one match: `moreInFile: 0`, no human suffix.
- No match (exit 1): `results: []`, `matchCount: 0`, `fileCount: 0`, zeros, `truncated: false`; exit stays 1.
- Execution error (exit ≥ 2): `results` stays `null` and the new fields stay `null`/`false`, exactly as today.
- Duplicate paths cannot arise from one rg run; the key is the exact `data.path.text` string, and `packetPath` is carried unchanged.
- `unparsedLines` is untouched: shaping runs after parsing and never hides a parse failure.
- Ordering is stable: first occurrence per path preserves the tuple's file order, and the final path/line pair still breaks every remaining tie.
- Fetch bytes are unchanged: the structured fetch stays uncapped, so the existing 128 MB `MAX_STDOUT_BYTES` ceiling and its exit-2 behavior are neither improved nor worsened. The count-recipe variant is the documented fallback if a real query ever hits that ceiling; it is not part of this build.
- `rankMatches`' frontmatter cache is keyed per path, so shaping adds no file reads.

### Compatibility (callers and tests that parse the output today)

- `ops/retrofit-convention.mjs:481-491` — the only non-test caller of `search()`. `resultCount` for the structured recipe becomes the shown file count; the one-line change at line 488 to `record.matchCount` preserves total-match semantics. `retrofit-convention-pipeline.vitest.ts:174-179` asserts only recipe names, exit codes and outcomes, so it does not break.
- `tests/rg-wrapper-recipes.vitest.ts:168-177` — **breaks as written.** The query `only` matches the trigger-phrase line and the body line in one file; one-line-per-file keeps the trigger row, so `fields` no longer contains `body`. Fix the fixture by putting the body sentence in a second file, or assert `moreInFile: 1` on the kept row.
- `tests/rg-wrapper-recipes.vitest.ts:179-185` — passes: both `ANCHOR:scope` matches are in one file and the first is still `anchor-marker`.
- `tests/rg-wrapper-recipes.vitest.ts:130-161` — passes: outcome and null-result assertions are unaffected.
- `tests/rg-wrapper-recipes.vitest.ts:69-92` — passes: the structured recipe gains no flags, so the exact-argv assertions hold. Deleting `structuredCappedRecipe` breaks nothing because no test imports it.
- `sweep-memory-residue.mjs:43` — imports only `formatCommand`, `parseJsonLines`, `resolveRipgrep`, `ripgrepVersion`; unaffected.
- `lookup-trigger-index.mjs` — independent lane; unaffected. `--limit` is deliberately the same name and default, so callers see one vocabulary.
- `search-presentation.txt:73-113` — the `RESULTS=<count>` slot would under-report without a `HIDDEN=<files>/<matches>` slot and the per-row suffix; update in the same build.
- `schemaVersion` 2 is the machine signal for the `results` semantic change; nothing in the repository reads the wrapper's `SCHEMA_VERSION` today (grep), so the bump is safe.
- No command or script invokes `rg-wrapper.mjs structured` programmatically; the README examples are the only other mentions.

### Test cases

1. Flood collapse (unit, synthetic ranked rows or a temp corpus): one file with 25 matches plus three files with 1 each, `limit: 20` → `results.length === 4`, first row `moreInFile === 24`, `matchCount === 28`, `fileCount === 4`, `hidden === { files: 0, matches: 0 }`.
2. Limit cut with counts: 30 files × 3 matches, `limit: 20` → `results.length === 20`, `hidden === { files: 10, matches: 30 }`, `matchCount === 90`, `truncated === true`.
3. `limit: 0` uncapped: 30 files → `results.length === 30`, `hidden === { files: 0, matches: 0 }`, `truncated === false`.
4. Determinism: two identical `search()` runs produce identical `stableStringify` output.
5. Human format exact strings: a synthetic record prints `(+33 more in this file)` and `+10 more files with 30 matches`; both are absent when the counts are zero.
6. No-match: `results: []`, `matchCount: 0`, `fileCount: 0`, exit 1.
7. Single-match file: `moreInFile: 0` and no human suffix.
8. `parseArgs`: `--limit 0` and `--limit 20` accepted; `--limit -1`, `--limit 2junk`, `--limit 1.9` throw `--limit requires a non-negative integer`.
9. Recipe shape: `structuredRecipe` still contains no `--max-count`, and `assertRecipeParity` still returns `[]`.
10. Updated fixture test: the body-vs-frontmatter ranking assertion passes with the body match in a second file.
11. Retrofit baseline: structured `resultCount` equals `matchCount`, not the shown row count.

### Size

- `lib/rg-lane.mjs`: about +40 lines for shaping and +1 constant, −13 for the deleted capped builder (net about +28).
- `rg-wrapper.mjs`: about +45 lines, −8.
- Tests: about +90 to +120 lines.
- `retrieval-conventions.md`: about +18 lines.
- Caller one line, docs about +12 lines.
- Total: about 80 to 100 code lines and 90 to 120 test lines, inside phase 2's 80-140 estimate. No new module, no new dependency, no index, no daemon.

## Questions Answered

- Q3 (per-file flood control in the ripgrep wrapper): answered with the build-ready design above. The guarantee and cut are a post-rank filter in `search()` backed by a new `shapeRankedMatches` in `lib/rg-lane.mjs`; totals come from the same rg run because the uncapped fetch already carries every match; `structuredCappedRecipe` is deleted (zero callers, wrong line selection, no per-file totals); `--limit` (default 20, 0 = uncapped) mirrors the keyed lane; the exact elision strings and JSON fields are specified; conventions §2.1 and §5 have quoted text; one existing test must change and eleven cases cover the new behavior.

## Questions Remaining

- Q1, Q2, Q4, Q5 remain, each owned by a sibling iteration in this fan-out.
- Carried forward from this iteration: does any command render `rg-wrapper.mjs` JSON directly rather than through `search-presentation.txt`? The repository grep found none, but a downstream consumer outside this checkout cannot be ruled out; `schemaVersion` 2 is the signal for it.

## Ruled Out

- **Wiring `structuredCappedRecipe` (`--max-count 1`) into the wrapper.** It keeps each file's earliest matching line rather than its best-ranked one, and it removes the per-file count the elision line needs. [SOURCE: local `rg --help` output for `--max-count`] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411]
- **A second invocation of the count recipe for totals.** Exact, but it doubles the scan for numbers the uncapped structured fetch already holds. Only worth it if the fetch is capped, which the first bullet rules out. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31]
- **A `--k` flag.** The keyed lane already spells the same bound `--limit`, default 20, 0 uncapped; a second name would fork one vocabulary. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18-23]
- **Copying sweet-search's weighted allocation.** It would add a second ranker beside the evidence-field/match-class tuple, which already orders the rows the guarantee pass keeps. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md:77]

## Dead Ends

- None this iteration. Every planned read and the bounded measurement succeeded.

## Edge Cases

- **Ambiguous input:** iteration number. The state log carries no `type: "iteration"` records because siblings run in parallel, so counting records yields iteration 1 while the dispatch pre-substitutes iteration 3. Followed the dispatch path (`iteration-003.md`), which the prompt pack owns.
- **Contradictory evidence:** two structured recipe builders disagree on `--max-count`. Resolved against the capped builder: it is uncalled, its rationale is refuted, and the shipped wrapper is uncapped. Recorded as finding 4 rather than smoothed over.
- **Missing dependency:** none. All named files were readable and ripgrep ran.
- **Partial success:** none. The measurement, the help-text check and every read completed.

## Sources Consulted

- specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md:67-79
- specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:1-103
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:1-357
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:1-436
- .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:88-96, 202-212
- .skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts:1-232
- .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:80, 475-491
- .skilled/skills/system-spec-kit/runtime/cli/tests/retrofit-convention-pipeline.vitest.ts:171-179
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:16-23, 80-86, 260-310
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:39-44
- .skilled/commands/speckit/assets/search-presentation.txt:60-133
- Local run: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs structured "iteration" --json --search-root specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research` → 190 rows, 6 files, max 34 per file, first 20 rows from 1 file
- Local run: `rg --help | rg -A4 -- '--max-count'` → "Limit the number of matching lines per file searched to NUM"

## Assessment

- New information ratio: 0.81
- Questions addressed: Q3
- Questions answered: Q3
- Findings: 8 total — 5 fully new (the display-only cap, zero callers for the capped builder, the wrong-line flaw, the compatibility inventory, the `--limit` vocabulary), 3 partially new (the live flood measurement, same-run totals, the filter-only guarantee against the known tuple), 0 redundant against packet state, which held no iteration records.

## Reflection

- What worked and why: measuring the shipped wrapper before designing. The live run turned phase 2's 12-14 of 20 into 20 of 20, and reading `formatSummary` beside `search()` showed the cap is presentation-only, which is why the JSON path floods even though the human view looks bounded.
- What did not work and why: nothing failed. The one correction was conceptual — the first draft assumed the capped fetch plus count recipe was the cheap path; `rg --help` showed `--max-count` keeps the file's first line, not its best-ranked one, which invalidated that design and made same-run shaping the only correct option.
- What I would do differently: check the flag's documented semantics before assuming a capped fetch preserves ranking quality. One help-text read changed the architecture.

## Recommended Next Focus

Q4 (boilerplate demotion) or Q5 (out-of-scope hint), per the reducer's scheduling. If Q1 lands first, its `truncated`/total vocabulary should be checked against this record's `truncated`, `matchCount`, `fileCount`, `hidden` names so the two lanes report bounds the same way. For the build phase, sequence this feature after Q1 because both introduce truncation reporting, and reuse the same field vocabulary.

## Next Focus

Per the reducer's fan-out schedule: whichever of Q4/Q5 remains, with the cross-lane field-name consistency check against Q1 noted above.
