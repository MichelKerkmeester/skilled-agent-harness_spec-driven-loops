---
title: "Scripts: Deterministic Audit Report Gates"
description: "Python checkers that give the filled design-audit report structural evidence gates instead of prose claims."
---

# Scripts: Deterministic Audit Report Gates

---

## 1. OVERVIEW

`design-audit/scripts/` owns two deterministic gates that run against a filled audit report. Each one closes a spot where the report could otherwise claim a strong score or a ready verdict with prose alone.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `perf_evidence_check.py` | When the Performance score in the Five-Dimension Score table is greater than 2, requires the filled Performance Evidence table to carry a real metric value or an explicit not-assessed label. Checks presence only, not whether the metric came from a real run. |
| `polish_readiness_check.py` | Requires the polish-readiness row to carry an allowed verdict (`ready`, `blocked`, `not-assessed`) and makes `ready` depend on a fresh unfinished-marker (`TODO`/`FIXME`/`XXX`/`HACK`/`WIP`) scan of a target surface. |

## 3. VALIDATION

Run either checker from the repository root against a filled audit report.

```bash
python3 .opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py <report.md>
python3 .opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py --scan <surface> <report.md>
```

Exit 0 means satisfied, exit 1 means violated or unfilled, exit 2 means a usage, read, or parse error. Both accept `--json` for machine-readable output.

## 4. RELATED

- [`../SKILL.md`](../SKILL.md) - design-audit mode.
- [`../../shared/scripts/README.md`](../../shared/scripts/README.md) - shared checkers reused across sk-design modes, including the `md_table` row parser these scripts import.
