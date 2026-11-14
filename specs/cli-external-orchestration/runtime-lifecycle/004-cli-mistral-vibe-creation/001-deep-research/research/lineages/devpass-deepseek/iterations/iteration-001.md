# Iteration 1: headless dispatch contract

## Focus

Angle 1: how Vibe runs one task non-interactively. Selected the narrowest evidence-backed reading: the installed `vibe` 3.1.2 CLI, its captured help contract, and the bundled Python/Rust split that serves the headless run. Live dispatch was deliberately deferred: the install has no `config.toml` and no API key in `~/.vibe/`, so a smoke run would test the auth error path, not the dispatch path. Recorded as a missing dependency below.

## Findings

1. Headless mode is entered with `-p`/`--prompt [PROMPT]`, and the prompt may come from the argument, from stdin, or from `--prompt-file PATH`; the same programmatic mode is mandatory for `--agent-socket` ("--agent-socket needs programmatic mode: pass -p or --prompt-file"). The help text says "--prompt-file ... instead of `-p` TEXT or stdin", while the binary also carries "Pass either -p TEXT or --prompt-file" and "No prompt provided for programmatic mode", so stdin-as-prompt is documented but not uniformly enforced. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:28-41] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs (strings: "Pass either -p TEXT or --prompt-file", "No prompt provided for programmatic mode")]

2. The dispatch surface exposes explicit flags for every axis a governed executor needs: model `--model <ALIAS>` (headless-only, new sessions only), agent profile `--agent <NAME>` (builtin `ask`, `accept-edits`, `smart-approve`, `auto-approve`, or a custom `~/.vibe/agents/NAME.toml`), permissions `--auto-approve`/`--yolo`, `--smart-approve`, `--trust`, `--enabled-tools`, `--disabled-tools`, working directory `--workdir` (also `VIBE_CWD`) and `--add-dir`, and limits `--max-turns`, `--max-price`, `--max-tokens`, `--time-limit`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:17-67]

3. Output is selectable: `--output text` (default), `json`, or `streaming`; `--output-dir DIR` additionally writes `export.json` and a copy of the session journal under `session/` on every exit. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:30-31,44-45] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:1-6]

4. `export.json` is a typed record, not a pile of logs: `vibe_version`, `outcome`, `stop_reason`, `error{message,code}`, `session_id`, `usage{input,output,cached,total}`, `cost_usd`, `steps`, redacted `config`, `warnings`, `started_at`/`ended_at`, `limits`, `subagents[]`, and a computed `exit_code`. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:117-160,178-238]

5. Exit codes are a fixed five-value taxonomy owned by `RunOutcome.exit_code`: `0` finished; `1` usage_error or config_error; `2` infrastructure_failure (model API after retries, or the runtime); `3` turn_limit, token_limit, price_limit, deadline, terminated, length or refusal; `4` aborted by an `--agent-socket` server. `--time-limit` is documented as "write the export and exit 3", which ties the documented timeout behaviour to the same taxonomy. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:32-84] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:38-39]

6. A denied tool has no exit code of its own. Headless runs cannot prompt for approval, and the binary carries "needs approval, which a headless run cannot give" followed by "denied": the denial is a tool result inside the run, so a run whose only problem was a denied tool can still end `finished` with exit 0. A caller that must detect denial has to read the journal/`export.json` or pin the tool set with `--enabled-tools`/`--disabled-tools` or an explicit approval agent. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs (strings: "needs approval, which a headless run cannot give", "denied")] [INFERENCE: based on the exit-code taxonomy in run_export.py:32-84 having no denial member, and on the denial being emitted as a tool result]

7. Architecturally `vibe` is a thin launcher, not the agent: `vibe/cli/launcher.py` `execvpe`s a bundled Rust binary (`vibe/_bin/vibe-rs`, Mach-O arm64) and points it at the installed `vibe-app-server` through `VIBE_APP_SERVER_BIN`. The Rust side owns the CLI and the headless loop (`src/headless_run.rs`, `src/headless/turn.rs`, `src/headless/report.rs` appear in the binary), and the Python side owns the app server, session journal and run export. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/cli/launcher.py:8-29,43-74,90-103] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs (strings: src/headless/*.rs)]

8. The bundled app server also offers a multiplexed surface: `--multiplex` serves "isolated Unified Harness connections in one stdio process", and the binary carries a `run-server` command that serves "many headless runs over JSON-RPC on stdin and stdout (experimental)" plus `--runs-per-app-server` to cap live runs. That is a second, long-lived dispatch seam beside one-process-per-run print mode. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:82-95] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs (strings: "Serve many headless runs over JSON-RPC on stdin and stdout (experimental)", "--runs-per-app-server")]

## Ruled Out

- Reading the Python package as the CLI implementation: `launcher.py` only execs the Rust binary, so Python is the app-server/session half. The Rust parser has no local source in the wheel, only the help text and binary strings, so CLI-flag claims beyond those captures are `documented, unconfirmed`.
- A live `vibe -p OK` smoke dispatch: `~/.vibe/` holds only `trusted_folders.toml`, no `config.toml` and no key, so the run would have exercised the auth-error branch (`config_error`, exit 1) rather than the dispatch contract. Deferred to the second allowed smoke dispatch once credentials exist.

## Dead Ends

- Treating `--output json` as the canonical machine record. It is the response channel; `export.json` is the run record. Building an executor around stdout JSON alone would lose `outcome`, `usage`, `cost_usd`, `steps` and `exit_code`.

## Edge Cases

- Ambiguous input: the stdin prompt source is documented in `--help` but contradicted by the binary's "Pass either -p TEXT or --prompt-file". Selected the narrow reading: use `-p TEXT` or `--prompt-file`; treat stdin as unverified.
- Contradictory evidence: none beyond the stdin item, recorded above.
- Missing dependencies: no credentials and no `~/.vibe/config.toml`, so no live smoke dispatch this iteration; source and captured help carried the findings.
- Partial success: source reading and the captured CLI contract succeeded; the live path is unconfirmed. Status `complete` for the source-backed contract, with the live gap named.

## Sources Consulted

- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/cli/launcher.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs (strings)

## Assessment

- New information ratio: 1.0
- Questions addressed: How does Vibe run one task non-interactively: which prompt source, flags, output formats and exit codes does the headless contract expose?
- Questions answered: How does Vibe run one task non-interactively: which prompt source, flags, output formats and exit codes does the headless contract expose?

## Reflection

- What worked and why: reading the bundled Python half first turned an opaque CLI into a two-process contract (Rust client + app server), and `run_export.py` is the single authoritative exit-code taxonomy, so the contract claims are grounded in code rather than in help prose.
- What did not work and why: treating `--help` as the full contract. It omits denial behaviour and the JSON-RPC run server, both of which appear only in the binary's strings.
- What I would do differently: probe `vibe run-server --help` and `vibe mcp --help` early; the subcommand surface is where the long-lived dispatch seam lives.

## Recommended Next Focus

Angle 2: providers, models and the subscription. Read `vibe/core/model_catalog`, `vibe/core/auth` and `vibe/core/llm`, plus `vibe config schema` (already captured at `evidence/vibe-config-schema.json`), to establish the auth paths, the model-alias roster and which usage counter a turn draws on.
