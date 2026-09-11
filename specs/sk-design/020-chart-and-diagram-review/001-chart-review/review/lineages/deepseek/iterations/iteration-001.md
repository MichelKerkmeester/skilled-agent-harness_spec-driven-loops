# Iteration 1: Correctness and security of the corpus checker, the DESIGN.md applicator and its gates

## Focus

Dimensions: **correctness**, **security**.
Surfaces: `scripts/check-corpus.cjs` (structure, palette/design-md/catalog/render/main paths),
`scripts/apply-design-md.cjs` (argument parsing, theme derivation, the gate pass, the writer),
`scripts/color-gates.cjs` (named only), `references/color-system.md`,
`references/design-md-theming.md`, `references/catalog.md`, `references/README.md`, `SKILL.md`,
`assets/style-reference/evilcharts/palettes.json`, and the seven forms that carry a ceiling notice.

Test method: read the document that states a binding rule, then grep the implementation for the gate
or guard the sentence names, then run the checker read-only to establish the green baseline.

## Scorecard

- Dimensions covered: correctness, security
- Files reviewed: 14 documents/scripts read in whole or in part, 29 templates grepped, 7 templates read
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (first iteration; every finding is new)

Baseline observed before any finding was recorded:

```
$ node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  files scanned: 32 (chart forms under assets/templates: 29)
  colour systems: 3
  render checks: not run (pass --render)
  ... 42 families, 0 failure(s)
Summary: errors: 0
RESULT: PASSED
```

Every family named below printed `0 failure(s)` on that run, so each finding is a rule that is
documented and absent, or a guard that is present and too narrow — never a rule that is failing.
The run was read-only: without `--render` the checker creates no temporary directory and writes
no file (`grep -n "writeFileSync\|mkdirSync" scripts/check-corpus.cjs` returns only the two
instrumented-driver writes at `:2772` and `:2926` and the temp trees at `:3044-3045`, all inside
`checkRenders`).

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: **The design-md gate list in `color-system.md` names three gates that the design-md path does not apply**, `references/color-system.md:307-310`. The sentence reads: *"The design-md adapter applies `textOnSurface` to ink and muted, `markOnSurface` to all four series and emphasis, `rampDarkestOnSurface` and `rampLightestOnSurface` to the two series ends, `rampStepSeparation` to adjacent series values, and `emphasisAgainstFirstSeries` to emphasis."* Three claims in it are false against the shipped code.

  - `rampDarkestOnSurface` and `rampLightestOnSurface` are applied to no design-md value anywhere. In `scripts/apply-design-md.cjs`, `validateTheme` (`:465-483`) checks only `textOnSurface` for ink and muted, `markOnSurface` for each series and for emphasis, and `emphasisAgainstFirstSeries` for emphasis against `series[0]`, plus the dark-rule alpha shape at `:479-481`. In `scripts/check-corpus.cjs`, `checkDesignMdBlock` (`:526-641`) applies the same set and never reads either ramp-end gate. A grep for the two names returns only the palette source (`assets/style-reference/evilcharts/palettes.json:69-70`) and the stock-only reader `checkPaletteSource` (`check-corpus.cjs:392,398`).
  - `rampStepSeparation` is not applied "to adjacent series values" on the delivery side. `checkDesignMdBlock` compares **every pair** of the four series (`check-corpus.cjs:592-601`, `for (let a = 0; a < series.length; a += 1) { for (let b = a + 1; ...)`, six pairs), and the comparison is a disjunction: `contrast(...) >= gates.rampStepSeparation || hueGap(...) >= 30`. On the applicator side the ratio is not a validation at all — it appears once inside `chooseSeries`'s `admit` filter (`apply-design-md.cjs:369`) and a value that fails it is skipped rather than reported, so `validateTheme` can pass a theme whose series sit under the separation ratio.
  - The code's own comment states the opposite intent, and it is deliberate: *"the ramp step and end gates belong to a magnitude ramp, which a Style Reference does not supply and the theming script refuses to write"* (`check-corpus.cjs:587-591`).

  The second document in the same directory already states the true set — `references/design-md-theming.md:128-133` lists `textOnSurface`, `markOnSurface`, *"Any two series must differ by the separation ratio or by thirty degrees of hue"*, `emphasisAgainstFirstSeries`, and the ungated rule. So the two reference documents contradict each other on the same gate set and the code agrees with `design-md-theming.md`. `color-system.md:347` additionally claims *"Every gate in the table above, computed from the palette file, once per theme"* under "WHAT IS ENFORCED", which is true for the three stock systems and false for the adapter row above it. This is the defect the packet's own rule names — *"A rule the tooling does not check is a wish. Anything the contract states as binding is enforced here, and anything that cannot be enforced is named as advisory in the contract instead of written as if it bound"* (`scripts/README.md:454`). Correct the sentence to the set `design-md-theming.md` already carries, or move the ramp gates into `validateTheme` and `checkDesignMdBlock`; do not leave the two documents disagreeing.

