---
title: "MB-042 -- Criteria-Exec Hardening Gate"
description: "Manual validation scenario for MB-042: Criteria-Exec Hardening Gate."
feature_id: "MB-042"
category: "Model-Benchmark Mode"
---

# MB-042 -- Criteria-Exec Hardening Gate

This document captures the canonical manual-testing contract for `MB-042`.

---

## 1. OVERVIEW

This scenario validates that `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in the 5-dim scorer: a `deterministic`-type acceptance criterion is skipped (marked not-passed) with a disabled detail rather than running its command, and the gate defaults permissive when unset.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Criteria-Exec Hardening Gate for the 5-dim scorer hardening env gate.
- Real user request: `Validate that DEEP_AGENT_ALLOW_CRITERIA_EXEC=0 skips deterministic criteria-driven shell exec in the 5-dim scorer.`
- Prompt: `Validate that DEEP_AGENT_ALLOW_CRITERIA_EXEC=0 refuses criteria-driven shell exec and the default (unset) stays permissive.`
- Expected execution process: Invoke the 5-dim scorer directly with a single `deterministic`-type acceptance criterion, once with the gate unset (default permissive) and once with `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`; capture stdout, stderr, and exit code; then execute the verification block against the same run artifacts.
- Expected signals: Default run (gate unset) executes the criterion: the `deterministic.acceptance.details.per_criterion` entry has `passed: true` with a `detail` like `exit=0 expected=0`, and `D1` equals `1.0`; gated run (`DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`) skips the criterion: the same entry has `passed: false` with `detail` containing `criteria exec disabled (DEEP_AGENT_ALLOW_CRITERIA_EXEC=0)`, and `D1` drops to `0.0`; the scorer does not throw in either run; the gated run never spawns the criterion command
- Note: the `D1: 1.0` default-run value holds because the minimal `# H\nbody` output does not trip the D2 bundle-gate hard gate (a hard-gate cap would force `D1: 0.0` regardless of acceptance). The decisive signal for this scenario is the `D1` change between the two runs plus the `criteria exec disabled` detail, not the absolute `1.0`.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: With the gate unset the deterministic criterion runs (`D1: 1.0`, `passed: true`); with `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` the criterion is skipped (`D1: 0.0`, `passed: false`, detail names the disabled gate) -- confirming the hardening gate refuses criteria-driven exec while the default stays permissive.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MB-042 | Criteria-Exec Hardening Gate | Validate Criteria-Exec Hardening Gate | `Validate that DEEP_AGENT_ALLOW_CRITERIA_EXEC=0 refuses criteria-driven shell exec and the default (unset) stays permissive.` | echo &#x27;default (gate unset): criterion runs&#x27; ; \<br>node -e &quot;require(&#x27;./.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs&#x27;).score({candidateId:&#x27;mb039&#x27;,outputText:&#x27;# H\nbody&#x27;,criteria:{acceptance:[{id:&#x27;d1&#x27;,type:&#x27;deterministic&#x27;,command:&#x27;true&#x27;}],requiredHeadings:[],requiredPatterns:[]},cwd:&#x27;/tmp&#x27;,graderKind:&#x27;noop&#x27;}).then(r=&gt;console.log(JSON.stringify({D1:r.dimensions.D1,crit:r.deterministic.acceptance.details.per_criterion})))&quot; ; \<br>echo &#x27;gated (=0): criterion skipped&#x27; ; \<br>DEEP_AGENT_ALLOW_CRITERIA_EXEC=0 node -e &quot;require(&#x27;./.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs&#x27;).score({candidateId:&#x27;mb039&#x27;,outputText:&#x27;# H\nbody&#x27;,criteria:{acceptance:[{id:&#x27;d1&#x27;,type:&#x27;deterministic&#x27;,command:&#x27;true&#x27;}],requiredHeadings:[],requiredPatterns:[]},cwd:&#x27;/tmp&#x27;,graderKind:&#x27;noop&#x27;}).then(r=&gt;console.log(JSON.stringify({D1:r.dimensions.D1,crit:r.deterministic.acceptance.details.per_criterion})))&quot; | Default run executes the criterion: `per_criterion` entry `passed: true`, detail like `exit=0 expected=0`, `D1: 1.0`; gated run skips the criterion: `per_criterion` entry `passed: false`, detail contains `criteria exec disabled (DEEP_AGENT_ALLOW_CRITERIA_EXEC=0)`, `D1: 0.0`; scorer does not throw in either run; gated run never spawns the criterion command | `terminal transcript, command output, and PASS/FAIL verdict` | With the gate unset the deterministic criterion runs (`D1: 1.0`, `passed: true`); with `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` the criterion is skipped (`D1: 0.0`, `passed: false`, detail names the disabled gate) -- confirming the hardening gate refuses criteria-driven exec while the default stays permissive. | If the gated run still executes the command: confirm the env value is exactly `0` and check the `process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC === '0'` branch in `score-model-variant.cjs`<br>If `D1` does not change between runs: confirm the criterion `type` is `deterministic` (the gate only guards the deterministic-exec branch, not `grep`/`grep_absent`)<br>If the scorer throws: capture the stack and confirm the per-criterion skip path pushes a result instead of raising |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

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
| `09--model-benchmark-mode/criteria-exec-gate.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane B: Model-Benchmark) |
| `../../scripts/model-benchmark/scorer/score-model-variant.cjs` | Ported 120/003 five-dimension scorer with the criteria-exec hardening gate |
| `../../scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner that routes 5dim scoring through the scorer |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-042
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--model-benchmark-mode/criteria-exec-gate.md`
