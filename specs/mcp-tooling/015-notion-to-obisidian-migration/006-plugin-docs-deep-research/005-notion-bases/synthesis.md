# Synthesis: Notion Bases reference-doc improvement plan

> **Role.** Fresh-eyes reviewer turning the completed deep-research (`research/research.md`,
> 1-of-4 iterations, core VERIFY fully resolved) into an actionable, evidence-cited edit plan.
> **This file is the only write.** No shipped documentation was modified. Every recommendation
> names a target file, an exact anchor, and its research evidence.
>
> **Source of truth.** Research findings are cited to the upstream plugin TypeScript
> (`bgarciamoura/obsidian-notion-bases-plugin`, raw `main` = v1.12.0 per `manifest.json`),
> consolidated in `research/research.md` §2 and `iterations/iteration-001.md`. Exact shipped-doc
> line locations below are from this reviewer's own fresh read + grep of the four reference files
> and the feature catalog (2026-08-22).

---

## 1. Verdict

**The shipped per-column YAML keys are wrong, and this is a P0 correctness defect — not a
cosmetic gap.** Every guessed relation/rollup/lookup/subtask/view key in the reference docs maps to
a *different* real source key, so an AI authoring a `_database.md` from the current docs produces
frontmatter the plugin silently ignores. Worse, this reviewer's grep confirms the wrong keys are
copied verbatim across **three** shipped files (`data-model.md`, `workflows.md`, `troubleshooting.md`,
plus prose in the index `notion-bases.md`), and that the mandatory database marker `notion-bases: true`
is documented **nowhere** — so an AI would also omit the one key that makes the file a database at all.
The wrong-keys finding is **CONFIRMED** against the plugin's own `src/types.ts`/`src/database-manager.ts`.

---

## 2. VERIFY-flag resolution

**The single per-column-key-spelling `VERIFY` flag is RESOLVED.** The shipped docs (data-model.md
§1/§7, notion-bases.md §1/§4, workflows.md §1/§6a, troubleshooting.md §9) all defer the exact key
spelling as "VERIFY against a real database." The research resolved it: the guessed keys are wrong.
The resolved mapping is the authoritative table below.

| Column class | Shipped (WRONG) key | Correct source key | Source (research finding) |
| --- | --- | --- | --- |
| Relation | `target: "Tasks"` | `refDatabasePath: "Tasks/_database.md"` | finding 1 — `src/types.ts` `ColumnSchema` |
| Relation | `two_way: true` | *(remove — implicit when `pairedColumnId` set)* | finding 1 |
| Relation | `back_reference: project` | `pairedColumnId: "project"` | finding 1 |
| Relation | *(missing)* | `refColumnId: "_title"` (match column, defaults `_title` = basename) | finding 1 |
| Rollup | `relation: tasks` | `rollupRelationColumnId: "tasks"` | finding 2 |
| Rollup | `property: estimate_hours` | `rollupTargetColumnId: "estimate_hours"` | finding 2 |
| Rollup | `function: sum` | `rollupFunction: "sum"` | finding 2 |
| Lookup | `relation: project` | `refDatabasePath: "Tasks/_database.md"` | finding 3 |
| Lookup | `property: status` | `refColumnId: "status"` | finding 3 |
| Lookup | *(missing)* | `refMatchColumnId: "_title"` | finding 3 |
| Self-relation | `self_relation: true` | `isHierarchical: true` (+ `refDatabasePath` to same DB) | finding 4 |
| View (board) | `group_by: status` | `groupByColumnId: "status"` | finding 5 — `ViewConfig` |
| View (calendar) | `date_field: dueDate` | `calendarDateField: "dueDate"` | finding 5 |

**Residual open items the research flagged (still unresolved, 2):**

1. **No line-level diff against the *live* shipped doc text.** Research §4 deferred the iteration-2
   doc-diff. *Partially closed by this synthesis* — the fresh grep below located every wrong-key
   occurrence by exact line — but no one has confirmed against the *installed* plugin's own emitted
   schema, only against upstream TS source.
