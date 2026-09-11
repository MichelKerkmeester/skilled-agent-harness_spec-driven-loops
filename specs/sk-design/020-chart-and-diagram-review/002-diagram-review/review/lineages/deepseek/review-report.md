# Review Report - sk-design-diagram packet

Iteration loop: `fanout-deepseek-1789150665859-r5otlp`, 2 iterations, executor `cli-pi` / `deepseek-v4.1-flash`, artifact directory `specs/sk-design/020-chart-and-diagram-review/002-diagram-review/review/lineages/deepseek`.

`resource_map_present` is `false` — the packet carries no `resource-map.md` — so the conditional `## Resource Map Coverage Gate` (canonical section 8) is not emitted and the report carries the nine core sections, numbered as the contract numbers them.

---

## 1. Executive Summary

- **Verdict: CONDITIONAL.**
- Active findings: **P0 = 0, P1 = 7, P2 = 5**. `hasAdvisories: true`.
- Stop reason: `maxIterationsReached` (cap 2, `stopPolicy: max-iterations`). The loop did not converge early and does not claim to: the severity-weighted new-findings ratio rose from 0.68 to 0.92, so the cap is what ended the run.
- Scope: the twelve checker families and their mutation suite, the corpus harness, both colour applicators, the 38 diagram forms, the style-reference bundle, and the reference documents of `.opencode/skills/sk-design/sk-design-diagram`. Not reviewed: the two Python import extractors, the ASCII validator, `benchmark/reports/**`, `screenshots/**`, 24 of 27 type references, and the seven manual-testing-playbook scenarios.
- What is strong and was verified rather than assumed: the corpus check is green (`38 files, 12 families, 0 errors`); the mutation suite genuinely requires every family to fire and enforces its own completeness; the `--default` identity property holds — all 38 forms reproduce byte for byte with 0 gate failures; the 38-form split (27 canonical + 7 variants + 4 starters), the 27 type references, the catalog's bidirectional coverage, the dot-pattern arithmetic in the style guide, and the twelve-family count are all accurate.
- What the P1s have in common: **a document promises more than the machinery performs.** Two of them (F001, F002) are code-level, one is a vacuous guard (F003), and four are claims about enforcement or about a metric (F006–F009). No security-relevant vulnerability was found in the packet's own code; the single security item (F005) is an unguarded delivery surface, not an exploit.

## 2. Planning Trigger

The verdict is CONDITIONAL because seven P1 findings remain active and no P0 was confirmed. Remediation routes to `/speckit:plan`; a changelog entry is only appropriate once F001–F003 and F006–F009 are resolved or explicitly accepted.

Two of the P1s change behaviour if fixed (F001, F003), four change what a reader is entitled to believe (F006, F007, F008, F009), and one is a data-model decision (F002) that the packet owner must take before the colour chain can be called closed.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First / Last seen | Status |
|----|----------|-----------|-------|----------|-------------------|--------|
| F001 | P1 | correctness | Applicator gates only the roles whose bytes changed, so a themed worked form can ship values its own gate would refuse | `scripts/apply-design-md.cjs:804-805,819-822,974`; `references/design-md-theming.md:210,220` | 1 / 2 | active |
| F002 | P1 | correctness | Token source's dark skin declares five roles while both colour documents declare ten; an undocumented dark value ships in a corpus form | `assets/style-reference/harness-diagram/diagram-palette.json`; `references/foundations/derivation-record.md:44-56`; `references/foundations/style-guide.md:37-48`; `assets/diagrams/sequence-oauth-dark.html` | 1 / 2 | active |
| F003 | P1 | correctness | `node-budget` asserts nothing on the shipped corpus yet reports 38 assertions | `scripts/families/node-budget.cjs:21-24`; `scripts/check-diagram-corpus.cjs:162-166`; `SKILL.md:196` | 1 / 2 | active |
| F004 | P2 | correctness | Recorded departure's `gate` field is never consulted, so one departure excuses another gate | `scripts/apply-design-md.cjs:685`; `scripts/apply-diagram-tokens.cjs:162`; `scripts/families/derivation-gates.cjs:80` | 1 / 2 | active |
| F005 | P2 | security | No check reaches inline JavaScript, `on*` handlers or `javascript:` URLs | `scripts/families/no-external.cjs:13`; `SKILL.md:237` | 1 / 2 | active |
| F006 | P1 | traceability | Theming contract documents `--forms` base names that do not exist, so the printed command fails | `references/design-md-theming.md:63,69,224`; `assets/diagrams/README.md:32`; `scripts/apply-design-md.cjs:881-892` | 2 / 2 | active |
| F007 | P1 | traceability | Derivation record claims the corpus check enforces applicator byte equality, and no checker path invokes an applicator | `references/foundations/derivation-record.md` §6; `scripts/check-diagram-corpus.cjs:27`; `references/design-md-theming.md:84-90` | 2 / 2 | active |
| F008 | P1 | traceability | Two of five series colours fall below the 4.5:1 gate the style guide says all five clear, and the roles are ungated | `references/foundations/style-guide.md:68`; `references/foundations/derivation-record.md:96-103`; `scripts/color-gates.cjs:44-50`; palette `gates.ungated` | 2 / 2 | active |
| F009 | P1 | traceability | Form-library index claims two rules the corpus check cannot hold | `assets/diagrams/README.md:30-31`; `scripts/check-diagram-corpus.cjs:9-13`; `scripts/families/derivation-gates.cjs:42` | 2 / 2 | active |
| F010 | P2 | maintainability | An unreachable exemption in the grid family | `scripts/families/grid-4px.cjs:54` | 2 / 2 | active |
| F011 | P2 | maintainability | Shared context exposes members no family reads; a collection name outlives the rule it described | `scripts/check-diagram-corpus.cjs:26,137-138`; `scripts/families/label-mask-clearance.cjs:133,167` | 2 / 2 | active |
| F012 | P2 | traceability | Technical checklist requires a hardcoded paper hex the style guide forbids | `SKILL.md:371`; `SKILL.md:267`; `references/foundations/style-guide.md:37-39`; `scripts/families/label-mask-clearance.cjs:38` | 2 / 2 | active |

