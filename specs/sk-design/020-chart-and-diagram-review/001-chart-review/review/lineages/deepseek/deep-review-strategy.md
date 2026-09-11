# Deep Review Strategy — sk-design-chart (lineage: deepseek)

<!-- ANCHOR:topic -->
## 1. TOPIC

Review the `sk-design-chart` workflow packet at `.opencode/skills/sk-design/sk-design-chart` and report
P0/P1/P2 findings with `file:line` evidence. The named surfaces are the corpus checker
(`scripts/check-corpus.cjs`) and its mutation suite, the DESIGN.md applicator
(`scripts/apply-design-md.cjs`) and its gates, the 29 chart forms under `assets/templates/`, the
style-reference bundle that now owns colour, and every reference document.
<!-- /ANCHOR:topic -->

## 2. REVIEW BOUNDARIES

| Bound | Value |
| --- | --- |
| Target | `specs/sk-design/020-chart-and-diagram-review/001-chart-review` (spec-folder) |
| Packet under review | `.opencode/skills/sk-design/sk-design-chart` |
| Max iterations | 2 (`config.stopPolicy: max-iterations` → terminal reason `maxIterationsReached`) |
| Convergence threshold | 0.10 (telemetry only; the cap governs the stop) |
| Stuck threshold | 2 |
| Severity floor | P2 |
| Target mutability | read-only; no file under review was modified |
| Write surface | this lineage directory only |
| Executor | cli-pi / deepseek-v4.1-flash, inline (no nested dispatch) |

## 3. REVIEW DIMENSIONS (remaining)

