# Multi-AI Council Strategy

## Purpose
Diagnose the true root cause of an agent judgment failure (hand-rolling a manual `cli-opencode`
gather across packet 135 instead of the plan-specified `/deep:start-context-loop`) and converge on
the single most durable, verifiable fix.

## Task Framing
- Task type: judgment/behavioral failure root-cause + durable governance fix (hybrid of bug-fix
  root-cause analysis and process governance).
- Expected deliverable: a root-cause verdict, ONE primary fix (checkable artifact), endorsed
  secondaries, recorded dissent, and the path(s) to write.

## Dispatch Mode
- Depth 1 (dispatched by orchestrator). Sequential inline deliberation via `sequential_thinking`.
  No sub-dispatch. NDP compliant.

## Selected Lenses (seats)
- Seat-001 — Critical / Failure-Analysis (temp 0.2): deepest verifiable causal chain.
- Seat-002 — Behavioral-Decision (temp 0.4): where a fix must LIVE to bind every runtime.
- Seat-003 — Tooling-Design / Pragmatic (temp 0.3): smallest tooling/discoverability artifact.
- Seat-004 — Process-Governance / Holistic (temp 0.4): plan-deviation surfacing gate.
- Critique round — Pragmatist-Critic (temp 0.2): HUNTER/SKEPTIC/REFEREE cross-critique.

## AI Vantage Targets (SIMULATED)
All external vantages (cli-claude-code, native @deep-research, cli-codex, cli-gemini) are
**simulated reasoning lenses**, not actual external dispatch. This runtime ran Depth-1 inline
deliberation only; no external AI system executed. Labeled honestly per agent contract.

## Evidence Inputs
- `.opencode/commands/deep/start-context-loop.md` lines 82 and 483 ("Seats are READ-ONLY
  analyzers; the host writes all merged state (Gate-3-safe)") and lines 168, 439-441 (cli-opencode
  + DeepSeek + MiMo executor seats are first-class).
- Auto-memory `speckit-deep-research-cli-opencode-pattern` (type: feedback) — a RESEARCH-loop
  orchestrator-writes pattern the agent over-generalized to the context loop.
- `.opencode/skills/deep-context/SKILL.md` — defines the right path; has a "When NOT to Use" block
  (lines 33-39) but NO anti-pattern entry against manual hand-rolling (grep-confirmed).
- `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md` — Skill Advisor fires
  on the user prompt, not at mid-execution self-initiated substitution.
- Packet `spec.md` — scopes in a council verdict + a behavioral/process correction and any small
  endorsed doc nudge; scopes OUT command core-behavior changes.

## Convergence Rule
`two-of-three-agree`. Declared converged when >= 2 seats endorse the same primary fix family and the
critique round surfaces no new high-severity finding.

## Known Constraints
- This agent writes only `ai-council/**`. The fix itself (CLAUDE.md / AGENTS.md / SKILL.md / memory)
  is implemented by the user or a write-capable agent under packet 137, with Gate-3 satisfied.
- Bash and Patch are denied; artifacts authored directly into `ai-council/**` (scoped write).
