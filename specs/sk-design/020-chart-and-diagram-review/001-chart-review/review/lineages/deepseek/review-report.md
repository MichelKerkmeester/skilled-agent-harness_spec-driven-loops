# Deep Review Report — `sk-design-chart`

**Lineage**: `deepseek` (`fanout-deepseek-1789150583287-1f2g93`) · **Executor**: cli-pi / deepseek-v4.1-flash (inline, no nested dispatch)
**Target**: `specs/sk-design/020-chart-and-diagram-review/001-chart-review` (spec-folder) · **Packet under review**: `.opencode/skills/sk-design/sk-design-chart`
**Iterations**: 2 of 2 · **Stop reason**: `maxIterationsReached`

---

## 1. Executive Summary

**Verdict: CONDITIONAL.** Four P1 findings and six P2 findings, no P0. `hasAdvisories: true`.

| Severity | Count |
| --- | --- |
| P0 | 0 |
| P1 | 4 |
| P2 | 6 |

**Scope.** The review covered the corpus checker (`scripts/check-corpus.cjs`, 3544 lines), its standing mutation suite, the DESIGN.md applicator (`scripts/apply-design-md.cjs`) and its gates, the shared gate arithmetic, the 29 chart forms under `assets/templates/`, the style-reference bundle that now owns colour (`assets/style-reference/evilcharts/`), all four reference documents, the packet's own `README.md`/`SKILL.md`, the manual-testing playbook, the CI gate, and the review target's spec folder. 35 files were read in whole or in part; all 29 templates were inspected (7 read, 22 grepped).

**The packet is healthy where it is mechanical.** A read-only run of the corpus check returns `RESULT: PASSED` with 42 check families and zero failures, the mutation suite and CI gate back it, the catalog resolves in both directions, every template's palette block is compared against `palettes.json` byte for byte in both themes, and the style-reference ownership rule is enforced rather than merely stated (`checkStyleReference` requires each reference's own `palettes.json` with a `derivation` block and re-hashes every file its `origin.md` pins). No finding is a broken check.

**Every P1 is a document that has stopped describing the code, in the direction the packet's own rules forbid.** The packet says *"A rule the tooling does not check is a wish"* (`scripts/README.md:454`); two documents apply that principle and two break it. `color-system.md:307-310` states a design-md gate set that neither the applicator nor the checker implements, and contradicts `design-md-theming.md:128-133` on the same page-set of gates. The catalog's `family` cell carries two values the same document does not define, in a hand-kept column outside the reach of any check — the same drift `catalog-system` was added to close one column to the right. `template-contract.md:462-464` still names the `cursor` reference that v0.21.0.0 removed and states corner values of 4px/8px where `palettes.json` holds 4.4px/8.4px and the checker compares against them, even though the changelog for that release claims the passage was rewritten. The manual-testing playbook states a corpus of twenty-one forms where twenty-nine ship.

**Convergence.** Convergence score 0.67 at the cap. Under `stopPolicy: max-iterations` the score is telemetry only: the loop ran both permitted iterations, broadening from correctness/security to traceability/maintainability rather than synthesizing when the ratio stayed high. Novelty fell from 1.00 to 0.67, and iteration 2's findings are a different class from iteration 1's (implemented reality with no accurate document, versus documented rules with no implementation), so a third iteration would have had to open the templates' own drawing code rather than the documents.

## 2. Planning Trigger

