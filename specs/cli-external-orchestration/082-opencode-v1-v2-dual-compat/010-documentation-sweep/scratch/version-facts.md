# Version facts for the documentation sweep

Every doc brief in this phase points here. Use these facts exactly; do not add any OpenCode behaviour that is not listed.

## The two versions

- OpenCode 1 is version 1.19.3, the npm package `opencode-ai`, binary `opencode`. `opencode --version` prints `1.19.3`.
- OpenCode 2 is version 2.0.32, the npm package `@opencode/cli`, binary `opencode2` on this machine. `opencode2 --version` prints `opencode v2.0.32`.
- The version comes from the parsed `--version` output, never from the binary name.
- Install, side-by-side setup, the capability delta and the irreducible gaps live in `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md`. Link to it rather than restating it.

## `run` flags

| Need | OpenCode 1 (1.19.3) | OpenCode 2 (2.0.32) |
|---|---|---|
| Model and effort | `--model provider/model --variant <level>` | `-m provider/model#<level>` |
| Registered slash command | `--command family/name` | No `run` flag. A registered command runs through the server API (`POST /api/session/{id}/command`) |
| Working directory | `--dir <path>` | No `--dir`. Start in the directory: `cd <path> && opencode2 run ...` |
| Attach to a server | `--attach <url>` | `--server <url>` |
| Child dispatch | (no flag) | `--standalone` on every child dispatch |
| `--pure`, `--share`, `--port` | present | absent on `run` |
| Kept on both | `--agent`, `--format default\|json`, `--title`, `--thinking`, `--auto`, `-c`, `-s`, `--fork`, `-f`, `--print-logs` | same |

## The default dispatch, verbatim

- OpenCode 1: `opencode run --model opencode-go/deepseek-v4.1-flash --variant max --format json --dir <repo-root> "<prompt>"`
- OpenCode 2: `cd <repo-root> && opencode2 run --standalone -m opencode-go/deepseek-v4.1-flash#max --format json "<prompt>"`
- v2 here lists no `opencode-go` provider, so a v2 reader confirms the provider in `opencode2 models` first.

## Rules

1. Every line that uses `--command`, `--dir`, `--share`, `--port`, `--pure`, `--attach` or `--variant`, or names `1.3.17`, says it is OpenCode 1: open with "On OpenCode 1" or add "(OpenCode 1 only)".
2. Where the table gives a v2 form, add it beside the v1 line, labelled OpenCode 2. Where it has none, say so in one short clause and link the install reference.
3. Anything not in this file is unverified on 2.0.32. Say "unverified on OpenCode 2.0.32" rather than guessing.
4. `opencode.json` examples keep the v1 shape: the singular `permission` map and `mcp.servers`. Never show `permissions`, `plugins` or `disabled`.
5. Never recommend `opencode upgrade --major` (a warning against it is fine). Never tell the reader to stop, start or restart the v2 background service.
6. Write no compatibility claim: no "Verified against OpenCode", and no sentence saying the skill is verified on both versions. Phase 011 writes that claim.
7. Do not change frontmatter. The commit hook raises each doc's version.

## Review addendum (after the first review)

These facts were confirmed after the first writes, and the fix pass follows them.

