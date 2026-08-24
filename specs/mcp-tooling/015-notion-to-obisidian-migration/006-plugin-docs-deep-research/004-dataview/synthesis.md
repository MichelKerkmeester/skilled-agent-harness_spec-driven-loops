# Dataview Docs Deep-Research Synthesis

> Fresh-reviewer synthesis turning the 3-iteration Dataview research into an actionable, evidence-cited edit plan for the shipped `references/plugins/dataview/*` + `feature-catalog/plugins/dataview.md` surface. Read-only on all shipped docs; this file is the only write. Every `§` anchor below was re-verified against the live shipped files (the research warned they might be stale — they are NOT; see anchor-verification note).

---

## Verdict

The shipped docs are a solid, disciplined file-layer contract (settings schema, backup discipline, capability boundary) and are broadly aligned with the research on the fundamentals. But they are **materially thin on the query language itself**: the DataviewJS API is ~5 methods vs ~30+ real ones (the single largest gap), and the frontmatter/inline type-inference and DQL-grammar surfaces are missing the rules most likely to bite migrated notes. Two existing statements are **contradicted by the research** (inline-field multiline, and an implied fixed command order) and need correction, not just addition.

**Anchor verification:** all research-cited anchors map correctly to the live files — `data-model.md` §3=FRONTMATTER, §4=INLINE, §5=IMPLICIT, §6=QUERY BLOCK FORMATS, §7=DQL GRAMMAR; `workflows.md` §2=RESOLVE, §4=ADD INLINE, §8=ENABLE DATAVIEWJS; `troubleshooting.md` §3=QUERY RETURNS NOTHING. The staleness warning did not materialize.

---

## Prioritized edit table

Rank: **P0** (existing text is factually wrong) > **P1** (missing / materially incomplete) > **P2** (polish). Evidence cites research iteration.finding.

### P0 — factual / correctness (existing shipped text contradicts the research)

| # | Target file · section | Change | Evidence |
|---|---|---|---|
| P0-1 | `data-model.md` §4 (line 156) **and** `troubleshooting.md` §5 (line 103) | Shipped docs claim an inline field value "can span multiple lines when the continuation is indented" / advise to "indent the continuation lines." Research: an inline field value is terminated by the line break; multiline text is possible **only** via the YAML frontmatter pipe (`\|`). Correct both statements (or delete the multiline-continuation claim). VERIFY against official inline-field docs first — this is a direct contradiction, so treat as a Logic-Sync amendment before editing. | iter 002.14 (multiline constraint) vs shipped `data-model.md:156`, `troubleshooting.md:103` |
| P0-2 | `workflows.md` §2 step 4 **and** `troubleshooting.md` §2 step 5 (line 43) | Both prescribe a fixed resolution order ("Apply WHERE, then SORT, then GROUP BY and FLATTEN, then LIMIT"). DQL data commands execute in **written order**, and order is significant (e.g. `FLATTEN` before vs after `WHERE` yields different rows; commands may be duplicated). State that commands run in written order and that hand-resolution must follow the query's actual command sequence. | iter 001.1 (written-order execution, FROM zero-or-one) vs shipped `workflows.md` §2, `troubleshooting.md:43` |

### P1 — missing / materially incomplete

