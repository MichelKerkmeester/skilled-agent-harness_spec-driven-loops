# Deep Review Strategy

## 2. TOPIC

Review of the `sk-design-chart` skill packet at `.opencode/skills/sk-design/sk-design-chart`, hosted by the review packet `specs/sk-design/020-chart-and-diagram-review/001-chart-review`.

Declared review surface (from the dispatch brief):
- `scripts/check-corpus.cjs` (3544 lines) and its mutation suite `scripts/tests/corpus-mutations.test.cjs` (561 lines)
- `scripts/apply-design-md.cjs` (701 lines), `scripts/color-gates.cjs` (62 lines) and the design-md gates in both scripts
- The 29 chart forms under `assets/templates/`
- The style-reference bundle that owns colour: `assets/style-reference/evilcharts/{palettes.json,tokens.json,source-globals.css,DESIGN.md,origin.md,palette-sheet-*.html}`
- Every reference document: `references/{README.md,catalog.md,color-system.md,design-md-theming.md,template-contract.md}` plus `SKILL.md`, `README.md`, `scripts/README.md`, `manual-testing-playbook/**`, `changelog/**`

The host spec folder is a scaffolded Level 2 phase packet whose `spec.md`, `plan.md`, `tasks.md`, and `acceptance-criteria.md` still carry template placeholders, so the core `spec_code` and `checklist_evidence` protocols are recorded against the skill's own normative documents (SKILL.md, references/*, scripts/README.md, template-contract.md) rather than against unfilled packet placeholders. The review target proper is the skill; the spec folder owns the artifacts.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Not reviewing `sk-design-diagram`, the `sk-design` hub router files (`mode-registry.json`, `hub-router.json`, `ROUTER.md`), or the sibling `sk-design-md-generator` packet except where this packet's documents make a claim about them.
- Not measuring visual output quality. Render-mode (`--render`) checks need a headless browser; this lineage runs the read-only structural pass only, and any render-only behaviour is recorded as unverified rather than asserted.
- Not editing, fixing, or reformatting any reviewed file. This run is observation-only.
- Not scoring the packet's completeness against the scaffolded host packet's placeholder requirements.

---

## 5. STOP CONDITIONS

- Hard stop: `maxIterations = 4` (config.stopPolicy = `max-iterations`; the cap governs).
- Convergence telemetry is recorded but never ends the run early: on a `max-iterations` policy, early convergence broadens review angles instead of synthesizing.
- Immediate escalation if a security finding reaches production-impacting severity (none in this packet is production code; it is a skill packet, so the ceiling is advisory tooling).
- Escalate on state corruption (unreconstructible iteration history).

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet, populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | [PASS/CONDITIONAL/FAIL] | [N] | [1-sentence result] |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Baseline capture before any judgement: running `node scripts/check-corpus.cjs` in the lineage recorded the starting state (0 errors, 32 files scanned, 29 chart forms, 3 colour systems) so every later "no regression" claim has a number behind it (iteration 0).
- Instrumenting the checker's own control flow: reading `record()` / `tally()` first showed which checks can report zero failures while asserting nothing, which is what turned iteration 1 from a template sweep into a false-pass hunt (iteration 1).

---

## 9. WHAT FAILED

- Treating the checker's own summary counters as evidence of coverage. `tally()` counts assertions planned, not assertions compared; several families raise their count on a branch that `continue`s before comparing anything (iteration 1).
- Trusting the mutation suite's title count as a proxy for checker rule coverage: the suite proves rules fire on mutated corpora, not that every contract rule has a mutation at all (iteration 1).

---

## 10. EXHAUSTED APPROACHES (do not retry)

### Render-mode verification — BLOCKED (iteration 0, 1 attempt)
- What was tried: considered `--render` to exercise the browser path.
- Why blocked: render mode writes instrumented copies and screenshots to a temp work dir and needs a headless Chrome; this lineage's write surface is the lineage directory only. Every render-dependent claim is recorded as unverified rather than asserted.
- Do NOT retry: do not run `check-corpus.cjs --render` from this lineage.

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: scripts/ (checker + applicator + suite), references/ (5 docs), assets/templates (29 forms), assets/style-reference/evilcharts (8 files), packet docs (SKILL.md, README.md, scripts/README.md, playbook, changelog)
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS

