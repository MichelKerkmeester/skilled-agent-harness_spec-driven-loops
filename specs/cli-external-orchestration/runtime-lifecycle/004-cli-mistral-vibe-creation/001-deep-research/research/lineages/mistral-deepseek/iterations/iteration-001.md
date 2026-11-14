# Iteration 1: Angle 1 — headless dispatch contract

## Focus

How Vibe runs one task non-interactively: prompt as argument, stdin or file; which flags set model, agent profile, permissions, working directory and turn or time limits; what lands on stdout and stderr; whether there is machine-readable output; and the exit codes on success, provider error, denied tool and timeout.

Selected interpretation: the *dispatch surface a governed `cli-mistral-vibe` mode would call*, not the interactive TUI. Deferred: the TUI keybinding surface, which no dispatch path uses.

## Actions Taken

1. Read the captured headless contract `research/evidence/vibe-help.txt` (version, `vibe --help`, `vibe-acp --help`, `vibe-app-server --help`).
2. Located the installed runtime and read its entrypoint: the `vibe` console script execs a bundled Rust binary, so the Python package is the app-server/ACP engine, not the headless renderer.
3. Read the app server's run-outcome taxonomy (`run_export.py`) for the exit-code contract and export shape.
4. Read the protocol launch surface (`AgentConfig` in `app_server/protocol.py`) that the Rust client fills.
5. Ran one live smoke dispatch (`vibe -p "Reply with exactly OK" --output json --max-turns 1`) with `VIBE_HOME` redirected into the lineage and the workdir set to a lineage-local scratch directory, stdin closed. It exited 1 on a missing API key, which confirms the exit-1 branch and the stderr shape without spending tokens.

## Findings

1. Headless mode is `-p/--prompt [<PROMPT>]`: the prompt is taken from the flag argument, from stdin when the flag carries no value, or from `--prompt-file <PATH>`. `--workdir <CWD>` (env `VIBE_CWD`) sets the working directory, and `--output` selects `text` (default), `json` or `streaming`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:28-31]

2. Four independent limits exist and all are headless-only: `--max-turns` (assistant turns), `--max-price` (cumulative dollars across the root session *and* subagents), `--max-tokens` (cumulative prompt + completion tokens), and `--time-limit <SECONDS>`, which interrupts the run, writes the export and exits 3. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:32-39]

3. The remaining dispatch knobs are: `--agent <NAME>` (builtin `ask`, `accept-edits`, `smart-approve`, `auto-approve`, or a custom TOML under `~/.vibe/agents/NAME.toml`), `--model <ALIAS>` (headless only, new sessions only, not persisted), `--auto-approve`/`--yolo`, `--smart-approve`, `--enabled-tools`/`--disabled-tools` (repeatable; in headless, `--enabled-tools` disables all others), `--trust`, `--add-dir`, `--worktree`, `--system-prompt-file`, and `--output-dir`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:44-65]

4. The exit-code contract is explicit and closed: `0` finished; `1` usage_error or config_error; `2` infrastructure_failure (model API after retries, or the runtime); `3` turn_limit, token_limit, price_limit, deadline, terminated, length or refusal; `4` aborted by the server on the other end of `--agent-socket`. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:36-80]

5. `--output-dir <DIR>` writes `export.json` on *every* exit — Vibe version, effective config, token usage, cost, stop reason and outcome — plus a copy of the session journal under `session/` and each subagent's under `subagents/<session ID>/`. That is the machine-readable run record a governed dispatch should read instead of parsing stdout. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:1-12]

6. A live unauthenticated dispatch exits `1`, writes nothing to stdout, and puts `Reading API keys from the macOS Keychain (set them as environment variables to skip this)` followed by `Error: Missing MISTRAL_API_KEY environment variable for mistral provider` on stderr. So the failure channel is stderr, and a keychain lookup happens on every dispatch unless the key is supplied as an environment variable. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/scratch/smoke1/stderr.txt:1-2]

