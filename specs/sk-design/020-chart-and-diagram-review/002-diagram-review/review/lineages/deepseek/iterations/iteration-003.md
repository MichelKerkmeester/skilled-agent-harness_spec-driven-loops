# Iteration 003: Coverage and proof quality of the mutation suite and the twelve families

## Focus

- Dimensions: **D5 Coverage**, **D6 Test quality**
- Scope: the standing proof itself (`scripts/tests/corpus-mutations.test.cjs`, `scripts/tests/mutation-cases.cjs`, `scripts/tests/fixtures/`), the harness that feeds it (`scripts/check-diagram-corpus.cjs`, especially the `--extra` path and the `origin` link), all twelve family modules re-read as detectors, `scripts/families/grid-baseline.json`, the documents that declare the checker's reach (`SKILL.md` §4, `references/foundations/style-guide.md`, `assets/diagrams/README.md`, `scripts/README.md`, the capture-review playbook) and the packet's own review artifacts.
- Files reviewed: 30 (the 12 families; `check-diagram-corpus.cjs`; `corpus-mutations.test.cjs`; `mutation-cases.cjs`; `tests/fixtures/design-md-sample.html`; `grid-baseline.json`; `scripts/README.md`; `assets/diagrams/README.md`; `SKILL.md`; `references/foundations/style-guide.md`; `references/catalog.md`; `manual-testing-playbook/capture-review/capture-review.md`; `deep-review-config.json`; `deep-review-strategy.md`; `deep-review-findings-registry.json`; `review-report.md`; iterations 001 and 002; `acceptance-criteria.md`).
- Note on the loop's own contract: `deep-review-config.json` sets `maxIterations: 2` with `stopPolicy: max-iterations` and the strategy marks all four declared dimensions complete. This pass therefore sits outside the configured loop; it was commissioned with its own dimensions and is reported as such. The verdict below is about the packet, not a claim that the stopped loop resumed.
- Measurement, not inference. Re-run at the start: `node scripts/check-diagram-corpus.cjs` prints `Diagram corpus: 38 files, 12 families` … `RESULT: PASSED`, exit 0, with per-family assertion counts 304/101/54/38/820/18/98/62/38/38/164/181; `node --test scripts/tests/` prints `tests 19`, `pass 19`, `fail 0`. Beyond that, every claim about a family's reach was recomputed by requiring the shipped harness exports and the shipped family modules and running each family per file (per-file assertion counts below), and the two P1s are demonstrated with `--extra` runs against files written to a system temp directory. Nothing under `.opencode/` was written.

## Scorecard

- Dimensions covered: coverage, test quality
- Files reviewed: 30
- New findings: P0=0 P1=2 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.56 (severity-weighted: `(5·P1 + 1·P2 + 10·P0) / 25`; 14/25)

## Findings

### P0, Blocker

None. The two P1s are a demonstrable false failure (F013) and a rule whose detector is narrower than the rule text and narrower than the suite's proof claims (F014). Neither lets a broken corpus run report `RESULT: PASSED` on the shipped 38 forms; both change what a new delivery may ship with a green run.

### P1, Required

