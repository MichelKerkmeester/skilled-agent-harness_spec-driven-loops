# Iteration 5: Dedup plus final-k (span-dedupe, final-k) against Skilled retrieval

## Focus

Q5: do runtime mirror folders (`.claude/`, `.opencode/`, `.codex/` and others) or `z_archive` copies return the same text more than once today, given the coverage and exclusion policy in `retrieval-conventions.md` section 9, and would dedup plus a strict final-k cut help?

Selected interpretation (narrowest evidence-backed reading): test both of Skilled's retrieval lanes, because section 9 defines exactly two and they have different result units. Lane A is the committed trigger index (`lookup-trigger-index.mjs`), whose result unit is a document path. Lane B is the ripgrep recipes, whose result unit is a path or a line. sweet-search's `span-dedupe.js` operates on `(file, start, end)` display spans and `final-k.js` operates on a caller-supplied `k`; whether either has a surface depends on which lane is asked.

Deferred alternatives, recorded rather than tested: (a) what a caller sees when it passes a mirror directory as an explicit positional root, which no documented recipe does; (b) dedup across the `specs` and `.opencode/specs` alias, which section 9 states is canonicalized by the corpus walker and which is absent in this checkout (measured below).

## Actions Taken

1. Read `span-dedupe.js` and `final-k.js` in the sweet-search context tree to fix what each mechanism actually keys on.
2. Read `lookup-trigger-index.mjs` end to end to establish the trigger index's result unit, cap, and truncation reporting.
3. Read `retrieval-conventions.md` sections 2, 5 and 9 (recipes, ranking contract, coverage and exclusion policy).
4. Read `lib/corpus.mjs` exclusion rules, then measured the packaged index directly: 17,653 indexed paths, 42,211 phrases, 4.6 MB artifact.
5. Ran the real trigger lookup with `--scoring-only --limit 0` on a natural-language prompt (`dedup plus final-k cut for retrieval results`) — exit 1, zero scored candidates, 1,831 phrase candidates scanned.
6. Ran recipe 2.2 (path-only) for three phrases and classified every returned path as `lineages` / `prompts` / other.
7. Measured the corpus scale with `fd`, and tested whether ripgrep follows the `.claude/skills` symlink and whether `.claude/agents` holds byte-identical copies of `.skilled/agents`.

## Findings

### F1 — The trigger index is deduplicated by construction; span dedupe has no surface there

`lookup()` accumulates every posting into a `byPath` Map keyed by the document path (`lookup-trigger-index.mjs:201`, `:210-224`) and then materializes results from that Map (`:226-231`). One document therefore contributes at most one row, and a document's score is the best of its phrases. The retrieval unit is a document, never a span, so `dedupeIdenticalSpans` — which groups on `(file, start, end)` (`span-dedupe.js:45-47`, `:99-126`) — has no key to group on. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:201]

### F2 — A strict final-k cut already exists in the trigger index

`DEFAULT_LIMIT = 20` (`lookup-trigger-index.mjs:83`), the list is sliced after sorting (`:239`), and `--limit 0` is the documented escape that returns every candidate (`:21`, `:301-306`). That is the same contract `capToFinalK` encodes — "the caller gets at most k FINAL results" (`final-k.js:56-60`) — and sweet-search's own rationale for adding it (graph expansion appended results after the hybrid stage had already sliced to k, so `-k 6` returned 16) has no Skilled analogue, because the lookup has no post-slice expansion stage at all. The one missing half is observability: `truncated` is a boolean (`:238`) even though `ordered.length` is computed on the same line, so a caller cannot distinguish "21 candidates" from "20,000" and cannot judge whether raising `--limit` is worth it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:83]

### F3 — Runtime mirrors are excluded by root selection, and ripgrep does not follow their symlinks anyway

