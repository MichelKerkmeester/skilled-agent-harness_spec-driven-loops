# Deep Research Synthesis: Hermes Agent as the seventh cli-external-orchestration runtime

Lineage: `deepseek` (cli-devin / deepseek-v4-flash-max) · Spec: 071-cli-hermes-creation/001-deep-research
Session: `fanout-deepseek-1789402663119-cvvtf8` · 10 iterations · Stop policy: max-iterations

## 1. Executive Summary

Hermes Agent v0.21.1 (Nous Research, installed at `~/.hermes`, upstream `dc90a75a`) is fit to
become the seventh `cli-external-orchestration` runtime and is fit for deep-loop fan-out —
with five caveats carried as hard rules in the future skill packet: no preventive OS sandbox
(the runner's repo-watching containment guard is the compensating control), user-level config
for skills trust / shell hooks / MCP servers (operator steps are real and cannot be
repo-carried), a flattening skill surface when the repo's tree is symlinked (every hub and
mode `SKILL.md` loads as a peer skill), `hermes pause` not stopping CLI dispatches (the
runner's kill is the emergency stop), and a two-model fail-closed roster to start
(`deepseek-v4.1-flash`, `glm-5.3-flash` via the DevPass/LLM Gateway route — the only
credential kind already on this machine that is directly portable).

The dispatch shape is fully resolvable today: `hermes chat -Q --oneshot --max-turns N
--run-budget S --yolo --accept-hooks -t <toolsets> --pass-session-id -q <prompt> </dev/null
--in <repo root>`, with the response on stdout, `session_id:` and `Error:` on stderr, and
trustworthy exit codes (0/1/2). The integration order that worked for cli-pi holds: pin the
contract live, build the executor kind, document the skill packet, create the repo `.hermes/`
folder, bridge the guard cores as a project-local plugin, then route models.

## 2. Research Topic

Hermes Agent (Nous Research, installed at `~/.hermes`, v0.21.1) as the seventh
cli-external-orchestration runtime: headless dispatch contract; providers, repo-local `.hermes`
configuration, skills, agents, commands, hooks, plugins and MCP host compared with the six
existing runtimes (cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi);
deep-loop fan-out fitness; and the phase plan for the integration.

## 3. Methodology

Ten iterations, one per research angle, in the mandated order. Evidence sources: installed
Hermes source under `~/.hermes/hermes-agent/` (cited file:line), live read-only `hermes`
commands (stdin closed), the repo's runtime infrastructure
(`executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `dispatch-audit.mjs`), the six
`cli-*` skill packets, and one live web fetch (agentskills.io specification, 2026-09-14).
Rules of engagement observed: read-only access to `~/.hermes`, no mutating hermes commands,
no smoke dispatches (no configured provider), all writes confined to the lineage directory.
Claims are cited; `documented, unconfirmed` marks code-read claims awaiting a live pin;
`UNKNOWN` marks what cannot be resolved without a mutation or a configured provider.

## 4. Key Findings by Angle

### Angle 1 — Headless dispatch contract

- Three headless shapes: `hermes -z "<prompt>"` (answer-only stdout, no session id, approvals
  auto-bypassed), `hermes chat -q` on a non-TTY (oneshot implied), `hermes chat -Q --oneshot`
  (quiet programmatic; response to stdout, `session_id:` and `Error:` to stderr).
  [iter001: f-iter001-001, f-iter001-003]
- Exit codes: `-z` 0 success / 1 failure or no response / 2 usage error or failed+empty;
  `chat -Q` 0 success / 1 `result.failed` / 130 interrupt. No distinct code for run-budget
  exhaustion (`documented, unconfirmed`: partial-with-response exits 0). [f-iter001-004]
- `--query-file` is injection-safe (`-` reads stdin, nothing shell-interpreted).
  [f-iter001-002]
- Comparison: session-id-on-stderr is cleaner than the six runtimes' JSON-embedded ids;
  exit 2 for usage errors is more granular than cursor's always-0; `chat -Q` has no JSON
  output format (structured needs go through `--usage-file`); `--worktree` is native git
  worktree isolation. [f-iter001-006]

### Angle 2 — Providers, models and reasoning

- Hermes's provider universe is broad (45+ canonical providers incl. deepseek, zai/GLM,
  xiaomi/MiMo, minimax, xai/Grok, openai-codex OAuth, ai-gateway, custom, local/vllm), with
  transports openai_chat/anthropic_messages/codex_responses. [f-iter002-001]
- The machine's Hermes install has ZERO configured provider credentials (live `hermes
  status`: all keys not set; `.env` is debug settings only) — no smoke dispatch permitted,
  any dispatch today fails auth. [f-iter002-002]
- The one directly portable credential kind is `LLMGATEWAY_API_KEY` (DevPass, base
  `https://api.llmgateway.io/v1`, OpenAI-compatible) via Hermes's `custom` provider
  (`providers:` + `key_env`). [f-iter002-003]
- OAuth credentials are not portable between runtimes: Hermes Codex tokens live in
  `~/.hermes/auth.json`, explicitly not `~/.codex/`; pi/opencode auth stores are not read by
  other tools. [f-iter002-004]
- Reasoning caps are tri-state from OpenRouter/Nous catalogs; the effort-name mapping for
  the llmgateway custom route needs a live pin (gateway accepts low/high/max for
  deepseek-v4.1-flash). [f-iter002-005]
- Fail-closed `HERMES_SUPPORTED_MODELS` starts at exactly two models: `deepseek-v4.1-flash`
  and `glm-5.3-flash` (two-segment `llmgateway/<id>` selector, effort pin max). [f-iter002-006]

### Angle 3 — Repo-root `.hermes/` folder and instruction files

- CWD instruction files: exactly `AGENTS.md`, `CLAUDE.md`, `.cursorrules`; `SOUL.md` is
  user-level (`~/.hermes/SOUL.md`). [f-iter003-001]
- Project skills live only in `./.hermes/skills` and `./.agents/skills`, gated on the root
  being in `skills.trusted_project_dirs`; `hermes skills trust` records that in USER-level
  config.yaml — the repo cannot carry the trust grant. [f-iter003-002]
- A symlinked `./.hermes/skills -> .opencode/skills` is followed and FLATTENED (`os.walk`
  with `followlinks=True`): all 174 SKILL.md files become peer skills; no parent-hub concept.
  [f-iter003-003]
- Quarantine is fail-closed per skill dir (scanner crash quarantines); symlink escape inside
  a skill dir is a critical traversal flag; prefer whole-dir symlinks over per-file ones.
  [f-iter003-004]
- No read-only command reports the project-skill load result — the verdict needs the trust
  mutation. [f-iter003-005]

### Angle 4 — Skill format compatibility

- All 174 repo SKILL.md files pass Hermes's hard validator (name + description + body +
  name-dir match); zero hard-rejected. [f-iter004-001]
- ALL 174 descriptions exceed the 60-char prompt budget — uniform truncation to 57 + "...",
  routing signal loss. [f-iter004-002]
- Advisory linter warnings (missing version/author/license, missing metadata.hermes.*)
  fire nearly everywhere but never block. [f-iter004-003]
- Flattening loads every hub and mode as a peer skill (~174 entries). [f-iter004-004]
- Hermes honors the agentskills.io convention structurally (name + description + directory),
  stricter on description (60 vs 1024 chars). [f-iter004-006]

### Angle 5 — Agents, commands and persona

- Profiles are whole-home independent islands, not personas; wrong tool for 13 agents.
  [f-iter005-001]
- `delegate_task` children get goal+context only; cannot consume `.claude/agents/*.md`.
  [f-iter005-002]
- `hermes import-agent` maps CLAUDE.md/mcp/skills/memories (claude-code/codex only) — NOT
  agent files; running it here would copy repo state and bypass trust/quarantine. Do not use.
  [f-iter005-003]
- Persona routes: inline the persona into the dispatch prompt (cli-codex/cli-pi precedent)
  or translate to a "persona skill" preloaded via `-s`. [f-iter005-004]
- Nested `.opencode/commands/**` have no Hermes equivalent (no workflow engine); the cli-pi
  precedent (flatten to prompt templates, carrier `--query-file`) applies. [f-iter005-005]

### Angle 6 — Hooks and plugins

- Shell hooks are user-config-only with a per-command consent allowlist
  (`~/.hermes/shell-hooks-allowlist.json`); `--accept-hooks`/`HERMES_ACCEPT_HOOKS=1` bypass
  on headless runs. [f-iter006-001]
- Plugin `VALID_HOOKS` is rich enough for every repo guard core: `pre_tool_call`,
  `pre_verify` (block/continue — the exact match for completion-evidence stop),
  `on_session_start/end/finalize/reset`, `subagent_start/stop`, `pre_gateway_dispatch`.
  [f-iter006-002]
- Project-local plugins (`./.hermes/plugins/<name>/`, opt-in
  `HERMES_ENABLE_PROJECT_PLUGINS`) are the repo-carriable bridge; shell out to the existing
  .mjs/.sh guard cores. [f-iter006-003, f-iter006-004]
- Agent Plugins v1 portable packages exist but are deferred (unsettled hook surface).
  [f-iter006-005]

### Angle 7 — MCP

- `mcp_servers:` is user-config-only; the repo cannot carry MCP config — a structural
  difference from all six runtimes (hard rule `mcp-config-operator-required`). [f-iter007-001,
  f-iter007-006]
- The repo's `code_mode` stdio server (`node .opencode/bin/mcp-code-mode-launcher.cjs` +
  `UTCP_CONFIG_FILE=.utcp_config.json`) fits `hermes mcp add --command/--args/--env`
  byte-for-byte (`documented, unconfirmed`). [f-iter007-002]