- **F013**: The ancestor stack that decides decoration and exemption in three families pops on every closing tag, including leaf elements it never pushed, so a decorative group stops being exempt partway through a document and a legitimate delivery is failed, `scripts/families/orthogonal-connectors.cjs:65,82`, `scripts/families/label-mask-clearance.cjs:139,169`, `scripts/families/grid-4px.cjs:48,64`; demonstrated with an extra written to a temp directory. (dimension: coverage, test quality)
  - All three families push only when the tag is not self-closing and not a leaf (`if (match[4] !== '/' && !LEAF.has(tag)) open.push(…)`) but pop on any closing tag (`if (closing) { open.pop(); continue; }`), and `LEAF` contains `text` and `tspan`, so the matching `</text>` removes the enclosing `<g>` from the ancestor set.
  - Observed: `--extra` over a two-group file where both groups are `<g aria-hidden="true">` and both hold a marker-bearing diagonal path — the group preceded by a `<text>` is reported (`FAIL [orthogonal-connectors] --extra/stack2.html: path "M20 20 L80 80" turns with a diagonal L segment to 80,80`) and the identical second group is not. Nothing in the markup changes the drawing; the only difference is the leaf close before the first connector. That contradicts the family's own stated intent, `orthogonal-connectors.cjs:18-24` ("Radial layers, icons and decoration groups draw their angles on purpose and may carry that mark themselves").
  - Why it matters: the failure names the path, so the reader cannot see that the cause is a `<text>` sibling above it, and reordering the markup is the only workaround. `label-mask-clearance.cjs:160` feeds the same stack to `decorated(open, attrs)`, so the same false-positive mechanism can also judge a connector the mask family should have skipped, and `grid-4px.cjs:49` uses it for its `text`/`tspan`/`pattern` exemption.
  - No case can reach it: all 14 file cases patch one attribute value or insert a sibling inside a single tag (`mutation-cases.cjs:11-66`) and the two package cases edit a frontmatter line and a table cell (`mutation-cases.cjs:70-83`), so no case ever gives a family a nested structure or an ancestor to look at. The harness's own contract, "every case here breaks one thing and expects one named family to say one specific thing about it" (`corpus-mutations.test.cjs:3-11`), holds for the patches but says nothing about the machinery they run through.
  - Change: pop only for the element actually on top of the stack (store the tag with each frame and pop on a match, or push leaf tags so open/close balance), apply the same fix in all three families, and add one case whose patch nests a connector inside a decorated group. A traversal helper in `shared` would be the smaller change, since three families re-implement it.
- **F014**: The 4px grid family measures geometry only in four attribute sets plus a `g` translate, so off-grid coordinates carried by a path or a polygon are neither measured nor declared exempt, and the family's single case proves only the representation it reads, `scripts/families/grid-4px.cjs:24-29,52-57`, `scripts/tests/mutation-cases.cjs:28-31`. (dimension: coverage, test quality)
  - `GEOMETRY` is `rect x/y/width/height`, `circle cx/cy`, `ellipse cx/cy/rx/ry`, `line x1/y1/x2/y2`; `EXEMPT_SUBTREE` is `text`, `tspan`, `pattern`, and the family's signed exemption comment names text, the dot tile, a rect corner radius and stroke weights (`grid-4px.cjs:22-23`, `:4-7`). Path `d` and polygon/polyline `points` appear in neither list, so they are silent rather than exempt.
  - The rule as stated to the author has a closed exemption list: "**4px grid (non-negotiable):** layout values — node dimensions …, x/y coordinates, gaps …, padding …, radius … — divisible by 4. Exempt: stroke widths, opacity, dot pattern, font sizes" (`SKILL.md:195`), repeated as ALWAYS 4 (`SKILL.md:266`), and `style-guide.md:123` ("Every coord, size, and gap is divisible by 4 (hard rule)"). The checker's own scope note (`check-diagram-corpus.cjs:9-13`) and the playbook's copy of it (`capture-review.md:19-27`, `manual-testing-playbook.md:337`) list what is not held and do not mention this either.
  - Observed, in the scenario the family itself calls new work (a file no baseline entry covers, `grid-4px.cjs:79-83`): a copy of `assets/diagrams/layers.html` with `<path d="M13 0 H17 V4"/>` inserted yields **0** grid failures, while the same off-grid value as `<rect x="13" y="0" width="4" height="4"/>` yields **1** (`rect carries x=13 off the 4px grid`). `layers.html` is the form the suite's own grid case uses, and it is not in the baseline.
  - The unchecked representations are the corpus's own idiom: 136 `<path>` elements and 76 `<polygon>` elements across the 38 forms, including every connector in `high-level.html` (`:110-151`). A new delivery that draws its connectors and shapes as paths can ship off-grid coordinates and still print `RESULT: PASSED`.
  - Change: decide the answer once — either measure `d`/`points` (they are the same layout values the `line` branch already measures) or add path and polygon geometry to the exemption sentence in `SKILL.md:195` and to the checker's scope note — and add a case for whichever answer is chosen. Two cases, one per representation, would make the boundary visible.

