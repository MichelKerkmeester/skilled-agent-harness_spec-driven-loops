---
title: Deep Research Strategy - Hermes as a cli-external-orchestration runtime (lineage deepseek)
description: Persistent research plan for the deepseek fan-out lineage of the Hermes runtime research run.
trigger_phrases:
  - "deep research strategy"
  - "hermes research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

Fan-out lineage `deepseek` (executor cli-devin, model deepseek-v4-flash-max) of phase 001
deep-research for packet 071-cli-hermes-creation. Ten iterations, stop policy
max-iterations (convergence before the cap is telemetry only).

## 2. TOPIC

Hermes Agent (Nous Research, installed at `~/.hermes`, v0.21.1, upstream `dc90a75a`) as the
seventh `cli-external-orchestration` runtime: what it can and cannot do as a headless dispatch
target; how its providers, repo-local `.hermes` configuration, skills, agents, commands, hooks,
plugins and MCP host compare with the six existing runtimes (cli-opencode, cli-claude-code,
cli-codex, cli-cursor, cli-devin, cli-pi); whether it is fit for deep-loop fan-out; and what
phase plan the integration should follow.

## 3. KEY QUESTIONS (remaining)

- [x] Q1 Headless dispatch contract: exact non-interactive invocation, per-flag semantics on a
      non-TTY, exit codes, machine-readable stdout and session id; comparison with the six
      `cli-reference.md` contracts (Angle 1).
- [x] Q2 Providers/models: which of the repo's routed models can Hermes reach with the
      credential kinds already on this machine; `--reasoning` mapping; a fail-closed
      `HERMES_SUPPORTED_MODELS` roster (Angle 2).
- [x] Q3 Repo-local surface: what Hermes reads from the working directory, `hermes skills
      trust` + quarantine behavior on a symlinked skill tree, what must live at the repo root
      versus `~/.hermes`, symlink strategy per the `.pi/`/`.devin/`/`.cursor/` patterns
      (Angle 3).
- [x] Q4 Skill format compatibility: required SKILL.md frontmatter, which repo hubs would
      load/quarantine and why, reporting command that does not install (Angle 4).
- [x] Q5 Agents/commands/persona: how the repo's 13 agents and nested commands can be reached
      (profiles, delegate_task, skills, inlined persona, slash commands); value of
      `hermes import-agent --dry-run` (Angle 5).
- [x] Q6 Hooks/plugins: events, payloads, consent allowlist, `--accept-hooks`, whether the
      repo's guard cores can be bridged as hooks vs plugins vs Agent Plugins v1 (Angle 6).
- [x] Q7 MCP: config location, stdio/remote/OAuth, repo native servers and code-mode manual
      over stdio, deny-by-default enforcement, `hermes mcp serve` inverse (Angle 7).
- [x] Q8 Fan-out fitness: headless write flags, `--yolo`/approval semantics, per-iteration
      timeout, stdin closed, per-lineage state isolation, env var pass-through, self-invocation
      detection, nested-hermes blocking, trustworthy exit codes, write-containment outside the
      repo, web search forcing (Angle 8).
- [x] Q9 Constraints vs the six runtimes: Python/venv, git install + update, startup latency,
      background subsystems, SOUL.md persona, memory injection, terminal sandbox, non-TTY
      approvals, pause state, telemetry, cost; comparison table (Angle 9).
- [x] Q10 Recommendation: phase plan for phases 002+, merge/split/drop of candidate phases,
      UNKNOWNs until a live contract pin, operator decisions, ranked recommendations (Angle 10).

## 4. NON-GOALS

- Never change anything under `~/.hermes/` (no `hermes config set`, `hermes skills install`,
  `hermes plugins install`, `hermes mcp add`, `hermes skills trust`, `hermes import-agent`,
  `hermes setup`, `hermes update`).
- No mutating hermes commands of any kind; only the read-only list in research-angles.md,
  run with stdin closed.
- No writes outside the lineage directory
  `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek`.
- Out of bounds: Hermes messaging gateways, cron, kanban, voice, desktop, TUI skins, pets,
  journeys.
- Building nothing: this phase produces findings and a plan, not code.

## 5. STOP CONDITIONS

- 10 iterations completed (hard cap, stop policy max-iterations).
- All ten angles worked with cited evidence; the comparison against the six runtimes is the
  deliverable.
