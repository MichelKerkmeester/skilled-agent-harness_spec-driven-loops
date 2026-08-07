# Review Iteration 013

## Dimension

Correctness: complete producer-to-consumer sweep across the runtime surfaces.

## Files Reviewed

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:214-275`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:149-169`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209-243`
- `.opencode/plugins/mk-skill-advisor.js:620-653,930-961`
- `.opencode/plugins/mk-spec-memory.js:430-520`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:281-314`

## Findings by Severity

### P1

- **F001 carried forward.** Claude and OpenCode both reach the shared record path with identity-derived confirmation; Pi has an unconditional shadow confirmation call. The cross-runtime sweep found no host receipt adapter in these paths.
- **F002 carried forward.** Both OpenCode transforms consume the same collision-prone identity helper.

### P2

- **F003 carried forward.** Runtime code review does not alter the parent metadata drift.
- **F004 carried forward.** Gate-3 remains independently vulnerable at its component-composition boundary.

## Traceability Checks

- `spec_code`: partial — all inspected producers preserve baseline output, but evidence state is not uniformly trustworthy.
- `checklist_evidence`: partial — cross-runtime parity has no negative receipt-provenance row.
- `agent_cross_runtime`: partial — the mismatch is confirmed across Claude, OpenCode, and Pi.

## Next Dimension

Security: activation boundary and fail-open behavior under unknown or ambiguous evidence.

Review verdict: CONDITIONAL
