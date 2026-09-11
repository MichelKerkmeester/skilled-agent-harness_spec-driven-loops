# Iteration 001: Correctness and Security of the diagram packet's executable core

## Focus

- Dimensions: **D1 Correctness**, **D2 Security**
- Scope: the twelve checker families under `scripts/families/`, the harness `scripts/check-diagram-corpus.cjs`, the mutation suite `scripts/tests/`, and the DESIGN.md applicator `scripts/apply-design-md.cjs` (derivation, gating, write path). Measurement was taken by executing the shipped modules in memory (`deriveReference`, `renderForm`, `validateRoles`, `color-gates.cjs`) against a probe reference written to `probes/DESIGN.md` in this lineage; nothing under `.opencode/` was written.
- Files reviewed: 20 (`scripts/check-diagram-corpus.cjs`, `scripts/color-gates.cjs`, `scripts/apply-design-md.cjs`, `scripts/apply-diagram-tokens.cjs`, 12 × `scripts/families/*.cjs`, `families/grid-baseline.json`, 2 × `scripts/tests/*.cjs`, `assets/style-reference/harness-diagram/diagram-palette.json`, `assets/diagrams/sequence-oauth-dark.html`, `assets/diagrams/starter-dark.html`, `assets/diagrams/loop-terminal.html`, `assets/diagrams/layers.html`).

Baseline established before any finding: `node scripts/check-diagram-corpus.cjs` prints `Diagram corpus: 38 files, 12 families` … `Summary: errors: 0` / `RESULT: PASSED`, and the identity property the theming contract rests on holds — `renderForm` over all 38 forms with `--default` returns 38 byte-identical outputs, 0 gate failures, 5 departure notes.

## Scorecard

- Dimensions covered: correctness, security
- Files reviewed: 20
- New findings: P0=0 P1=3 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.68 (severity-weighted: `(5·P1 + 1·P2 + 10·P0) / 25`, bounded at 1.0; 17/25)

## Findings

### P0, Blocker

None. Two candidate P0s were raised and downgraded after adversarial self-check (see `## Ruled Out`): the false-PASS in F001 has a stated precondition and an alternative reading that survives in part, and F002 is a governance contradiction whose current corpus outcome is unaffected.

### P1, Required

- **F001**: The applicator's gate surface is the set of values that *changed*, not the palette the delivery ships, so a themed worked form can ship values its own gate would refuse, `scripts/apply-design-md.cjs:974`, reproduced with `probes/DESIGN.md`. (dimension: correctness)
  - `remapLiterals` returns the original literal **before** recording the role (`apply-design-md.cjs:804` precedes `:805`), and it is the only contribution a block-less form makes to `used` (`:819-822`). `validateRoles(derived, skin, rendered.used, form)` (`:974`) then gates that list alone, while `references/design-md-theming.md:220` states "Every selected form's full palette is derived and gated in memory before any file is written" and `:210` states the gates apply to `accent` "and every other gated role against its own ground".
  - Observed, one reference, two forms, no writes: with `probes/DESIGN.md` (only the dark ground moved, `Night #d9d9d9`), `sequence-oauth-dark.html` yields `used=[paper]`, **0 gate failures**, and an output that still carries `#f5f5f5` ink (1.29:1 against the declared ground) and `#f08a59` accent (1.75:1, gate 3.0); `starter-dark.html` from the *same* reference yields `used=[paper,ink,muted,accent,link]` and **5 gate failures** (`ink 1.29<4.5; muted 1.29<4.5; accent 1.75<3; accent 1.75<4.5; link 2.16<3`), so the run is refused. Identical reference, opposite verdicts, decided only by whether a form carries a palette block.
  - Impact: under `--all` a reference that moves a ground while leaving a role at its stock value writes a delivery whose contrast was never measured, and reports `RESULT: PASSED`. The block path is unaffected (a block declares every role it paints, so `substituteBlock` records them all — `:746-753`), which is why the corpus is green and the gap is invisible from the shipped forms.