- Deny-by-default per tool via `hermes tools disable server:tool`; pre-spawn security
  filters drop exfiltration-shaped configs; OAuth device flow for remote servers.
  [f-iter007-003, f-iter007-004]
- `hermes mcp serve` (Hermes as an MCP server) is not useful for this integration. [f-iter007-005]

### Angle 8 — Deep-loop fan-out fitness

- Builder shape resolvable today: `hermes chat -Q --oneshot --max-turns N --run-budget S
  --yolo --accept-hooks -t <toolsets> --pass-session-id -q <prompt> </dev/null --in <repo root>`;
  `--yolo` must be explicit (chat -Q does not auto-set it, unlike -z). [f-iter008-001]
- No preventive OS sandbox — same class as cli-opencode/cli-devin/cli-pi; flag support:
  model, reasoningEffort, timeoutSeconds, liveTools. [f-iter008-002]
- Web search is forceable per dispatch (`-t web` replaces the configured set) — matrix
  entry live:true, better than cursor/devin/claude-code. [f-iter008-003]
- `HERMES_HOME` is a real state-dir override (profile-aware) — per-lineage isolation via env;
  repo var `SPECKIT_HERMES_STATE_DIR`; env prefix `HERMES_`. [f-iter008-004]
- Self-invocation: `HERMES_TURN_AUTHOR` is the bot-to-bot marker but Hermes scrubs it from
  child subprocesses — ancestry/lineage marker required; nested hermes is not blocked
  natively. [f-iter008-005]