- At most two live smoke dispatches per lineage, only on a configured provider, exact command
  shape `hermes chat -Q --oneshot --max-turns 1 --run-budget 60 -q "Reply with the single word OK" </dev/null`.

## 6. ANSWERED QUESTIONS

- Q1 (Angle 1): headless dispatch contract pinned. Three shapes: `-z` (answer-only stdout, no
  session id), `chat -q` on non-TTY (oneshot implied), `chat -Q` (quiet; response to stdout,
  `session_id:` and `Error:` to stderr). Exit codes `-z` 0/1/2, `chat -Q` 0/1/130. `--query-file`
  injection-safe. No JSON output format on `chat -Q`. Distinct vs six runtimes:
  session-id-on-stderr, exit 2 usage errors, native `--worktree` (iteration 1).
- Q2 (Angle 2): providers/models/reasoning. Machine has ZERO Hermes-side provider credentials
  (live `hermes status`, all keys not set; `.env` is debug settings only). The one directly
  portable credential kind is `LLMGATEWAY_API_KEY` (DevPass, OpenAI-compatible) via Hermes's
  `custom` provider (`providers:` + `key_env`). Codex OAuth is Hermes-isolated
  (`~/.hermes/auth.json`), pi/opencode stores not portable. Reasoning caps are tri-state from
  OpenRouter/Nous catalogs; effort-name mapping for the custom route needs a live pin.
  Fail-closed `HERMES_SUPPORTED_MODELS` starts at `deepseek-v4.1-flash` + `glm-5.3-flash`
  (llmgateway two-segment, effort pin max) (iteration 2).
- Q3 (Angle 3): repo-local surface. CWD instruction files exactly AGENTS.md/CLAUDE.md/
  .cursorrules (SOUL.md user-level). Project skills only in `.hermes/skills` +
  `.agents/skills`, gated on user-level `skills.trusted_project_dirs` (`hermes skills trust`).
  Symlinked tree is followed and flattened (no hub concept); quarantine fail-closed per skill
  dir; symlink escape inside a skill flagged critical. No read-only command reports the
  project load result; verdict UNKNOWN until the trust mutation (iteration 3).

## 7. WHAT WORKED

- Live `--help` output combined with implementation files (oneshot.py, cli.py quiet path):
  closed the gap between documented flags and actual behavior (iteration 1)
- Six-reference comparison table: cheap to build, immediately surfaced the
  session-id-on-stderr and exit-2 distinctions (iteration 1)
- Key-name-only `.env` inventory + live `hermes status`: definitive credential picture (iteration 2)
- Mapping the repo's six-runtime model routing onto `CANONICAL_PROVIDERS`: turned "which
  models" into a concrete portability question (iteration 2)
- Reading loader + scanner + trust command together closed the trust/quarantine/load loop
  without any mutation (iteration 3)
- Full-tree scan: converted "which skills would load" into hard numbers (0 rejected / 174
  load-with-warnings) (iteration 4)
- Reading import-agent's real mapping before judging: dry-run looks harmless but is a
  repo-state copy that bypasses trust/quarantine (iteration 5)
- Mapping each guard core to a specific Hermes hook event (pre_verify = completion-evidence)
  made the bridge concrete (iteration 6)
- `mcp add --help` check before judging fit: `--env` closes the loop for the
  UTCP_CONFIG_FILE-env server (iteration 7)
- Mapping the fan-out contract (flag support, sandbox class, web matrix, env prefixes,
  self-presence) onto Hermes surfaces produced a concrete builder spec (iteration 8)
- Measuring latency and checking pause scope before trusting assumptions (iteration 9)

## 8. WHAT FAILED

- `-z` as fan-out dispatch shape: no session id on stdout, no `--max-turns`/`--run-budget` on
  the top-level flag set — ruled out, use `chat -Q` (iteration 1)
- Exit-code-only success detection: `chat -Q` exits 0 on partial-with-response; stderr must be
  parsed for `Error:`/`session_id:` (iteration 1)
- Credential porting between runtime auth stores: each runtime keeps its own OAuth session;
  Hermes Codex tokens in `~/.hermes/auth.json`, pi/opencode stores not readable (iteration 2)
- `hermes skills check` as load-result reporter: hub-installed skills only; project verdict
  needs the trust mutation (iteration 3)

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