2. **`main.js` not byte-checked.** Verification used repo `main` TypeScript; `manifest.json` on
   `main` reports `version: 1.12.0` = the installed build (finding 18), so this is low risk but not
   a byte-level confirmation of the shipped bundle.

(A minor third item — formula-column semantics — was floated but never investigated; out of scope
for the key-correctness charter.)

---

## 3. Prioritized edit plan

Rank: **P0** (wrong keys / correctness) > **P1** (undocumented features) > **P2** (polish). All
wrong-key occurrences are P0 regardless of file, because copying a wrong key from a workflow recipe
is exactly as broken as from the data model. (The research's own P2 "sync workflows.md" framing
under-ranks this; treat every concrete wrong-key example as P0.)

### P0 — Correctness (wrong keys + missing marker)

| # | Target file | Section / anchor (line) | Change | Evidence |
| --- | --- | --- | --- | --- |
| P0-1 | `data-model.md` | §2 Relation block (L50–68) + prose L79 | `target`→`refDatabasePath` (`"Tasks/_database.md"`), drop `two_way`, `back_reference`→`pairedColumnId`, add `refColumnId`; fix prose "declared `back_reference`" | finding 1; §2.1 relation table |
| P0-2 | `data-model.md` | §3 Rollup block (L103–111) | `relation`→`rollupRelationColumnId`, `property`→`rollupTargetColumnId`, `function`→`rollupFunction` | finding 2 |
| P0-3 | `data-model.md` | §4 Lookup block (L123–130) | `relation`→`refDatabasePath`, `property`→`refColumnId`, add `refMatchColumnId: "_title"` | finding 3 |
| P0-4 | `data-model.md` | §5 Self-relation block (L142–149) | `target`→`refDatabasePath` (same DB), `self_relation: true`→`isHierarchical: true` | finding 4 |
| P0-5 | `data-model.md` | §6 View block (L185–191) + prose L193 | `group_by`→`groupByColumnId`; add `calendarDateField` for the calendar case | finding 5 |
| P0-6 | `data-model.md` | §1 Storage model (L26–34) / new "Database marker" note | **ADD** the required marker: `_database.md` frontmatter must carry `notion-bases: true` — boolean `true` required, `=== true` check; marker key alone is not sufficient. **Currently absent from all docs** (grep confirms). | finding 6; `DATABASE_MARKER` |
| P0-7 | `workflows.md` | §2 recipe (prose L50–51; blocks L71–91) + inline L122/L130 | Relation keys: `target`/`two_way`/`back_reference` → `refDatabasePath`/(drop)/`pairedColumnId` (+`refColumnId`) | finding 1 |
| P0-8 | `workflows.md` | §3 recipe (step L113; block L128–136) | Rollup keys → `rollupRelationColumnId`/`rollupTargetColumnId`/`rollupFunction` | finding 2 |
| P0-9 | `workflows.md` | §4 recipe (inline L161/L169; block L166–174) | Lookup keys → `refDatabasePath`/`refColumnId` (+`refMatchColumnId`) | finding 3 |
| P0-10 | `workflows.md` | §5 recipe (prose L188; block L202–210) | Self-relation → `isHierarchical: true` (+`refDatabasePath`) | finding 4 |
| P0-11 | `workflows.md` | §6 view (prose L232; block L252–256) + §6a calendar (L283–289) | `group_by`→`groupByColumnId`; `date_field`→`calendarDateField` — this **resolves** the L288 inline "VERIFY `date_field`/`date`/`date_property`" guess | finding 5 |
| P0-12 | `troubleshooting.md` | §3 (prose L54; inline L65), §4 (L41/L90–91/L95/L142), §5 (L105), §6 (L114) | Replace `relation`/`property`/`function`/`back_reference`/`group_by` references with corrected keys throughout diagnosis tables and checkpoints | findings 1,2,5 |
| P0-13 | `notion-bases.md` (index) | §2 How it works (L44) | Prose names `group_by` and back-reference concept — update to `groupByColumnId` / `pairedColumnId` | finding 5,1 |

