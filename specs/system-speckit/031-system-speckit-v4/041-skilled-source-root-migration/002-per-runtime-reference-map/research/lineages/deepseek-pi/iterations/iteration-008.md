# Iteration 8: Map C — `.opencode` runtime areas, root documents/configuration, CI

## Focus

Map C, the final areas: `.opencode/commands` (148 files), `agents` (13), `hooks` (54), `plugins` (30), `bin` (29), `scripts` (25), `install-guides` (2), `logs` (1), `package-lock.json` (1); the root documents and configuration (8 files: `.env.example`, `.gitignore`, `.utcp_config.json`, `AGENTS.md`, `CONTRIBUTING.md`, `PUBLIC-RELEASE.md`, `README.md`, `opencode.json`); and CI (21 files under `.github/`).

## Findings

- **Finding 1 — `.opencode/commands` is 148 files and three kinds of thing: 45 command definitions (markdown), 103 non-markdown assets and workflows (63 YAML, 24 TXT, plus scripts), and 1 JSON.** The YAML assets are the deep-research/doctor workflow definitions that the command markdown loads; the TXT files are prompt assets. **Classification:** `mechanical` 101, `manual` 2 (the two command assets whose rewrites need a content decision). **Consequence:** the commands are the most citation-dense surface per file (2,192 lines over 148 files) and the `sync-runtime-mirrors.cjs`/prompt-stub generators read them, so retargeting the commands tree is a prerequisite for regenerating four runtime trees.

- **Finding 2 — `.opencode/agents` is the canonical agent source for Codex, Pi and the `.claude` fork.** 12 markdown files plus a README. `.claude/agents` is a real fork of these; Codex and Pi agents are generated from them; Hermes and OpenCode consume them directly. **Classification:** `mechanical` for the paths inside, `manual` for the fork-maintenance decision (the pre-commit gate pairs them). **Consequence:** an edit to one agent has a five-surface blast radius, and the only generator that consumes the tree directly is `sync-runtime-mirrors.cjs`'s `listAgentNames()`.

- **Finding 3 — `.opencode/hooks` holds 54 non-symlink files: the portable guard cores, the git-hooks installer, shared kill-switch libraries, and their READMEs.** The 101 internal index links (Map A) point at these. **Classification:** `mechanical` for the cores' path constants, `manual` for the git-hooks installer sequencing (the file that installs into `~/.config/git/hooks`). **Consequence:** the installer is the repository end of the home-level blocker; it must be run from the new location.

- **Finding 4 — `.opencode/plugins` is OpenCode's fixed flat-glob folder, and 27 tracked files there name the path.** The plugin loader scans `.opencode/plugins/*.js` by a flat glob; the browsability links under `.opencode/hooks/*/opencode/` point back here. **Classification:** `mechanical` for the plugin sources, `manual`/`blocker` for the folder identity (the loader glob argument is a phase-001 UNKNOWN until probed). **Consequence:** the 27 plugin rows are the code that would break if `.opencode/plugins` became a symlink to `.skilled/plugins` and the loader does not follow it.

- **Finding 5 — `.opencode/bin` is 29 files and contains the move's chokepoint: `mcp-code-mode-launcher.cjs`.** Its first matching line is the literal `'.opencode',` segment used to build the server path; five runtime MCP configs plus `~/.hermes/config.yaml` name it. `.opencode/bin` also holds the git-hook checkers, `install-codex-hooks.mjs`, the worktree wrappers and the compiled-routing harness. **Classification:** `mechanical` 26, `manual` 1 (the launcher compatibility decision), and `blocker` in composition with the external references. **Consequence:** the launcher is the single path every runtime's MCP registration shares; moving it without a `.opencode/bin` compatibility path breaks all of them at once. [SOURCE: .opencode/bin/mcp-code-mode-launcher.cjs:22]