- **F002**: **The catalog's `family` column carries two values the same document does not define, and no check reads the column**, `references/catalog.md:46` (`funnel` → `part-to-whole`) and `references/catalog.md:47` (`dumbbell` → `change`). `references/catalog.md:81` defines the cell as *"The question group the form belongs to, from section 4"*, and section 4 (`:112-119`) defines exactly six: comparison, composition, time, distribution, relationship, matrix. `SKILL.md:137` repeats the claim — *"Twenty-nine chart forms across six question families"*. Extraction over the sentinel block gives 9 time, 5 composition, 5 comparison, 4 distribution, 3 relationship, 1 matrix, 1 `part-to-whole`, 1 `change` = 29 rows, so two of twenty-nine rows name a family that does not exist while the packet states there are six.

  Nothing catches it: `parseCatalog` (`check-corpus.cjs:2541-2579`) reads the `id`, `file` and `system` columns only, and `checkCatalogSystem` (`:2616-2644`) gates the `system` cell alone. That is precisely the drift the `catalog-system` family was added to close, in its own words: *"The cell is a hand-kept copy of a template's own declaration, so the two can disagree with nothing catching it, which is the state this corpus was in until both documents were read against each other by hand. A check is what stops the next one"* (`check-corpus.cjs:2612-2615`). Either re-label the two rows into the six defined families (`funnel` is a `composition` form and `dumbbell` is a `comparison` or `time` form on the section 4 wording) or add the two names to section 4; and extend `checkCatalogSystem` (or a sibling family) to hold `family` against the section 4 list, because the cell is machine-read the same way `system` is.

### P2, Suggestion

- **F003**: **The immutable-stock-forms guard compares paths lexically**, `scripts/apply-design-md.cjs:666-669`. `const outDir = path.resolve(options.out); if (outDir === TEMPLATE_DIR || outDir.startsWith(TEMPLATE_DIR + path.sep)) fail('refusing to write inside assets/templates; stock forms are immutable');` and then `fs.mkdirSync(outDir, { recursive: true })` with `fs.writeFileSync` at `:670-672`. `path.resolve` normalises `..` but not symlinks, and a string prefix test is case-sensitive while the default macOS volume is not: `--out` naming a symlink that points at `assets/templates`, or a differently-cased spelling of the same directory on a case-insensitive volume, resolves to a string that passes the guard and then writes over stock forms. The guard carries the message `refusing to write inside assets/templates; stock forms are immutable` (`scripts/apply-design-md.cjs:668`) and is the only protection for files `:145-148` describes as a stock the corpus was derived from that cannot change under it without a diff; the applicator's own guide promises a failed gate writes nothing (`references/design-md-theming.md:136`). Compare real paths — `fs.realpathSync` of the nearest existing ancestor against `fs.realpathSync(TEMPLATE_DIR)` — and refuse on a containment test rather than a prefix test. Severity is P2 rather than P1 because the tool is local and the operator supplies `--out`; the failure mode is silent overwrite of the corpus, which is what makes it worth fixing rather than noting.

