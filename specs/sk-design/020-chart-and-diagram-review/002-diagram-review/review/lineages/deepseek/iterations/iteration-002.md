# Iteration 002: Traceability of the colour and coverage contracts, and maintainability of the checker surface

## Focus

- Dimensions: **D3 Traceability**, **D4 Maintainability**
- Scope: every reference document that states what is enforced or what a procedure is — `references/design-md-theming.md`, `references/foundations/derivation-record.md`, `references/foundations/style-guide.md`, `references/catalog.md`, `assets/diagrams/README.md`, `assets/style-reference/README.md`, `SKILL.md` — plus the parts of the checker surface no family can reach: the shared context handed to families, and the grid family's attribute exemption. Deliberately broadened from iteration 1, per the max-iterations stop policy: the executable core was covered there, so this pass attacks the documents that describe it.
- Files reviewed: 14 (`references/design-md-theming.md`, `references/foundations/derivation-record.md`, `references/foundations/style-guide.md`, `references/catalog.md`, `references/types/` (27 files counted, 3 read), `assets/diagrams/README.md`, `assets/style-reference/README.md`, `assets/style-reference/harness-diagram/DESIGN.md`, `SKILL.md`, `scripts/families/grid-4px.cjs`, `scripts/check-diagram-corpus.cjs`, `scripts/families/label-mask-clearance.cjs`, `assets/diagrams/starter-dark.html`, `scripts/tests/mutation-cases.cjs`).
- Coverage counts verified against the forms rather than against prose: 38 files in `assets/diagrams/` = 27 canonical + 7 variants + 4 starters; 27 × `references/types/type-*.md`; the route table in `SKILL.md:108-136` has 27 rows; `references/catalog.md` satisfies the bidirectional family. The "38 diagram forms" claim is accurate in all four places it is stated.

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 14
- New findings: P0=0 P1=4 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.92 (severity-weighted: `(5·P1 + 1·P2 + 10·P0) / 25`; 23/25)

## Findings

### P0, Blocker

None. Each P1 below was held against an alternative reading before registration; F008 is the closest to a P0 and is recorded as P1 precisely because a second, defensible reading of the style guide's sentence rescues it.

### P1, Required

- **F006**: The theming contract documents form base names that do not exist, so the command it prints fails, `references/design-md-theming.md:69`, example at `:63`, failure transcript at `:224`. (dimension: traceability)
  - The `--forms` argument is documented as "`template`, `template-dark`, `template-full`, `template-terminal`"; the shipped files are `starter-light.html`, `starter-dark.html`, `starter-full.html`, `starter-terminal.html` (`assets/diagrams/README.md:32`, and `ls assets/diagrams/starter-*.html`). `formNames` validates against disk (`apply-design-md.cjs:881-892` via `readText`), so the documented invocation is refused. Observed: `run(['--default','--forms','template-full','--out',…])` throws `diagram form does not exist: …/assets/diagrams/template-full.html`, and the failure transcript quoted in `:224` (`FAILURE template light accent …`) names the same vanished file.
  - The rename is visible in the codebase's own history: `check-diagram-corpus.cjs:32-35` records that the two kinds "used to be told apart by directory and now share one, so the name says it". The document was not carried along; every other reference in the packet uses `starter-*`.
- **F007**: The derivation record states that the corpus check enforces byte equality between the applicator's output and the shipped forms; no checker path invokes an applicator, `references/foundations/derivation-record.md` §6 vs `scripts/check-diagram-corpus.cjs:27`. (dimension: traceability)
  - §6: "The applicator regenerates every form from the values in this record, and the corpus check requires the result to equal the shipped bytes exactly. A value that drifts from the record fails that comparison by name." The checker requires only `./color-gates.cjs`; no family requires `apply-design-md.cjs` or `apply-diagram-tokens.cjs` (grep over `scripts/families/*.cjs` returns only `path` and `fs`), so no comparison against an applicator result exists anywhere in the run. The property is real but manual: `references/design-md-theming.md:84-90` is a copy-`diff` recipe a human runs.
  - Verified here, in memory, that the underlying property *does* hold today: `renderForm` over all 38 forms with `--default` returns 38 byte-identical outputs, 0 gate failures, 5 departure notes. So the defect is the unenforced guarantee — a value that drifts will not "fail by name" — not a present drift.
  - The same overclaim appears in `assets/diagrams/README.md:30` ("tokens that come from the palette source") and `derivation-record.md` §2 ("The applicator of a later phase reads this record, and the corpus checker re-derives every value marked **derived** from the primaries recorded here"): the checker re-derives nothing — it byte-compares block values against `palette.skins[skin].roles` inside `derivation-gates.cjs:70-75`, which is a table lookup, and the `rule`/`rule-solid`/`accent-tint` rows are the composed roles that byte-comparison covers only incidentally.