- **F002**: The token source's dark skin declares five roles while both colour documents declare ten, and one dark value that is in no role table ships in a corpus form, `assets/style-reference/harness-diagram/diagram-palette.json` (skins.dark), `references/foundations/style-guide.md:37-48`, `references/foundations/derivation-record.md:44-56`, `assets/diagrams/sequence-oauth-dark.html`. (dimension: correctness)
  - Measured role set: `skins.dark.roles` = `paper, ink, muted, accent, link`. The derivation record's §3 DARK table also declares `paper-2 #393e53`, `soft #8e98ac`, `rule rgba(245,245,245,0.12)`, `rule-solid rgba(191,192,192,0.25)`, `accent-tint rgba(240,138,89,0.10)`; the style guide's dark column repeats `paper-2` and `soft`.
  - `#393e53` and `#8e98ac` occur in **no** file under `assets/diagrams/` (grep). `rgba(240,138,89,0.10)` and `rgba(245,245,245,0.12)` occur only in `sequence-oauth-dark.html`, which carries no palette block — the checker returns early for such a file (`scripts/families/derivation-gates.cjs:42`) and the applicator's literal map is keyed on stock source values only (`apply-design-md.cjs:764-777`), so neither value is attributable to a role, refused, repainted or measured.
  - Consequence in the other direction: a *themed* dark block that declares the documented `--color-paper-2` or `--color-soft` is an error at `derivation-gates.cjs:73` ("role … is not in the … skin"). The documented role vocabulary and the enforcing source disagree, so the record's own §6 claim that "the applicator regenerates every form from the values in this record" cannot hold for those five roles.
- **F003**: The `node-budget` family is vacuous across the shipped corpus — no form carries the attribute the family counts — yet the run reports 38 assertions against it, `scripts/families/node-budget.cjs:21-24`, `scripts/check-diagram-corpus.cjs:162-166`. (dimension: correctness)
  - `grep -l 'data-diagram-node\|data-diagram-arrow' assets/diagrams/*.html` returns **no files** (0 of 38), and the counts are 0 in every form. `node-budget.cjs` compares those counts to `NODE_BUDGET = 9` / `ARROW_BUDGET = 12` and can only record when a count *exceeds* them, so all 38 per-file assertions are unfalsifiable on this corpus. `tally(NAME, 1)` is called unconditionally per file (`:24`), which is what makes the summary line read as coverage.
  - The underlying rule is user-facing and non-negotiable: `SKILL.md:196` "**Complexity budget:** max 9 nodes, 12 arrows/transitions", `SKILL.md:358` "Within the complexity budget?", and the mutation suite proves the family *can* fire (`scripts/tests/mutation-cases.cjs:36-39` adds tagged rects). So the family is live for new work and inert for the 38 forms the skill tells a user to copy — the corpus check's own doctrine ("a checker that is only ever run on a green corpus proves nothing about its own assertions") applies to this family with no stated exemption, and `NEEDS_AN_EYE` (`corpus-mutations.test.cjs:125`) is empty.

### P2, Suggestion

- **F004**: The recorded departure's `gate` field is never consulted, so a departure recorded against one gate also excuses another, `assets/style-reference/harness-diagram/diagram-palette.json` (departures[0].gate = `markOnPaper`), `scripts/apply-design-md.cjs:685`, `scripts/apply-diagram-tokens.cjs:162`, `scripts/families/derivation-gates.cjs:80`. (dimension: correctness)
  - All three readers match on `skin` + `role` + `round2(measured) === ratio` only. Observed in this run: `DEPARTURE light accent 2.86:1 below textOnMark 4.5` — an excuse printed for `textOnMark` by a record whose own `gate` names `markOnPaper`. Impact is currently nil in the applicator (a themed accent must clear `markOnPaper` to be selected at all, `apply-design-md.cjs:375-392`), but the field that exists to discriminate is dead data and the hand-written-block path keeps the weaker match.
