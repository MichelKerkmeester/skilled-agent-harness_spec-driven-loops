---
title: "Iteration 1: Hermes headless dispatch contract (Angle 1)"
trigger_phrases: []
---
# Iteration 1: Hermes headless dispatch contract

## Focus
Angle 1 — the exact non-interactive invocation surface of `hermes chat` / `-z`: flag semantics on a non-TTY, exit codes, `-Q` stdout/stderr shape, session id, and the comparison against `devin -p`, `pi -p`, `claude -p`, `codex exec`, `opencode run`, `cursor-agent -p`.

## Actions Taken
- Ran `hermes chat --help </dev/null` live (full flag surface captured verbatim).
- Ran `hermes status </dev/null` live (provider/auth inventory; exit 0).
- Enumerated `~/.hermes/.env` key NAMES only (544 lines; no values read).
- Read `hermes_cli/_parser.py:95-176` (top-level and chat flag definitions).
- Read `hermes_cli/oneshot.py:170-265` (`run_oneshot` exit-code and stdout contract) and `main.py:79-183, 2900-2924` (`_exit_after_oneshot`, `_run_and_exit_oneshot`, `-z` fast path).
- Read `cli.py:4065-4117, 4384-4436` (`_run_quiet_single_query`, `_run_single_query_mode`) and `tools/approval_context.py:148-154, 260-284` (`single_query_mode` deterministic gate).
- Cross-checked dispatch strings for the six existing runtimes via `resource-map.md` §7 (`fanout-run.cjs` builders) — `devin -p --model <id> --permission-mode dangerous --respect-workspace-trust false`, `pi -p`, `claude -p`, `codex exec`, `opencode run`, `cursor-agent -p`.

## Findings

