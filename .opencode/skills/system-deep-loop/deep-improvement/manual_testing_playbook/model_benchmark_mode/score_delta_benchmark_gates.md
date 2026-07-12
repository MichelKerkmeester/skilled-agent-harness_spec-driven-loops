---
title: "MB-049 -- Score-Delta Benchmark Gates"
description: "Manual validation scenario for MB-049: Score-Delta Benchmark Gates."
feature_id: "MB-049"
category: "Model_Benchmark Mode"
version: 1.17.0.1
---

# MB-049 -- Score-Delta Benchmark Gates

This document captures the canonical manual-testing contract for `MB-049`.

---

## 1. OVERVIEW

This scenario validates that Lane B benchmark scoring emits `outcomeScoreDelta` plus per-fixture helped/hurt deltas, that the reducer summarizes those fields, and that promotion blocks hurt or regressing benchmark evidence unless the operator supplies the explicit override.

---

## 2. SCENARIO CONTRACT

- Objective: Validate score-delta benchmark evidence and promotion gating for Lane B.
- Real user request: `Confirm that benchmark reports include outcomeScoreDelta and fixtureDeltas, and that promotion blocks regressions or hurt fixtures without explicit review.`
- Prompt: `Validate that model-benchmark score-delta evidence is emitted, reduced, and enforced by promotion gates.`
- Expected execution process: Create a disposable profile with two baseline-scored fixtures, run `run-benchmark.cjs`, inspect the report and state log, run `reduce-state.cjs`, then attempt benchmark-mode promotion first without and then with `--allow-hurt-fixtures`.
- Expected signals: `report.json` contains `outcomeScoreDelta`, `fixtureDeltas[]`, and `fixtureDeltaSummary`; the state log row carries the same delta fields; the reducer dashboard contains helped/hurt/missing-baseline counts; promotion fails on hurt fixtures without `--allow-hurt-fixtures` and succeeds when the same positive-delta report is explicitly overridden.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence from the report, dashboard, and promotion command outputs.
- Pass/fail: PASS when all three surfaces agree: benchmark report/ledger emit deltas, reducer summarizes them, and promotion blocks the hurt fixture until `--allow-hurt-fixtures` is supplied.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve all paths to a disposable `/tmp/mb-049` workspace.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Compare observed output against the expected signals and pass/fail criteria.
5. Record the scenario verdict with decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MB-049 | Score-Delta Benchmark Gates | Validate score-delta emission, reducer summary, and hurt-fixture promotion gating | `Validate that model-benchmark score-delta evidence is emitted, reduced, and enforced by promotion gates.` | <pre>rm -rf /tmp/mb-049 && mkdir -p /tmp/mb-049/fixtures /tmp/mb-049/out /tmp/mb-049/improvement ;<br>node -e "const fs=require('fs');const p='/tmp/mb-049';fs.writeFileSync(p+'/fixtures/helped.json',JSON.stringify({id:'helped',title:'helped',requiredHeadings:['# Done'],requiredPatterns:['needle'],forbiddenPatterns:[],baselineScore:70},null,2));fs.writeFileSync(p+'/fixtures/hurt.json',JSON.stringify({id:'hurt',title:'hurt',requiredHeadings:['# Done'],requiredPatterns:['needle'],forbiddenPatterns:[],baselineScore:70},null,2));fs.writeFileSync(p+'/profile.json',JSON.stringify({profileId:'score-delta',family:'test',targetPath:p+'/target.txt',fixtureDir:p+'/fixtures',fixtures:['helped','hurt'],thresholdDelta:0,benchmark:{requiredAggregateScore:0,minimumFixtureScore:0}},null,2));fs.writeFileSync(p+'/out/helped.md','# Done\nneedle\n');fs.writeFileSync(p+'/out/hurt.md','# Done\n');fs.writeFileSync(p+'/candidate.txt','CANDIDATE\n');fs.writeFileSync(p+'/target.txt','BASELINE\n');fs.writeFileSync(p+'/repeatability.json',JSON.stringify({profileId:'score-delta',passed:true},null,2));fs.writeFileSync(p+'/config.json',JSON.stringify({target:p+'/target.txt',targetProfile:'score-delta',proposalOnly:false,promotionEnabled:true,branchPreservationPolicy:'preserve-on-failure',scoring:{thresholdDelta:0}},null,2));fs.writeFileSync(p+'/manifest.jsonc',JSON.stringify({targets:[{path:p+'/target.txt',classification:'canonical'}]},null,2));" ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile /tmp/mb-049/profile.json --outputs-dir /tmp/mb-049/out --output /tmp/mb-049/report.json --state-log /tmp/mb-049/improvement/agent-improvement-state.jsonl ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs /tmp/mb-049/improvement ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs --candidate=/tmp/mb-049/candidate.txt --target=/tmp/mb-049/target.txt --benchmark-report=/tmp/mb-049/report.json --repeatability-report=/tmp/mb-049/repeatability.json --config=/tmp/mb-049/config.json --manifest=/tmp/mb-049/manifest.jsonc --archive-dir=/tmp/mb-049/archive --approve ; echo "blocked-exit=$?" ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs --candidate=/tmp/mb-049/candidate.txt --target=/tmp/mb-049/target.txt --benchmark-report=/tmp/mb-049/report.json --repeatability-report=/tmp/mb-049/repeatability.json --config=/tmp/mb-049/config.json --manifest=/tmp/mb-049/manifest.jsonc --archive-dir=/tmp/mb-049/archive --approve --allow-hurt-fixtures ; echo "allowed-exit=$?" ;<br>node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('/tmp/mb-049/report.json','utf8'));const d=fs.readFileSync('/tmp/mb-049/improvement/agent-improvement-dashboard.md','utf8');console.log('outcomeScoreDelta='+r.outcomeScoreDelta);console.log('hurt='+r.fixtureDeltaSummary.hurt+' helped='+r.fixtureDeltaSummary.helped);console.log('dashboardHasDelta='+(d.includes('helped 1 / hurt 1')));"</pre> | `outcomeScoreDelta=12.5`; report has one helped and one hurt fixture; dashboard contains helped/hurt counts; first promotion exits 1 with `hurt fixtures detected`; second promotion exits 0 with `allowed-exit=0` and writes candidate content to the target. | Terminal transcript, `/tmp/mb-049/report.json`, `/tmp/mb-049/improvement/agent-improvement-dashboard.md`, promotion stderr/stdout, PASS/FAIL verdict. | PASS when delta emission, reducer summary, and hurt-fixture gate behavior all match the expected signals from the same run. | If deltas are null: check fixture baselines and output scores<br>If reducer lacks the summary: confirm `agent-improvement-state.jsonl` was passed as `--state-log`<br>If promotion succeeds without the override: inspect `hurtFixtureDeltas()` and the benchmark report shape |

### Optional Supplemental Checks

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste report summary, dashboard line, blocked/allowed promotion outputs]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `model-benchmark-mode/score-delta-benchmark-gates.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane B: Model-Benchmark) |
| `../../scripts/model-benchmark/run-benchmark.cjs` | Emits `outcomeScoreDelta`, `fixtureDeltas[]`, and `fixtureDeltaSummary` |
| `../../scripts/shared/reduce-state.cjs` | Summarizes benchmark delta rows into registry and dashboard output |
| `../../scripts/shared/promote-candidate.cjs` | Enforces negative-delta, missing-baseline, and hurt-fixture promotion gates |
| `../../scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts` | Automated benchmark delta emission coverage |
| `../../scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Automated promotion-gate coverage for negative/missing/hurt deltas |
| `../../scripts/shared/tests/reduce-state-mode-mix.vitest.ts` | Automated reducer summary coverage for benchmark deltas |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-049
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `model-benchmark-mode/score-delta-benchmark-gates.md`