| # | Target file · section | Change | Evidence |
|---|---|---|---|
| **P1-1 (MAJOR)** | `data-model.md` §6 → new `dataviewjs-api.md`, or large §6 expansion | **Single biggest gap.** §6 documents only 5 JS methods (`dv.pages`, `dv.current`, `dv.list`, `dv.table`, `dv.taskList`) plus a "VERIFY against official docs" escape hatch (line 240-241). The plugin exposes ~30+ across: **Query** (`dv.pagePaths`, `dv.page` w/ auto link+extension resolution; folders must be double-quoted *inside* the source string — `dv.pages('"folder"')`), **Render** (`dv.header/paragraph/span/el/execute/executeJs/view`), **Markdown-string** (`dv.markdownTable/markdownList/markdownTaskList`), **Utility** (`dv.fileLink/sectionLink/blockLink/date/duration/compare/equal/clone/parse/array/isArray`), **Query-evaluation** (`dv.query/tryQuery/queryMarkdown/evaluate/tryEvaluate` → Result `{successful,value\|error}`), **DataArray** (immutable proxied array; `where/map/sort/groupBy/distinct/sum/avg/…`; `array.field` swizzling), **File-I/O** (`dv.io.csv/load/normalize`, async — `await`). Organize by surface group, one worked example each. | iter 003.4-10 (official `api/code-reference`, `api/data-array`) |
| P1-2 | `data-model.md` §6 | Inline DQL semantics: `` `= …` `` shows exactly **one** value (blends into text); `this.` = current page, `[[page]].` = another page; supports expressions/functions but **not** Query Types or Data Commands (`WHERE/SORT/GROUP BY/FLATTEN/LIMIT`). Inline JS `` `$= …` `` uses `dv.current()` as the analog of `this.` and **can** span multiple pages. | iter 003.2, 003.3 |
| P1-3 | `data-model.md` §3 | Add a YAML-frontmatter **type-mapping table** (quoted→Text, unquoted number→Number, `true/false`→Boolean, ISO date→Date, list→List, nested→Object, quoted `[[Link]]`→Link) + ISO-8601 auto-detection formats (`YYYY-MM-DD`, `…THH:mm:ss`, `YYYY-MM`) and the **non-ISO→Text** gotcha (`2021-04-17 18:00` becomes Text, breaking date math). Highest-leverage for migrated notes. | iter 002.1, 002.10 |
| P1-4 | `data-model.md` §3 | Link-in-frontmatter caveat: quoted `[[Link]]` is a Dataview Link but **not** an Obsidian link — no graph edge, no rename propagation. | iter 002.2 |
| P1-5 | `data-model.md` §4 | Inline-field **type-inference** table (Text/Number/Boolean/Date/Duration/Link/List; non-ISO dates → Text). | iter 002.3 |
| P1-6 | `data-model.md` §4 (+ cross-ref `workflows.md` §4) | Document the **three** inline syntaxes — own-line `Key:: Value`, bracket `[key:: value]`, parenthesis `(key:: value)` (hides key in Reader) — and the rule that **tasks/list items MUST use bracket syntax** (own-line does not attach to a task). §4 currently shows only own-line. | iter 002.4 |
| P1-7 | `data-model.md` §4 | **Field-name sanitization** (deduped: iter 001.7 + iter 002.6): spaces/punctuation → lowercase-hyphenated, formatting tokens stripped, capitalized keys get a lowercase alias. Migrated names like "Due Date"/"Created At" don't match naively. | iter 001.7, iter 002.6 |
| P1-8 | `data-model.md` §4 (or §7 for query-side use) | **Keyword / spaced-field escape access** (deduped: iter 001.7 + iter 002.6): `row["keyword"]` and `row['Field With Space']` to reach reserved-word or spaced field names. | iter 001.7, iter 002.6 |
| P1-9 | `data-model.md` §4 | Duplicate-key coercion: the same key twice in one note → Dataview collects values into a **List**. | iter 002.5 |
| P1-10 | `data-model.md` §5 | Add **task/list implicit fields** (18: status, checked, completed, fullyCompleted, text, visual, line, lineCount, path, section, tags, outlinks, link, children, task, annotated, parent, blockId), the rule that tasks **inherit all page fields**, and the **emoji task-date shorthands** (🗓️→due, ✅→completion, ➕→created, 🛫→start, ⏳→scheduled; dates only, no bracket needed). §5 currently covers only page-level `file.*`. | iter 001.8, iter 002.8, 002.9 |
| P1-11 | `data-model.md` §5 | Complete `file.day` derivation — shipped says "folder or name"; research: filename contains a date (`yyyy-mm-dd`/`yyyymmdd`) **OR** the note has a Date field. Add the Date-field trigger. (VERIFY the "folder" word against official docs — research says filename, not folder; do not silently keep an unverified term.) Also clarify `file.frontmatter` returns raw key\|value text pairs (for raw-value checks, not typed access). | iter 002.11, 002.12 |
| P1-12 | `data-model.md` §7 | DQL grammar additions/corrections: `WITHOUT ID` modifier (LIST+TABLE); FROM is **zero-or-one and must immediately follow the Query Type**; source negation `-`, parentheses grouping, current-file `[[]]` shorthand; **multi-field** SORT; `GROUP BY` yields `key`+`rows` with `rows.field` **swizzling**; `FLATTEN … AS name`; TASK operates at **task level** (child tasks inherit parent match; only DQL type that writes files); CALENDAR **requires a date field**, SORT/GROUP BY have no effect. | iter 001.2, 001.3, 001.4, 001.5, 001.8, 001.9 |
| P1-13 | `data-model.md` §8 (or new "Expressions & literals" section) | Add expressions/literals: arithmetic, comparisons, string ops, list/object indexing, lambdas; **date shorthands** (`date(today)`, `date(sow)`, `date(eom)`, …); **duration aliases** (`dur(1 day)`, `dur(2 hours 30 mins)`); date property access (`.year/.month/.weekday`). §8 is a function subset only — no literal/expression grammar today. | iter 001.6, iter 002.10 |
| P1-14 | `troubleshooting.md` §3 | **Null-comparison trap:** `null <= date(today)` returns `true`, so filters over sparsely-populated (migrated) fields **leak rows**. Guard with `typeof(field) = "date"`. NOTE: symptom is *over-matching*, not "returns nothing" — best placed as its own row/subsection or in the §1 symptom table, since §3's frame is empty results. | iter 001.10 |
| P1-15 | `workflows.md` §4 | State the task-bracket requirement at the how-to layer (adding a field to a task requires `[key:: value]`, not the own-line pattern §4 currently teaches). Pairs with P1-6. | iter 002.4 |

