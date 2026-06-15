---
title: "SB-047 -- Scoring Against Private Gold"
description: "Manual validation scenario for SB-047: Scoring Against Private Gold."
feature_id: "SB-047"
category: "Skill-Benchmark Mode"
---

# SB-047 -- Scoring Against Private Gold

This document captures the canonical manual-testing contract for `SB-047`.

---

## 1. OVERVIEW

This scenario validates that `scripts/skill-benchmark/score-skill-benchmark.cjs` scores a router-replay result against private gold and aggregates the D1–D5 dimensions. The orchestrator `run-skill-benchmark.cjs` loads public/private fixture pairs from `assets/skill_benchmark/fixtures/<skill-id>/` (`<id>.public.json` + `<id>.private.json`); the private gold (`expected.intentKeys`, `expected.resources`, `expected.skillId`, `expected.negativeActivation`) never crosses the dispatch boundary and is joined post-route. `scoreScenario()` computes Mode A dimensions deterministically: D1-intra (`0.4*intentRecall + 0.6*resourceRecall`), D2 (resource-recall discovery proxy), D3 (over-routing efficiency proxy), with D1-inter scored only when `--advisor-mode=python` supplies an advisor probe and D4 always `unscored-mode-a` (needs live ablation). `aggregate()` averages the scenario `modeAScore`s, attaches the D5 connectivity score (hard gate), and derives the verdict (`PASS` ≥80, `CONDITIONAL` 50–79, `FAIL` <50, `BLOCKED-BY-STRUCTURE` on a D5 gate). The bundled `deep-improvement` fixture `agent-improve-001` exercises the full lint → route → score path, so running the orchestrator against `deep-improvement` produces at least one scored scenario row with a populated `dims.d1intra`.

---

## 2. SCENARIO CONTRACT

- Objective: Validate that score-skill-benchmark joins router-replay output with private gold and aggregates D1–D5 — producing at least one scored scenario row (non-load-error) with `dims.d1intra` and a numeric `aggregateScore` and verdict.
- Real user request: `Confirm the scorer matches the router's routed resources against the private gold answer and rolls the dimensions into one aggregate verdict.`
- Prompt: `Validate that score-skill-benchmark scores router-replay output against private gold and aggregates the D1 through D5 dimensions.`
- Expected execution process: Run `run-skill-benchmark.cjs --skill deep-improvement` (which ships the `agent-improve-001` public/private fixture pair) into a disposable outputs dir; capture stdout, stderr, exit code, and the generated report; then execute the verification block against `skill-benchmark-report.json`.
- Expected signals: the run exits `0`; `skill-benchmark-report.json` has `scoringMethod: "mode-a-router-replay"`; `scenarioRows` is non-empty and at least one row has no `loadError` and carries `dims.d1intra` (numeric `score`); `aggregateScore` is a number and `verdict` is one of `PASS`/`CONDITIONAL`/`FAIL`/`BLOCKED-BY-STRUCTURE`; `dimensionScores.D4` is `unscored-mode-a` and `unscoredDimensions` includes `D4` (and `D1inter` when the advisor probe is off); `dimensionScores.D5` carries `hardGate: true`.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence that the private-gold join and dimension aggregation happened.
- Pass/fail: PASS when the run exits 0, produces a non-empty `scenarioRows` with at least one scored (`loadError`-free) row bearing `dims.d1intra`, and a numeric `aggregateScore` with a valid `verdict`; FAIL if no scored row is produced or the aggregate/verdict is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders to disposable /tmp test paths.
3. Run the exact command sequence; capture stdout, stderr, exit code, generated artifacts.
4. Run the verification block against the same artifacts.
5. Compare observed output against expected signals and pass/fail criteria.
6. Record the scenario verdict with decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SB-047 | Scoring Against Private Gold | Validate the scorer joins router output with private gold and aggregates D1–D5 | `Validate that score-skill-benchmark scores router-replay output against private gold and aggregates the D1 through D5 dimensions.` | rm -rf /tmp/sb-047 &amp;&amp; mkdir -p /tmp/sb-047/out &amp;&amp; \<br>node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \<br>  --skill deep-improvement \<br>  --outputs-dir /tmp/sb-047/out ; echo "run-exit=$?" ; \<br>node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('/tmp/sb-047/out/skill-benchmark-report.json','utf8'));const scored=(r.scenarioRows||[]).find(x=&gt;!x.loadError);console.log('scoringMethod='+r.scoringMethod);console.log('rows='+r.scenarioRows.length+' scoredHasD1intra='+!!(scored&amp;&amp;scored.dims&amp;&amp;scored.dims.d1intra));console.log('aggregateScore='+r.aggregateScore+' verdict='+r.verdict);console.log('D4='+r.dimensionScores.D4.status+' D5hardGate='+r.dimensionScores.D5.hardGate+' unscored='+JSON.stringify(r.unscoredDimensions));" | `run-exit=0`; `scoringMethod=mode-a-router-replay`; `rows` &gt; 0 and `scoredHasD1intra=true`; `aggregateScore` numeric; `verdict` one of PASS/CONDITIONAL/FAIL/BLOCKED-BY-STRUCTURE; `D4=unscored-mode-a`; `D5hardGate=true`; `unscored` includes `D4` (and `D1inter` with the advisor off) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when the run exits 0 and the report has a non-empty `scenarioRows` with at least one scored row carrying `dims.d1intra`, plus a numeric `aggregateScore` and a valid `verdict`; FAIL otherwise. | If `scenarioRows` is empty: confirm `deep-improvement` still ships `assets/skill_benchmark/fixtures/deep-improvement/agent-improve-001.{public,private}.json` and that `loadFixtures()` found the pair<br>If the only row has `loadError`: the public/private JSON is malformed — the degraded `unparseable-fixture` row is the symptom<br>If `aggregateScore`/`verdict` is wrong: inspect `scoreScenario()` recall math and the `aggregate()` verdict bands in `score-skill-benchmark.cjs` |

### Optional Supplemental Checks

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `10--skill-benchmark/scoring-vs-private-gold.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane C: Skill-Benchmark) |
| `../../scripts/skill-benchmark/score-skill-benchmark.cjs` | `scoreScenario()` + `aggregate()` — Mode A dimension scoring and roll-up |
| `../../scripts/skill-benchmark/run-skill-benchmark.cjs` | Orchestrator that loads fixtures and joins private gold post-route |
| `../../assets/skill_benchmark/fixtures/deep-improvement/agent-improve-001.private.json` | Private gold (intentKeys/resources/skillId) joined for scoring |

---

## 5. SOURCE METADATA

- Group: Skill-Benchmark Mode
- Playbook ID: SB-047
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--skill-benchmark/scoring-vs-private-gold.md`
