# Deep Review Strategy - sk-design-diagram packet, fanout lineage `ds4`

## 1. TOPIC

Review the `sk-design-diagram` skill at `.opencode/skills/sk-design/sk-design-diagram`: its twelve checker families and mutation suite, the DESIGN.md applicator and its gates, the 38 diagram forms, the style-reference bundle that now owns colour, and every reference document. P0/P1/P2 findings with `file:line` evidence.

Lineage: `fanout-ds4-1789151250756-g4m9oj`, generation 1, label `ds4`, executor `cli-pi` model `deepseek-v4.1-flash`. Artifact directory bound to the fanout override `specs/sk-design/020-chart-and-diagram-review/002-diagram-review/review/lineages/ds4`. Stop policy `max-iterations`, cap 4.

---

## 2. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 3. NON-GOALS

- No implementation of any finding. The review loop is observation-only; every artifact states what to change, not the change.
- No modification of the target skill or the spec packet; every write stays inside this lineage directory.
- No full audit of `benchmark/reports/**` and `screenshots/**` (evidence archives, not shipped behavior), and no re-run of the mutation suite if it would write outside the lineage; the corpus checker is run read-only where useful.
- No claim about surfaces outside the packet (the `sk-design` hub, consumer commands, sibling modes) beyond what the shipped cross-references assert.

---

## 4. STOP CONDITIONS

- Hard cap: `maxIterations = 4` reached → stop with `stopReason: "maxIterationsReached"`. This is the governing condition under `stopPolicy: max-iterations`; convergence before the cap is telemetry only and will be handled by broadening review angles, never by synthesizing early.
- Telemetry tracked but never stopping early: severity-weighted new-findings ratio, dimension coverage, stuck counter (threshold 2).
- Quality gates from `references/protocol/completion-criteria.md` are evaluated at synthesis, after the fourth iteration.

---

## 5. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

---

## 6. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** none yet

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 7. WHAT WORKED

- **Bounded context snapshot before iteration 1** (init). The skill is large (287 files, 2,714 lines of script, 38 shipped forms); the snapshot below names the pointers each iteration should follow so no pass burns its budget rediscovering the tree.

## 8. WHAT FAILED

- Nothing yet.

## 9. EXHAUSTED APPROACHES (do not retry)

- None yet.

## 10. RULED OUT DIRECTIONS

- None yet.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER

<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Saturated dimensions: none yet
- Expansion frontier (planned, not yet swept): (a) the twelve checker families and the mutation suite; (b) the DESIGN.md applicator, token applier and colour gates; (c) the 38 forms against the type catalogue and the style-reference bundle; (d) every reference document and the skill-level claims in `SKILL.md` / `README.md` / `scripts/README.md`
<!-- MACHINE-OWNED: END -->

---

## 11. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | pending | hard | Packet docs vs skill implementation not yet compared |
| checklist_evidence | pending | hard | No `checklist.md` in the bound packet |
| feature_catalog_code | pending | advisory | Overlay protocol, first pass pending |
| playbook_capability | pending | advisory | Overlay protocol, first pass pending |
<!-- MACHINE-OWNED: END -->

---

## 12. FILES UNDER REVIEW

| File / Area | Status | Iteration | Notes |
|-------------|--------|-----------|-------|
| `scripts/families/*.cjs` (12 checkers) + `grid-baseline.json` | pending | — | Iteration 1 focus |
| `scripts/check-diagram-corpus.cjs` | pending | — | Iteration 1 focus |
| `scripts/tests/corpus-mutations.test.cjs` + `mutation-cases.cjs` + fixtures | pending | — | Iteration 1 focus |
| `scripts/apply-design-md.cjs` | pending | — | Iteration 2 focus |
| `scripts/apply-diagram-tokens.cjs`, `scripts/color-gates.cjs` | pending | — | Iteration 2 focus |
| `references/design-md-theming.md` | pending | — | Iteration 2 focus |
| `assets/diagrams/*.html` (38 forms) | pending | — | Iteration 3 focus |
| `references/types/*.md` (27 files), `references/catalog.md` | pending | — | Iteration 3 focus |
| `assets/style-reference/harness-diagram/*` | pending | — | Iteration 3 focus |
| `references/foundations/*` | pending | — | Iteration 3 focus |
| All remaining `references/**` + `SKILL.md`, `README.md`, `scripts/README.md` | pending | — | Iteration 4 focus |

---

## 13. KNOWN CONTEXT

- **Bounded context snapshot (init).** Target pointers: `.opencode/skills/sk-design/sk-design-diagram` — `scripts/families/` (12 checker families, `grid-baseline.json`, one shared harness), `scripts/check-diagram-corpus.cjs` (harness), `scripts/tests/` (mutation suite + fixtures), `scripts/apply-design-md.cjs` (1033 lines, DESIGN.md applicator), `scripts/apply-diagram-tokens.cjs` (293 lines), `scripts/color-gates.cjs` (62 lines), `assets/diagrams/` (38 HTML forms), `references/` (50 docs incl. 27 `type-*.md`, `foundations/`, `import-export/`, `primitives/`, `ascii-format/`), `assets/style-reference/harness-diagram/` (`DESIGN.md`, `diagram-palette.json`, `origin.md`, `icons.html`), `feature-catalog/`, `manual-testing-playbook/`.
- **Claimed behavior to verify:** twelve checker families exist and are enumerated by the harness; the mutation suite covers them; the applicator is gated; the style-reference bundle "owns colour"; the catalogue names all 38 forms.
- **Reuse/convention pointers:** `scripts/README.md` documents the surface; `references/catalog.md` is the type index; `references/foundations/` carries the colour derivation record and style guide.
- **Risk areas:** gate scope vs shipped corpus, doc-vs-code drift after recent edits (files modified Sep 11), vacuum checkers that assert nothing, hardcoded values that contradict the "bundle owns colour" claim.
- **Stale-graph caveats / missing context:** no `resource-map.md` in the bound packet, so the Resource Map Coverage Gate is skipped; the packet's `spec.md` describes the review program, not this skill's implementation.
- **Out of scope areas:** benchmark archives, screenshots, changelog, hub registration files, and the sibling modes under `sk-design/`.

---

## 14. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 4 (`stopPolicy: max-iterations`)
- Convergence threshold: 0.10 (rolling), stuck threshold: 2
- Severity threshold: P2 (all severities reported)
- Cross-reference core protocols: `spec_code`, `checklist_evidence`; overlay: `feature_catalog_code`, `playbook_capability`
- Session: `fanout-ds4-1789151250756-g4m9oj`; artifact dir: `specs/sk-design/020-chart-and-diagram-review/002-diagram-review/review/lineages/ds4`
<!-- MACHINE-OWNED: END -->

---

## 15. NEXT FOCUS

Iteration 1: the twelve checker families, the corpus harness and the mutation suite — correctness of every family's signal, tally semantics, error reporting, and the mutation suite's coverage of the families it claims to test.
