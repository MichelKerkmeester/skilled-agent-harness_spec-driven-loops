---
iter: 001
dimensions: ["correctness", "completeness"]
timestamp: 2026-05-15T05:35:55.218Z
---
# Iteration 001

## SCOPE VIOLATIONS

None.

## Findings

| ID | Severity | Title | Location (file:line) | Category | Recommendation |
|----|----------|-------|----------------------|----------|----------------|
| 017-iter001-P1-001 | P1 | Doctor router frontmatter grants non-existent mk-spec-memory code-graph, ccc, and advisor tools | .opencode/commands/doctor.md:4 | integration/correctness | Change code_graph/detect_changes/ccc entries to `mcp__mk_code_index__*` and advisor entries to `mcp__mk_skill_advisor__*`, matching the extracted server ownership. |

findings_summary: { p0: 0, p1: 1, p2: 0, new_findings: 1 }