- The OpenCode 2 default model is the same id as on OpenCode 1: `opencode-go/deepseek-v4.1-flash` (`OPENCODE_DEFAULT_MODEL`, `fanout-run.cjs`). A v2 twin of the default writes `-m opencode-go/deepseek-v4.1-flash#<level>`, never `deepseek-v4-flash`.
- OpenCode 2 here lists no `opencode-go` provider (`006-cli-opencode-dual-dispatch/scratch/probes/v2-model-providers.txt`). The v2 route a live run used is `llmgateway/deepseek-v4.1-flash#max` (`006-cli-opencode-dual-dispatch/scratch/smoke/v2/argv.json`). Each doc or scenario that gives a v2 twin with `opencode-go` says once, near the twin, that the reader checks `opencode2 models` first and that `llmgateway/deepseek-v4.1-flash` is the route a 2.0.32 run used.
- `opencode2 run --format json` emits events of type `step_start`, `tool_use`, `text` and `step_finish`, and names the session `sessionID` (`006-cli-opencode-dual-dispatch/scratch/probes/run-slash.jsonl`). A v2 check never looks for the OpenCode 1 names (`session.started`, `message.delta`, `tool.call`, `session_id`).
- Binary choice: with `OPENCODE_BIN` set, that binary is used. Otherwise the resolver walks PATH one directory at a time and, inside each directory, takes `opencode2` before `opencode`. An earlier PATH directory wins, so a dispatch does not always pick OpenCode 2 (`resolveOpencodeBinary`, `runtime/scripts/opencode-version.cjs`). A version check names the same binary: `"${OPENCODE_BIN:-$(command -v opencode2 || command -v opencode)}" --version` is close, but say that PATH order decides.
- `opencode2 run --agent <name>` is a listed flag. No v2 run has used it, so how v2 routes a slug, which frontmatter wins and how a body such as "As @review" is read are unverified on OpenCode 2.0.32.
- `--auto` on OpenCode 2 approves permissions that are not explicitly denied (v2 run help). Whether it equals OpenCode 1's `--dangerously-skip-permissions` is unverified.
- The stdin hang that makes `</dev/null` necessary is observed on OpenCode 1. On OpenCode 2 it is unverified, so the redirect stays on both versions and the text says why.
- A provider preflight for OpenCode 2 uses `opencode2 models`, beside the OpenCode 1 `opencode models`.
- Rule 7 covers the `version` field. A frontmatter `description` that now states a wrong fact is corrected, and nothing else in the frontmatter changes.

## Event correction (found in phase 011)

The addendum above called `session.started`, `message.delta`, `tool.call`, `tool.result`, `session.completed` and `session_id` the OpenCode 1 names. That is wrong for 1.19.3. Two live 1.19.3 runs (`006-cli-opencode-dual-dispatch/scratch/smoke/v1/stdout.jsonl` and `011-two-version-proof-and-closeout/scratch/proof/smoke/v1/stdout.jsonl`) and two 2.0.32 runs emit the same schema:

- Event types: `step_start`, `tool_use`, `text` and `step_finish`, on both versions. No run emits `session.started`, `message.delta`, `tool.call`, `tool.result` or `session.completed`. Those names are from older OpenCode 1 releases and are unverified on 1.19.3.
- Every event carries the session id in `sessionID`. There is no `session_id` field.
- Reply text is in `text` events at `.part.text`.
- A tool call is a `tool_use` event: the tool is `.part.tool` and its result is `.part.state.output`, with `.part.state.status` `completed`. The shell tool is named `bash` on OpenCode 1.19.3 and `shell` on OpenCode 2.0.32.
- A `step_finish` event closes each step, with `.part.reason` (`tool-calls` or `stop`) and `.part.cost`. The 1.19.3 runs end with a `step_finish` whose reason is `stop`. The 2.0.32 runs captured here end with a `text` event, so a check never requires the last event to be `step_finish`.
- So a JSON-stream check reads the same on both versions: at least one `step_start`, at least one `text` event, a `sessionID`, and exit 0. Only the shell tool name differs.

## Human voice

Run `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py --all <doc>`. Rewrite every hard finding in prose until the scan exits 0: an em dash (—) or a semicolon (;) becomes two sentences, a comma, a colon or parentheses, whichever keeps the meaning; a flagged word gets a plain one. Leave code blocks and inline code as they are. Keep every fact.

## Agent routing (verified in phase 011)

The `--agent` line above is settled. A live probe on 2.0.32 (`011-two-version-proof-and-closeout/scratch/agent-routing/`) showed that v2 registers the repo agents from `.opencode/agents/` with their frontmatter mode, permissions and temperature. `--agent <slug>` runs the session as that agent at top level, whether the agent is primary (`orchestrate`), a subagent (`review`) or the built-in `general`. An unknown slug exits 1 with an `error` event, `Agent not found`. An `As @review:` body without `--agent` runs under the default `build` agent. No repo agent pins a model, so whether a pinned model beats `-m` is untested, and so is how an agent routes subagents onward.
