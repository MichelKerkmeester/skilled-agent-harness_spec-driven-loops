# Iteration 1: Angle 1 — Headless dispatch contract

## Focus

Pin the exact non-interactive invocation contract of Hermes Agent v0.21.1 (installed at
`~/.hermes`, upstream `dc90a75a`): what each headless flag does on a non-TTY, the exit-code
semantics, whether stdout is machine-readable in quiet mode, and where the session id goes.
Compare against the six existing runtimes' `cli-reference.md` contracts.

## Actions Taken

- Ran `hermes chat --help` with stdin closed (exit 0) and captured the full flag surface
  (source: live help output, 2026-09-14).
- Read `hermes_cli/_parser.py` lines 109-199: top-level flags (`-z/--oneshot`, `--usage-file`,
  `--resume`, `--in`, `--worktree`, `--accept-hooks`, `--yolo`, `--pass-session-id`,
  `--ignore-user-config`, `--ignore-rules`, `--safe-mode`, `--tui`) and the `chat` subparser
  build.
- Read `hermes_cli/oneshot.py` lines 171-265: the `-z` run contract, exit codes, and
  `HERMES_YOLO_MODE`/`HERMES_ACCEPT_HOOKS` auto-set.
- Read `cli.py` lines 4065-4117 (`_run_quiet_single_query`): the `-Q` quiet contract, stderr
  session-id line, and exit codes.
- Read `hermes_cli/main.py` lines 79-183 (`_exit_after_oneshot`, `_run_and_exit_oneshot`):
  hard-exit path and rc propagation.
- Compared with the six `cli-reference.md` files: cli-opencode (§session ids, stdin
  redirection rule), cli-claude-code (`-p`, `--output-format`), cli-codex (exit codes §6),
  cli-cursor (exit codes §6, workspace trust, output formats), cli-devin (exit codes §6),
  cli-pi (headless options table).

## Findings

1. **Three headless shapes exist, not one.** (a) `hermes -z "<prompt>"` (top-level oneshot):
   prints ONLY the final response text to stdout — no banner, no spinner, no tool previews, no
   session_id line; tools/memory/rules/AGENTS.md load as normal; approvals are auto-bypassed.
   (b) `hermes chat -q "<prompt>"` on a non-TTY: `--oneshot` is implied by non-TTY stdio and by
   `-Q`, so it answers and exits (cli.py:2470-2475 `_should_seed_interactive`). (c)
   `hermes chat -Q --oneshot -q ...`: quiet programmatic mode that additionally suppresses
   banner/spinner/tool previews and prints the final response plus session info.
   [SOURCE: hermes_cli/_parser.py:113-118, 194-199; cli.py:2470-2475; live `hermes chat --help`, 2026-09-14]

2. **`--query-file` is the injection-safe query channel.** Reads the single query from a file
   (`-` reads stdin); nothing is shell-interpreted, so quotes, `$(...)`, and backticks are
   preserved verbatim; mutually exclusive with `-q`.
   [SOURCE: live `hermes chat --help`, 2026-09-14]

3. **`-Q` stdout is machine-readable by construction; the session id goes to stderr.**
   `_run_quiet_single_query` prints the response to stdout and `\nsession_id: <id>` to stderr
   (cli.py:4103); backend errors that produced no visible output (e.g. invalid model slug →
   provider 4xx) go to stderr as `Error: ...` (cli.py:4087-4091). `-z` prints no session id at
   all; session id is recoverable via `--usage-file` JSON (oneshot.py:28-32 `_USAGE_KEYS`).
   [SOURCE: cli.py:4065-4117; hermes_cli/oneshot.py:28-32]

4. **Exit codes.** `-z`: 0 = success with non-empty final response; 1 = agent exception or no
   final response produced; 2 = usage error (e.g. `--provider` without `--model`, invalid
   toolsets) or `result.failed/partial` with empty response (oneshot.py:187-265). `chat -Q`:
   0 = success, 1 = `result.failed`, 130 = KeyboardInterrupt (cli.py:4108-4117). `chat --help`
   exits 0. There is no distinct exit code for run-budget exhaustion in `-Q` (a partial result
   with a response exits 0; only `failed` maps to 1), and no distinct code for a denied tool
   (approvals are auto-bypassed in `-z` via `HERMES_YOLO_MODE=1`, oneshot.py:201).
   [SOURCE: hermes_cli/oneshot.py:187-265; cli.py:4108-4117]

