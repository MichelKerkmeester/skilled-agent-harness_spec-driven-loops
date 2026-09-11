# Deep Review Dashboard - fanout lineage `deepseek`

Auto-generated from `deep-review-state.jsonl`, `deep-review-strategy.md` and `deep-review-findings-registry.json`. Regenerated after every iteration; not to be edited by hand.

## STATUS

- Provisional verdict: **CONDITIONAL** (0 P0, 7 P1, 5 P2 active)
- `hasAdvisories`: true
- Release-readiness state: `in-progress`
- Stop reason: `maxIterationsReached` (cap 2, `stopPolicy: max-iterations`)
- Session: `fanout-deepseek-1789150665859-r5otlp`, generation 1, label `deepseek`, executor `cli-pi` / `deepseek-v4.1-flash`
- Target: `specs/sk-design/020-chart-and-diagram-review/002-diagram-review` (bound), audited surface `.opencode/skills/sk-design/sk-design-diagram`

## FINDINGS SUMMARY

| Severity | Active | New in run 1 | New in run 2 |
|----------|--------|--------------|--------------|
| P0 | 0 | 0 | 0 |
| P1 | 7 | 3 (F001, F002, F003) | 4 (F006, F007, F008, F009) |
| P2 | 5 | 2 (F004, F005) | 3 (F010, F011, F012) |

Active finding IDs: F001 F002 F003 F004 F005 F006 F007 F008 F009 F010 F011 F012. No finding was resolved or disproved during the run; two candidate P0s were downgraded to P1 before registration (F001, F002) and one P1 was held at P1 after an alternative reading survived (F008).

## PROGRESS TABLE

| Run | Status | Focus | Dimensions | Files | New findings ratio | Duration |
|-----|--------|-------|------------|-------|--------------------|----------|
| 1 | complete | Twelve checker families, corpus harness, mutation suite, DESIGN.md applicator and its gates | correctness, security | 20 | 0.68 | ~23 min |
| 2 | complete | Documents that state what is enforced; the parts of the checker surface no family reaches | traceability, maintainability | 14 | 0.92 | ~22 min |

## COVERAGE

- Dimensions completed: 4 of 4 (correctness, security, traceability, maintainability) — `dimensionCoverage: 1.0`
- Traceability protocols: `spec_code` fail, `checklist_evidence` partial (core, hard); `feature_catalog_code` pass, `playbook_capability` pass (overlay, advisory); `skill_agent` and `agent_cross_runtime` notApplicable for a skill target
- Files: 34 opened directly; 38 forms parsed by the checker and by the applicator's `renderForm`; the mutation suite read but deliberately not executed (it writes package copies outside this lineage's write surface)
- Baseline evidence taken before findings were registered: `node scripts/check-diagram-corpus.cjs` → `Diagram corpus: 38 files, 12 families` … `Summary: errors: 0` / `RESULT: PASSED`; identity run → 38 of 38 forms byte-identical under `--default`, 0 gate failures, 5 departure notes

## TREND

| Signal | Run 1 | Run 2 | Direction |
|--------|-------|-------|-----------|
| Severity-weighted new findings ratio | 0.68 | 0.92 | ascending |
| Rolling average (last 2) | — | 0.80 | above the 0.08 rolling stop threshold |
| MAD noise floor vote | — | not met | the two ratios are not within a noise floor |
| Dimension coverage vote | 0.50 | 1.00 | complete, aged one pass |
| Composite stop score | — | 0.94 | above the 0.60 gate, so STOP was never legal; the run ended on the iteration cap |

## ACTIVE RISKS

- **Guard violations:** none. No target file was modified; the only writes are the artifacts of this lineage plus `probes/DESIGN.md`.
- **Stuck count:** 0 (no iteration below the 0.05 no-progress threshold).
- **Convergence caveat:** the loop did not converge. Both ratios sit far above the rolling threshold, so the terminal state is the cap, not a satisfied stop — a resumed run would find live material (see the expansion frontier in the strategy).
- **Coverage gaps:** the import extractors (`scripts/drawio_extract.py`, `scripts/mermaid_extract.py`), the ASCII validator, `benchmark/reports/**`, `screenshots/**`, 24 of 27 `references/types/type-*.md`, and the seven `manual-testing-playbook` scenario files were not reviewed.
- **Budget warnings:** none. No iteration hit a time or tool-call ceiling.
