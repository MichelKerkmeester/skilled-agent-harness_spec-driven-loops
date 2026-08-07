---
round: 1
seat: seat-003
executor: cli-codex
lens: "Tooling-Design / Pragmatic"
status: ok
timestamp: 2026-06-07T20:11:30.000Z
simulated: true
---

# seat-003: Tooling-Design / Pragmatic (cli-codex, SIMULATED)

## Mandate
Find the smallest tooling/discoverability change that makes the failure self-evidently wrong.
Success = a checkable artifact in a file the agent provably reads on the right path. Risk focus:
over-correcting into tooling churn the command does not need (the spec flags this risk explicitly).

## Proposed Plan
Add ONE anti-pattern line to `.opencode/skills/deep-context/SKILL.md` (extend the "When NOT to Use"
block at lines 33-39, or a small Anti-Patterns micro-section): "Do NOT hand-roll a manual
`gtimeout opencode run` / `cli-opencode` background sweep as a substitute for this loop. The loop
already provides host-writes-state (Gate-3-safe), convergence detection, and cross-executor
agreement; a manual dispatch silently discards all three. If you assume the loop has friction (e.g.
Gate-3 writes), READ this skill + the command doc to verify before substituting."

## Reasoning
- The command doc ALREADY states Gate-3-safety twice (lines 82, 483) and shows cli-opencode /
  DeepSeek / MiMo seats (168, 439-441). Adding MORE prose to the command doc is low-yield — the
  agent never opened it. You cannot fix "didn't read the doc" by hardening the doc it bypassed.
  This RULES OUT the spec's "doc nudge to the command" as the primary fix.
- The REAL, grep-verified gap: deep-context SKILL.md has a "When NOT to Use" list but NO anti-pattern
  against manual hand-rolling (grep for anti-pattern/hand-roll/manual-dispatch/reinvent/substitute =
  zero matches). The skill defines the right path but never warns against reinventing it.
- The SKILL.md is symlink-shared (commands/skills/specs are symlinks -> `.opencode/`), so ONE edit
  binds all three runtimes — no agent-mirror triad needed.

## Risks & Trade-offs
- A skill anti-pattern only catches the case where the agent IS considering the skill but tempted to
  hand-roll. It does NOT catch the never-engaged-the-skill path — which is exactly what happened.
  So as PRIMARY it fails the recurrence test for this incident; as SECONDARY it is the right hardening.
- A Bash-pattern lint/hook detecting `gtimeout opencode run &` is high-false-positive (sanctioned
  one-off cli dispatches exist per the cli-X SKILLs), heavy, and exactly the tooling churn the spec
  warns against. REJECTED.

## Assumptions and Evidence Gaps
- Assumes an agent that DOES engage the skill reads its "When NOT to Use" / Anti-Patterns section.
  Consistent with the skill-loading protocol.

## Alternative Challenged
- Rejected: a tool-call lint/hook for manual dispatches (over-correction); and command-doc prose
  hardening (bypassed surface).

## Confidence
75/100 — the SKILL.md gap is real and the fix is tiny + checkable + matches the spec's endorsed
doc-nudge scope; demoted from primary because it cannot bind the never-engaged-the-skill path.
