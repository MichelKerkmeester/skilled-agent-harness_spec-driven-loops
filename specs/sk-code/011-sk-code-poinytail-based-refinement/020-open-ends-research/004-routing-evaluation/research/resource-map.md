---
title: "Resource Map — Recommend what a realistic held-out evaluation set and a cross-path parity check should look like for system-skill-advisor, comparing the Python path .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py with the Node path .skilled/bin/skill-advisor.cjs, and how to keep both cheap to run and honest given that the current batteries are 17 prompts plus 5 negatives, ties land at confidence 0.82, and hub admission runs in CI with --warn-only. Read-only research. Out of scope: proposing any fix for probe P4, probe P7 or admission scenario DOC-331, whose fix is in flight elsewhere."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 47
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=31, Specs=12, Scripts=2, Tests=0, Config=2, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 004-routing-evaluation
- **Generated**: 2026-10-11T17:33:38.724Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/feedback-calibration.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/package.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-compat-stress.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/advisor-feedback-calibration.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/vitest.config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py | Cited | OK | Citations=6; Iterations=6 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md | Cited | OK | Citations=4; Iterations=4 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-006.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-007.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/compiled-route-admission.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=4; Iterations=4 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/skill-advisor-stress.yml | Cited | OK | Citations=1; Iterations=1 |

---