## 10. RULED OUT DIRECTIONS

- `hermes -z` for fan-out dispatch: no session id on stdout, no turn/budget flags (iteration 1,
  evidence: hermes_cli/_parser.py:113-118)
- Exit-code-only success detection: partial-with-response exits 0 (iteration 1, evidence:
  cli.py:4108-4117)
- Porting OAuth credentials from pi/opencode/codex stores into Hermes: not portable; each
  runtime auth store is isolated (iteration 2, evidence: auth_codex.py:3-4)
- Dispatching before credential configuration: all keys not set; auth would fail (iteration 2,
  evidence: live hermes status 2026-09-14)
- `hermes skills check` as project-skill load reporter: hub-installed only (iteration 3,
  evidence: live output 2026-09-14)
- Per-file symlinks into `.opencode/skills`: symlink_escape critical flag (iteration 3,
  evidence: skills_guard.py:538-543)
- Repo-carried trust grant: trust lives in user-level config.yaml (iteration 3, evidence:
  main_agent_cmds.py:179-233)

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11A. CARRIED-FORWARD OPEN QUESTIONS

[None yet]

## 11. NEXT FOCUS

None — all ten angles answered. Proceed to synthesis.

## 12. KNOWN CONTEXT

Resource map present at `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/resource-map.md`
(58 references: READMEs=0, Documents=14, Commands=2, Agents=2, Skills=12, Specs=7, Scripts=4,
Tests=1, Config=11, Meta=5). Section themes:

- Documents: Hermes source docs (parser, context loaders, prompt builder, skill utils, skills
  standard, AGENTS.md, config example, docs/), repo governance (dispatch preamble, AGENTS.md,
  REPO RULES.md, roster docs).
- Commands: Hermes CLI surface (~/.local/bin/hermes, top-level commands, skills/hooks/plugins/
  mcp/tools/profile/import-agent subcommands) and the repo's nested `.opencode/commands/`.
- Agents: the repo's 13 real `.claude/agents/*.md`; Hermes's own `delegate_task` sub-agent
  system.
- Skills: the cli-external-orchestration hub and its six mode packets; Hermes skill loader
  (project dirs, quarantine, guard/linter/audit).
- Specs: parent packet 071, its goal, research-angles, the 031 cli-pi precedent, the 045
  two-lineage forced-depth synthesis shape, 046 headless dispatch trap, z_archive precedents.
- Scripts: fanout-run.cjs builder patterns, executor-config.ts kind tables, executor-audit.ts,
  dispatch-audit.mjs binary regex table.
- Tests: combo-matrix.vitest.ts per-kind model/binary tables a seventh kind extends.
- Config: dotfolder layouts (`.claude`, `.codex`, `.cursor`, `.pi`, `.devin`, planned repo-root
  `.hermes/`), `~/.hermes/` layout, `.utcp_config.json` code-mode manuals.
- Meta: planned live fetches (Hermes repo/docs, changelog, issues, agentskills.io), provider
  and reasoning source files for angle 2.

### Bounded Context Snapshot

- Source pointers: `~/.hermes/hermes-agent/` (installed source, v0.21.1) — parser, coding
  context, prompt builder, skill utils, skills guard, delegate tool, hooks, plugins, MCP tools,
  toolsets; repo runtime files (fanout-run.cjs, executor-config.ts, executor-audit.ts,
  dispatch-audit.mjs, combo-matrix.vitest.ts).
- Reuse candidates: `cli-pi` packet as the closest precedent (closed model roster,
  availability-required hard rules, self-dispatch carve-out); `sk-doc/sk-create-skill` packet
  template for the future `cli-hermes` packet.
- Integration points: hub-router.json / mode-registry.json / leaf-manifest.json registration,
  mode table + layout block in the hub SKILL.md, dispatch-audit binary regex table,
  executor-config.ts kind tables, combo-matrix tests.
- Constraints and risks: read-only `~/.hermes` (no trust mutations), quarantine of symlinked
  skill trees, memory injection leaking prior sessions, approval prompts on a non-TTY,
  background subsystems (curator, gateway, cron) that must stay off.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (from config; stop policy max-iterations)
- Convergence threshold: 0.05 (telemetry only under max-iterations policy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this lineage); `resume`/`restart` live
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-09-14T18:40:00Z
