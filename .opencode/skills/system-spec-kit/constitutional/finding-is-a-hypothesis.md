---
title: "A Finding Is a Hypothesis Until You Open the Cited Code"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-14"
last_confirmed_source: "manual"
triggerPhrases:
  - subagent reported
  - agent says complete
  - reviewer found
  - treat finding as fact
  - over-report
  - explore lead
  - stale note
  - the agent claims
---

# A Finding Is a Hypothesis Until You Open the Cited Code

## Rule

A sub-agent's "COMPLETE", a reviewer's "this is a regression / P0", an Explore or research lead, or a stale note in a plan/README is a HYPOTHESIS — not fact — until you open the cited code and check it against the real symptom. Re-run the gate or read the diff yourself before acting on it; keep what holds and name what you discarded and why.

## Why

Across multi-agent runs, sub-agents claim done on work that was not, and reviewers inflate findings. The orchestrator already verifies scope and file-existence (orchestrate.md §5 Output Verification), but that does NOT confirm the substantive claim — the bug, the root cause, the "it works" — is real and active. Acting on an unconfirmed finding builds downstream steps on a state that is not true: the same failure mode as a false "done" (`verify-before-completion-claims.md`), but sourced from another agent. Agents over-report and contradict each other.

## How to apply

- A sub-agent returns `DONE`/`COMPLETE` → re-run its verification gate yourself before crediting it.
- A reviewer P0/P1 → open the cited `file:line`, confirm the symptom is real and active, before remediating.
- An Explore/research lead or a stale doc note is a pointer to verify, never ground truth.
- When two agents contradict, cite both, read the code once, adjudicate, and record what you ruled out. Consume-only verdict discipline still holds: never soften an active blocker without new evidence.
