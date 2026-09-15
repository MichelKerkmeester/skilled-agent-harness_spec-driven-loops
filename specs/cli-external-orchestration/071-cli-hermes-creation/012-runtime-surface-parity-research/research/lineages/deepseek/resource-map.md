# Resource Map (lineage `deepseek`)

Evidence-derived inventory of every artifact this research read or observed, grouped by role, with the
iteration that established it. Paths are relative to the repository root.

## Authored source (canonical)

| Path | What it is | Iteration |
|---|---|---|
| `.opencode/commands/**/*.md` | 35 authored commands (families: create 12, speckit 6, deep 5, doctor 3, design 3, rewrite 2, prompt 1, root 3) | 1, 9 |
| `.opencode/agents/*.md` | 12 authored agents + `README.txt` | 5 |
| `.opencode/skills/**/SKILL.md` | 56 canonical skill entry points across 13 top-level packets | 3 |
| `.opencode/hooks/**` | 20 hook concern packages, each with per-runtime adapters | 7 |
| `.opencode/hooks/goal/` | Goal core (`lib/goal-core.cjs`, `lib/goal-slice.cjs`), manage CLI (`bin/goal.cjs`), adapters (`cursor/`, `devin/`, `pi/`), docs (`README.md`, `goal-plugin.md`) | 4 |
| `.opencode/hooks/hook-flags.env` | Master + 22 per-concern kill switches, read by `hook-flags.{cjs,mjs,ts,sh}` | 7 |

## Generators

| Path | Produces | Iteration |
|---|---|---|
| `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Claude/Cursor command symlinks, Cursor/Devin agent symlinks, four hook symlink trees | 1, 6 |
| `.../runtime-mirrors/sync-hook-registrations.cjs` | `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` from `hook-registry.json` | 6, 7 |
| `.../runtime-mirrors/sync-gate1-pointers.cjs` | Gate 1 pointer blocks in `.codex/AGENTS.md` and `.cursor/rules/skill-routing.md` | 6, 9 |
| `.../runtime-mirrors/command-scope.cjs` | Not a generator — the exclusion/native policy consulted by generators | 1, 9 |
| `.../runtime-mirrors/hook-registry.json` | 29 hooks, 4 runtime targets, per-hook bindings | 6, 7 |
| `.../cli/codex/sync-prompts.cjs`, `.../cli/codex/sync-agents.cjs`, `.../cli/codex/generate-command-routers.cjs` | Codex prompts (33), agents (12 `.toml`), command routers | 1, 6 |
| `.../cli/pi/sync-prompts-pi.cjs`, `.../cli/pi/sync-agents-pi.cjs` | Pi prompts (35), agents (12 `.md`) | 1, 6 |
| `.../cli/hermes/sync-prompts-hermes.cjs`, `.../cli/hermes/sync-skills-hermes.cjs` | Hermes prompts (33), skills (68 = 56 skills + 12 persona skills) | 3, 6 |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs` + `lib/mirror-sync-verify.cjs` | Content gate for OpenCode↔Claude agent pairs (token-set equality after path normalization) | 5 |

## Diagnostics

| Path | Role | Iteration |
|---|---|---|
| `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | Roster coverage across five runtimes; symlink targets must resolve | 5, 9 |
| `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` | Command catalog + hub metadata coverage; states the canonical count (35) | 9 |
| `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` | The manual read-only route: five mirror checkers + hook-adapter fallback health | 9 |

## Gates

| Path | Covers | Iteration |
|---|---|---|
| `.opencode/scripts/git-hooks/pre-commit` | Agent-mirror block + 6 mirror checkers | 1, 5, 6, 9 |
| `.github/workflows/spec-kit-check.yml` | The same 6 + `sync-gate1-pointers.cjs --check` | 1, 6, 9 |
| `.github/workflows/agent-mirror-sync.yml` | Agent mirror drift over the PR range | 5 |
| `.github/workflows/command-tree-parity.yml` | `validate-command-tree-parity.sh` | 1, 9 |
| 17 further workflows | Quality gates (comment hygiene, link integrity, naming, frontmatter, routing registry), not runtime parity | 9 |

## Runtime surfaces

| Path | Shape | Iteration |
|---|---|---|
| `.claude/commands` (33 symlinks), `.claude/agents` (12 + README), `.claude/skills` → `.opencode/skills`, `.claude/settings.json`, `.claude/mcp.json` | symlink mirror + real config | 1, 3, 5, 6 |
| `.codex/prompts` (33), `.codex/agents` (12 `.toml`), `.codex/hooks` (16 symlinks), `.codex/config.toml`, `.codex/AGENTS.md`, `.codex/hooks.json` | generated + real config | 1, 3, 5, 6 |
| `.cursor/commands` (33 symlinks + 2 native), `.cursor/agents` (12 symlinks), `.cursor/rules/` (`skill-routing.md` + `sk-vision.md`), `.cursor/hooks.json`, `.cursor/mcp.json` | symlink + hand-authored | 1, 3, 5, 6 |
| `.pi/prompts` (35), `.pi/agents` (12), `.pi/extensions/` (16 `.ts` bridges), `.pi/skills` → `.opencode/skills`, `.pi/mcp.json`, `.pi/models.json`, `.pi/settings.json` | generated + hand-authored native code | 1, 3, 5, 6, 7 |
| `.hermes/skills` (68 generated), `.hermes/prompts` (33), `.hermes/agents` → `.opencode/agents`, `.hermes/plugins/repo-guards/__init__.py` | generated copies + plugin bridge | 3, 4, 7 |
| `.devin/agents` (12 nested symlinks), `.devin/hooks` (21 symlinks), `.devin/hooks.v1.json`, `.devin/mcp_config.json`, `.devin/config.local.json`, `.devin/manual-testing-playbook` | nested symlinks + Devin-owned files | 2, 4, 8 |

## Manifests and docs read

`SYNC.md` × 6 (741 lines total) · `.opencode/hooks/goal/README.md`, `.opencode/hooks/goal/goal-plugin.md` ·
`.opencode/commands/README.txt` + per-family indexes · `.pi/extensions/README.md` ·
`.opencode/skills/cli-external-orchestration/cli-devin/{SKILL.md,references/cli-reference.md,manual-testing-playbook}` ·
`AGENTS.md:185`, `CLAUDE.md:185` (goal posture row).

## External observations

- Installed `devin` v3000.10.27 (`bcbe88c7`): `--help`, `skills --help`, `version`.
- Read-only git: `git show --stat a2241041b0` (the Devin command + goal decommission), `git log` over
  `.devin/commands`, `.devin/prompts`, `.devin/SYNC.md`, `.pi/prompts/goal-pi.md`.
- Two observed checker exits: `check-agent-mirror-sync.cjs --all` → 0 (12 checked, in sync);
  `command-catalog-mirror-check.cjs` → 0 (35/35 listed).

## Not read / left open

Claude and Codex host goal behaviour (needs a live host) · Codex's own loader contract · the exact
roster deleted in `a2241041b0` · Hermes's prose scanner rules · `.opencode/skills/**` bodies beyond their
existence and counts · Pi's extension sources beyond `session-start-advisories.ts`.
