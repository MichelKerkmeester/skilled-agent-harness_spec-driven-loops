---
title: "017: Deep-Review Campaign 010-016"
description: |
  Deep-review of the 7-packet code-graph remediation campaign shipped 2026-05-14.
  10 iterations across 4 dimensions (Correctness, Security, Traceability, Maintainability).
status: complete
urgency: normal
created_at: "2026-05-14"
completed_at: "2026-05-14"
---

# 017: Deep-Review Campaign 010-016

## Outcome

CONDITIONAL verdict — 0 P0, 1 P1, 19 P2 findings. MCP rename is complete and correct in all production code paths. P1 is a documentation clarity issue (skill slug vs MCP namespace naming), not a functional defect.

## Findings Summary

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 |
| P2 | 19 |

### P1 (1)

- **F002**: SKILL.md `name: system-code-graph` vs MCP namespace `mk-code-index` — `.opencode/skills/system-code-graph/SKILL.md:2`

### Key P2 Themes

- Stale documentation (architecture.md open questions)
- Naming discoverability gaps (launcher error messages, config table)
- Feature catalog vs tool count reconciliation
- Operational resilience (lock staleness detection)