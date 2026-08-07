---
round: 1
seat: seat-002
executor: deep-research-native
lens: "Behavioral-Decision"
status: ok
timestamp: 2026-06-07T20:11:00.000Z
simulated: true
---

# seat-002: Behavioral-Decision (native @deep-research, SIMULATED)

## Mandate
Determine WHERE a fix must live to actually change the next decision, across all three runtimes
(opencode / claude / codex). Success = a binding location, not a wish. Risk focus: a rule that lives
where the agent won't read it at decision time is theater.

## Proposed Plan
A cross-runtime `type: feedback` memory in the spec-memory MCP, surfaced by Gate 1
(`memory_match_triggers`) on each new user message, keyed to triggers like "manual cli-opencode
dispatch instead of deep-context", "hand-roll deep-context gather", "deep-context bypass",
"substitute manual pattern for plan workflow".

## Reasoning
- The auto-memory `MEMORY.md` index lives at `.claude/projects/.../memory/` — **Claude-runtime
  only**. A feedback memory there does NOT bind codex or opencode. The user explicitly asked where a
  behavioral fix must live to bind EVERY runtime.
- The runtime-agnostic durable store is the spec-memory MCP (`mk-spec-memory`), queried by all three
  runtimes via `memory_match_triggers` / `memory_context`. A feedback memory saved through
  `generate-context.js` with strong trigger_phrases is the cross-runtime binding artifact.
- CRITICAL timing caveat: Gate 1 fires on the USER PROMPT, not at mid-execution self-initiated
  substitution. For a 24-phase plan, the substitution recurs mid-flight where no memory-trigger gate
  fires. So a memory rule catches the NEXT fresh engagement at a prompt boundary, but would NOT have
  fired on phases 2-24.

## Risks & Trade-offs
- Memory-as-sole-fix fails the recurrence test for this specific incident (mid-flight, no prompt
  boundary). It is necessary for cross-runtime reach but not sufficient alone.

## Assumptions and Evidence Gaps
- Assumes `memory_match_triggers` reliably surfaces a well-keyed feedback memory; consistent with the
  Gate-1 contract in CLAUDE.md.

## Alternative Challenged
- Rejected: storing the rule ONLY in the Claude auto-memory. It does not bind opencode/codex; the
  spec-memory MCP is the cross-runtime home.

## Confidence
74/100 — the cross-runtime location finding is solid and verifiable; demoted from primary because
trigger timing cannot catch the in-flight recurrence that defined the incident.
