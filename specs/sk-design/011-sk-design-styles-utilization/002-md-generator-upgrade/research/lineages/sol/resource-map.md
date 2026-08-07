---
title: "Resource Map: md-generator styles-library upgrade research"
description: "Evidence inventory emitted from five converged SOL-lineage research deltas."
---

# Resource Map

## Scope

Detached research lineage for upgrading `design-md-generator` with the 1,290-style corpus. This map records evidence consumed by the iteration deltas; it does not authorize writes to the listed sources.

## Prior Research And Specs

| Resource | Role | Iterations |
|---|---|---:|
| `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md` | Retrieval substrate, hydration, provenance, and anti-slop contracts | 1, 3, 5 |
| `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md` | Scope, requirements, and success criteria | Init |

## Md-Generator Contracts

| Resource | Role | Iterations |
|---|---|---:|
| `.opencode/skills/sk-design/design-md-generator/SKILL.md` | STUDY/EXTRACT/WRITE/VALIDATE/REPORT authority and mode rules | 1, 3 |
| `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md` | Authoritative v3 section and Quick Start contract | 1, 2, 4 |
| `.opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md` | Static operator-facing prompt boundary | 1 |

## Backend Scripts

| Resource | Role | Iterations |
|---|---|---:|
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts` | Pipeline order and orchestration seams | 1, 4, 5 |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts` | Locked facts, pre-rendered sections, and bounded STUDY insertion point | 1, 3, 4, 5 |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts` | Deterministic sections, Quick Start, and typography role derivation | 1, 2, 4, 5 |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts` | Fidelity checks, section completeness, scores, and hard/advisory extension point | 1, 4, 5 |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts` | Existing validation/report integration | 4 |

## Tests And Config

| Resource | Role | Iterations |
|---|---|---:|
| `.opencode/skills/sk-design/design-md-generator/backend/tests/formatters-v3.test.ts` | Deterministic formatter fixture pattern | 1, 4 |
| `.opencode/skills/sk-design/design-md-generator/backend/tests/build-write-prompt.test.ts` | Prompt-builder fixture pattern | 1 |
| `.opencode/skills/sk-design/design-md-generator/backend/tests/validate.test.ts` | Planted-failure and validation fixture pattern | 1, 4 |
| `.opencode/skills/sk-design/design-md-generator/backend/package.json` | Existing test-script integration surface | 4, 5 |

## Corpus Evidence

| Resource | Role | Iterations |
|---|---|---:|
| `.opencode/skills/sk-design/styles/*/DESIGN.md` | Section order, Quick Start, prose-density, typography-role, and normalized phrase distributions across 1,290 bundles | 2, 4 |
| `.opencode/skills/sk-design/styles/*/design-tokens.json` | Category presence/cardinality, theme, and capability distributions across 1,290 bundles | 2 |
| `.opencode/skills/sk-design/styles/099-supply/DESIGN.md` | Vertical interpretation sample | 2 |
| `.opencode/skills/sk-design/styles/099-supply/design-tokens.json` | Vertical token-shape sample | 2 |

## Lineage Evidence

| Resource | Focus |
|---|---|
| `iterations/iteration-001.md` | Pipeline, schema, prompt, validator, and fixture boundaries |
| `iterations/iteration-002.md` | Corpus-wide schema, Quick Start, vocabulary, and absence calibration |
| `iterations/iteration-003.md` | Bounded STUDY selection, transformation, provenance, and leakage protocol |
| `iterations/iteration-004.md` | Quality baseline, fixtures, CI, and leak-threshold design |
| `iterations/iteration-005.md` | Ranked levers, phased costs, smart controls, and convergence closure |
| `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl` | Structured iteration findings and negative knowledge |

## Measured Commands

- Deterministic complete-pair scan of 1,290 corpus `DESIGN.md` and `design-tokens.json` bundles.
- Section/order, Quick Start prefix, category/cardinality, theme, typography-role, and absence/anomaly counters.
- Normalized prose-only n-gram and prose-token distribution scan over 1,290 `DESIGN.md` files.
- Mechanical route-proof verification for all five iteration artifacts.

## Gaps

- Spec Kit Memory was unavailable during the run; direct canonical files supplied continuity.
- Exact implementation-time warning weights, leak precision, and task duration remain intentionally unmeasured.
