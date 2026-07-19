---
title: "Python Regression Dataset"
description: "skill_advisor_regression.py harness that runs the P0 regression dataset and reports pass/fail totals."
trigger_phrases:
  - "python regression suite"
  - "regression dataset"
  - "skill_advisor_regression.py"
  - "p0 regression dataset"
version: 0.8.0.13
---

# Python Regression Dataset

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Guarantee the Python compatibility surface does not regress on hand-curated P0 cases that have been stable since pre-027.

## 2. HOW IT WORKS

`scripts/skill_advisor_regression.py` reads the JSONL dataset at `scripts/fixtures/skill-advisor-regression-cases.jsonl` and exercises the Python scorer against each case. The current baseline is the checked-in cases passing with zero regressions under the ADR-007 parity rules. Exit code is 0 only when every case passes.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor_regression.py` | Script | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/fixtures/skill-advisor-regression-cases.jsonl` | Script | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/` | Automated test | Python/TS parity harness consuming the same corpus |
| `Playbook scenario [PC-004](../../manual-testing-playbook/python-compat/regression-suite.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Python compat
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `python-compat/regression-suite.md`

Related references:

- [01-cli-shim.md](../../feature-catalog/python-compat/cli-shim.md).
- [03-bench-runner.md](../../feature-catalog/python-compat/bench-runner.md).
- [`mcp-surface/advisor-validate.md`](../../feature-catalog/mcp-surface/advisor-validate.md).