Every recipe searches `specs .skilled` as positional roots (`retrieval-conventions.md:95`), and section 9 records the five mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) as decided against for both lanes (`:300`). So a mirror never enters a documented result set: the exclusion is the root list, not a dedup pass. The second layer is ripgrep's own default: `.claude/skills -> ../.skilled/skills` is a symlink, and `rg --hidden --fixed-strings --files-with-matches 'normalizeTriggerText' .claude` returned 0 files even though the target tree contains that symbol. The mirror premise is also partly wrong on its facts: `.claude/agents` is a real directory, not a symlink, and it holds 12 files against 11 in `.skilled/agents` with **0 byte-identical**. Both trees match the same distinctive body sentence (`Read state files BEFORE any research action`), so they are near-duplicates — shared body, differing frontmatter — which exact-span dedup would not collapse either. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:300]

### F4 — `z_archive` is excluded in both lanes, and the packaged index confirms it

`--glob '!**/z_archive/**'` appears in every recipe (`retrieval-conventions.md:83`), `z_archive` is in `EXCLUDED_DIR_NAMES` (`corpus.mjs:106`), and section 9 marks it shared (`:306`). Measured on the packaged artifact: 0 of 17,653 indexed paths contain `z_archive`. No duplicate can arrive from an archive in either lane. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:83]

### F5 — The duplication that is real is fan-out scaffolding, not mirrors or archives

Measured with recipe 2.2 against this repo (`--files-with-matches --max-count 1`, the documented glob set):

| Phrase | Files | under `lineages/` | under `prompts/` | other |
|---|---:|---:|---:|---:|
| `trigger_phrases` | 24,986 | 3,346 (13.4%) | 1,213 (4.9%) | 20,427 |
| `zero-hit fallback` | 7 | 0 | 5 (71.4%) | 2 |
| `dedupe identical spans` | 0 | 0 | 0 | 0 |

Corpus scale: 59,496 `.md` under `specs/`, of which 15,918 sit under a `lineages/` directory (26.8%) and 3,841 under a `prompts/` directory (6.5%). The second row is the Gate-1-shaped case: a research-topic phrase returns 7 paths of which 5 are `research/prompts/iteration-{1..5}.md` — the per-sibling renders of one prompt pack. Those five files are **not** byte-identical (five distinct md5s: `03c83c15…`, `b00cc19c…`, `88121968…`, `51a59fed…`, `f304ea57…`), because each carries its own iteration number and focus block. So exact-text dedup would not remove them; only a near-duplicate or path-class rule would. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/prompts/iteration-5.md:1]

### F6 — The trigger index already prunes all research scaffolding, but section 9 does not say so