- **F004**: **`references/README.md` says three reference files and ships four**, `references/README.md:24` (*"Three files sit here, each one a lookup or a contract rather than a guide to read end to end"*). The table four lines below lists four (`:26-31`: `catalog.md`, `color-system.md`, `design-md-theming.md`, `template-contract.md`), and the lede at `:18` already says *"The reference set answers four questions in order"*. The count predates `design-md-theming.md` joining the set. Change "Three" to "Four".

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `references/color-system.md:307-310` vs `scripts/apply-design-md.cjs:469-482`, `scripts/check-corpus.cjs:526-641`; `references/catalog.md:46-47,81,112-119` vs `scripts/check-corpus.cjs:2541-2579,2616-2644` | Two documented rules have no implementation; the code is green, so the fault is the document |
| checklist_evidence | pending | hard | `specs/sk-design/020-chart-and-diagram-review/001-chart-review/` holds no `checklist.md` | Level-2 scaffold; nothing to verify against in this iteration |
| feature_catalog_code | partial | overlay | `references/catalog.md` sentinel block parses; both-direction id/file resolution enforced at `scripts/check-corpus.cjs:2581-2614` | `family` column ungated — F002 |
| playbook_capability | pass | overlay | `manual-testing-playbook/manual-testing-playbook.md` plus 9 scenario docs present | Not exercised in this iteration |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: correctness, security
- Novelty justification: 4 findings from 14 surfaces read. The stock corpus check is green across 42
  families and its assertions were not re-litigated; the findings are (a) two documents that state a
  gate set the code does not implement, (b) one machine-read catalog cell outside the reach of any
  check, (c) one write guard that is narrower than the sentence it enforces, (d) one stale count.
  The first two are the same defect class the packet names in its own script rules.

## Ruled Out

- **`checkDesignMdBlock` is dead code**: it has no call site in `main()` and that reads as an unenforced
  gate. It is called from `checkPaletteBlock` (`check-corpus.cjs:668`), which is called per file at
  `:3408`. Ruled out with evidence rather than reported.
- **The applicator can fetch a remote reference**: `parseArgs` refuses a leading URL
  (`apply-design-md.cjs:162`) and `readText` requires an existing local file (`:44`). A `file:///…`
  argument is not caught by `isUrl` but then fails `existsSync`, so no fetch path exists. Ruled out.
- **The ceiling notices are decorative**: all seven forms named at `references/template-contract.md:296-301`
  print the actual count and the actual ceiling into the figure — scatter `:490-492`, heat-matrix
  `:549-551`, unit-ring `:333-335`, unit-grid `:325-327`, stacked-bars `:617-619`, treemap `:510-512`,
  stacked-area `:690-692`. Ruled out.
- **The checker hardcodes a file inventory**: `htmlFilesUnder` (`check-corpus.cjs:3051-3060`) discovers on
  disk, `parseCatalog` reads the index, and `checkContractCoverage` (`:3488-3520`) derives the form set
  from `assets/templates/`. Ruled out.
- **Stale screenshot or stale palette artifact carried as evidence**: `openOnce` removes the target shot
  before each spawn specifically to prevent a stale artifact being compared as a pass
  (`check-corpus.cjs:2681-2683`). Ruled out.

## Dead Ends

- **`rampStepSeparation` on the delivery side**: whether the design-md separation rule is "too strict" or
  "too loose" could not be settled as a defect, because it is a disjunction with a 30-degree hue escape
  (`check-corpus.cjs:595`) and the applicator's `admit` filter (`apply-design-md.cjs:363-371`) already
  refuses the pairs that reach it. The reportable fact is the mismatch with the prose, which is F001;
  the arithmetic itself is defensible and was left alone.
- **The `family` sentence in `SKILL.md:137`**: "six question families" is correct for the corpus and
  wrong only in relation to two catalog cells, so the cell is the defect and the sentence is not a
  second finding.

## Recommended Next Focus

Iteration 2 covers the two dimensions the cap leaves: **traceability** (the spec folder's own claims
against packet reality, the reference documents' internal consistency, the version bookkeeping across
the packet, and the 29-form inventory) and **maintainability** (whether a future editor is told to run
the standing mutation suite that proves the checker can fail, and what the manual mutation recipes in
`scripts/README.md` now duplicate). Carry F001 and F002 forward as open; do not re-derive them.

Review verdict: CONDITIONAL