The verdict is **CONDITIONAL**, so this routes to **remediation planning**, not to changelog creation. Four P1 findings block a PASS; none blocks a release on its own, and only one (F003) touches a write path. Recommended sequencing is in §4.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Iterations |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | correctness | The design-md gate list in `color-system.md` names three gates the design-md path does not apply | `references/color-system.md:307-310` vs `scripts/apply-design-md.cjs:465-483`, `scripts/check-corpus.cjs:526-641`, `:587-591`, `:595`; truth already stated at `references/design-md-theming.md:128-133` | 1 |
| F002 | P1 | correctness | The catalog's `family` column carries two values the same document does not define, and no check reads the column | `references/catalog.md:46-47`, defined at `:81`, six families at `:112-119`; unread by `scripts/check-corpus.cjs:2541-2579`, `:2616-2644` | 1 |
| F003 | P2 | security | The immutable-stock-forms guard compares paths lexically | `scripts/apply-design-md.cjs:666-669` (guard), `:670-672` (writes) | 1 |
| F004 | P2 | maintainability | `references/README.md` says three reference files and ships four | `references/README.md:24` vs the four rows at `:26-31` and the lede at `:18` | 1 |
| F005 | P1 | traceability | Five sites still name the `cursor` Style Reference removed by v0.21.0.0; one states corner values the checker enforces against | `README.md:48`, `scripts/README.md:32`, `scripts/apply-design-md.cjs:148`, `assets/style-reference/evilcharts/origin.md:3`, `references/template-contract.md:462-464`; truth: `assets/style-reference/evilcharts/palettes.json` radius, `changelog/v0.21.0.0.md:16`, `:19-21` | 2 |
| F006 | P1 | traceability | The manual-testing-playbook states twenty-one chart forms where the corpus ships twenty-nine | `manual-testing-playbook/manual-testing-playbook.md:50` vs `SKILL.md:137`, `README.md:32`, `references/README.md:33`, `references/template-contract.md:320`, `reading-the-chart/headline-agrees-with-the-data.md:101` | 2 |
| F007 | P2 | maintainability | `scripts/README.md` accounts for 22 of the 42 check families the runner emits and never says the list is partial | `scripts/README.md:75`, `:97`; 13 families named nowhere; `README.md:124` routes readers here | 2 |
| F008 | P2 | maintainability | The standing proof suite is named in no living packet document | `scripts/tests/*.test.cjs`; only `.github/workflows/chart-corpus.yml:35-40` and `changelog/v0.23.0.0.md:63-64` name it | 2 |
| F009 | P2 | maintainability | Scripts and playbook version fields did not follow the v0.23.0.0 release | `scripts/README.md:12` (0.22.0.15), `manual-testing-playbook/manual-testing-playbook.md:4` and the nine scenarios (0.22.0.x), vs `changelog/v0.23.0.0.md:76` | 2 |
| F010 | P2 | traceability | The review target spec folder is an unfilled Level-2 scaffold | `specs/sk-design/020-chart-and-diagram-review/001-chart-review/spec.md:28-33`, `:60-64`; no `checklist.md` | 2 |

## 4. Remediation Workstreams

**Lane 1 — Write path (does this first, it is the only one that can damage the corpus).**

1. **F003** — replace the lexical `--out` guard in `scripts/apply-design-md.cjs:666-669` with a real-path containment test: `fs.realpathSync` the nearest existing ancestor of `outDir`, compare against `fs.realpathSync(TEMPLATE_DIR)`, refuse on containment. Keep the existing message. Add a case to `scripts/tests/apply-design-md.test.cjs` for a symlinked and a case-variant `--out`.

**Lane 2 — Documents that describe gates or values that do not exist (all evidence-only, no code change).**

2. **F001** — rewrite `references/color-system.md:307-310` to the set `references/design-md-theming.md:128-133` already carries. Then choose once, explicitly: either leave the ramp-end gates out of the design-md path and say so in both documents, or implement them in `apply-design-md.cjs` `validateTheme` and `check-corpus.cjs` `checkDesignMdBlock`. Do not leave the two documents disagreeing.
3. **F005** — fix all five sites to name `evilcharts`; in `references/template-contract.md:462-464` state the ladder from `palettes.json` (`2px` mark, `4.4px` track/swatch/pill, `8.4px` card) and name the `pill` rung rather than the tooltip card that reads it.
4. **F006** — correct `manual-testing-playbook/manual-testing-playbook.md:50` to twenty-nine, or delete the number and let the walked tree carry it as line 38 promises.
5. **F004** — `references/README.md:24`: "Three" → "Four".

**Lane 3 — Inventory and coverage surfaces.**

6. **F002** — re-label `funnel` and `dumbbell` into the six families defined at `references/catalog.md:112-119`, then extend `parseCatalog`/`checkCatalogSystem` so the `family` cell is held against the section 4 list the way `system` is held against the palette source.
7. **F007** — enumerate the remaining 13 families in `scripts/README.md` §4, or state that the section names the families the contract discusses while the run prints the full set.

**Lane 4 — Discoverability and bookkeeping.**

8. **F008** — name `node --test scripts/tests/` in `README.md` §6 VERIFICATION and in `scripts/README.md`, and mark §5's manual `sed` recipes as the historical record they now are.
9. **F009** — move the eleven version fields to the `0.23.x` line, or record that the field is not maintained for those document sets.
10. **F010** — fill `spec.md` §4 and `acceptance-criteria.md` before the packet closes, or record explicitly that this run is code-only.

