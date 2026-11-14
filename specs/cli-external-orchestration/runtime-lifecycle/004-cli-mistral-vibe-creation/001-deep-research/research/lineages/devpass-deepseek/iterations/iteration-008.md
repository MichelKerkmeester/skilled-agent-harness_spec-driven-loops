# Iteration 8: ACP and other integration seams

## Focus

Angle 8: Vibe speaks the Agent Client Protocol. This iteration reads the ACP agent surface, compares it with print mode as a fan-out dispatch contract, and names the other seams (`run-server`, `--multiplex`, `--agent-socket`, `--output streaming`) that a governed runtime could use.

## Findings

1. ACP is a stdio JSON-RPC agent with a fixed method surface: `initialize`, `authenticate`, `new_session`, `load_session`, `prompt`, `cancel` and `close_session`. `vibe-acp` accepts only `-h`, `-v` and `--setup`, so every ACP behaviour is configured through the protocol and the config layers, not through flags. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:475-600,810-1014] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:72-81]

2. ACP carries permission round-trips, not denials: the agent calls `client.request_permission` with `allow_once`, `allow_always`, `reject_once` and `reject_always` options. That is the decisive difference from print mode, where a tool needing approval is denied because a headless run cannot prompt. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:902-930] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/utils.py:28-120]

3. ACP sessions are persistent and cancellable: `new_session`, `load_session`, `close_session` and `cancel(session_id)` let one long-lived process hold many sessions, resume them and stop a turn without killing the process. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:545-600,997-1020]

4. ACP has no per-run exit taxonomy and no `export.json`. Those are print-mode artifacts: `RunOutcome.exit_code` and `write_run_export` live on the headless path. An ACP supervisor would have to derive outcome, usage and cost from protocol events and session state instead. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:32-84,217-247] [INFERENCE: based on the ACP method surface exposing no export or exit-code channel]

5. Three further seams exist beside either mode: `--output streaming` emits a machine-readable event stream from print mode, `--agent-socket` lets a server own the run and abort it (exit 4), and `run-server` serves "many headless runs over JSON-RPC on stdin and stdout (experimental)" with `--runs-per-app-server`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:30-31,69-95] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs (strings: "Serve many headless runs over JSON-RPC on stdin and stdout (experimental)", "--runs-per-app-server")]

6. Print mode fits the existing executor contract with no new supervisor: one process per iteration, a fixed exit taxonomy, `export.json` for usage, and the runner's receipts plus post-hoc write containment. ACP fits a different contract: a persistent per-lineage client, a completion signal built from the `prompt` result plus session events, client-side permission policy, cancellation instead of signal kill, and receipts anchored on session ids rather than process ids. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:179-200] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3099-3121] [INFERENCE: based on the ACP method surface and the runner's process-shaped audit]

7. Recommendation: print mode is the better first dispatch surface; ACP is the better second one. Print mode keeps the iteration model, exit-code handling and cost record unchanged, while ACP's permission round-trip and resume are real advantages only once the mode has a supervisor that can answer them, and `run-server` should wait until it leaves experimental. [INFERENCE: based on findings 1-6]

8. ACP would change four fan-out mechanics if adopted: one process per lineage instead of per iteration; a new per-iteration completion record derived from protocol events; a permission answerer per lineage that encodes the repo's guard policy; and cancellation semantics that map onto the existing signal handlers rather than replacing them. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:902-1014] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:591-600]

## Ruled Out

- Adopting ACP as the first executor surface: it requires a protocol supervisor, a new completion signal and a permission answerer before a single iteration can run, while print mode runs on the existing contract.
- Using `run-server` now: the binary itself labels it experimental.

## Dead Ends

- Looking for ACP flags to pin a model or workdir: `vibe-acp` has no flags, so those come from config or from the session `new_session` payload, and the exact payload fields are UNKNOWN from the Python surface alone.
- Looking for an ACP export path: none exists; export is a headless-only artifact.

## Edge Cases

- Ambiguous input: "ACP" could mean the client-side protocol (`acp` package) or the server-side harness. Graded the agent implementation that a supervisor would drive.
- Contradictory evidence: none.
- Missing dependencies: no ACP client was run, so the `new_session` payload and event names are UNKNOWN beyond the Python method signatures.
- Partial success: the comparison and recommendation are complete; the wire-level ACP payloads are not.

## Sources Consulted

- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/utils.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/entrypoint.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs (strings)
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs

## Assessment

- New information ratio: 1.0
- Questions addressed: What would a cli-mistral-vibe deep-loop executor kind need, and is ACP a better dispatch surface than print mode?
- Questions answered: Both halves — the executor requirements came from iteration 7, and this iteration answers the ACP-versus-print comparison.

## Reflection

- What worked and why: comparing the two surfaces by their completion signal (exit code plus export versus protocol events) made the recommendation obvious and grounded, instead of a preference between transports.
- What did not work and why: trying to find ACP flags. There are none, which itself narrows the design: everything a governed dispatch needs must arrive through config or the protocol.
- What I would do differently: run a scripted ACP `initialize` handshake in a temp directory to capture the exact `new_session` payload; that is the one wire-level gap left before a build phase could start.

## Recommended Next Focus

Synthesis. All eight angles are answered; `research/research.md` should merge the parity table with the corrections from iteration 5, and `research/phase-plan.md` should rank build phases from the porting costs recorded here.
