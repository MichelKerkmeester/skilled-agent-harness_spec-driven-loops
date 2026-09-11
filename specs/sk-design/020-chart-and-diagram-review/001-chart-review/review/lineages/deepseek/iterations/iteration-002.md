# Iteration 2: Traceability and maintainability across the reference documents, the playbook and the proof suite

## Focus

Dimensions: **traceability**, **maintainability**.
Surfaces opened this iteration, none of which iteration 1 read: the packet `README.md`,
`manual-testing-playbook/` (index plus its nine scenarios), the style-reference bundle
(`assets/style-reference/evilcharts/`: `DESIGN.md`, `origin.md`, `palettes.json`, the three proof
sheets, `source-globals.css`, `tokens.json`), the version frontmatter of every document, the
counts each document states about the corpus, the family inventory in `scripts/README.md`, the
standing proof suite under `scripts/tests/`, `changelog/v0.21.0.0.md` and `v0.23.0.0.md`, and the
review target's own spec folder.

Test method: take each count, name and version a document asserts, and resolve it against the
shipped tree or the code that enforces it; then check whether the release that claimed to fix it
landed.

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 21 (4 top-level docs, 4 reference docs, 10 playbook files, 2 changelogs, the spec folder's 5 docs)
- New findings: P0=0 P1=2 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.67 (6 new / 9 cumulative)

## Findings

### P0, Blocker

None.

### P1, Required

- **F005**: **Five sites still name the `cursor` Style Reference that v0.21.0.0 removed, and one of them states corner values the checker enforces against.** `assets/style-reference/` contains one directory, `evilcharts` (`ls assets/style-reference/` → `evilcharts`), and `changelog/v0.21.0.0.md:16` states the removal outright: *"One Style Reference. `assets/style-reference/cursor/` is removed."* The surviving sites:

  - `README.md:48` — *"When a request names a local v3 `DESIGN.md`, **or passes `--default` for the `cursor` bundle in the style library**, `scripts/apply-design-md.cjs` derives the chart role palette…"*. `--default` resolves to `DEFAULT_DESIGN_PATH = path.join(STYLE_REFERENCE_DIR, DEFAULT_STYLE_REFERENCE, 'DESIGN.md')` with `DEFAULT_STYLE_REFERENCE = 'evilcharts'` (`scripts/apply-design-md.cjs:31,150`), and `references/design-md-theming.md:117-121` says the same file is *"the one reference this packet carries"*. The sentence sends a reader looking for a bundle that is not in the packet.
  - `scripts/README.md:32` — the first command a reader copies: `--default --all --out scratch/themed      # the cursor bundle`. Same falsehood, in an executable example, in the document `README.md:79` routes to for *"What the corpus validator checks"*.
  - `scripts/apply-design-md.cjs:148` — *"Any other reference, including the cursor capture carried beside it, is applied by passing its path instead."* No capture is carried beside it.
  - `assets/style-reference/evilcharts/origin.md:3` — *"Unlike the cursor reference beside it, this one was not captured by the style library."* The contrast is now against nothing.
  - `references/template-contract.md:462-464` — *"The rungs follow the cursor reference: 2px for a mark, 4px for a track, a swatch and the tooltip card, 8px for the card itself."* Three defects in one sentence: it names the removed reference; its two numbers contradict the enforced ladder, which is `{"mark":"2px","track":"4.4px","swatch":"4.4px","pill":"4.4px","card":"8.4px"}` in `assets/style-reference/evilcharts/palettes.json` and is compared against every template's light block in both directions by `checkPaletteBlock` (`check-corpus.cjs:681-696`); and it names the third rung by a consumer (*"the tooltip card"*, which actually reads `--chart-radius-pill`, `assets/templates/grouped-bars.html:192`) where the same paragraph's own list at `:458-459` names five rungs by property.

  The changelog claims this was fixed and it was not: `changelog/v0.21.0.0.md:19-21` says *"The corner-ladder passage is rewritten from the ladder the applicator actually reproduces: 4.4px on track, swatch and pill, 8.4px on the card, the 2px mark corner the corpus's own"*, and `:17-19` names the three documents that "said cursor in the places that matter and now say what the palette source and the applicator already did" — `SKILL.md`, `references/color-system.md`, `references/design-md-theming.md`. Those three are clean; the five sites above were outside the list and were missed. Fix all five; the corner-ladder sentence should read the values in `palettes.json` and name the `pill` rung.

- **F006**: **The manual-testing-playbook states a corpus size the corpus does not have, in a document that says it does not hand-maintain counts**, `manual-testing-playbook/manual-testing-playbook.md:50` — *"The corpus holds **twenty-one** chart forms across six question families."* The shipped corpus is 29 (`assets/templates/*.html` → 29; the checker's own header prints `chart forms under assets/templates: 29`; `SKILL.md:137`, `README.md:32`, `references/README.md:33`, `references/catalog.md` (29 sentinel rows) and `references/template-contract.md:320` all say twenty-nine). The playbook's own scenario file contradicts the index: `manual-testing-playbook/reading-the-chart/headline-agrees-with-the-data.md:101` reads *"The twenty-nine forms this scenario reads"*. The paragraph that carries the error opens: *"The operator validator computes the census from the walked tree, so this document does not hand-maintain a count"* (`:38`) — immediately above a hand-maintained count that is wrong by eight forms. Correct line 50 to twenty-nine, or delete the number and let the walked tree carry it as the same paragraph promises.

### P2, Suggestion

- **F007**: **The document that owns the check inventory accounts for 22 of the 42 families the checker emits and never says the list is partial**, `scripts/README.md:75` names eighteen per-file families and `:97` adds *"Nine more … Six run per file"*, naming six of which `legend` and `tooltip-card` are already in the first list. Thirteen emitted families are named nowhere in the file: `cursor-guide`, `curve-contract`, `emphasis-budget`, `finding-cue`, `mark-policy`, `metric-block`, `palette-derivation`, `ramp-prose`, `reference-line`, `source-line`, `style-reference`, `table-disclosure`, `tooltip-indicator`. Verified by running the checker read-only, extracting the 42 family names it prints, and testing each against the document. `README.md:124` points a reader here for *"What the corpus validator checks"*, and the document's §6 table of residual holes can only discuss holes in families it knows about, so the omission understates the enforced surface by roughly a third. Either enumerate the remaining families or state plainly that §4 names the families the contract discusses and that the run prints the full set.

- **F008**: **The standing proof suite is invisible to anyone reading the packet**, `scripts/tests/corpus-mutations.test.cjs` (the harness plus its cases) and `scripts/tests/apply-design-md.test.cjs` exist, and nothing in `SKILL.md`, `README.md`, `scripts/README.md`, `references/**` or `manual-testing-playbook/**` names them or the command that runs them. The only living reference is CI: `.github/workflows/chart-corpus.yml:35-40` runs `node --test scripts/tests/`. The remaining discovery path is changelog archaeology — `changelog/v0.23.0.0.md:63-64` carries the two commands and their counts. Meanwhile `scripts/README.md:135-422` devotes around 120 lines to hand-run `sed` mutations that the suite already encodes, and the packet's own doctrine is that proof is what makes a green run quotable (*"a check nobody has watched fail is a check nobody should quote"*, `scripts/README.md:338-339`). Name the suite and its command in `README.md` §6 VERIFICATION and in `scripts/README.md`, and point the manual recipes at it as the historical record they now are.

- **F009**: **Per-file version bookkeeping did not follow the v0.23.0.0 release for two document sets**. `scripts/README.md:12` still reads `version: 0.22.0.15` and every one of the ten playbook files still reads `version: 0.22.0.x` (`manual-testing-playbook.md:4` = 0.22.0.5, scenarios at 0.22.0.3-0.22.0.7), while the packet and its reference set are at `0.23.0.0`/`0.23.0.x` (`SKILL.md:6` 0.23.0.0, `README.md:15` 0.23.0.26, `references/README.md:15` 0.23.0.11, `references/catalog.md:15` 0.23.0.16, `references/color-system.md:15` 0.23.0.19, `references/design-md-theming.md:15` 0.23.0.9, `references/template-contract.md:15` 0.23.0.31). `changelog/v0.23.0.0.md:76` lists both `scripts/README.md` and `manual-testing-playbook/**` among the files that release changed. The version field is the packet's only per-file change marker, so a document that moved without its version moving cannot be told apart from one that did not.

- **F010**: **The review target's own spec folder is an unfilled Level-2 scaffold, so the loop's core traceability protocols have no counterpart**, `specs/sk-design/020-chart-and-diagram-review/001-chart-review/`. `spec.md:28-33` still reads *"[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"* and `:60-64` still carries *"| REQ-001 | [Requirement description] |"*; the folder holds 40, 37, 51, 10 and 10 bracket placeholders across `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md`, and there is no `checklist.md` at all. The deep-review contract requires `spec_code` and `checklist_evidence` coverage of every run, and the `AC_COVERAGE` signal needs `checklist.md` plus an in-progress `implementation-summary.md` (`.opencode/skills/system-deep-loop/deep-review/SKILL.md:335-337`). This review therefore rests on code evidence alone, and the verdict carries no acceptance criterion it can be checked against. Fill `spec.md` §4 and `acceptance-criteria.md` before the packet closes, or record explicitly that the run is code-only.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `references/template-contract.md:462-464` vs `assets/style-reference/evilcharts/palettes.json` (`radius`); `manual-testing-playbook/manual-testing-playbook.md:50` vs `SKILL.md:154`, `references/README.md:33` | F005, F006; the four iteration-1 findings remain open |
| checklist_evidence | fail | hard | No `checklist.md` under the review target; `spec.md:60-64` still placeholder | F010 — the protocol cannot be satisfied in this packet |
| feature_catalog_code | partial | overlay | `references/catalog.md` resolves in both directions; `family` cell ungated | F002 carried forward |
| playbook_capability | partial | overlay | 9 scenario files plus the index exist and route to the corpus check | Index states the wrong corpus size — F006 |

## Assessment

- New findings ratio: 0.67
- Dimensions addressed: traceability, maintainability
- Novelty justification: 6 new findings on 21 surfaces. Four are stale or wrong statements in
  documents a reader follows (a removed reference named in five places, a wrong corpus count, an
  inventory missing a third of its subject, version fields that did not move), one is the
  discoverability of the proof suite the packet's own doctrine depends on, one is the review
  target's own scaffold state. None duplicates iteration 1: iteration 1 found documented rules with
  no implementation, iteration 2 found implemented reality with no accurate document.

## Ruled Out

- **The `cursor`-era text also survives in `references/color-system.md`, `references/design-md-theming.md`
  and `SKILL.md`**: all three are clean of `cursor`. The v0.21.0.0 cleanup landed there, which is why
  F005 is scoped to the five sites the changelog did not list. Ruled out with evidence.
- **The style-reference ownership rule is prose only**: `checkStyleReference` (`check-corpus.cjs:3118-3186`)
  requires `DESIGN.md`, requires a `palettes.json` with its own `derivation` block, requires `origin.md`,
  and re-hashes every file the origin record pins. `color-system.md:16-20` describes exactly that. Ruled out.
- **The screenshots are incomplete**: `screenshots/templates/` holds 29 PNGs for 29 templates and
  `screenshots/style-reference/evilcharts/` holds 3 for the 3 proof sheets, matching the
  `render-screenshots.cjs --check → sources 32, missing 0` claim in `changelog/v0.23.0.0.md:67`. Ruled out.
- **The packet carries its own advisor identity metadata**: `graph-metadata.json`, `description.json`,
  `mode-registry.json` and `hub-router.json` are all absent from the packet root and all present one
  level up in `sk-design/`, which is what `SKILL.md:56` states and `SKILL.md:158` requires. Ruled out.
- **The playbook's ten documents are missing required frontmatter**: every one carries
  `title`/`description`/`stage`/`version` and none carries `id`/`expected_intent`/`expected_resources`/
  `expected_workflow_mode`/`expected_leaf_resources`, which is what its own §"Package shape" requires. Ruled out.
- **`--render` is advertised without its cost**: `scripts/README.md:67-71` says render is off by default,
  prints which mode it ran in, and requires a browser. Ruled out.

## Dead Ends

- **Whether `manual-testing-playbook/manual-testing-playbook.md:50` was ever true**: the changelogs record
  the corpus changing from 36 forms (`changelog/v0.17.0.0.md:29`) to 29, so "twenty-one" matches no
  recorded state and no edit in the changelog set explains it. The history is not reconstructable from
  the packet, so the finding is stated as the contradiction rather than as a regression.
- **Whether F009's version fields are load-bearing for tooling**: no script reads the frontmatter
  `version` field — `checkPaletteDerivation`, `checkStyleReference` and the playbook validator all read
  structured data instead, and `scripts/README.md:453-459` requires exactly that. The bookkeeping gap
  therefore costs a reader, not a gate, and it stays at P2.

## Recommended Next Focus

The cap is reached. Synthesize: F001 and F002 (iteration 1) and F005 and F006 (iteration 2) are the
four P1s and they carry the CONDITIONAL verdict, with F003, F004, F007, F008, F009 and F010 as
advisories. Only F003 touches a write path, so the remediation order is F003 first, then the six
statement defects, then the two inventory gaps.

Review verdict: CONDITIONAL
