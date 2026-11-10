# Iteration 8: Angle 8 — Deep-loop fan-out fitness

## Focus

What a `buildHermesLineageCommand` needs: write-permitting headless flags, `--yolo`/approval
semantics, per-iteration timeout, stdin closed, `HERMES_HOME`/profile state isolation, env
pass-through and stripping, self-invocation detection, nested-hermes blocking, trustworthy
exit codes, writes outside the repo, and web-search forcing — measured against what
`executor-config.ts` and `fanout-run.cjs` provide for the six kinds.

## Actions Taken

- Read `executor-config.ts` lines 79-170: `EXECUTOR_KIND_FLAG_SUPPORT`,
  `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`, `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`.
- Read `executor-audit.ts` lines 80-160: `EXECUTOR_STATE_DIR_ENV_BY_KIND`,
  `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND`, `SELF_PRESENCE_EXEMPT_KINDS` (cli-pi only),
  `EXECUTOR_COMMON_ENV_ALLOWLIST` (incl. `SYSTEM_SPEC_GATE_ENFORCE`, `AI_SESSION_CHILD`),
  `EXECUTOR_ENV_PREFIXES_BY_KIND`.
- Read `fanout-run.cjs` lines 2368-2545: `DEVIN_ALLOWED_MODELS`, `PI_ALLOWED_MODELS`,
  `PI_MODEL_PROVIDERS`, `REASONING_TO_PI_THINKING`, builder patterns.
- Read `agent/turn_author.py` lines 1-90: `HERMES_TURN_AUTHOR` bot-to-bot marker semantics
  (set by dispatcher on recipient one-shot; removed from child subprocesses).
- Read `hermes_cli/oneshot.py` lines 91-224: explicit toolsets replace configured set
  (`use_config_toolsets=False`), `HERMES_YOLO_MODE=1`/`HERMES_ACCEPT_HOOKS=1` auto-set in -z.
- Confirmed live (angle 1): exit codes 0/1/2 (`-z`) and 0/1/130 (`chat -Q`); `--yolo`
  bypasses approvals; `--run-budget SECONDS` per-run wall clock; `--worktree` native git
  worktree isolation; `HERMES_HOME` profile-aware paths.

## Findings

1. **The dispatch shape is fully resolvable today.** `buildHermesLineageCommand` needs:
   `hermes chat -Q --oneshot --max-turns N --run-budget S --yolo --accept-hooks -t <toolsets>
   --pass-session-id -q <prompt>` with stdin closed (`</dev/null`) and `--in <repo root>`.
   Write-permitting: `--yolo` (bypass dangerous-command approvals; `-z` sets
   `HERMES_YOLO_MODE=1` automatically, `chat -Q` does not — the builder must pass `--yolo`
   explicitly). Hooks: `--accept-hooks` (or `HERMES_ACCEPT_HOOKS=1`) for allowlist-less
   headless runs. Budget: `--run-budget` bounds the run; the runner's own timeoutSeconds
   bounds the process.
   [SOURCE: live `hermes chat --help` (iteration 1); hermes_cli/oneshot.py:194-224]

2. **Sandbox capability: no preventive OS boundary — same class as cli-opencode/
   cli-devin/cli-pi.** `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` would be `false` for
   cli-hermes: `--yolo` is approval bypass, not confinement. The fan-out's post-hoc
   write-containment guard (repo-watching) is the compensating control, exactly as for
   cli-devin. `EXECUTOR_KIND_FLAG_SUPPORT` would accept `model`, `reasoningEffort` (the
   `--reasoning` flag is first-class), `timeoutSeconds`, `liveTools`; no `sandboxMode`, no
   `serviceTier`.
   [SOURCE: executor-config.ts:79-135; live `hermes chat --help`]

3. **Web search CAN be forced per dispatch — better than cursor/devin/claude-code.** Explicit
   `-t/--toolsets` replaces the configured set (`use_config_toolsets=False`,
   oneshot.py:194-224); `web` is a valid toolset name. So the matrix entry is
   `{inherit: true, disabled: false, cached: false, live: true}` (same shape as cli-codex /
   cli-opencode). The cli-hermes packet can carry a `web-search-required` hard rule.
   [SOURCE: hermes_cli/oneshot.py:194-224; toolsets.py toolset list (resource-map)]

