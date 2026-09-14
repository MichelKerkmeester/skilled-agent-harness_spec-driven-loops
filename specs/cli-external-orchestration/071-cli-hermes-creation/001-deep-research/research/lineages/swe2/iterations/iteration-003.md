---
title: "Iteration 3: Deep-loop fan-out fitness (Angle 8)"
trigger_phrases: []
---
# Iteration 3: Deep-loop fan-out fitness

## Focus
Angle 8 — what a `buildHermesLineageCommand` needs: write-permitting headless flags, approval semantics, per-iteration timeout, stdin handling, per-lineage state isolation, env passthrough/stripping, self-invocation signal, nested-`hermes` posture, exit-code trustworthiness for the runner's stop-policy check, out-of-repo writes versus the write-containment guard, and per-dispatch web-search control.

## Actions Taken
- Read `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:1-125` — `EXECUTOR_KINDS`, `REASONING_EFFORTS`, `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` (incl. per-kind compensating-control comments).
- Read `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:75-153` — session-env, state-env, default-home-dir, `SELF_PRESENCE_EXEMPT_KINDS`, common env allowlist, per-kind env prefixes.
- Grepped Hermes for env vars the agent SETS (self-invocation markers): `main.py:555,1714-1721,2766,2856-2864,3030,3085-3088,3145,3427`, `agent_init.py:1117`, `approval_context.py`, `gateway.py:1127`.
- Read profile plumbing: `_parser.py:11-14` (`--profile`/`-p` pre-parse), `main.py:398-439, 511-512` (`_apply_profile_override` sets `HERMES_HOME` before imports), `profile_cmd.py:161-237` (`get_profile_dir`, `create_profile`, `seed_profile_skills`); confirmed `~/.hermes/profiles/` does not exist (no profiles yet).
- Cross-referenced iteration 1/2 findings (`-z` vs `chat -Q`, approval gate, usage-file, toolset names).

## Findings