- Exit codes are trustworthy for the stop-policy check; `~/.hermes` writes (sessions,
  memories, logs) are outside the repo-watching containment guard; `--ignore-rules`/
  `HERMES_HOME` handle state leakage. [f-iter008-006]

### Angle 9 — Constraints and differences versus the six runtimes

- Startup measured at 0.86s (`hermes --version`, wall); version drift real (1195 commits
  behind) — pin v0.21.1. [f-iter009-001]
- Background subsystems (curator/gateway/cron) are OFF by default; nothing to kill.
  [f-iter009-002]
- `hermes pause` does NOT stop CLI dispatches — the runner's kill is the fan-out emergency
  stop. [f-iter009-003]
- Terminal backends (docker/ssh/modal/daytona/singularity) are optional hardening.
  [f-iter009-004]
- `SOUL.md` + memory injection are isolation costs handled by `--ignore-rules`/`--safe-mode`;
  telemetry is opt-in gated; cost is provider-only. [f-iter009-005]
- Full 14-row × 7-runtime comparison table produced (Section 6 below). [f-iter009-006]
- Seven hard rules for the cli-hermes packet: `stdin-redirect-required`,
  `hermes-availability-required`, `yolo-required-for-writes`,
  `hermes-home-isolation-required`, `mcp-config-operator-required`, `hooks-user-level`,
  `web-search-explicit`. [f-iter009-007]

### Angle 10 — Recommendation

- Parent phase set is sound: merge 006 (agent/command bridge) into 004 (skill packet);
  merge 008 (MCP) into 004; narrow 007 to the project-local plugin; keep 005 separate;
  no splits, no drops. [f-iter010-001]
- Ranked plan R1-R8 with the failure each prevents (Section 7). [f-iter010-002]
- Seven UNKNOWNs for the live contract pin and five operator decisions (Section 8).
  [f-iter010-003, f-iter010-004]
- Verdict: fit as the seventh runtime and fit for fan-out, with the hard-rule caveats.
  [f-iter010-005]

## 5. Comparison with the Six Runtimes (one row per capability)

