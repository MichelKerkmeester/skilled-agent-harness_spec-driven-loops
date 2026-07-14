---
round: 1
seat: seat-003
executor: native-explore
lens: Pragmatic
status: ok
timestamp: 2026-06-30T12:00:00.000Z
simulated: false
---

# Seat 003 — Pragmatic / Native Explore Lens

## Proposed Plan
Use the existing packet. Add this as a follow-up task/evidence update rather than opening a new top-level spec. Implement in this order: README retarget, pre-commit cleanup, command asset cleanup, active skill hook deletion, policy/test/doc cleanup, final sweeps.

## Reasoning
The prior Level 3 packet is already the deprecation context. This is a scope expansion from exact `cli-codex` to generic active Codex references, not a separate feature.

## Risks & Trade-offs
Minimal edits reduce risk, but hook deletion should be verified with syntax checks and active grep. Do not blindly retarget every Codex mention to Claude/OpenCode unless behavior is equivalent.

## Assumptions and Evidence Gaps
Generated command assets may require regeneration rather than hand editing; implementation agent must check repository convention.

## Alternative Challenged
Do not create a new deprecation packet; it would fragment context and duplicate prior decisions.

## Confidence
84/100 — practical route is clear; exact test list depends on changed files.
