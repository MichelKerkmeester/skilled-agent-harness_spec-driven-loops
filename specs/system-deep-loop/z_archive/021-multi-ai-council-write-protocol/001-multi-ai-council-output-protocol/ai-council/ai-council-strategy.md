# Council Strategy: Packet 080 v1.1+ Default Persistence Pattern

## Purpose

Recommend the long-term default for how `@multi-ai-council` artifacts get persisted to `<packet>/ai-council/`: agent-side writes (option a) versus orchestrator-mediated writes (option b). The decision seeds follow-on packet 081's spec.

## Task Framing

Packet 080 ships the `ai-council/` subfolder convention with the agent currently in `write: deny` mode (planning-only invariant). The implementation summary noted two enable paths for live writes:
- **(a)** Grant `@multi-ai-council` `write: allow` (matching deep-research/deep-review pattern), agent self-persists.
- **(b)** Keep agent planning-only; dispatching orchestrator persists artifacts based on the agent's report.

This dispatch (the smoke test for CHK-022/CHK-023) uses option (b): agent stays `write: deny`, orchestrator (Claude Code) writes the artifacts.

## Selected Lenses (Round 1)

| Seat | Lens | Vantage Target | Mandate |
|------|------|----------------|---------|
| seat-001 | Analytical | cli-claude-code (simulated) | Decompose architectural-symmetry argument; verify (a) is truly consistent with sibling deep-skills |
| seat-002 | Critical | cli-codex (simulated) | Attack option (a) hard; enumerate failure modes and attack surface |
| seat-003 | Pragmatic | cli-copilot (simulated) | What ships fastest, works reliably, minimizes 4-runtime mirroring tax |

Lens diversity satisfied: 3 distinct strategies. Vantage diversity satisfied: 3 distinct vantage targets (all simulated; no live external dispatch occurred).

## Evidence Inputs

- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/spec.md` (G6, REQ-002, SC-001 through SC-007)
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md` (ADR-001 lightweight bound)
- `.opencode/agents/multi-ai-council.md` §0, §12-§15
- `.opencode/agents/deep-research.md` permission block (`write: allow`)
- `.opencode/agents/deep-review.md` permission block (`write: allow`)
- Memory: `feedback_new_agent_mirror_all_runtimes.md` (4-runtime mirror tax)

## Convergence Rule

`two-of-three-agree`: declare convergence if 2+ seats endorse the same direction AND cross-critique produces no new high-severity findings that block the recommendation.

## Stop Conditions

- Convergence achieved: write `council-report.md` and `council_complete` event. Done.
- `max_rounds = 3` without convergence: emit `council_complete` with `convergence: false` and recommend user decision.
- All seats fail in a round: do not fabricate a recommendation; report failure.

## Output Expectations

`council-report.md` MUST include: composition table, comparison table, deliberation notes (per round), winning strategy, recommended plan, implementation steps, prerequisites, plan confidence, dropped alternatives, risks & mitigations, planning-only boundary statement.

## Known Constraints

- This is a smoke-test dispatch for packet 080's CHK-022 P0. The orchestrator (Claude Code) persists artifacts.
- Depth 1 (LEAF) — agent uses `sequential_thinking` inline, no Task-tool sub-dispatch.
- All vantage targets are simulated; honestly labeled.