### P2, Suggestion

- **F015**: The `origin` link that decides an extra delivery's kind and baseline is exercised by no case, so the ratchet branch and the starter exemption are proven by nothing, `scripts/tests/corpus-mutations.test.cjs:52,57`, `scripts/check-diagram-corpus.cjs:151-154`. (dimension: coverage)
  - Every file case writes its copy as `mutant.html`, a name no corpus form has, so each one is read as new work (`kind='extra'`, `originLabel=null`); the basename lookup at `:151` and the kind inheritance at `:154` are never reached by the suite. Two behaviours hang off that lookup, and both were observed to depend on the *name* rather than the bytes:
    - `grid-4px.cjs:77-86` — the same mutated `architecture.html` (five added off-grid rects) is reported as one failure, `13 off-grid values against a recorded baseline of 11`, when the extra is named `architecture.html`, and as seven per-offender failures when the identical bytes are named `architecture-delivery.html`.
    - `derivation-gates.cjs:40-42` / `marker-vocabulary.cjs:41-42` — `starter-light.html` with its palette block stripped fails derivation-gates when the extra carries the form's basename, and passes silently as `mutant.html`.
  - Why it matters: the ratchet is the only rule between a legacy form and a regression, and it protects the 24 baselined entries in `grid-baseline.json`; the branch that computes it has never been shown to fire. The completeness guard rejects a family with no case (`corpus-mutations.test.cjs:135-138`) but counts families, not branches, so a second, unexercised rule inside a covered family is invisible to it — which is also the shape of F010 in the same file.
  - Supporting: `grid-4px.cjs:13` states "34 of its 38 files sit off it", while the baseline it owns lists 24 files and a live recount of all 38 gives 24 (and two entries carry slack: `architecture.html` 11 recorded against 8 live, `flowchart.html` 4 against 2). The baseline is hand-kept and nothing measures its drift.
  - Change: add a file case that keeps its extra's basename (the harness supports it), one that asserts the new-work branch, and a case for the starter kind; the existing case can stay as the new-work half.
- **F016**: Two case expectations cannot pin the rule they name — the accessibility case is named for a rule it does not exercise and its regex is satisfied by six of the family's seven messages, and the catalog case's regex matches all three of its failures while carrying an alternative that can never match, `scripts/tests/mutation-cases.cjs:12-15,77-82`. (dimension: test quality)
  - `mutation-cases.cjs:12-15` is named "a diagram whose svg has no title" but the patch renames the `<title>` element's id; the observed failure is the dangling-reference message (`aria-labelledby names "architecture-title" and no element in the file carries that id`). The rules the name claims — first child not `<title>`, and an empty `<title>` — live at `accessible-svg.cjs:66` and `:69` and are exercised by nothing, in the suite or on the green corpus. `expect: /aria-labelledby|title/` is satisfied by `accessible-svg.cjs:46,56,59,66,69,75` — six of the family's seven messages — so the case would still pass if it stopped testing the branch it currently exercises.
  - `mutation-cases.cjs:77-82` replaces the canonical cell in `references/catalog.md:20`, which produces three failures: the missing-canonical rule, the file-exists rule the case is named for, and the indexing rule. `architecture` matches all three, so the case cannot tell them apart, and `example-gone\.html` has no counterpart anywhere in the packet (`find . -name 'example-*.html'` is empty; the corpus uses canonical names since the library merge).
  - Change: tighten each expectation to a phrase unique to the intended rule (`no element in the file carries that id`, `which does not exist`), rename the accessibility case after what it does, and add the missing-title case it claims.