### P1 — Undocumented features (7 confirmed-real, all absent; grep = zero hits)

| # | Target file | Feature | Minimal correct shape | Evidence |
| --- | --- | --- | --- | --- |
| P1-1 | `data-model.md` (schema) | Folder arrangement | `folderArrangement: { enabled: true, propertyIds: [...] }` in `_database.md`; auto-files rows into subfolders by column value (`computeArrangedPath`, e.g. `Done/High/row.md`) — an AI editing rows must know files can relocate | finding 12 |
| P1-2 | `data-model.md` (schema) | Template system | `templatePath`, `templateFolder`, `askTemplateOnCreate`; placeholders `{{title}}`/`{{folder}}`/`{{date}}`/`{{time}}` (`applyTemplate`) | finding 13 |
| P1-3 | `data-model.md` (schema) | System columns | Read-only, file-stat-backed: `created: { type: date, systemField: ctime }`, `modified: { type: date, systemField: mtime }`; values from `file.stat`, **not** frontmatter — AI must not write them | finding 14 |
| P1-4 | `data-model.md` (schema) | Number format | `numberFormat: { decimals, thousandsSeparator, prefix, suffix }` | finding 15 |
| P1-5 | `data-model.md` §6 (or new `advanced-config.md`) | Full `ViewConfig` surface | Beyond the 2 corrected keys: `calendarViewMode`; `timelineStartField`/`timelineEndField`/`timelineZoom`/`timelineGroupByField`; `chartType`/`chartXAxis`/`chartYAxis`/`chartAggregation`; `galleryCoverField`/`galleryCardSize`; `boardColumnOrder`/`boardColumnLimits`/`boardHideEmpty`/`boardHideNoValue`; `pinnedColumnId`/`columnOrder`/`rowHeight`/`wrapText`; `aggregations`; `includeSubfolders`; `conditionalFormats` | finding 5 |
| P1-6 | `workflows.md` (behavioral) | Embed state storage | Embed view state persists in the **hosting note's** frontmatter under `notion-bases-embeds` (map: embed ID → `ViewConfig` or `EmbedState`); key `EMBED_FM_KEY` | finding 11 |
| P1-7 | `workflows.md` (behavioral) | Live placeholders | `{{columnId}}` tokens in note bodies render the current cell value in reading view (`createLivePlaceholderProcessor`) — distinct from the embed system | finding 16 |
| P1-8 | `workflows.md` (behavioral) | Inline field support | When `readInlineFields` is enabled in plugin settings, Dataview-style `Key:: Value` inline fields are read alongside frontmatter (`getNoteData`) | finding 17 |

> "7 undocumented features" = P1-1 through P1-4 and P1-6 through P1-8 (findings 11–17). P1-5 is the
> ViewConfig-surface expansion tied to the P0 view-key fix; ranked P1 as new feature documentation.

### P2 — Polish / robustness

| # | Target file | Change | Evidence |
| --- | --- | --- | --- |
| P2-1 | all 5 docs | **Remove the per-column `VERIFY` flag prose once P0 lands** — data-model.md §1(L19)/§7(L212), notion-bases.md §1(L34)/§4(L73), workflows.md §1(L18)/§6a(L288,L304), troubleshooting.md §9(L155), feature-catalog §4(L49). The flag is resolved; leaving it contradicts the corrected keys | research §3 P0 last line |
| P2-2 | `notion-bases.md` (index) | Remove the §1 community-slug-vs-manifest-`id` VERIFY note (L28): finding 18 confirms both are `notion-bases` | finding 18 |
| P2-3 | `troubleshooting.md` | Add entry: **guessed key silently ignored** — frontmatter using a non-source key name has no effect (the exact defect these docs shipped) | research §3 P3(a) |
| P2-4 | `troubleshooting.md` | Add entry: **row files relocate unexpectedly** under `folderArrangement` (`computeArrangedPath`) | research §3 P3(b); finding 12 |
| P2-5 | `troubleshooting.md` | Add entry: **writes to system-column / rollup / lookup values have no effect** — they are derived/read-only (`resolveRollupsForRows`, `resolveLookupsForRows`, `file.stat`); AI must not hand-author result values | research §2.4, §3 P3(c) |
| P2-6 | `troubleshooting.md` | Add entry: **relation breaks on target rename** when matched on `_title` (default `refColumnId`/`refMatchColumnId` = note basename) | research §2.4, §3 P3(d) |
| P2-7 | `data-model.md` (opt.) | *Optional* new `advanced-config.md` to hold the large `ViewConfig` surface + `numberFormat`/`folderArrangement`/template config, keeping `data-model.md` on the core column schema | research §3 (deferred Q4/5) |
| P2-8 | all edited docs | Bump `version:` frontmatter (currently `0.1.0.0`) on any file changed | doc convention |

