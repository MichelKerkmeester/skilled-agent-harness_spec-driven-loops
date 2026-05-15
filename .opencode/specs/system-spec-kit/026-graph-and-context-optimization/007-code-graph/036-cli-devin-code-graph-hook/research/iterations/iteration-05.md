# Iteration 05: Readiness Marker Freshness Handling + Devin Stop-Hook-Active Semantics

## Question

For stale readiness markers, should the Devin hook trigger bounded inline refresh or recommend `code_graph_scan`? Is Devin's `stop_hook_active` semantics relevant to code-graph session-end cleanup?

## Investigation Steps

1. **Read Claude session-prime.ts**: Examined stale-handling logic (lines 273-278)
2. **Analyzed freshness states**: Reviewed the four freshness states (fresh, stale, empty, error)
3. **Evaluated inline refresh**: Considered bounded refresh vs recommendation pattern
4. **Reviewed Devin Stop hook semantics**: Checked Devin documentation for `stop_hook_active`

## Findings

### Finding 1: Claude Variant Shows Stale Warning Pattern

The Claude session-prime.ts (lines 273-278) emits a warning for stale state but does NOT trigger inline refresh:

```typescript
if (startupBrief?.graphState === 'stale') {
  sections.push({
    title: 'Stale Code Graph Warning',
    content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
  });
}
```

The pattern is: warn + recommend manual `code_graph_scan`, not auto-refresh.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts" lines="273-278" />

### Finding 2: Freshness States and Handling

The four freshness states from readiness-marker.ts:
- **fresh**: Ready to use, no action needed
- **stale**: Data exists but is outdated; recommend `code_graph_scan`
- **empty**: No index exists; recommend `code_graph_scan`
- **error**: Marker read failed; recommend investigation

The Claude hook treats stale and empty similarly (recommend scan), while error gets a different message.

### Finding 3: Inline Refresh is Out of Scope for Hooks

Hooks should be fast (<2s timeout). Inline code graph scan can take much longer. The established pattern is to recommend manual scan rather than auto-refresh in the hook.

**Rationale**: Hooks are for context injection, not heavy operations. Let the user or agent decide when to scan.

### Finding 4: Devin Stop-Hook-Active Semantics

Devin's Stop hook receives `{stop_hook_active: bool}` per the lifecycle hooks documentation. This indicates whether a stop hook is already active (to prevent infinite loops).

For code-graph session-end cleanup, this is **out of scope** for this packet because:
1. The existing SessionStart hooks don't do session-end cleanup
2. SessionEnd cleanup would be a separate hook (SessionEnd event), not Stop
3. The current scope is only SessionStart hook variant

**Evidence**: Devin lifecycle hooks docs document Stop event with `stop_hook_active` field.

## Confidence

**HIGH** - The pattern is clear from existing implementation and hook constraints.

## Open Follow-Ups

None - this question is fully resolved.

## Recommendation

**Mirror Claude pattern**: The Devin variant (if implemented) should mirror the Claude stale-handling logic exactly:
- Emit a warning section for stale state
- Recommend `code_graph_scan` for broader stale states
- Do NOT attempt inline refresh in the hook

**Stop-hook relevance**: Out of scope for this packet. SessionEnd cleanup would be a separate future enhancement if needed.

## Actionable

**YES** - This finding defines the stale-handling logic for any explicit Devin variant.

## Category

hook-behavior