### F1. Hermes has TWO headless entrypoints with different semantics
- `hermes -z "PROMPT"` (top-level `--oneshot PROMPT`): bypasses `cli.py`/`HermesCLI` entirely via `_run_oneshot_from_args` → `_run_and_exit_oneshot` → `run_oneshot`. Prints ONLY the final response text to stdout — "No banner, no spinner, no tool previews, no session_id line." [SOURCE: ~/.hermes/hermes-agent/hermes_cli/_parser.py:113-118; main.py:2915-2934]
- `hermes chat -q "PROMPT" -Q`: runs the full `HermesCLI` init (config.yaml, plugins, MCP cold-start — the agent "must wait the full MCP cold-start bound before its first (and only) tool snapshot", #51316), then `_run_quiet_single_query`. [SOURCE: ~/.hermes/hermes-agent/cli.py:4384-4427, 4394-4397]
- `--oneshot` (flag form under `chat`) is implied on non-TTY stdio and by `-Q`. [SOURCE: `hermes chat --help` live 2026-09-14]

### F2. `-z` exit codes and stdout contract
`run_oneshot` returns: **0** success; **1** agent exception or empty final response ("hermes -z: no final response was produced; treating the run as failed"); **2** usage error (`--provider` without `--model`, invalid `--toolsets`) OR `result.failed`/`result.partial` with empty response; **130** KeyboardInterrupt. Process ends in `os._exit(rc)` after flushing — a deliberate hard exit guarding a native-finalizer SIGABRT (#30387, #43055), so late atexit handlers cannot flip the code. `--usage-file PATH` writes a JSON usage report (cost, tokens, model, api_calls) **even on failure** — the spend-accounting hook for pipelines. [SOURCE: ~/.hermes/hermes-agent/hermes_cli/oneshot.py:184-265; main.py:79-99, 135-183; _parser.py:119-123]

### F3. `-z` auto-approves EVERYTHING; `chat -q` is deterministic-deny
- `run_oneshot` unconditionally sets `HERMES_YOLO_MODE=1` and `HERMES_ACCEPT_HOOKS=1` — "Non-interactive by definition — an approval prompt would hang forever." It also calls `declare_stateless_channel()` so `delegate_task` children run inline/synchronous instead of being discarded. [SOURCE: ~/.hermes/hermes-agent/hermes_cli/oneshot.py:200-207]
- `chat -q` instead exports `HERMES_SINGLE_QUERY_SESSION=1`; the approval gate then takes the deterministic `approvals.single_query_mode` path — a binary `approve`/`deny` config that **defaults to deny** (returns "deny" on unreadable config too — fail-closed). So a headless `chat -q` without `--yolo` auto-DENIES dangerous commands rather than hanging or approving. [SOURCE: ~/.hermes/hermes-agent/cli.py:4395-4403; tools/approval_context.py:148-154, 260-277]

### F4. `chat -Q` output shape: response on stdout, session id on STDERR
`_run_quiet_single_query` prints `final_response` to stdout, surfaces backend errors (`Error: ...`) to stderr when the run failed with no response, prints `\nsession_id: <id>` to **stderr** on every exit path, then `sys.exit(0|1)` (1 when `result.failed`; 130 on interrupt; a kanban-only `KANBAN_RATE_LIMIT_EXIT_CODE` sentinel exists but is irrelevant here). So `-Q` stdout is machine-readable text but NOT structured JSON; the session id is a stderr line, not a JSON field. [SOURCE: ~/.hermes/hermes-agent/cli.py:4065-4117]

### F5. Flag semantics relevant to a lineage dispatch
- `-q/--query` (seed-or-answer), `--query-file PATH` (`-` = stdin, nothing shell-interpreted — quotes/`$()`/backticks verbatim), `--oneshot`, `-Q/--quiet`, `-m/--model`, `--provider` (requires `--model` or `HERMES_INFERENCE_MODEL` in `-z`), `-t/--toolsets`, `--reasoning {none,minimal,low,medium,high,xhigh,max,ultra}`, `-s/--skills` (repeatable), `--max-turns N` (default 500), `--run-budget SECONDS` (80% wrap-up notice; implicit provider stale timeouts capped to remaining budget — "one hung call can't consume the run"), `--yolo`, `--accept-hooks` (≡ `HERMES_ACCEPT_HOOKS=1`), `--pass-session-id` (session id into the system prompt), `--resume ID|latest`, `-c/--continue [NAME]`, `--create-if-missing`, `--in DIR` (chdir first; scopes `--resume latest`), `--worktree` (isolated git worktree for parallel agents), `--ignore-rules` (skip AGENTS.md/SOUL.md/.cursorrules/memory/preloaded skills), `--ignore-user-config` (ignore `~/.hermes/config.yaml`; `.env` credentials still load), `--safe-mode` (all customizations off incl. plugins+MCP; implies both), `--source tool` (hide run from user session lists). [SOURCE: `hermes chat --help` live 2026-09-14; ~/.hermes/hermes-agent/hermes_cli/_parser.py:109-176]

### F6. LIVE: no provider is configured — smoke dispatch precondition unmet
`hermes status` (exit 0, ~10s to render) reports: `Model: (not set)`, `Provider: Auto`; every API-key provider ✗ not set; every OAuth provider (Nous Portal, OpenAI Codex, Qwen, MiniMax, xAI) ✗ not logged in. `~/.hermes/.env` key names enumerate to tool/debug/browser config only (BROWSERBASE_*, TERMINAL_*, *_TOOLS_DEBUG) — zero provider credentials on this machine. **Consequence:** the rules of engagement permit a smoke dispatch only when `hermes status` shows a configured provider; it does not, so no smoke run was attempted. Hermes v0.21.1 on this machine is a fully installed agent shell with NO inference path — every dispatch finding here is source-verified, not live-verified. [SOURCE: `hermes status` output 2026-09-14; `~/.hermes/.env` key-name enumeration 2026-09-14]

### F7. Comparison with the six runtimes' headless forms
|| Runtime | Headless form | stdout | Session id | Approval semantics headless | Exit codes |
||---------|---------------|--------|------------|------------------------------|------------|
|| cli-devin | `devin -p "<prompt>" --model <id> --permission-mode dangerous --respect-workspace-trust false` | text | not emitted on stdout | `dangerous` = write-permitting | 0/non-0 |
|| cli-pi | `pi -p` | text | not emitted | flag-gated | 0/non-0 |
|| cli-claude-code | `claude -p` | text/`--output-format json` | emitted in JSON mode | `--permission-mode`/`--dangerously-skip-permissions` | 0/non-0 |
|| cli-codex | `codex exec` | text | not emitted | `--full-auto`/sandbox flags | 0/non-0 |
|| cli-opencode | `opencode run` | machine-readable stdout | emitted | agent permission config | 0/non-0 |
|| cli-cursor | `cursor-agent -p` | text | emitted | `--force`/trust flags | 0/non-0 |
|| **cli-hermes** | `hermes -z "P"` **or** `hermes chat -Q -q "P" --yolo` | text only | `-z`: none; `-Q`: `session_id:` on **stderr** | `-z`: auto-yolo always; `-Q`: `approvals.single_query_mode` deny default | 0 ok / 1 agent-fail / 2 usage-or-empty-fail / 130 int |

Unique posture: Hermes is the only runtime whose simplest headless form (`-z`) silently auto-approves all dangerous commands AND emits no session id; the only one with a first-class `--usage-file` spend report and a `--run-budget` wall-clock contract; and the only one where "denied tool" is a config-decided deterministic outcome rather than a prompt. [SOURCE: table rows per `.opencode/skills/cli-external-orchestration/*/references/cli-reference.md` as mapped in resource-map.md §5; Hermes rows per F1-F4]

## Questions Answered
- Angle 1 core: the non-interactive invocation is `hermes -z "PROMPT"` (max simplicity, response-only stdout, auto-yolo, no session id) or `hermes chat -Q -q "PROMPT" [--yolo]` (full init, `session_id:` on stderr, deterministic approval gate default-deny). Exit codes: 0/1/2/130 as above.

## Questions Remaining
- Whether `--run-budget` expiry maps to a distinct exit code (appears not — turn ends and the 0/1 result applies; UNKNOWN pending live run, which needs a provider).
- Whether a denied tool under `chat -q` returns a tool-denial result that lets the run still exit 0 (plausible from the `result.failed` gate; UNKNOWN).
- `hermes acp` / `hermes serve` as alternative dispatch transports (named in resource-map §3; not opened this pass).

## Dead Ends
- Smoke dispatch: precondition unmet (no configured provider), so none attempted — recorded as a finding, not retried.
- Looking for a JSON `--output-format` mode: none exists for `chat`/`-z`; `-Q` is text+stderr-sid, `--usage-file` is the only structured artifact.

## Ruled Out
- **`hermes -z` as the lineage dispatch when the runner needs the session id** — `-z` prints no session_id line by design (`_parser.py:116`). Use `chat -Q -q` (stderr carries it) or `--pass-session-id`+known id instead.

## Reflection
What worked: the oneshot/quiet code paths are short and heavily commented with issue numbers; exit-code and approval semantics resolved from source in one pass. What failed: `hermes status` reveals the machine cannot actually run inference — every downstream angle now inherits "documented, unconfirmed" for anything requiring a live model call. Negative knowledge: there is no hidden third headless mode (`acp`/`serve` are transports, not prompt-exec forms); `-z` cannot be made to emit a session id.

## Assessment
- newInfoRatio: 1.00
- Novelty justification: First iteration; the two-mode split, auto-yolo vs deterministic-deny approval contrast, stderr session-id channel, usage-file contract, and the zero-credential live state are all new to this packet.
- Confidence: high on contract semantics (source + live help); medium on exit-code coverage of budget exhaustion and denied-tool paths (unexercised live).

## Recommended Next Focus
Angle 2 — providers, models, reasoning: which providers Hermes supports, which of the repo's routed models it can reach with credential kinds already on this machine (none today — a hard gap), and the shape of a closed `HERMES_SUPPORTED_MODELS` roster.

## SCOPE VIOLATIONS
None.