- **F008**: Two of the five series colours fall below the 4.5:1 gate that the style guide says all five clear, measured under the metric the derivation record uses; nothing measures them, `references/foundations/style-guide.md:68`, `references/foundations/derivation-record.md:96-110`, `assets/style-reference/harness-diagram/diagram-palette.json` (`gates.ungated`), `scripts/families/derivation-gates.cjs:87`. (dimension: traceability)
  - `style-guide.md:68`: "A chip that carries a label is a mark with text on it, so its fill clears the `text-on-mark` gate at 4.5:1 against the label colour; all five of these do." The record's own evidence fixes the metric: "The one that did not, the second series, moved two points darker — … 4.44:1 to 4.56:1 against white".
  - Measured with the shipped arithmetic (`scripts/color-gates.cjs`), light skin, against `#ffffff`: `series-1 #7c8f6f` **3.49:1**, `series-2 #5c7899` 4.56:1, `series-3 #b8915a` **2.90:1**, `series-4 #9c6b50` 4.53:1, `series-5 #6e6479` 5.58:1. Two of five are below the gate, while the record accounts for exactly one that "did not" — so the one-off fix it describes was not a gate and the remaining two were never measured.
  - Enforcement: `series-1..5` sit in `gates.ungated` (palette), and both readers skip ungated roles (`derivation-gates.cjs:87`, `apply-design-md.cjs:640-641`), so no code path can reach this claim. `chooseSeries` requires only `markOnPaper` (3.0) for a series pick (`apply-design-md.cjs:432-469`), so a themed series set can be selected under this gate too.
- **F009**: `assets/diagrams/README.md` states that the corpus check holds two rules it cannot hold, `assets/diagrams/README.md:30-31` vs `scripts/check-diagram-corpus.cjs:9-13` and the family inventory. (dimension: traceability)
  - Claimed: "accessibility wiring, **one skin per file**, tokens that come from the palette source, **connectors that meet their targets**". The checker's own header names the second as out of reach: "pairwise connector geometry (overlap, the attach fan, the visible label gap, a route behind a box) needs a 2D pass over parsed paths, not a regex; until one exists the eye holds it". No family checks end-point attachment or that a connector meets the edge it is drawn to; `SKILL.md:288-294` states five mandatory connector rules of which the checker enforces only the elbow vocabulary (`orthogonal-connectors.cjs`).
  - "One skin per file" and "tokens that come from the palette source" hold for the four starters only: `derivation-gates` returns early for any file without a palette block (`:42`), which is 34 of the 38 forms, and nothing else compares a worked form's literals to a skin. So the sentence overstates coverage for the majority of the library, in the document a reader opens to choose which form to copy.

### P2, Suggestion

