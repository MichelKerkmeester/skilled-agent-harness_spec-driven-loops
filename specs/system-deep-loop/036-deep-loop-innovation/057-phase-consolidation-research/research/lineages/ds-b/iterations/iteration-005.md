# Iteration 5: timeline.md Design — Chronological Lineage That Survives Renumbering

## Focus
Design `timeline.md` so the true chronological order of the 036 children (which folder was worked on first vs later) survives any renumbering. Derive the actual chronological order from git history + graph-metadata created/updated timestamps, prove the numeric prefix is already unreliable, and specify the timeline.md schema + generation method.

## Findings

### F5.1 — Proof: the numeric prefix is ALREADY non-chronological
Sorting all 44 metadata-bearing children by `derived.created_at` (from each child's `graph-metadata.json`) reveals the true creation order, and it disagrees with the numeric prefix in multiple places:

| Created | Numbered | Folder |
|---|---|---|
| 2026-07-27 | **050** | trustworthy-state-records |
| 2026-07-29 | 019, 020 | runtime-code-readmes, sk-code-opencode-alignment |
| 2026-07-30 | 021 | completion-evidence-reconcile |
| 2026-07-31 | 022-032 | remediation tree |
| 2026-08-05 | 033 | identity-and-lock-ownership-hardening |
| 2026-08-07 | 035 | cli-adapter-stress-and-playbooks |
| 2026-08-08 | 047, 048, 049 | executor/hardening groups |
| 2026-08-12 | 051, 052 | residual-closeouts, cli-devin repair |
| 2026-08-13 | 053-056 | review-follow-up wave |

[SOURCE: child graph-metadata.json `derived.created_at` across 001-056]

**The critical anomaly:** `050-trustworthy-state-records` was created **2026-07-27** — *before* 019/020 (07-29), *before* the entire 021-032 remediation tree (07-31), *before* 033 (08-05), 035 (08-07), and 047-049 (08-08) — yet it carries the number 050. Its number reflects a later re-slot, not its birth. [SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation/050-trustworthy-state-records/graph-metadata.json]

**Second proof — git renumber precedent:** commit `8d3b5b21d57` (2026-07-17) did `docs(specs): renumber system-deep-loop packets 034<->036`; the 2026-08-07 specs-root flip (606e55cb8a9) then re-touched every child path, making `git log` first-commit dates uniformly 2026-08-07 (unusable as per-child chronology without `--follow` / pre-flip history). [SOURCE: git log]

**Conclusion:** neither the number prefix NOR raw git first-commit is a trustworthy chronology. `created_at` in graph-metadata is the best single source, but it too can be re-written (memory saves rewrite graph-metadata on `last_save_at`, and a save can bump or reset `created_at`). A dedicated `timeline.md` is the ONLY durable record — this is exactly the CRITICAL requirement in the research topic.

### F5.2 — timeline.md schema (proposed)
Place one `timeline.md` at the 036 parent root (canonical chronological record for the whole family), and reference it from the parent `spec.md` Phase Map. Schema:

```markdown
# Timeline — system-deep-loop/036-deep-loop-innovation

## Provenance
- Derived: {ISO date} from child graph-metadata `derived.created_at`/`last_save_at` + git history (pre-specs-flip `--follow`).
- Immutable: once created, this file is APPEND-ONLY. Renumbers/moves never rewrite existing rows — new entries use `moved_to`/`renumbered_to` columns.

## Chronology (created_at order — the TRUE sequence)
| seq | created_at | last_save_at | current path (numbered) | stable_id (slug) | moved_to (after consolidation) | status |
|-----|-----------|--------------|-------------------------|------------------|--------------------------------|--------|
| 1   | 2026-07-15 | 2026-07-17   | 001-deep-loop-market-research | deep-loop-market-research | 001-research-inputs-and-baseline/001-deep-loop-market-research | complete |
| ... | ...       | ...          | ...                     | ...              | ...                            | ...    |
| 19  | 2026-07-27 | 2026-08-08   | 050-trustworthy-state-records | trustworthy-state-records | 008-executor-and-cli-hardening/050-trustworthy-state-records | complete |

## Renumber ledger (history of every prefix change)
| date | from | to | reason | ref |
|------|------|----|--------|-----|
| 2026-07-17 | 034 | 036 | packet renumber | commit 8d3b5b21d57 |

## Ordering rule
- `seq` = sort by `created_at` ASC (stable primary key).
- `current path` is DISPLAY ONLY; never sort by it.
- `stable_id` = the slug suffix (drop the 3-digit prefix) — survives renumbering by construction.
```

**Key design decisions:**
1. **`seq` (integer) is the ONLY sort key** — assigned by `created_at` once and never reassigned.
2. **`stable_id`** = the slug without the numeric prefix (`deep-loop-market-research`, `trustworthy-state-records`). This is the durable identity that survives any renumber; grouping/migration keys off `stable_id`, not the number.
3. **`moved_to`** column records the post-consolidation path so the timeline doubles as a migration manifest — after M1, every row's `moved_to` is filled, and the mapping `old numbered path → new grandparent path` is auditable.
4. **Renumber ledger** append-only section records every historical prefix change (precedent: 034<->036) so future researchers can reconstruct any intermediate state.
5. **Append-only discipline:** migration never rewrites existing rows; it only fills `moved_to` and adds `renumber` rows. This is what makes chronology survive.

### F5.3 — Generation method (how to derive the rows)
Source precedence for `seq`:
1. **Primary:** child `graph-metadata.json` `derived.created_at` (confirmed populated for 44/45 children; 057 has no graph-metadata yet — created 2026-08-13, add a row when it gets metadata).
2. **Cross-check:** `git log --format=%ad -- <path>` with `--follow` and the pre-2026-08-07 `.opencode/specs/` path, to detect any `created_at` that a later save rewrote.
3. **Tie-break:** `last_save_at` (earlier save wins) or alphabetical slug.
4. **Generate mechanically:** a small script (proposed for the migration packet) reads all `graph-metadata.json` under the 036 tree, emits the table sorted by `created_at`, and warns on: (a) missing created_at, (b) created_at > last_save_at, (c) duplicate slugs. This keeps regeneration honest and repeatable.

### F5.4 — Verification that chronology survives the migration
Post-M6 the following MUST hold:
- `timeline.md` `seq`/`stable_id` columns are byte-identical to the pre-migration file (only `moved_to` added).
- No row deleted; no `seq` renumbered; no `created_at` altered.
- The `moved_to` column maps every old numbered path to a grandparent path 1:1 (45 rows → 45 entries).
- `rg` of old child-slug paths in `timeline.md` still finds them under `moved_to`/`current path` (the file itself is the searchable history).
- Git check: `git diff` on the migration commit shows `timeline.md` with ONLY `moved_to` additions + the renumber-ledger append.

## Sources Consulted
- Child graph-metadata.json `derived.created_at`/`last_save_at` for 001-056 (44 entries)
- git log for 036 children (specs/ + .opencode/specs/ paths), commit 8d3b5b21d57 (034<->036), 606e55cb8a9 (specs-root flip)
- Parent graph-metadata.json + spec.md Phase Map (current numbering)

## Assessment
- **newInfoRatio:** 0.75
- **noveltyJustification:** Proved the numeric prefix is already non-chronological (050 anomaly + 034<->036 precedent), designed the timeline.md schema (seq/stable_id/moved_to + append-only renumber ledger), and specified the generation + verification method — satisfying the CRITICAL research sub-question Q4.
- **Confidence:** Confirmed for the anomaly and derivation method (read directly); schema is judgment.

## Reflection
- What worked: sorting all children by `created_at` exposed the 050 anomaly immediately — a concrete, citable proof that numbering ≠ chronology.
- What failed: raw `git log` first-commit dates were useless (uniform 2026-08-07 after the specs-root flip); had to fall back to `created_at` + `--follow` reasoning.
- Ruled out: using numeric prefix as sort key (refuted by 050); using raw git first-commit (refuted by the specs-root flip); making timeline.md mutable (would destroy the guarantee — append-only required).

## Recommended Next Focus
Synthesis — compile `research.md` with the full 17-section report: feasibility (Q1), cluster design (Q2), migration plan (Q3), timeline.md design (Q4), and risks/gates (Q5), plus the Eliminated Alternatives table.
