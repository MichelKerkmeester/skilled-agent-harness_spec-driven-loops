# Iteration 9: Angle 9 — Constraints and differences versus the six runtimes

## Focus

Where Hermes costs more or less than the six runtimes (Python runtime and venv, git-checkout
install and `hermes update`, startup latency, background subsystems that must stay off,
`SOUL.md` persona, memory injection, terminal sandbox backends, non-TTY approvals,
emergency-stop `hermes pause`, telemetry, cost); which hard rules the skill packet must carry;
and the one-row-per-capability comparison table.

## Actions Taken

- Measured startup: `time hermes --version` → 0.86s wall / 0.12s user (live, 2026-09-14);
  version v0.21.1, install method git, Python 3.11.13, 1195 commits behind upstream.
- Read `~/.hermes/config.yaml` (only `plugins.enabled: [orca-status]` — no curator/gateway/
  cron sections, so all background subsystems are off by default).
- Read `hermes_cli/config_defaults.py` lines 736, 1355-1364: curator auxiliary defaults,
  curator ledger/backups, "never a gate".
- Read `agent/estop.py` lines 1-60: pause sentinel scope — cron scheduler, kanban dispatcher
  and NEW gateway turns; CLI chat is NOT stopped.
- Read `tools/environments/` inventory: terminal backends local, docker, ssh, modal, daytona,
  singularity + `local_env_policy.py`.
- Read `hermes_cli/main.py` `_run_and_exit_oneshot` + oneshot.py (approval auto-bypass in -z;
  `approvals.mode` manual|smart|off).
- Ran `hermes pause --help` (exit 0): "Halts NEW work only — cron dispatch, kanban dispatch,
  and new gateway turns — until `hermes resume`. In-flight work is never killed."
- Compared with the six packets (install shape, availability rules, latency notes where the
  packets state them).

## Findings

1. **Startup latency is measured at 0.86s (`hermes --version`, wall) — mid-pack, not a
   blocker.** Python + `_startup_fast.py` keeps cold start under a second; a fan-out iteration
   pays ~1s overhead per dispatch, comparable to claude/codex/devin-class CLIs (those are not
   re-measured in this lineage; the packets do not pin numbers — mark `UNKNOWN` for exact
   cross-runtime comparison). Runtime: Python 3.11 venv under `~/.hermes/hermes-agent`; install
   method git (root AGENTS.md); `hermes update` is a git-based mutation (1195 commits behind —
   version drift is real and the packet must pin the tested version like
   `devin-availability-required` pins the CLI).
   [SOURCE: live `time hermes --version`, 2026-09-14; ~/.hermes/hermes-agent/README.md]

2. **Background subsystems are OFF by default and stay off for fan-out.** Config has no
   curator/gateway/cron sections; curator is auxiliary-defaulted (config_defaults.py:736) and
   its ledger is explicitly "never a gate" (1355-1364). No daemon needs killing for a dispatch
   — unlike a machine where a gateway is installed. The skill packet should state this as an
   assumption (`background-subsystems-assumed-off`), not a required kill list.
   [SOURCE: ~/.hermes/config.yaml; hermes_cli/config_defaults.py:736, 1355-1364]

3. **`hermes pause` does NOT stop CLI dispatches.** estop.py:4 and `hermes pause --help`
   scope the emergency stop to cron/kanban/new gateway turns; in-flight work is never killed;
   CLI chat is untouched. So for fan-out the runner's own kill/timeout IS the emergency stop,
   and a paused operator state does not protect the repo from a dispatched Hermes. The packet
   must not rely on `hermes pause` as a containment control.
   [SOURCE: agent/estop.py:1-60; live `hermes pause --help`, 2026-09-14]

4. **Terminal tool backends give an optional extra containment layer.** The terminal tool
   supports local, docker, ssh, modal, daytona, singularity backends with
   `local_env_policy.py` policy. A docker/ssh backend would confine the terminal beyond the
   repo-watching guard — an option the six runtimes' packets don't uniformly offer (cli-codex
   has `--sandbox`; others rely on approval modes). Not required for the first phase; noted as
   a hardening option.
   [SOURCE: tools/environments/ inventory]

