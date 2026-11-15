# Iteration 8: Angle 8 — ACP and other integration seams

## Focus

Vibe speaks the Agent Client Protocol. Is ACP a better dispatch surface than print mode for this repository, and what would it change in the fan-out?

## Actions Taken

1. Read the `vibe-acp` entrypoint and its argument parser.
2. Read the ACP agent's advertised capabilities, permission path, config options, usage updates and cancel semantics.
3. Compared the two surfaces against the fan-out's actual requirements: one process per lineage, exit code, machine-readable outcome, and bounded cost.
4. Reused the iteration-1 export contract as the print-mode baseline.

## Findings

1. `vibe-acp` takes only `-h`, `-v` and `--setup`. Everything that matters — model, agent profile, working directory, approvals — is negotiated over the protocol, so an ACP client configures a session rather than a command line. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:72-80]

2. The advertised capabilities are substantial: `load_session`, prompt capabilities with embedded context and images (no audio), and session capabilities for close, list and fork. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:518-527]

3. ACP routes approvals to the client: the agent calls `request_permission` with options derived from the call's required permissions and available path scopes. A headless ACP client can therefore answer approvals per call instead of pre-authorizing the whole run with `--auto-approve`. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:912-920]

4. ACP exposes three session config options — the session mode (agent profile), the model, and thinking (reasoning effort). That is the decisive difference from print mode, which has no reasoning-effort flag at all. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:1771-1776]

5. ACP streams usage updates carrying input, output, total and cached-read tokens plus the session cost in USD. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:1790-1800]

6. ACP supports turn-level cancel: the cancel request interrupts the agent and the waiting prompt request settles with a `cancelled` stop reason, so cancellation is a protocol outcome rather than a killed process. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:867-869]

7. ACP has no `export.json`. The print-mode `--output-dir` export — version, effective config, token usage, cost, stop reason and outcome, written on every exit — has no ACP counterpart; an ACP client would have to persist the stream itself to reconstruct the same record. [INFERENCE: based on the iteration-1 export contract and the ACP surface read here]

8. Against the fan-out's requirements, print mode wins on fit: one process per lineage, a closed exit-code taxonomy, and a durable outcome file map directly onto how `fanout-run.cjs` spawns, waits and audits. ACP would need a long-lived client, a session multiplexer, a permission policy and its own outcome persistence before it could replace any of that. [INFERENCE: based on iterations 1 and 7]

9. ACP wins on control: per-call approvals, mid-run cancel, session fork, and reasoning-effort selection are all things print mode cannot do. The honest recommendation is therefore print mode as the dispatch surface and ACP as an optional second mode for interactive or pivot work — not a replacement. [INFERENCE: based on findings 2-8]

## Ruled Out

- Replacing the print-mode dispatch with ACP in this phase: it would require a protocol client and an outcome-persistence layer before it produced a single finding, and it would lose the export contract the audit path already reads.
- Treating `vibe-acp` as a thin wrapper over `vibe -p`: it is a separate entrypoint with its own capability negotiation and no flag surface.

## Dead Ends

- Measuring ACP's real startup and per-turn latency against print mode. That needs an authenticated client and a live session, and the lineage's two-dispatch budget was already spent on the unauthenticated smoke in iteration 1.

## Edge Cases

- Ambiguous input: "better dispatch surface" could mean cheaper, more controllable or more observable. Answered on all three axes and named the winner per axis rather than declaring one overall winner.
- Contradictory evidence: none.
- Missing dependencies: no ACP client exists and no live session was run, so every ACP claim is a protocol-surface read, not an observed session. Marked as such.
- Partial success: the surface comparison is complete; the latency and reliability comparison is not. Status `complete` for the angle with that caveat.

## Sources Consulted

- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/entrypoint.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/controller.py`

## Questions Answered

- Is ACP a better dispatch surface than print mode for this repository, and what would it change in the fan-out? — Answered: print mode for dispatch, ACP as an optional control-rich mode.

## Questions Remaining

- ACP startup and per-turn latency versus print mode, which needs an authenticated client to measure.

## Assessment

- New information ratio: 1.0
- Questions addressed: Angle 8 (ACP and integration seams)
- Questions answered: 8 of 8 strategy key questions

## Reflection

- What worked and why: comparing on the fan-out's actual requirements rather than on protocol richness. ACP is unambiguously the richer protocol; it is not the better dispatch surface for a one-process-per-lineage runner, and separating "richer" from "better fit" is what made the recommendation usable.
- What did not work and why: there was no way to measure the cost side. Every latency claim would have needed an authenticated session, and the smoke budget was gone. The comparison is therefore structural, and says so.
- What I would do differently: reserve one live dispatch for the last angle instead of spending it on the first. The unauthenticated smoke was cheap to reason about but expensive to have spent.

## Recommended Next Focus

None — all eight angles are worked. The synthesis should merge the parity table from iteration 4 with the corrections from iteration 6, rank the build phases, and carry the four open questions: the `--output json` schema, the hook payload contract, the `vibe` versus `vibe-rs` process name, and ACP latency.