4. **State isolation: `HERMES_HOME` is a real, documented override.** `get_hermes_home()` is
   profile-aware; `-p/--profile` sets it before any import; every state path (config, .env,
   plugins, memories, sessions, logs, cache) scopes to it. So per-lineage isolation =
   `HERMES_HOME=<lineage-state-dir>` env (or a dedicated profile), unlike devin (no
   DEVIN_HOME) and cursor (no CURSOR_HOME). The repo-owned detection var follows the
   pattern: `SPECKIT_HERMES_STATE_DIR` (+ `HERMES_HOME` as the real one). Env pass-through
   prefix: `HERMES_` (HERMES_HOME, HERMES_ACCEPT_HOOKS, HERMES_INFERENCE_MODEL,
   HERMES_ENABLE_PROJECT_PLUGINS); strip it from the lineage state dir so children don't
   inherit per-lineage state (mirroring DEVIN_ being deliberately absent).
   [SOURCE: executor-audit.ts:80-144; hermes_constants.get_hermes_home (root AGENTS.md);
   hermes_cli/main.py profile override]

5. **Self-invocation: `HERMES_TURN_AUTHOR` is the bot-to-bot marker, but Hermes removes it
   from its own children — nesting is NOT env-detectable from inside.** The dispatcher sets
   `HERMES_TURN_AUTHOR` on the recipient one-shot; Hermes consumes and removes it so child
   subprocesses do not inherit it (turn_author.py:3-15, 85-90). So the fan-out can set
   `HERMES_TURN_AUTHOR=<lineage>` as a self-invocation tag, but "am I inside a Hermes
   session" cannot be answered by env inheritance (Hermes scrubs it). Hermes also does NOT
   block nested `hermes` from `delegate_task` children or the terminal tool (no equivalent of
   codex's refusal). Consequence: cli-hermes is NOT a `SELF_PRESENCE_EXEMPT_KIND` (Hermes has
   its own delegation, so the question is meaningful), but the ancestry layer must do the
   work the env layer cannot; a `SPECKIT_`-style lineage marker is the robust tag.
   [SOURCE: agent/turn_author.py:3-15, 85-90; executor-audit.ts:108]

6. **Exit codes are trustworthy for the runner's stop-policy check** (0 success / 1 failed /
   2 usage — angle 1), better than cursor's always-0 and comparable to devin/codex; stderr
   must be parsed for `Error:`/`session_id:`. Writes outside the repo (sessions DB, memories,
   checkpoints, curator, logs under `~/.hermes`) do not touch the fan-out containment guard
   (repo-watching only); the guard's per-lineage concern is memory/state leakage between
   dispatches, handled by `HERMES_HOME` isolation (finding 4) plus `--ignore-rules` or
   `--safe-mode` when a dispatch must not see prior sessions. `--worktree` gives an
   additional native per-dispatch git-worktree isolation option (parallel agents on the same
   repo).
   [SOURCE: iteration 1 findings; executor-audit.ts state-dir map; live `hermes chat --help`]

## Questions Answered

- Q8 (fan-out fitness): answered. Fit for fan-out with: `--yolo --accept-hooks -t` flags,
   `HERMES_HOME`/`SPECKIT_HERMES_STATE_DIR` isolation, `HERMES_TURN_AUTHOR` + ancestry for
   self-invocation, `</dev/null`, trustworthy exit codes, `-t web` forcing, post-hoc
   write-containment as the compensating control.

## Questions Remaining

- Q9-Q10 (see strategy).

## Assessment

- newInfoRatio: 0.80 — the HERMES_HOME override, toolsets-forcing, TURN_AUTHOR scrubbing,
  and the flag-support matrix placement are new and load-bearing.
- Confidence: high (source-verified).

## Reflection

- What worked: mapping the fan-out contract (flag support, sandbox class, web matrix, env
  prefixes, self-presence) onto Hermes's actual surfaces produced a concrete builder spec
  instead of a vague "seems feasible".
- What failed / ruled out: env-inheritance-based nesting detection (Hermes scrubs
  HERMES_TURN_AUTHOR); expecting a preventive sandbox flag (none exists).
- Ruled-out direction: treating `--yolo` as a sandbox; relying on `~/.hermes` writes being
  containment-relevant (they are not — the guard watches the repo).

## Recommended Next Focus

Angle 9: constraints and differences versus the six runtimes (Python runtime and venv,
git-checkout install and `hermes update`, startup latency, background subsystems curator/
gateway/cron, SOUL.md persona, memory injection, terminal sandbox backends, non-TTY
approvals, emergency-stop `hermes pause`, telemetry, cost) + the comparison table.