Every entry above carries the claim-adjudication packet emitted in its iteration file (F001–F003 and F006–F009), with the same ID, evidence references, counterevidence sought, alternative explanation, final severity, confidence and downgrade trigger.

## 4. Remediation Workstreams

**Lane A — close the gate so the documented surface is the implemented one** (behaviour change; do first, because F002's fix depends on the same code)
1. F001 — feed `validateRoles` the derived skin's role set (or the roles the delivery actually paints) instead of `rendered.used`, or amend the theming contract to scope gating to repainted values. `scripts/apply-design-md.cjs:974`, `references/design-md-theming.md:210,220`.

**Lane B — decide the colour model, then make both documents and the source agree** (data decision)
2. F002 — add the five dark roles to `palette.skins.dark.roles`, or reduce `style-guide.md:37-48` and `derivation-record.md:44-56` to the five roles the source carries and record the two rgba literals in `sequence-oauth-dark.html` as roles.
3. F008 — state one metric for the series text-on-mark claim, re-measure the five values against it, and either gate the series roles that carry a label or drop the sentence. `references/foundations/style-guide.md:68`, `references/foundations/derivation-record.md:96-103`.
4. F004 — add gate equality to the departure match at all three reader sites, or delete the field and say a departure excuses the role.

**Lane C — stop the checks from overstating their coverage** (report semantics and coverage)
5. F003 — make the harness distinguish an asserted comparison from a per-file invocation, or tag the forms so the budget is measurable. `scripts/check-diagram-corpus.cjs:162-166`.
6. F009 — narrow the coverage sentence in the form-library index to the families that exist, and move the connector claim to the capture review.
7. F007 — either add the identity invocation to the corpus check or the test suite, or rewrite §6 of the derivation record to describe the manual procedure.
8. F005 — add a family that reports inline script, `on*` handlers and `javascript:` targets, or state in the delivery contract that inline script is permitted and why nothing checks it.

**Lane D — documentation corrections with no behavioural effect**
9. F006 — rename the four base names in the theming contract's argument table, example and transcript to `starter-*`.
10. F012 — rewrite the mask-fill checklist item to name the paper role instead of the light hex.
11. F010 — delete the unreachable rect clause in `grid-4px.cjs:54` or state the corner-radius exemption explicitly.
12. F011 — drop `crypto`, `templateDir` and `exampleDir` from the shared context, or document them as the extension surface; rename `short` in `label-mask-clearance.cjs:133`.

## 5. Spec Seed

The packet's spec should record the following minimal deltas:

- **Colour source of truth.** State that `assets/style-reference/harness-diagram/diagram-palette.json` is the only role table, and that the style guide and derivation record are prose about it. Today the dark skin exists in three places with two different role sets (F002), and two documents state a gate the palette declines to apply (F008).
- **Gate scope.** State whether the applicator gates the values it repaints or the palette a delivery ships (F001). The theming document currently says the latter and the code does the former.
- **Coverage semantics of the corpus check.** State that the families hold regex-expressible rules on the forms and that judgment-class rules (connector endpoints, overlap, focal balance, type fit) live in the capture review, then make every document that summarises the checker say the same thing (F003, F007, F009).
- **Delivery contract and JavaScript.** State whether an inline script is allowed in a delivery and which check, if any, inspects it (F005).
- **Starter naming.** One name for the four skin starters across every document and CLI example (F006).

## 6. Plan Seed

1. Fix F001 and add a regression that themes a worked form from a reference that moves only a ground, asserting the gate fires. `scripts/apply-design-md.cjs`, `scripts/tests/`.
2. Resolve F002 and F008 together in a single pass over `diagram-palette.json` plus the two documents; add a palette test that every role named in prose exists in a skin, and that every value in a skin is named in prose.
3. Re-run `node scripts/check-diagram-corpus.cjs` and the mutation suite after the pattern change; both are cheap and both must stay green.
4. Decide F003's report semantics in `check-diagram-corpus.cjs` (per-file invocation vs asserted comparison) before touching any family.
5. Correct F006, F007, F009, F012 as one documentation commit; each is a sentence or a name.
6. Sweep F010 and F011 with the same commit — both are deletions.
7. Add the identity invocation (F007) to the mutation suite rather than to the checker if the intent is to hold the corpus to the record, since the mutation suite already owns "proof that a green run means something".

## 7. Traceability Status

| Protocol | Level | Status | Gate | Evidence | Notes |
|----------|-------|--------|------|----------|-------|
| `spec_code` | core | **fail** | hard | `references/design-md-theming.md:69`; `references/foundations/derivation-record.md` §6; `scripts/apply-design-md.cjs:974` | F006 (a documented procedure cannot execute), F007 (an enforcement claim with no enforcing code), F001 (documented gate scope wider than implemented) |
| `checklist_evidence` | core | **partial** | hard | `SKILL.md:196,358-375`; `scripts/families/node-budget.cjs:24` | F003 (the budget item rests on a family with no signal on the shipped corpus) and F012 (the mask item hardcodes the light paper). The remaining technical items are either held by a family or stated as judgments |
| `feature_catalog_code` | overlay | pass | advisory | `feature-catalog/feature-catalog.md`; `scripts/check-diagram-corpus.cjs:162` | Twelve families in both, both derived from disk |
| `playbook_capability` | overlay | pass | advisory | `manual-testing-playbook/manual-testing-playbook.md`; `manual-testing-playbook/capture-review/capture-review.md:1` | Scenarios map to executable paths and to the same judgment band the checker's header names |
| `skill_agent` | overlay | notApplicable | advisory | — | Skill target with no runtime agent definition of its own |
| `agent_cross_runtime` | overlay | notApplicable | advisory | — | No agent surface under review |

Unresolved gaps: the hard `spec_code` failure means the packet's own documents and its code do not agree on three points; that is the reason the verdict is CONDITIONAL rather than PASS.

## 9. Deferred Items

- **Unreviewed surfaces** (recorded as frontier, not as findings): `scripts/drawio_extract.py` and `scripts/mermaid_extract.py` (the import path treats their input as untrusted and no family reads them); `scripts/validate-flowchart.sh` (the ASCII delivery gate); `benchmark/reports/**`; `screenshots/**`; 24 of 27 `references/types/type-*.md`; the seven `manual-testing-playbook` scenario files.
- **Advisory findings carried forward**: F004, F005, F010, F011, F012 — none blocks a delivery, all are cheap to close.
- **Disproved during the run** (do not re-raise): the `radial.html` basename exemption being unreachable; a dangling `url(#dots)` in `loop-terminal.html`; `isUrl` accepting a non-HTTP scheme; the dot-pattern arithmetic at `style-guide.md:169`; the inline-hex arithmetic at `style-guide.md:50`; multi-line tag parsing as a corpus defect.
- **Follow-up checks a resumed run should run first**: re-run the identity comparison if any palette or form changes; re-run the mutation suite after any family change; verify that a themed dark form can carry `paper-2`/`soft` once F002 is decided.

## 10. Audit Appendix

### Iteration table

| Run | Status | Focus | Dimensions | Files | New findings | Ratio | Duration |
|-----|--------|-------|------------|-------|--------------|-------|----------|
| 1 | complete | Checker families, harness, mutation suite, applicator and gates | correctness, security | 20 | P0=0 P1=3 P2=2 | 0.68 | ~23 min |
| 2 | complete | Enforcement claims, coverage statements, unreachable surface | traceability, maintainability | 14 | P0=0 P1=4 P2=3 | 0.92 | ~22 min |

### Convergence signal replay

Recomputed from the stored JSONL records only:

- Rolling average of the two ratios: (0.68 + 0.92) / 2 = **0.80**, against `rollingStopThreshold = 0.08` → vote CONTINUE.
- MAD noise floor: with two samples the ratios are not within a noise floor of each other → vote CONTINUE.
- Dimension coverage: 4 of 4 dimensions covered, aged one stabilization pass (`minStabilizationPasses = 1`) → vote STOP.
- Composite stop score = 0.30·0.80 + 0.25·1.0 + 0.45·1.0 = **0.94**, above the 0.60 gate → STOP not legal.
- P0 override: not triggered (no P0 was ever registered).
- Result: no legal STOP at any point; the run ended on the iteration cap, which is why the synthesis event carries `stopReason: "maxIterationsReached"` and the report does not claim convergence.

### Evidence ledger

| Artifact | What it establishes |
|----------|---------------------|
| `node scripts/check-diagram-corpus.cjs` output (read-only) | Baseline: 38 files, 12 families, 0 errors, `RESULT: PASSED`; per-family assertion counts used in F003 |
| `renderForm` over all 38 forms with `--default` (in memory) | The identity property holds: 38/38 byte-identical, 0 gate failures, 5 departure notes |
| `renderForm` + `validateRoles` on `sequence-oauth-dark.html` vs `starter-dark.html` with `probes/DESIGN.md` | F001: `used=[paper]`, 0 failures vs `used=[paper,ink,muted,accent,link]`, 5 failures — same reference, opposite outcomes |
| `run(['--default','--forms','template-full',…])` | F006: `diagram form does not exist: …/assets/diagrams/template-full.html` |
| `color-gates.cjs` contrast over the ten series values | F008: light series 3.49 / 4.56 / 2.90 / 4.53 / 5.58 against white |
| Greps over `assets/diagrams/**` | F003 (0 of 38 forms carry the budget tag), F002 (`#393e53`, `#8e98ac` in no file), F009 (dot-pattern non-users) |
| Greps over `scripts/**` requires | F007 (no family requires an applicator), F004 (three departure readers, none gating), F011 (unused shared context) |

`probes/DESIGN.md` in this directory is the input for the two probe rows. It is a review artifact: a copy of the carried reference with four colour rows changed. No file outside this lineage's directory was created or modified during the review, and no stock form was touched.

### Coverage matrix

| Surface | Reviewed | How |
|---------|----------|-----|
| `scripts/check-diagram-corpus.cjs`, `color-gates.cjs` | complete | Read; harness executed read-only |
| `scripts/apply-design-md.cjs` (1033 lines) | complete for derivation, gates, render and write paths | Read; derivation, gating and rendering executed in memory; the `--out` write path read but not executed (it would write outside this lineage) |
| `scripts/apply-diagram-tokens.cjs` | partial | Derivation reuse and gate call read; CLI path not executed |
| 12 families + `grid-baseline.json` | complete | Read; each family's signal checked against the corpus |
| `scripts/tests/*` | complete, not executed | Read; the suite writes package copies under the system temp directory, outside this lineage's write surface |
| `assets/diagrams/**` (38 forms) | partial | All 38 parsed by the checker and by `renderForm`; 4 read in detail |
| `assets/style-reference/**` | complete | Palette dumped programmatically; DESIGN.md parsed on every probe run; README read |
| `references/**` (except types) | complete for the colour and enforcement documents | Read |
| `references/types/**` (27) | partial | 3 read; counts verified mechanically |
| `SKILL.md`, `README.md` | complete | Read |
| `feature-catalog/`, `manual-testing-playbook/` | partial | Overlay protocol scope only |
| `benchmark/**`, `screenshots/**`, `scripts/*.py`, `scripts/validate-flowchart.sh` | not reviewed | Declared non-goal |

Review verdict: CONDITIONAL