- **F017**: The third guard test cannot fail while the exemption map is empty, `scripts/tests/corpus-mutations.test.cjs:125,146-150`. (dimension: test quality)
  - `NEEDS_AN_EYE` is `{}`, so `Object.keys(NEEDS_AN_EYE).filter(…)` is `[]` for every possible input and `assert.deepEqual([], [])` is a tautology — it proves nothing today. The map's emptiness itself was already used as evidence about node-budget in iteration 1 (F003); the new point is the shape of the test.
  - The mechanism is otherwise honoured: the coverage test still filters on `!NEEDS_AN_EYE[f]`, so an exemption would excuse a family from coverage if one were ever recorded.
  - Change: delete it until the map has an entry, or fold the staleness check into the coverage test with the reason string asserted non-empty. The suite's header calls a test that asserts nothing a defect (`corpus-mutations.test.cjs:6-11`), which is the standard to hold this one to.
- **F018**: The folder's own README reports the checker half of the folder as untested, `scripts/README.md:27-29,93-95`. (dimension: coverage)
  - The Key Statistics table says `Code files | 3` and `Test suites | 0 (no committed regression suite yet)`, and §7 repeats "No committed regression suite exists for this folder yet", while `scripts/` ships sixteen checker modules (four at the folder root plus twelve families) and `scripts/tests/` holds a 19-test suite observed passing in this run. §3 `STRUCTURE` lists only the three import/export paths.
  - Why it matters: this is the only code-facing index a maintainer lands on, and the packet has been through a metadata family that exists precisely because "the skill says one thing about itself in several places" (`metadata.cjs:3-5`). The checker is documented elsewhere (`SKILL.md:35`, `references/design-md-theming.md:276`, `capture-review.md:155`), so the reader who starts here is the one who is misled.
  - Change: either extend §3/§7 and the statistics to the checker and its suite, or state the file's scope as the extractors only and point to `check-diagram-corpus.cjs`'s header for the rest.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `SKILL.md:195,266`; `references/foundations/style-guide.md:123` vs `scripts/families/grid-4px.cjs:24-29,52-57` | F014 — the rule's exemption list is closed and the checker's is not; demonstrated with two `--extra` runs |
| spec_code | partial | hard | `scripts/tests/corpus-mutations.test.cjs:3-11,52,57` vs `scripts/check-diagram-corpus.cjs:151-154`; `grid-4px.cjs:77-86` | F015 — the suite's stated proof is per family and never reaches the branch that decides a delivery's obligations |
| checklist_evidence | partial | hard | `SKILL.md:288-296` and `orthogonal-connectors.cjs:18-24` vs the `--extra` run in F013 | F013 — a deliverable that satisfies the exemption the family declares is failed by the family |
| feature_catalog_code | pass | advisory | `feature-catalog/feature-catalog.md:48` vs `scripts/families/` (12 modules on disk) | The catalog's design-system entry names the 4px grid as a rule of the system, which is accurate as a statement of the rule; F014 is about the checker's reach, not the catalog's wording. No drift found in what was checked. |
| playbook_capability | partial | advisory | `manual-testing-playbook/capture-review/capture-review.md:19-27`; `manual-testing-playbook/manual-testing-playbook.md:337` | The scenario quotes the checker's scope note and makes its two bullets the scenario's charter; the note omits path and polygon geometry, so the judged read inherits the same blind spot F014 records. Supporting evidence, not a separate finding. |

## Assessment

