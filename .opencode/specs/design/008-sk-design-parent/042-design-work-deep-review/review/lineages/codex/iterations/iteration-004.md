# Iteration 4: Maintainability - Runtime Parity And Operability

## Focus

Dimension: maintainability.

Compared the three runtime design agent definitions against the `sk-design` hub contract and the shared context-loading contract.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.08

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F004**: OpenCode design agent has broader permissions than Claude and Codex design agents. [SOURCE: .opencode/agents/design.md:13]
  The OpenCode design agent grants `webfetch: allow` and `external_directory: allow`, while the Claude design agent lists only `Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*` and Codex sets `workspace-write` with no WebFetch parity. This may be intentional for OpenCode, but it is not documented in the shared agent body and can produce runtime-specific design behavior. [SOURCE: .claude/agents/design.md:4] [SOURCE: .codex/agents/design.toml:5]

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| skill_agent | partial | advisory | .opencode/agents/design.md:55; .claude/agents/design.md:41; .codex/agents/design.toml:45 | Workflow text agrees, permissions differ. |
| agent_cross_runtime | partial | advisory | .opencode/agents/design.md:13; .claude/agents/design.md:4; .codex/agents/design.toml:5 | Permission parity drift captured as F004. |

## Assessment

- New findings ratio: 0.08
- Dimensions addressed: maintainability
- Novelty justification: one advisory cross-runtime drift; no new required finding.

## Ruled Out

- Core agent workflow drift: all three agents instruct loading the hub before mode selection and verifying before completion. [SOURCE: .opencode/agents/design.md:55] [SOURCE: .claude/agents/design.md:41] [SOURCE: .codex/agents/design.toml:45]

## Dead Ends

- None.

## Recommended Next Focus

Stabilization replay of active findings and stop-gate evidence.
Review verdict: PASS