### P2 — polish

| # | Target file · section | Change | Evidence |
|---|---|---|---|
| P2-1 | `workflows.md` §8 | One-line note that JS features while disabled render as **raw unrendered code with no error** (silent failure). Already covered in `troubleshooting.md` §6 and `dataview.md` §5 — this is a cross-reference, not new content. | iter 003.12 |
| P2-2 | `data-model.md` §6 (or `dataview.md` §7) | Optional DQL-vs-DataviewJS decision guide. The AI-cannot-run-JS constraint it hinges on is **already** stated in `dataview.md` §3, so this is a convenience table only. | iter 003.11 |
| P2-3 | `troubleshooting.md` §3 (example, line 71) | Replace the hedge "DQL matches fields case-insensitively in most setups" with the real mechanism (capitalized keys get a lowercase alias via sanitization → `Due` and `due` both resolve). Depends on P1-7. | iter 002.6 |

---

## VERIFY-flag resolution

**Shipped-doc `VERIFY` markers:**
- `data-model.md` §6 line 241 ("Full API semantics … VERIFY against official documentation") — **RESOLVED**: the full API is now enumerable (iter 003.4-10, official `api/code-reference` + `api/data-array`). Implementing P1-1 discharges this marker.
- `troubleshooting.md` §6 line 117 (same "VERIFY anything else") — **RESOLVED** by the same source; discharged by P1-1.
- `troubleshooting.md` §3 line 71 ("VERIFY the note key first" / case-insensitivity) — **RESOLVED** in mechanism: capitalized keys carry a lowercase alias via sanitization (iter 002.6). Fix via P2-3.