| Capability | Hermes | cli-opencode | cli-claude-code | cli-codex | cli-cursor | cli-devin | cli-pi |
|---|---|---|---|---|---|---|---|
| Headless shape | `chat -Q --oneshot -q` / `-z` | `opencode run` | `claude -p` | `codex exec` | `cursor-agent -p` | `devin -p` | `pi -p` |
| Exit codes | 0/1/2 or 0/1/130 — trustworthy | 0/non-zero | 0/non-zero | 0/non-zero | always 0 — untrustworthy | 0/non-zero | signal, not primary |
| Machine-readable stdout | -Q: response on stdout, `session_id:`/`Error:` on stderr; `--usage-file` JSON | `--format json` | `--output-format json` | text | `--output-format json`/`stream-json` | text | `--mode json`/`rpc` |
| Write-permitting flags | `--yolo` (explicit; -z auto) | `--dangerously-skip-permissions` | `--permission-mode acceptEdits` | `--sandbox workspace-write` | `--force`/`--trust` | `--permission-mode dangerous --respect-workspace-trust false` | tool allowlist + per-command |
| Preventive OS sandbox | none (terminal backend option) | none | tool gate | `--sandbox` real | `--sandbox` real | none | none |
| Web-search forcing | `-t web` explicit — LIVE | live | inherit only | live | inherit only | inherit only | toolset flags |
| State isolation | `HERMES_HOME` env / profile — REAL | `OPENCODE_HOME` | `CLAUDE_CONFIG_DIR` | `CODEX_HOME` | none (repo var only) | none (repo var only) | `--session-dir` |
| Self-invocation signal | `HERMES_TURN_AUTHOR` (scrubbed from children) | `OPENCODE_*` env + ancestry + lock | `CLAUDE_CODE_*` | `CODEX_*` | `CURSOR_AGENT=1` | `DEVIN_*` | none (exempt kind) |
| Config location | user-level (`~/.hermes/`) — operator steps needed | repo (`opencode.json`) | repo (`.claude/`) | repo (`.codex/`) | repo (`.cursor/`) | repo (`.devin/`) | repo (`.pi/`) |
| Startup latency (measured) | 0.86s (this lineage) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Runtime/install | Python venv, git checkout | Node/binary | Node/npm | Rust/binary | Node/binary | Cloud SDK | Node/npm |
| Background subsystems | curator/gateway/cron off by default | n/a | n/a | n/a | n/a | n/a | n/a |
| Emergency stop | `hermes pause` — CLI NOT stopped | n/a | n/a | n/a | n/a | n/a | n/a |
| Telemetry | opt-in gated | n/a | n/a | n/a | n/a | n/a | n/a |
| Cost | free; provider per-token (llmgateway 3x bonus) | per provider | subscription OAuth | per provider | subscription | cloud credits | per provider |

Sources: iterations 1-9; six `cli-*` packets (cli-reference.md, providers-and-models.md,
SKILL.md). Cross-runtime latency numbers are UNKNOWN where the packets do not pin them.

## 6. Comparison with the repo's own integration surface (runtime enumeration points)

- `executor-config.ts`: `EXECUTOR_KINDS` (line 11), `EXECUTOR_KIND_FLAG_SUPPORT` (79-99),
  preventive-sandbox map (124-135), web-search matrix (164+), `DEVIN_SUPPORTED_MODELS`,
  `PI_SUPPORTED_MODELS` — a seventh kind extends all of these.
- `executor-audit.ts`: state-dir env map (80-91), `SELF_PRESENCE_EXEMPT_KINDS` (108),
  session env prefixes (133-152) — cli-hermes gets `SPECKIT_HERMES_STATE_DIR` + `HERMES_`
  prefix.
- `fanout-run.cjs`: builders per kind (devin ~2403, pi ~2515), model allowlists — a
  `buildHermesLineageCommand` mirrors the pi builder with the angle-8 contract.