- **F005**: Nothing inspects inline JavaScript, event-handler attributes, or `javascript:` URLs, `scripts/families/no-external.cjs:13-14`, `SKILL.md:237`. (dimension: security)
  - `SCRIPT_BODIES` deliberately blanks script bodies before the remote-reference scan, and no other family reads `<script>`, `on*=` or a `javascript:` target (family inventory: accessible-svg, unique-ids, no-external, marker-vocabulary, metadata, node-budget, grid-4px, orthogonal-connectors, legend-fidelity, label-mask-clearance, catalog-bidirectional, derivation-gates). The delivery contract is "one self-contained `.html` file … with no required JavaScript" (`SKILL.md:237`) and "no JS required" (ALWAYS 7), which permits an inline script by the letter. The corpus itself carries none (grep: 0 files with `<script`), so this is an unguarded surface rather than a present defect; the applicator copies bytes through (`apply-design-md.cjs:811-847`), so a themed delivery inherits whatever the source form carries.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `references/design-md-theming.md:210,220` vs `scripts/apply-design-md.cjs:804-805,974` | F001 — the documented gate scope is wider than the implemented one, demonstrated |
| checklist_evidence | partial | hard | `SKILL.md:196,358` vs `scripts/families/node-budget.cjs:21-24` | F003 — the stated budget rule has no falsifiable check on the shipped corpus |
| feature_catalog_code | pending | advisory | `feature-catalog/feature-catalog.md` | deferred to iteration 2 (D3) |
| playbook_capability | pending | advisory | `manual-testing-playbook/manual-testing-playbook.md` | deferred to iteration 2 (D3) |

## Assessment

- New findings ratio: 0.68
- Dimensions addressed: correctness, security
- Novelty justification: every finding is anchored to a line that was read and, where the claim is behavioral, to output produced in this session (38/38 identity run; the two-form gate comparison; the baseline corpus run). F001 and F002 were both written as candidate P0s first and reduced after the counterevidence pass below.

### Claim adjudication

```json
{
  "findingId": "F001",
  "claim": "A themed worked form is gated only on the roles whose literal bytes changed, so a reference that is refused on a starter can pass on a block-less form and write a delivery whose contrast was never measured.",
  "evidenceRefs": [
    "scripts/apply-design-md.cjs:804-805",
    "scripts/apply-design-md.cjs:819-822",
    "scripts/apply-design-md.cjs:974",
    "references/design-md-theming.md:210",
    "references/design-md-theming.md:220"
  ],
  "counterevidenceSought": "Read the whole reachability path for `used` (substituteBlock :735-763, remapLiterals :778-809) and looked for a second gate call that re-measures the derived skin — there is none; grepped every call site of validateRoles, which has exactly one caller (:974). Ran the identity run over all 38 forms to check whether the gap is masked by the corpus being stock, and it is: with --default nothing moves, so `used` is empty for 34 of 38 forms and the gap cannot show there.",
  "alternativeExplanation": "The gate may be intentionally scoped to values the applicator repainted, on the reading that an untouched stock value is already a decided value the corpus ships. Rejected in part: that reading does not survive the same reference returning FAILED for a starter and PASSED for a worked form, and it contradicts references/design-md-theming.md:210/220 which scope the gates to the roles, not to the edits.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If validateRoles is fed the derived skin's full role set (or the set of roles the delivery actually paints) instead of `rendered.used`, or if the theming contract is amended to state that only repainted values are gated, downgrade to P2 documentation drift.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Discovered and demonstrated; written as P0 first, downgraded on the precondition check" }]
}
```

