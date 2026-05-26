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
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py
```

2. Capture stdout and any emitted summary file (check `bench/` directory).
3. Record p50 and p95 latencies for cache-hit and uncached paths.
4. Confirm no runtime warnings about native unavailability when native is expected to be up.

### Expected Signals

- Bench completes without errors.
- Cache-hit p95 <= 50 ms for native path.
- Uncached p95 <= 60 ms for native path.
- Documented measured values (`0.031% idle CPU`, `5.516 MB RSS`, `6.989 ms` cache-hit p95, `11.45 ms` uncached p95) remain reproducible within reasonable system variance.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| p95 exceeds budget | Summary shows latency over threshold | Investigate regression. Block release if repeatable. |
| Bench hangs | No output after expected runtime | Check daemon health per AU-003 and OP-003. |
| Cache-hit missing | All runs show uncached latency | Verify prompt cache wiring in `lib/prompt-cache.ts`. |

---

## 4. SOURCE FILES

- Scenario [PC-004](./004-regression-suite.md), regression suite.
- Scenario [NC-003](../01--native-mcp-tools/003-native-validate-slices.md), native validate latency slice.
- Feature [`08--python-compat/03-bench-runner.md`](../../feature_catalog/08--python-compat/03-bench-runner.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 10--python-compat/005-bench-runner.md
