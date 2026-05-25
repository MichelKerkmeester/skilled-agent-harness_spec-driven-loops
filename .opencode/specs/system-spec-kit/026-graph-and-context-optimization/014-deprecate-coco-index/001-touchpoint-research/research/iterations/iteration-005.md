# Iteration 005 - RQ5 4-Runtime Mirror + Configs

## Focus (RQ5)

Enumerate the FULL config + mirror surface with exact key paths, block line ranges, and the 4-runtime multiplier for every logical edit. This iteration goes deeper than iteration-001's config inventory by providing exact JSON/TOML key paths and mapping the parallel agent/command mirrors across `.opencode/`, `.claude/`, `.gemini/`, and `.codex/` runtimes.

## Config + mirror touchpoints

| File (file:line) | Key path / block | Runtime | Mutation Class | Note |
|------------------|------------------|---------|----------------|------|
| opencode.json:78-92 | `mcp.cocoindex_code` block (type, command, environment) | opencode | EDIT-remove-ref | Full MCP server registration block; environment includes _NOTE_8/_NOTE_9 about rerank-sidecar opt-in (SPECKIT_CROSS_ENCODER + RERANKER_LOCAL) |
| opencode.json:36-37 | `mcp.mk-spec-memory.environment._NOTE_8_FEATURE_FLAGS` | opencode | EDIT-remove-ref | References SPECKIT_CROSS_ENCODER + RERANKER_LOCAL opt-in flags for rerank sidecar |
| opencode.json:36-37 | `mcp.mk-spec-memory.environment._NOTE_9_RERANK_OPT_IN` | opencode | EDIT-remove-ref | Documents rerank sidecar opt-in path and RERANK_SIDECAR_PORT override |
| .vscode/mcp.json:57-68 | `servers.cocoindex_code` block (command, args, env) | vscode | EDIT-remove-ref | MCP server registration for VSCode runtime |
| .gemini/settings.json:86-101 | `mcpServers.cocoindex_code` block (command, args, cwd, env) | gemini | EDIT-remove-ref | MCP server registration with RERANK_SIDECAR_PORT=8765 env var |
| .gemini/settings.json:34 | `mcpServers.mk-spec-memory.env.RERANK_SIDECAR_PORT` | gemini | EDIT-remove-ref | Rerank sidecar port in spec-memory env block |
| .gemini/settings.json:36 | `mcpServers.mk-spec-memory.env._NOTE_RERANK` | gemini | EDIT-remove-ref | Documents rerank sidecar default port and startup behavior |
| .gemini/settings.json:74 | `mcpServers.mk_code_index.env.RERANK_SIDECAR_PORT` | gemini | EDIT-remove-ref | Rerank sidecar port in code-graph env block |
| .gemini/settings.json:77 | `mcpServers.mk_code_index.env._NOTE_RERANK` | gemini | EDIT-remove-ref | Documents rerank sidecar shared port and degradation behavior |
| .codex/config.toml:53-64 | `[mcp_servers.cocoindex_code]` block (args, command, env) | codex | EDIT-remove-ref | MCP server registration with RERANK_SIDECAR_PORT="8765" env var |
| .codex/config.toml:78-90 | `[mcp_servers.mk-spec-memory.env]` RERANK_SIDECAR_PORT | codex | EDIT-remove-ref | Rerank sidecar port in spec-memory env block |
| .codex/config.toml:89 | `[mcp_servers.mk-spec-memory.env]` _NOTE_RERANK | codex | EDIT-remove-ref | Documents rerank sidecar probe and spawn behavior |
| .codex/config.toml:97-108 | `[mcp_servers.mk_code_index.env]` RERANK_SIDECAR_PORT | codex | EDIT-remove-ref | Rerank sidecar port in code-graph env block |
| .codex/config.toml:107 | `[mcp_servers.mk_code_index.env]` _NOTE_RERANK | codex | EDIT-remove-ref | Documents rerank sidecar shared port and degradation behavior |
| .opencode/agents/context.md:22 | `mcpServers` frontmatter includes "cocoindex_code" | opencode | EDIT-remove-ref | Agent MCP server registration |
| .opencode/agents/deep-review.md:253 | MCP + Code Intelligence Tools: cocoindex_code reference | opencode | EDIT-remove-ref | Agent tool reference |
| .claude/agents/context.md:4 | `mcpServers` frontmatter includes "cocoindex_code" | claude | EDIT-remove-ref | Agent MCP server registration (mirror of .opencode) |
| .claude/agents/deep-review.md:4,225 | cocoindex_code references in allowed-tools + tool list | claude | EDIT-remove-ref | Agent tool references (mirror of .opencode) |
| .claude/agents/deep-research.md:4 | cocoindex_code reference in allowed-tools | claude | EDIT-remove-ref | Agent tool reference (mirror of .opencode) |
| .claude/agents/review.md:4 | cocoindex_code reference in allowed-tools | claude | EDIT-remove-ref | Agent tool reference (mirror of .opencode) |
| .claude/agents/code.md:4 | cocoindex_code reference in allowed-tools | claude | EDIT-remove-ref | Agent tool reference (mirror of .opencode) |
| .claude/agents/debug.md:4 | cocoindex_code reference in allowed-tools | claude | EDIT-remove-ref | Agent tool reference (mirror of .opencode) |
| .gemini/agents/deep-review.md:225 | cocoindex_code reference in tool list | gemini | EDIT-remove-ref | Agent tool reference (partial mirror) |
| .codex/agents/deep-review.toml:232 | cocoindex_code reference in tool list | codex | EDIT-remove-ref | Agent tool reference (partial mirror) |
| .opencode/commands/deep/start-research-loop.md:4 | allowed-tools frontmatter: mcp__cocoindex_code__search | opencode | EDIT-remove-ref | Command tool permission |
| .opencode/commands/deep/start-review-loop.md:4 | allowed-tools frontmatter: mcp__cocoindex_code__search | opencode | EDIT-remove-ref | Command tool permission |
| .opencode/commands/deep/ask-ai-council.md:5 | allowed-tools frontmatter: mcp__cocoindex_code__search | opencode | EDIT-remove-ref | Command tool permission |
| .claude/commands/deep/start-research-loop.md:4 | allowed-tools frontmatter: mcp__cocoindex_code__search | claude | EDIT-remove-ref | Command tool permission (mirror of .opencode) |
| .claude/commands/deep/start-review-loop.md:4 | allowed-tools frontmatter: mcp__cocoindex_code__search | claude | EDIT-remove-ref | Command tool permission (mirror of .opencode) |
| .claude/commands/deep/ask-ai-council.md:5 | allowed-tools frontmatter: mcp__cocoindex_code__search | claude | EDIT-remove-ref | Command tool permission (mirror of .opencode) |
| .gemini/commands/deep/start-research-loop.toml:2 | allowed-tools includes mcp__cocoindex_code__search | gemini | EDIT-remove-ref | Command tool permission (TOML format) |
| .gemini/commands/deep/start-review-loop.toml:5 | allowed-tools includes mcp__cocoindex_code__search | gemini | EDIT-remove-ref | Command tool permission (TOML format) |
| .gemini/commands/deep/ask-ai-council.toml:5 | allowed-tools includes mcp__cocoindex_code__search | gemini | EDIT-remove-ref | Command tool permission (TOML format) |
| .opencode/commands/doctor/scripts/mcp-doctor.sh:16,50,62,291-295,331-339,795,830 | ccc, cocoindex, cocoindex_code references | opencode | EDIT-remove-ref | Doctor script checks for CCC CLI and cocoindex |
| .claude/commands/doctor/scripts/mcp-doctor.sh:16,50,62,291-295,331-339,795,830 | ccc, cocoindex, cocoindex_code references | claude | EDIT-remove-ref | Doctor script checks (mirror of .opencode) |
| .opencode/commands/doctor/assets/doctor_mcp_install.yaml:162-172 | cco MCP install guidance | opencode | EDIT-remove-ref | Doctor asset for cocoindex MCP installation |
| .claude/commands/doctor/assets/doctor_mcp_install.yaml:162-172 | ccc MCP install guidance | claude | EDIT-remove-ref | Doctor asset (mirror of .opencode) |
| .opencode/commands/doctor/assets/doctor_cocoindex.yaml:1-236 | Entire cocoindex doctor workflow | opencode | DELETE | Doctor workflow for cocoindex diagnostics |
| .claude/commands/doctor/assets/doctor_cocoindex.yaml:1-236 | Entire cocoindex doctor workflow | claude | DELETE | Doctor workflow (mirror of .opencode) |
| .opencode/commands/doctor/_routes.yaml:73,106-107,111,117-119,129 | cocoindex route entries | opencode | EDIT-remove-ref | Doctor routing manifest for cocoindex target |
| .claude/commands/doctor/_routes.yaml:73,106-107,111,117-119,129 | cocoindex route entries | claude | EDIT-remove-ref | Doctor routing (mirror of .opencode) |
| .opencode/commands/doctor/speckit.md:4,49,63,107,119,137,159,161,209,214,260,274,308 | cocoindex references in speckit doctor | opencode | EDIT-remove-ref | Speckit doctor documentation for cocoindex |
| .claude/commands/doctor/speckit.md:4,49,63,107,119,137,159,161,209,214,260,274,308 | cocoindex references in speckit doctor | claude | EDIT-remove-ref | Speckit doctor (mirror of .opencode) |
| .opencode/commands/doctor/update.md:4,221,294,337,360,371 | cocoindex references in update workflow | opencode | EDIT-remove-ref | Update workflow includes cocoindex rebuild step |
| .claude/commands/doctor/update.md:4,221,294,337,360,371 | cocoindex references in update workflow | claude | EDIT-remove-ref | Update workflow (mirror of .opencode) |
| .opencode/commands/doctor/assets/doctor_update.yaml:297,299,304-305,393,480 | cocoindex references in update YAML | opencode | EDIT-remove-ref | Update YAML includes cocoindex subsystem |
| .claude/commands/doctor/assets/doctor_update.yaml:297,299,304-305,393,480 | cocoindex references in update YAML | claude | EDIT-remove-ref | Update YAML (mirror of .opencode) |
| .opencode/commands/speckit/*.md (plan, complete, implement, resume) | cocoindex_code in allowed-tools frontmatter | opencode | EDIT-remove-ref | Speckit commands reference cocoindex |
| .claude/commands/speckit/*.md (plan, complete, implement, resume) | cocoindex_code in allowed-tools frontmatter | claude | EDIT-remove-ref | Speckit commands (mirror of .opencode) |
| .opencode/commands/speckit/assets/*.yaml (auto/confirm variants) | cocoindex_code in tool lists | opencode | EDIT-remove-ref | Speckit YAML assets reference cocoindex |
| .claude/commands/speckit/assets/*.yaml (auto/confirm variants) | cocoindex_code in tool lists | claude | EDIT-remove-ref | Speckit YAML assets (mirror of .opencode) |
| .gemini/commands/speckit/*.toml (plan, complete, implement, resume) | cocoindex_code in allowed-tools | gemini | EDIT-remove-ref | Speckit commands (TOML format, partial mirror) |
| .opencode/commands/create/*.md (skill, sk-skill, agent, feature-catalog, testing-playbook, folder_readme, changelog, prompt) | cocoindex_code in allowed-tools frontmatter | opencode | EDIT-remove-ref | Create commands reference cocoindex |
| .claude/commands/create/*.md (skill, sk-skill, agent, feature-catalog, testing-playbook, folder_readme, changelog, prompt) | cocoindex_code in allowed-tools frontmatter | claude | EDIT-remove-ref | Create commands (mirror of .opencode) |
| .gemini/commands/create/*.toml (skill, feature-catalog, testing-playbook, folder_readme, changelog, agent) | cocoindex_code in allowed-tools | gemini | EDIT-remove-ref | Create commands (TOML format, partial mirror) |
| .opencode/commands/memory/search.md:116 | cocoindex_code reference | opencode | EDIT-remove-ref | Memory search command references cocoindex |
| .claude/commands/memory/search.md:116 | cocoindex_code reference | claude | EDIT-remove-ref | Memory search (mirror of .opencode) |
| .gemini/commands/memory/search.toml:2 | cocoindex_code reference | gemini | EDIT-remove-ref | Memory search (TOML format, partial mirror) |
| README.md:35 | TOC: "COCOINDEX + CODE GRAPH" section | root | EDIT-remove-ref | README table of contents |
| README.md:70 | Feature table: CocoIndex Code description | root | EDIT-remove-ref | README feature overview |
| README.md:109 | MCP table: cocoindex_code semantic search | root | EDIT-remove-ref | README MCP server table |
| README.md:615 | CocoIndex fork explanation | root | EDIT-remove-ref | README fork attribution |
| README.md:671-674 | System comparison table: CocoIndex + CCC utilities | root | EDIT-remove-ref | README system comparison |
| README.md:901-903 | mcp-coco-index skill description | root | EDIT-remove-ref | README skill description |
| README.md:1188 | /doctor router: cocoindex subsystem | root | EDIT-remove-ref | README doctor subsystem list |
| README.md:1201 | /doctor:update: cocoindex rebuild step | root | EDIT-remove-ref | README update workflow |
| README.md:1236-1238 | MCP tool count: cocoindex_code 2 tools | root | EDIT-remove-ref | README MCP tool breakdown |
| README.md:1393-1395 | opencode.json example: cocoindex_code block | root | EDIT-remove-ref | README config example |
| README.md:1484 | FAQ: cocoindex_code tool count | root | EDIT-remove-ref | README FAQ answer |
| .opencode/install_guides/README.md:327 | MCP server table: CocoIndex Code | opencode | EDIT-remove-ref | Install guide MCP server table |
| .opencode/install_guides/README.md:708 | Code graph tool count includes ccc_* tools | opencode | EDIT-remove-ref | Install guide code graph description |
| .opencode/install_guides/README.md:736 | _NOTE_2_TOOLS mentions ccc_status/reindex/feedback | opencode | EDIT-remove-ref | Install guide env note |
| .opencode/install_guides/README.md:1089-1091 | /doctor:mcp debug checks cocoindex_code | opencode | EDIT-remove-ref | Install guide doctor command |
| .opencode/install_guides/README.md:1211 | mcp-coco-index listed as codebase-agnostic skill | opencode | EDIT-remove-ref | Install guide skill list |
| .opencode/install_guides/README.md:1291 | mcp-coco-index listed as codebase-agnostic skill | opencode | EDIT-remove-ref | Install guide customization section |
| .opencode/install_guides/README.md:1526 | /doctor:mcp debug example with cocoindex_code | opencode | EDIT-remove-ref | Install guide doctor example |
| .opencode/install_guides/README.md:1573-1574 | Skills table: mcp-coco-index listed | opencode | EDIT-remove-ref | Install guide skills table |
| .opencode/install_guides/SET-UP - AGENTS.md:510 | Skills table: mcp-coco-index description | opencode | EDIT-remove-ref | Agents setup guide skills table |
| .opencode/install_guides/SET-UP - AGENTS.md:1203 | Skills table: mcp-coco-index listed | opencode | EDIT-remove-ref | Agents setup guide skills summary |
| .opencode/install_guides/install_scripts/README.md:129 | install-cocoindex-code.sh script reference | opencode | EDIT-remove-ref | Install scripts README |
| .opencode/install_guides/install_scripts/README.md:157 | install-cocoindex-code.sh description | opencode | EDIT-remove-ref | Install scripts README table |
| .gitignore:123 | .cocoindex_code/ gitignore entry | root | EDIT-remove-ref | Gitignore for CocoIndex index directory |
| .claude/CLAUDE.md:5 | SEARCH ROUTING: CocoIndex semantic search instruction | claude | EDIT-decouple | Claude runtime routing rule (already mapped in iter-004) |

## 4-runtime mirror multiplier

| Logical edit | Physical files (count) | Runtimes |
|--------------|----------------------|----------|
| Remove cocoindex_code MCP server registration | 4 files | opencode.json, .vscode/mcp.json, .gemini/settings.json, .codex/config.toml |
| Remove RERANK_SIDECAR_PORT env vars from mk-spec-memory | 3 files | opencode.json, .gemini/settings.json, .codex/config.toml |
| Remove RERANK_SIDECAR_PORT env vars from mk_code_index | 2 files | .gemini/settings.json, .codex/config.toml |
| Remove rerank-sidecar opt-in notes (_NOTE_8/_NOTE_9) | 1 file | opencode.json (mk-spec-memory env block) |
| Remove cocoindex_code from context agent mcpServers | 2 files | .opencode/agents/context.md, .claude/agents/context.md |
| Remove cocoindex_code from deep-review agent tools | 4 files | .opencode/agents/deep-review.md, .claude/agents/deep-review.md, .gemini/agents/deep-review.md, .codex/agents/deep-review.toml |
| Remove cocoindex_code from deep-research agent tools | 2 files | .claude/agents/deep-research.md, .gemini/commands/deep/start-research-loop.toml (command mirror) |
| Remove cocoindex_code from review/code/debug agents | 3 files | .claude/agents/review.md, .claude/agents/code.md, .claude/agents/debug.md |
| Remove cocoindex_code from deep command allowed-tools | 6 files | .opencode/commands/deep/* (3 files), .claude/commands/deep/* (3 files) |
| Remove cocoindex_code from deep command allowed-tools (TOML) | 3 files | .gemini/commands/deep/*.toml (3 files) |
| Remove cocoindex_code from speckit command allowed-tools | 8 files | .opencode/commands/speckit/*.md (4 files), .claude/commands/speckit/*.md (4 files) |
| Remove cocoindex_code from speckit command allowed-tools (TOML) | 4 files | .gemini/commands/speckit/*.toml (4 files) |
| Remove cocoindex_code from create command allowed-tools | 16 files | .opencode/commands/create/*.md (8 files), .claude/commands/create/*.md (8 files) |
| Remove cocoindex_code from create command allowed-tools (TOML) | 6 files | .gemini/commands/create/*.toml (6 files) |
| Remove cocoindex_code from memory search command | 3 files | .opencode/commands/memory/search.md, .claude/commands/memory/search.md, .gemini/commands/memory/search.toml |
| Delete doctor_cocoindex.yaml workflow | 2 files | .opencode/commands/doctor/assets/doctor_cocoindex.yaml, .claude/commands/doctor/assets/doctor_cocoindex.yaml |
| Remove cocoindex from doctor routing manifest | 2 files | .opencode/commands/doctor/_routes.yaml, .claude/commands/doctor/_routes.yaml |
| Remove cocoindex from doctor speckit documentation | 2 files | .opencode/commands/doctor/speckit.md, .claude/commands/doctor/speckit.md |
| Remove cocoindex from doctor update workflow | 4 files | .opencode/commands/doctor/update.md, .claude/commands/doctor/update.md, .opencode/commands/doctor/assets/doctor_update.yaml, .claude/commands/doctor/assets/doctor_update.yaml |
| Remove cocoindex from doctor mcp-doctor.sh script | 2 files | .opencode/commands/doctor/scripts/mcp-doctor.sh, .claude/commands/doctor/scripts/mcp-doctor.sh |
| Remove cocoindex from doctor mcp install guidance | 2 files | .opencode/commands/doctor/assets/doctor_mcp_install.yaml, .claude/commands/doctor/assets/doctor_mcp_install.yaml |
| Remove cocoindex from speckit YAML assets | 8 files | .opencode/commands/speckit/assets/*.yaml (4 files), .claude/commands/speckit/assets/*.yaml (4 files) |
| Remove cocoindex from README | 1 file | README.md (14 references) |
| Remove cocoindex from install guides | 3 files | .opencode/install_guides/README.md, .opencode/install_guides/SET-UP - AGENTS.md, .opencode/install_guides/install_scripts/README.md |
| Remove .cocoindex_code/ from gitignore | 1 file | .gitignore |
| Remove CocoIndex SEARCH ROUTING from CLAUDE.md | 1 file | .claude/CLAUDE.md |

**Total physical files: ~97 files across 4 runtimes**

**Mirror pattern analysis:**
- `.opencode/` and `.claude/` have near-perfect command mirrors (49 files each with coco references)
- `.gemini/` has partial mirrors (18 files with coco references, TOML format instead of markdown)
- `.codex/` has minimal mirrors (1 agent file with coco reference, config.toml only)
- Runtime configs (opencode.json, .vscode/mcp.json, .gemini/settings.json, .codex/config.toml) all have cocoindex_code MCP blocks
- Rerank-sidecar env vars (RERANK_SIDECAR_PORT) appear in opencode.json (notes only), .gemini/settings.json, and .codex/config.toml

## Gaps for next iteration

1. **RQ6 Dependency-correct phase DAG:** With the full config + mirror inventory complete, the next iteration should focus on RQ6 — constructing the dependency-ordered deprecation phase DAG. This requires determining the correct sequence: (a) decouple system-code-graph from CocoIndex first, (b) remove MCP registrations and runtime configs, (c) delete skill folders, (d) clean up doctor workflows, (e) update documentation. Need to identify rollback points and per-phase verification gates.

2. **RQ7 Deletion completeness:** Need to enumerate deletion artifacts beyond the code files: venv directories (.opencode/skills/mcp-coco-index/mcp_server/.venv/), daemon sockets/pids (~/.cocoindex_code/ or sidecar runtime directories), HuggingFace model cache for reranker (Qwen/Qwen3-Reranker-0.6B), git hooks that might trigger CCC indexing, benchmark scripts that test CocoIndex performance, and any install/doctor scripts that have coco-specific logic.

3. **Feature catalog CCC files:** Iteration-003 noted that system-code-graph SKILL.md RESOURCE_MAP references feature_catalog CCC files (07--ccc-integration/01-ccc-reindex.md, 02-ccc-feedback.md, 03-ccc-status.md). These files need to be located and classified (DELETE vs EDIT-decouple).

4. **Runtime-specific hook configurations:** .gemini/settings.json has extensive hook configuration (SessionStart, PreCompress, BeforeAgent, SessionEnd) that may trigger cocoindex-related operations. Need to verify if any hook logic depends on CocoIndex availability.

5. **Codex agent mirror completeness:** .codex/ has only 1 agent file (deep-review.toml) with coco references, but .codex/config.toml shows 8 agents configured. Need to verify if other .codex/agents/*.toml files exist and whether they should have coco references (missing mirror vs. intentionally absent).

6. **Install script symlinks:** .opencode/install_guides/install_scripts/README.md references install-cocoindex-code.sh. Need to locate this script and determine if it's a symlink to the skill's install script or a standalone wrapper that needs deletion.