5. **Persona and memory injection are real dispatch-isolation costs.** `SOUL.md` (user-level)
   and memory are injected unless `--ignore-rules` (skips AGENTS.md/SOUL.md/.cursorrules/
   memory/preloaded skills) or `--safe-mode` (adds plugins+MCP off). For fan-out, per-lineage
   `HERMES_HOME` isolation (angle 8) plus `--ignore-rules` when a dispatch must not see prior
   sessions is the recipe; `--safe-mode` additionally isolates plugins/MCP but also disables
   the repo's own skill tree — use selectively. Telemetry: no opt-in outbound telemetry
   without a config gate (root AGENTS.md telemetry rule); cost = provider cost only (Hermes
   itself is free/open source); the llmgateway routes bill per token with a 3x credit bonus
   (same as cli-pi's DevPass route).
   [SOURCE: hermes_cli/_parser.py:165-170; ~/.hermes/SOUL.md; root AGENTS.md telemetry rule;
   cli-pi providers-and-models.md:99-105]

6. **Comparison table (one row per capability, one column per runtime).**

   | Capability | Hermes | cli-opencode | cli-claude-code | cli-codex | cli-cursor | cli-devin | cli-pi |
   |---|---|---|---|---|---|---|---|
   | Headless shape | `chat -Q --oneshot -q` / `-z` | `opencode run` | `claude -p` | `codex exec` | `cursor-agent -p` | `devin -p` | `pi -p` |
   | Exit codes | 0/1/2 or 0/1/130 — trustworthy | 0/non-zero | 0/non-zero | 0/non-zero | always 0 — untrustworthy | 0/non-zero | signal, not primary |
   | Machine-readable stdout | -Q: response on stdout, `session_id:`/`Error:` on stderr; `--usage-file` JSON | `--format json` | `--output-format json` | text | `--output-format json`/`stream-json` | text | `--mode json`/`rpc` |
   | Write-permitting flags | `--yolo` (explicit; -z auto) | `--dangerously-skip-permissions` | `--permission-mode acceptEdits` | `--sandbox workspace-write` (+approval) | `--force`/`--trust` | `--permission-mode dangerous --respect-workspace-trust false` | tool allowlist + per-command |
   | Preventive OS sandbox | none (terminal backend option) | none | tool gate | `--sandbox` real | `--sandbox` real | none | none |
   | Web-search forcing | `-t web` explicit — LIVE | live | inherit only | live | inherit only | inherit only | toolset flags |
   | State isolation | `HERMES_HOME` env / profile — REAL | `OPENCODE_HOME` | `CLAUDE_CONFIG_DIR` | `CODEX_HOME` | none (repo var only) | none (repo var only) | `--session-dir` |
   | Self-invocation signal | `HERMES_TURN_AUTHOR` (scrubbed from children) | `OPENCODE_*` env + ancestry + lock | `CLAUDE_CODE_*` | `CODEX_*` | `CURSOR_AGENT=1` | `DEVIN_*` | none (exempt kind) |
   | Config location | user-level (`~/.hermes/`) — operators step needed | repo (`opencode.json`) | repo (`.claude/`) | repo (`.codex/`) | repo (`.cursor/`) | repo (`.devin/`) | repo (`.pi/`) |
   | Startup latency (measured) | 0.86s (this lineage) | UNKNOWN (not re-measured) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
   | Runtime/install | Python venv, git checkout | Node/binary | Node/npm | Rust/binary | Node/binary | Cloud SDK | Node/npm |
   | Background subsystems | curator/gateway/cron off by default | n/a | n/a | n/a | n/a | n/a | n/a |
   | Emergency stop | `hermes pause` — CLI NOT stopped | n/a | n/a | n/a | n/a | n/a | n/a |
   | Telemetry | opt-in gated | n/a | n/a | n/a | n/a | n/a | n/a |
   | Cost | free; provider per-token (llmgateway 3x bonus) | per provider | subscription OAuth | per provider | subscription | cloud credits | per provider |

   Distinctive wins for Hermes: real `HERMES_HOME` isolation, live web-search forcing,
   trustworthy exit codes, session-id-on-stderr. Distinctive costs: user-level config (trust/
   hooks/MCP), flattening skill surface, no preventive sandbox, pause not CLI-scoped.
   [SOURCE: synthesized from iterations 1-8 + this iteration; six packets]

7. **Hard rules the cli-hermes skill packet must carry** (mirroring the six):
   - `stdin-redirect-required` — `</dev/null` ALWAYS (non-TTY implies oneshot; matches
     cli-devin/cli-opencode).
   - `hermes-availability-required` — version-pin v0.21.1, git install, `hermes --version`
     preflight (matches `devin-availability-required`).
   - `yolo-required-for-writes` — `--yolo` explicit on `chat -Q` dispatches (NOT auto-set).
   - `hermes-home-isolation-required` — per-lineage `HERMES_HOME` + `--ignore-rules` when
     state isolation is demanded.
   - `mcp-config-operator-required` — MCP servers are user-level; the packet carries policy,
     not state.
   - `hooks-user-level` — shell hooks need operator config + allowlist; project plugin is the
     repo-carriable alternative.
   - `web-search-explicit` — `-t web` on/off per dispatch when the run's web policy must be
     enforced.
   [SOURCE: synthesized from iterations 1-8; cli-pi/cli-devin hard-rule precedent]

## Questions Answered

- Q9 (constraints and differences): answered with the comparison table and hard-rule list.

## Questions Remaining

- Q10 (recommendation / phase plan) — next and final iteration.

## Assessment

- newInfoRatio: 0.66 — the measured latency, pause-scope, background-subsystem defaults, and
  the full comparison table are new; cross-runtime latency numbers remain UNKNOWN.
- Confidence: high on Hermes-side facts (measured/live/source); UNKNOWN flagged where the six
  packets do not pin numbers.

## Reflection

- What worked: measuring instead of assuming latency; checking `pause` scope before trusting
  it as a stop control.
- What failed / ruled out: `hermes pause` as a fan-out containment control (CLI not stopped);
  assuming background subsystems need killing (they are off by default).
- Ruled-out direction: relying on terminal-backend confinement in phase 1 (optional hardening
  only).

## Recommended Next Focus

Angle 10: recommendation — phase plan for phases 002+, merge/split/drop of candidate phases
from the parent spec.md, UNKNOWNs until a live contract pin, operator decisions, ranked
recommendations.