- **Finding 6 — `.opencode/scripts` is 20 files, and the seven globally installed git hooks are symlinks to seven of them.** `pre-commit` (self-disengaging mirror checks and the comment-hygiene gate), `pre-push` (`.opencode/skills` diff filter), `prepare-commit-msg`, `commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, plus `session-cleanup.sh` and installers. **Classification:** `mechanical` for the path constants, `manual` for the gate-scope design (staged-path filters that match `^\.(opencode|claude)/` never match `.skilled/` changes). **Consequence:** the phase-001 silent-failure class lives here; retargeting the scripts keeps them running, but their filters stay blind to `.skilled` until someone changes the filter language.

- **Finding 7 — the root surface is 8 files, and only one is a pure path rewrite.** `README.md` (52 lines, live user doc), `AGENTS.md` (9, behavioral framework), `CONTRIBUTING.md` (3), `.env.example` (2), `.utcp_config.json` (1, a script reference), `opencode.json` (1, the MCP launcher registration), `.gitignore` (62 ignore patterns), and `PUBLIC-RELEASE.md` (33, the published consumer contract). **Classification:** `mechanical` for six, `manual` for `opencode.json` (project-namespace decision) and `PUBLIC-RELEASE.md` (`blocker`/manual: the file documents consumer repositories symlinking `.opencode -> Public/.opencode`, so the rename changes a published promise). **Consequence:** the root docs cannot be treated as prose-only; three of the eight are load-bearing instructions or contracts.

- **Finding 8 — CI is 21 files (19 workflows, `dependabot.yml`, `README.md`), and its `.opencode` surface is 150 matching lines.** The densest are `routing-registry-drift.yml` (54), `spec-kit-check.yml` (33), `playbook-operator-contract.yml` (8), `changed-packet-validation.yml` (7), `runtime-no-spec-import.yml` (7), `strict-pass-freshness-report.yml` (6), `diagram-corpus.yml` (5). Phase 001 verified that 12 of 19 workflows skip green when their guard script is missing. **Classification:** `mechanical` for the path rewrite, `manual` for the skip-guard redesign. **Consequence:** a green CI run on the migration commit is not evidence; the workflows must be retargeted and their guards re-armed before they can certify anything.

- **Finding 9 — the `logs` and `package-lock.json` areas are one file each and need no semantic work.** `.opencode/logs/README.md` documents the log home; `.opencode/package-lock.json` is package-manager output. **Classification:** `mechanical` for the doc, `regenerate` for the lockfile. **Consequence:** included for completeness; no separate action.

- **Finding 10 — the counts reconcile exactly with the seed, and this closes Map C.** 148 + 13 + 54 + 30 + 29 + 25 + 2 + 1 + 1 + 8 + 21 = 332 files. Cumulative map coverage: skills 3,695 + Map B runtime files 231 + these 332 = 4,258 tracked files, matching the seed exactly.

## Row tables

### Map C code rows: opencode:commands (103 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/commands/README.txt` | `.opencode/commands/README.txt:246` | 1 | `/deep:agent-improvement .opencode/agents/review.md :confirm` | source code (authored) | mechanical |
| `.opencode/commands/create/README.txt` | `.opencode/commands/create/README.txt:136` | 3 | `/create:readme readme .opencode/skills/my-skill --type skill :confirm` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-agent-auto.yaml` | `.opencode/commands/create/assets/create-agent-auto.yaml:45` | 14 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-agent-confirm.yaml` | `.opencode/commands/create/assets/create-agent-confirm.yaml:46` | 16 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-agent-presentation.txt` | `.opencode/commands/create/assets/create-agent-presentation.txt:60` | 1 | `agent_path: .opencode/agents/` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-benchmark-auto.yaml` | `.opencode/commands/create/assets/create-benchmark-auto.yaml:139` | 15 | `skill_path: .opencode/skills/` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-benchmark-confirm.yaml` | `.opencode/commands/create/assets/create-benchmark-confirm.yaml:114` | 15 | `- "Only for a still-missing named gap, run the packet-scoped context recipe from .opencode/skills/system-sp...` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-benchmark-presentation.txt` | `.opencode/commands/create/assets/create-benchmark-presentation.txt:45` | 6 | `source_packet_path: .opencode/specs/example-benchmark-packet` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-changelog-auto.yaml` | `.opencode/commands/create/assets/create-changelog-auto.yaml:44` | 23 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-changelog-confirm.yaml` | `.opencode/commands/create/assets/create-changelog-confirm.yaml:44` | 22 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-command-auto.yaml` | `.opencode/commands/create/assets/create-command-auto.yaml:46` | 20 | `root_command: .opencode/commands/[command].md` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-command-confirm.yaml` | `.opencode/commands/create/assets/create-command-confirm.yaml:47` | 16 | `root_command: .opencode/commands/[command].md` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-command-presentation.txt` | `.opencode/commands/create/assets/create-command-presentation.txt:13` | 7 | `- .opencode/skills/sk-doc/sk-create-command/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-diff-auto.yaml` | `.opencode/commands/create/assets/create-diff-auto.yaml:157` | 28 | `engine_command: "python3 .opencode/skills/sk-doc/sk-create-diff/scripts/create_diff.py"` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-diff-confirm.yaml` | `.opencode/commands/create/assets/create-diff-confirm.yaml:157` | 28 | `engine_command: "python3 .opencode/skills/sk-doc/sk-create-diff/scripts/create_diff.py"` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-diff-presentation.txt` | `.opencode/commands/create/assets/create-diff-presentation.txt:13` | 7 | `- `.opencode/skills/sk-doc/sk-create-diff/SKILL.md` is readable` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-feature-catalog-auto.yaml` | `.opencode/commands/create/assets/create-feature-catalog-auto.yaml:45` | 18 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-feature-catalog-confirm.yaml` | `.opencode/commands/create/assets/create-feature-catalog-confirm.yaml:45` | 18 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-feature-catalog-presentation.txt` | `.opencode/commands/create/assets/create-feature-catalog-presentation.txt:46` | 3 | `skill_path: .opencode/skills/` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-manual-testing-playbook-auto.yaml` | `.opencode/commands/create/assets/create-manual-testing-playbook-auto.yaml:45` | 18 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-manual-testing-playbook-confirm.yaml` | `.opencode/commands/create/assets/create-manual-testing-playbook-confirm.yaml:45` | 18 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-manual-testing-playbook-presentation.txt` | `.opencode/commands/create/assets/create-manual-testing-playbook-presentation.txt:46` | 3 | `skill_path: .opencode/skills/` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-readme-auto.yaml` | `.opencode/commands/create/assets/create-readme-auto.yaml:37` | 21 | `# The setup phase in .opencode/commands/create/readme.md determines which operation` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-readme-confirm.yaml` | `.opencode/commands/create/assets/create-readme-confirm.yaml:9` | 23 | `# Routing: The setup phase in .opencode/commands/create/readme.md determines which` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-readme-presentation.txt` | `.opencode/commands/create/assets/create-readme-presentation.txt:52` | 2 | `target_path: .opencode/skills/system-spec-kit` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-repo-rule-auto.yaml` | `.opencode/commands/create/assets/create-repo-rule-auto.yaml:23` | 7 | `skill_md: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-repo-rule-confirm.yaml` | `.opencode/commands/create/assets/create-repo-rule-confirm.yaml:36` | 7 | `skill_md: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-skill-auto.yaml` | `.opencode/commands/create/assets/create-skill-auto.yaml:48` | 29 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-skill-confirm.yaml` | `.opencode/commands/create/assets/create-skill-confirm.yaml:48` | 30 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-skill-parent-auto.yaml` | `.opencode/commands/create/assets/create-skill-parent-auto.yaml:45` | 29 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-skill-parent-confirm.yaml` | `.opencode/commands/create/assets/create-skill-parent-confirm.yaml:45` | 28 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-skill-parent-presentation.txt` | `.opencode/commands/create/assets/create-skill-parent-presentation.txt:46` | 6 | `skill_path: .opencode/skills/` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-skill-presentation.txt` | `.opencode/commands/create/assets/create-skill-presentation.txt:44` | 5 | `skill_path: .opencode/skills/` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-with-human-voice-auto.yaml` | `.opencode/commands/create/assets/create-with-human-voice-auto.yaml:23` | 8 | `skill_md: .opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/create-with-human-voice-confirm.yaml` | `.opencode/commands/create/assets/create-with-human-voice-confirm.yaml:36` | 8 | `skill_md: .opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json` | `.opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json:62` | 4 | `".opencode/changelog/{primary_component}/v{next_version}.md"` | test fixture (hand-authored data) | manual |
| `.opencode/commands/create/assets/tests/test_emitted_name_contract.py` | `.opencode/commands/create/assets/tests/test_emitted_name_contract.py:8` | 1 | `Usage: python3 -m unittest discover .opencode/commands/create/assets/tests` | test code | mechanical |
| `.opencode/commands/create/assets/tests/test_skill_parent_router_parity.py` | `.opencode/commands/create/assets/tests/test_skill_parent_router_parity.py:15` | 5 | `Usage: python3 .opencode/commands/create/assets/tests/test_skill_parent_router_parity.py` | test code | mechanical |
| `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml` | `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml:37` | 40 | `target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .opencode/agent...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml` | `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml:38` | 41 | `target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .opencode/agent...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt` | `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt:17` | 25 | `Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` | `.opencode/commands/deep/assets/deep-ai-council-auto.yaml:40` | 22 | `free_text_recipe: "rg --no-config --json --fixed-strings --ignore-case -C 2 --glob '*.md' --glob '!**/z_arc...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml` | `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml:40` | 21 | `free_text_recipe: "rg --no-config --json --fixed-strings --ignore-case -C 2 --glob '*.md' --glob '!**/z_arc...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-ai-council-presentation.txt` | `.opencode/commands/deep/assets/deep-ai-council-presentation.txt:15` | 15 | `Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml` | `.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml:38` | 29 | `profile: "[PROFILE] - Path or ID of the benchmark profile. Default: .opencode/skills/system-deep-loop/deep-...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-model-benchmark-confirm.yaml` | `.opencode/commands/deep/assets/deep-model-benchmark-confirm.yaml:38` | 32 | `profile: "[PROFILE] - Path or ID of the benchmark profile. Default: .opencode/skills/system-deep-loop/deep-...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt` | `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:15` | 30 | `Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | `.opencode/commands/deep/assets/deep-research-auto.yaml:11` | 88 | `# - See `.opencode/skills/system-spec-kit/shared/predicates/boolean-expr.ts`` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | `.opencode/commands/deep/assets/deep-research-confirm.yaml:79` | 57 | `free_text_recipe: "rg --no-config --json --fixed-strings --ignore-case -C 2 --glob '*.md' --glob '!**/z_arc...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-research-presentation.txt` | `.opencode/commands/deep/assets/deep-research-presentation.txt:15` | 17 | `Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | `.opencode/commands/deep/assets/deep-review-auto.yaml:54` | 83 | `free_text_recipe: "rg --no-config --json --fixed-strings --ignore-case -C 2 --glob '*.md' --glob '!**/z_arc...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-review-confirm.yaml` | `.opencode/commands/deep/assets/deep-review-confirm.yaml:53` | 60 | `free_text_recipe: "rg --no-config --json --fixed-strings --ignore-case -C 2 --glob '*.md' --glob '!**/z_arc...` | source code (authored) | mechanical |
| `.opencode/commands/deep/assets/deep-review-presentation.txt` | `.opencode/commands/deep/assets/deep-review-presentation.txt:15` | 19 | `Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/chart-auto.yaml` | `.opencode/commands/design/assets/chart-auto.yaml:24` | 9 | `skill_md: .opencode/skills/sk-design/sk-design-chart/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/chart-confirm.yaml` | `.opencode/commands/design/assets/chart-confirm.yaml:37` | 9 | `skill_md: .opencode/skills/sk-design/sk-design-chart/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/chart-presentation.txt` | `.opencode/commands/design/assets/chart-presentation.txt:12` | 10 | `- `.opencode/skills/sk-design/sk-design-chart/SKILL.md` is readable` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/diagram-auto.yaml` | `.opencode/commands/design/assets/diagram-auto.yaml:182` | 22 | `skill_contract: .opencode/skills/sk-design/sk-design-diagram/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/diagram-confirm.yaml` | `.opencode/commands/design/assets/diagram-confirm.yaml:150` | 22 | `skill_contract: .opencode/skills/sk-design/sk-design-diagram/SKILL.md` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/diagram-presentation.txt` | `.opencode/commands/design/assets/diagram-presentation.txt:13` | 8 | `- `.opencode/skills/sk-design/sk-design-diagram/SKILL.md` is readable` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/extract-auto.yaml` | `.opencode/commands/design/assets/extract-auto.yaml:149` | 9 | `creation_contract: ".opencode/skills/sk-design/sk-design-md-generator/references/creation-contract.md"` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/extract-confirm.yaml` | `.opencode/commands/design/assets/extract-confirm.yaml:29` | 11 | `source: ".opencode/commands/design/assets/extract-presentation.txt"` | source code (authored) | mechanical |
| `.opencode/commands/design/assets/extract-presentation.txt` | `.opencode/commands/design/assets/extract-presentation.txt:38` | 1 | `\| accepted evidence informs implementation \| `sk-code` via `.opencode/skills/sk-design/sk-design-md-gener...` | source code (authored) | mechanical |
| `.opencode/commands/doctor/_routes.yaml` | `.opencode/commands/doctor/_routes.yaml:5` | 36 | `# Read by: .opencode/commands/doctor/speckit.md (the router)` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-deep-loop.yaml` | `.opencode/commands/doctor/assets/doctor-deep-loop.yaml:83` | 11 | `- ".opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite"  # coverage graph DB` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-embeddings.yaml` | `.opencode/commands/doctor/assets/doctor-embeddings.yaml:21` | 3 | `Embeddings doctor is strictly read-only. It calls node .opencode/bin/skill-advisor.cjs advisor_status` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-fable-mode.yaml` | `.opencode/commands/doctor/assets/doctor-fable-mode.yaml:7` | 4 | `skill_owner: ".opencode/skills/system-spec-kit/runtime/cli/metrics/"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml` | `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml:42` | 13 | `code_mode: ".opencode/install-guides/MCP - Code Mode.md"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` | `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:43` | 12 | `code_mode: ".opencode/install-guides/MCP - Code Mode.md"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt` | `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt:50` | 2 | `Workflow: .opencode/commands/doctor/assets/[doctor-mcp-install.yaml\|doctor-mcp-debug.yaml]` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-parent-skill.yaml` | `.opencode/commands/doctor/assets/doctor-parent-skill.yaml:59` | 4 | `audit_script: ".opencode/commands/doctor/scripts/parent-skill-check.cjs"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-router-reach.yaml` | `.opencode/commands/doctor/assets/doctor-router-reach.yaml:52` | 5 | `diagnostic_script: ".opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` | `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:5` | 79 | `purpose: Detect drift across the agent, command, prompt and hook mirrors that .claude, .codex, .cursor and ...` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml` | `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml:35` | 14 | `cli_health_command: "node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root \"$PWD\" --format...` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-budget.yaml` | `.opencode/commands/doctor/assets/doctor-skill-budget.yaml:36` | 4 | `audit_script: ".opencode/commands/doctor/scripts/audit_descriptions.py"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-graph-freshness.yaml` | `.opencode/commands/doctor/assets/doctor-skill-graph-freshness.yaml:43` | 4 | `diagnostic_script: ".opencode/commands/doctor/scripts/skill-graph-freshness.cjs"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-speckit-presentation.txt` | `.opencode/commands/doctor/assets/doctor-speckit-presentation.txt:104` | 4 | `\| `runtime-mirrors` \| `doctor-runtime-mirrors.yaml` \| read-only \| Detect drift in the agent, command, p...` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:23` | 19 | `generated trigger index at .opencode/skills/system-spec-kit/runtime/data/trigger-index.json as` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-update-presentation.txt` | `.opencode/commands/doctor/assets/doctor-update-presentation.txt:104` | 5 | `Workflow: .opencode/commands/doctor/assets/doctor-update.yaml` | source code (authored) | mechanical |
| `.opencode/commands/doctor/assets/doctor-update.yaml` | `.opencode/commands/doctor/assets/doctor-update.yaml:21` | 52 | `state_dir: ".opencode/skills/system-skill-advisor/runtime/database"` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:37` | 1 | `{ id: 'opencode', rel: (n) => `.opencode/agents/${n}.md`, ext: '.md' },` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | `.opencode/commands/doctor/scripts/audit_descriptions.py:11` | 8 | `- .opencode/skills/<name>/SKILL.md            (YAML frontmatter)` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh` | `.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh:14` | 4 | `#   .opencode/commands/doctor/assets/doctor-mcp-install.yaml` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs:8` | 6 | `// index at .opencode/commands/README.txt, the per-family indexes beside it, and` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:24` | 8 | `Usage: bash .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh [--root <workspace>] [--json]` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh` | `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh:158` | 1 | `if [[ -f "$dir/opencode.json" ]] \|\| [[ -d "$dir/.opencode" ]]; then` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | `.opencode/commands/doctor/scripts/mcp-doctor.sh:9` | 5 | `#   bash .opencode/commands/mcp_doctor/scripts/mcp-doctor.sh [OPTIONS]` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | `.opencode/commands/doctor/scripts/parent-skill-check.cjs:43` | 6 | `// repo root (the directory containing .opencode), not process.cwd() — otherwise rule 4a and` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/route-validate.py` | `.opencode/commands/doctor/scripts/route-validate.py:8` | 6 | `Validates `.opencode/commands/doctor/_routes.yaml` against:` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/route-validate.sh` | `.opencode/commands/doctor/scripts/route-validate.sh:5` | 4 | `# CI assertion script for .opencode/commands/doctor/_routes.yaml.` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs` | `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs:28` | 3 | `const SKILL_GRAPH_JSON = '.opencode/skills/system-skill-advisor/runtime/scripts/skill-graph.json';` | source code (authored) | mechanical |
| `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:31` | 4 | `const COMMANDS_DIR = path.join(REPO_ROOT, '.opencode', 'commands', 'doctor');` | test code | mechanical |
| `.opencode/commands/prompt/assets/prompt_improve_auto.yaml` | `.opencode/commands/prompt/assets/prompt_improve_auto.yaml:7` | 8 | `skill_owner: ".opencode/skills/sk-prompt/"` | source code (authored) | mechanical |
| `.opencode/commands/prompt/assets/prompt_improve_confirm.yaml` | `.opencode/commands/prompt/assets/prompt_improve_confirm.yaml:7` | 8 | `skill_owner: ".opencode/skills/sk-prompt/"` | source code (authored) | mechanical |
| `.opencode/commands/prompt/assets/prompt_improve_presentation.txt` | `.opencode/commands/prompt/assets/prompt_improve_presentation.txt:59` | 2 | `C) Save to specific path (inside the .opencode/specs/ tree)` | source code (authored) | mechanical |
| `.opencode/commands/scripts/fixtures/broken-command-refs.yaml` | `.opencode/commands/scripts/fixtures/broken-command-refs.yaml:17` | 3 | `template: ".opencode/skills/system-spec-kit/templates/level-1/spec.md"` | test fixture (hand-authored data) | manual |
| `.opencode/commands/scripts/validate-command-references.cjs` | `.opencode/commands/scripts/validate-command-references.cjs:13` | 14 | `// ([runtime_agent_path]/<name>.md), literal skill-asset paths (.opencode/skills/**),` | source code (authored) | mechanical |
| `.opencode/commands/speckit/README.txt` | `.opencode/commands/speckit/README.txt:53` | 7 | `- **The generated trigger index**, read by `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/loo...` | source code (authored) | mechanical |
| `.opencode/commands/speckit/assets/speckit-complete.yaml` | `.opencode/commands/speckit/assets/speckit-complete.yaml:7` | 65 | `#   `.opencode/skills/system-spec-kit/shared/predicates/boolean-expr.ts`.` | source code (authored) | mechanical |
| `.opencode/commands/speckit/assets/speckit-implement.yaml` | `.opencode/commands/speckit/assets/speckit-implement.yaml:31` | 33 | `default: .opencode/agents` | source code (authored) | mechanical |
| `.opencode/commands/speckit/assets/speckit-plan.yaml` | `.opencode/commands/speckit/assets/speckit-plan.yaml:7` | 43 | `#   `.opencode/skills/system-spec-kit/shared/predicates/boolean-expr.ts`.` | source code (authored) | mechanical |
| `.opencode/commands/speckit/assets/speckit-resume-auto.yaml` | `.opencode/commands/speckit/assets/speckit-resume-auto.yaml:57` | 8 | `roots: ["specs/", ".opencode/specs/"]` | source code (authored) | mechanical |
| `.opencode/commands/speckit/assets/speckit-resume-confirm.yaml` | `.opencode/commands/speckit/assets/speckit-resume-confirm.yaml:57` | 8 | `roots: ["specs/", ".opencode/specs/"]` | source code (authored) | mechanical |
| `.opencode/commands/speckit/assets/speckit-save-context-tail.yaml` | `.opencode/commands/speckit/assets/speckit-save-context-tail.yaml:12` | 3 | `command: Read(".opencode/skills/system-spec-kit/SKILL.md")` | source code (authored) | mechanical |
### Map C documentation classes: opencode:commands (45 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| other documentation | 33 | 5 | 223 | manual | classify by hand | `.opencode/commands/agent-router.md`; `.opencode/commands/create/agent.md`; `.opencode/commands/create/benchmark.md` |
| assets | 8 | 33 | 172 | mechanical | templates and prompt assets; rewrite paths | `.opencode/commands/deep/assets/compiled/README.md`; `.opencode/commands/deep/assets/compiled/deep-ai-council.contract.md`; `.opencode/commands/deep/assets/compiled/deep-research.contract.md` |
| top-level skill doc | 3 | 19 | 11 | mechanical | load-bearing doc; rewrite paths | `.opencode/commands/doctor/scripts/README.md`; `.opencode/commands/scripts/README.md`; `.opencode/commands/scripts/fixtures/README.md` |
| historical record (changelog) | 1 | 0 | 7 | freeze | may keep historical paths | `.opencode/commands/create/changelog.md` |
### Map C code rows: opencode:agents (1 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/agents/README.txt` | `.opencode/agents/README.txt:11` | 1 | `Translation contract: .opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-cro...` | source code (authored) | mechanical |
### Map C documentation classes: opencode:agents (12 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| other documentation | 12 | 8 | 155 | manual | classify by hand | `.opencode/agents/ai-council.md`; `.opencode/agents/code.md`; `.opencode/agents/context.md` |
### Map C code rows: opencode:hooks (33 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | `.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs:26` | 2 | `// hub-relative path segment under .opencode/skills/ used to resolve SKILL.md — both` | source code (authored) | mechanical |
| `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs:63` | 1 | `const skillMd = path.join(projectDir, '.opencode', 'skills', match.packetPath, 'SKILL.md');` | source code (authored) | mechanical |
| `.opencode/hooks/dispatch/cursor/dispatch-preflight-lint.mjs` | `.opencode/hooks/dispatch/cursor/dispatch-preflight-lint.mjs:26` | 1 | `const LINT_SCRIPT_RELATIVE = '.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs';` | source code (authored) | mechanical |
| `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs:66` | 1 | `const skillMd = path.join(projectDir, '.opencode', 'skills', match.packetPath, 'SKILL.md');` | source code (authored) | mechanical |
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:574` | 1 | `export const DEFAULT_LOG_RELATIVE_PATH = '.opencode/logs/cli-dispatch-audit.log';` | source code (authored) | mechanical |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:110` | 6 | `claude: '.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs',` | test code | mechanical |
| `.opencode/hooks/dispatch/pi/dispatch-audit.ts` | `.opencode/hooks/dispatch/pi/dispatch-audit.ts:7` | 2 | `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";` | source code (authored) | mechanical |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:7` | 6 | `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";` | source code (authored) | mechanical |
| `.opencode/hooks/git/install-hooks.sh` | `.opencode/hooks/git/install-hooks.sh:7` | 3 | `# .opencode/scripts/install-git-hooks.sh is the primary installer for this` | source code (authored) | mechanical |
| `.opencode/hooks/git/pre-commit` | `.opencode/hooks/git/pre-commit:3` | 9 | `# The installed Git hook is .opencode/scripts/git-hooks/pre-commit.` | source code (authored) | mechanical |
| `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` | `.opencode/hooks/goal/cursor/goal-cursor.test.mjs:7` | 2 | `// ║          so the real `.opencode/skills/.state/goal/` tree is never       ║` | test code | mechanical |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | `.opencode/hooks/goal/cursor/goal-inject.mjs:87` | 1 | `recordCommand: `node .opencode/hooks/goal/bin/goal.cjs resent --runtime cursor --session ${JSON.stringify(s...` | source code (authored) | mechanical |
| `.opencode/hooks/goal/devin/goal-inject.mjs` | `.opencode/hooks/goal/devin/goal-inject.mjs:73` | 1 | `recordCommand: `node .opencode/hooks/goal/bin/goal.cjs resent --runtime devin --session ${JSON.stringify(se...` | source code (authored) | mechanical |
| `.opencode/hooks/goal/lib/goal-core.cjs` | `.opencode/hooks/goal/lib/goal-core.cjs:43` | 2 | `const STATE_SUBDIR = '.opencode/skills/.state/goal';` | source code (authored) | mechanical |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | `.opencode/hooks/goal/lib/goal-core.test.cjs:8` | 6 | `// ║          `.opencode/skills/.state/goal/` tree is never touched.          ║` | test code | mechanical |
| `.opencode/hooks/goal/lib/goal-slice.cjs` | `.opencode/hooks/goal/lib/goal-slice.cjs:26` | 2 | `const BUDGET_MANIFEST = '.opencode/skills/system-spec-kit/templates/spec-kit-docs.json';` | source code (authored) | mechanical |
| `.opencode/hooks/goal/lib/goal-slice.test.cjs` | `.opencode/hooks/goal/lib/goal-slice.test.cjs:201` | 1 | `const manifestDir = join(workspace, '.opencode', 'skills', 'system-spec-kit', 'templates');` | test code | mechanical |
| `.opencode/hooks/goal/pi/goal-context.ts` | `.opencode/hooks/goal/pi/goal-context.ts:20` | 2 | `const DISCOVERY_CORE_PATH = "../../.opencode/hooks/goal/lib/goal-core.cjs";` | source code (authored) | mechanical |
| `.opencode/hooks/goal/pi/goal-pi.test.mjs` | `.opencode/hooks/goal/pi/goal-pi.test.mjs:411` | 1 | `assert.doesNotMatch(prompt, /node\s+\.opencode\/hooks\/goal\/bin\/goal\.cjs/);` | test code | mechanical |
| `.opencode/hooks/hook-flags.env.example` | `.opencode/hooks/hook-flags.env.example:3` | 3 | `#   cp .opencode/hooks/hook-flags.env.example .opencode/hooks/hook-flags.env` | source code (authored) | mechanical |
| `.opencode/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | `.opencode/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:37` | 1 | `const GUARD_SCRIPT_RELATIVE = '.opencode/hooks/mcp-route-guard/claude/mcp-route-guard.cjs';` | source code (authored) | mechanical |
| `.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts` | `.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts:6` | 2 | `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";` | source code (authored) | mechanical |
| `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs:23` | 2 | `//                 "command": "bash -c 'cd \"...repo...\" && node .opencode/hooks/post-edit-quality/claude/...` | source code (authored) | mechanical |
| `.opencode/hooks/post-edit-quality/codex/post-edit-quality.cjs` | `.opencode/hooks/post-edit-quality/codex/post-edit-quality.cjs:78` | 1 | `process.stdout.write('See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4\n');` | source code (authored) | mechanical |
| `.opencode/hooks/post-edit-quality/devin/post-edit-quality.cjs` | `.opencode/hooks/post-edit-quality/devin/post-edit-quality.cjs:63` | 1 | `'See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4',` | source code (authored) | mechanical |
| `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:36` | 9 | `commentHygiene: '.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh',` | source code (authored) | mechanical |
| `.opencode/hooks/post-edit-quality/pi/post-edit-quality.ts` | `.opencode/hooks/post-edit-quality/pi/post-edit-quality.ts:8` | 2 | `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";` | source code (authored) | mechanical |
| `.opencode/hooks/shared/hook-adapter-shared.cjs` | `.opencode/hooks/shared/hook-adapter-shared.cjs:5` | 1 | `// every CommonJS runtime hook adapter under .opencode/hooks/. A` | source code (authored) | mechanical |
| `.opencode/hooks/shared/hook-flags.sh` | `.opencode/hooks/shared/hook-flags.sh:3` | 2 | `# Usage:  . "<repo>/.opencode/hooks/shared/hook-flags.sh"; hook_enabled <concern> \|\| exit 0` | source code (authored) | mechanical |
| `.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | `.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs:42` | 1 | `const GUARD_SCRIPT_RELATIVE = '.opencode/hooks/task-dispatch/claude/task-dispatch-guard.cjs';` | source code (authored) | mechanical |
| `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` | `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:41` | 2 | `const REGISTRY_RELATIVE_PATH = '.opencode/skills/system-deep-loop/mode-registry.json';` | source code (authored) | mechanical |
| `.opencode/hooks/task-dispatch/pi/task-dispatch-guard.ts` | `.opencode/hooks/task-dispatch/pi/task-dispatch-guard.ts:8` | 2 | `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";` | source code (authored) | mechanical |
| `.opencode/hooks/vitest.config.ts` | `.opencode/hooks/vitest.config.ts:10` | 2 | `const OPENCODE_ROOT = path.join(REPO_ROOT, '.opencode');` | source code (authored) | mechanical |
### Map C documentation classes: opencode:hooks (21 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 19 | 69 | 128 | mechanical | load-bearing doc; rewrite paths | `.opencode/hooks/README.md`; `.opencode/hooks/codex-watchdog/README.md`; `.opencode/hooks/completion/README.md` |
| other documentation | 2 | 9 | 24 | manual | classify by hand | `.opencode/hooks/goal/goal-plugin.md`; `.opencode/hooks/injection-contract.md` |
### Map C code rows: opencode:plugins (27 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/plugins/cli-dispatch-audit.js` | `.opencode/plugins/cli-dispatch-audit.js:27` | 3 | `// The audit core lives outside .opencode/plugins/ so this file can remain a thin,` | source code (authored) | mechanical |
| `.opencode/plugins/codex-hooks-watchdog.js` | `.opencode/plugins/codex-hooks-watchdog.js:23` | 3 | `const WARN_LOG_RELATIVE = join('.opencode', 'logs', 'codex-hooks-watchdog.log');` | source code (authored) | mechanical |
| `.opencode/plugins/lib/opencode-message-identity.js` | `.opencode/plugins/lib/opencode-message-identity.js:23` | 1 | `const DEDUP_RECEIPT_SHADOW_ID = 'shadow.opencode-transform-dedup.v1';` | source code (authored) | mechanical |
| `.opencode/plugins/mcp-route-guard.js` | `.opencode/plugins/mcp-route-guard.js:33` | 1 | `const WARN_LOG_RELATIVE = join('.opencode', 'logs', 'mcp-route-guard.log');` | source code (authored) | mechanical |
| `.opencode/plugins/session-cleanup.js` | `.opencode/plugins/session-cleanup.js:31` | 6 | `const CLEANUP_SCRIPT = join(REPO_ROOT, '.opencode/scripts/session-cleanup.sh');` | source code (authored) | mechanical |
| `.opencode/plugins/sk-code-post-edit-quality.js` | `.opencode/plugins/sk-code-post-edit-quality.js:33` | 1 | `const LOG_RELATIVE = join('.opencode', 'logs', 'post-edit-quality.log');` | source code (authored) | mechanical |
| `.opencode/plugins/sk-git-preflight-advisory.js` | `.opencode/plugins/sk-git-preflight-advisory.js:88` | 1 | `const skillMdPath = join(projectDir, '.opencode', 'skills', 'sk-git', 'SKILL.md');` | source code (authored) | mechanical |
| `.opencode/plugins/system-completion-sentinel.js` | `.opencode/plugins/system-completion-sentinel.js:23` | 1 | `// The sentinel core lives outside .opencode/plugins/ so this file can remain a` | source code (authored) | mechanical |
| `.opencode/plugins/system-deep-loop-guard.js` | `.opencode/plugins/system-deep-loop-guard.js:25` | 1 | `// The guard policy lives outside .opencode/plugins/ so this file can remain a` | source code (authored) | mechanical |
| `.opencode/plugins/system-dist-freshness-guard.js` | `.opencode/plugins/system-dist-freshness-guard.js:35` | 1 | `const WARN_LOG_RELATIVE = join('.opencode', 'logs', 'dist-freshness-guard.log');` | source code (authored) | mechanical |
| `.opencode/plugins/system-skill-advisor.js` | `.opencode/plugins/system-skill-advisor.js:184` | 1 | `const SKILL_ROOT_RELATIVE_PATH = join('.opencode', 'skills');` | source code (authored) | mechanical |
| `.opencode/plugins/system-spec-gate.js` | `.opencode/plugins/system-spec-gate.js:24` | 2 | `// The guard policy lives outside .opencode/plugins/ so this file can remain a` | source code (authored) | mechanical |
| `.opencode/plugins/system-speckit-completion.js` | `.opencode/plugins/system-speckit-completion.js:23` | 1 | `// The completion-state core lives outside .opencode/plugins/ so this file can` | source code (authored) | mechanical |
| `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs` | `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:25` | 5 | `const GUARD_LOG_RELATIVE = ['.opencode', 'skills', '.state', 'loop-guard', 'guard-warnings.log'];` | test code | mechanical |
| `.opencode/plugins/tests/goal-doc-contract.test.cjs` | `.opencode/plugins/tests/goal-doc-contract.test.cjs:25` | 21 | `'.opencode/hooks/goal/README.md',` | test code | mechanical |
| `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs` | `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs:52` | 2 | `const emptyHistory = await plugin.tool.opencode_goal.execute({ action: 'history' }, {});` | test code | mechanical |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs:925` | 4 | `let history = await archivePlugin.tool.opencode_goal.execute({ action: 'history' }, {});` | test code | mechanical |
| `.opencode/plugins/tests/opencode-goal-state.test.cjs` | `.opencode/plugins/tests/opencode-goal-state.test.cjs:71` | 7 | `const toolSet = await plugin.tool.opencode_goal.execute(` | test code | mechanical |
| `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs` | `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs:123` | 2 | `const statusOutput = await plugin.tool.opencode_goal_status.execute({}, { sessionID: 'session-met' });` | test code | mechanical |
| `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs` | `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs:77` | 7 | `const registeredSet = await plugin.tool.opencode_goal.execute(` | test code | mechanical |
| `.opencode/plugins/tests/session-cleanup.test.cjs` | `.opencode/plugins/tests/session-cleanup.test.cjs:23` | 5 | `const PLUGIN_PATH = join(REPO_ROOT, '.opencode/plugins/session-cleanup.js');` | test code | mechanical |
| `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:30` | 14 | `const LOG_RELATIVE = ['.opencode', 'logs', 'post-edit-quality.log'];` | test code | mechanical |
| `.opencode/plugins/tests/sk-communication-projection.test.cjs` | `.opencode/plugins/tests/sk-communication-projection.test.cjs:36` | 1 | `skip: 'cli-communication-projection dist/index.js is not built — run npm ci && npm run build in .opencode/s...` | test code | mechanical |
| `.opencode/plugins/tests/system-deep-loop-guard.test.cjs` | `.opencode/plugins/tests/system-deep-loop-guard.test.cjs:23` | 6 | `const GUARD_LOG_RELATIVE = ['.opencode', 'skills', '.state', 'loop-guard', 'guard-warnings.log'];` | test code | mechanical |
| `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs` | `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs:18` | 7 | `const GUARD_LOG_RELATIVE = path.join('.opencode', 'logs', 'dist-freshness-guard.log');` | test code | mechanical |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | `.opencode/plugins/tests/system-skill-advisor.test.cjs:19` | 9 | `const PLUGIN_PATH = path.join(WORKSPACE_ROOT, '.opencode', 'plugins', 'system-skill-advisor.js');` | test code | mechanical |
| `.opencode/plugins/tests/system-spec-gate.test.cjs` | `.opencode/plugins/tests/system-spec-gate.test.cjs:294` | 1 | `return path.join(projectDir, '.opencode', 'skills', '.state', 'spec-gate', 'spec-gate-warnings.log');` | test code | mechanical |
### Map C documentation classes: opencode:plugins (3 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| test documentation/fixtures | 2 | 7 | 2 | mechanical | test-owned content; rewrite or regenerate | `.opencode/plugins/tests/README.md`; `.opencode/plugins/tests/helpers/README.md` |
| top-level skill doc | 1 | 2 | 3 | mechanical | load-bearing doc; rewrite paths | `.opencode/plugins/README.md` |
### Map C code rows: opencode:bin (27 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/bin/check-git-hooks.sh` | `.opencode/bin/check-git-hooks.sh:9` | 8 | `# versioned hook under .opencode/scripts/git-hooks/ has no matching effective` | source code (authored) | mechanical |
| `.opencode/bin/check-no-spec-imports.cjs` | `.opencode/bin/check-no-spec-imports.cjs:4` | 9 | `// Durable guard: no runtime code may require or import from `.opencode/specs`.` | source code (authored) | mechanical |
| `.opencode/bin/compiled-route-guard.cjs` | `.opencode/bin/compiled-route-guard.cjs:38` | 2 | `const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');` | source code (authored) | mechanical |
| `.opencode/bin/compiled-route-status.cjs` | `.opencode/bin/compiled-route-status.cjs:47` | 2 | `const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');` | source code (authored) | mechanical |
| `.opencode/bin/compiled-route-sync.cjs` | `.opencode/bin/compiled-route-sync.cjs:21` | 7 | `//               `.opencode/specs` while every hub still resolves (the move` | source code (authored) | mechanical |
| `.opencode/bin/compiled-routing-foundation.vitest.ts` | `.opencode/bin/compiled-routing-foundation.vitest.ts:8` | 4 | `//   - the promoted serving path reads nothing under .opencode/specs` | test code | mechanical |
| `.opencode/bin/git-live-follow.sh` | `.opencode/bin/git-live-follow.sh:34` | 5 | `# Kill switches (see .opencode/hooks/shared/hook-flags.sh):` | source code (authored) | mechanical |
| `.opencode/bin/git-primary-reconcile.sh` | `.opencode/bin/git-primary-reconcile.sh:125` | 2 | `PUSH_FIX="node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix"` | source code (authored) | mechanical |
| `.opencode/bin/git-sync.sh` | `.opencode/bin/git-sync.sh:84` | 3 | `PUSH_FIX="After inspection: SPECKIT_ALLOW_MASS_DELETION=1 bash .opencode/bin/git-sync.sh --live $LIVE"` | source code (authored) | mechanical |
| `.opencode/bin/hf-model-server.cjs` | `.opencode/bin/hf-model-server.cjs:75` | 1 | `return path.join(repoRoot(), '.opencode', 'skills', 'system-spec-kit');` | source code (authored) | mechanical |
| `.opencode/bin/install-codex-hooks.mjs` | `.opencode/bin/install-codex-hooks.mjs:9` | 4 | `//   node .opencode/bin/install-codex-hooks.mjs [--repo <path>]` | source code (authored) | mechanical |
| `.opencode/bin/lib/compiled-route-manifest.cjs` | `.opencode/bin/lib/compiled-route-manifest.cjs:503` | 1 | `realCanonicalRoot = fs.realpathSync(path.join(REPO_ROOT, '.opencode', 'skills', hubId));` | source code (authored) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` | `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:36` | 2 | `if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;` | source code (authored) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs` | `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs:44` | 2 | `if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;` | source code (authored) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs` | `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs:30` | 2 | `if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;` | source code (authored) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` | `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:41` | 2 | `if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;` | source code (authored) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/harness/build-artifacts.cjs` | `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/harness/build-artifacts.cjs:34` | 2 | `if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;` | source code (authored) | mechanical |
| `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json` | `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json:4` | 1 | `"runtimeRoot": ".opencode/bin/lib/compiled-routing",` | source code (authored) | mechanical |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | `.opencode/bin/lib/launcher-ipc-bridge.cjs:98` | 1 | `: path.join(root, '.opencode', 'skills', 'system-skill-advisor', 'runtime', 'database');` | source code (authored) | mechanical |
| `.opencode/bin/lib/model-server-supervision.cjs` | `.opencode/bin/lib/model-server-supervision.cjs:23` | 2 | `const defaultOpencodeDir = path.join(defaultRoot, '.opencode');` | source code (authored) | mechanical |
| `.opencode/bin/mcp-code-mode-launcher.cjs` | `.opencode/bin/mcp-code-mode-launcher.cjs:22` | 1 | `'.opencode',` | source code (authored) | mechanical |
| `.opencode/bin/relink-local-specs.sh` | `.opencode/bin/relink-local-specs.sh:17` | 1 | `REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"          # .opencode/bin -> repo root` | source code (authored) | mechanical |
| `.opencode/bin/system-skill-advisor-launcher.cjs` | `.opencode/bin/system-skill-advisor-launcher.cjs:24` | 1 | `const opencodeDir = path.join(root, '.opencode');` | source code (authored) | mechanical |
| `.opencode/bin/tests/compiled-route-manifest.test.cjs` | `.opencode/bin/tests/compiled-route-manifest.test.cjs:41` | 9 | `const CLI_PATH = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route-manifest.cjs');` | test code | mechanical |
| `.opencode/bin/tests/fixtures/no-spec-import/negative/clean-runtime.cjs` | `.opencode/bin/tests/fixtures/no-spec-import/negative/clean-runtime.cjs:5` | 1 | `// module, never anything under `.opencode/specs`.` | test fixture (hand-authored data) | manual |
| `.opencode/bin/worktree-guard.sh` | `.opencode/bin/worktree-guard.sh:13` | 4 | `#   bash /abs/path/.opencode/bin/worktree-guard.sh` | source code (authored) | mechanical |
| `.opencode/bin/worktree-session.sh` | `.opencode/bin/worktree-session.sh:82` | 7 | `.opencode/skills/system-spec-kit/node_modules` | source code (authored) | mechanical |
### Map C documentation classes: opencode:bin (2 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 2 | 19 | 17 | mechanical | load-bearing doc; rewrite paths | `.opencode/bin/README.md`; `.opencode/bin/lib/README.md` |
### Map C code rows: opencode:scripts (20 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/scripts/check-vendored-fork-provenance.mjs` | `.opencode/scripts/check-vendored-fork-provenance.mjs:7` | 1 | `const RECORD_PATH = join(ROOT, ".opencode/scripts/vendored-fork-provenance.json");` | source code (authored) | mechanical |
| `.opencode/scripts/copy-skill-advisor-dist-data.sh` | `.opencode/scripts/copy-skill-advisor-dist-data.sh:10` | 3 | `#   bash .opencode/scripts/copy-skill-advisor-dist-data.sh` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/commit-msg` | `.opencode/scripts/git-hooks/commit-msg:5` | 1 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` | `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh:34` | 2 | `mkdir -p "$root/.opencode/logs" 2>/dev/null \|\| true` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/post-commit` | `.opencode/scripts/git-hooks/post-commit:7` | 7 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/post-merge` | `.opencode/scripts/git-hooks/post-merge:8` | 4 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/post-rewrite` | `.opencode/scripts/git-hooks/post-rewrite:9` | 4 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/pre-commit` | `.opencode/scripts/git-hooks/pre-commit:9` | 43 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/pre-push` | `.opencode/scripts/git-hooks/pre-push:23` | 19 | `# Allowlist file:         .opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/prepare-commit-msg` | `.opencode/scripts/git-hooks/prepare-commit-msg:16` | 3 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | source code (authored) | mechanical |
| `.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh` | `.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh:43` | 6 | `mkdir -p "$T/.opencode/scripts/git-hooks/lib"` | test code | mechanical |
| `.opencode/scripts/git-hooks/tests/commit-msg.test.sh` | `.opencode/scripts/git-hooks/tests/commit-msg.test.sh:20` | 1 | `HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/commit-msg"` | test code | mechanical |
| `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` | `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh:15` | 5 | `INSTALLER="$SOURCE_REPO/.opencode/scripts/install-git-hooks.sh"` | test code | mechanical |
| `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` | `.opencode/scripts/git-hooks/tests/pre-commit.test.sh:24` | 25 | `HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/pre-commit"` | test code | mechanical |
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | `.opencode/scripts/git-hooks/tests/pre-push.test.sh:19` | 14 | `HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/pre-push"` | test code | mechanical |
| `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh` | `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh:24` | 6 | `HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/prepare-commit-msg"` | test code | mechanical |
| `.opencode/scripts/install-git-hooks.sh` | `.opencode/scripts/install-git-hooks.sh:2` | 6 | `# Install repository git hooks shipped under .opencode/scripts/git-hooks/.` | source code (authored) | mechanical |
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist:12` | 2 | `cp .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist \` | source code (authored) | mechanical |
| `.opencode/scripts/run-node-tests.mjs` | `.opencode/scripts/run-node-tests.mjs:11` | 7 | `// Run: node .opencode/scripts/run-node-tests.mjs [--list]` | source code (authored) | mechanical |
| `.opencode/scripts/session-cleanup.sh` | `.opencode/scripts/session-cleanup.sh:33` | 2 | `if [ -n "$__hf_root" ] && [ -r "$__hf_root/.opencode/hooks/shared/hook-flags.sh" ]; then` | source code (authored) | mechanical |
### Map C documentation classes: opencode:scripts (5 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 4 | 27 | 6 | mechanical | load-bearing doc; rewrite paths | `.opencode/scripts/README.md`; `.opencode/scripts/git-hooks/README.md`; `.opencode/scripts/git-hooks/lib/README.md` |
| test documentation/fixtures | 1 | 7 | 0 | mechanical | test-owned content; rewrite or regenerate | `.opencode/scripts/git-hooks/tests/README.md` |
### Map C code rows: opencode:install-guides (0 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
### Map C documentation classes: opencode:install-guides (2 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 2 | 43 | 41 | mechanical | load-bearing doc; rewrite paths | `.opencode/install-guides/README.md`; `.opencode/install-guides/install-scripts/README.md` |
### Map C code rows: opencode:logs (0 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
### Map C documentation classes: opencode:logs (1 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 1 | 2 | 5 | mechanical | load-bearing doc; rewrite paths | `.opencode/logs/README.md` |
### Map C code rows: opencode:package-lock.json (1 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/package-lock.json` | `.opencode/package-lock.json:2` | 2 | `"name": ".opencode",` | generated: package manager | regenerate |
### Map C documentation classes: opencode:package-lock.json (0 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
### Map C code rows: root (4 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.env.example` | `.env.example:19` | 2 | `#     .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | source code (authored) | mechanical |
| `.gitignore` | `.gitignore:7` | 62 | `# The global ~/.gitignore_global ignores /.opencode/ for symlinked repos.` | source code (authored) | mechanical |
| `.utcp_config.json` | `.utcp_config.json:147` | 1 | `"command": "node .opencode/bin/magicpath-utcp-manual.cjs",` | source code (authored) | mechanical |
| `opencode.json` | `opencode.json:15` | 1 | `".opencode/bin/mcp-code-mode-launcher.cjs"` | source code (authored) | mechanical |
### Map C documentation classes: root (4 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| other documentation | 4 | 22 | 75 | manual | classify by hand | `AGENTS.md`; `CONTRIBUTING.md`; `PUBLIC-RELEASE.md` |
### Map C code rows: ci (20 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.github/dependabot.yml` | `.github/dependabot.yml:13` | 1 | `- "/.opencode/**"` | source code (authored) | mechanical |
| `.github/workflows/advisory-checks.yml` | `.github/workflows/advisory-checks.yml:30` | 2 | `RUNNER=".opencode/scripts/run-node-tests.mjs"` | source code (authored) | mechanical |
| `.github/workflows/agent-mirror-sync.yml` | `.github/workflows/agent-mirror-sync.yml:17` | 1 | `CHECKER=".opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs"` | source code (authored) | mechanical |
| `.github/workflows/changed-packet-validation.yml` | `.github/workflows/changed-packet-validation.yml:37` | 7 | `npm --prefix .opencode/skills/system-spec-kit ci` | source code (authored) | mechanical |
| `.github/workflows/chart-corpus.yml` | `.github/workflows/chart-corpus.yml:7` | 4 | `- '.opencode/skills/sk-design/sk-design-chart/**'` | source code (authored) | mechanical |
| `.github/workflows/command-tree-parity.yml` | `.github/workflows/command-tree-parity.yml:29` | 2 | `npm --prefix .opencode/skills/system-spec-kit ci` | source code (authored) | mechanical |
| `.github/workflows/comment-hygiene.yml` | `.github/workflows/comment-hygiene.yml:17` | 2 | `CHECKER=".opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"` | source code (authored) | mechanical |
| `.github/workflows/diagram-corpus.yml` | `.github/workflows/diagram-corpus.yml:7` | 5 | `- '.opencode/skills/sk-design/sk-design-diagram/**'` | source code (authored) | mechanical |
| `.github/workflows/dispatch-enforcement-guard.yml` | `.github/workflows/dispatch-enforcement-guard.yml:31` | 3 | `SUITE=".opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs"` | source code (authored) | mechanical |
| `.github/workflows/markdown-link-integrity.yml` | `.github/workflows/markdown-link-integrity.yml:7` | 4 | `- '.opencode/skills/**'` | source code (authored) | mechanical |
| `.github/workflows/naming-standard-guard.yml` | `.github/workflows/naming-standard-guard.yml:45` | 3 | `python3 .opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py \` | source code (authored) | mechanical |
| `.github/workflows/playbook-operator-contract.yml` | `.github/workflows/playbook-operator-contract.yml:28` | 8 | `npm --prefix .opencode/skills/system-spec-kit ci` | source code (authored) | mechanical |
| `.github/workflows/prompt-card-sync.yml` | `.github/workflows/prompt-card-sync.yml:15` | 1 | `GUARD=".opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh"` | source code (authored) | mechanical |
| `.github/workflows/repo-rules-corpus.yml` | `.github/workflows/repo-rules-corpus.yml:8` | 2 | `- '.opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs'` | source code (authored) | mechanical |
| `.github/workflows/routing-registry-drift.yml` | `.github/workflows/routing-registry-drift.yml:17` | 54 | `# and command-metadata.json do not. See .opencode/scripts/git-hooks/pre-commit,` | source code (authored) | mechanical |
| `.github/workflows/rule-canary-sync.yml` | `.github/workflows/rule-canary-sync.yml:17` | 1 | `CANARY=".opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.js"` | source code (authored) | mechanical |
| `.github/workflows/runtime-no-spec-import.yml` | `.github/workflows/runtime-no-spec-import.yml:7` | 7 | `# `.opencode/specs`, so the coupling cannot silently return.` | source code (authored) | mechanical |
| `.github/workflows/skill-doc-frontmatter.yml` | `.github/workflows/skill-doc-frontmatter.yml:8` | 3 | `- '.opencode/skills/**/references/**'` | source code (authored) | mechanical |
| `.github/workflows/spec-kit-check.yml` | `.github/workflows/spec-kit-check.yml:7` | 33 | `- '.opencode/skills/system-spec-kit/**'` | source code (authored) | mechanical |
| `.github/workflows/strict-pass-freshness-report.yml` | `.github/workflows/strict-pass-freshness-report.yml:43` | 6 | `npm --prefix .opencode/skills/system-spec-kit ci` | source code (authored) | mechanical |
### Map C documentation classes: ci (1 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 1 | 0 | 1 | mechanical | load-bearing doc; rewrite paths | `.github/workflows/README.md` |

## Reconciliation against the seed

| Area | Seed files | Seed lines | Code rows | Doc files | Unmapped |
|---|---:|---:|---:|---:|---|
| `opencode:commands` | 148 | 2,192 | 103 | 45 | none |
| `opencode:agents` | 13 | 164 | 1 | 12 | none |
| `opencode:hooks` | 54 | 311 | 33 | 21 | none |
| `opencode:plugins` | 30 | 128 | 27 | 3 | none |
| `opencode:bin` | 29 | 122 | 27 | 2 | none |
| `opencode:scripts` | 25 | 201 | 20 | 5 | none |
| `opencode:install-guides` | 2 | 84 | 0 | 2 | none |
| `opencode:logs` | 1 | 7 | 0 | 1 | none |
| `opencode:package-lock.json` | 1 | 2 | 1 | 0 | none |
| `root` | 8 | 163 | 4 | 4 | none |
| `ci` | 21 | 150 | 20 | 1 | none |
| **Subtotal** | **332** | **3,524** | **236** | **96** | **none** |

Cumulative across all maps: Map A 435 links (410 non-root links plus root-level/MCP accounting), Map B 231 runtime files, Map C 4,258 tracked files including the Map B areas. The three maps together cover the seed with no unmapped rows.

## Classification summary for this iteration

`mechanical` 234, `manual` 4 (two command assets, the launcher compatibility decision, the git-hooks installer sequencing), `regenerate` 1 (lockfile). The `blocker` rows in this area are compositional: `PUBLIC-RELEASE.md` (published contract), `opencode.json` + the launcher (namespace/launcher), and the CI skip guards.

## What worked

- The area-agnostic generator produced the final ten tables without new rules; the construct column shows the exact literal in each file (for example the launcher's `'.opencode',` segment).
- Reconciling at the end of each area kept the running total exact: 4,258 files accounted for.

## What failed

- The generic docs rule labels the four root markdown files "manual (classify by hand)"; they are classified by hand in Finding 7 instead, and the table remains as raw material. Recorded rather than hidden.

## UNKNOWNs opened

- Whether OpenCode's plugin loader follows a `.opencode/plugins` directory symlink (phase-001 B4). Still UNKNOWN; settles with a probe, not with this map.
- Whether the CI skip guards should be repointed at `.skilled` paths or rewritten to fail closed. Phase 003's decision, named not chosen.

## Assessment