- New findings ratio: 0.56
- Dimensions addressed: coverage, test quality
- Novelty justification: the suite is largely sound, and that is what keeps the ratio at 0.56 rather than a defect count. The two P1s are demonstrated, not argued: F013 with a two-group file where only the text-preceded group is failed, F014 with the same off-grid value in two representations, one caught and one silent. F015 is demonstrated twice by name-swapping the same bytes. F016 is demonstrated by running both cases and reading the messages against the regexes. F017 and F018 are read-level claims with no behaviour to run.
- Explicitly not re-reported, after re-reading the earlier iterations and re-deriving the underlying facts where they were cheap to re-derive: F003 (per-file recount confirms `node-budget` is 38 invocations over 0 tagged elements — unchanged), F010 (the dead `rx/ry` clause in `grid-4px.cjs:54` is a different line and a different mechanism from F014's missing geometry table), F011 (unused shared-context members), F007 (no checker path invokes an applicator), F009 (`assets/diagrams/README.md:29-31` coverage list), F012 (the checklist hex). Where my material sits next to one of those, the finding says so.
- What was checked and found clean: both label-mask detection signals are exercised by a case (the named class through `it-state.html` and the shaped ground-fill-plus-label through `flowchart.html`), so the family the loop widened has the suite's best coverage; `legend-fidelity`'s class-resolution path is live on the corpus rather than dead code (`dp-integration.html:11` carries `.connector.trigger`/`.connector.auth` dashes, `it-state.html:30` the `svg .node.external` rule); the harness refuses a case whose patch anchor is missing, whose mutation changes nothing, or whose base already fails the family, and the corpus is asserted green before any case runs (`corpus-mutations.test.cjs:45-48,54-55,105-107`) — all read and confirmed live; the guard that a case may not name a family the checker does not register, and the guard that every registered family has a case, both compare two derived sets and can fail; the per-file assertion counts of `derivation-gates` (4/38), `label-mask-clearance` (15/38), `legend-fidelity` (13/38), `orthogonal-connectors` (19/38) and `marker-vocabulary` (20/38) are each explained by the trigger the family declares in its own header, so silence there is the stated design and not a coverage finding.
- Dead ends: an attempt to show the corpus itself carries off-grid layout coordinates in paths — the off-grid `d` values in `high-level.html:164` and `it-state.html:54` are icon glyphs inside `<symbol>` at a 16/24-unit viewBox, not layout values, which is why F014 is written about the checker's reach rather than a live violation. Also dropped: the `<polyline>` variant of the connector blind spot (0 of the corpus's 3 polylines carry a marker or connector class, so it is not a live gap), and the `34 of its 38` comment as a standalone finding (folded into F015).

### Claim adjudication

```json
{
  "findingId": "F013",
  "claim": "The ancestor set that decides decoration and exemption pops on leaf closings it never pushed, so a decorative group loses its exemption partway through a file and a legitimate connector is failed by a family whose comment declares that group exempt.",
  "evidenceRefs": [
    "scripts/families/orthogonal-connectors.cjs:65,82",
    "scripts/families/orthogonal-connectors.cjs:18-24",
    "scripts/families/label-mask-clearance.cjs:139,169,160",
    "scripts/families/grid-4px.cjs:48,64",
    "scripts/tests/mutation-cases.cjs:11-83"
  ],
  "counterevidenceSought": "Checked whether the pop was intended as 'last opened ancestor' — the stack is only ever read through `open.some(ancestor => carrier(ancestor))`, so an exact set is what the predicate needs and a mis-pop can only remove exemption, never add it. Checked whether the corpus already trips it (it is green, so it cannot), and whether the demo's failure could come from the second group (the flagged path is the text-preceded one: M20 20, not M30 30, when the two are made distinct). Checked the alternative that a leaf push would double-count: leaves are never pushed and no code reads the stack for leaf semantics.",
  "alternativeExplanation": "The `<text>` may have been intended as the end of its group rather than a sibling inside it, in which case the pop is accidentally right for that file. Rejected: the demonstration keeps both groups well-formed and identical apart from the text, and the predicate is evaluated on the path, which is inside the group by any reading.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If a fix pops only on a matching non-leaf close (or pushes leaves) and a case with a decorated group joins the suite, this becomes a record of a fixed defect. If the exemption predicate is redefined to not use ancestors, downgrade to P2.",
  "transitions": [{ "iteration": 3, "from": null, "to": "P1", "reason": "Found while checking whether other families share the label-mask rule's blind-spot shape; demonstrated with an --extra run" }]
}
```

