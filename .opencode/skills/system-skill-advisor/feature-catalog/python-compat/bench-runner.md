---
title: "Python Bench Runner (skill_advisor_bench.py)"
description: "Performance bench runner that measures shim and native latency against the documented envelope (cache-hit p95 <= 50 ms, uncached p95 <= 60 ms)."
trigger_phrases:
  - "python bench runner"
  - "skill_advisor_bench.py"
  - "advisor latency bench"
  - "cache-hit uncached p95"
version: 0.8.0.14
---

# Python Bench Runner (skill_advisor_bench.py)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Keep latency visible from the Python surface so routing performance regressions are caught quickly without needing a TypeScript test harness.

## 2. HOW IT WORKS

`scripts/skill_advisor_bench.py` drives the bench measurements. The design envelope is `cache-hit p95 <= 50 ms` and `uncached p95 <= 60 ms`, design ceilings rather than enforceable CI gates, since p95 timing varies with sandbox load. Current stable-workstation measurements are 6.989 ms (cache-hit p95) and 11.45 ms (uncached p95), well within the envelope. Daemon-side idle measurements are 0.031% CPU and 5.516 MB RSS. The CI wrapper at `mcp-server/stress-test/skill-advisor/python-bench-runner-stress.vitest.ts` verifies the subprocess surface and JSON envelope shape. Tightened p95 gating belongs in a stable benchmark environment, not the stress suite.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor_bench.py` | Script | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/bench/` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [PC-005](../../manual-testing-playbook/python-compat/bench-runner.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Python compat
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `python-compat/bench-runner.md`

Related references:

- [01-cli-shim.md](../../feature-catalog/python-compat/cli-shim.md).
- [02-regression-suite.md](../../feature-catalog/python-compat/regression-suite.md).
- [`mcp-surface/advisor-validate.md`](../../feature-catalog/mcp-surface/advisor-validate.md).
