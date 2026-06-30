# Deep Review Resource Map - Codex Lineage

Generated from converged review delta evidence. The target spec folder did not have a pre-existing `resource-map.md`, so this is an evidence map for the lineage rather than a coverage-gate comparison against a canonical map.

## Reviewed Surfaces

| Surface | Files | Iterations | Notes |
|---------|-------|------------|-------|
| sk-design hub and registry | `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, `command-metadata.json`, `hub-router.json` | 1,3 | Command surface and one-identity invariant checked. |
| Shared deterministic gates | `design-command-surface-check.mjs`, `proof_check.py`, `numeric_law_check.py`, `variant_parameter_check.py` | 1,2 | Command surface, numeric laws, and variant parameters had clean deterministic evidence. |
| md-generator guided wrapper | `guided-run.ts`, `extract.ts`, `guided-run.test.ts`, `references/guided_run.md` | 1,5 | Produced F001 and F002. |
| Runtime design agents | `.opencode/agents/design.md`, `.claude/agents/design.md`, `.codex/agents/design.toml` | 3,4,5 | Produced F004. |
| Skill benchmark scoring/reporting | `score-skill-benchmark.cjs`, `build-report.cjs`, `design-token-lint.vitest.ts`, route-gold fixtures | 3,5 | Produced F003. |

## Finding Evidence Map

| Finding | Severity | Evidence | Iterations |
|---------|----------|----------|------------|
| F001 | P1 | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:47-65` | 1,5 |
| F002 | P2 | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:73-87`; `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:266-271` | 1,5 |
| F003 | P2 | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1303-1316`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs:80-87` | 3,5 |
| F004 | P2 | `.opencode/agents/design.md:6-18`; `.claude/agents/design.md:4`; `.codex/agents/design.toml:5-7` | 4,5 |

## Phase-5 Augmentation

- Novel logic gaps: F001 guided-run argument validation; F003 report renderer advisory omission.
- Empty-result cases: no P0 findings, no command-surface drift, no duplicate graph metadata, no numeric-law or variant-parameter gate drift.
