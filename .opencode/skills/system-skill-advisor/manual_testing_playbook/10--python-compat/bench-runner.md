---
title: "PC-005 Python Bench Runner"
description: "Manual validation that scripts/skill_advisor_bench.py runs the performance bench and emits latency measurements within documented limits."
trigger_phrases:
  - "pc-005"
  - "python bench"
  - "skill_advisor_bench.py"
  - "latency bench runner"
---

# PC-005 Python Bench Runner

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `scripts/skill_advisor_bench.py` runs the performance bench, measures latency for shim-driven calls and emits results within the documented envelope (cache-hit p95 <= 50 ms, uncached p95 <= 60 ms at the native level).

---

## 2. SCENARIO CONTRACT

- Repo root. Python 3 available.
- MCP server built.
- System load low enough for stable latency measurement (no heavy concurrent jobs).

---

## 3. TEST EXECUTION

1. Run the bench:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py \
  --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 1 \
  --out /tmp/skill-advisor-bench.json
```

`--dataset` is required. `--runs 1` is a fast smoke-test convenience; use a higher `--runs` (default 7) for a stable latency baseline on a calibrated host.

2. Capture stdout and the `--out` JSON report.
3. Record the `inprocess_warm`, `subprocess_one_shot`, and `batch_mode` p50/p95 latencies and the `throughput_multiplier`.
4. Confirm no runtime warnings about native unavailability when native is expected to be up.

### Expected Signals

- Bench completes without errors and emits a JSON report (and writes `--out` when provided).
- `gates.warm_p95` passes: in-process warm p95 <= 50 ms (the documented design envelope).
- `gates.throughput_multiplier` passes: batch throughput is >= 2x the subprocess one-shot path (the blocking regression gate).
- `gates.cold_p95` is **advisory** by default: subprocess one-shot p95 measures per-prompt Python + Node bridge startup, not native scorer latency, so it does not block `overall_pass` unless `--enforce-cold-p95` is passed on a calibrated host (`cold_p95_advisory: true` appears in the report).
- `overall_pass` is `true` (warm_p95 + throughput_multiplier) on a nominal workstation; exit code 0.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing `--dataset` error | `error: the following arguments are required: --dataset` | Pass `--dataset <jsonl>` (see command above). |
| warm_p95 or throughput_multiplier fails | `gates` shows a blocking gate `false` | Investigate a real Python-surface regression. Block release if repeatable. |
| cold_p95 fails (advisory) | `gates.cold_p95` false while `overall_pass` true | Expected on shared/loaded hosts; calibrate, then pass `--enforce-cold-p95` only on a stable bench host. |
| Bench hangs | No output after expected runtime | Check daemon health per AU-003 and OP-003. |

---

## 4. SOURCE FILES

- Scenario [PC-004](./regression-suite.md), regression suite.
- Scenario [NC-003](../01--native-mcp-tools/native-validate-slices.md), native validate latency slice.
- Feature [`08--python-compat/bench-runner.md`](../../feature_catalog/08--python-compat/bench-runner.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 10--python-compat/bench-runner.md
