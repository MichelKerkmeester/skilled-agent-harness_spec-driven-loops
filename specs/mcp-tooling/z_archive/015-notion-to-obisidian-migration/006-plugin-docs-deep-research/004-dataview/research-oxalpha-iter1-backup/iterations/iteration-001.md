---
title: "Iteration 1: Reference Tree Inventory + DQL Surface Gap Baseline"
trigger_phrases: []
---
# Iteration 1: Reference Tree Inventory + DQL Surface Gap Baseline

## Focus

Inventory `references/plugins/dataview/*` as it exists today and audit it against the real plugin's documented DQL query surface (TABLE/LIST/TASK/CALENDAR + FROM/WHERE/SORT/GROUP BY/FLATTEN/LIMIT), producing the KQ1 + KQ5 gap baseline. Selected interpretation: the audit compares the local reference set's *query-language coverage* against the official documentation site; deeper DataviewJS/frontmatter/gotcha depth is deferred to iterations 2-4 per the prompt pack.

## Actions Taken

1. Globbed the dispatch-named path `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/**` -> no files found. Re-globbed repo-wide (`**/plugins/dataview/**`) and located the live tree under `.opencode/`.
2. Read `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` (370 lines, full).
3. Read `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md` (168 lines, full).
4. Fetched https://blacksmithgu.github.io/obsidian-dataview/queries/structure/ (official "Structure of a Query" page).
5. Wrote iteration artifacts, state record, delta stream, and initial progressive synthesis.

Tool-call budget forced filename-level-only inventory for `workflows.md`, `troubleshooting.md`, and the two asset examples; see Edge Cases.

## Findings