---

## 4. Do-NOT-change — the 5 confirmed-correct items

Research §2.2 (findings 6–10) confirmed these against source; leave as shipped:

1. **Database marker value** — `notion-bases: true` (boolean) is the *correct* marker. Do not alter
   the concept. (Caveat: the docs never actually *state* it — see P0-6, which **adds** the requirement;
   this is additive, not a change to existing text.) — finding 6.
2. **The 7 rollup functions** — `sum`, `count`, `avg`, `min`, `max`, `count_values`, `list`
   (`data-model.md` §3, L91–99). Correct. — finding 7.
3. **The 7 view types** — `table`, `list`, `board`, `gallery`, `calendar`, `timeline`, `chart`
   (`data-model.md` §6, L171–179). Correct. — finding 8.
4. **The 18 column types** — `title, text, number, select, multiselect, checkbox, date, url, email,
   phone, status, formula, relation, lookup, image, rollup, audio, video` (`data-model.md` §1, L31).
   Correct. — finding 9.
5. **The `nb-database` embed syntax** — fenced block with `path`, `type`, `id` params
   (`data-model.md` §6 L199–206; `notion-bases.md` §2 L48–55). Correct. — finding 10.

Also unchanged: the file-layer operating model, hand-resolution discipline for rollups/lookups, the
version pins (v1.3.0+ relations, v1.5.0+ rollup/subtask/chart), and the 7/10-view boundary
(Form/Map/Dashboard have no parity) — all confirmed by the research.

---

## 5. CONFIRMED vs INFERRED

**CONFIRMED** (cited to upstream source via research finding, or verified by this reviewer's grep):

- Every wrong→correct key mapping in §2 — cited to `src/types.ts` `ColumnSchema`/`ViewConfig` and
  `src/database-manager.ts` (findings 1–5).
- The wrong keys appear in `data-model.md`, `workflows.md`, and `troubleshooting.md`, at the exact
  lines in §3 — this reviewer's grep, 2026-08-22.
- The database marker `notion-bases: true` and all 7 undocumented-feature keys appear **nowhere** in
  the shipped notion-bases refs or feature catalog — this reviewer's grep returned zero hits.
- The 5 confirmed-correct items (rollup functions, view types, column types, embed syntax, marker
  value) — findings 6–10.
- Installed build = repo `main` = v1.12.0 — `manifest.json` (finding 18).

**INFERRED** (research reasoning, logical consequence, or placement judgment — not runtime-reproduced):

- "An AI's frontmatter is *silently ignored*" — the behavioral consequence of a wrong key. Grounded
  in the schema definition, but no failing render was reproduced (research ran 1 of 4 iterations; the
  live doc-diff and installed-plugin confirmation are the 2 residual open items in §2).
- Which file each fix/feature belongs in (schema→`data-model.md`, behavioral→`workflows.md`,
  troubleshooting entries) — research's placement recommendation, sensible but a judgment call.
- The exact `refDatabasePath` value format (`"Tasks/_database.md"` vs a bare folder name) — the
  research shows the file-path form; confirm against a real database before shipping production YAML.
- The optional `advanced-config.md` split — a structural suggestion, not a source-derived requirement.
</content>
</invoke>
