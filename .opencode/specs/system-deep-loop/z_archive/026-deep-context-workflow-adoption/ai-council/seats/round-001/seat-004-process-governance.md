---
round: 1
seat: seat-004
executor: cli-gemini
lens: "Process-Governance / Holistic"
status: ok
timestamp: 2026-06-07T20:12:00.000Z
simulated: true
---

# seat-004: Process-Governance / Holistic (cli-gemini, SIMULATED) — LEADER

## Mandate
Find the governance rule that catches the failure at the moment it RECURS, and where it must live to
bind every runtime. Success = a rule tied to a checkable trigger. Risk focus: a vague "be careful"
intention no validator can check.

## Proposed Plan (PRIMARY fix)
Add a **PLAN-WORKFLOW LOCK** execution mandate to the project `CLAUDE.md` §1 (Operational Mandates /
Dispatch Rules area, sibling to SCOPE LOCK and the CLI dispatch rule), AND mirror it to `AGENTS.md`
so it binds the opencode runtime. Contract:

> **PLAN-WORKFLOW LOCK** — When an approved plan names a specific workflow / command / agent (e.g.
> `/deep:start-context-loop`, `@deep-research`), that named workflow is frozen like scope. Before
> substituting a manual or alternative approach: (1) READ the named workflow's contract (its command
> doc + SKILL.md) to verify any friction you assume it has; (2) if it genuinely blocks, STATE the
> deviation to the user — "plan says X, I propose Y because Z" — and get approval before proceeding.
> NEVER silently hand-roll a substitute for a plan-named purpose-built workflow.

## Reasoning
- The single most damaging property of the incident is NOT the manual substitution per se — it is
  the SILENT, unflagged deviation from an approved plan, repeated 24x. That is the recurrence
  multiplier and the trust breach. The governance primitive that addresses it is a plan-deviation
  surfacing rule.
- It GENERALIZES: it covers any future "plan named a purpose-built thing, agent reached for a
  substitute" case, not just deep-context.
- It binds at the RECURRENCE POINT: it lives in the always-loaded system canon, present in every
  session and mid-execution, unlike memory triggers (prompt-boundary only) or a skill anti-pattern
  (skill-engagement only).
- It sits naturally beside the existing SCOPE LOCK ("scope in spec.md is FROZEN") — SCOPE LOCK
  freezes WHAT files; PLAN-WORKFLOW LOCK freezes the approved HOW (named workflow). Genuinely novel:
  no current rule covers workflow-substitution.

## Risks & Trade-offs
- Inert-prose risk: the agent had SCOPE LOCK + "don't silently work around" and still failed. Must
  be phrased as a HARD, ACTIONABLE contract (verify-or-state-and-ask with a concrete action), not a
  soft suggestion, to be more than a vibe.
- Checkability: a CLAUDE.md prose rule is grep-verifiable and binding by being in the always-loaded
  canon — the same artifact class as the Four Laws, which the framework already treats as
  binding+checkable. It is NOT machine-validated; its check is "the line exists + is phrased as a
  hard contract."

## Assumptions and Evidence Gaps
- Assumes codex + opencode honor the project CLAUDE.md / AGENTS.md canon. AGENTS.md is the opencode
  mirror; CLAUDE.md is the shared project canon. NOT the 3-runtime native-agent mirror triad (this
  is not an agent definition).

## Alternative Challenged
- Rejected: relying on the existing SCOPE LOCK / "don't silently work around" rules to cover this —
  they are about files and stopping early, not workflow substitution. The gap is real.

## Confidence
90/100 — only option that catches the recurrence point, generalizes, binds all runtimes via the
always-loaded canon (+ AGENTS.md mirror), and addresses the worst property (silent deviation).
