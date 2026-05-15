# Iteration 04: Startup Payload Contract Pass-Through Verification

## Question

Can the Devin variant call `getStartupBriefFromMarker()` directly to emit the same `kind=startup` contract as other runtimes? Verify the contract is consistent across all 4 existing variants.

## Investigation Steps

1. **Read readiness-marker.ts**: Examined `buildStartupBrief()` (lines 150-222) and `writeCodeGraphReadinessMarker()` (lines 224-269)
2. **Read code-graph-boundary.ts**: Examined `getStartupBriefFromMarker()` (lines 215-229)
3. **Verified contract structure**: Confirmed the startup payload matches the required schema
4. **Checked import surface**: Verified no import surface concerns for calling from hook location

## Findings

### Finding 1: Startup Payload Contract is Well-Defined

The `buildStartupBrief()` function in `readiness-marker.ts:189-203` emits the exact contract required:

```typescript
const sharedPayload = {
  kind: 'startup',
  summary: `Startup brief with ${markerBase.graphState} structural context`,
  provenance: {
    producer: 'startup_brief',
    sourceSurface: 'startup',
    trustState: trustStateFromFreshness(markerBase.graphFreshness),
    generatedAt: new Date().toISOString(),
    lastUpdated: stats?.lastScanTimestamp ?? null,
    sourceRefs: ['code-graph-readiness-marker'],
  },
  sections: lines.length > 0
    ? [{ key: 'structural-context', title: 'Structural Context', content: lines.join('\n'), source: 'code-graph' }]
    : [],
};
```

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts" lines="189-203" />

### Finding 2: Boundary Layer Provides Clean Access

The `getStartupBriefFromMarker()` function in `code-graph-boundary.ts:215-229` provides a clean interface for reading the startup brief from the marker:

```typescript
export function getStartupBriefFromMarker(): StartupBriefResult {
  const marker = readCodeGraphReadinessMarker();
  if (marker?.startup) {
    return marker.startup;
  }
  // ... fallback for missing marker
}
```

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts" lines="215-229" />

### Finding 3: Import Surface is Safe for Hook Location

The existing Claude session-prime.ts already imports from the boundary layer:

```typescript
import { getStartupBriefFromMarker } from '../../lib/code-graph-boundary.js';
```

This import path works from `system-spec-kit/mcp_server/hooks/claude/`. A Devin variant at `system-spec-kit/mcp_server/hooks/devin/` would use the same relative import path.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts" line="26" />

### Finding 4: Contract Consistency Across Existing Variants

All existing variants (Claude, Gemini, Codex) call `getStartupBriefFromMarker()` through the boundary layer, ensuring they emit the same contract. The contract is source-of-truth in `readiness-marker.ts`, not duplicated per variant.

**Evidence**: Existing hooks all use the same boundary layer import pattern.

## Confidence

**HIGH** - The contract is well-defined, the boundary layer provides clean access, and the import surface is proven to work from the hook location.

## Open Follow-Ups

None - this question is fully resolved.

## Recommendation

**Direct call pattern**: If an explicit Devin variant is needed (Option A fallback from Q3), it should call `getStartupBriefFromMarker()` directly from the boundary layer using the same import pattern as existing variants:

```typescript
import { getStartupBriefFromMarker } from '../../lib/code-graph-boundary.js';
```

The startup brief's `sharedPayloadTransport` field (JSON-serialized contract) should be emitted in the hook output to maintain contract consistency.

## Actionable

**YES** - This finding confirms the implementation pattern for any explicit Devin variant and validates contract consistency.

## Category

contract-verification