1. **The live reference tree is at `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` (4 files: `dataview.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`) plus 2 asset examples (`assets/plugins/dataview/dataview-query.example.md`, `dataview-metadata.example.md`). The strategy/prompt-pack pointer to `.claude/skills/...` resolves to nothing.** [SOURCE: glob `.claude/skills/mcp-tooling/mcp-obsidian/**` returned no files; glob `**/plugins/dataview/**` returned the six paths above]
2. **Local DQL grammar baseline is solid on the skeleton: all four view types (TABLE/LIST/TASK/CALENDAR), six FROM source forms (folder, tag, link, specific file, outgoing, incoming), the six clauses (WHERE/SORT/GROUP BY/FLATTEN/LIMIT/AS), inline `=` / `$=` prefixes with their enable flags, and a 23-function verified subset, all stated as verified against installed main.js 0.5.68.** [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md:245-360]
3. **GAP - Boolean/parenthesized source composition is absent locally.** Official docs document `FROM #status/open OR #status/wip` and `FROM (#assignment AND "30 School") OR ("30 School/32 Homeworks" AND outgoing([[School Dashboard Current To Dos]]))`; `data-model.md` lists only single atomic sources. An AI following the local doc cannot compose multi-source queries. [SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/structure/ ; absence verified at data-model.md:260-270]
4. **GAP - Data-command multiplicity and ordering semantics are absent locally.** Official rule: only the query type is mandatory; zero-or-one FROM immediately after it; every other data command may appear multiple times in any order and executes in written order. Local docs present clauses as a fixed-role table with no ordering/multiplicity statement. [SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/structure/ ; data-model.md:271-280]
5. **GAP - TASK-query semantics are under-explained.** Official example `TASK WHERE !completed SORT created ASC LIMIT 10 GROUP BY file.link SORT rows.file.ctime ASC` shows WHERE filtering individual tasks (not pages), task-level fields such as `completed`/`created`, and the group-then-sort-rows pattern. Local TASK row reads only "Task list from matching notes". [SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/structure/ ; data-model.md:257]
6. **GAP - GROUP BY post-group variables `key` and `rows` are never explained locally**, yet official examples sort on `rows.file.ctime` and select `rows.c` after grouping. Without `rows`/`key`, any grouped query an AI writes from the local docs alone is guesswork. [INFERENCE: official examples on the fetched structure page use `rows.*`; neither local file mentions `rows` or `key` (checked data-model.md §7 and dataview.md §8)]
7. **PARTIAL GAPS - four smaller omissions:** (a) `FLATTEN file.lists AS L` aliasing form; (b) LIST-with-output-field form (`LIST rows.c`, "output one field for each page"); (c) null-guard WHERE idiom `WHERE due AND due < date(today)` (existence check before comparison); (d) performance warning that unscoped `LIST`/`TASK` over a whole vault can freeze Obsidian - official page carries an explicit warning box, local docs do not. [SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/structure/]
8. **No factual conflicts found between the two deep-read local files and the fetched official page**; local strengths worth preserving: the 25-key settings contract, implicit `file.*` schema (incl. conditional `file.day`), and AI guardrails (never fabricate output; rendering is in-app). Items flagged VERIFY for later iterations: `TABLE WITHOUT ID`, source negation (`-#tag`, `-"folder"`), `contains` vs `econtains`/`icontains` variants - referenced by official nav but not on the fetched page and absent locally. [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md:153-163 ; data-model.md:363-370 ; https://blacksmithgu.github.io/obsidian-dataview/queries/structure/]
9. **Bracket inline-field syntax `[key:: value]` inside tasks/list items is absent from the local metadata docs** - surfaced by the official nav entry "Metadata on Tasks and Lists"; directly relevant to TASK queries against migrated Notion notes. Deferred to the KQ3 iteration; recorded here so it is not lost. [SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/structure/ (nav: annotation/metadata-tasks) ; absence checked in data-model.md §3-§5]

## Ruled Out

- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` as the audit target: path does not exist in this repo; the live tree is under `.opencode/`. All later iterations should use the `.opencode/` path.

## Dead Ends

- None. No approach was exhausted this iteration.

## Edge Cases

- Ambiguous input: none material; the stale `.claude/` path in the dispatch context was resolved by widening the glob (recorded as Finding 1 and Ruled Out).
- Contradictory evidence: none found between local refs and the fetched official page.
- Missing dependencies: official sub-pages (query-types, data-commands, reference/sources, reference/expressions, annotation/metadata-tasks) were not fetched this iteration; claims relying on them are marked VERIFY rather than asserted.
- Partial success: 2 of 4 reference files deep-read (`dataview.md`, `data-model.md`); `workflows.md`, `troubleshooting.md`, and 2 asset examples inventoried by filename only due to the 12-call budget. Status chosen as `complete` because KQ1 is answered with cited evidence from both sides of the audit; the unread files mainly affect workflow/troubleshooting depth (KQ4/KQ5 territory) rather than this iteration's grammar baseline.

## SCOPE VIOLATIONS

None. All investigated files were read-only; all writes stayed inside the allowed research packet paths.

## Sources Consulted

- .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md (full read)
- .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md (full read)
- https://blacksmithgu.github.io/obsidian-dataview/queries/structure/ (official Structure of a Query)
- Glob inventories: `.claude/skills/mcp-tooling/mcp-obsidian/**` (empty), `**/plugins/dataview/**` (6 hits)

## Assessment

- New information ratio: 1.0 (cold-start session; all 9 findings newly recorded, none redundant with prior iterations because none existed)
- Questions addressed: KQ1, KQ5
- Questions answered: KQ1 (which DQL patterns must be documented + syntax gotchas: answered with cited gap list)

## Reflection

- What worked and why: reading the local grammar file side-by-side with the official structure page made gaps fall out as concrete, citable diffs instead of impressions; the repo-wide glob recovered instantly from the stale path hint.
- What did not work and why: the dispatch-context path assumption cost one glob call; the 12-call ceiling left 4 of 6 local files unread, so workflow/troubleshooting layers are unevaluated this iteration.
- What I would do differently: next iteration should batch-read the remaining local files first (cheap, local) before spending calls on official sub-pages, and prioritize `data-commands` + `reference/sources` pages since they close gaps 3-7 directly.

## Recommended Next Focus

Iteration 2: fetch the official `data-commands` and `reference/sources` pages and read `workflows.md` + `troubleshooting.md`, converting VERIFY markers (WITHOUT ID, source negation, contains variants) into confirmed gaps or non-gaps; begin KQ4 gotcha capture (null guards, unscoped-query performance, task-level WHERE). Bracket inline fields `[key:: value]` feed the KQ3 iteration after that.
