# Iteration 004: Maintainability

## Focus

Reviewed storage-free fakes against the real contention policy and the stated testability purpose of the port layer.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F004**: `FakeContentionPolicy` omits retry-delay and abort parity. The real policy derives attempts from `retryDelaysMs` and checks `shouldAbort` before and after retry sleeps; the fake defaults to one attempt unless `attempts` is explicitly supplied and never checks `shouldAbort`. Tests using the fake can miss cancellation and retry-count behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:246-264] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/contention-policy.ts:120-138] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/contention-policy.ts:183-191]

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:246-264` | Fakes exist but do not fully match real retry semantics. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: maintainability
- Novelty justification: New fake-parity gap, advisory severity because current production behavior remains unchanged.

## Ruled Out

- Escalating to P1: this is a test double parity risk, not confirmed production behavior drift.

## Dead Ends

- None.

## Recommended Next Focus

Resource-map coverage gate and then stabilization replay.

Review verdict: PASS