- [Palette value drift]: ruled out by `checkPaletteSource` / `checkPaletteSourceDark` and `checkRadiusRungs`, which compare every template's palette literal against `palettes.json` per system and per scheme (iteration 1, evidence: `scripts/check-corpus.cjs:245-416`).
- [Catalog row ↔ template file drift]: ruled out bidirectionally by `checkCatalog` (row without file and file without row both error) (iteration 1, evidence: `scripts/check-corpus.cjs:2541-2609`).

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 1: D1 Correctness + D2 Security over `scripts/check-corpus.cjs`, `scripts/apply-design-md.cjs`, `scripts/color-gates.cjs`, and `scripts/tests/corpus-mutations.test.cjs`, hunting false-pass paths in the checker and path/write safety in the applicator.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers:
  - Checker: `scripts/check-corpus.cjs` — `run()` at :3260+, families registered in `counts`, summary printed at the end, marker line `RESULT: PASSED` / `RESULT: FAILED`.
  - Applicator: `scripts/apply-design-md.cjs` — `run(argv)` at :620, `derive()` at :596, provenance + stock-form guard near :650-680.
  - Mutations: `scripts/tests/corpus-mutations.test.cjs` — builds mutated corpora in a temp dir and asserts the checker fails for the right reason.
  - Colour ownership: `assets/style-reference/evilcharts/palettes.json` is the single source; `checkPaletteSource` enforces template literals against it; `references/color-system.md` documents the systems.
  - Contract: `references/template-contract.md` (821 lines) is the normative rule list the checker claims to enforce; `scripts/README.md` (459 lines) documents what the checker checks.
- Behavior claims to verify: SKILL.md's "Twenty-nine chart forms across six question families", "the corpus check reads it in both directions", "`design-md` delivery is accepted only with its provenance comment and both inline gate checks", "One colour system per artifact", "run the corpus validator before reporting a result", and the `?scheme=light|dark` capture claim.
- Reuse/convention pointers: `color-gates.cjs` exports `channel`, `luminance`, `contrast`, `round2` and is the shared gate kernel for both the checker and the applicator.
- Review risks and gaps: no `resource-map.md` exists in the host packet, so the Resource Map Coverage Gate is skipped (recorded in config `resource_map_present: false`). `resource-map.md not present. Skipping coverage gate`. Render-mode behaviour is unverified by design. Prior sibling lineages (deepseek, luna) ran on the same packet; their findings are not inherited here, and any overlap is recorded as an independent confirmation rather than a new discovery.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Normative claims under test: SKILL.md §1/§3/§4/§6, references/*, scripts/README.md, template-contract.md |
| `checklist_evidence` | core | pending | - | Host packet checklist/acceptance docs are unfilled placeholders; evidence is scored against skill-doc claims instead |
| `skill_agent` | overlay | pending | - | No runtime agent is defined for this packet |
| `agent_cross_runtime` | overlay | notApplicable | - | Target is a skill packet, not an agent |
| `feature_catalog_code` | overlay | pending | - | `references/catalog.md` rows vs `assets/templates/` files |
| `playbook_capability` | overlay | pending | - | `manual-testing-playbook/**` scenarios vs what the scripts actually do |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table, populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/sk-design/sk-design-chart/SKILL.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/README.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/references/README.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/references/catalog.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/references/color-system.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/scripts/README.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/scripts/tests/corpus-mutations.test.cjs` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/scripts/tests/apply-design-md.test.cjs` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html` (29 forms) | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/tokens.json` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/DESIGN.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/origin.md` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/source-globals.css` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/**` | - | - | - | not-started |
| `.opencode/skills/sk-design/sk-design-chart/changelog/**` | - | - | - | not-started |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-ds4-1789151247807-azut43, parentSessionId=null, generation=1, lineageMode=auto
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder (host); skill packet (effective scope)
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Stop policy: max-iterations (terminal stopReason must be `maxIterationsReached`)
- Started: 2026-09-11T18:28:21Z
<!-- MACHINE-OWNED: END -->