```json
{
  "findingId": "F002",
  "claim": "The dark skin in the token source declares five roles while the style guide and derivation record declare ten, and two of the undocumented dark values ship in a corpus form that no gate reads.",
  "evidenceRefs": [
    "assets/style-reference/harness-diagram/diagram-palette.json:1-40",
    "references/foundations/derivation-record.md:44-56",
    "references/foundations/style-guide.md:37-48",
    "scripts/families/derivation-gates.cjs:42",
    "scripts/families/derivation-gates.cjs:73",
    "assets/diagrams/sequence-oauth-dark.html:1-120"
  ],
  "counterevidenceSought": "Dumped the palette's three skins programmatically, then grepped the whole corpus for each of the five dark values the record declares: `#393e53` and `#8e98ac` appear in no file, the two rgba dark values appear only in a block-less form. Checked whether the checker could see them anyway via the grid/metadata families — it cannot — and read apply-design-md.cjs:764-777 to confirm the literal map is keyed on stock source values only.",
  "alternativeExplanation": "The five extra dark roles may be deliberate forward declarations — values a form may adopt later, recorded so a reviewer can see the intent — in which case the defect is only that the checker refuses a block that uses them.",
  "finalSeverity": "P1",
  "confidence": 0.8,
  "downgradeTrigger": "If the palette's dark skin gains the five roles (or the two documents drop them and state the dark skin is deliberately five roles), and the two rgba literals in sequence-oauth-dark.html are either recorded as roles or repainted, downgrade to P2.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Discovered while tracing how a themed worked form is gated" }]
}
```

```json
{
  "findingId": "F003",
  "claim": "The node-budget family counts an attribute no shipped form carries, so its 38 reported assertions are unfalsifiable on this corpus while the rule it holds is stated to the user as non-negotiable.",
  "evidenceRefs": [
    "scripts/families/node-budget.cjs:21-24",
    "scripts/check-diagram-corpus.cjs:162-166",
    "scripts/tests/corpus-mutations.test.cjs:125",
    "SKILL.md:196",
    "SKILL.md:358"
  ],
  "counterevidenceSought": "Grepped all 38 forms for both attributes (0 files), then checked whether any other family tags nodes indirectly (labels, roles) — none does; read the family's own comment, which concedes 'a corpus that predates the tag is silent rather than wrong', and checked the mutation suite's exemption map, which is empty, so no recorded reason covers this family.",
  "alternativeExplanation": "The silence is deliberate and documented in the family's comment: the corpus predates the tag, and the rule binds new work only. That reading explains the design but not the reported assertion count, which presents the family as covering 38 files.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the checker prints per-family coverage that distinguishes asserted-compared values from per-file invocations, or if the shipped forms gain the tag (or a raw-<rect> budget lands), downgrade to P2.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Found while auditing each family's signals for live coverage" }]
}
```

## Ruled Out

- **Escalating F001 to P0**: a P0 requires a confirmed correctness failure without a precondition. The demonstration needs a reference that moves a ground while a role keeps its stock value, and under `--default` no role moves at all, so the shipped corpus and the documented identity run are unaffected. P1, with the precondition stated in the claim packet.
- **Escalating F002 to P0**: the corpus is green and the identity property holds for all 38 forms, so the divergence is not currently producing a wrong delivery — it is a contradiction between two documents and one enforcing source, and a class of value that can never be attributed. P1.
- **`orthogonal-connectors.cjs:60` and `label-mask-clearance.cjs:132` radial exemption being dead**: `assets/diagrams/radar.html` exists and the basename test therefore can fire; the exemption is redundant with `DECORATION` for today's corpus, not unreachable. Not reported.
- **`loop-terminal.html` referencing `url(#dots)` without a definition**: disproved. The file defines `<pattern id="dots">` across lines 185-192; a line-oriented grep missed it, which is exactly why the harness flattens tags (`check-diagram-corpus.cjs:84-86`). No finding.
- **`isUrl` accepting a non-HTTP scheme in `apply-design-md.cjs`**: `file://` and friends fall through to `readText`, which fails closed on a non-existent path and never opens a socket; no path leads to a fetch. No finding.

## Dead Ends

- **Line-oriented greps over the corpus for paint-server references**: they under-report multi-line tags. All subsequent corpus claims were checked with the harness's own `flattenTags` behaviour in mind or with the checker itself.
- **Treating `--default --all` byte equality as a test**: it is a manual procedure in `references/design-md-theming.md:84-90`, not an automated check; running it also writes outside this lineage, so the property was verified in memory through `renderForm` instead (38/38 identical) and the enforcement gap it implies is recorded as F007 in iteration 2.

## Recommended Next Focus

- Dimension: traceability, then maintainability.
- Files: `references/design-md-theming.md` (the `--forms` name contract), `references/foundations/derivation-record.md` §6, `references/foundations/style-guide.md:50-68,169`, `assets/diagrams/README.md`, `SKILL.md` (checklist hex), `scripts/families/grid-4px.cjs`, `scripts/check-diagram-corpus.cjs` (shared context surface).
- Why: the executable core is now covered; the remaining risk is that a document promises an enforcement that no code path performs (F002's second half already shows that pattern), and the parts of the surface no family can reach are the ones a reader trusts a green run to have covered.

Review verdict: CONDITIONAL
