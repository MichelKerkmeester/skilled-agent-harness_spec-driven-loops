# Iteration 001 - Correctness

## Focus
Causal reference resolution and edge insertion correctness.

## Actions
- Read the causal links processor and checked exact, path, title, and fuzzy fallback resolution.
- Read graph metadata integration tests and handler helper tests to see which behavior is contractual.
- Traced `processCausalLinks` from parsed causal links into edge insertion.

## Findings

### F001 - P1 - Ambiguous causal references resolve to newest partial path/title match
The resolver falls back to `LIKE '%ref%'` for paths and titles, orders by newest ID, and returns the first row. `processCausalLinks` then uses that resolved ID to insert a graph edge. With repeated titles, common suffix paths, or cross-packet names, the wrong memory can be linked without an ambiguity signal.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:307`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:320`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:330`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:367`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:412`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:568`

Fix:
Reject ambiguous fuzzy matches, prefer exact spec folder or canonical path resolution, and require a unique candidate before insertion.

Claim adjudication packet:
```json
{
  "findingId": "F001",
  "claim": "Ambiguous causal references can resolve to the wrong newest partial path/title match.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:330"
  ],
  "counterevidenceSought": "Checked graph metadata integration and handler helper tests for exact-only or ambiguity rejection behavior.",
  "alternativeExplanation": "The fuzzy fallback may be intended for operator convenience when references are short.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if callers prove references are globally unique before processCausalLinks or fuzzy matches are only advisory and never inserted."
}
```

## Coverage
- correctness: covered
- security: pending
- traceability: pending
- maintainability: pending

Review verdict: CONDITIONAL
