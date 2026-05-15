---
iter: 003
dimensions: ["regression-risk", "correctness"]
timestamp: 2026-05-15T05:35:55.218Z
---
# Iteration 003

## SCOPE VIOLATIONS

None.

## Findings

| ID | Severity | Title | Location (file:line) | Category | Recommendation |
|----|----------|-------|----------------------|----------|----------------|
| 017-iter003-P1-001 | P1 | Memory manage command still documents ccc_* calls under mk-spec-memory | .opencode/commands/memory/manage.md:4 | regression-risk/integration | Move `ccc_status`, `ccc_reindex`, and `ccc_feedback` references in frontmatter and examples to `mcp__mk_code_index__*`. |

findings_summary: { p0: 0, p1: 1, p2: 0, new_findings: 1 }
