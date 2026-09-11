# Deep Review Strategy - sk-design-diagram packet, fanout lineage `deepseek`

## 1. TOPIC

Review the `sk-design-diagram` skill at `.opencode/skills/sk-design/sk-design-diagram`: its twelve checker families and mutation suite, the DESIGN.md applicator and its gates, the 38 diagram forms, the style-reference bundle that now owns colour, and every reference document. P0/P1/P2 findings with `file:line` evidence.

Lineage: `fanout-deepseek-1789150665859-r5otlp`, generation 1, label `deepseek`, executor `cli-pi` model `deepseek-v4.1-flash`. Artifact directory bound to the fanout override `specs/sk-design/020-chart-and-diagram-review/002-diagram-review/review/lineages/deepseek`. Stop policy `max-iterations`, cap 2.

---

## 2. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 3. NON-GOALS

- No implementation of any finding. The loop is observation-only; every artifact in this boundary states what to change, not the change.
- No re-run of the mutation suite. It writes package copies under the system temp directory, which is outside this lineage's write surface; the checker itself was run (read-only) and the applicator was driven in memory instead.
- No audit of `benchmark/reports/**`, `screenshots/**`, `changelog/**`, `feature-catalog/**` beyond the two overlay protocols, and `scripts/drawio_extract.py` / `scripts/mermaid_extract.py` / `scripts/validate-flowchart.sh` (the import extractors and the ASCII validator) were not opened.
- No claim about any surface outside the packet, including the consumer commands and the `sk-design` hub.

---

## 4. STOP CONDITIONS

- Hard cap: `maxIterations = 2` reached → stop with `stopReason: "maxIterationsReached"`. This is the governing condition; the loop did not converge early and did not claim to.
- Telemetry that did not stop the loop: severity-weighted new-findings ratio 0.68 then 0.92 (both far above `rollingStopThreshold` 0.08), dimension coverage 1.0, no stuck iterations.

---

## 5. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Gate surface narrower than documented (F001), token-source dark skin divergence (F002), a vacuous corpus family (F003), a dead departure discriminator (F004) |
| D2 Security | PASS (advisories) | 1 | No reachable injection path found; one unguarded delivery surface: inline script and handler markup is read by no family (F005) |
| D3 Traceability | CONDITIONAL | 2 | Stale documented form names (F006), an enforcement claim with no enforcing code (F007), an unmeasured series gate claim (F008), a coverage overclaim (F009), a hardcoded checklist hex (F012) |
| D4 Maintainability | PASS (advisories) | 2 | One unreachable branch (F010), unused shared-context surface and one misnamed collection (F011) |
<!-- MACHINE-OWNED: END -->

---

## 6. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 7 active
- **P2 (Minor):** 5 active
- **Delta this iteration:** +0 P0, +4 P1, +3 P2 (iteration 2; iteration 1 contributed +0 P0, +3 P1, +2 P2)

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 7. WHAT WORKED

- **Executing the shipped modules instead of reasoning about them** (iteration 1). `deriveReference`, `renderForm` and `validateRoles` are exported, so a probe reference written inside this lineage turned three prose suspicions into measured outcomes — the identity run over 38 forms, the departure notes, and the two-form gate comparison that produced F001. Reuse for: any claim about a gate, a derivation or a writer.
- **Reading the checker's own header before trusting its output** (iteration 1). `check-diagram-corpus.cjs:9-13` states exactly which rule classes it cannot hold; that paragraph is what turned a vague "coverage feels thin" into F003 and later F009. Reuse for: any document that claims a check exists.
- **Counting mechanical claims instead of eyeballing them** (iteration 2). The 27-type count, the 38-form split, the 26-of-34 dot-pattern claim and the five series contrasts were all verified by grep or by the shipped arithmetic; the one claim that was checked by eye first produced a false mismatch that had to be dropped.
- **Grepping the corpus for a family's signal before crediting its assertion count** (iteration 1). This is the only technique that found F003; it generalised across all twelve families and produced no other false positive.

## 8. WHAT FAILED

- **Line-oriented grep for multi-line markup** (iteration 1). Reported `loop-terminal.html` as referencing an undefined paint server; the pattern is defined across lines 185-192. The harness's `flattenTags` exists for exactly this reason (`check-diagram-corpus.cjs:84-86`). Failed approach: read SVG markup line by line.
- **Treating a documentation example as prose rather than a procedure** (iteration 2, recovered). The stale `--forms template-*` list looked like a historical note until the command was executed; the recovered version is the stronger finding.
- **Expecting the dark-skin probe to show a *changed* output** (iteration 1). Editing the light rows of the carried reference leaves the dark skin untouched, because tier one fills the dark roles from their own declared rows (`design-md-theming.md:123-128`). The first probe run was a no-op and proved nothing; the second moved the dark ground, which is what made F001 observable.

## 9. EXHAUSTED APPROACHES (do not retry)