## 5. Spec Seed

- Add to `SKILL.md` §4 ALWAYS: *name the document that states a rule when the rule changes; a document that states a gate the tooling does not apply is the wish the scripts rule forbids* — this is the shared cause of F001, F005 and F006.
- Add to `SKILL.md` §6 SUCCESS CRITERIA: *every count a document states about the corpus (forms, families, references, check families) is either derived from the tree or is on the list the tooling checks.*
- Extend `references/catalog.md` §3 to say that all six columns are machine-read, and record which of them a check holds.
- In `references/color-system.md` §6 (WHAT IS ENFORCED), scope the "every gate in the table above" sentence to the three stock systems and give the adapter's real set, or move the ramp rows out of the shared table.

## 6. Plan Seed

| Task | Finding | Target | Verification |
| --- | --- | --- | --- |
| Real-path `--out` guard plus two test cases | F003 | `scripts/apply-design-md.cjs` | `node --test scripts/tests/apply-design-md.test.cjs`; symlink and case-variant both refused |
| Align the two design-md gate lists | F001 | `references/color-system.md`, `references/design-md-theming.md`, maybe both scripts | `rg -n 'rampDarkestOnSurface\|rampLightestOnSurface' references/ scripts/` returns the stock path only, and both docs agree |
| Purge the `cursor` name and correct the ladder | F005 | `README.md`, `scripts/README.md`, `scripts/apply-design-md.cjs`, `assets/style-reference/evilcharts/origin.md`, `references/template-contract.md` | `rg -n cursor` over the packet returns only `changelog/**` and `references/cursor-guide`-style family names |
| Correct the playbook corpus size | F006 | `manual-testing-playbook/manual-testing-playbook.md` | the number equals `ls assets/templates/*.html \| wc -l` |
| Gate the catalog `family` cell | F002 | `scripts/check-corpus.cjs`, `references/catalog.md` | mutate a cell, watch `catalog-family` fire; `node scripts/check-corpus.cjs` |
| Complete the check inventory | F007 | `scripts/README.md` | every family the run prints is named, or the partiality is stated |
| Document the proof suite | F008 | `README.md`, `scripts/README.md` | `node --test scripts/tests/` named in both |
| Version and scaffold bookkeeping | F009, F010 | eleven version fields; `spec.md` §4; `acceptance-criteria.md` | frontmatter on the `0.23.x` line; no bracket placeholders remain |

## 7. Traceability Status

| Protocol | Class | Status | Evidence |
| --- | --- | --- | --- |
| spec_code | core | **partial** | The packet's own documents are the only specification this target has, and two of them state rules the code does not implement (F001) or values the code contradicts (F005); a third hand-keeps a cell no check reads (F002). |
| checklist_evidence | core | **fail** | No `checklist.md` exists under `specs/sk-design/020-chart-and-diagram-review/001-chart-review/`, and `spec.md:60-64` still carries the template's `REQ-001` placeholder. There is nothing to check evidence against, so this run's verdict rests on code evidence alone (F010). |
| feature_catalog_code | overlay | **partial** | `references/catalog.md` is the feature catalog. Both-direction `id`/`file` resolution is enforced (`check-corpus.cjs:2581-2614`) and the `system` cell is held against the templates (`:2616-2644`); the `family` and `question` cells are held by nothing (F002). |
| playbook_capability | overlay | **partial** | `manual-testing-playbook/` ships an index plus nine scenario files with the required frontmatter and no routing-gold fields; the index states a corpus size eight forms short of the shipped corpus (F006). |

**Acceptance-coverage signal (`AC_COVERAGE`)**: not evaluable. The predicate requires a `checklist.md` and an in-progress-or-later `implementation-summary.md` at Level 2+; the folder has neither in a filled state. No advisory signal was produced, and none of the verdict logic depended on one.

## 8. Deferred Items

Advisory findings (all P2, none blocking): **F003**, **F004**, **F007**, **F008**, **F009**, **F010**.

Blocked protocols: `checklist_evidence` cannot pass in this packet (F010).

Follow-up checks this lineage deliberately did not run, and what each would need:

- **`--render` families** (`render`, `dark-render`, `settled-render`, `card-readout`, `pointer-reach`): need an installed Chrome/Chromium. The packet's own CI omits them for the same reason (`.github/workflows/chart-corpus.yml:20-24`). A run on a machine with a browser would close the largest evidence gap in this report.
- **`assets/templates/` drawing code, read end to end**: 22 of 29 templates were grepped rather than read. A third iteration with the cap lifted should read the drawing code of the seven ceiling-notice forms and the five `CAPACITY` forms, where the interaction between the notice, the ceiling and the encoding is densest.
- **`references/template-contract.md` in full** (821 lines): §"The pointer contract, per form" was verified only through the `pointer-contract-coverage` family, which passes for all 29 forms.
- **`scripts/color-gates.cjs`**: named by both scripts and not read. Small file, shared arithmetic, worth a pass before any gate arithmetic is changed.
- **The sibling lineage and the hub**: `sk-design-diagram`, `mode-registry.json`, `hub-router.json` and `leaf-manifest.json` are out of scope for this lineage; the `radar chart` routing disagreement that `SKILL.md:44-52` records is a hub decision, not a packet defect.

## 9. Audit Appendix

### Iteration table

| Run | Focus | Dimensions | New findings | Ratio | Verdict | Artifact |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Correctness and security: checker, applicator, gates | correctness, security | P0=0 P1=2 P2=2 | 1.00 | CONDITIONAL | `iterations/iteration-001.md` |
| 2 | Traceability and maintainability: documents, playbook, bundle, proof suite | traceability, maintainability | P0=0 P1=2 P2=4 | 0.67 | CONDITIONAL | `iterations/iteration-002.md` |

### Convergence signal replay

| Run | Score | Threshold | Decision | Reason |
| --- | --- | --- | --- | --- |
| 1 | 1.00 | 0.10 | CONTINUE | above threshold; cap governs under `max-iterations` |
| 2 | 0.67 | 0.10 | STOP | `maxIterationsReached` |

`stopReason` at the terminal record: **`maxIterationsReached`**.

### File coverage matrix

| Surface | Coverage |
| --- | --- |
| `SKILL.md`, `README.md`, `references/*.md` (4), `scripts/README.md` | read in full |
| `scripts/check-corpus.cjs` | structure, palette, design-md, catalog, render and `main()` read; not read end to end |
| `scripts/apply-design-md.cjs` | read in full except the theme-derivation interior partially skimmed |
| `scripts/color-gates.cjs` | not read (named and reused) |
| `scripts/tests/` | harness and case structure read; all cases not enumerated |
| `assets/templates/*.html` (29) | 7 read (the ceiling-notice forms), 22 grepped |
| `assets/style-reference/evilcharts/` | `palettes.json` and `origin.md` read; `DESIGN.md`, `tokens.json`, `source-globals.css`, 3 proof sheets listed |
| `manual-testing-playbook/` | index read in full; 9 scenarios listed, 1 read |
| `changelog/` | `v0.21.0.0`, `v0.23.0.0` read; others grepped |
| `.github/workflows/chart-corpus.yml` | read in full |
| review target spec folder | all 5 docs inspected for state |

### Dimension breakdown

| Dimension | Findings | Iteration |
| --- | --- | --- |
| correctness | F001 (P1), F002 (P1) | 1 |
| security | F003 (P2) | 1 |
| traceability | F005 (P1), F006 (P1), F010 (P2) | 2 |
| maintainability | F004 (P2), F007 (P2), F008 (P2), F009 (P2) | 1, 2 |

### Evidence discipline

Every finding carries a `file:line` citation. All 82 citations across the two iteration files were machine-checked against the shipped tree for path resolvability and line existence; the only unresolvable form was a skill-relative path, which was rewritten to a repository-relative one. The green baseline was captured before any finding was recorded, by running the checker read-only. No file under review was modified, and no command outside this lineage directory was run for write.

### Lineage scope

This lineage is a detached fan-out worker. Its entire write surface is
`specs/sk-design/020-chart-and-diagram-review/001-chart-review/review/lineages/deepseek/`, so the loop's
continuity save (`generate-context.js`) was **not** run: it writes outside that surface. Continuity for
this run lives in this report, in `deep-review-strategy.md` and in `deep-review-state.jsonl`.
`git status --porcelain` over `.opencode/skills/sk-design/` reports no change, so the packet under review
is byte-identical to its pre-review state.