7. The `vibe` console script is a thin exec shim: it resolves the bundled `_bin/vibe-rs` (28 MB) and `os.execvpe`s it, so the headless output rendering is Rust-side and not readable from the Python package. The Python package supplies the app server (`vibe-app-server`) and ACP (`vibe-acp`) engines. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/cli/launcher.py:1-40]

8. The protocol-level launch surface behind those flags is `AgentConfig`: `headless`, `workdir`/`cwd`, `agent`, `auto_approve`, `enabled_tools`, `disabled_tools`, `max_turns`, `max_price`, `max_session_tokens`, `trust_workspace`, `system_prompt`, `mcp_servers`, plus `tools` (client-provided tool definitions) and `hooks` (client-provided hook definitions). A governed dispatch can therefore set every knob either through flags or through the app-server protocol. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/protocol.py:385-425]

## Ruled Out

- Reading the headless JSON schema out of the Rust binary with `strings`: the serde structs do not leave literal JSON key names in the binary (only two `{"type":` fragments), so the exact `--output json` payload shape stays unconfirmed. Replaced by the `export.json` contract, which is Python-side and fully readable.
- Treating `vibe --help` as the whole contract: it is complete for flags but silent on exit codes and on the export, which only the app server documents.

## Dead Ends

- Extracting the `--output json` / `--output streaming` event schema without an authenticated dispatch. The schema is Rust-side and not mirrored in the Python package. Candidate for the second and last allowed live dispatch, or for an upstream source read.

## Edge Cases

- Ambiguous input: "machine-readable output" could mean stdout JSON or `export.json`. Selected both and separated them: stdout format is a flag (`--output`), the durable record is `--output-dir`/`export.json`. Deferred: the exact stdout event schema.
- Contradictory evidence: none.
- Missing dependencies: no API key in the environment (`MISTRAL_API_KEY`, `VIBE_API_KEY`, `MISTRAL_VIBE_API_KEY` all unset) and no `~/.vibe/config.toml`, so a successful dispatch could not be exercised. Fallback: the exit-1 path still exercised the real binary and the real stderr channel.
- Partial success: the flag, limit, export and exit-code contracts are confirmed; the stdout JSON schema and the denied-tool exit behaviour are not. Status is `complete` because the angle's core question is answered from primary sources.

## Sources Consulted

- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/cli/launcher.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/protocol.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/permissions.py`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/scratch/smoke1/stdout.txt`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/scratch/smoke1/stderr.txt`

## Questions Answered

- How does Vibe run one task non-interactively: prompt as argument, stdin or file? — All three: `-p TEXT`, `-p` with stdin, `--prompt-file`.
- Which flags set model, agent profile, permissions, working directory and turn or time limits, what lands on stdout and stderr, and what are the exit codes? — Answered for flags, streams and exit codes; the stdout JSON schema stays open.

## Questions Remaining

- The exact `--output json` and `--output streaming` payload shapes.
- Whether a denied tool call changes the process exit code or only returns a denial to the model.

## Assessment

- New information ratio: 1.0
- Questions addressed: headless dispatch contract (Angle 1)
- Questions answered: 1 of 8 strategy key questions

## Reflection

- What worked and why: reading the app-server Python instead of the CLI help. The help lists flags; `run_export.py` carries the exit taxonomy and the export contract in one docstring, which is exactly the part a governed executor needs and the part a help screen cannot show.
- What did not work and why: `strings` on the Rust binary. Serde does not emit literal field names, so binary archaeology cannot recover a JSON schema; only an authenticated run or upstream source can.
- What I would do differently: check for credentials before choosing a smoke dispatch, so the one live call spent here could have confirmed the JSON schema instead of the error path.

## Recommended Next Focus

Angle 2: providers, models and the subscription — how Vibe authenticates (keychain, `MISTRAL_API_KEY`, browser sign-in, bring-your-own key), whether `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` can be pinned, how reasoning effort is set, and which usage counter a Vibe turn draws on. The unauthenticated smoke already established that keychain-or-env is the auth gate, which is the entry point for that angle.
