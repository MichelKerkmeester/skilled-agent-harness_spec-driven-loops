# Iteration 004 - Maintainability

## Focus

Policy conformance, comment hygiene, and operator-facing maintainability in reviewed code.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts`
- `.opencode/skills/system-code-graph/mcp_server/core/config.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/system-skill-advisor/SKILL.md`

## Findings

### F004 - P1 - Reviewed code contains ephemeral phase, packet, and ADR labels in comments

The active project instructions hard-block ephemeral tracking labels in code comments, including packet/phase numbers and ADR ids. The reviewed code still contains phase-slot comments in the code-graph dispatch table [SOURCE: .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:14], phase-slot comments in the tool name list [SOURCE: .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:33], an ADR reference in a config comment [SOURCE: .opencode/skills/system-code-graph/mcp_server/core/config.ts:19], and a packet-number reference in the fan-out pool header [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:8].

Impact: this is not a runtime bug, but it is a direct policy drift in reviewed code that can block future pre-commit/comment-hygiene gates and keeps perishable implementation history embedded in source files.

Concrete fix: replace these comments with durable reasons only. For example, say the slot exists for future code-graph tool expansion, the DB location supersedes a former shared location, and the ledger mirrors the existing orchestration status shape, without storing phase numbers, packet numbers, ADR ids, or spec paths in comments.

Claim adjudication:

```json
{
  "findingId": "F004",
  "claim": "Reviewed code contains ephemeral phase, packet, and ADR labels in comments despite the active comment-hygiene hard block.",
  "evidenceRefs": [
    ".opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:14",
    ".opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:33",
    ".opencode/skills/system-code-graph/mcp_server/core/config.ts:19",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:8"
  ],
  "counterevidenceSought": "Checked whether these were test names or generated artifacts; the cited examples are source comments in reviewed runtime files.",
  "alternativeExplanation": "The labels may have helped migration tracking, but the durable reason can be preserved without the perishable identifiers.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if the comment-hygiene gate is rescoped to new edits only and explicitly allows legacy comments in these files.",
  "transitions": []
}
```

## P0 Replay

No P0 finding asserted.

Review verdict: CONDITIONAL