```json
{
  "findingId": "F014",
  "claim": "The 4px grid family measures four attribute sets plus a g translate, so path and polygon geometry is neither measured nor declared exempt, and the family's single mutation case proves only the rect representation.",
  "evidenceRefs": [
    "scripts/families/grid-4px.cjs:22-29",
    "scripts/families/grid-4px.cjs:52-57",
    "scripts/families/grid-4px.cjs:79-86",
    "scripts/tests/mutation-cases.cjs:28-31",
    "SKILL.md:195",
    "SKILL.md:266",
    "references/foundations/style-guide.md:123",
    "scripts/check-diagram-corpus.cjs:9-13",
    "manual-testing-playbook/capture-review/capture-review.md:19-27"
  ],
  "counterevidenceSought": "Looked for the exemption in every place that declares the checker's scope (family comment, checker header, SKILL.md rule, style guide, capture review, diagrams README): none names path or polygon geometry. Ran the two representations through the real checker as extras and read the failures; confirmed `layers.html` is absent from grid-baseline.json, so both runs took the new-work branch the rule binds outright. Checked whether paths might be non-layout by nature: the corpus's connector paths carry the same coordinates its lines do, and the family already measures line endpoints, so the distinction cannot be position-vs-shape.",
  "alternativeExplanation": "Paths may be exempt by design because a chart series or an icon glyph legitimately carries data-space coordinates, and the corpus's off-grid path values are all icon glyphs at a different viewBox. That reading is plausible for charts and icons, but it is nowhere stated, and it does not cover a connector drawn as a path, which is the corpus's own idiom — so the defect is the undeclared and unbounded scope, not the decision to exempt some path geometry.",
  "finalSeverity": "P1",
  "confidence": 0.76,
  "downgradeTrigger": "If SKILL.md's exemption sentence (or the checker's scope note) names path and polygon geometry as out of the grid family's reach — or the family measures them — downgrade to P2, keeping the case-coverage half.",
  "transitions": [{ "iteration": 3, "from": null, "to": "P1", "reason": "Found by auditing each family's detector against the rule its document states; demonstrated by two --extra runs" }]
}
```

## Ruled Out

- **Reporting the raw per-family silence as a finding**: recomputing assertions per file shows `derivation-gates` silent on 34 of 38 forms, `label-mask-clearance` on 23, `legend-fidelity` on 25, `orthogonal-connectors` on 19 and `marker-vocabulary` on 18 — and every one of those is the trigger each family's header declares ("Only a starter must carry a block", "a file with no legend marker … asserts nothing, which is not a violation", "a line that does neither is a trend line"). Not reported except where the trigger is the defect (F014).
- **`validate-flowchart.sh`, `drawio_extract.py`, `mermaid_extract.py` as coverage targets**: outside this pass's scope and named as a non-goal by the strategy; not opened.
- **The `label-mask-clearance` shape heuristic (`GROUND_FILL`, the ≤24×≤240 cap, the pending-text adjacency) as an undocumented blind spot**: the file records its own blind spot at `:18-19` and the two heuristics are exercised by the two shipped cases; a rect that fails the cap is a band, and the code says so. Not reported; F014 is the family where the same silence is unrecorded.
- **`metadata`'s single case (a version outside the anchor era) leaving its other four branches unproven**: the branches are one-line claims about `SKILL.md` (`sk-design hub`, one `aria-labelledby` statement) and the case-per-branch rule the suite's comment states is only met by `derivation-gates` and `label-mask-clearance` anyway. Noted here rather than filed, to avoid a padded section.
- **The two cases' use of `String.replace` on the first occurrence only**: verified benign for every case (the anchors are unique or the first match is the intended one — `references/catalog.md:20` is the canonical cell). No finding.

## Recommended Next Focus

- None: this pass was commissioned after the configured cap and closes its own two dimensions.
- If the loop continued, the highest-value targets are (a) a rule-level audit of the two detectors whose reach this pass did not measure — `legend-fidelity`'s legend markers (the eyebrow is matched case-sensitively at `legend-fidelity.cjs:19`) and `marker-vocabulary`'s property form, which reads `marker-start|mid|end` but not the `marker` shorthand; (b) the capture review's six reads re-read now that the scope list they quote is known to be incomplete (F014); (c) the seven playbook scenarios and the two Python extractors, neither of which any iteration in this lineage has opened.

Review verdict: CONDITIONAL
