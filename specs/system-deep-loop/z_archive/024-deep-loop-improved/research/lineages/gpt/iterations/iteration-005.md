# Iteration 5: Fanout Merge Disposition

## Focus

Determine whether the silent registry-drop bug is still live.

## Findings

- `fanout-merge.cjs` now normalizes `findings` aliases into `keyFindings`, emits `schema_mismatch` warnings, and continues with coerced entries. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:474] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:485] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:492]
- Phase `009/001` confirms the real-data rerun now produced 26 merged `keyFindings`, so this bug should be treated as fixed, not still active. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance/implementation-summary.md:48] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance/implementation-summary.md:71]

## Novelty

newInfoRatio: 0.68. Important disposition update: fixed in code, pending registry adjudication.
