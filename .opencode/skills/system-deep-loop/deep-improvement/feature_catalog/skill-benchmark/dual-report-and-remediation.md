---
title: "Dual report and remediation taxonomy"
description: "Emits a machine report.json plus a human report.md rendered purely from it (anti-drift); a static remediation taxonomy documents how each finding class maps to a target, locus, one-line fix, and hand-off lane."
trigger_phrases:
  - "dual report and remediation taxonomy"
  - "build-report.cjs"
  - "render skill benchmark report"
  - "remediation_taxonomy.json"
  - "anti-drift report projection"
version: 1.17.0.7
---

# Dual report and remediation taxonomy

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The orchestrator writes a machine `skill-benchmark-report.json` and renders a human `skill-benchmark-report.md` from it. `build-report.cjs` is a pure projection of the report object — every number in the markdown comes from the JSON, with no independent computation (anti-drift). A separate `remediation_taxonomy.json` asset documents how each finding class maps to a concrete fix and hand-off lane.

---

## 2. HOW IT WORKS

`scripts/skill-benchmark/build-report.cjs` exposes `renderReport(report)`, which builds the markdown directly from the report object: a `# Skill Benchmark Report — <targetSkill.id>` title; a "rendered from report.json (do not hand-edit)" line echoing `scoringMethod` and `traceMode`; a `**Verdict: <verdict>**` line with `aggregate <n>/100` when present and a capped-verdict warning when `gate.gateFailed`; a Dimension scores table (`dimLine` prints `<n>/100`, or `_<status>_` such as `unscored-mode-a` when `score` is null, and adds " (hard gate)" for D5); an "Unscored in this run" line from `unscoredDimensions`; a Funnel section listing each stage count plus the headline bottleneck; a Ranked bottlenecks table from the report's `bottlenecks` (severity / class / locus-or-stage / detail); a Scenarios table from `scenarioRows`; and a Methodology / caveats section. As a script (`require.main`), `main()` reads `--report` (the JSON) and optionally writes `--output`; the orchestrator instead calls `renderReport` in-process and writes the `.md` alongside the `.json`. The module exports only `renderReport`.

`assets/skill_benchmark/remediation_taxonomy.json` is a static `v1` catalog whose `findings` array is keyed by finding `class` — `router_unparseable`, `dead_resource_path`, `path_escape`, `dead_intent_key`, `orphan_reference`, `funnel_attrition`, and `contaminated_fixture` — each carrying `severity`, `targetFile`, `locus`, `oneLineFix`, and `handoffLane` (`speckit-packet`, `agent-improvement`, or `harness-fix`). UNVERIFIED: no `.cjs` under `scripts/skill-benchmark/` reads or imports `remediation_taxonomy.json` (grep finds no reference). `build-report.cjs` renders the Ranked bottlenecks table from the report's own `bottlenecks` entries (their `severity`/`class`/`locus`/`stage`/`detail`), and does not enrich them with the taxonomy's `targetFile`/`oneLineFix`/`handoffLane`. The taxonomy currently ships as a documented reference asset and is exercised only by its own test. The reference `scoring_contract.md` describes the bottlenecks as being mapped through this taxonomy, but that mapping is not wired into the shipped report code today.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | Reporting | `renderReport` renders `skill-benchmark-report.md` purely from the report object; anti-drift, only writer of the markdown. |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/remediation_taxonomy.json` | Reference asset | Maps each finding class to `severity`/`targetFile`/`locus`/`oneLineFix`/`handoffLane`; validated by test, not consumed by report code. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Automated test | Asserts `renderReport` renders the title and `Verdict: PASS` from an aggregated report and that the end-to-end run emits both `skill-benchmark-report.json` and `.md`. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Automated test | Validates the model-benchmark remediation hardening fixes (dispatcher cwd, criteria-exec gate, grader clamp, pause sentinel). |

---

## 4. SOURCE METADATA

- Group: Skill-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `skill-benchmark/dual-report-and-remediation.md`
Related references:
- [scoring-and-funnel.md](scoring-and-funnel.md) — D1-D5 scoring and funnel