- **F010**: A grid-family exemption can never fire, `scripts/families/grid-4px.cjs:54`. (dimension: maintainability)
  - `if (!hit || (tag === 'rect' && attr.startsWith('r'))) continue;` loops over `GEOMETRY.rect = ['x','y','width','height']`, so `attr.startsWith('r')` is false for every iteration and the clause is unreachable. The guard it was written for (`rx`/`ry`, a corner radius — which the file's own comment calls a shape value rather than a layout value) is not in the list, so the documented exemption is enforced by omission instead. The codebase actively removes this class of defect elsewhere — `node-budget.cjs:18-19` notes an exemption "that named a kind the harness stopped assigning, which made it a branch that could never be taken".
- **F011**: The shared context hands families three members none of them reads, and the shortest-lived record's name no longer describes it, `scripts/check-diagram-corpus.cjs:26,138`, `scripts/families/label-mask-clearance.cjs:133`. (dimension: maintainability)
  - `crypto` is required at `:26` and passed in `shared` at `:137`; grep across `families/*.cjs` finds no use, and the harness uses it nowhere either. `templateDir` and `exampleDir` (`:138`) are aliases of `formDir` that no family reads (`templateDir`/`exampleDir`: 0 matching files). An unused import in a 180-line harness is small, but it is also the surface a new family author reads to learn what is available, and `check-diagram-corpus.cjs` states the opposite discipline for the corpus itself ("a branch that can never be taken").
  - `label-mask-clearance.cjs:133` declares `const masks = [], short = [];` and then pushes **every** connector into `short` (`:167`), while the file's header explains that the rule used to be an overlap test on short runs and is now a clearance measured on every connector. The name is the only remaining trace of the old rule and it reads as a filter that no longer exists.
- **F012**: The technical checklist requires a hardcoded paper hex that the style guide forbids hardcoding, `SKILL.md:371` vs `SKILL.md:267` and `references/foundations/style-guide.md:37-39`. (dimension: traceability)
  - `SKILL.md:371`: "Every arrow label has an opaque `fill="#f5f5f5"` rect behind it?" — `#f5f5f5` is only the **light** `paper`; the dark skin's paper is `#2d3142` and the terminal paper is `#141414` (`style-guide.md:37`, palette `skins.*.roles.paper`). It also contradicts ALWAYS rule 5 (`SKILL.md:267`): "never hardcode values that disagree with the guide". The corpus does the right thing and the document does not: `label-mask-clearance.cjs:38` accepts `var(--color-paper)`, `var(--paper)`, `#f5f5f5`, `#ececec`, `#141414` and `#2d3142` as a mask fill, and the dark/terminal forms paint `rgba(...)`/`var(--paper)`. A reader following the checklist on a dark form would paint a white rectangle onto a dark diagram.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `references/design-md-theming.md:69` vs `assets/diagrams/starter-full.html`, `references/design-md-theming.md` §2 example | F006 — the documented invocation of the adaptive path cannot succeed; confirmed by execution |
| spec_code | partial | hard | `references/foundations/derivation-record.md` §6 vs `scripts/check-diagram-corpus.cjs:27`, `scripts/families/*.cjs` | F007 — an enforcement claim with no enforcing code; the underlying property was verified to hold today |
| checklist_evidence | partial | hard | `SKILL.md:359-375` vs `SKILL.md:196`, family inventory | F012 — one checklist item contradicts the token rule and the corpus's own behaviour |
| feature_catalog_code | partial | advisory | `feature-catalog/feature-catalog.md` vs `scripts/families/` (12 modules on disk), `scripts/check-diagram-corpus.cjs:162` | The catalog and the checker agree on twelve families; the count is derived from disk in both places, so no drift found. No finding. |
| playbook_capability | pass | advisory | `manual-testing-playbook/manual-testing-playbook.md`, `manual-testing-playbook/capture-review/capture-review.md:1-169` | Scenarios map to executable paths; the capture-review playbook names the judgment band the checker's header also names, and no scenario promises an automated check that does not exist. No finding. |

## Assessment

- New findings ratio: 0.92
- Dimensions addressed: traceability, maintainability
- Novelty justification: this pass read the claims rather than the code and then measured each claim against the shipped artifact — form names against disk, the series gate against the colour arithmetic, the README's coverage list against the family inventory and the checker's own scope statement. Three of the four P1s are places where a document is more confident than the machinery; one (F008) is a numeric claim that is false under one of its two available readings. Nothing here repeats an iteration-1 finding: F001/F002/F004 are about code paths, these are about what the documents promise.

### Claim adjudication

```json
{
  "findingId": "F006",
  "claim": "The theming contract's --forms argument documents base names that no longer exist, so the command the document prints fails before it can do anything.",
  "evidenceRefs": [
    "references/design-md-theming.md:63",
    "references/design-md-theming.md:69",
    "references/design-md-theming.md:224",
    "assets/diagrams/README.md:32",
    "scripts/apply-design-md.cjs:881-892"
  ],
  "counterevidenceSought": "Checked whether `template*` might be an alias table or a directory the applicator maps names through — formNames resolves `<form>.html` directly under assets/diagrams with no aliasing, and the corpus listing shows starter-* only. Looked for a second documented name list that would make `template-full` valid (SKILL.md, assets/diagrams/README.md, style-guide.md): all three say starter-*. Read the file's own failure example to see whether it is historical prose rather than a live procedure — it is presented as the command's output format.",
  "alternativeExplanation": "The section may be written against a future state where the starters are renamed back to template-*, and the author left the old name as a placeholder for that change. Rejected as the explanation of record: nothing in the packet or the checker references a rename plan, and check-diagram-corpus.cjs:32-35 records the rename as already completed in the other direction.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the forms are renamed to template-* (or an alias table accepts both names and is documented), downgrade to P2.",
  "transitions": [{ "iteration": 2, "from": null, "to": "P1", "reason": "Documented name list read against disk and then executed" }]
}
```

```json
{
  "findingId": "F007",
  "claim": "The derivation record asserts that the corpus check requires the applicator's output to equal the shipped bytes, and no checker path invokes an applicator, so a drift would not fail by name as the record promises.",
  "evidenceRefs": [
    "references/foundations/derivation-record.md:113-120",
    "scripts/check-diagram-corpus.cjs:27",
    "scripts/families/derivation-gates.cjs:70-75",
    "references/design-md-theming.md:84-90"
  ],
  "counterevidenceSought": "Grepped every module the checker and its families require (only color-gates.cjs, plus path/fs in grid-4px) and searched the checker for any spawn/exec of a script — there is none. Checked the test suite for a wrapper that runs the identity diff: scripts/tests holds one mutation test and its case file, no identity case. Checked whether some other gate (validate-flowchart.sh, the mutation suite) could stand in: neither touches the applicator.",
  "alternativeExplanation": "A 'corpus check' could mean the whole documented procedure, of which the manual diff is one step, and the record may be speaking of that procedure rather than of check-diagram-corpus.cjs. That reading survives for the theming document but not for the record's sentence, which names the check as the thing that fails a drifting value by name.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "If a test or the checker gains an identity invocation of the applicator compared byte-wise against assets/diagrams, or the record is amended to describe the manual diff, downgrade to P2.",
  "transitions": [{ "iteration": 2, "from": null, "to": "P1", "reason": "Claim read against the checker's import graph and its test suite" }]
}
```

```json
{
  "findingId": "F008",
  "claim": "Under the metric the derivation record uses for the series text-on-mark gate, two of the five series colours measure below 4.5:1, and no code path measures them because the roles are ungated.",
  "evidenceRefs": [
    "references/foundations/style-guide.md:68",
    "references/foundations/derivation-record.md:96-103",
    "scripts/color-gates.cjs:44-50",
    "scripts/families/derivation-gates.cjs:87",
    "assets/style-reference/harness-diagram/diagram-palette.json:1-40"
  ],
  "counterevidenceSought": "Recomputed all five light series values against white with the shipped contrast function (series-1 3.49, series-2 4.56, series-3 2.90, series-4 4.53, series-5 5.58) and against the light ink; also computed the alpha composite the style guide's previous sentence describes (fill at 0.18 over #f5f5f5 against ink), which measures 9.37-10.12:1 for all five. Checked whether any family constructs the chip case: none does, and series-* is in gates.ungated.",
  "alternativeExplanation": "The style guide's sentence may mean the 0.18-alpha chip fill against the label colour, in which case all five pass comfortably and only the derivation record's numbers ('against white', '4.44:1 to 4.56:1') use the other metric. Rejected as a defence of the pair: the two documents then measure different things while asserting one gate, and the record's own 'the one that did not' accounts for one failure where the full-colour metric shows two.",
  "finalSeverity": "P1",
  "confidence": 0.72,
  "downgradeTrigger": "If either document states the metric explicitly and the five values are re-measured against it (or the series gain a gate in the palette and a case in the mutation suite), downgrade to P2.",
  "transitions": [{ "iteration": 2, "from": null, "to": "P1", "reason": "Gate claim measured with the shipped arithmetic against two available readings" }]
}
```

```json
{
  "findingId": "F009",
  "claim": "The form library's index tells a reader the corpus check holds two rules it structurally cannot hold or should not be read as covering the whole library.",
  "evidenceRefs": [
    "assets/diagrams/README.md:28-31",
    "scripts/check-diagram-corpus.cjs:9-13",
    "scripts/families/derivation-gates.cjs:42",
    "scripts/families/orthogonal-connectors.cjs:68-81"
  ],
  "counterevidenceSought": "Walked all twelve families for anything that could stand for either rule: no family reads a connector's endpoint against a box edge (orthogonal-connectors checks only that segments stay axis-aligned), and no family compares a worked form's literals to a skin, because derivation-gates returns before that for a file with no block. Checked whether the README's sentence is scoped to starters — it is not; it precedes a paragraph about the whole library.",
  "alternativeExplanation": "The sentence may be a summary of the packet's *intent* and the reader is expected to know the checker's scope from the checker; against that, the same README says the checker 'says nothing about what you draw', which reads as a scope statement and is accurate about drawing, leaving the two false items unexplained.",
  "finalSeverity": "P1",
  "confidence": 0.8,
  "downgradeTrigger": "If the README's coverage list is narrowed to the families that exist (accessibility wiring, ids, markers, grid, legends, masks, catalog, metadata, external references) and the connector claim is moved to the capture review, downgrade to P2.",
  "transitions": [{ "iteration": 2, "from": null, "to": "P1", "reason": "Coverage claim read against the family inventory and the checker's own scope note" }]
}
```

## Ruled Out

- **A P0 for F008**: the style guide's sentence has a second defensible reading under which all five series pass, so the claim is a contradiction between two documents rather than a confirmed falsehood. P1, and the alternative reading is recorded in the packet.
- **Counting a family's per-file `tally` as coverage**: `grid-4px`, `metadata` and the harness each count differently, and only `node-budget` (F003, iteration 1) has a signal that is absent corpus-wide; a general "tally overstates" finding was dropped as unsupported once each family's signal was checked against the corpus.
- **`references/foundations/style-guide.md:50` ("Thirty-two of thirty-four type their hex values inline")**: every one of the 34 worked forms carries inline six-digit hex (minimum 10 occurrences, `dp-integration.html`/`process.html`), so the number understates rather than overstates and no behaviour follows. Not reported; noted here so a later pass does not re-derive it.
- **`references/foundations/style-guide.md:169` (dot pattern in "26 of the 34")**: verified accurate. 26 of the 34 worked forms reference `url(#dots)` and the eight named as dropping it are exactly the eight that do not; `dp-security-matrix.html` defines an unrelated hatch pattern and is correctly listed among the eight.
- **`catalog-bidirectional` sentinel/column logic and the `references/catalog.md` table**: the family is live (101 assertions) and the corpus passes; the mutation case targets a row naming a departed file and the expectation matches either failure branch. No finding.
- **`apply-design-md.cjs:997-1003` copying non-HTML neighbours into the out directory**: intended (the README travels), and the copy is a plain file copy with no path construction from user input. No finding.

## Dead Ends

- **Reading the benchmark reports as evidence of past defects**: `benchmark/reports/**` documents earlier iterations of this packet and is excluded from the metadata family's version check; treating their findings as current produced two already-fixed claims, both dropped.
- **Comparing `SKILL.md`'s type count (27) to the route table by eye**: an eye count produced a false mismatch. The table, the canonical-diagram list, the `type-*.md` count and the disk listing were then counted mechanically (27 in all four); the eye count was the error.

## Recommended Next Focus

- None: the iteration cap is reached. If the loop continued, the highest-value targets would be (a) an adversarial probe of `catalog-bidirectional`'s column mapping against a re-ordered table, (b) reading the seven `manual-testing-playbook/**` scenario files against the corpus to see whether any scenario promises a check no script performs, and (c) the `screenshots/` trees, which no family indexes and this pass did not open.

Review verdict: CONDITIONAL