<!-- ANCHOR:review-dimensions -->
- [x] traceability — 2 findings (F005 P1, F006 P1): a Style Reference removed by v0.21.0.0 still named in five places with corner values the checker contradicts, and a corpus size stated as twenty-one in an operator-facing playbook. Plus F009 (version bookkeeping) and F010 (the review target's own scaffold state).
- [x] maintainability — 2 findings (F007 P2, F008 P2): the check inventory omits 13 of 42 emitted families, and the standing proof suite is named in no living document.
<!-- /ANCHOR:review-dimensions -->

## 4. COMPLETED DIMENSIONS

<!-- ANCHOR:completed-dimensions -->
- [x] correctness — 2 findings (F001 P1, F002 P1). The checker's stock path is sound and green; the defect class is documented behaviour that the tooling does not implement, and a hand-kept catalog cell with no gate (the drift `catalog-system` was added to close, one column further left).
- [x] security — 1 finding (F003 P2). The one write guard in the packet (`refusing to write inside assets/templates`) compares lexical paths, so a symlink or a case-variant path passes it.
<!-- /ANCHOR:completed-dimensions -->

## 5. RUNNING FINDINGS

<!-- ANCHOR:running-findings -->
- P0: 0
- P1: 4 (F001, F002, F005, F006)
- P2: 6 (F003, F004, F007, F008, F009, F010)
- New in iteration 2: P0=0 P1=2 P2=4
- Resolved: 0
<!-- /ANCHOR:running-findings -->

## 6. WHAT WORKED

- **Running the checker read-only.** `node scripts/check-corpus.cjs` (no `--render`) writes nothing and
  returns 42 check families, 0 failures, `RESULT: PASSED`. That established the green baseline before any
  claim was made about a rule being unenforced, which is the only way to tell "unenforced" from "failing".
- **Reading the doc claim and then grepping the code for the gate name.** `rampDarkestOnSurface` and
  `rampLightestOnSurface` appear in `palettes.json` and in `checkPaletteSource` for stock systems, and
  nowhere in the design-md path in either script. A prose audit alone would have missed that.
- **Extracting the catalog cell rather than eyeballing it.** `awk` over the sentinel block counted the
  `family` column: 9 time, 5 composition, 5 comparison, 4 distribution, 3 relationship, 1 matrix,
  1 `part-to-whole`, 1 `change`. The two strays are invisible in a 29-row read.

## 7. WHAT FAILED

- Nothing infrastructure-level. No timeout, no stuck state, no unreadable artifact.

## 8. RULED OUT DIRECTIONS

- **"The recorder never runs."** `checkDesignMdBlock` has no call site in `main()`, which reads as dead
  code. It is called from `checkPaletteBlock` (`check-corpus.cjs:668`), so the design-md gates do run.
  Ruled out rather than reported.
- **"The mutation suite is not wired into CI."** It is: `.github/workflows/chart-corpus.yml` runs
  `node scripts/check-corpus.cjs` and then `node --test scripts/tests/` on every push and PR touching the
  packet. Ruled out.
- **"All seven ceiling notices are missing."** All seven named forms (scatter, heat-matrix, unit-ring,
  unit-grid, stacked-bars, treemap, stacked-area) carry theirs with the count and the ceiling named in the
  figure. The `seven forms in total` count is accurate.

## 9. EXHAUSTED APPROACHES (do not retry)

<!-- ANCHOR:exhausted-approaches -->
- Do not re-audit `checkDesignMdBlock` for a missing call site; the call site is `check-corpus.cjs:668`.
- Do not re-check the ceiling-notice count; all seven forms were read and carry it.
- Do not re-check whether CI runs the corpus gate; `.github/workflows/chart-corpus.yml` does.
<!-- /ANCHOR:exhausted-approaches -->

## 10. KNOWN CONTEXT

Bounded snapshot captured at init, before the first dimension ran.

| Pointer | Claimed behaviour to verify | Risk |
| --- | --- | --- |
| `SKILL.md` | template-first workflow, one colour system per artifact, 29 forms / 6 families, corpus validator before reporting | prose claims a check may not hold |
| `references/catalog.md` | machine-read index, both-direction resolution, `system` cell mirrors the file | hand-kept cells drift with nothing catching it |
| `references/color-system.md` | three systems + `design-md` adapter, gate table, enforced-vs-advisory split | gate list can disagree with the code |
| `references/design-md-theming.md` | the v3 parser, the role mapping, the gates before writing | second copy of the same gate set |
| `references/template-contract.md` | what a form must contain; the pointer contract per form | prose contract vs `pointer-contract-coverage` |
| `scripts/check-corpus.cjs` | 42 static families, no hardcoded inventory, no prose assertions | rules asserted but not enforced |
| `scripts/apply-design-md.cjs` | local input only, writes nothing until both themes pass, never touches stock forms | path guard, staged-write claim |
| `scripts/tests/corpus-mutations.test.cjs` | every family fails when its subject is broken | suite discoverability |
| `assets/style-reference/evilcharts/` | owns DESIGN.md, palettes.json, origin pins, proof sheets | reference-ownership rule reachable |
| `assets/templates/*.html` (29) | identity, palette block, empty notice, ceiling notices | per-form contract drift |

Out-of-scope for this lineage: the sibling `sk-design-diagram` packet, the hub identity files
(`mode-registry.json`, `hub-router.json`), and any implementation/remediation of the findings.

## 11. NEXT FOCUS

<!-- ANCHOR:next-focus -->
Cap reached after iteration 2. Synthesis consolidates 10 findings: four P1 (F001 documented design-md gates that do not exist, F002 the ungated `family` cell, F005 the removed `cursor` reference named in five places, F006 the playbook's twenty-one-form corpus) and six P2. Remediation order: F003 first because it is the only one touching a write path, then the statement defects, then the two inventory gaps, then the packet's own scaffold.
<!-- /ANCHOR:next-focus -->

## 12. CROSS-REFERENCE STATUS

| Protocol | Class | Status | Evidence |
| --- | --- | --- | --- |
| spec_code | core | partial | The packet's own documents state the binding rules; two of them (color-system gate list, catalog family cell) do not match the code. See F001, F002. |
| checklist_evidence | core | pending | The spec folder holds `acceptance-criteria.md`, `plan.md`, `tasks.md` and `implementation-summary.md` as unfilled Level-2 scaffolds; there is no checklist to verify against in iteration 1. |
| feature_catalog_code | overlay | partial | `references/catalog.md` is the feature catalog; both-direction id/file resolution is enforced (`check-corpus.cjs:2581`), the `family` and `question` cells are not (F002). |
| playbook_capability | overlay | pass | `manual-testing-playbook/manual-testing-playbook.md` plus its 9 scenario docs exist and route to the corpus check. |

## 13. FILES UNDER REVIEW

| File | Read | Notes |
| --- | --- | --- |
| `SKILL.md` | full | Claims under test: 29 forms / 6 families, one system per artifact, validator before reporting |
| `README.md` | not read | Iteration 2 |
| `references/README.md` | full | F004 |
| `references/catalog.md` | full | F002 |
| `references/color-system.md` | full | F001 |
| `references/design-md-theming.md` | full | F001 (the side that matches the code) |
| `references/template-contract.md` | partial (lines 1-350 via §ceiling/empty-notice) | Iteration 2 for the pointer table |
| `scripts/README.md` | full | Iteration 2 (discoverability of the proof suite) |
| `scripts/check-corpus.cjs` | partial (structure, palette/design-md/catalog/render/main) | Deliberately not read end to end; 3544 lines |
| `scripts/apply-design-md.cjs` | partial (args, gates, writer) | F001, F003 |
| `scripts/color-gates.cjs` | named only | Shared arithmetic, read by both |
| `scripts/tests/corpus-mutations.test.cjs` | partial (harness + mark-policy cases) | Iteration 2 |
| `scripts/tests/apply-design-md.test.cjs` | named only | Iteration 2 |
| `assets/style-reference/evilcharts/` | palettes.json grepped for gate names; DESIGN.md, origin.md, sheets, tokens.json listed | Iteration 2 for the colour bundle |
| `assets/templates/*.html` (29) | 7 read for the ceiling notice; the rest grepped | Iteration 2 for the inventory |
| `.github/workflows/chart-corpus.yml` | full | CI gate: corpus check + mutation suite |