5. **Isolation flags.** `--ignore-user-config` skips `~/.hermes/config.yaml` (credentials in
   `.env` still load); `--ignore-rules` skips AGENTS.md/SOUL.md/.cursorrules/memory/preloaded
   skills; `--safe-mode` disables user config + rules + plugins + MCP (implies both). Useful
   for CI isolation; none of them disable the sessions database or memories on disk.
   [SOURCE: hermes_cli/_parser.py:165-170; live `hermes chat --help`, 2026-09-14]

6. **Comparison with the six runtimes.**

   | Runtime | Headless invocation | Machine-readable stdout | Session id | Exit codes |
   |---|---|---|---|---|
   | Hermes (this) | `hermes -z "q"` or `hermes chat -q/-Q --oneshot` | `-Q`: yes (stdout clean; `session_id:` on stderr); `-z`: yes (final text only) | stderr (`-Q`), `--usage-file` JSON (`-z`) | 0/1/2 (`-z`), 0/1/130 (`-Q`) |
   | cli-opencode | `opencode run --model X "<p>" </dev/null` | `--format json` (structured incl. session_id) | in JSON output | 0/non-zero (per runtime) |
   | cli-claude-code | `claude -p "<p>" --output-format text 2>&1` | `--output-format json` | in JSON output | 0/non-zero |
   | cli-codex | `codex exec "<p>"` | text stdout | TUI/session listing | 0 success, non-zero error |
   | cli-cursor | `cursor-agent -p "<p>"` | `--output-format json`/`stream-json` incl. `session_id` | in JSON output | always 0 — NOT proof of success |
   | cli-devin | `devin -p "<p>"` | text stdout | via `devin list` | 0 success, non-zero error |
   | cli-pi | `pi -p message` | `--mode json` event stream; `--mode rpc` JSONL | `--session-id` selectable | exit code is an additional signal, not primary |

   Distinctive Hermes properties: (a) session-id-on-stderr keeps stdout purely the answer — as
   clean as `-z`'s answer-only stdout but with a session handle for wrappers; (b) exit code 2
   for usage errors is more granular than cursor's always-0; (c) no JSON output format on
   `chat -Q` (unlike opencode/cursor/claude), so structured needs go through `--usage-file`;
   (d) `--worktree` gives per-dispatch git worktree isolation natively (cli.py worktree_ops),
   which the other six approximate via runner-level flags.
   [SOURCE: cli-opencode/references/cli-reference.md:106,149-154,322; cli-claude-code/references/cli-reference.md:112,292-308; cli-codex/references/cli-reference.md:241,272-278; cli-cursor/references/cli-reference.md:82,102,222-233; cli-devin/references/cli-reference.md:250,282-288; cli-pi/references/cli-reference.md:60-110]

## Questions Answered

- Q1 (headless dispatch contract): answered with evidence above. The canonical fan-out shape
  is `hermes chat -Q --oneshot --max-turns N --run-budget S -q "<prompt>" </dev/null` with
  stdout captured, stderr inspected for `session_id:` and `Error:` lines, exit code treated as
  a strong signal (0/1/2) — closer to `devin -p`/`pi -p` than to cursor's always-0.

## Questions Remaining

- Q2-Q10: all other angles (see strategy).

## Assessment

- newInfoRatio: 0.85 — first pass over a fresh source surface; all findings new to this packet,
  one caveat: exit-code semantics on run-budget exhaustion for `chat -Q` need a live probe
  (a partial-with-response run exits 0 by code reading, marked `documented, unconfirmed`).
- Confidence: high on flag semantics (live help + source); medium on edge-case exit codes.

## Reflection

- What worked: combining live `--help` output with the implementation files (oneshot.py,
  cli.py quiet path) closed the loop between documented flags and actual behavior; the
  six-reference comparison table was cheap to build and immediately surfaced the
  session-id-on-stderr and exit-2 distinctions.
- What failed / ruled out: `-z` as the fan-out invocation — no session id on stdout and no
  `--max-turns`/`--run-budget` on the top-level flag set (those live on `chat`), so `chat -Q`
  is the better dispatch shape. Rule out `-z` for runner use; keep it as the simplest possible
  smoke path.
- Ruled out direction: relying on exit code alone for success detection (must parse stderr for
  `Error:`/`session_id:`); do not treat cursor-style always-0 semantics as the baseline.

## Recommended Next Focus

Angle 2: providers, models and reasoning (`config_providers.py`, `provider_catalog.py`,
`runtime_provider*.py`, `models_catalog_static.py`, `models_reasoning_caps.py`; credential
kinds on this machine; a fail-closed `HERMES_SUPPORTED_MODELS` roster mirroring
`cli-pi`'s `PI_SUPPORTED_MODELS`).