### F1. `cli-hermes` maps cleanly onto the existing executor schema
A seventh kind touches the same tables the six existing kinds extend:
- `EXECUTOR_KINDS` (executor-config.ts:11) += `'cli-hermes'`.
- `EXECUTOR_KIND_FLAG_SUPPORT`: `['model','reasoningEffort','configDir','timeoutSeconds','liveTools']` — `model`→`-m/--model`; **`reasoningEffort`→`--reasoning` is an exact enum match** (repo `REASONING_EFFORTS` = `none,minimal,low,medium,high,xhigh,max,ultra` — literally Hermes's level set, executor-config.ts:15 vs `hermes chat --help`); `configDir`→`HERMES_HOME`/`--profile` — a true home-dir override, stronger than `cli-devin`'s file-only `--config` (executor-config.ts:92-94 documents why devin can't take configDir); `sandboxMode` excluded (no OS sandbox flag exists). [SOURCE: executor-config.ts:11-100; ~/.hermes/hermes-agent/hermes_cli/_parser.py:11-14; main.py:511-512]
- `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY['cli-hermes'] = false` — same posture as `cli-devin`/`cli-pi`/`cli-opencode`: confinement is the fan-out's post-hoc write-containment guard, not an OS boundary. [SOURCE: executor-config.ts:117-125]
- `EXECUTOR_STATE_ENV_BY_KIND` += `['SPECKIT_HERMES_STATE_DIR','HERMES_HOME']`; `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` += `'.hermes'`; `EXECUTOR_ENV_PREFIXES_BY_KIND` += `['HERMES_']` plus roster-scoped provider prefixes (e.g. `GLM_`/`ZAI_`/`MINIMAX_`/`XAI_`/`DEEPSEEK_`/`XIAOMI_`/`OPENROUTER_` — evidence-based per rostered provider, matching the pi precedent that earned `LLMGATEWAY_`/`CLINE_` only after an observed failure, executor-audit.ts:145-152). [SOURCE: executor-audit.ts:79-153]

### F2. The lineage dispatch shape is `chat -Q -q` + `--yolo`, not `-z`
`hermes chat -Q -q "$PROMPT" --yolo --run-budget <sec> --max-turns <N> --source tool --in <repo>` with stdin closed gives: response-only stdout, `session_id:` on stderr for lineage bookkeeping, deterministic non-TTY behavior, and write permission. `-z` is rejected for lineages (iteration 1): it force-sets `HERMES_YOLO_MODE=1` AND drops the session id entirely — an auto-approve with no audit handle. The `chat -Q` form keeps the audit surface while `--yolo` supplies the same write permission deliberately. Note `-z` also auto-accepts hooks (`HERMES_ACCEPT_HOOKS=1`); `chat -q` does not — so a config declaring shell hooks would need `--accept-hooks` explicitly on the `chat` form (today `~/.hermes/config.yaml` declares none — only `plugins.enabled: [orca-status]`). [SOURCE: iteration-001 F2-F4; ~/.hermes/hermes-agent/hermes_cli/oneshot.py:200-202; cli.py:4395-4403; ~/.hermes/config.yaml]

### F3. Self-invocation signal exists: `HERMES_AGENT=true` (+ `HERMES_SESSION_ID`)
`main.py:3145` sets `os.environ.setdefault("HERMES_AGENT","true")` on every Hermes process; `agent_init.py:1117` sets `HERMES_SESSION_ID`. Both are inherited by anything Hermes's terminal tool spawns — so the runner's self-presence check gets `HERMES_AGENT` exactly like cursor's `CURSOR_AGENT=1`. `cli-hermes` must NOT join `SELF_PRESENCE_EXEMPT_KINDS`: that exemption exists only because Pi has no in-process delegation (executor-audit.ts:103-108), while Hermes has `delegate_task` sub-agents — a Hermes session can hand work out without re-dispatching the CLI, so the ancestry/lockfile layers should still apply. No Hermes-side nested-`hermes` block was found; the terminal tool can in principle spawn `hermes` again, so detection is entirely the runner's env-marker + prompt contract. [SOURCE: ~/.hermes/hermes-agent/hermes_cli/main.py:3137-3145; agent/agent_init.py:1117; executor-audit.ts:103-108]

### F4. Per-lineage state isolation is real but trades against credentials
`--profile/-p` is pre-parsed from argv before argparse and sets `HERMES_HOME` before any module import (main.py:398-439, 511-512) — every `get_hermes_home()` consumer (config.yaml, .env, SOUL.md, sessions/, memories/, skills/, logs/, auth.json, cache/) scopes to the profile. Profiles are deliberately "independent islands" (no live config inheritance; `--clone` at creation). **The trade:** a fresh profile gets a fresh `.env`/`auth.json` → every provider is logged out inside it. For fan-out the options are (a) shared default home + `--ignore-rules` + `--source tool` — memory/rules injection off (no prior-session bleed into the prompt), session/log writes land in shared `~/.hermes` (outside the repo → the repo-watching containment guard is unaffected); or (b) a dedicated `cli-hermes-fanout` profile — full isolation but the credential store must be re-established inside it first (Codex import path could seed `auth.json`). Phase 1 should take (a); (b) becomes viable after the auth contract pin. [SOURCE: ~/.hermes/hermes-agent/hermes_cli/main.py:398-439, 511-512; profile_cmd.py:161-237; hermes_cli/AGENTS.md Profiles section; iteration-001 F5]

### F5. Out-of-repo writes are containment-safe; `--worktree` is the one hazard
Hermes writes sessions DB, memories, checkpoints, logs, cache under `HERMES_HOME` — all outside the repository, so the fan-out write-containment guard (repo-only watcher) is unaffected by normal runs. **`--worktree` is the exception**: it runs `git worktree add`, which writes `.git/worktrees/` INSIDE the source repo — a containment-visible repo mutation the lineage did not intend. The lineage builder must not pass `--worktree`; worktree isolation, if ever wanted, belongs to the runner's own worktree layer. [SOURCE: `hermes chat --help` 2026-09-14; ~/.hermes/hermes-agent/cli.py:1025-1064 (worktree remove/unlock helpers)]

### F6. Web search is per-dispatch controllable via `-t/--toolsets`
`-t` takes a comma-separated enable list over the `TOOLSETS` dict (which includes `web`, `search`, `x_search`, plus `terminal`, `delegation`, `skills`, `memory`, `coding`, …). Mapping to the runner's policy enum: `live` = include `web`/`search`; `disabled` = an explicit list excluding them; `cached` = no Hermes-side equivalent (UNKNOWN; likely unsupported). Bonus: `--toolsets` can also strip `delegation` for leaf lineages or `memory` to be extra-safe against bleed — finer-grained than any of the six existing runtimes. [SOURCE: ~/.hermes/hermes-agent/toolsets.py via resource-map §9; `hermes chat --help` 2026-09-14; executor-config.ts:128-130]

### F7. stdin/prompt transport: three options, one rule
`--query-file PATH` reads a file verbatim, `--query-file -` reads stdin verbatim (nothing shell-interpreted), `-q` takes argv. The repo's `</dev/null` rule generalizes: either stdin IS the prompt channel (`--query-file - < prompt.md`) or it stays closed. Argv `-q` risks ARG_MAX on long prompts — `--query-file` is the safe default for iteration briefs. [SOURCE: `hermes chat --help` 2026-09-14; _parser.py via resource-map §2]

### F8. Exit-code trust for the stop-policy check: adequate, with one gap
`chat -Q` exits 0/1 (1 on `result.failed`), 130 on interrupt; `-z` adds 2 for usage/empty-fail. `--run-budget` expiry ends the turn and resolves to the same 0/1 — **no distinct budget-exhaustion code exists**, so the runner cannot distinguish "budget cut a thin answer" from "complete answer" by exit code alone; pair `--run-budget` slightly under the runner's `timeoutSeconds` kill so the in-agent wrap-up wins the race, and treat exit-0-with-empty-response as a soft-fail. The hard `os._exit(rc)` prevents late code-flip, so the code the runner sees is the code the turn produced — trustworthy. [SOURCE: iteration-001 F2-F4; ~/.hermes/hermes-agent/cli.py:4103-4117; oneshot.py:259-265]

### F9. Residual bleed channels the packet's hard rules must name
- Memory/rules/persona injection: `--ignore-rules` (or `--safe-mode` when plugins/MCP must also die) is the mandatory lineage flag — without it `SOUL.md` + memory + AGENTS.md all inject.
- MCP cold-start: the `chat` path waits the full MCP bound before its only tool snapshot (#51316) — with no MCP servers configured today this is a no-op, but any future `hermes mcp add` makes lineage startup pay it; `--safe-mode` or a profile-scoped config controls it.
- Hooks: only fire if `~/.hermes/config.yaml` declares them; none today. Do not pass `--accept-hooks` on the `chat` form unless the repo intentionally ships Hermes hooks.
- Curator/cron/gateway are separate daemons — `chat` does not spawn them; nothing to disable per dispatch. [SOURCE: cli.py:4384-4427; _parser.py:165-170; resource-map §9 `~/.hermes` inventory]

## Questions Answered
- Angle 8 core: `buildHermesLineageCommand` = `hermes chat -Q --query-file <prompt> --yolo --run-budget <T> --max-turns <N> --source tool --in <repo> </dev/null` (or `-q` for short prompts); isolation via shared-home+`--ignore-rules` first, `--profile` later; env prefixes `HERMES_` + roster providers; self-invocation via `HERMES_AGENT`; exit codes trustworthy modulo the budget-exhaustion gap; containment-safe except `--worktree`.

## Questions Remaining
- Does `--run-budget` expiry ever produce a distinct stderr signature (the wrap-up notice is in-band; UNKNOWN whether parseable)?
- `delegation.subagent_auto_approve`/`child_timeout_seconds` semantics for `delegate_task` inside a lineage (named in tools/AGENTS.md; not yet read — affects whether nested Hermes agents could bypass the leaf rule).
- Whether `hermes profile create --clone` + Codex import is enough to make a fully isolated credentialled profile (UNKNOWN until contract pin).

## Dead Ends
- Looking for an OS-sandbox flag: none exists; Hermes confinement is approval-gate + terminal-backend (`tools/environments/` local/docker/ssh/modal/daytona/singularity — a remote/docker terminal backend could BE a real sandbox, worth a later-phase look; `terminal.backend` is config-level, not a per-run flag).

## Ruled Out
- **`hermes -z` for lineages** (reiterated): auto-yolo + no session id — the un-auditable form.
- **`--worktree` in the lineage command**: writes `.git/worktrees/` inside the repo → containment trip.
- **`cli-hermes` in `SELF_PRESENCE_EXEMPT_KINDS`**: Hermes has `delegate_task`; the exemption is pi-specific by design.

## Reflection
What worked: the repo-side tables (`EXECUTOR_KIND_FLAG_SUPPORT`, audit env tables) are designed for exactly this — every Hermes capability found a named slot, and the reasoning-effort enum is an exact match. What failed: nothing testable live (still no provider) — the `chat -Q` path semantics are source-derived. Negative knowledge: profiles solve state isolation but silently drop credentials; `-z` is a trap for lineages despite looking like the obvious choice.

## Assessment
- newInfoRatio: 0.85
- Novelty justification: The executor-table mapping, self-invocation marker, profile-vs-credential tension, worktree containment hazard, and toolset-level web control are new; base flag semantics carried over from iteration 1.
- Confidence: high on registration/isolation/marker findings (both sides read); medium on runtime behavior of `chat -Q --yolo` end-to-end (documented, unconfirmed — needs the contract pin).

## Recommended Next Focus
Angle 9 — constraints and differences versus the six runtimes: build the capability comparison table (install/runtime, startup, state surfaces, approval model, sandbox, hooks, MCP, skills, agents, commands, persona/memory, telemetry) and name the hard rules a `cli-hermes` packet needs.

## SCOPE VIOLATIONS
None.