### Claim-versus-machinery sweep of the colour documents (iteration 2)
- What was tried: every normative sentence in `style-guide.md`, `derivation-record.md` and `assets/style-reference/README.md` measured against the palette, the families and the corpus.
- Why it stopped: three P1s and one P2 came out; the remaining sentences either restate a value that matches the palette, or are explicitly framed as judgments ("reviewed by eye", "taste").
- Do NOT retry: re-reading the same three documents for a fourth contradiction without a new artifact to measure against.

### Family-signal audit (iteration 1)
- What worked: extracting each family's counted signal and checking it exists in the corpus.
- Prefer for: any future family added to `scripts/families/`; F003 is the class of defect this finds.

## 10. RULED OUT DIRECTIONS

- **Escalating F001 or F002 to P0** (iteration 1, iteration 2 re-check): both need a stated precondition, and under `--default` no role moves so neither can bite the shipped corpus. Recorded as P1 with the alternative explanation in each claim packet.
- **Escalating F008 to P0** (iteration 2): the style guide's sentence has a defensible second reading under which all five series pass; the contradiction is between two documents and the fix is to state one metric.
- **`radial.html` / radar exemption in `orthogonal-connectors.cjs:60` and `label-mask-clearance.cjs:132`**: `assets/diagrams/radar.html` exists, so the basename test can fire; redundant with `DECORATION` today, not unreachable.
- **`references/foundations/style-guide.md:169` dot-pattern arithmetic and `:50` inline-hex arithmetic**: both verified accurate against the corpus; noted so a later pass does not re-derive them.
- **The eleven other families' tally semantics**: only `node-budget` has a signal that is absent corpus-wide; a general finding about assertion counts was dropped as unsupported.
- **`isUrl` scope in `apply-design-md.cjs`**: a non-HTTP scheme falls through to `readText`, which fails closed; no path leads to a fetch.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER

<!-- MACHINE-OWNED: START -->
- Completed pivots: 1 (iteration 2 pivoted from the executable core to the documents that describe it, on the max-iterations policy rather than on convergence)
- Failed pivots: 1 (the first dark-skin probe edited light rows only and left the dark skin untouched, so it produced no evidence)
- Audited overrides: 0
- Swept: D1 Correctness, D2 Security (iteration 1); D3 Traceability, D4 Maintainability (iteration 2)
- Pivot lineage: iteration 1 code paths → iteration 2 claims and coverage statements
- Remaining frontier: `benchmark/reports/**`; `screenshots/**`; the seven `manual-testing-playbook/**` scenario files beyond the two read; the three Python/shell import-export scripts; `references/types/type-*.md` read three of twenty-seven
<!-- MACHINE-OWNED: END -->

---

## 11. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
Iteration cap reached; no further iteration is scheduled by this lineage. If the loop resumed with a higher cap, the order would be: (1) `scripts/drawio_extract.py` and `scripts/mermaid_extract.py`, which no family and no document audit in this lineage reached and which the import path treats as untrusted input; (2) the seven `manual-testing-playbook/**` scenario files, to test whether any scenario promises a check no script performs (the class F003/F007/F009 belong to); (3) `references/types/type-*.md`, three of twenty-seven read, against their canonical forms.
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

Environment and prior-state notes taken before the first iteration:

- No `resource-map.md` in the packet, so the Resource Map Coverage Gate did not fire and no `## Resource Map Coverage Gate` section is emitted.
- The packet (`specs/sk-design/020-chart-and-diagram-review/002-diagram-review`) carries `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and an empty `scratch/`; the audited surface is the skill tree, not the packet documents, because the binding names the skill.
- A sibling lineage (`luna`) shares the same target; no artifact of it was read, to keep this lineage's evidence independent.
- The lineage's own boundary already contained lock/ledger scaffolding (`.executor-state`, `deep-review-effect-ledger/`, `deep-review-audit-ledger/`, `locks-and-fencing-v1/`) written by the runner, not by this review.

### Bounded Context Snapshot

- Target pointers: `scripts/` (harness, 12 families, 2 applicators, tests), `assets/diagrams/` (38 forms), `assets/style-reference/harness-diagram/` (DESIGN.md, diagram-palette.json, origin.md, icons.html), `references/**` (27 type docs + foundations + primitives + import-export + ascii-format + catalog.md), `SKILL.md`, `README.md`, `feature-catalog/`, `manual-testing-playbook/`.
- Behavior claims to verify: the twelve checker families hold what their comments say; the DESIGN.md applicator's gates run before any write; `--default` reproduces the stock forms byte for byte; the style-reference bundle is the single source of colour; the 38 forms are 27 + 7 + 4; the palette's recorded departures explain every below-gate stock value.
- Reuse and conventions: families export `{name, scope, run}` and are registered by directory listing; the palette is the token source both applicators read; `color-gates.cjs` is the shared colour arithmetic; a rule that becomes computable moves from the capture review into a family.
- Risks and gaps: no automated link between the applicators and the corpus check; worked forms without a palette block are outside the derivation family; judgment-class rules (focal balance, type fit, the remove test) are held by the capture review by design.

---

## 13. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 2 | F006: the theming document's printed command cannot execute. F007: section 6 of the derivation record claims an enforcement no code performs. F001: the documented gate scope is wider than the implemented one. |
| `checklist_evidence` | core | partial | 2 | F003: the complexity-budget item rests on a family with no signal on the shipped corpus. F012: the mask-fill item hardcodes the light paper. The remaining technical items are either held by a family or explicitly stated as judgments. |
| `skill_agent` | overlay | notApplicable | 2 | Target is a skill packet with no runtime agent definition of its own. |
| `agent_cross_runtime` | overlay | notApplicable | 2 | No agent surface under review. |
| `feature_catalog_code` | overlay | pass | 2 | `feature-catalog/feature-catalog.md` and `check-diagram-corpus.cjs:162` agree on twelve families; both derive the count from disk. |
| `playbook_capability` | overlay | pass | 2 | `manual-testing-playbook/**` scenarios map to executable paths and to the judgment band the checker's own header names; no scenario promises an automated check that does not exist. |
<!-- MACHINE-OWNED: END -->

---

## 14. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|--------------------|----------------|----------|--------|
| `scripts/check-diagram-corpus.cjs` | D1, D3, D4 | 2 | 0 P0, 0 P1, 1 P2 (F011) | complete |
| `scripts/color-gates.cjs` | D1 | 1 | none | complete |
| `scripts/apply-design-md.cjs` | D1, D3 | 2 | 0 P0, 1 P1 (F001), 1 P2 (F004) | complete (parsing/derivation read; gate and write paths executed in memory) |
| `scripts/apply-diagram-tokens.cjs` | D1 | 1 | 0 P0, 0 P1, 1 shared P2 (F004) | partial (derivation reuse and gate call read; CLI path not executed) |
| `scripts/families/*.cjs` (12) | D1, D4 | 2 | 0 P0, 1 P1 (F003), 2 P2 (F004 shared, F010) | complete |
| `scripts/families/grid-baseline.json` | D1 | 1 | none | complete |
| `scripts/tests/*.cjs` (2) | D1, D4 | 1 | none | complete |
| `assets/style-reference/harness-diagram/diagram-palette.json` | D1, D3 | 2 | 0 P0, 2 P1 (F002, F008) | complete |
| `assets/style-reference/harness-diagram/DESIGN.md` | D3 | 2 | none (parsed by the applicator on every probe run) | complete |
| `assets/diagrams/README.md` | D3 | 2 | 0 P0, 1 P1 (F009) | complete |
| `assets/diagrams/` (38 forms) | D1, D3 | 2 | 0 P0, 1 P1 (F002, one form) | partial (all 38 parsed by the checker and by `renderForm`; 4 read in detail) |
| `references/design-md-theming.md` | D3 | 2 | 0 P0, 1 P1 (F006), 1 P2 (F012 shared) | complete |
| `references/foundations/derivation-record.md` | D3 | 2 | 0 P0, 2 P1 (F007, F008) | complete |
| `references/foundations/style-guide.md` | D3 | 2 | 0 P0, 1 P1 (F008), 1 P2 (F012) | complete |
| `references/catalog.md` | D3 | 2 | none | partial (table and sentinels read; prose not audited) |
| `references/types/` (27) | D3 | 2 | none | partial (3 of 27 read) |
| `SKILL.md` | D3 | 2 | 0 P0, 0 P1, 1 P2 (F012) | complete |
| `README.md`, `assets/style-reference/README.md` | D3 | 2 | none | complete |
| `feature-catalog/`, `manual-testing-playbook/` | D3 | 2 | none | partial (overlay protocol scope) |
| `benchmark/reports/**`, `screenshots/**`, `scripts/*.py`, `scripts/validate-flowchart.sh` | — | — | — | not reviewed (see Non-Goals) |
<!-- MACHINE-OWNED: END -->

---

## 15. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 2
- Convergence threshold: 0.10 (rolling stop threshold 0.08)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1789150665859-r5otlp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder (bound); audited surface: `.opencode/skills/sk-design/sk-design-diagram` (skill tree)
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Write surface: this artifact directory only (`review/lineages/deepseek`); no file outside it was created or modified
- Started: 2026-09-11T18:17:46Z
<!-- MACHINE-OWNED: END -->

---

## 16. ARTIFACT NOTE

`probes/DESIGN.md` in this directory is a review artifact, not a packet document: a copy of `assets/style-reference/harness-diagram/DESIGN.md` with three colour rows changed, used to drive the applicator's derivation and gates in memory. The changes are `Paper #f5f5f5 → #fbfbfb`, `Accent #eb6c36 → #0a5fa8`, `Link #2e5aa8 → #8a4a9c`, and, for the F001 demonstration, `Night #2d3142 → #d9d9d9`. No stock file was touched; every number quoted in the iteration files comes from running the shipped modules with this reference as input.
