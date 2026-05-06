# Multi-AI Council Convergence Signals

## Default Signal

Use `two-of-three-agree` for v1. If 2 of 3 seats endorse essentially the same plan and cross-critique produces no new high-severity findings, declare convergence and write `council-report.md`.

Agreement means the seats align on the material plan: implementation order, core risks, dependencies, and acceptance criteria. They do not need identical wording.

## Escape Hatches

`max_rounds` reached without convergence: emit `council_complete` with `convergence:false`, preserve the competing plans, and recommend a user decision.

All seats fail in a round: do not fabricate convergence. Report the failed round with each seat status and ask for reframing or more context.

Single-seat endorsement: insufficient diversity. Re-run with stronger contrarian framing or a different vantage mix before calling the plan converged.

## Why Simple for v1

ADR-001 keeps the convention lightweight. Sophisticated convergence math is non-goal N1 because the packet needs auditable output persistence, not a deep-skill state machine.

## Validator Graduation

State schema and convergence fields are convention-only for v1. If drift appears in real council artifacts, graduate to a typed validator in a follow-on packet.

Cross-references:
- Agent body: `.opencode/agent/multi-ai-council.md` §16
- Decision record: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md` ADR-001 and ADR-003