**Research's own open flags (section D):**
- **KQ4 gotchas/FAQ/indexing-delay/path-quoting sweep — STILL-UNRESOLVED (explicit un-run gap).** The 4th iteration was never dispatched (reduce step stalled across three executors). Un-swept: official FAQ + troubleshooting pages for **path resolution/quoting rules**, **task-completion-tracking settings** behavior, and **indexing-delay** (queries returning stale/empty results immediately after an edit). These are exactly the failure classes most relevant to bulk-migrated notes and are only *incidentally* covered by the section-B gotchas. Recommend a follow-up KQ4 iteration before treating `troubleshooting.md` as complete.
- **`§` anchor staleness — RESOLVED.** I re-verified every cited anchor against the live shipped files; all map correctly (see Verdict). No drift.
- **Inline-field type inference vs installed `main.js` — RESOLVED non-goal** (research ruled it unnecessary; official docs authoritative). Not a gap.

**New unresolved item surfaced by this review:**
- The `file.day` "folder" term (P1-11) and the inline-field multiline claim (P0-1) both **contradict the research** and lack independent primary-source confirmation in this review. Confirm against official docs before editing.

---

## Do-NOT-change (confirmed correct — leave as-is)

- **`data-model.md` §2 SETTINGS CONTRACT** (25 keys + defaults + `data.json` shape). Verified against installed `main.js` v0.5.68; research did not challenge any key. Keep.
- **Identity / version 0.5.68 / repo `blacksmithgu/obsidian-dataview`** across all files. Research uses the same source; no conflict.
- **Capability boundary** — `dataview.md` §3 "The AI **cannot** run DataviewJS." Research **confirms** this (iter 003.11). Keep; do not weaken.
- **Config default-OFF** for `enableDataviewJs` / `enableInlineDataviewJs` (documented in `data-model.md` §2, §6; `dataview.md` §5; `troubleshooting.md` §6). Research **confirms** (iter 003.12). Keep — add the P2-1 cross-ref only.
- **Four-formats orientation table** — research rec #4 asks for one, but `dataview.md` §5 **already has it** (with an "Enabled by default" column) and `data-model.md` §6 labels each format on/off. Do **not** duplicate; the research overstates this as a gap.
- **Backup discipline / append-first metadata / "never fabricate results"** guardrails (`workflows.md` §1, `data-model.md` §9, `dataview.md` §8). Not challenged. Keep.

---

## CONFIRMED vs INFERRED

**CONFIRMED (directly verified by reading the live shipped files this session):**
- All research `§` anchors map to the correct shipped sections (headings grepped + read in full).
- `data-model.md` §6 lists exactly 5 DataviewJS methods + a VERIFY escape hatch (lines 240-241); `troubleshooting.md` §6 lists the same 5 (line 117) → the API gap is real and large.
- Shipped docs assert indented-multiline inline values (`data-model.md:156`, `troubleshooting.md:103`) → the P0-1 contradiction with the research genuinely exists in the text.
- `workflows.md` §2 step 4 + `troubleshooting.md:43` prescribe a fixed WHERE→SORT→GROUP BY→FLATTEN→LIMIT order → the P0-2 "implied fixed order" is real text.
- `dataview.md` §3 already states the AI cannot run DataviewJS; four-formats table already present in `dataview.md` §5 → those two research recs are already satisfied.

**INFERRED (relies on the research corpus / official docs, not independently executed here):**
- DQL written-order execution semantics and the significance of FLATTEN placement (P0-2).
- That an inline-field value is line-break-terminated and multiline requires YAML `|` (P0-1) — sourced to official docs, not run.
- The ~30+ DataviewJS API method set and DataArray/File-I/O behavior (P1-1).
- Type-inference tables, sanitization pipeline, duplicate-key coercion, null-comparison behavior, `file.day` Date-field trigger, emoji task shorthands (P1-3…P1-14).
- Whether the shipped `file.day` "folder" term is actually wrong — uncorroborated in either direction; flagged VERIFY.
- All KQ4 topics (path-quoting, indexing-delay, task-completion tracking) — un-researched; no basis to confirm or deny.