`corpus.mjs`'s recorded exclusion list holds `'**/research/lineages/**'` (`:66`), `'specs/**/research/** except **/research/research.md'` (`:67`) and `'specs/**/lineages/**'` (`:68`), and the directory pruner applies the `lineages` rule (`:193`). Measured: 0 of 17,653 indexed paths sit under `/prompts/` or `/lineages/`, and only 109 research documents are indexed — consistent with `research.md` being the sole survivor of that rule. Section 9's exclusion table names `lineages` (`:312`) but never the broader `specs/**/research/**` row, so a reader of the document cannot predict why `research/prompts/*.md` or an iteration log never appears in the index. The coverage-parity suite does test the behaviour (`retrieval-coverage-parity.vitest.ts:139-145`), so this is a documentation-completeness gap rather than unguarded drift. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:67]

### F7 — For the ripgrep lane, the lever is exclusion, and it collides with a frozen decision

Removing the 71.4% case costs one glob: `--glob '!**/prompts/**'` drops 5 of 7 files on the Gate-1-shaped phrase and 1,213 of 24,986 on the broad one. But the same move on `lineages` contradicts a deliberate, documented divergence: section 9 keeps `lineages` in the ripgrep lane because "the corpus holds thousands of lineage documents a researcher may legitimately need to grep for a specific fact" (`:312`), and the parity test asserts ripgrep must not silently converge (`retrieval-coverage-parity.vitest.ts:203-204`). `prompts/` is named nowhere in the policy, in either direction. So the correct change is a coverage decision — a section 9 row plus its parity row — not a dedup algorithm. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:312]

### Verdict for Q5: ADAPT (narrowly), with both named modules dropped

- **`span-dedupe.js` — DROP.** Its key is a display span; the trigger index has no spans and already dedups by path (F1), and the two duplication sources it might have addressed (mirrors, `z_archive`) cannot enter either lane (F3, F4).
- **`final-k.js` — DROP as a mechanism, ADOPT its contract.** The trigger index already implements it at `DEFAULT_LIMIT = 20` with `--limit 0` as the escape (F2). The only portable piece is the observability half: report `ordered.length` next to `truncated` so the caller can size the cut.
- **What a build phase would change, and rough size:**
  - `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` — add a total-candidate count to the answer object and one line to `formatAnswer`, roughly **3-5 lines**, no new dependency, no state, no second pass (the value is already computed at `:238`).
  - `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` section 9 — one Exclusion-coverage row for `specs/**/research/**` (trigger index: yes; ripgrep: no) plus one clause naming `research/prompts/`, roughly **2-4 lines**.
  - `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` — only if a `prompts/` glob is actually adopted, roughly **2 lines**; the `research/**` behaviour is already covered at `:139-145`.
  - `lib/corpus.mjs` — **no change**; the exclusion is already correct, only undocumented in the table.

## Questions Answered

- Q5: Dedup plus final-k (core/search/span-dedupe.js, final-k.js): do runtime mirror folders (.claude/, .opencode/, .codex/ and others) or z_archive copies return the same text more than once today, given the coverage and exclusion policy in retrieval-conventions.md section 9? Would dedup and a strict final-k cut help?

## Questions Remaining

None for this lesson. Cross-lesson hand-off: the elision line ("N more hits in M files not shown") is Q2's lesson and this iteration deliberately does not claim it; F2 only establishes that the count needed for such a line is already computed in the lookup at no extra cost.

## Next Focus

This is the last of five parallel iterations. The synthesis step should treat Q5 as closed with an ADAPT verdict, and should sequence the two cheap edits (lookup count, section 9 row) after the Q2 decision on elision wording, since both touch how truncation is reported.

## Sources Consulted

- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/span-dedupe.js:45-47,99-126`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/final-k.js:9-13,56-60`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:21,83,201,210-239,301-306`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:83,95,204-208,297,300,306,312`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:66-68,106,193`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts:139-145,203-204`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (measured: 17,653 paths, 42,211 phrases, 4.6 MB)
- Live recipe 2.2 runs for `trigger_phrases`, `zero-hit fallback`, `dedupe identical spans`, and `span-dedupe`
- Live trigger lookup for `dedup plus final-k cut for retrieval results` (exit 1, 0 scored candidates, 1,831 phrase candidates)

## Assessment

- New information ratio: 0.90
- Questions addressed: Q5
- Questions answered: Q5

## Reflection

- **What worked and why:** Measuring the packaged index instead of reasoning from the policy prose settled the question in one call. The artifact carries its own path list, so "are mirrors indexed?" stopped being an argument about the document and became a count (0 of 17,653). The same move on the recipe output — classifying returned paths into `lineages` / `prompts` / other — turned "does text repeat?" into a percentage, and the 71.4% row on a Gate-1-shaped phrase is the finding that a prose reading would have missed entirely.
- **What did not work and why:** The first duplication probe used a sentence from `retrieval-conventions.md` and found only the canonical path, which looked like a clean negative. It was a false negative for the question actually asked: lineage snapshots copy *packet* documents, not skill references, so the probe could not have found a lineage copy. Re-probing with a phrase that lives in packet and prompt scaffolding is what produced the real numbers. The lesson is that a dedup probe has to be aimed at the corpus class suspected of duplication, not at any distinctive sentence.
- **What I would do differently:** Query the index's path list for the suspected duplicate class *before* running any phrase probe. The `paths` array answers "what could duplicate" deterministically and costs one `node -e` call; phrase probes then only have to measure the residual.

## SCOPE VIOLATIONS

None.
