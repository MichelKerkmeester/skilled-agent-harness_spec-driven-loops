---
title: "SB-043 -- Mode Wiring And Routing via loop-host"
description: "Manual validation scenario for SB-043: Mode Wiring And Routing via loop-host."
feature_id: "SB-043"
category: "Skill_Benchmark Mode"
version: 1.17.0.6
---

# SB-043 -- Mode Wiring And Routing via loop-host

This document captures the canonical manual-testing contract for `SB-043`.

---

## 1. OVERVIEW

This scenario validates that `scripts/shared/loop-host.cjs` registers `skill-benchmark` as a valid `--mode` value and that `planInvocation('skill-benchmark', ...)` resolves to a single orchestrator step — `run-skill-benchmark.cjs` — while an unknown `--mode` warns to stderr and falls back to `agent-improvement`. `VALID_MODES` in `loop-host.cjs` carries `agent-improvement`, `model-benchmark`, and `skill-benchmark`; `LANE_SKILL_BENCHMARK` maps `run-skill-benchmark.cjs` to `../skill-benchmark/`; and `SKILL_BENCHMARK_RUN_OPTIONS` (`fixtures-dir`, `output`, `trace-mode`, `advisor-mode`) is the exact forwarded optional-flag set. `resolveMode()` returns `agent-improvement` for any value not in `VALID_MODES` after writing the fallback notice to stderr.

---

## 2. SCENARIO CONTRACT

- Objective: Validate that loop-host routes `--mode=skill-benchmark` to the single `run-skill-benchmark.cjs` orchestrator step, keeps the default route on `score-candidate.cjs`, and warns-and-falls-back on an unknown mode.
- Real user request: `Confirm that loop-host --mode=skill-benchmark runs the skill-benchmark orchestrator and that an unknown mode falls back to agent-improvement.`
- Prompt: `Verify that loop-host routes skill-benchmark mode to the run-skill-benchmark orchestrator and that an unknown mode warns and falls back to agent-improvement.`
- Expected execution process: Run `loop-host.cjs --mode=skill-benchmark` against a router-bearing skill into a disposable outputs dir, then run `loop-host.cjs --mode=bogus` to exercise the fallback path; capture stdout, stderr, exit code, and generated artifacts; then execute the verification block against the same run artifacts.
- Expected signals: the skill-benchmark run exits 0; stdout carries `skill-benchmark: cli-opencode verdict=<...> aggregate=<...> scenarios=<...>` plus the two `report.json ->` / `report.md ->` lines; `skill-benchmark-report.json` and `skill-benchmark-report.md` exist in the outputs dir; the JSON `mode` field equals `skill-benchmark`; the unknown-mode run writes `loop-host: unknown mode 'bogus', defaulting to 'agent-improvement'` to stderr; the unknown-mode run does NOT produce a skill-benchmark report (it falls into the agent-improvement plan, which fails closed on the missing `--candidate`).
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence from the command output and verification checks.
- Pass/fail: PASS when the skill-benchmark route emits the dual report with `mode: "skill-benchmark"` and exit 0, and the unknown mode warns to stderr and never writes a skill-benchmark report; FAIL otherwise.

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
| SB-043 | Mode Wiring And Routing via loop-host | Validate skill-benchmark mode routing and unknown-mode fallback | `Verify that loop-host routes skill-benchmark mode to the run-skill-benchmark orchestrator and that an unknown mode warns and falls back to agent-improvement.` | rm -rf /tmp/sb-043 &amp;&amp; mkdir -p /tmp/sb-043/out &amp;&amp; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \<br>  --mode=skill-benchmark \<br>  --skill=cli-opencode \<br>  --outputs-dir=/tmp/sb-043/out ; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \<br>  --mode=bogus \<br>  --skill=cli-opencode \<br>  --outputs-dir=/tmp/sb-043/out 2&gt; /tmp/sb-043/unknown-mode.stderr ; \<br>node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('/tmp/sb-043/out/skill-benchmark-report.json','utf8'));console.log('mode='+r.mode);console.log('hasMd='+fs.existsSync('/tmp/sb-043/out/skill-benchmark-report.md'));console.log('warn='+fs.readFileSync('/tmp/sb-043/unknown-mode.stderr','utf8').trim());" | skill-benchmark run exits 0; stdout has `skill-benchmark: cli-opencode verdict=` plus `report.json ->` and `report.md ->` lines; `skill-benchmark-report.json` + `skill-benchmark-report.md` present; `mode=skill-benchmark`; `hasMd=true`; unknown-mode stderr contains `loop-host: unknown mode 'bogus', defaulting to 'agent-improvement'`; unknown-mode run does not write a skill-benchmark report (falls into agent-improvement, which fails closed without `--candidate`) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when the skill-benchmark route emits the dual report with `mode: "skill-benchmark"` at exit 0 and the unknown mode warns to stderr without producing a skill-benchmark report; FAIL otherwise. | If no report is written: confirm `planInvocation('skill-benchmark', ...)` returns one step `run-skill-benchmark.cjs` and that `--skill` + `--outputs-dir` are both present (it fails closed otherwise)<br>If the unknown mode does not warn: check `resolveMode()` writes the fallback notice to stderr and that `bogus` is absent from `VALID_MODES`<br>If `mode` is not `skill-benchmark`: inspect `aggregate()` in `score-skill-benchmark.cjs`, which sets the report `mode` field |

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
| `skill-benchmark/mode-wiring-routing.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane C: Skill-Benchmark) |
| `../../scripts/shared/loop-host.cjs` | Mode-switching entry point; resolves `--mode=skill-benchmark` and plans the single orchestrator step |
| `../../scripts/skill-benchmark/run-skill-benchmark.cjs` | Lane C orchestrator the skill-benchmark mode resolves to |
| `../../references/skill_benchmark/operator_guide.md` | Canonical invocation + Mode A pipeline reference |

---

## 5. SOURCE METADATA

- Group: Skill-Benchmark Mode
- Playbook ID: SB-043
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `skill-benchmark/mode-wiring-routing.md`