- `dispatch-audit.mjs` (28-36): binary regex table gains a `hermes` row.
- `combo-matrix.vitest.ts` (61-74): per-kind model/binary tables gain the seventh kind.
- Hub registration: `hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, hub
  SKILL.md mode table + layout block — the seven-surface contract.

## 7. Recommended Phase Plan (ranked)

| # | Phase | Change | Failure prevented |
|---|---|---|---|
| R1 | `002-hermes-contract-pin` (required) | Live-verify: budget-exhaustion exit code, `--yolo` on non-TTY, real dispatch byte-shape, `--query-file` round-trip, `--worktree` | Scaffolding later phases on code-read claims |
| R2 | `003-deep-loop-executor-support` (required) | Seventh `ExecutorKind` per the angle-8 builder spec; `HERMES_SUPPORTED_MODELS`; flag-support/env/audit maps; dispatch-audit row; combo-matrix tests | An unavailable/off-roster hermes becoming routable |
| R3 | `004-cli-hermes-skill-packet` (required; absorbs 006 + 008) | `sk-create-skill` packet with the seven hard rules; references (cli-reference, providers-and-models, agent-delegation, hook-contract, mcp-policy); hub registration | A seventh mode with no documented contract; breaking the six existing modes |
| R4 | `005-hermes-runtime-folder` (required) | Repo-root `.hermes/`: whole-dir skills symlink, `prompts/` templates, `plugins/repo-guards/`, `SYNC.md` + playbook symlink | Repo-local skills/prompts with no carrier |
| R5 | `007-hermes-hook-and-plugin-layer` (required; narrowed) | `./.hermes/plugins/repo-guards`: pre_verify→completion-evidence, pre_tool_call→dispatch audit, on_session_*→context; shell out to existing cores; document the env gate | Unguarded Hermes dispatches |
| R6 | `009-hermes-model-registry-and-routing` (required; gated) | Operator credential step (llmgateway `providers:` + `key_env`); roster enforcement; `HERMES_REASONING_TO_GATEWAY` effort map | Off-roster dispatch and effort-name mismatch |
| R7 | `010-hermes-playbook-and-catalog` (optional) | Manual-testing playbook + feature catalog | Untested packet claims |
| R8 | `011-governance-closeout` (optional) | Roster/governance mentions as the seventh runtime | Roster drift |

Merges: 006 → 004; 008 → 004. Narrow: 007. Splits: none. Drops: none (as standalone
phases, 006 and 008 disappear into 004).

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| `hermes -z` as the fan-out dispatch shape | No session id on stdout; no `--max-turns`/`--run-budget` on the top-level flag set | hermes_cli/_parser.py:113-118 | 1 |
| Exit-code-only success detection | `chat -Q` exits 0 on partial-with-response; stderr must be parsed for `Error:`/`session_id:` | cli.py:4108-4117 | 1 |
| Porting OAuth credentials from pi/opencode/codex auth stores | Each runtime keeps its own OAuth session; Hermes Codex tokens live in `~/.hermes/auth.json`, explicitly not `~/.codex/` | auth_codex.py:3-4 | 2 |
| Dispatching before credential configuration | All keys not set; auth would fail | live `hermes status`, 2026-09-14 | 2 |
| `hermes skills check` as the project-skill load reporter | Covers hub-installed skills only; project verdict needs the trust mutation | live output, 2026-09-14 | 3 |
| Per-file symlinks into `.opencode/skills` from `.hermes` | `skills_guard` flags `symlink_escape` (critical) for symlinks resolving outside a skill dir | skills_guard.py:538-543 | 3 |
| Carrying the trust grant inside the repo `.hermes` folder | `hermes skills trust` writes `skills.trusted_project_dirs` to user-level config.yaml | main_agent_cmds.py:179-233 | 3 |
| Mass frontmatter retrofit as a load precondition | Skills load without Hermes-standard frontmatter; only routing signal degrades | skill_manager_tool.py:130-175 | 4 |
| `hermes import-agent` in the integration plan | Copies repo state, bypasses trust/quarantine, does not import agent files | agent_import.py:26-32 | 5 |
| 13 profiles for the repo's 13 agents | Profiles are whole-home islands, not personas | profiles.py:133-280 | 5 |
| Direct slash-command registration for opencode commands | Hermes has no workflow engine | commands.py + skill_commands.py | 5 |
| Shell hooks as the repo carrier for guard cores | User-config-only with consent allowlist | shell_hooks.py:141-163 | 6 |
| Agent Plugins v1 as the first bridge | Unsettled hook surface vs native VALID_HOOKS | agent_plugins.py:87-90 | 6 |
| Re-implementing guard cores inside a Hermes plugin | Shell out to the existing .mjs/.sh cores instead | plugins/AGENTS.md | 6 |
| `hermes mcp serve` as an integration goal | No consumer topology among the six runtimes | live help, 2026-09-14 | 7 |
| Repo-carried MCP config like the six runtimes | `mcp_servers:` is user-level only | mcp_config.py:55-141 | 7 |
| Env-inheritance-based nesting detection | Hermes scrubs `HERMES_TURN_AUTHOR` from children | turn_author.py:85-90 | 8 |
| `--yolo` as a preventive sandbox | Approval bypass only; no OS confinement flag | executor-config.ts:124-135 | 8 |
| `~/.hermes` writes as containment-relevant | The guard watches the repository only | executor-audit.ts | 8 |
| `hermes pause` as a containment control | Emergency stop scopes to cron/kanban/gateway; CLI not stopped | estop.py:1-60 | 9 |
| Killing background subsystems per dispatch | Off by default; curator never a gate | config_defaults.py:736 | 9 |
| Terminal-backend confinement in phase 1 | Optional hardening only | tools/environments/ | 9 |
| Standalone 006 and 008 phases | Deliverables are skill-packet content | parent spec.md:108-139 | 10 |
| Phase 009 before the operator credential step | Unreachable and untestable until llmgateway is configured | iteration 2 | 10 |

## Divergence Map

- Completed pivots: 0 (convergence mode `default`; no divergent pivots were eligible).
- Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none — each of the ten angles was worked once with no repeat passes
  required (10 angles / 10 iterations).
- Pivot lineage: none.
- Remaining frontier: the live contract pin (phase 002) and the operator-gated surfaces
  (skills trust, llmgateway provider config, MCP add) — all UNKNOWNs listed in Section 8.

## 8. Open Questions (UNKNOWN until a live contract pin or operator action)

- `chat -Q` exit code on run-budget exhaustion (code-read: partial-with-response → 0).
- Skills trust + symlinked-tree scan verdict for this repo (requires the trust mutation).
- Reasoning effort-name mapping through the llmgateway custom route.
- `code_mode` MCP add end-to-end (`--env` handling, tool discovery).
- Real dispatch byte-shape with a configured provider (none configured; smoke dispatches not
  permitted).
- `HERMES_HOME` isolation side effects on a fresh home (sessions DB bootstrap).
- Startup latency of a real dispatch (0.86s `--version` is a lower bound).

## 9. Operator Decisions Required

1. Confirm the phase plan (parent handoff criterion).
2. Configure the llmgateway provider in `~/.hermes` (key_env only) and approve the two-model
   roster.
3. Run `hermes skills trust` on the repo.
4. Persona strategy: inline personas (start) vs 13 persona-skills (only if prompt bloat
   becomes measurable).
5. Whether 010 and 011 run as separate phases or fold into 004's closeout.

## 10. Out of Bounds (per research-angles.md)

Hermes messaging gateways, cron, kanban, voice, desktop, TUI skins, pets and journeys;
modifying Hermes source or the operator's `~/.hermes` configuration; building anything.
All respected — no mutation was performed and no smoke dispatch fired.

## 11. References

- `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/resource-map.md`
  (58 references; cited throughout as known inventory, not rediscovered).
- Installed Hermes source: `~/.hermes/hermes-agent/` (v0.21.1, upstream `dc90a75a`) — cited
  per finding as `file:~/.hermes/hermes-agent/<path>:<line>`.
- Live read-only command output: `hermes chat --help`, `hermes status`, `hermes config show`,
  `hermes skills list`, `hermes skills check`, `hermes hooks list`, `hermes plugins list`,
  `hermes mcp list`, `hermes mcp add --help`, `hermes mcp serve --help`, `hermes tools
  --help`, `hermes import-agent --help`, `hermes pause --help`, `time hermes --version`
  (2026-09-14).
- Repo runtime infrastructure: `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`,
  `dispatch-audit.mjs`, `combo-matrix.vitest.ts`; six `cli-*` skill packets under
  `.opencode/skills/cli-external-orchestration/`.
- Web: https://agentskills.io/specification.md (fetched 2026-09-14).
- All iteration files: `iterations/iteration-001.md` .. `iteration-010.md`; deltas:
  `deltas/iter-001.jsonl` .. `iter-010.jsonl`; registry: `findings-registry.json`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 10 / 10
- Remaining questions: 0
- Last 3 iteration summaries: run 8: Angle 8: deep-loop fan-out fitness (0.80); run 9:
  Angle 9: constraints and differences versus the six runtimes (0.66); run 10: Angle 10:
  recommendation (0.55)
- Convergence threshold: 0.05 (telemetry only under the max-iterations stop policy)
- Divergence summary: no divergent pivots recorded; all ten angles covered in one pass each
